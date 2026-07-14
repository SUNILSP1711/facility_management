# Facility Management System - Backend

Spring Boot 3.x REST API for campus facility management with JWT authentication.

## Prerequisites

- Java 17+
- Maven 3.8+
- MongoDB Atlas account (or local MongoDB)

## Setup Instructions

### 1. Environment Variables

Create a `.env` file or set environment variables:

```bash
export MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fms?retryWrites=true&w=majority
export JWT_SECRET=<your-jwt-secret-key>
```

### 2. Build the Project

```bash
mvn clean install
```

### 3. Run the Application

```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email and password

### Public Endpoints
- `GET /public/facilities` - List all facilities
- `GET /public/facilities/available` - List available facilities
- `GET /public/facilities/type/{type}` - Filter by type (SEMINAR_HALL, LAB, AUDITORIUM)
- `POST /public/check-availability` - Check facility availability for date/time

### Admin Endpoints
- `POST /admin/facilities` - Create facility
- `PUT /admin/facilities/{id}` - Update facility
- `DELETE /admin/facilities/{id}` - Delete facility
- `GET /admin/facilities` - List all facilities
- `GET /admin/bookings` - List all bookings
- `PUT /admin/bookings/{id}/approve` - Approve booking
- `PUT /admin/bookings/{id}/reject` - Reject booking
- `GET /admin/issues` - List all issues
- `PUT /admin/issues/{id}/status` - Update issue status
- `GET /admin/issues/open` - List open issues

### Staff Endpoints
- `POST /staff/bookings` - Create booking
- `GET /staff/bookings/my-bookings` - Get user's bookings
- `DELETE /staff/bookings/{id}/cancel` - Cancel booking
- `POST /staff/issues` - Report issue
- `GET /staff/issues/my-issues` - Get user's reported issues

## Security

- JWT token-based API authentication
- Role-based access control (ADMIN, STAFF)
- CORS configuration
- Input validation
- Global exception handling

## Database Schema

### Users
- id, name, email, password (hashed), role

### Facilities
- id, name, type, location, capacity, status

### Bookings
- id, facilityId, bookedBy, purpose, date, startTime, endTime, status

### Issues
- id, facilityId, reportedBy, description, severity, status, createdAt, updatedAt

## Key Features

- Booking conflict detection (prevents double-booking)
- Role-based endpoint protection
- Input validation with Bean Validation
- Global exception handling
- JWT token generation and validation
