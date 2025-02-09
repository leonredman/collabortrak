package com.collabortrak.collabortrak.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) //  Disable CSRF (needed for Postman)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**").permitAll() //  Allow all API endpoints
                        .anyRequest().permitAll() //  Allow all other requests too
                )
                .httpBasic(httpBasic -> httpBasic.disable()); //  Disable Basic Auth
        return http.build();
    }
}