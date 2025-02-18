package com.collabortrak.collabortrak.config;

import com.collabortrak.collabortrak.repositories.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
                        .requestMatchers("/api/tickets/epic").hasRole("WEBSITE_SPECIALIST")
                        .requestMatchers("/api/tickets/story").hasAnyRole("WEBSITE_SPECIALIST", "DEVELOPER")
                        .requestMatchers("/api/tickets/task").hasRole("DEVELOPER")
                        .requestMatchers("/api/tickets/bug").hasRole("QA_AGENT")
                        .anyRequest().permitAll()
                )
                .httpBasic(withDefaults()) // Basic Authentication
                .logout(logout -> logout  // 🔥 Corrected Placement
                        .logoutUrl("/api/logout")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(200);
                            response.getWriter().write("{\"message\": \"Logout successful\"}");
                            response.getWriter().flush();
                        })
                );

        return http.build();
    }
}
