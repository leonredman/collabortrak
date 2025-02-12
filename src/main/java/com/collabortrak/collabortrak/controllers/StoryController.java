package com.collabortrak.collabortrak.controllers;

import com.collabortrak.collabortrak.entities.Story;
import com.collabortrak.collabortrak.entities.Epic;
import com.collabortrak.collabortrak.repositories.StoryRepository;
import com.collabortrak.collabortrak.repositories.EpicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private EpicRepository epicRepository;

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
