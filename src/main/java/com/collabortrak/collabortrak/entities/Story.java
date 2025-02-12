package com.collabortrak.collabortrak.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stories")
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private StatusType status;

    @Enumerated(EnumType.STRING)
    private PriorityType priority;

    @ManyToOne
    @JoinColumn(name = "epic_id", nullable = false)
    private Epic epic;

    @Column(updatable = false)
    private LocalDateTime createdDate = LocalDateTime.now();

    // Constructors
    public Story() {}

    public Story(String title, String description, StatusType status, PriorityType priority, Epic epic) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.epic = epic;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public StatusType getStatus() {
        return status;
    }

    public void setStatus(StatusType status) {
        this.status = status;
    }

    public PriorityType getPriority() {
        return priority;
    }

    public void setPriority(PriorityType priority) {
        this.priority = priority;
    }

    public Epic getEpic() {
        return epic;
    }

    public void setEpic(Epic epic) {
        this.epic = epic;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }
}
