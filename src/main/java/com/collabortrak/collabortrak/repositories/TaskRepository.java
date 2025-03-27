package com.collabortrak.collabortrak.repositories;

import com.collabortrak.collabortrak.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Fetch all tasks for a given story
  //  List<Task> findByStoryId(Long storyId);
}
