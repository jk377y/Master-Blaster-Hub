package com.mbh.backend.repositories;

import com.mbh.backend.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

// Repository for CRUD operations on User documents
public interface UserRepository extends MongoRepository<User, String> {

    // Finds a user by unique email
    Optional<User> findByEmail(String email);
}