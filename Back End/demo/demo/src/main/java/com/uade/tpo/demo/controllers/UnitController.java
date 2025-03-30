package com.uade.tpo.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.models.requests.UnitRequest;
import com.uade.tpo.demo.models.responses.UnitDTO;
import com.uade.tpo.demo.service.UnitService;

@RestController
@RequestMapping("/units")
public class UnitController {
  
  @Autowired
  private UnitService unitService;

  @GetMapping("/")
  public ResponseEntity<Object> getAllUnits() {
    try {
      return ResponseEntity.ok(unitService.getAllUnits().stream().map(UnitDTO::new).toList());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<Object> getUnitById(@PathVariable Integer id) {
    try {
      return ResponseEntity.ok(new UnitDTO(unitService.getUnitById(id)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/")
  public ResponseEntity<Object> createUnit(@RequestBody UnitRequest unitRequest) {
    try {
      System.out.println("Unit request: " + unitRequest.getDescription());
      return ResponseEntity.ok(new UnitDTO(unitService.createUnit(unitRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<Object> updateUnit(@PathVariable Integer id, @RequestBody UnitRequest unitRequest) {
    try {
      return ResponseEntity.ok(new UnitDTO(unitService.updateUnit(id, unitRequest)));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Object> deleteUnit(@PathVariable Integer id) {
    try {
      unitService.deleteUnit(id);
      return ResponseEntity.ok("Unit deleted successfully.");
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}
