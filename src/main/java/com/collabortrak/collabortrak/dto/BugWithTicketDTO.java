package com.collabortrak.collabortrak.dto;

import com.collabortrak.collabortrak.entities.*;

public class BugWithTicketDTO {
    private String title;
    private String description;
    private StatusType status;
    private PriorityType priority;
    private CategoryType category;
    private Long linkedEpicId;
    private Customer customer;
    private Employee assignedEmployee;
    private Long customerId;

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

    public Long getLinkedEpicId() {
        return linkedEpicId;
    }

    public void setLinkedEpicId(Long linkedEpicId) {
        this.linkedEpicId = linkedEpicId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public Employee getAssignedEmployee() {
        return assignedEmployee;
    }

    public void setAssignedEmployee(Employee assignedEmployee) {
        this.assignedEmployee = assignedEmployee;
    }
}
