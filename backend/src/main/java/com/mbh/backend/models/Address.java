package com.mbh.backend.models;

import java.util.List;

public class Address {
    private String id; //! for frontend reference (not Mongo _id)
    private String street;
    private String city;
    private String state;
    private String zip;
    private Boolean isBillingSameAsService;
    private List<JobHistory> jobHistory;

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getStreet() {
        return street;
    }
    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }

    public String getZip() {
        return zip;
    }
    public void setZip(String zip) {
        this.zip = zip;
    }

    public Boolean getIsBillingSameAsService() {
        return isBillingSameAsService;
    }
    public void setIsBillingSameAsService(Boolean billingSameAsService) {
        isBillingSameAsService = billingSameAsService;
    }

    public List<JobHistory> getJobHistory() {
        return jobHistory;
    }
    public void setJobHistory(List<JobHistory> jobHistory) {
        this.jobHistory = jobHistory;
    }
}
