package com.uade.tpo.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.models.objects.Unit;
import com.uade.tpo.demo.models.requests.UnitRequest;
import com.uade.tpo.demo.repository.UnitRepository;

@Service
public class UnitService {
  
  @Autowired
  private UnitRepository unitRepository;

  public List<Unit> getAllUnits() {
    return unitRepository.findAll();
  }

  public Unit getUnitById(Integer id) {
    return unitRepository.findById(id).orElseThrow(() -> new RuntimeException("Unit not found"));
  }

  public Unit createUnit(UnitRequest unitRequest) {
    Unit unit = new Unit();
    unit.setDescription(unitRequest.getDescription());
    return unitRepository.save(unit);
  }

  public Unit updateUnit(Integer id, UnitRequest unitRequest) {
    Unit unit = unitRepository.findById(id).orElseThrow(() -> new RuntimeException("Unit not found"));
    unit.setDescription(unitRequest.getDescription());
    return unitRepository.save(unit);
  }

  public void deleteUnit(Integer id) {
    unitRepository.deleteById(id);
  }
}
