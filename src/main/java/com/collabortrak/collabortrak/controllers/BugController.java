package com.collabortrak.collabortrak.controllers;

import com.collabortrak.collabortrak.dto.BugWithTicketDTO;
import com.collabortrak.collabortrak.entities.*;
import com.collabortrak.collabortrak.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bugs")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://collabortrak.vercel.app",
        "https://collabortrak-production.up.railway.app"
})
public class BugController {

    @Autowired
    private BugRepository bugRepository;

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private EpicRepository epicRepository;

    @Autowired
    private CustomerRepository customerRepository;


    // Create a bug
//    @PostMapping
//    public ResponseEntity<Bug> createBug(@RequestBody Bug bug) {
//        if (!storyRepository.existsById(bug.getStory().getId())) {
//            return ResponseEntity.badRequest().build();
//        }
//        Bug savedBug = bugRepository.save(bug);
//        return ResponseEntity.ok(savedBug);
//    }

    // Get all bugs
    @GetMapping
    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }

    // Get bugs by story ID
//    @GetMapping("/story/{storyId}")
//    public List<Bug> getBugsByStory(@PathVariable Long storyId) {
//        return bugRepository.findByStoryId(storyId);
//    }

    // Get bug by ID
    @GetMapping("/{id}")
    public ResponseEntity<Bug> getBugById(@PathVariable Long id) {
        Optional<Bug> bug = bugRepository.findById(id);
        return bug.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Update a bug
    @PutMapping("/{id}")
    public ResponseEntity<Bug> updateBug(@PathVariable Long id, @RequestBody Bug updatedBug) {
        return bugRepository.findById(id)
                .map(bug -> {
                    bug.setTitle(updatedBug.getTitle());
                    bug.setDescription(updatedBug.getDescription());
                    bug.setStatus(updatedBug.getStatus());
                    bug.setPriority(updatedBug.getPriority());
                    return ResponseEntity.ok(bugRepository.save(bug));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a bug
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBug(@PathVariable Long id) {
        if (!bugRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bugRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/with-ticket")
    public ResponseEntity<Bug> createBugWithTicket(@RequestBody BugWithTicketDTO dto) {
        // Validate Epic ID
        Optional<Epic> epicOpt = epicRepository.findById(dto.getLinkedEpicId());
        if (epicOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Validate Customer ID
        Optional<Customer> customerOpt = customerRepository.findById(dto.getCustomerId());
        if (customerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        // Create Ticket
        Ticket ticket = new Ticket();
        ticket.setTitle(dto.getTitle());
        ticket.setDescription(dto.getDescription());
        ticket.setStatus(dto.getStatus());
        ticket.setPriority(dto.getPriority());
        ticket.setCategory(dto.getCategory());
      //  ticket.setCustomer(dto.getCustomer());
        ticket.setCustomer(customerOpt.get());
        ticket.setAssignedEmployee(dto.getAssignedEmployee());
        ticket.setTicketType(TicketType.BUG);
        ticket.setCreatedDate(LocalDateTime.now());
        ticket.setLastUpdate(LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);

        // Create Bug (linked to Epic only)
        Bug bug = new Bug();
        bug.setTitle(dto.getTitle());
        bug.setDescription(dto.getDescription());
        bug.setStatus(dto.getStatus());
        bug.setPriority(dto.getPriority());
        bug.setEpic(epicOpt.get());
        bug.setEpicId(epicOpt.get().getId());
        bug.setTicketId(savedTicket.getId());

        Bug savedBug = bugRepository.save(bug);
        return ResponseEntity.ok(savedBug);
    }

}
