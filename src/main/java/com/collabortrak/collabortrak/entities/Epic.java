package com.collabortrak.collabortrak.entities;

//import com.fasterxml.jackson.annotation.JsonSubTypes;
//import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
// import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.List;

@Entity
@DiscriminatorValue("EPIC")  //  Ensures database differentiates Epics
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")  // Fix for reference issue

// @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")  // Ensure Jackson recognizes "type" in JSON
// @JsonSubTypes({
//        @JsonSubTypes.Type(value = Story.class, name = "STORY")
// })

public class Epic extends Ticket {

    @OneToMany(mappedBy = "epic", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  //  @JsonManagedReference // Prevents infinite loop
    private List<Story> stories;

    // Required No-Arg Constructor for JPA
    public Epic() {
        super();
    }

    public Epic(String title, Customer customer, StatusType status, PriorityType priority, CategoryType category) {
        super(title, customer, status, priority, category);
    }

    public List<Story> getStories() {
        return stories;
    }

    public void setStories(List<Story> stories) {
        this.stories = stories;
    }

}
