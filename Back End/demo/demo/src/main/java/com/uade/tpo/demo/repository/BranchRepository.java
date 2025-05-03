package com.uade.tpo.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.models.objects.Branch;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Integer> {
  
}
