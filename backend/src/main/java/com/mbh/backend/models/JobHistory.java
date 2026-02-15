package com.mbh.backend.models;

import java.time.LocalDate;

public class JobHistory {

    private String serviceId; //! references Service collection
    private String serviceNameSnapshot;
    private Double squareFootage;
    private PricingType pricingType;
    private Double priceUsed;
    private Double minimumCharge;
    private Double calculatedQuote;
    private JobStatus status;
    private LocalDate requestedDate;
    private LocalDate completedDate;

    public String getServiceId() {
        return serviceId;
    }
    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceNameSnapshot() {
        return serviceNameSnapshot;
    }
    public void setServiceNameSnapshot(String serviceNameSnapshot) {
        this.serviceNameSnapshot = serviceNameSnapshot;
    }

    public Double getSquareFootage() {
        return squareFootage;
    }
    public void setSquareFootage(Double squareFootage) {
        this.squareFootage = squareFootage;
    }

    public PricingType getPricingType() {
        return pricingType;
    }
    public void setPricingType(PricingType pricingType) {
        this.pricingType = pricingType;
    }

    public Double getPriceUsed() {
        return priceUsed;
    }
    public void setPriceUsed(Double priceUsed) {
        this.priceUsed = priceUsed;
    }

    public Double getMinimumCharge() {
        return minimumCharge;
    }
    public void setMinimumCharge(Double minimumCharge) {
        this.minimumCharge = minimumCharge;
    }

    public Double getCalculatedQuote() {
        return calculatedQuote;
    }
    public void setCalculatedQuote(Double calculatedQuote) {
        this.calculatedQuote = calculatedQuote;
    }

    public JobStatus getStatus() {
        return status;
    }
    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public LocalDate getRequestedDate() {
        return requestedDate;
    }
    public void setRequestedDate(LocalDate requestedDate) {
        this.requestedDate = requestedDate;
    }

    public LocalDate getCompletedDate() {
        return completedDate;
    }
    public void setCompletedDate(LocalDate completedDate) {
        this.completedDate = completedDate;
    }
}
