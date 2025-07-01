package com.uade.tpo.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.uade.tpo.demo.models.objects.MetodoPagoInfo;
import com.uade.tpo.demo.models.objects.ResultadoValidacionTarjeta;
import com.uade.tpo.demo.models.objects.User;
import com.uade.tpo.demo.repository.UserRepository;
import com.uade.tpo.demo.service.interfaces.ICardValidationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class CardValidationService implements ICardValidationService {

    private final HttpClient client = HttpClient.newHttpClient();

    @Value("${mercadopago.access.token:TEST-your-access-token-here}")
    private String mercadoPagoAccessToken;

    @Autowired
    private UserRepository userRepository;

    // BINs de prueba para testing según la documentación de MercadoPago
    private static final Map<String, String> BIN_TEST_PAYMENT_METHOD = Map.of(
        "411111", "visa",
        "503175", "master",
        "376414", "amex",
        "601142", "cabal"
    );

    @Override
    public ResultadoValidacionTarjeta validarYGuardarTarjeta(Map<String, String> body) throws IOException, InterruptedException {
        String email = body.get("email");
        String cardNumber = body.get("card_number").replaceAll("\\s", "");
        int expirationMonth = Integer.parseInt(body.get("expiration_month"));
        int expirationYear = Integer.parseInt(body.get("expiration_year"));
        String securityCode = body.get("security_code");
        String cardholderName = body.get("name");
        String identificationNumber = body.get("number");

        // Paso 1: Obtener información del método de pago usando BIN
        MetodoPagoInfo metodo = obtenerMetodoPagoInfo(cardNumber);
        if (metodo == null) {
            return ResultadoValidacionTarjeta.error("No se pudo obtener el método de pago (BIN inválido)");
        }

        // Paso 2: Verificar si es un BIN de prueba y ajustar método de pago
        String bin = cardNumber.substring(0, 6);
        if (BIN_TEST_PAYMENT_METHOD.containsKey(bin)) {
            metodo = new MetodoPagoInfo(BIN_TEST_PAYMENT_METHOD.get(bin), metodo.getIssuerId());
        }

        // Paso 3: Tokenizar la tarjeta
        String token = tokenizarTarjeta(cardNumber, expirationMonth, expirationYear, securityCode, cardholderName, identificationNumber, metodo);
        if (token == null) {
            return ResultadoValidacionTarjeta.error("Error al tokenizar la tarjeta");
        }

        // Paso 4: Realizar pago de prueba para validar la tarjeta
        boolean pagoExitoso = realizarPagoDePrueba(token, metodo.getPaymentMethodId(), metodo.getIssuerId());
        if (!pagoExitoso) {
            return ResultadoValidacionTarjeta.error("Tarjeta inválida ❌");
        }

        // Paso 5: Guardar token en el usuario
        Optional<User> optionalUsuario = userRepository.findByEmail(email);
        if (optionalUsuario.isEmpty()) {
            return ResultadoValidacionTarjeta.error("Usuario no encontrado");
        }

        User usuario = optionalUsuario.get();
        usuario.setTokenTarjeta(token);
        usuario.setTarjetaValidada(true);
        userRepository.save(usuario);

        return ResultadoValidacionTarjeta.ok("Tarjeta válida y guardada ✅");
    }

    private MetodoPagoInfo obtenerMetodoPagoInfo(String cardNumber) throws IOException, InterruptedException {
        String bin = cardNumber.replaceAll("\\s", "").substring(0, 6);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.mercadopago.com/v1/payment_methods/search?bin=" + bin + "&site_id=MLA"))
                .header("Authorization", "Bearer " + mercadoPagoAccessToken)
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            System.err.println("Error al obtener método de pago para BIN: " + bin);
            System.err.println("Respuesta: " + response.body());
            return null;
        }

        JsonNode root = new ObjectMapper().readTree(response.body());
        JsonNode results = root.get("results");

        if (results != null && results.isArray() && results.size() > 0) {
            JsonNode metodo = results.get(0);
            String paymentMethodId = metodo.get("id").asText();
            String issuerId = metodo.has("issuer") && metodo.get("issuer").has("id")
                    ? metodo.get("issuer").get("id").asText()
                    : null;

            return new MetodoPagoInfo(paymentMethodId, issuerId);
        } else {
            System.err.println("No se encontró método de pago para BIN: " + bin);
            return null;
        }
    }

    private String tokenizarTarjeta(String cardNumber, int month, int year, String cvv, String name, String dni, MetodoPagoInfo metodo) throws IOException, InterruptedException {
        String issuerLine = (metodo.getIssuerId() != null && !metodo.getIssuerId().isBlank()) ? """
          ,"issuer_id": "%s"
        """.formatted(metodo.getIssuerId()) : "";

        String tokenJson = """
        {
          "card_number": "%s",
          "expiration_month": %d,
          "expiration_year": %d,
          "security_code": "%s",
          "payment_method_id": "%s"%s,
          "cardholder": {
            "name": "%s",
            "identification": {
              "type": "DNI",
              "number": "%s"
            }
          }
        }
        """.formatted(cardNumber, month, year, cvv, metodo.getPaymentMethodId(), issuerLine, name, dni);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.mercadopago.com/v1/card_tokens"))
                .header("Authorization", "Bearer " + mercadoPagoAccessToken)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(tokenJson))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println("Tokenización status: " + response.statusCode());
        System.out.println("Tokenización respuesta: " + response.body());

        if (response.statusCode() != 200 && response.statusCode() != 201) {
            System.err.println("Error al tokenizar tarjeta. Código: " + response.statusCode());
            System.err.println("Cuerpo de error: " + response.body());
            return null;
        }

        JsonNode jsonNode = new ObjectMapper().readTree(response.body());
        JsonNode idNode = jsonNode.get("id");

        if (idNode != null && !idNode.isNull()) {
            return idNode.asText();
        } else {
            System.err.println("No se encontró el campo 'id' en la respuesta: " + response.body());
            return null;
        }
    }

    private boolean realizarPagoDePrueba(String token, String paymentMethodId, String issuerId) throws IOException, InterruptedException {
        double monto = 10.00;
        String emailDePrueba = "test@example.com"; // Email para pruebas

        String paymentJson = issuerId != null
                ? String.format(Locale.US, """
      {
        "token": "%s",
        "transaction_amount": %.2f,
        "payment_method_id": "%s",
        "issuer_id": "%s",
        "installments": 1,
        "payer": {
          "email": "%s"
        }
      }
      """, token, monto, paymentMethodId, issuerId, emailDePrueba)
                : String.format(Locale.US, """
      {
        "token": "%s",
        "transaction_amount": %.2f,
        "payment_method_id": "%s",
        "installments": 1,
        "payer": {
          "email": "%s"
        }
      }
      """, token, monto, paymentMethodId, emailDePrueba);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.mercadopago.com/v1/payments"))
                .header("Authorization", "Bearer " + mercadoPagoAccessToken)
                .header("Content-Type", "application/json")
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .POST(HttpRequest.BodyPublishers.ofString(paymentJson))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println("Pago de prueba status: " + response.statusCode());
        System.out.println("Pago de prueba response: " + response.body());

        return response.statusCode() == 201;
    }

    private boolean validateExpiry(Integer expirationMonth, Integer expirationYear) {
        if (expirationMonth == null || expirationYear == null) {
            return false;
        }
        
        if (expirationMonth < 1 || expirationMonth > 12) {
            return false;
        }
        
        // Verificar que la fecha no sea anterior al mes/año actual
        java.time.LocalDate now = java.time.LocalDate.now();
        int currentYear = now.getYear();
        int currentMonth = now.getMonthValue();
        
        // Si el año es menor al actual, es inválida
        if (expirationYear < currentYear) {
            return false;
        }
        
        // Si es el año actual, el mes debe ser mayor o igual al actual
        if (expirationYear == currentYear && expirationMonth < currentMonth) {
            return false;
        }
        
        return true;
    }
}
