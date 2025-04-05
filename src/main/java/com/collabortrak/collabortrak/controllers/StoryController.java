package com.collabortrak.collabortrak.controllers;

import com.collabortrak.collabortrak.dto.TicketRequestDTO;
import com.collabortrak.collabortrak.entities.*;
import com.collabortrak.collabortrak.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stories")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://collabortrak.vercel.app",
        "https://collabortrak-production.up.railway.app"
})
public class StoryController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private EpicRepository epicRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping("/with-ticket")
    public ResponseEntity<String> createStoryWithTicket(@RequestBody TicketRequestDTO request) {
        if (request.linkedEpicId == null) {
            return ResponseEntity.badRequest().body("Missing linkedEpicId");
        }

        Epic epic = epicRepository.findById(request.linkedEpicId).orElse(null);
        if (epic == null) {
            return ResponseEntity.badRequest().body("Epic not found");
        }

        Ticket storyTicket = new Ticket();
        storyTicket.setTitle(request.title);
        storyTicket.setDescription(request.description);
        storyTicket.setStatus(StatusType.valueOf(request.status));
        storyTicket.setPriority(PriorityType.valueOf(request.priority));
        storyTicket.setCategory(CategoryType.valueOf(request.category));
        storyTicket.setTicketType(TicketType.valueOf(request.ticketType));
        storyTicket.setTicketTrackingNumber("TCK-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        storyTicket.setLastUpdate(java.time.LocalDateTime.now());
        storyTicket.setDueDate(java.time.LocalDateTime.now().plusDays(7));

        if (request.assignedEmployeeId != null) {
            Employee employee = employeeRepository.findById(request.assignedEmployeeId).orElse(null);
            if (employee != null) {
                storyTicket.setAssignedEmployee(employee);
            }
        }

        if (request.customerId != null) {
            Customer customer = customerRepository.findById(request.customerId).orElse(null);
            if (customer == null) {
                return ResponseEntity.badRequest().body("Customer not found");
            }
            storyTicket.setCustomer(customer);
        }

        Ticket savedTicket = ticketRepository.save(storyTicket);

        Story story = new Story();
        story.setTitle(savedTicket.getTitle());
        story.setDescription(savedTicket.getDescription());
        story.setStatus(savedTicket.getStatus());
        story.setPriority(savedTicket.getPriority());
        story.setTicketId(savedTicket.getId());
        story.setEpic(epic);

        storyRepository.save(story);

        return ResponseEntity.ok("Story created and linked to Epic ID: " + epic.getId());
    }



        // Add to your existing StoryController.java

//    @PostMapping("/with-ticket")
//    public ResponseEntity<String> createStoryWithTicket(@RequestBody Ticket storyTicket) {
//        if (storyTicket.getLinkedEpicId() == null) {
//            return ResponseEntity.badRequest().body("Missing linkedEpicId");
//        }
//
//        Epic epic = epicRepository.findById(storyTicket.getLinkedEpicId()).orElse(null);
//        if (epic == null) {
//            return ResponseEntity.badRequest().body("Epic not found");
//        }
//
//        // Set Ticket Fields & Save ticket first
//        storyTicket.setTicketTrackingNumber("TCK-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
//        storyTicket.setLastUpdate(java.time.LocalDateTime.now());
//        if (storyTicket.getDueDate() == null) {
//            storyTicket.setDueDate(java.time.LocalDateTime.now().plusDays(7));
//        }
//        if (storyTicket.getAssignedEmployeeId() != null) {
//            Employee employee = employeeRepository.findById(storyTicket.getAssignedEmployeeId()).orElse(null);
//            if (employee != null) {
//                storyTicket.setAssignedEmployee(employee);
//            }
//        }
//        // Fetch and assign the customer manually
//        if (storyTicket.getCustomerId() != null) {
//            Customer customer = customerRepository.findById(storyTicket.getCustomerId()).orElse(null);
//            if (customer == null) {
//                return ResponseEntity.badRequest().body("Customer not found");
//            }
//            storyTicket.setCustomer(customer);
//        }
//        Ticket savedTicket = ticketRepository.save(storyTicket);
//
//        // Save story
//        Story story = new Story();
//        story.setTitle(savedTicket.getTitle());
//        story.setDescription(savedTicket.getDescription());
//        story.setStatus(savedTicket.getStatus());
//        story.setPriority(savedTicket.getPriority());
//        story.setTicketId(savedTicket.getId());
//        story.setEpic(epic);
//
//        storyRepository.save(story);
//
//        return ResponseEntity.ok("Story created and linked to Epic ID: " + epic.getId());
//    }


    // Create a story
    @PostMapping
    public ResponseEntity<Story> createStory(@RequestBody Story story) {
        if (!epicRepository.existsById(story.getEpic().getId())) {
            return ResponseEntity.badRequest().build();
        }

        Story savedStory = storyRepository.save(story);
        return ResponseEntity.ok(savedStory);
    }

    // Get all stories
    @GetMapping
    public List<Story> getAllStories() {
        return storyRepository.findAll();
    }

    // Get stories by epic ID
    @GetMapping("/epic/{epicId}")
    public List<Story> getStoriesByEpic(@PathVariable Long epicId) {
        return storyRepository.findByEpicId(epicId);
    }

    // Get story by ID
    @GetMapping("/{id}")
    public ResponseEntity<Story> getStoryById(@PathVariable Long id) {
        Optional<Story> story = storyRepository.findById(id);
        return story.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Update a story
    @PutMapping("/{id}")
    public ResponseEntity<Story> updateStory(@PathVariable Long id, @RequestBody Story updatedStory) {
        return storyRepository.findById(id)
                .map(story -> {
                    story.setTitle(updatedStory.getTitle());
                    story.setDescription(updatedStory.getDescription());
                    story.setStatus(updatedStory.getStatus());
                    story.setPriority(updatedStory.getPriority());
                    return ResponseEntity.ok(storyRepository.save(story));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a story
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStory(@PathVariable Long id) {
        if (!storyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        storyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
