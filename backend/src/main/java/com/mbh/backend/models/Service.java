package com.mbh.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "services")
// Mongo document representing an available service
public class Service {

    @Id
    private String id;

    private String name;
    private String category;
    private String description;
    private PricingType pricingType;
    private Double basePrice;
    private Double minimumCharge;
    private Boolean isActive;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description;
    }

    public PricingType getPricingType() { return pricingType; }
    public void setPricingType(PricingType pricingType) {
        this.pricingType = pricingType;
    }

    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) {
        this.basePrice = basePrice;
    }

    public Double getMinimumCharge() { return minimumCharge; }
    public void setMinimumCharge(Double minimumCharge) {
        this.minimumCharge = minimumCharge;
    }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) {
        this.isActive = active;
    }
}