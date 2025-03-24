package com.collabortrak.collabortrak.dto;

import com.collabortrak.collabortrak.entities.Ticket;
import com.collabortrak.collabortrak.entities.TicketType;

import java.time.LocalDateTime;

public class TicketDTO {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String category;
    private String ticketTrackingNumber;
    private LocalDateTime createdDate;
    private LocalDateTime dueDate;
    private LocalDateTime lastUpdate;
    private Long customerId;
    private Long assignedEmployeeId;
    private String assignedEmployeeFirstName;
    private String assignedEmployeeLastName;
    private TicketType ticketType;

    public TicketDTO(Ticket ticket) {
        this.id = ticket.getId();
        this.title = ticket.getTitle();
        this.description = ticket.getDescription();
        this.status = ticket.getStatus().toString();
        this.priority = ticket.getPriority().toString();
        this.category = ticket.getCategory().toString();
        this.ticketTrackingNumber = ticket.getTicketTrackingNumber();
        this.createdDate = ticket.getCreatedDate();
        this.dueDate = ticket.getDueDate();
        this.lastUpdate = ticket.getLastUpdate();
        this.customerId = ticket.getCustomer().getId();
        this.ticketType = ticket.getTicketType();
        if (ticket.getAssignedEmployee() != null) {
            this.assignedEmployeeId = ticket.getAssignedEmployee().getId();
            this.assignedEmployeeFirstName = ticket.getAssignedEmployee().getFirstName();
            this.assignedEmployeeLastName = ticket.getAssignedEmployee().getLastName();
        }
    }

    // Getters

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTicketTrackingNumber() {
        return ticketTrackingNumber;
    }

    public void setTicketTrackingNumber(String ticketTrackingNumber) {
        this.ticketTrackingNumber = ticketTrackingNumber;
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

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getAssignedEmployeeId() {
        return assignedEmployeeId;
    }

    public void setAssignedEmployeeId(Long assignedEmployeeId) {
        this.assignedEmployeeId = assignedEmployeeId;
    }

    public String getAssignedEmployeeFirstName() {
        return assignedEmployeeFirstName;
    }

    public void setAssignedEmployeeFirstName(String assignedEmployeeFirstName) {
        this.assignedEmployeeFirstName = assignedEmployeeFirstName;
    }

    public String getAssignedEmployeeLastName() {
        return assignedEmployeeLastName;
    }

    public void setAssignedEmployeeLastName(String assignedEmployeeLastName) {
        this.assignedEmployeeLastName = assignedEmployeeLastName;
    }

    public TicketType getTicketType() {
        return ticketType;
    }

    public void setTicketType(TicketType ticketType) {
        this.ticketType = ticketType;
    }
}
