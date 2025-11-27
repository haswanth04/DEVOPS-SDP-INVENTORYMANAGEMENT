package com.klef.cicd.service;

import com.klef.cicd.model.Product;
import com.klef.cicd.model.Supplier;
import com.klef.cicd.model.User;
import com.klef.cicd.repository.ProductRepository;
import com.klef.cicd.repository.SupplierRepository;
import com.klef.cicd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize sample data if database is empty
        if (userRepository.count() == 0) {
            initializeUsers();
        }
        
        if (productRepository.count() == 0) {
            initializeProducts();
        }
        
        if (supplierRepository.count() == 0) {
            initializeSuppliers();
        }
    }
    
    private void initializeUsers() {
        // Create admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPassword("password123");
        admin.setRole(User.Role.ADMIN);
        userRepository.save(admin);
        
        // Create manager user
        User manager = new User();
        manager.setUsername("manager1");
        manager.setEmail("manager@example.com");
        manager.setPassword("password123");
        manager.setRole(User.Role.MANAGER);
        userRepository.save(manager);
        
        // Create staff user
        User staff = new User();
        staff.setUsername("staff1");
        staff.setEmail("staff@example.com");
        staff.setPassword("password123");
        staff.setRole(User.Role.STAFF);
        userRepository.save(staff);
    }
    
    private void initializeProducts() {
        User admin = userRepository.findByUsername("admin").orElse(null);
        
        // Create sample products
        Product laptop = new Product();
        laptop.setName("Laptop");
        laptop.setCategory("Electronics");
        laptop.setStock(25);
        laptop.setPrice(new BigDecimal("999.99"));
        laptop.setLowStockThreshold(10);
        laptop.setUser(admin);
        productRepository.save(laptop);
        
        Product chair = new Product();
        chair.setName("Office Chair");
        chair.setCategory("Furniture");
        chair.setStock(5);
        chair.setPrice(new BigDecimal("199.99"));
        chair.setLowStockThreshold(10);
        chair.setUser(admin);
        productRepository.save(chair);
        
        Product notebook = new Product();
        notebook.setName("Notebook");
        notebook.setCategory("Stationery");
        notebook.setStock(150);
        notebook.setPrice(new BigDecimal("2.99"));
        notebook.setLowStockThreshold(50);
        notebook.setUser(admin);
        productRepository.save(notebook);
    }
    
    private void initializeSuppliers() {
        // Create sample suppliers
        Supplier techCorp = new Supplier();
        techCorp.setName("TechCorp");
        techCorp.setContact("John Doe");
        techCorp.setEmail("contact@techcorp.com");
        techCorp.setPhone("123-456-7890");
        supplierRepository.save(techCorp);
        
        Supplier officeSupply = new Supplier();
        officeSupply.setName("OfficeSupply Co");
        officeSupply.setContact("Jane Smith");
        officeSupply.setEmail("info@officesupply.com");
        officeSupply.setPhone("987-654-3210");
        supplierRepository.save(officeSupply);
    }
}
