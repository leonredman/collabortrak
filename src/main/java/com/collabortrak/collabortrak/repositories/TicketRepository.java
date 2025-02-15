package com.collabortrak.collabortrak.repositories;

import com.collabortrak.collabortrak.entities.Ticket;
import com.collabortrak.collabortrak.entities.Customer;
import com.collabortrak.collabortrak.entities.Employee;
import com.collabortrak.collabortrak.entities.StatusType;
import com.collabortrak.collabortrak.entities.PriorityType;
import com.collabortrak.collabortrak.entities.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByCustomer(Customer customer);
    List<Ticket> findByAssignedEmployee(Employee employee);
    List<Ticket> findByStatus(StatusType status);
    List<Ticket> findByPriority(PriorityType priority);
    List<Ticket> findByCategory(CategoryType category);

    // Fetch single ticket with its customer
    @Query("SELECT t FROM Ticket t WHERE t.id = :id")
    Optional<Ticket> findByIdWithCustomer(@Param("id") Long id);

    // Fetch all tickets with customer details
    @Query("SELECT t FROM Ticket t")
    List<Ticket> findAllWithCustomer();

    // Check if a ticket tracking number already exists
    boolean existsByTicketTrackingNumber(String ticketTrackingNumber);

    // Fetch tickets by customer ID
    List<Ticket> findByCustomerId(Long customerId);
}
