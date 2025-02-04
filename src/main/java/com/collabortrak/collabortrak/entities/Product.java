package com.collabortrak.collabortrak.entities;

import jakarta.persistence.*;

import java.util.Date;
@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan", nullable = false)
    private PlanType category;

    @Column(name = "domain", length = 100)
    private String domain;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "date_purchased", nullable = false, updatable = false)
    private Date date_purchased= new Date();

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "renewal_date", nullable = false, updatable = false)
    private Date renewal_date= new Date();

    public Product() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlanType getCategory() {
        return category;
    }

    public void setCategory(PlanType category) {
        this.category = category;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public Date getDate_purchased() {
        return date_purchased;
    }

    public void setDate_purchased(Date date_purchased) {
        this.date_purchased = date_purchased;
    }

    public Date getRenewal_date() {
        return renewal_date;
    }

    public void setRenewal_date(Date renewal_date) {
        this.renewal_date = renewal_date;
    }
}

