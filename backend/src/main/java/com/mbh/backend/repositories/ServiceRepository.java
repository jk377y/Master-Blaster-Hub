package com.mbh.backend.repositories;

import com.mbh.backend.models.Service;
import org.springframework.data.mongodb.repository.MongoRepository;

// Repository for CRUD operations on Service documents
public interface ServiceRepository extends MongoRepository<Service, String> {
}