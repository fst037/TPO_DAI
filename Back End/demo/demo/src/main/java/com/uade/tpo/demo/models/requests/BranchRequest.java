package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para crear o actualizar una sede")
public class BranchRequest {

  @Schema(description = "Nombre de la sede", example = "Sede Centro", required = true)
  private String name;

  @Schema(description = "Dirección de la sede", example = "Av. Siempre Viva 123", required = true)
  private String address;

  @Schema(description = "Número de teléfono de la sede", example = "+54 11 1234-5678", required = false)
  private String phoneNumber;

  @Schema(description = "Correo electrónico de la sede", example = "contacto@sede.com", required = false)
  private String email;

  @Schema(description = "Número de WhatsApp de la sede", example = "+54 9 11 9876-5432", required = false)
  private String whatsApp;

  @Schema(description = "Tipo de bonificación aplicada en la sede", example = "Descuento por volumen", required = false)
  private String discountType;

  @Schema(description = "Porcentaje de descuento aplicado a los cursos", example = "10.5", required = false)
  private Double courseDiscount;

  @Schema(description = "Tipo de promoción aplicada en la sede", example = "Promoción de verano", required = false)
  private String promotionType;

  @Schema(description = "Porcentaje de promoción aplicada a los cursos", example = "15.0", required = false)
  private Double coursePromotion;
}
