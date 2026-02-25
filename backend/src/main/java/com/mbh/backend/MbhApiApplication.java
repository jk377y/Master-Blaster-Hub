package com.mbh.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
// Entry point for the Spring Boot backend application
public class MbhApiApplication {

	// Starts the application context
	public static void main(String[] args) {
		SpringApplication.run(MbhApiApplication.class, args);
	}
}