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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

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
                .requiresChannel(channel -> channel
                        .anyRequest().requiresSecure() // Forces HTTPS
                )
                .csrf(csrf -> csrf.disable())
                .cors().and()
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login", "/api/login-success", "/api/login-failure").permitAll()
                        .requestMatchers("/api/tickets/**").permitAll() // <-- Permit all requests to /api/tickets
                        .requestMatchers(HttpMethod.POST, "/api/customers").hasRole("ADMIN")
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
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("https://collabortrak.vercel.app");
        config.addAllowedOrigin("https://collabortrak-production.up.railway.app");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.addExposedHeader("Access-Control-Allow-Origin");
        config.addExposedHeader("Set-Cookie");

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Bean
    public CommandLineRunner createDemoUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) { // Only create demo users if the table is empty
                List<User> demoUsers = List.of(
                        new User("admin", passwordEncoder.encode("admin123"), RoleType.ADMIN),
                        new User("manager", passwordEncoder.encode("manager123"), RoleType.MANAGER),
                        new User("dev", passwordEncoder.encode("dev123"), RoleType.DEVELOPER),
                        new User("qa", passwordEncoder.encode("qa123"), RoleType.QA_AGENT),
                        new User("web", passwordEncoder.encode("web123"), RoleType.WEBSITE_SPECIALIST)
                );
                userRepository.saveAll(demoUsers);
                System.out.println("Demo users added with hashed passwords completed!");
            } else {
                System.out.println("Existing users found in the database. Skipping demo user creation.");
            }
        };
    }
}
