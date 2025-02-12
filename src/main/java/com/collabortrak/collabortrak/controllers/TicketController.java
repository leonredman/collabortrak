package com.collabortrak.collabortrak.controllers;

import com.collabortrak.collabortrak.entities.Ticket;
import com.collabortrak.collabortrak.entities.Customer;
import com.collabortrak.collabortrak.repositories.CustomerRepository;
import com.collabortrak.collabortrak.repositories.TicketRepository;
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
    @GetMapping("/customer/{customerId}")
    public List<Ticket> getTicketsByCustomer(@PathVariable Long customerId) {
        return ticketRepository.findByCustomerId(customerId);
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
