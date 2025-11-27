package com.klef.cicd.dto;

public class DashboardStats {
    
    private long totalProducts;
    private long lowStockCount;
    private long totalSuppliers;
    private long totalUsers;
    
    // Constructors
    public DashboardStats() {}
    
    public DashboardStats(long totalProducts, long lowStockCount, long totalSuppliers, long totalUsers) {
        this.totalProducts = totalProducts;
        this.lowStockCount = lowStockCount;
        this.totalSuppliers = totalSuppliers;
        this.totalUsers = totalUsers;
    }
    
    // Getters and Setters
    public long getTotalProducts() {
        return totalProducts;
    }
    
    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }
    
    public long getLowStockCount() {
        return lowStockCount;
    }
    
    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }
    
    public long getTotalSuppliers() {
        return totalSuppliers;
    }
    
    public void setTotalSuppliers(long totalSuppliers) {
        this.totalSuppliers = totalSuppliers;
    }
    
    public long getTotalUsers() {
        return totalUsers;
    }
    
    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }
}
