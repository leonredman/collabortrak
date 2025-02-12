package com.collabortrak.collabortrak.repositories;

import com.collabortrak.collabortrak.entities.Bug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugRepository extends JpaRepository<Bug, Long> {

    // Fetch all bugs for a given story
    List<Bug> findByStoryId(Long storyId);
}
