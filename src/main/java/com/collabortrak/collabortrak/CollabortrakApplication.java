package com.collabortrak.collabortrak;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.collabortrak.collabortrak.repositories")  // Spring must scan repositories
public class CollabortrakApplication {

	public static void main(String[] args) {

		SpringApplication.run(CollabortrakApplication.class, args);
	}

}
