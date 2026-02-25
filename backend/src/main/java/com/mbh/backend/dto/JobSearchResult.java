package com.mbh.backend.dto;

import com.mbh.backend.models.JobStatus;

import java.time.Instant;

// DTO for returning job search results in admin reports
public class JobSearchResult {

    private String id;
    private String firstName;
    private String lastName;
    private String userEmail;
    private String street;
    private String city;
    private String serviceName;
    private Double squareFootage;
    private Double calculatedQuote;
    private JobStatus status;
    private Instant requestedDate;

    // Default constructor for serialization
    public JobSearchResult() {}

    // Builds a single job row for search results
    public JobSearchResult(String id,
                           String firstName,
                           String lastName,
                           String userEmail,
                           String street,
                           String city,
                           String serviceName,
                           Double squareFootage,
                           Double calculatedQuote,
                           JobStatus status,
                           Instant requestedDate) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userEmail = userEmail;
        this.street = street;
        this.city = city;
        this.serviceName = serviceName;
        this.squareFootage = squareFootage;
        this.calculatedQuote = calculatedQuote;
        this.status = status;
        this.requestedDate = requestedDate;
    }

    public String getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getUserEmail() { return userEmail; }
    public String getStreet() { return street; }
    public String getCity() { return city; }
    public String getServiceName() { return serviceName; }
    public Double getSquareFootage() { return squareFootage; }
    public Double getCalculatedQuote() { return calculatedQuote; }
    public JobStatus getStatus() { return status; }
    public Instant getRequestedDate() { return requestedDate; }
}