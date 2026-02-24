package com.mbh.backend.services;

import com.mbh.backend.models.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import org.springframework.security.crypto.password.PasswordEncoder;

public class SeedDataFactory {

    // ---------------------------------------
    // SERVICES
    // ---------------------------------------
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

    // ---------------------------------------
    // DEMO CUSTOMER WITH FIXED ADDRESSES + JOBS
    // ---------------------------------------

    public static User buildDemoCustomerWithData(
            List<Service> services,
            PasswordEncoder passwordEncoder
    ) {

        User customer = new User();
        customer.setEmail("customer@masterblasterhub.com");
        customer.setPasswordHash(passwordEncoder.encode("password"));
        customer.setFirstName("Jane");
        customer.setLastName("Demo");
        customer.setRole(Role.CUSTOMER);
        customer.setIsActive(true);
        customer.setIsSystemAccount(false);
        customer.setCreatedAt(Instant.now());

        List<Address> addresses = new ArrayList<>();
        addresses.add(buildFixedAddress("257 Main St", services));
        addresses.add(buildFixedAddress("900 Oak Drive", services));
        customer.setAddresses(addresses);
        return customer;
    }

    private static Address buildFixedAddress(String street, List<Service> services) {

        Address address = new Address();
        address.setId(java.util.UUID.randomUUID().toString());
        address.setStreet(street);
        address.setCity("WGU City");
        address.setState("TX");
        address.setZip("75001");
        address.setIsBillingSameAsService(true);
        address.setJobHistory(buildFixedJobsForAddress(services));
        return address;
    }

    private static List<JobHistory> buildFixedJobsForAddress(List<Service> services) {

        List<JobHistory> jobs = new ArrayList<>();
        for (int i = 0; i < 3 && i < services.size(); i++) {
            Service service = services.get(i);
            JobHistory job = new JobHistory();
            job.setId(java.util.UUID.randomUUID().toString());
            job.setServiceId(service.getId());
            job.setServiceNameSnapshot(service.getName());
            job.setPricingType(service.getPricingType());
            job.setPriceUsed(service.getBasePrice());
            job.setMinimumCharge(service.getMinimumCharge());
            double squareFootage = 1200;
            if (service.getPricingType() == PricingType.PER_SQFT) {
                job.setSquareFootage(squareFootage);
            }
            double calculated = service.getPricingType() == PricingType.PER_SQFT
                    ? squareFootage * service.getBasePrice()
                    : service.getBasePrice();
            if (calculated < service.getMinimumCharge()) {
                calculated = service.getMinimumCharge();
            }
            job.setCalculatedQuote(calculated);
            if (i == 0) job.setStatus(JobStatus.REQUESTED);
            if (i == 1) job.setStatus(JobStatus.QUOTED);
            if (i == 2) job.setStatus(JobStatus.APPROVED);
            job.setRequestedDate(Instant.now().minusSeconds(86400));
            job.setCompletedDate(null);
            jobs.add(job);
        }
        return jobs;
    }

    // ---------------------------------------
    // RANDOM MOCK USERS
    // ---------------------------------------

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
                List<JobHistory> jobs = new ArrayList<>();
                int jobCount = 1 + random.nextInt(3);
                for (int j = 0; j < jobCount; j++) {
                    Service randomService = services.get(random.nextInt(services.size()));
                    JobHistory job = new JobHistory();
                    job.setId(java.util.UUID.randomUUID().toString());
                    job.setServiceId(randomService.getId());
                    job.setServiceNameSnapshot(randomService.getName());
                    job.setPricingType(randomService.getPricingType());
                    job.setPriceUsed(randomService.getBasePrice());
                    job.setMinimumCharge(randomService.getMinimumCharge());
                    double squareFootage = 500 + random.nextInt(2000);
                    if (randomService.getPricingType() == PricingType.PER_SQFT) {
                        job.setSquareFootage(squareFootage);
                    }
                    double calculated = randomService.getPricingType() == PricingType.PER_SQFT
                            ? squareFootage * randomService.getBasePrice()
                            : randomService.getBasePrice();
                    if (calculated < randomService.getMinimumCharge()) {
                        calculated = randomService.getMinimumCharge();
                    }
                    job.setCalculatedQuote(calculated);
                    job.setStatus(JobStatus.values()[random.nextInt(JobStatus.values().length)]);
                    job.setRequestedDate(Instant.now().minusSeconds(random.nextInt(30 * 24 * 60 * 60)));
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