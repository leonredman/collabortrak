package com.collabortrak.collabortrak.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@RestController
public class TestController {

    @GetMapping("/api/test/simple-fetch")
    public ResponseEntity<String> simpleFetch() {
        return ResponseEntity.ok("{\"message\": \"Fetch works!\"}");
    }
}