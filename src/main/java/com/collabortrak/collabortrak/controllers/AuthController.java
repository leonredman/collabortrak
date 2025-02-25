package com.collabortrak.collabortrak.controllers;

// import com.collabortrak.collabortrak.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.client.HttpClientErrorException;

@RestController
@RequestMapping("/api")
public class AuthController {

    @GetMapping("/login-success")
    public ResponseEntity<String> loginSuccess(Authentication authentication) {
        String role = authentication.getAuthorities().toString();
        return ResponseEntity.ok("{\"message\": \"Login successful\", \"role\": \"" + role + "\"}");
    }

    @GetMapping("/login-failure")
    public ResponseEntity<String> loginFailure() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Invalid username or password.\"}");
    }

    @GetMapping("/logout-success")
    public ResponseEntity<String> logoutSuccess() {
        return ResponseEntity.ok("{\"message\": \"Logout successful\"}");
    }

   // private final UserRepository userRepository;

   // public AuthController(UserRepository userRepository) {
   //     this.userRepository = userRepository;
    //}

    // Success handler for login
//    @GetMapping("/login-success")
//    public ResponseEntity<String> loginSuccess(Authentication authentication) {
//        if (authentication != null && authentication.isAuthenticated()) {
//            String role = authentication.getAuthorities().toString();
//            System.out.println("Authentication successful for user: " + authentication.getName());
//            return ResponseEntity.ok("{\"message\": \"Login successful\", \"role\": \"" + role + "\"}");
//        }
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Unauthorized.\"}");
//    }

    // Failure handler for login
//    @GetMapping("/login-failure")
//    public ResponseEntity<String> loginFailure() {
//        System.out.println("Authentication failed.");
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Invalid username or password.\"}");
//    }

    // Test endpoint for UserDetailsService
//    @GetMapping("/testUserDetailsService/{username}")
//    public String testUserDetailsService(@PathVariable String username) {
//        System.out.println("Attempting to find user with username: [" + username + "]");
//        return userRepository.findByUsername(username)
//                .map(user -> "UserDetailsService called successfully for username: " + username)
//                .orElse("User not found with username: " + username);
//    }
}
