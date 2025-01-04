# Use official Maven image to build the app
FROM maven:3.8-openjdk-17 as build

# Set working directory
WORKDIR /app

# Copy pom.xml and dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the application code
COPY src /app/src

# Package the application
RUN mvn clean package -DskipTests

# Use an official OpenJDK runtime image for the final container
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the JAR file from the build container
COPY --from=build /app/target/todo-app-0.0.1-SNAPSHOT.jar /app/todo-app-0.0.1-SNAPSHOT.jar

# Expose the port the app runs on
EXPOSE 5454

# Command to run the application
CMD ["java", "-jar", "/app/todo-app-0.0.1-SNAPSHOT.jar"]
