package com.mbh.backend.repositories;

import com.mbh.backend.models.Service;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ServiceRepository extends MongoRepository<Service, String> {
}
