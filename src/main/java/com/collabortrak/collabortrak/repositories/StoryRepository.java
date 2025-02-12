package com.collabortrak.collabortrak.repositories;

import com.collabortrak.collabortrak.entities.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {

    // Fetch all stories for a given epic
    List<Story> findByEpicId(Long epicId);
}
