# HomeSphere Backend

HomeSphere Backend is a Spring Boot REST API that powers the HomeSphere real estate platform. The application provides user authentication, property management, administrative review workflows, appointment scheduling, inquiries, favourites, and role-based access control.

## Technology Stack

* Java
* Spring Boot
* Spring Web MVC
* Spring Data JPA
* Spring Security
* JWT Authentication
* PostgreSQL
* MapStruct
* Lombok
* Maven
* Docker & Docker Compose

---

## Architecture

The application follows a layered architecture to separate responsibilities and improve maintainability.

```text
Client
↓
Controller
↓
DTO / Mapper
↓
Service
↓
Repository
↓
PostgreSQL Database
```

Responses follow the reverse flow:

```text
Database
↓
Repository
↓
Service
↓
Mapper
↓
DTO
↓
Client
```

### Project Structure

```text
src/main/java
│
├── config
├── controller
├── domain
├── dto
├── exception
├── mapper
├── repository
├── security
├── service
└── service/impl
```

| Package      | Responsibility                                  |
| ------------ | ----------------------------------------------- |
| controller   | REST API endpoints                              |
| service      | Business logic contracts                        |
| service.impl | Business logic implementations                  |
| repository   | Data access layer                               |
| domain       | JPA entities and enums                          |
| dto          | Request and response models                     |
| mapper       | MapStruct object mapping                        |
| security     | JWT and Spring Security configuration           |
| exception    | Custom exceptions and global exception handling |
| config       | Application configuration                       |

---

## Features

### Authentication & Security

* JWT-based authentication
* Secure login endpoint
* Spring Security integration
* Role-based authorization
* Custom JWT authentication filter
* Database-backed user authentication

### User Management

* User registration
* User retrieval and updates
* User deletion
* User account activation management

### Property Management

* Create property listings
* Update property listings
* Delete property listings
* Retrieve property details
* Search properties by:

    * City
    * Maximum price
    * Number of bedrooms
* Automatic pending approval workflow
* Property view tracking

### Administrative Features

* Approve property listings
* Deactivate user accounts
* View pending properties

### Appointment Management

* Schedule appointments
* Cancel appointments
* Update appointment status
* Retrieve appointments by:

    * Appointment ID
    * Customer
    * Property owner
    * Appointment date

---

## Database Design

The application uses PostgreSQL as its primary database.

Design documentation is available in the project documentation folder:

* Entity Relationship Diagram (ERD)
* Class Diagram
* Sequence Diagram

---

## API Overview

### Authentication

| Method | Endpoint      |
| ------ | ------------- |
| POST   | `/auth/login` |

### Users

| Method | Endpoint                 |
| ------ | ------------------------ |
| POST   | `/api/v1/users`          |
| GET    | `/api/v1/users`          |
| GET    | `/api/v1/users/{userId}` |
| PUT    | `/api/v1/users/{userId}` |
| DELETE | `/api/v1/users/{userId}` |

### Properties

| Method | Endpoint                            |
| ------ | ----------------------------------- |
| POST   | `/api/v1/users/{userId}/properties` |
| GET    | `/api/v1/properties`                |
| GET    | `/api/v1/properties/{propertyId}`   |
| GET    | `/api/v1/users/{userId}/properties` |
| PUT    | `/api/v1/properties/{propertyId}`   |
| DELETE | `/api/v1/properties/{propertyId}`   |
| GET    | `/api/v1/properties/search`         |

### Administration

| Method | Endpoint                                         |
| ------ | ------------------------------------------------ |
| GET    | `/api/v1/admins`                                 |
| GET    | `/api/v1/admins/{adminId}`                       |
| PATCH  | `/api/v1/admins/users/{userId}/deactivate`       |
| PATCH  | `/api/v1/admins/properties/{propertyId}/approve` |
| GET    | `/api/v1/admins/properties/pending`              |

---

## Local Development

### Prerequisites

* Java
* Maven
* PostgreSQL
* Docker
* Docker Compose

### Database Configuration

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/homesphere
spring.datasource.username=homesphere
spring.datasource.password=homesphere123
```

### Start PostgreSQL

```bash
docker compose up -d
```

### Run Application

```bash
./mvnw spring-boot:run
```

### Compile Project

```bash
./mvnw -DskipTests compile
```

### Run Tests

```bash
./mvnw test
```

---

## Future Improvements

* Automatic UUID generation for entities
* Environment-based JWT secret management
* Enhanced validation handling
* Database migrations using Flyway or Liquibase
* Expanded unit and integration test coverage
* Advanced property filtering and search capabilities
* Completion of inquiry and favourite modules
* Appointment API DTO and controller implementation

---

## Documentation

Additional system documentation is available in the `/docs` directory:

* Entity Relationship Diagram
* Class Diagram
* Sequence Diagram

These artifacts describe the system architecture, database design, and request processing workflows used throughout the application.
