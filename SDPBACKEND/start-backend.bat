@echo off
echo Starting Inventory Management System Backend...
echo.

REM Check if Maven wrapper exists
if not exist "mvnw.cmd" (
    echo Maven wrapper not found. Please ensure you're in the correct directory.
    pause
    exit /b 1
)

REM Start the Spring Boot application
echo Starting Spring Boot application...
mvnw.cmd spring-boot:run

pause
