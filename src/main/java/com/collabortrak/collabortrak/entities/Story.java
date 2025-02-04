package com.collabortrak.collabortrak.entities;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("STORY")
public class Story extends Ticket {

    @ManyToOne
    @JoinColumn(name = "epic_id", nullable = false)
    private Epic epic;

    public Story() {}

    public Story(String title, String description, Customer customer, Epic epic) {
        super(title, customer, TicketType.STORY);  //  Uses `title` and inherits `description`
        this.setDescription(description);
        this.epic = epic;
    }
    public Epic getEpic() { return epic; }
    public void setEpic(Epic epic) { this.epic = epic; }

}
