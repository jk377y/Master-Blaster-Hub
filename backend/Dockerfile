# -------- Build Stage --------
# Uses Maven with Corretto 21 to compile and package the app
FROM maven:3.9.9-amazoncorretto-21 AS builder

WORKDIR /app

# Copy full project into container
COPY . .

# Build jar without running tests
RUN mvn clean package -DskipTests


# -------- Runtime Stage --------
# Lightweight image to run the compiled jar
FROM amazoncorretto:21

WORKDIR /app

# Copy compiled jar from build stage
COPY --from=builder /app/target/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Start Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]