package com.collabortrak.collabortrak.controllers;

import com.collabortrak.collabortrak.entities.Bug;
import com.collabortrak.collabortrak.entities.Story;
import com.collabortrak.collabortrak.repositories.BugRepository;
import com.collabortrak.collabortrak.repositories.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bugs")
public class BugController {

    @Autowired
    private BugRepository bugRepository;

    @Autowired
    private StoryRepository storyRepository;

    // Create a bug
    @PostMapping
    public ResponseEntity<Bug> createBug(@RequestBody Bug bug) {
        if (!storyRepository.existsById(bug.getStory().getId())) {
            return ResponseEntity.badRequest().build();
        }
        Bug savedBug = bugRepository.save(bug);
        return ResponseEntity.ok(savedBug);
    }

    // Get all bugs
    @GetMapping
    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }

    // Get bugs by story ID
    @GetMapping("/story/{storyId}")
    public List<Bug> getBugsByStory(@PathVariable Long storyId) {
        return bugRepository.findByStoryId(storyId);
    }

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
}
