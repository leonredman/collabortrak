package com.collabortrak.collabortrak.config;

import com.collabortrak.collabortrak.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;


import java.util.List;

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
                    var config = new CorsConfiguration();
                    config.setAllowCredentials(true);
                    config.addAllowedOrigin("http://localhost:5173");
                    config.addAllowedOrigin("https://collabortrak.vercel.app");
                    config.addAllowedOrigin("https://collabortrak-production.up.railway.app");
                    config.addAllowedHeader("*");
                    config.addAllowedMethod("*");
                    config.addExposedHeader("Access-Control-Allow-Origin");
                    config.addExposedHeader("Set-Cookie");
                    return config;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login", "/login-success", "/login-failure").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tickets/**").hasAnyRole("ADMIN", "MANAGER", "WEBSITE_SPECIALIST", "DEVELOPER", "QA_AGENT")
                        .requestMatchers(HttpMethod.POST, "/api/customers").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/customers/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/customers/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginProcessingUrl("/api/login")
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(HttpStatus.OK.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);

                            // Return user details as JSON
                            String username = authentication.getName();
                            String role = authentication.getAuthorities().toString();

                            response.getWriter().write("{\"message\": \"Back End Login successful\", \"username\": \"" + username + "\", \"role\": \"" + role + "\"}");
                        })
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/api/logout", "POST"))
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpStatus.OK.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write("{\"message\": \"Logout successful\"}");
                        })
                        .permitAll()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                );

        return http.build();
    }

    @Bean
    public CommandLineRunner createDemoUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                List<com.collabortrak.collabortrak.entities.User> demoUsers = List.of(
                        new com.collabortrak.collabortrak.entities.User("admin", passwordEncoder.encode("admin123"), com.collabortrak.collabortrak.entities.RoleType.ADMIN),
                        new com.collabortrak.collabortrak.entities.User("manager", passwordEncoder.encode("manager123"), com.collabortrak.collabortrak.entities.RoleType.MANAGER),
                        new com.collabortrak.collabortrak.entities.User("dev", passwordEncoder.encode("dev123"), com.collabortrak.collabortrak.entities.RoleType.DEVELOPER),
                        new com.collabortrak.collabortrak.entities.User("qa", passwordEncoder.encode("qa123"), com.collabortrak.collabortrak.entities.RoleType.QA_AGENT),
                        new com.collabortrak.collabortrak.entities.User("web", passwordEncoder.encode("web123"), com.collabortrak.collabortrak.entities.RoleType.WEBSITE_SPECIALIST)
                );
                userRepository.saveAll(demoUsers);
                System.out.println("Demo users added with hashed passwords completed!");
            }
        };
    }
}
