# Inventory Management System - Backend

This is the Spring Boot backend for the Inventory Management System.

## Features

- **User Management**: CRUD operations for users with roles (Admin, Manager, Staff)
- **Product Management**: Inventory management with stock tracking and low stock alerts
- **Supplier Management**: Supplier information management
- **Dashboard**: Statistics and analytics
- **Database**: MySQL with JPA/Hibernate
- **CORS**: Cross-origin resource sharing enabled for frontend integration

## Tech Stack

- Java 21
- Spring Boot 3.5.6
- Spring Data JPA
- MySQL
- Maven

## Prerequisites

- Java 21 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

## Setup Instructions

### 1. Database Setup

Create a MySQL database named `inventory_management`:

```sql
CREATE DATABASE inventory_management;
```

### 2. Configuration

Update the database configuration in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_management?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Run the Application

```bash
# Navigate to the backend directory
cd SDPBACKEND

# Run the application
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me?username={username}` - Get user info by username

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products?username={username}` - Create product
- `PUT /api/products/{id}?username={username}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/search?name={name}` - Search products
- `GET /api/products/low-stock` - Get low stock products

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/{id}` - Get supplier by ID
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier
- `GET /api/suppliers/search?name={name}` - Search suppliers

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Default Users

The application will create default users on first run:
- **Admin**: username: `admin`, password: `password123`, role: `ADMIN`
- **Manager**: username: `manager1`, password: `password123`, role: `MANAGER`
- **Staff**: username: `staff1`, password: `password123`, role: `STAFF`

## Features

- No authentication required for API access
- CORS enabled for frontend integration
- Automatic data initialization with sample data

## Database Schema

The application uses JPA/Hibernate with automatic table creation. The following entities are created:

- `users` - User information and authentication
- `products` - Product inventory
- `suppliers` - Supplier information

## Frontend Integration

The backend is designed to work with the React frontend. Make sure the frontend is configured to use `http://localhost:8080/api` as the API base URL.
