package com.collabortrak.collabortrak.entities;

import jakarta.persistence.*;

import java.util.List;

@Entity
@DiscriminatorValue("EPIC")  //  Ensures database differentiates Epics
public class Epic extends Ticket {

    @OneToMany(mappedBy = "epic", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Story> stories;

    // Required No-Arg Constructor for JPA
    public Epic() {
        super();
    }

    public Epic(String title, Customer customer) {
        super(title, customer, TicketType.EPIC);  //  Set the title when creating an Epic
    }

    public List<Story> getStories() {
        return stories;
    }

    public void setStories(List<Story> stories) {
        this.stories = stories;
    }

}
