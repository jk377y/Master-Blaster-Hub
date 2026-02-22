package com.mbh.backend.services;

import com.mbh.backend.models.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import org.springframework.security.crypto.password.PasswordEncoder;


public class SeedDataFactory {
    
    public static List<Service> buildDefaultServices() {
        
        Service driveway = new Service();
        driveway.setName("Driveway Cleaning");
        driveway.setCategory("Exterior");
        driveway.setDescription("High pressure cleaning for concrete and asphalt driveways.");
        driveway.setPricingType(PricingType.PER_SQFT);
        driveway.setBasePrice(0.25);
        driveway.setMinimumCharge(150.0);
        driveway.setIsActive(true);
        
        Service houseWash = new Service();
        houseWash.setName("House Soft Wash");
        houseWash.setCategory("Exterior");
        houseWash.setDescription("Low-pressure soft wash for siding and exterior walls.");
        houseWash.setPricingType(PricingType.PER_SQFT);
        houseWash.setBasePrice(0.18);
        houseWash.setMinimumCharge(200.0);
        houseWash.setIsActive(true);
        
        Service patio = new Service();
        patio.setName("Patio Cleaning");
        patio.setCategory("Exterior");
        patio.setDescription("Deep surface cleaning for patios and walkways.");
        patio.setPricingType(PricingType.PER_SQFT);
        patio.setBasePrice(0.22);
        patio.setMinimumCharge(125.0);
        patio.setIsActive(true);
        
        Service gutter = new Service();
        gutter.setName("Gutter Cleaning");
        gutter.setCategory("Roofing");
        gutter.setDescription("Removal of debris and flushing of gutters.");
        gutter.setPricingType(PricingType.FLAT);
        gutter.setBasePrice(175.0);
        gutter.setMinimumCharge(175.0);
        gutter.setIsActive(true);
        
        Service fence = new Service();
        fence.setName("Fence Washing");
        fence.setCategory("Exterior");
        fence.setDescription("Pressure washing for wood and vinyl fencing.");
        fence.setPricingType(PricingType.PER_SQFT);
        fence.setBasePrice(0.20);
        fence.setMinimumCharge(100.0);
        fence.setIsActive(true);
        
        return List.of(driveway, houseWash, patio, gutter, fence);
    }
    
    /**
     * i need to seed some mock users with addresses and job history to test the app with more realistic data. 
     * this will create 25 users with 1–2 addresses each, and each address will have 0–3 random jobs from the 
     * seeded services. this should give me a good variety of data to work with for while testing and developing.
    */
   public static List<User> buildMockUsers(List<Service> services, PasswordEncoder passwordEncoder) {
    
    List<User> users = new ArrayList<>();
        Random random = new Random();
        for (int i = 1; i <= 50; i++) {
            User user = new User();
            user.setEmail("user" + i + "@test.com");
            user.setPasswordHash(passwordEncoder.encode("pw"));
            user.setFirstName("User");
            user.setLastName("Number" + i);
            user.setRole(Role.CUSTOMER);
            user.setIsActive(true);
            user.setIsSystemAccount(false);
            user.setCreatedAt(Instant.now());

            // create 1–2 addresses per user
            List<Address> addresses = new ArrayList<>();
            int addressCount = 1 + random.nextInt(2);
            for (int a = 0; a < addressCount; a++) {
                Address address = new Address();
                address.setId(java.util.UUID.randomUUID().toString());
                address.setStreet((100 + random.nextInt(900)) + " Main St");
                address.setCity("Sample City");
                address.setState("TX");
                address.setZip("75001");
                address.setIsBillingSameAsService(true);

                // create job history for this address with 0–3 jobs randomly
                List<JobHistory> jobs = new ArrayList<>();
                int jobCount = random.nextInt(4); // 0–3 jobs
                for (int j = 0; j < jobCount; j++) {
                    Service randomService = services.get(random.nextInt(services.size()));
                    JobHistory job = new JobHistory();
                    job.setServiceId(randomService.getId());
                    job.setServiceNameSnapshot(randomService.getName());
                    job.setPricingType(randomService.getPricingType());
                    job.setPriceUsed(randomService.getBasePrice());
                    job.setMinimumCharge(randomService.getMinimumCharge());
                    double squareFootage = 500 + random.nextInt(2000);
                    job.setSquareFootage(
                            randomService.getPricingType() == PricingType.PER_SQFT
                                    ? squareFootage
                                    : null
                    );

                    double calculated = randomService.getPricingType() == PricingType.PER_SQFT
                            ? squareFootage * randomService.getBasePrice()
                            : randomService.getBasePrice();
                    if (calculated < randomService.getMinimumCharge()) {
                        calculated = randomService.getMinimumCharge();
                    }
                    job.setCalculatedQuote(calculated);
                    JobStatus[] statuses = JobStatus.values();
                    job.setStatus(statuses[random.nextInt(statuses.length)]);
                    job.setRequestedDate(LocalDate.now().minusDays(random.nextInt(30)));
                    job.setCompletedDate(null);
                    jobs.add(job);
                }
                address.setJobHistory(jobs);
                addresses.add(address);
            }
            user.setAddresses(addresses);
            users.add(user);
        }
        return users;
    }
}
