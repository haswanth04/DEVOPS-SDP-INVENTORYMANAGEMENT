package com.klef.cicd.service;

import com.klef.cicd.dto.DashboardStats;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private SupplierService supplierService;
    
    @Autowired
    private UserService userService;
    
    public DashboardStats getDashboardStats() {
        long totalProducts = productService.getTotalProductsCount();
        long lowStockCount = productService.getLowStockCount();
        long totalSuppliers = supplierService.getTotalSuppliersCount();
        long totalUsers = userService.getAllUsers().size();
        
        return new DashboardStats(totalProducts, lowStockCount, totalSuppliers, totalUsers);
    }
}
