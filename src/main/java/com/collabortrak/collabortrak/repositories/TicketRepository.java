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

    // Get single ticket with its customer and assigned employee
    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.assignedEmployee WHERE t.id = :id")
    Optional<Ticket> findByIdWithCustomerAndEmployee(@Param("id") Long id);

    // previous query cause recursion
    //@Query("SELECT t FROM Ticket t WHERE t.id = :id")
   // Optional<Ticket> findByIdWithCustomer(@Param("id") Long id);

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

    // Get tickets by customer ID
    List<Ticket> findByCustomer_Id(Long customerId);
}
