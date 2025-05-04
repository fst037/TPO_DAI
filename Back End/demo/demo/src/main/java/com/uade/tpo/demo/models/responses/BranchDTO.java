package com.uade.tpo.demo.models.responses;

import java.util.List;

import com.uade.tpo.demo.models.objects.Branch;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos que representa una sede.")
public class BranchDTO {
  @Schema(description = "Identificador único de la sede", example = "1")
  private Integer id;

  @Schema(description = "Nombre de la sede", example = "Sede Centro")
  private String name;

  @Schema(description = "Dirección de la sede", example = "Av. Siempre Viva 123")
  private String address;

  @Schema(description = "Número de teléfono de la sede", example = "+54 11 1234-5678")
  private String phone;

  @Schema(description = "Correo electrónico de la sede", example = "contacto@sede.com")
  private String email;

  @Schema(description = "Número de WhatsApp de la sede", example = "+54 9 11 9876-5432")
  private String whatsApp;

  @Schema(description = "Tipo de bonificación aplicada en la sede", example = "Descuento por volumen")
  private String discountType;

  @Schema(description = "Porcentaje de descuento aplicado a los cursos", example = "10.5")
  private Double courseDiscount;

  @Schema(description = "Tipo de promoción aplicada en la sede", example = "Promoción de verano")
  private String promotionType;

  @Schema(description = "Porcentaje de promoción aplicada a los cursos", example = "15.0")
  private Double coursePromotion;

  @Schema(description = "Lista de cronogramas de cursos asociados a la sede")
  private List<CourseScheduleDTOReduced> courseSchedules;

  public BranchDTO(Branch branch) {
    this.id = branch.getIdBranch();
    this.name = branch.getName();
    this.address = branch.getAddress();
    this.phone = branch.getPhone();
    this.email = branch.getEmail();
    this.whatsApp = branch.getWhatsApp();
    this.discountType = branch.getDiscountType();
    this.courseDiscount = branch.getCourseDiscount();
    this.promotionType = branch.getPromotionType();
    this.coursePromotion = branch.getCoursePromotion();
    this.courseSchedules = branch.getCourseSchedules().stream()
        .map(CourseScheduleDTOReduced::new)
        .toList();
  }
}
