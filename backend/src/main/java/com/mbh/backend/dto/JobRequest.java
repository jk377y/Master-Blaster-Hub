package com.mbh.backend.dto;

public class JobRequest {
    private String serviceId;
    private Double squareFootage;

    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }

    public Double getSquareFootage() { return squareFootage; }
    public void setSquareFootage(Double squareFootage) { this.squareFootage = squareFootage; }
}