package com.collabortrak.collabortrak.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("TASK")  // This ensures "TASK" is stored in the "type" column in the database
public class Task extends Ticket {

    public Task() {
        super();
    }

    public Task(String title, Customer customer, StatusType status, PriorityType priority, CategoryType category, String description, Epic epic) {
        super(title, customer, status,priority,category);
        this.setDescription(description);
        this.setEpic(epic); // Associates Task with an Epic if applicable
    }
}