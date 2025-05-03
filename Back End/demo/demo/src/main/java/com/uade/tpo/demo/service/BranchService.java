package com.uade.tpo.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.models.objects.Branch;
import com.uade.tpo.demo.models.requests.BranchRequest;
import com.uade.tpo.demo.repository.BranchRepository;

@Service
public class BranchService {

  @Autowired
  private BranchRepository branchRepository;

  public List<Branch> getAllBranches() {
    return branchRepository.findAll();
  }

  public Branch getBranchById(Integer id) {
    return branchRepository.findById(id).orElseThrow(() -> new RuntimeException("Branch not found"));
  }

  public Branch createBranch(BranchRequest branchRequest) {
    Branch branch = new Branch();
    branch.setName(branchRequest.getName());
    branch.setAddress(branchRequest.getAddress());
    branch.setPhone(branchRequest.getPhoneNumber());
    branch.setEmail(branchRequest.getEmail());
    branch.setWhatsApp(branchRequest.getWhatsApp());
    branch.setDiscountType(branchRequest.getDiscountType());
    branch.setCourseDiscount(branchRequest.getCourseDiscount());
    branch.setPromotionType(branchRequest.getPromotionType());
    branch.setCoursePromotion(branchRequest.getCoursePromotion());
    branch.setCourseSchedules(List.of());
    return branchRepository.save(branch);
  }

  public Branch updateBranch(Integer id, BranchRequest branchRequest) {
    Branch branch = branchRepository.findById(id).orElseThrow(() -> new RuntimeException("Branch not found"));
    branch.setName(branchRequest.getName());
    branch.setAddress(branchRequest.getAddress());
    branch.setPhone(branchRequest.getPhoneNumber());
    branch.setEmail(branchRequest.getEmail());
    branch.setWhatsApp(branchRequest.getWhatsApp());
    branch.setDiscountType(branchRequest.getDiscountType());
    branch.setCourseDiscount(branchRequest.getCourseDiscount());
    branch.setPromotionType(branchRequest.getPromotionType());
    branch.setCoursePromotion(branchRequest.getCoursePromotion());
    return branchRepository.save(branch);
  }

  public void deleteBranch(Integer id) {
    branchRepository.deleteById(id);
  }
}
