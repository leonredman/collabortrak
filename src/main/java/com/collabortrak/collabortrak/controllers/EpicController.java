package com.collabortrak.collabortrak.controllers;

import com.collabortrak.collabortrak.entities.Epic;
import com.collabortrak.collabortrak.entities.Customer;
import com.collabortrak.collabortrak.repositories.BugRepository;
import com.collabortrak.collabortrak.repositories.EpicRepository;
import com.collabortrak.collabortrak.repositories.CustomerRepository;
import com.collabortrak.collabortrak.repositories.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/epics")
public class EpicController {

    @Autowired
    private EpicRepository epicRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private BugRepository bugRepository;

    // Create an epic
    @PostMapping
    public ResponseEntity<Epic> createEpic(@RequestBody Epic epic) {
        if (!customerRepository.existsById(epic.getCustomer().getId())) {
            return ResponseEntity.badRequest().build();
        }
        Epic savedEpic = epicRepository.save(epic);
        return ResponseEntity.ok(savedEpic);
    }

    // Get all epics
    @GetMapping
    public List<Epic> getAllEpics() {
        return epicRepository.findAll();
    }

    // Get epics by customer ID
    @GetMapping("/customer/{customerId}")
    public List<Epic> getEpicsByCustomer(@PathVariable Long customerId) {
        return epicRepository.findByCustomerId(customerId);
    }

    // Get epic by ID
    @GetMapping("/{id}")
    public ResponseEntity<Epic> getEpicById(@PathVariable Long id) {
        Optional<Epic> epic = epicRepository.findById(id);
        return epic.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Update an epic
    @PutMapping("/{id}")
    public ResponseEntity<String> updateEpic(@PathVariable Long id) {
        if (!epicRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            epicRepository.deleteById(id);  // Database will prevent deletion if Stories or Bugs exist
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Cannot delete Epic. It has linked Stories or Bugs.");
        }
}


    // Delete an epic - need to add safe guard so cannot now delete with linked tickets existing
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteEpic(@PathVariable Long id) {
//        if (!epicRepository.existsById(id)) {
//            return ResponseEntity.notFound().build();
//        }
//        epicRepository.deleteById(id);
//        return ResponseEntity.noContent().build();
//    }


}
