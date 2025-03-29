package com.collabortrak.collabortrak.repositories;

import com.collabortrak.collabortrak.entities.*;
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

    // Get single ticket with its customer and assigned employee
    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.assignedEmployee WHERE t.id = :id")
    Optional<Ticket> findByIdWithCustomerAndEmployee(@Param("id") Long id);

    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.assignedEmployee WHERE t.id = :id")
    Optional<Ticket> findByIdWithAssignedEmployee(@Param("id") Long id);

    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.assignedEmployee")
    List<Ticket> findAllWithAssignedEmployee();

    // Get all tickets with customer details
    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.assignedEmployee")
    List<Ticket> findAllWithCustomer();

    // Get Ticket Counts by status
    @Query("SELECT t.status AS status, COUNT(t) AS count FROM Ticket t GROUP BY t.status")
    List<Object[]> countTicketsByStatus();

    // Check if a ticket tracking number already exists
    boolean existsByTicketTrackingNumber(String ticketTrackingNumber);

    // Get Ticket  count By Employee
    @Query("SELECT e.firstName, e.lastName, COUNT(t) FROM Ticket t JOIN t.assignedEmployee e GROUP BY e.id")
    List<Object[]> countTicketsByEmployee();

    @Query("SELECT t FROM Ticket t " +
            "LEFT JOIN Story s ON s.ticketId = t.id " +
            "LEFT JOIN Bug b ON b.ticketId = t.id " +
            "WHERE t.ticketType IN (:types) AND (s.epicId = :epicId OR b.epicId = :epicId)")
    List<Ticket> findLinkedTicketsByEpicId(@Param("epicId") Long epicId,
                                           @Param("types") List<TicketType> types);

    // Get tickets by customer ID
    List<Ticket> findByCustomer_Id(Long customerId);

    List<Ticket> findByEpicId(Long epicId);
}
