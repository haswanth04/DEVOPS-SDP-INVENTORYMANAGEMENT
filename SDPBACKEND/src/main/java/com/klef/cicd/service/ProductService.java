package com.klef.cicd.service;

import com.klef.cicd.model.Product;
import com.klef.cicd.model.User;
import com.klef.cicd.repository.ProductRepository;
import com.klef.cicd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    
    public Product createProduct(Product product, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        product.setUser(user);
        return productRepository.save(product);
    }
    
    public Product updateProduct(Long id, Product productDetails, String username) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setName(productDetails.getName());
        product.setCategory(productDetails.getCategory());
        product.setStock(productDetails.getStock());
        product.setPrice(productDetails.getPrice());
        product.setLowStockThreshold(productDetails.getLowStockThreshold());
        
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }
    
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
    
    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
    
    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }
    
    public long getLowStockCount() {
        return productRepository.countLowStockProducts();
    }
    
    public long getTotalProductsCount() {
        return productRepository.count();
    }
}
