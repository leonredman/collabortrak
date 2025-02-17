package com.collabortrak.collabortrak.config;

import com.collabortrak.collabortrak.repositories.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return email -> userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for testing
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/tickets/**").authenticated()
                        .requestMatchers("/api/employees/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers("/api/tickets/epic").hasRole("WEBSITE_SPECIALIST")  // Website Specialists create Epics & Stories
                        .requestMatchers("/api/tickets/story").hasAnyRole("WEBSITE_SPECIALIST", "DEVELOPER")  // Specialists and Developers create Stories
                        .requestMatchers("/api/tickets/task").hasRole("DEVELOPER")  // Only Developers create Tasks
                        .requestMatchers("/api/tickets/bug").hasRole("QA_AGENT")  // Only QA Agents create Bugs
                        .anyRequest().permitAll()
                )
                .httpBasic(withDefaults()); // Use Basic Authentication
        return http.build();
    }
}
