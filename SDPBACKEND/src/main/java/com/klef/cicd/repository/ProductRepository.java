package com.klef.cicd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.klef.cicd.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByCategory(String category);
    
    List<Product> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT p FROM Product p WHERE p.stock <= p.lowStockThreshold")
    List<Product> findLowStockProducts();
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.stock <= p.lowStockThreshold")
    long countLowStockProducts();
    
    List<Product> findByUser_Id(Long userId);
}
