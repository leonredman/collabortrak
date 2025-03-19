package com.collabortrak.collabortrak.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {

    @GetMapping("/login-success")
    public ResponseEntity<String> loginSuccess(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"message\": \"User not authenticated\"}");
        }

        String username = authentication.getName(); // Get the authenticated username
        String role = authentication.getAuthorities().toString();

        return ResponseEntity.ok("{\"message\": \"Login successful\", \"username\": \"" + username + "\", \"role\": \"" + role + "\"}");

    }

    @GetMapping("/login-failure")
    public ResponseEntity<String> loginFailure() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Invalid username or password.\"}");
    }

    @GetMapping("/logout-success")
    public ResponseEntity<String> logoutSuccess() {
        return ResponseEntity.ok("{\"message\": \"Logout successful\"}");
    }
}
