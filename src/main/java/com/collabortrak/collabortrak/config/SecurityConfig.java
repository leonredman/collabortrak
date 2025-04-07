package com.collabortrak.collabortrak.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.collabortrak.collabortrak.entities.RoleType;
import com.collabortrak.collabortrak.entities.User;
import com.collabortrak.collabortrak.repositories.UserRepository;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return username -> userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowCredentials(true);
                    config.addAllowedOriginPattern("*"); // Allows all origins, but requires proper credentials handling
                    config.addAllowedHeader("*");
                    config.addAllowedMethod("*");
                    config.addExposedHeader("Access-Control-Allow-Origin");
                    config.addExposedHeader("Set-Cookie");
                    config.addExposedHeader("Access-Control-Allow-Credentials");
                    return config;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login", "/login-success", "/login-failure").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tickets").authenticated()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginProcessingUrl("/api/login")
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(HttpStatus.OK.value());
                            response.setContentType("application/json");

                            String username = authentication.getName();
                            String role = authentication.getAuthorities().toString();

                            response.getWriter().write("{\"message\": \"Back End Login successful\", \"username\": \"" + username + "\", \"role\": \"" + role + "\"}");
                        })
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType("application/json");
                            response.getWriter().write("{\"message\": \"Invalid username or password.\"}");
                        })
                        .permitAll()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .logout(logout -> logout
                        .logoutUrl("/api/logout")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpStatus.OK.value());
                            response.setContentType("application/json");
                            response.getWriter().write("{\"message\": \"Logout successful\"}");
                        })
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public CommandLineRunner createDemoUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                List<User> demoUsers = List.of(
                        new User("admin", passwordEncoder.encode("admin123"), RoleType.ADMIN),
                        new User("manager", passwordEncoder.encode("manager123"), RoleType.MANAGER),
                        new User("dev", passwordEncoder.encode("dev123"), RoleType.DEVELOPER),
                        new User("qa", passwordEncoder.encode("qa123"), RoleType.QA_AGENT),
                        new User("web", passwordEncoder.encode("web123"), RoleType.WEBSITE_SPECIALIST)
                );
                userRepository.saveAll(demoUsers);
                System.out.println("Demo users added with hashed passwords completed!");
            }
        };
    }
}
