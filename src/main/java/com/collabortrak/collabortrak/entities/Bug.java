package com.collabortrak.collabortrak.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("BUG")  // This value must match the "type" column in the database
public class Bug extends Ticket {
    public Bug() {
        super();
    }

    public Bug(String title, Customer customer, StatusType status, PriorityType priority, CategoryType category, String description, Epic epic) {
        super(title, customer, status,priority,category);
        this.setDescription(description);
        this.setEpic(epic); // If the bug is related to an Epic, it will be linked
    }
}
