package com.collabortrak.collabortrak.controllers;

import com.collabortrak.collabortrak.dto.TicketDTO;
import com.collabortrak.collabortrak.entities.*;
import com.collabortrak.collabortrak.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
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
    @PreAuthorize("hasRole('ADMIN') or " +
            "(hasRole('WEBSITE_SPECIALIST') and " +
            "(#ticket.category == T(com.collabortrak.collabortrak.entities.CategoryType).NEW_BUILD or " +
            "#ticket.category == T(com.collabortrak.collabortrak.entities.CategoryType).REVISIONS or " +
            "#ticket.category == T(com.collabortrak.collabortrak.entities.CategoryType).POST_PUBLISH) and " +
            "(#ticket.category == T(com.collabortrak.collabortrak.entities.CategoryType).EPIC or " +
            "#ticket.category == T(com.collabortrak.collabortrak.entities.CategoryType).STORY))) or " +
            "(hasRole('DEVELOPER') and (#ticket.category == T(com.collabortrak.collabortrak.entities.CategoryType).BUG and " +
            "(#ticket.category == T(com.collabortrak.collabortrak.entities.CategoryType).STORY or " +
            "#ticket.category == T(com.collabortrak.collabortrak.entities.CategoryType).TASK or " +
            "#ticket.category == T(com.collabortrak.collabortrak.entities.CategoryType).BUG))) or " +
            "(hasRole('QA_AGENT') and (#ticket.category == T(com.collabortrak.collabortrak.entities.CategoryType).BUG and " +
            "#ticket.category == T(com.collabortrak.collabortrak.entities.CategoryType).BUG))")

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

    // Get all Tickets with DTO
    @GetMapping
    public List<TicketDTO> getAllTickets() {
        List<Ticket> tickets = ticketRepository.findAll();
        return tickets.stream().map(TicketDTO::new).collect(Collectors.toList());
    }


    // Get all tickets
//    @GetMapping
//    public List<Ticket> getAllTickets() {
//        return ticketRepository.findAll();
//    }
//    @GetMapping
//    public List<Ticket> getAllTickets() {
//        return ticketRepository.findAllWithAssignedEmployee();
//    }


    // Get all tickets with Debug log
//    @GetMapping
//    public List<Ticket> getAllTickets() {
//        List<Ticket> tickets = ticketRepository.findAll();
//
//        // Debugging: Log assigned employee details
//        for (Ticket ticket : tickets) {
//            if (ticket.getAssignedEmployee() != null) {
//                System.out.println("Ticket ID: " + ticket.getId() +
//                        ", Assigned Employee ID: " + ticket.getAssignedEmployee().getId() +
//                        ", First Name: " + ticket.getAssignedEmployee().getFirstName() +
//                        ", Last Name: " + ticket.getAssignedEmployee().getLastName());
//            } else {
//                System.out.println("Ticket ID: " + ticket.getId() + " has no assigned employee.");
//            }
//        }
//
//        return tickets;
//    }

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

                    // OLD APPROACH NOW COMMENTED OUT
                    // Handle `assignedEmployeeId` separately (since frontend sends `assignedEmployeeId`)
//                    if (updatedTicket.getAssignedEmployee() == null && updatedTicket.getAssignedEmployeeId() != null) {
//                        Employee employee = employeeRepository.findById(updatedTicket.getAssignedEmployeeId())
//                                .orElse(null);
//                        ticket.setAssignedEmployee(employee);
//                    }


                    return ResponseEntity.ok(ticketRepository.save(ticket));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
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
}
