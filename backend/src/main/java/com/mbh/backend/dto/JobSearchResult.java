package com.mbh.backend.dto;

import com.mbh.backend.models.JobStatus;
import java.time.Instant;

public class JobSearchResult {
    private String id;
    private String userEmail;
    private String city;
    private String serviceName;
    private Double squareFootage;
    private Double calculatedQuote;
    private JobStatus status;
    private Instant requestedDate;
    public JobSearchResult() {}
    public JobSearchResult(String id,
                           String userEmail,
                           String city,
                           String serviceName,
                           Double squareFootage,
                           Double calculatedQuote,
                           JobStatus status,
                           Instant requestedDate) {
        this.id = id;
        this.userEmail = userEmail;
        this.city = city;
        this.serviceName = serviceName;
        this.squareFootage = squareFootage;
        this.calculatedQuote = calculatedQuote;
        this.status = status;
        this.requestedDate = requestedDate;
    }
    public String getId() { return id; }
    public String getUserEmail() { return userEmail; }
    public String getCity() { return city; }
    public String getServiceName() { return serviceName; }
    public Double getSquareFootage() { return squareFootage; }
    public Double getCalculatedQuote() { return calculatedQuote; }
    public JobStatus getStatus() { return status; }
    public Instant getRequestedDate() { return requestedDate; }
}