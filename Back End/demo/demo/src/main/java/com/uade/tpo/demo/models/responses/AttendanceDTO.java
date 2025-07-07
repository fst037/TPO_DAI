package com.uade.tpo.demo.models.responses;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos que representa la asistencia a un cronograma de curso")
public class AttendanceDTO {
  
  @Schema(description = "ID del cronograma de curso", example = "1")
  private Integer courseScheduleId;
  
  @Schema(description = "Nombre del curso", example = "Curso de Cocina Básica")
  private String courseName;
  
  @Schema(description = "Fechas programadas del curso")
  private List<String> scheduledDates;
  
  @Schema(description = "Fechas de asistencia registradas")
  private List<AttendanceRecord> attendanceRecords;
  
  @Schema(description = "Porcentaje de asistencia", example = "85.5")
  private Double attendancePercentage;
  
  @Schema(description = "Número total de clases programadas", example = "10")
  private Integer totalScheduledClasses;
  
  @Schema(description = "Número de clases asistidas", example = "8")
  private Integer attendedClasses;

  @Data
  @Schema(description = "Registro individual de asistencia")
  public static class AttendanceRecord {
    @Schema(description = "Fecha programada de la clase", example = "2025-01-15")
    private String scheduledDate;
    
    @Schema(description = "Indica si el usuario asistió a esta fecha", example = "true")
    private Boolean attended;
    
    public AttendanceRecord(String scheduledDate, boolean attended) {
      this.scheduledDate = scheduledDate;
      this.attended = attended;
    }
  }
}
