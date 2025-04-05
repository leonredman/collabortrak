package com.collabortrak.collabortrak.controllers;

import com.collabortrak.collabortrak.entities.Product;
import com.collabortrak.collabortrak.entities.Customer;
import com.collabortrak.collabortrak.repositories.ProductRepository;
import com.collabortrak.collabortrak.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://collabortrak.vercel.app",
        "https://collabortrak-production.up.railway.app"
})
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // Create a product
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.status(201).body(savedProduct);
    }

    // Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get a product by ID
//    @GetMapping("/{id}")
//    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
//        Optional<Product> product = productRepository.findById(id);
//        return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
//    }

    // Get a product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Search products by domain
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String domain) {
        return productRepository.findByDomainContainingIgnoreCase(domain);
    }

    // Get products by customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Product>> getProductsByCustomer(@PathVariable Long customerId) {
        Optional<Customer> customer = customerRepository.findById(customerId);
        return customer.map(value -> ResponseEntity.ok(productRepository.findByCustomer(value)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Update a product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setDomain(updatedProduct.getDomain());
                    product.setDatePurchased(updatedProduct.getDatePurchased());
                    product.setRenewalDate(updatedProduct.getRenewalDate());
                    product.setPlan(updatedProduct.getPlan());
                    product.setCustomer(updatedProduct.getCustomer());
                    return ResponseEntity.ok(productRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }


    // Delete a product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}