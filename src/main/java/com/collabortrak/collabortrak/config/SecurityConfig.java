package com.collabortrak.collabortrak.config;

import com.collabortrak.collabortrak.entities.RoleType;
import com.collabortrak.collabortrak.entities.User;
import com.collabortrak.collabortrak.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@CrossOrigin
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return username -> userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);

        corsConfiguration.setAllowedOrigins(Arrays.asList(
                "https://collabortrak-dqeu4gtch-leonredmans-projects.vercel.app",
                "https://*.vercel.app",
                "https://collabortrak-dqeu4g.vercel.app",
                "https://collabortrak-production.up.railway.app",
                "http://localhost:5173"
        ));

        corsConfiguration.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization"));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfiguration.addExposedHeader("Access-Control-Allow-Origin");
        corsConfiguration.addExposedHeader("Access-Control-Allow-Credentials");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        logger.info("Configuring security filter chain...");
        http
                .csrf(csrf -> csrf.disable())
                .cors().configurationSource(corsConfigurationSource()) // Re-enabled CORS to properly integrate with Spring Security
                .and()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()  // Allow preflight CORS requests
                        .requestMatchers("/api/login", "/api/logout", "/api/logout-success", "/login-success", "/login-failure").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/customers/**").hasAnyRole("ADMIN", "MANAGER", "WEBSITE_SPECIALIST", "DEVELOPER", "QA_AGENT")
                        .requestMatchers(HttpMethod.POST, "/api/customers").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/customers/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/customers/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginProcessingUrl("/api/login")
                        .successHandler((request, response, authentication) -> {
                            logger.info("Login successful for user: {}", authentication.getName());
                            response.setStatus(HttpStatus.OK.value());
                            response.setContentType("application/json");
                            response.getWriter().write("{\"message\": \"Login successful\"}");
                        })
                        .failureHandler((request, response, exception) -> {
                            logger.warn("Login failed: {}", exception.getMessage());
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
                )
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType("application/json");
                            response.getWriter().write("{\"message\": \"Unauthorized access\"}");
                        })
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
