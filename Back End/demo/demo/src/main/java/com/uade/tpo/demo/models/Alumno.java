package com.uade.tpo.demo.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("ALUMNO")
public class Alumno extends Usuario {
  private String numeroTarjeta;
  private String dniFrente;
  private String dniFondo;
  private String tramite;
  private Double cuentaCorriente;
}
