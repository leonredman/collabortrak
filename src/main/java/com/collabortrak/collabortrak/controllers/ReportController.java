package com.collabortrak.collabortrak.controllers;

import com.collabortrak.collabortrak.entities.PlanType;
import com.collabortrak.collabortrak.entities.StatusType;
import com.collabortrak.collabortrak.repositories.TicketRepository;
import com.collabortrak.collabortrak.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/ticket-status")
    public ResponseEntity<Map<String, Long>> getTicketStatusCounts() {
        List<Object[]> results = ticketRepository.countTicketsByStatus();
        Map<String, Long> statusCounts = new HashMap<>();

        for (Object[] result : results) {
            StatusType status = (StatusType) result[0];
            Long count = (Long) result[1];
            statusCounts.put(status.name(), count);  // Enum to String
        }

        return ResponseEntity.ok(statusCounts);
    }

    @GetMapping("/tickets-by-employee")
    public ResponseEntity<Map<String, Long>> getTicketsByEmployee() {
        List<Object[]> results = ticketRepository.countTicketsByEmployee();
        Map<String, Long> employeeCounts = new HashMap<>();

        for (Object[] result : results) {
            String employeeName = result[0] + " " + result[1]; // Concat first & last name
            Long count = (Long) result[2];
            employeeCounts.put(employeeName, count);
        }

        return ResponseEntity.ok(employeeCounts);
    }

    @GetMapping("/product-plans")
    public ResponseEntity<Map<String, Long>> getProductsByPlanType() {
        List<Object[]> results = productRepository.countProductsByPlanType();
        Map<String, Long> planCounts = new HashMap<>();

        for (Object[] result : results) {
            PlanType plan = (PlanType) result[0]; // Cast
            Long count = (Long) result[1];
            planCounts.put(plan.name(), count); // Convert enum to String

        }

        return ResponseEntity.ok(planCounts);
    }
}
