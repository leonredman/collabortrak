package com.collabortrak.collabortrak.config;

import java.util.List;

import org.apache.tomcat.util.http.Rfc6265CookieProcessor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.web.embedded.tomcat.TomcatContextCustomizer;
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
import org.springframework.beans.factory.annotation.Value;

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

    @Value("${security.require-https:false}")
    private boolean requireHttps;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // toggle forces https on login redirect for prod/disables for dev
        if (requireHttps) {
            http.requiresChannel(channel -> channel.anyRequest().requiresSecure());
        }

        http

                .csrf(csrf -> csrf.disable())
                .cors().and()
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login", "/api/login-success", "/api/login-failure").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tickets").hasAnyRole("ADMIN", "MANAGER", "WEBSITE_SPECIALIST", "DEVELOPER", "QA_AGENT")
                        .requestMatchers(HttpMethod.POST, "/api/customers").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                // Bug fix for safari
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType("application/json");
                            response.getWriter().write("{\"message\": \"Unauthorized or session expired\"}");
                        })
                )
                .formLogin(form -> form
                        .loginProcessingUrl("/api/login")

                        .successHandler((request, response, authentication) -> {
                            request.getSession(); // This ensures a session exists
                            System.out.println("Login success: " + authentication.getName());
                            System.out.println("Session ID: " + request.getSession().getId());

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
        config.setAllowCredentials(true);  // this added to fix safari bug not setting cookies

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Bean
    public CommandLineRunner createDemoUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) { // Only create demo users if the table is empty
                List<User> demoUsers = List.of(
                        new User("admin", passwordEncoder.encode("adminSecure2025"), RoleType.ADMIN),
                        new User("manager", passwordEncoder.encode("managerSecure2025"), RoleType.MANAGER),
                        new User("dev", passwordEncoder.encode("devSecure2025"), RoleType.DEVELOPER),
                        new User("qa", passwordEncoder.encode("qaSecure2025"), RoleType.QA_AGENT),
                        new User("web", passwordEncoder.encode("webSecure2025"), RoleType.WEBSITE_SPECIALIST)
                );
                userRepository.saveAll(demoUsers);
                System.out.println("Demo users added with hashed passwords completed!");
            } else {
                System.out.println("Existing users found in the database. Skipping demo user creation.");
            }
        };
    }
    // fix cross site errors on mobile Safari/chrome ios
    @Bean
    public TomcatContextCustomizer cookieProcessorCustomizer() {
        return context -> {
            Rfc6265CookieProcessor processor = new Rfc6265CookieProcessor();
            processor.setSameSiteCookies("None");
            context.setCookieProcessor(processor);
        };
    }
}
