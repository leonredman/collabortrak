package com.collabortrak.collabortrak.repositories;

import com.collabortrak.collabortrak.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Find a customer by email
    Optional<Customer> findByEmail(String email);

    // Check if a customer exists by email
    boolean existsByEmail(String email);
}
