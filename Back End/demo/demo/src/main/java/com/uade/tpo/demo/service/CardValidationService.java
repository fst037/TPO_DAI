package com.uade.tpo.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.uade.tpo.demo.exceptions.CardValidationException;
import com.uade.tpo.demo.models.objects.MetodoPagoInfo;
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

    // Tokens para SANDBOX (pruebas)
    @Value("${mercadopago.sandbox.access.token:TEST-1112012113568902-070517-a8faaf9f635f29d5ec88d9881439f6fb-1150332385}")
    private String sandboxAccessToken;

    // Tokens para PRODUCTION (pagos reales)
    @Value("${mercadopago.production.access.token:}")
    private String productionAccessToken;

    // Entorno activo
    @Value("${mercadopago.environment:sandbox}")
    private String mercadoPagoEnvironment;

    @Autowired
    private UserRepository userRepository;

    // BINs de prueba para testing según la documentación de MercadoPago
    private static final Map<String, String> BIN_TEST_PAYMENT_METHOD = Map.of(
        "503175", "master",      // Mastercard
        "450995", "visa",        // Visa
        "371180", "amex",        // American Express
        "528733", "debmaster",   // Mastercard débito
        "400276", "debvisa"      // Visa débito
    );

    //Obtiene el access token según el entorno configurado
    private String getAccessToken() {
        return "production".equals(mercadoPagoEnvironment) ? productionAccessToken : sandboxAccessToken;
    }

    // Valida que los tokens estén configurados correctamente para el entorno actual
    private void validateTokenConfiguration() throws CardValidationException {
        String accessToken = getAccessToken();
        String environment = mercadoPagoEnvironment;
        
        if (accessToken == null || accessToken.trim().isEmpty()) {
            throw new CardValidationException("Access Token de MercadoPago no configurado para entorno: " + environment);
        }
        
        if ("production".equals(environment)) {
            if (accessToken.startsWith("TEST-")) {
                throw new CardValidationException("Error: Usando token de prueba en entorno de producción");
            }
            if (!accessToken.startsWith("APP_USR-")) {
                throw new CardValidationException("Error: Token de producción debe comenzar con APP_USR-");
            }
        } else {
            if (!accessToken.startsWith("TEST-")) {
                throw new CardValidationException("Error: Token de sandbox debe comenzar con TEST-");
            }
        }
    }

    @Override
    public String validarYGuardarTarjeta(Map<String, String> body) throws CardValidationException, IOException, InterruptedException {
        // Validar configuración de tokens
        validateTokenConfiguration();

        String email = body.get("email");
        String cardNumber = body.get("card_number").replaceAll("\\s", "");
        int expirationMonth = Integer.parseInt(body.get("expiration_month"));
        int expirationYear = Integer.parseInt(body.get("expiration_year"));
        String securityCode = body.get("security_code");
        String cardholderName = body.get("name");
        String identificationNumber = body.get("number");

        // Validación de tarjeta con MercadoPago

        // Paso 1: Obtener información del método de pago usando BIN
        MetodoPagoInfo metodo = obtenerMetodoPagoInfo(cardNumber);

        // Paso 2: Verificar si es un BIN de prueba (solo en sandbox)
        String bin = cardNumber.substring(0, 6);
        boolean esTarjetaDePrueba = "sandbox".equals(mercadoPagoEnvironment) && BIN_TEST_PAYMENT_METHOD.containsKey(bin);
        
        if (esTarjetaDePrueba) {
            metodo = new MetodoPagoInfo(BIN_TEST_PAYMENT_METHOD.get(bin), metodo.getIssuerId());
        }

        // Paso 3: Tokenizar la tarjeta
        String token = tokenizarTarjeta(cardNumber, expirationMonth, expirationYear, securityCode, cardholderName, identificationNumber, metodo);


        // Paso 4: Validación según entorno
        boolean tarjetaValida = false;
        String mensajeValidacion = "";

        if ("production".equals(mercadoPagoEnvironment)) {
            // En producción: realizar débito real de validación
            boolean pagoExitoso = realizarPagoDePrueba(token, metodo.getPaymentMethodId(), metodo.getIssuerId(), email);
            if (pagoExitoso) {
                tarjetaValida = true;
                mensajeValidacion = "Tarjeta real validada con débito exitoso";
            } else {
                tarjetaValida = false;
                mensajeValidacion = "Error al validar tarjeta real con débito";
            }
        } else if (esTarjetaDePrueba) {
            // En sandbox: tarjetas de prueba
            boolean pagoExitoso = realizarPagoDePrueba(token, metodo.getPaymentMethodId(), metodo.getIssuerId(), email);
            if (pagoExitoso) {
                tarjetaValida = true;
                mensajeValidacion = "Tarjeta de prueba validada (sólo tokenización)";
            } else {
                tarjetaValida = true;
                mensajeValidacion = "Tarjeta de prueba validada";
            }
        } else {
            // En sandbox con tarjeta real (no debería pasar)
            tarjetaValida = true;
            mensajeValidacion = "Tarjeta validada en modo sandbox";
        }

        if (!tarjetaValida) {
            throw new CardValidationException(mensajeValidacion);
        }

        // Paso 5: Guardar token en el usuario
        Optional<User> optionalUsuario = userRepository.findByEmail(email);
        if (optionalUsuario.isEmpty()) {
            throw new CardValidationException("Usuario no encontrado");
        }

        // Retornar el token para que se guarde en Student
        // Ya no se guarda en User
        return token;
    }

    private MetodoPagoInfo obtenerMetodoPagoInfo(String cardNumber) throws CardValidationException, IOException, InterruptedException {
        String bin = cardNumber.replaceAll("\\s", "").substring(0, 6);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.mercadopago.com/v1/payment_methods/search?bin=" + bin + "&site_id=MLA"))
                .header("Authorization", "Bearer " + getAccessToken())
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new CardValidationException("Error al obtener método de pago para BIN " + bin + 
                ". Código: " + response.statusCode() + ". Respuesta: " + response.body());
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
            throw new CardValidationException("No se encontró método de pago para BIN: " + bin);
        }
    }

    private String tokenizarTarjeta(String cardNumber, int month, int year, String cvv, String name, String dni, MetodoPagoInfo metodo) throws CardValidationException, IOException, InterruptedException {
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
                .header("Authorization", "Bearer " + getAccessToken())
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(tokenJson))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());


        if (response.statusCode() != 200 && response.statusCode() != 201) {
            throw new CardValidationException("Error al tokenizar tarjeta. Código: " + response.statusCode() + 
                ". Respuesta: " + response.body());
        }

        JsonNode jsonNode = new ObjectMapper().readTree(response.body());
        JsonNode idNode = jsonNode.get("id");

        if (idNode != null && !idNode.isNull()) {
            return idNode.asText();
        } else {
            throw new CardValidationException("No se encontró el campo 'id' en la respuesta de tokenización: " + response.body());
        }
    }

    public boolean realizarPagoDePrueba(String token, String paymentMethodId, String issuerId, String email) throws IOException, InterruptedException {
        double monto = 1.00;
        
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
      """, token, monto, paymentMethodId, issuerId, email)
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
      """, token, monto, paymentMethodId, email);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.mercadopago.com/v1/payments"))
                .header("Authorization", "Bearer " + getAccessToken())
                .header("Content-Type", "application/json")
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .POST(HttpRequest.BodyPublishers.ofString(paymentJson))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        return response.statusCode() == 201;
    }

    /**
     * Detecta el tipo de tarjeta basado en el número
     */
    public static String detectarTipoTarjeta(String cardNumber) {
        // Limpiar espacios y guiones
        String numeroLimpio = cardNumber.replaceAll("[\\s-]", "");
        
        // Obtener el primer dígito
        if (numeroLimpio.length() < 1) {
            return "Desconocida";
        }
        
        String primerDigito = numeroLimpio.substring(0, 1);
        
        // Detectar tipo por primer dígito
        switch (primerDigito) {
            case "4":
                return "Visa";
            case "5":
                return "MasterCard";
            case "3":
                return "American Express";
            default:
                return "Débito/Crédito";
            }
        }

    public int parseExpirationMonth(String cardExpiry) throws CardValidationException {
        if (cardExpiry == null || !cardExpiry.matches("\\d{2}/\\d{2}")) {
            throw new CardValidationException("Formato de fecha de vencimiento inválido. Use MM/YY");
        }
        
        String[] parts = cardExpiry.split("/");
        int month = Integer.parseInt(parts[0]);
        
        if (month < 1 || month > 12) {
            throw new CardValidationException("Mes de vencimiento inválido: " + month);
        }
        
        return month;
    }
    
    public int parseExpirationYear(String cardExpiry) throws CardValidationException {
        if (cardExpiry == null || !cardExpiry.matches("\\d{2}/\\d{2}")) {
            throw new CardValidationException("Formato de fecha de vencimiento inválido. Use MM/YY");
        }
        
        String[] parts = cardExpiry.split("/");
        int year = Integer.parseInt(parts[1]);
 
        
        year += 2000;
        
        return year;
    }

    //TODO: Validar fecha de vencimiento de la tarjeta desde Frontend, dejo el código por las dudas
    /* 
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
    */
}