package com.collabortrak.collabortrak.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bugs")
public class Bug {

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

    @Column(name = "epic_id", insertable = false, updatable = false)
    private Long epicId;

    @Column(name = "ticket_id", nullable = false)
    private Long ticketId;

    @Column(updatable = false)
    private LocalDateTime createdDate = LocalDateTime.now();

    // Constructors
    public Bug() {}

    public Bug(String title, String description, StatusType status, PriorityType priority, Epic epic, Long ticketId, Long epicId) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.epic = epic;
        this.ticketId = ticketId;
        this.epicId = epicId;
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

    public Long getEpicId() {
        return epicId;
    }

    public void setEpicId(Long epicId) {
        this.epicId = epicId;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
