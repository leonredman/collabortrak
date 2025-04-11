package com.collabortrak.collabortrak;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.collabortrak.collabortrak.dto.TicketDTO;
import com.collabortrak.collabortrak.entities.*;
import com.collabortrak.collabortrak.repositories.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

public class TicketControllerTest {

    private Ticket testTicket;
    private TicketDTO testTicketDTO;

    @BeforeEach
    void setUp() {
        testTicket = new Ticket();
        testTicket.setId(1L);
        testTicket.setTitle("Test Ticket");
        testTicket.setDescription("This is a test ticket.");
        testTicket.setStatus(StatusType.OPEN);
        testTicket.setCategory(CategoryType.NEW_BUILD);
        testTicket.setPriority(PriorityType.HIGH);
        testTicket.setTicketType(TicketType.TASK);
        testTicket.setCreatedDate(LocalDateTime.now());

        Customer customer = new Customer();
        customer.setId(99L);
        testTicket.setCustomer(customer);

        testTicketDTO = new TicketDTO(testTicket);
    }


    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockBean
    private TicketRepository ticketRepository;

    @MockBean
    private EmployeeRepository employeeRepository;

    @MockBean
    private CustomerRepository customerRepository;

    @MockBean
    private EpicRepository epicRepository;

    @MockBean
    private StoryRepository storyRepository;


    @Test
    void testTicketDTOFromTicketEntity() {
        // Arrange - Create a Ticket with minimal working fields
        Customer customer = new Customer();
        customer.setId(1L);

        Employee employee = new Employee();
        employee.setId(2L);
        employee.setFirstName("John");
        employee.setLastName("Doe");

        Ticket ticket = new Ticket();
        ticket.setId(10L);
        ticket.setTitle("Sample Ticket");
        ticket.setDescription("This is a test");
        ticket.setStatus(StatusType.OPEN);
        ticket.setPriority(PriorityType.MEDIUM);
        ticket.setCategory(CategoryType.NEW_BUILD);
        ticket.setTicketTrackingNumber("TRACK-001");
        ticket.setCreatedDate(LocalDateTime.now());
        ticket.setDueDate(LocalDateTime.now().plusDays(7));
        ticket.setLastUpdate(LocalDateTime.now());
        ticket.setCustomer(customer);
        ticket.setAssignedEmployee(employee);
        ticket.setTicketType(TicketType.EPIC);

        // Act
        TicketDTO dto = new TicketDTO(ticket);

        // Assert
        assertEquals(ticket.getId(), dto.getId());
        assertEquals(ticket.getTitle(), dto.getTitle());
        assertEquals(ticket.getDescription(), dto.getDescription());
        assertEquals("OPEN", dto.getStatus());
        assertEquals("MEDIUM", dto.getPriority());
        assertEquals("NEW_BUILD", dto.getCategory());
        assertEquals(ticket.getTicketTrackingNumber(), dto.getTicketTrackingNumber());
        assertEquals(ticket.getCustomer().getId(), dto.getCustomerId());
        assertEquals(ticket.getAssignedEmployee().getId(), dto.getAssignedEmployeeId());
        assertEquals("John", dto.getAssignedEmployeeFirstName());
        assertEquals("Doe", dto.getAssignedEmployeeLastName());
        assertEquals(ticket.getTicketType(), dto.getTicketType());
    }

    @Test
    void testTicketDTOThrowsWhenCustomerIsNull() {
        // Arrange
        Ticket ticket = new Ticket();
        ticket.setId(20L);
        ticket.setTitle("Null Customer Ticket");
        ticket.setDescription("This ticket has no customer.");
        ticket.setStatus(StatusType.OPEN);
        ticket.setPriority(PriorityType.LOW);
        ticket.setCategory(CategoryType.NEW_BUILD);
        ticket.setTicketTrackingNumber("TRACK-NULL");
        ticket.setCreatedDate(LocalDateTime.now());
        ticket.setTicketType(TicketType.BUG);
        // Intentionally leaving customer as null

        // Act + Assert
        assertThrows(NullPointerException.class, () -> {
            new TicketDTO(ticket);
        });
    }



}
