package com.klef.cicd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klef.cicd.model.Supplier;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    
    List<Supplier> findByNameContainingIgnoreCase(String name);
    
    List<Supplier> findByContactContainingIgnoreCase(String contact);
    
    List<Supplier> findByEmailContainingIgnoreCase(String email);
}
