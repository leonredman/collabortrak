package com.collabortrak.collabortrak.controllers;

import com.collabortrak.collabortrak.entities.Ticket;
import com.collabortrak.collabortrak.entities.Customer;
import com.collabortrak.collabortrak.entities.Employee;
import com.collabortrak.collabortrak.entities.StatusType;
import com.collabortrak.collabortrak.entities.PriorityType;
import com.collabortrak.collabortrak.entities.CategoryType;
import com.collabortrak.collabortrak.repositories.CustomerRepository;
import com.collabortrak.collabortrak.repositories.TicketRepository;
import com.collabortrak.collabortrak.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    private String generateUniqueTicketTrackingNumber() {
        String trackingNumber;
        do {
            trackingNumber = "TCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (ticketRepository.existsByTicketTrackingNumber(trackingNumber));

        return trackingNumber;
    }

    // Create a ticket
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        ticket.setTicketTrackingNumber(generateUniqueTicketTrackingNumber());
        Ticket savedTicket = ticketRepository.save(ticket);
        return ResponseEntity.ok(savedTicket);
    }

    // Get all tickets
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Get ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        Optional<Ticket> ticket = ticketRepository.findById(id);
        return ticket.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Get tickets by customer ID
//    @GetMapping("/customer/{customerId}")
//    public List<Ticket> getTicketsByCustomer(@PathVariable Long customerId) {
//        return ticketRepository.findByCustomerId(customerId);
//    }

    // Get tickets by customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Ticket>> getTicketsByCustomer(@PathVariable Long customerId) {
        Optional<Customer> customer = customerRepository.findById(customerId);
        return customer.map(value -> ResponseEntity.ok(ticketRepository.findByCustomer(value)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get tickets by assigned employee ID
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Ticket>> getTicketsByEmployee(@PathVariable Long employeeId) {
        Optional<Employee> employee = employeeRepository.findById(employeeId);
        return employee.map(value -> ResponseEntity.ok(ticketRepository.findByAssignedEmployee(value)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get tickets filtered by status, priority, or category
    @GetMapping("/filter")
    public ResponseEntity<List<Ticket>> filterTickets(
            @RequestParam(required = false) StatusType status,
            @RequestParam(required = false) PriorityType priority,
            @RequestParam(required = false) CategoryType category) {
        if (status != null) {
            return ResponseEntity.ok(ticketRepository.findByStatus(status));
        } else if (priority != null) {
            return ResponseEntity.ok(ticketRepository.findByPriority(priority));
        } else if (category != null) {
            return ResponseEntity.ok(ticketRepository.findByCategory(category));
        } else {
            return ResponseEntity.badRequest().build();
        }
    }


    // Update a ticket
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket updatedTicket) {
        return ticketRepository.findById(id)
                .map(ticket -> {
                    ticket.setTitle(updatedTicket.getTitle());
                    ticket.setDescription(updatedTicket.getDescription());
                    ticket.setStatus(updatedTicket.getStatus());
                    ticket.setPriority(updatedTicket.getPriority());
                    ticket.setCategory(updatedTicket.getCategory());
                    return ResponseEntity.ok(ticketRepository.save(ticket));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        if (!ticketRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ticketRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
