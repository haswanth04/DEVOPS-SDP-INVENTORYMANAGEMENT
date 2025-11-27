#!/bin/bash

echo "Starting Inventory Management System Backend..."
echo

# Check if Maven wrapper exists
if [ ! -f "mvnw" ]; then
    echo "Maven wrapper not found. Please ensure you're in the correct directory."
    exit 1
fi

# Make mvnw executable
chmod +x mvnw

# Start the Spring Boot application
echo "Starting Spring Boot application..."
./mvnw spring-boot:run
