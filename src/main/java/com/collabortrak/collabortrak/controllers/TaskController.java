package com.collabortrak.collabortrak.controllers;

import com.collabortrak.collabortrak.dto.TaskWithTicketDTO;
import com.collabortrak.collabortrak.entities.*;
import com.collabortrak.collabortrak.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    // Injection
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;


    // Get all tasks
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get tasks by story ID
//    @GetMapping("/story/{storyId}")
//    public List<Task> getTasksByStory(@PathVariable Long storyId) {
//        return taskRepository.findByStoryId(storyId);
//    }

    // Get task by ID
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskRepository.findById(id);
        return task.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Update a task
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setTitle(updatedTask.getTitle());
                    task.setDescription(updatedTask.getDescription());
                    task.setStatus(updatedTask.getStatus());
                    task.setPriority(updatedTask.getPriority());
                    return ResponseEntity.ok(taskRepository.save(task));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/with-ticket")
    public ResponseEntity<Task> createTaskWithTicket(@RequestBody TaskWithTicketDTO dto) {
        // Lookup customer
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Optional: lookup employee if assigned
        Employee employee = null;
        if (dto.getAssignedEmployeeId() != null) {
            employee = employeeRepository.findById(dto.getAssignedEmployeeId())
                    .orElseThrow(() -> new RuntimeException("Employee not found"));
        }

        // Create Ticket
        Ticket ticket = new Ticket();
        ticket.setTitle(dto.getTitle());
        ticket.setDescription(dto.getDescription());
        ticket.setStatus(dto.getStatus());
        ticket.setPriority(dto.getPriority());
        ticket.setCategory(dto.getCategory());
        ticket.setCustomer(customer);
        ticket.setAssignedEmployee(employee);
        ticket.setTicketType(TicketType.TASK);
        ticket.setCreatedDate(LocalDateTime.now());
        ticket.setLastUpdate(LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);

        // Create Task
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());
        task.setTicketId(savedTicket.getId());

        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(savedTask);
    }

}
