package com.mbh.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.mbh.backend.models.User;

public interface UserRepository extends MongoRepository<User, String> {
}