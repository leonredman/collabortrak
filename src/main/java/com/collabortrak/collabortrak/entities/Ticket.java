package com.collabortrak.collabortrak.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryType category;

    @Column(name = "ticket_tracking_number",unique = true, updatable = false)
    private String ticketTrackingNumber;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "assigned_employee_id", referencedColumnName = "id", nullable = true)
    @JsonInclude(JsonInclude.Include.NON_NULL) // Ensures proper serialization
    @JsonProperty("assignedEmployee") // Explicitly names the field
    // @JsonManagedReference // used for bidirectional relationships to stop recursion
    // @JsonIgnore
    private Employee assignedEmployee;

    // Transient `assignedEmployeeId`
    @Transient
    private Long assignedEmployeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "ticket_type")
    private TicketType ticketType;

    @Transient
    private Long linkedEpicId;

    @Column(updatable = false)
    private LocalDateTime createdDate = LocalDateTime.now();

    @Column
    private LocalDateTime dueDate;

    @Column
    private LocalDateTime lastUpdate;

    // Constructors
    public Ticket() {}

    public Ticket(String title, String description, StatusType status, PriorityType priority, CategoryType category, Customer customer, Employee assignedEmployee, TicketType ticketType) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.category = category;
        this.customer = customer;
        this.assignedEmployee = assignedEmployee;
        this.ticketType = ticketType;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTicketTrackingNumber() {
        return ticketTrackingNumber;
    }

    public void setTicketTrackingNumber(String ticketTrackingNumber) {
        this.ticketTrackingNumber = ticketTrackingNumber;
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

    public CategoryType getCategory() {
        return category;
    }

    public void setCategory(CategoryType category) {
        this.category = category;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(LocalDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
    public Employee getAssignedEmployee() {
        return assignedEmployee;
    }

    public void setAssignedEmployee(Employee assignedEmployee) {
        this.assignedEmployee = assignedEmployee;
    }

    // Getter for `assignedEmployeeId`
    public Long getAssignedEmployeeId() {
        return assignedEmployee != null ? assignedEmployee.getId() : null;
    }

    public TicketType getTicketType() {
        return ticketType;
    }

    public void setTicketType(TicketType ticketType) {
        this.ticketType = ticketType;
    }

    // Setter for `assignedEmployeeId`
    public void setAssignedEmployeeId(Long assignedEmployeeId) {
        this.assignedEmployeeId = assignedEmployeeId;
    }

    public Long getLinkedEpicId() {
        return linkedEpicId;
    }
    public void setLinkedEpicId(Long linkedEpicId) {
        this.linkedEpicId = linkedEpicId;
    }

    @PrePersist
    public void generateTrackingNumber() {
        this.ticketTrackingNumber = "TCK-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // Hibernate auto updates lastUpdate whenever an entity is modified and saved
    @PreUpdate
    public void updateTimestamp() {
        this.lastUpdate = LocalDateTime.now();
    }


}
