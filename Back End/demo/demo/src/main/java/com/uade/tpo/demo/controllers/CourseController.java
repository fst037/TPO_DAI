package com.uade.tpo.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.demo.models.requests.CourseRequest;
import com.uade.tpo.demo.models.responses.CourseDTO;
import com.uade.tpo.demo.service.CourseService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/courses")
@Tag(name = "Cursos", description = "Endpoints para la gestión de cursos")
public class CourseController {

  @Autowired
  private CourseService courseService;

  @GetMapping("/")
  @Operation(
      summary = "Obtener todos los cursos",
      description = "Devuelve una lista de todos los cursos disponibles en el sistema."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lista de cursos obtenida exitosamente",
          content = @Content(
              mediaType = "application/json",
              array = @ArraySchema(schema = @Schema(implementation = CourseDTO.class))
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getAllCourses() {
    try {
      return ResponseEntity.ok(courseService.getAllCourses().stream().map(CourseDTO::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/{id}")
  @Operation(
      summary = "Obtener un curso por ID",
      description = "Devuelve los detalles de un curso específico basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Curso obtenido exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = CourseDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Curso no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> getCourseById(@PathVariable Integer id) {
    try {
      return ResponseEntity.ok(new CourseDTO(courseService.getCourseById(id)));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/")
  @Operation(
      summary = "Crear un nuevo curso",
      description = "Crea un nuevo curso en el sistema."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Curso creado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = CourseDTO.class)
          )),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> createCourse(
      @RequestBody(description = "Detalles del curso a crear", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = CourseRequest.class)
          )
      ) CourseRequest courseRequest) {
    try {
      return ResponseEntity.ok(new CourseDTO(courseService.createCourse(courseRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}")
  @Operation(
      summary = "Actualizar un curso",
      description = "Actualiza los detalles de un curso existente basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Curso actualizado exitosamente",
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = CourseDTO.class)
          )),
      @ApiResponse(responseCode = "404", description = "Curso no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> updateCourse(
      @PathVariable Integer id,
      @RequestBody(description = "Detalles del curso a actualizar", required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = CourseRequest.class)
          )
      ) CourseRequest courseRequest) {
    try {
      return ResponseEntity.ok(new CourseDTO(courseService.updateCourse(id, courseRequest)));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}")
  @Operation(
      summary = "Eliminar un curso",
      description = "Elimina un curso existente basado en su ID."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Curso eliminado exitosamente",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "404", description = "Curso no encontrado",
          content = @Content(schema = @Schema(hidden = true))
      ),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor",
          content = @Content(schema = @Schema(hidden = true))
      )
  })
  public ResponseEntity<Object> deleteCourse(@PathVariable Integer id) {
    try {
      courseService.deleteCourse(id);
      return ResponseEntity.ok("Curso eliminado exitosamente.");
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}
