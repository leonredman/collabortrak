package com.collabortrak.collabortrak.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "tickets")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // Allows Epic & Story to be in the same table
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")  // Tells Jackson to look at "ticketType" to determine the class, JSON uses 'type' field for polymorphism
@JsonSubTypes({
        @JsonSubTypes.Type(value = Epic.class, name = "EPIC"),
        @JsonSubTypes.Type(value = Story.class, name = "STORY"),
        @JsonSubTypes.Type(value = Task.class, name = "TASK"),
        @JsonSubTypes.Type(value = Bug.class, name = "BUG")
})

// using @Inheritance(strategy = InheritanceType.SINGLE_TABLE), only the subclasses (Epic, Story, Task, Bug) should be instantiated
public abstract class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_tracking_number", nullable = false, unique = true, updatable = false)
    private String ticketTrackingNumber;   // unique tracking number Auto-generated

    @Column(name = "title", nullable = false, length = 255)  // Title for all tickets (including Epics & Stories)
    private String title;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)  // FK reference to Customer
    @JsonManagedReference  // Prevents recursive loop
    private Customer customer;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_date", nullable = false, updatable = false)
    private Date createdDate = new Date();

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusType status;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "due_date")
    private Date dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private PriorityType priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private CategoryType category;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "epic_id", nullable = true)  // Allow NULL values
    @JsonBackReference // Prevents infinite recursion
    private Epic epic;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "last_update")
    private Date lastUpdate;

    public Ticket() {}  // No Arg Constructor

    public Ticket(String title, Customer customer, StatusType status, PriorityType priority, CategoryType category) {
        this.ticketTrackingNumber = generateTicketTrackingNumber();
        this.title = title;
        this.customer = customer;
        this.status = status;
        this.priority = priority;
        this.category = category;
        this.createdDate = new Date();
    }

    private String generateTicketTrackingNumber() {
        return "TCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

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

    public void setTicketTrackingNumber(String ticketTrackingNumber) {
        this.ticketTrackingNumber = ticketTrackingNumber;
    }

    public String getTicketTrackingNumber() {
        return ticketTrackingNumber;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }


    public StatusType getStatus() {
        return status;
    }

    public void setStatus(StatusType status) {
        this.status = status;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(Date lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    public Epic getEpic() {
        return epic;
    }

    public void setEpic(Epic epic) {
        this.epic = epic;
    }
}
