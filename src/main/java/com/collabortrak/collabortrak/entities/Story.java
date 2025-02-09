package com.collabortrak.collabortrak.entities;

//import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

@Entity
@DiscriminatorValue("STORY")  // Ensures the database correctly differentiates Stories
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")  // Fix circular reference issue
public class Story extends Ticket {

    @ManyToOne
    @JoinColumn(name = "epic_id", nullable = false)  // story must always be linked to epic
    // @JsonBackReference // Prevents infinite recursion during JSON serialization
    private Epic epic;

    public Story() {}

    public Story(String title, Customer customer, StatusType status, PriorityType priority, CategoryType category, Epic epic, String description) {
        super(title, customer, status, priority, category);  //  Uses `title` and inherits `description`
        this.setDescription(description);   // not set by the super must set explicitly here, everything else is inherited
        this.epic = epic;                   // not set by the super must set explicitly here, everything else is inherited
    }

    public Epic getEpic() {
        return epic;
    }

    public void setEpic(Epic epic) {
        this.epic = epic;
    }

}
