package com.collabortrak.collabortrak.repositories;

import com.collabortrak.collabortrak.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Fetch single ticket with its customer
    @Query("SELECT t FROM Ticket t JOIN FETCH t.customer WHERE t.id = :id")
    Optional<Ticket> findByIdWithCustomer(@Param("id") Long id);

    // Fetch all tickets with customer details
    @Query("SELECT t FROM Ticket t JOIN FETCH t.customer")
    List<Ticket> findAllWithCustomer();
}
