package com.collabortrak.collabortrak.repositories;

import com.collabortrak.collabortrak.entities.Product;
import com.collabortrak.collabortrak.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByDomainContainingIgnoreCase(String domain);
    List<Product> findByCustomer(Customer customer);
}