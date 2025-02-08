package com.collabortrak.collabortrak.services;

import com.collabortrak.collabortrak.entities.Ticket;
import com.collabortrak.collabortrak.repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {
    @Autowired
    private TicketRepository ticketRepository;

    // Get all tickets
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Get ticket by ID
    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    // Create a new ticket
    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    // Update a ticket
    public Optional<Ticket> updateTicket(Long id, Ticket newTicketData) {
        return ticketRepository.findById(id).map(ticket -> {
            ticket.setTitle(newTicketData.getTitle());
            ticket.setDescription(newTicketData.getDescription());
            ticket.setStatus(newTicketData.getStatus());
            ticket.setPriority(newTicketData.getPriority());
            return ticketRepository.save(ticket);
        });
    }

    // Delete a ticket
    public boolean deleteTicket(Long id) {
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
