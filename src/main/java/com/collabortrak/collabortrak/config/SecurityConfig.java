package com.collabortrak.collabortrak.config;

import com.collabortrak.collabortrak.entities.RoleType;
import com.collabortrak.collabortrak.entities.User;
import com.collabortrak.collabortrak.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
//@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return username -> userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Keep your CORS configuration
   // @Bean
     //  public WebMvcConfigurer corsConfigurer() {
    //    return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://localhost:5173",
                                "https://collabortrak.vercel.app",
                                "https://collabortrak-production.up.railway.app",
                                "https://collabortrak-dqeu4gtch-leonredmans-projects.vercel.app"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
        //    }
    //    };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🚫 Disable Spring Security by commenting out the SecurityFilterChain
    /*
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(withDefaults())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login", "/login-success", "/login-failure").permitAll()

                        // Allow GET for customers to authenticated users
                        .requestMatchers(HttpMethod.GET, "/api/customers/**").hasAnyRole("ADMIN", "MANAGER", "WEBSITE_SPECIALIST", "DEVELOPER", "QA_AGENT")

                        // Only admins can update customer APIs
                        .requestMatchers(HttpMethod.POST, "/api/customers")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/customers/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/customers/**")
                        .hasRole("ADMIN")

                        .anyRequest().authenticated()
                )

                .exceptionHandling(e -> e
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType("application/json");
                            response.getWriter().write("{\"message\": \"Unauthorized access\"}");
                        })
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
    */

    // ✅ Your CommandLineRunner remains intact
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
