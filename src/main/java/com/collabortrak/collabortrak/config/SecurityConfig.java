package com.collabortrak.collabortrak.config;

import com.collabortrak.collabortrak.entities.RoleType;
import com.collabortrak.collabortrak.entities.User;
import com.collabortrak.collabortrak.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return username -> userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance(); // Use plain text passwords for simplicity
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(withDefaults()) // Enable CORS
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login","/login-success", "/login-failure").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginProcessingUrl("/api/login")
                        .defaultSuccessUrl("/api/login-success", true)
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
                        .logoutSuccessUrl("/api/logout-success")
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }


    @Bean
    public CommandLineRunner createDemoUsers(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                List<User> demoUsers = List.of(
                        new User("admin", "admin123", RoleType.ADMIN),
                        new User("manager", "manager123", RoleType.MANAGER),
                        new User("dev", "dev123", RoleType.DEVELOPER),
                        new User("qa", "qa123", RoleType.QA_AGENT),
                        new User("web", "web123", RoleType.WEBSITE_SPECIALIST)
                );
                userRepository.saveAll(demoUsers);
                System.out.println("Demo users inserted successfully!");
            }
        };
    }
}
