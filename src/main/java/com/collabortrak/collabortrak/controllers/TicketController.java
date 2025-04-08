package com.collabortrak.collabortrak.controllers;

import com.collabortrak.collabortrak.dto.TicketDTO;
import com.collabortrak.collabortrak.entities.*;
import com.collabortrak.collabortrak.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
//@CrossOrigin(origins = {
//        "http://localhost:5173",
//        "https://collabortrak.vercel.app",
//        "https://collabortrak-production.up.railway.app"
//})
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EpicRepository epicRepository;

    @Autowired
    private StoryRepository storyRepository;

    private String generateUniqueTicketTrackingNumber() {
        String trackingNumber;
        do {
            trackingNumber = "TCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (ticketRepository.existsByTicketTrackingNumber(trackingNumber));

        return trackingNumber;
    }

    // Create a ticket
    @PostMapping
    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "(hasRole('WEBSITE_SPECIALIST') and " +
                    "(#ticket.category == T(com.collabortrak.collabortrak.entities.CategoryType).NEW_BUILD or " +
                    "#ticket.category == T(com.collabortrak.collabortrak.entities.CategoryType).REVISIONS or " +
                    "#ticket.category == T(com.collabortrak.collabortrak.entities.CategoryType).POST_PUBLISH) and " +
                    "(#ticket.ticketType == T(com.collabortrak.collabortrak.entities.TicketType).EPIC or " +
                    "#ticket.ticketType == T(com.collabortrak.collabortrak.entities.TicketType).STORY)" +
                    ") or " +
                    "(hasRole('DEVELOPER') and (" +
                    "#ticket.ticketType == T(com.collabortrak.collabortrak.entities.TicketType).STORY or " +
                    "#ticket.ticketType == T(com.collabortrak.collabortrak.entities.TicketType).TASK or " +
                    "#ticket.ticketType == T(com.collabortrak.collabortrak.entities.TicketType).BUG" +
                    ")) or " +
                    "(hasRole('QA_AGENT') and " +
                    "#ticket.ticketType == T(com.collabortrak.collabortrak.entities.TicketType).BUG)"
    )

    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket, Authentication authentication) {
        System.out.println("Received Ticket Data: " + ticket); // Debug log

        // Debugging log for assigned employee before fetching
        if (ticket.getAssignedEmployee() != null) {
            System.out.println("Assigned Employee ID from request: " + ticket.getAssignedEmployee().getId());
        } else {
            System.out.println("Assigned Employee is NULL in request");
        }

        // Fetch assigned employee manually if provided
        if (ticket.getAssignedEmployee() != null && ticket.getAssignedEmployee().getId() != null) {
            Employee employee = employeeRepository.findById(ticket.getAssignedEmployee().getId())
                    .orElse(null); // Ensure employee exists
            ticket.setAssignedEmployee(employee); // Explicitly set employee
            System.out.println("Employee set in ticket: " + (employee != null ? employee.getId() : "NOT FOUND"));
        }

        // Generate Ticket Tracking Number
        ticket.setTicketTrackingNumber(generateUniqueTicketTrackingNumber());

        // Set "dueDate" is set to 7 days from creation if not provided
        if (ticket.getDueDate() == null) {
            ticket.setDueDate(LocalDateTime.now().plusDays(7));
        }

        // Make sure`lastUpdated` is initialized
        ticket.setLastUpdate(LocalDateTime.now());
        System.out.println("Last Update Before Save: " + ticket.getLastUpdate());

        // Save ticket
        Ticket savedTicket = ticketRepository.save(ticket);

        // Set Story ticket type
        if (ticket.getTicketType() == TicketType.STORY) {
            System.out.println("Ticket type received: " + ticket.getTicketType());
            System.out.println("Entered STORY handling block");

            Long epicId = ticket.getLinkedEpicId(); // must add transient field
            System.out.println("🔍 Linked Epic ID: " + epicId);

            if (epicId == null) {
                System.out.println("Linked Epic ID is null — cannot create Story without Epic.");
                return ResponseEntity.badRequest().body(null); // Epic must be provided
            }

            Epic linkedEpic = epicRepository.findById(epicId).orElse(null);
            if (linkedEpic == null) {
                System.out.println("Epic not found for ID: " + epicId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Epic not found
            }

            System.out.println("Linked Epic found: " + linkedEpic.getId());

            Story story = new Story();
            story.setTitle(ticket.getTitle());
            story.setDescription(ticket.getDescription());
            story.setStatus(ticket.getStatus());
            story.setPriority(ticket.getPriority());
            story.setEpic(linkedEpic); // required
            story.setTicketId(savedTicket.getId());

            System.out.println("Saving Story linked to Epic ID " + linkedEpic.getId() +
                    ", Ticket ID: " + savedTicket.getId());

            storyRepository.save(story);

            System.out.println("Story successfully saved in the database.");
        }

        // EPIC logic: If ticketType == EPIC, insert into epics & a default story on auto
        if (ticket.getTicketType() == TicketType.EPIC) {
            System.out.println("EPIC detected — saving to epics table and creating default story.");

            // Save Epic
            Epic epic = new Epic();
            epic.setTicketId(savedTicket.getId());
            epic.setTitle(savedTicket.getTitle()); // required field
            epic.setCustomer(savedTicket.getCustomer()); // also required
            // Optional
            epic.setDescription(savedTicket.getDescription());
            epic.setPriority(savedTicket.getPriority());
            epic.setStatus(savedTicket.getStatus());

            Epic savedEpic = epicRepository.save(epic);

            // Create default Story ticket
            Ticket defaultStoryTicket = new Ticket();
            String epicTrackingNumber = savedTicket.getTicketTrackingNumber(); // Get Epic's tracking #
            Long epicId = savedEpic.getId(); // Get Epic ID

            defaultStoryTicket.setTitle("Default Story for Epic: " + epicTrackingNumber);
            defaultStoryTicket.setDescription("Auto-generated story for Epic ID " + epicId + " (" + epicTrackingNumber + ")");
            defaultStoryTicket.setStatus(StatusType.OPEN);
            defaultStoryTicket.setPriority(savedTicket.getPriority());
            defaultStoryTicket.setCategory(savedTicket.getCategory());
            defaultStoryTicket.setCustomer(savedTicket.getCustomer());
            defaultStoryTicket.setAssignedEmployee(null); // Unassigned by default
            defaultStoryTicket.setTicketTrackingNumber(generateUniqueTicketTrackingNumber());
            defaultStoryTicket.setDueDate(LocalDateTime.now().plusDays(7));
            defaultStoryTicket.setLastUpdate(LocalDateTime.now());

            // Must set the ticketType to for Auto Story
            defaultStoryTicket.setTicketType(TicketType.STORY);

            Ticket savedStoryTicket = ticketRepository.save(defaultStoryTicket);

            // Save Story entry linked to the Epic
            Story defaultStory = new Story();
            defaultStory.setTitle(defaultStoryTicket.getTitle());
            defaultStory.setDescription(defaultStoryTicket.getDescription());
            defaultStory.setStatus(defaultStoryTicket.getStatus());
            defaultStory.setPriority(defaultStoryTicket.getPriority());
            defaultStory.setTicketId(savedStoryTicket.getId());
            defaultStory.setEpic(savedEpic); // or setEpicId?

            storyRepository.save(defaultStory);

            System.out.println("Default Story created for Epic ID: " + savedEpic.getId());
        }

        System.out.println("Ticket Saved! Assigned Employee ID: " +
                (savedTicket.getAssignedEmployee() != null ? savedTicket.getAssignedEmployee().getId() : "null"));

        return ResponseEntity.ok(savedTicket);
    }

    // Original Get all Tickets with DTO
//    @GetMapping
//    public List<TicketDTO> getAllTickets() {
//        List<Ticket> tickets = ticketRepository.findAll();
//        return tickets.stream().map(TicketDTO::new).collect(Collectors.toList());
//    }

    // Get all Tickets with DTO
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
//    @CrossOrigin(origins = {
//            "http://localhost:5173",
//            "https://collabortrak.vercel.app",
//            "https://collabortrak-production.up.railway.app"
//    }, allowCredentials = "true")
    public ResponseEntity<?> getAllTickets(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"message\": \"User is not authenticated.\"}");
        }

        try {
            List<Ticket> tickets = ticketRepository.findAll();
            List<TicketDTO> ticketDTOs = tickets.stream().map(TicketDTO::new).collect(Collectors.toList());

            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(ticketDTOs);
        } catch (Exception e) {
            System.out.println("Error fetching tickets: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"message\": \"Internal Server Error\"}");
        }
    }

    // Get ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        Optional<Ticket> ticket = ticketRepository.findById(id);
        return ticket.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

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
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('DEVELOPER') or hasRole('QA_AGENT') or hasRole('WEBSITE_SPECIALIST')")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket updatedTicket) {
        return ticketRepository.findById(id)
                .map(ticket -> {
                    ticket.setTitle(updatedTicket.getTitle());
                    ticket.setDescription(updatedTicket.getDescription());
                    ticket.setStatus(updatedTicket.getStatus());
                    ticket.setPriority(updatedTicket.getPriority());
                    ticket.setCategory(updatedTicket.getCategory());

                    // Update Due Date is explicitly updated
                    if (updatedTicket.getDueDate() != null) {
                        ticket.setDueDate(updatedTicket.getDueDate());
                    }

                    // Tested Original Set Assigned Employee is Updated
                    if (updatedTicket.getAssignedEmployee() != null && updatedTicket.getAssignedEmployee().getId() != null) {
                        Employee employee = employeeRepository.findById(updatedTicket.getAssignedEmployee().getId())
                                .orElse(null);
                        ticket.setAssignedEmployee(employee); // Set new assigned employee
                   }
                    return ResponseEntity.ok(ticketRepository.save(ticket));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @GetMapping("/epic/{ticketId}/linked-tickets")
    public ResponseEntity<List<Ticket>> getLinkedTicketsByEpic(@PathVariable Long ticketId) {
        Optional<Epic> epicOptional = epicRepository.findByTicketId(ticketId); // Find Epic by its ticketId
        if (epicOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }

        Epic epic = epicOptional.get();
        Long epicId = epic.getId(); // Get the actual ID from the epics table
        List<TicketType> types = List.of(TicketType.STORY, TicketType.TASK, TicketType.BUG);

        List<Ticket> linkedTickets = ticketRepository.findLinkedTicketsByEpicId(epicId, types);
        return ResponseEntity.ok(linkedTickets);
    }

    // Delete a ticket - only Admins delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        if (!ticketRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ticketRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Added Unified Search Endpoint
    @GetMapping("/search")
    public ResponseEntity<List<Ticket>> searchTickets(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String ticketTrackingNumber
    ) {
        List<Ticket> results;

        if (title != null && !title.isEmpty()) {
            results = ticketRepository.findByTitleContainingIgnoreCase(title);
        } else if (description != null && !description.isEmpty()) {
            results = ticketRepository.findByDescriptionContainingIgnoreCase(description);
        } else if (ticketTrackingNumber != null && !ticketTrackingNumber.isEmpty()) {
            results = ticketRepository.findByTicketTrackingNumberContainingIgnoreCase(ticketTrackingNumber);
        } else {
            // If no search criteria provided, return all tickets
            results = ticketRepository.findAll();
        }

        return ResponseEntity.ok(results);
    }

}
