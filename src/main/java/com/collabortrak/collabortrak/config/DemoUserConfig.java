package com.collabortrak.collabortrak.config;

import com.collabortrak.collabortrak.entities.User;
import com.collabortrak.collabortrak.entities.RoleType;
import com.collabortrak.collabortrak.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

// insert sample users to DB

@Configuration
public class DemoUserConfig {

    @Bean
    CommandLineRunner insertDemoUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) { // Only insert if empty
                List<User> demoUsers = List.of(
                        new User("admin@demo.com", passwordEncoder.encode("admin123"), RoleType.ADMIN),
                        new User("manager@demo.com", passwordEncoder.encode("manager123"), RoleType.MANAGER),
                        new User("dev@demo.com", passwordEncoder.encode("dev123"), RoleType.DEVELOPER),
                        new User("qa@demo.com", passwordEncoder.encode("qa123"), RoleType.QA_AGENT),
                        new User("web@demo.com", passwordEncoder.encode("web123"), RoleType.WEBSITE_SPECIALIST)
                );
                userRepository.saveAll(demoUsers);
                System.out.println("Demo users inserted successfully!");
            }
        };
    }
}
