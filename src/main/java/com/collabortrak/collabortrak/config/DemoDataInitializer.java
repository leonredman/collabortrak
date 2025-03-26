package com.collabortrak.collabortrak.config;

import com.collabortrak.collabortrak.entities.*;
import com.collabortrak.collabortrak.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DemoDataInitializer {

    @Bean
    public CommandLineRunner seedAllData(
            EmployeeRepository employeeRepo,
            CustomerRepository customerRepo,
            TicketRepository ticketRepo,
            EpicRepository epicRepo,
            StoryRepository storyRepo
    ) {
        return args -> {

            if (employeeRepo.count() == 0) {
                List<Employee> employees = List.of(
                        new Employee("John", "Doe", "john@collabrotrak.com", "718-555-1111", RoleType.ADMIN),
                        new Employee("Jane", "Doe", "jane@collabortrak.com", "718-555-2222", RoleType.MANAGER),
                        new Employee("Richard", "Smith", "richard@collabortrak.com", "718-555-3333", RoleType.DEVELOPER),
                        new Employee("Alice", "Anderson", "alice@collarbortrak.com", "718-555-4444", RoleType.QA_AGENT),
                        new Employee("Cara", "Clark", "cara@collabortrak.com", "718-555-5555", RoleType.WEBSITE_SPECIALIST)
                );
                employeeRepo.saveAll(employees);
                System.out.println("Seeded demo employees");
            }

            if (customerRepo.count() == 0) {
                List<Customer> customers = List.of(
                        new Customer("Peter", "Parker", "peter@example.com", "212-555-1234", "123 Main St", "New York", "NY", "10019", "USA"),
                        new Customer("Tony", "Stark", "tony@example.com", "212-555-5678", "10880 Malibu Point", "New York", "NY", "10002", "USA"),
                        new Customer("Steve", "Rogers", "steve@example.com", "212-555-4321", "569 Leaman Place", "New York", "NY", "10003", "USA"),
                        new Customer("Natasha", "Romanoff", "natasha@example.com", "212-555-9876", "37 Greenpoint Ave", "New York", "NY", "10004", "USA"),
                        new Customer("Bruce", "Banner", "bruce@example.com", "212-555-2468", "177A Bleecker Street", "New York", "NY", "10005", "USA")
                );
                customerRepo.saveAll(customers);
                System.out.println("Seeded demo customers");
            }

            Customer customer = customerRepo.findAll().get(0);
            Employee employee = employeeRepo.findAll().get(2); // Richard the Developer

            if (ticketRepo.count() == 0 && epicRepo.count() == 0 && storyRepo.count() == 0) {

                List<StatusType> statuses = List.of(
                        StatusType.OPEN,
                        StatusType.READY,
                        StatusType.BUILD_IN_PROGRESS,
                        StatusType.QA_IN_PROGRESS,
                        StatusType.QA_NEEDS_EDITS,
                        StatusType.QA_EDITS_COMPLETE
                );

                String[] epicTitles = {
                        "New Product Setup",
                        "Homepage Update",
                        "WooCommerce Settings Review",
                        "Content Cleanup",
                        "Blog Layout Refresh",
                        "Accessibility Review"
                };

                String[] epicDescriptions = {
                        "Customer needs help adding new products to the store.",
                        "Refreshing the homepage layout and graphics.",
                        "Reviewing store settings and checkout process.",
                        "Cleaning up outdated content and images site-wide.",
                        "Improving the design and structure of the blog section.",
                        "Making small adjustments to improve accessibility."
                };

                String[] storyTitles = {
                        "Add Products to Store",
                        "Update Homepage Images",
                        "Fix Checkout Layout",
                        "Replace Team Bios",
                        "Adjust Blog Formatting",
                        "Improve Text Visibility"
                };

                String[] storyDescriptions = {
                        "Adding product images, details, and pricing in WooCommerce.",
                        "Replacing hero and banner images with updated visuals.",
                        "Cleaning up spacing and fields on the checkout page.",
                        "Updating staff bios and headshots on the About page.",
                        "Improving formatting for blog posts and category pages.",
                        "Adjusting font size and contrast for better readability."
                };

                for (int i = 0; i < statuses.size(); i++) {
                    StatusType status = statuses.get(i);

                    // Create Epic Ticket
                    Ticket epicTicket = new Ticket();
                    epicTicket.setTitle(epicTitles[i]);
                    epicTicket.setDescription(epicDescriptions[i]);
                    epicTicket.setTicketType(TicketType.EPIC);
                    epicTicket.setStatus(status);
                    epicTicket.setPriority(PriorityType.HIGH);
                    epicTicket.setCategory(CategoryType.NEW_BUILD);
                    epicTicket.setCustomer(customer);
                    epicTicket.setAssignedEmployee(employee);
                    epicTicket.setCreatedDate(LocalDateTime.now());
                    epicTicket.setLastUpdate(LocalDateTime.now());
                    epicTicket.setDueDate(LocalDateTime.now().plusDays(14));
                    ticketRepo.save(epicTicket);

                    Epic epic = new Epic();
                    epic.setTitle(epicTicket.getTitle());
                    epic.setDescription(epicTicket.getDescription());
                    epic.setStatus(epicTicket.getStatus());
                    epic.setPriority(epicTicket.getPriority());
                    epic.setCustomer(customer);
                    epic.setTicketId(epicTicket.getId());
                    epicRepo.save(epic);

                    // Create Story Ticket
                    Ticket storyTicket = new Ticket();
                    storyTicket.setTitle(storyTitles[i]);
                    storyTicket.setDescription(storyDescriptions[i]);
                    storyTicket.setTicketType(TicketType.STORY);
                    storyTicket.setStatus(status);
                    storyTicket.setPriority(PriorityType.MEDIUM);
                    storyTicket.setCategory(CategoryType.NEW_BUILD);
                    storyTicket.setCustomer(customer);
                    storyTicket.setAssignedEmployee(employee);
                    storyTicket.setCreatedDate(LocalDateTime.now());
                    storyTicket.setLastUpdate(LocalDateTime.now());
                    storyTicket.setDueDate(LocalDateTime.now().plusDays(7));
                    ticketRepo.save(storyTicket);

                    Story story = new Story();
                    story.setTitle(storyTicket.getTitle());
                    story.setDescription(storyTicket.getDescription());
                    story.setStatus(storyTicket.getStatus());
                    story.setPriority(storyTicket.getPriority());
                    story.setEpic(epic);
                    story.setTicketId(storyTicket.getId());
                    storyRepo.save(story);
                }

                System.out.println("Seeded 6 Epics and 6 Stories with unique statuses and titles.");
            }
        };
    }
}
