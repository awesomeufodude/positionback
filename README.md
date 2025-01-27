Got it! Below is the updated README tailored for your **backend project** with detailed cURL examples for each route and all the requested sections.

---

# Article Nexus Backend

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Steps to Install Dependencies](#steps-to-install-dependencies)
  - [Steps to Start the App in Development Mode](#steps-to-start-the-app-in-development-mode)
- [API Endpoints](#api-endpoints)
  - [Authentication](#1-authentication)
  - [Articles](#2-articles)
  - [Categories](#3-categories)
- [Technical Decisions](#technical-decisions)
  - [Authentication Handling](#1-authentication-handling)
  - [Validation and Middleware](#2-validation-and-middleware)
  - [Error Handling](#3-error-handling)
  - [Architecture](#4-architecture)
- [Directory Structure](#directory-structure)
- [Scripts](#scripts)

---

## Overview

Article Nexus Backend is a RESTful API built with **Express.js** that powers the Article Nexus platform. It provides endpoints for user authentication, article management, category management, and more. The project is designed using **hexagonal architecture** principles, ensuring scalability and maintainability.

Deployed on URL: https://positionback-b7f5793f9d74.herokuapp.com

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16 or higher recommended)
- **npm** (v8 or higher) or **yarn**
- **PostgreSQL** (for database setup)

---

### Steps to Install Dependencies
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/article-nexus-backend.git
   cd article-nexus-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # OR
   yarn install
   ```

---

### Steps to Start the App in Development Mode
1. Set up a `.env` file in the root directory with the required variables (see [Environment Variables](#environment-variables)).
2. Start the development server:
   ```bash
   npm run dev
   # OR
   yarn dev
   ```
3. The API will be available at `http://localhost:8080`.

---


## API Endpoints

### 1. **Authentication**

#### Register
- **Endpoint**: `POST /api/users/register`
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "username": "user123",
    "password": "password123"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"user123","password":"password123"}'
  ```

#### Login
- **Endpoint**: `POST /api/users/login`
- **Description**: Authenticate a user and retrieve a JWT.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
  ```

#### Get Current User
- **Endpoint**: `GET /api/users/me`
- **Description**: Get details of the currently authenticated user.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <your_jwt_token>"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer <your_jwt_token>"
  ```

---

### 2. **Articles**

#### Get Articles
- **Endpoint**: `GET /api/articles`
- **Description**: Fetch a paginated list of articles.
- **Query Parameters**:
  - `page` (optional): Page number (default: 1).
  - `limit` (optional): Number of articles per page (default: 10).
  - `category` (optional): Filter by category ID.
  - `isFavorite` (optional): Filter by favorite status (`true` or `false`).
  - `minRating` (optional): Filter by minimum rating.
- **cURL Example**:
  ```bash
  curl -X GET "http://localhost:8080/api/articles?page=1&limit=10"
  ```

#### Create an Article
- **Endpoint**: `POST /api/articles`
- **Description**: Create a new article.
- **Request Body**:
  ```json
  {
    "title": "My First Article",
    "description": "This is the content of the article.",
    "categoryId": "1",
    "authorId": "123"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:8080/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"title":"My First Article","description":"This is the content of the article.","categoryId":"1","authorId":"123"}'
  ```

#### Update an Article
- **Endpoint**: `PUT /api/articles/:id`
- **Description**: Update an existing article.
- **Request Body**:
  ```json
  {
    "title": "Updated Article Title",
    "description": "Updated content."
  }
  ```
- **cURL Example**:
  ```bash
  curl -X PUT http://localhost:8080/api/articles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"title":"Updated Article Title","description":"Updated content."}'
  ```

#### Delete an Article
- **Endpoint**: `DELETE /api/articles/:id`
- **Description**: Delete an article by ID.
- **cURL Example**:
  ```bash
  curl -X DELETE http://localhost:8080/api/articles/1 \
  -H "Authorization: Bearer <your_jwt_token>"
  ```

---

### 3. **Categories**

#### Get Categories
- **Endpoint**: `GET /api/categories`
- **Description**: Fetch a list of all categories.
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:8080/api/categories
  ```

#### Create a Category
- **Endpoint**: `POST /api/categories`
- **Description**: Create a new category.
- **Request Body**:
  ```json
  {
    "name": "New Category"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"name":"New Category"}'
  ```

---

## Technical Decisions

### 1. **Authentication Handling**
- JWT-based authentication ensures secure access to protected routes.
- Middleware validates tokens and attaches user details to the request.

---

### 2. **Validation and Middleware**
- Request validation uses `validateRequest` middleware and schema definitions.
- Middleware ensures a modular and reusable approach to validation and authentication.

---

### 3. **Error Handling**
- Centralized error handler (`ErrorHandler`) captures and logs all errors.
- Custom `HttpException` class provides meaningful error messages and HTTP status codes.

---

### 4. **Architecture**
- Hexagonal architecture ensures separation of concerns:
  - **Domain**: Core business logic resides in services.
  - **Application**: Controllers handle request/response logic.
  - **Adapters**: Routes and middleware serve as the entry point to the application.

---

## Directory Structure
```
src/
├── features/
│   ├── articles/           # Article feature (routes, controllers, services)
│   ├── categories/         # Category feature (routes, controllers, services)
│   ├── users/              # User feature (routes, controllers, services)
├── middlewares/            # Middleware (authentication, validation, error handling)
├── utils/                  # Utility functions (e.g., error handling)
├── types/                  # Shared TypeScript definitions
├── app.ts                  # App initialization
└── server.ts               # Server entry point
```

---

## Scripts
- `npm run dev` - Start the app in development mode.
- `npm run build` - Build the app for production.
- `npm start` - Start the app in production mode.
- `npm run test` - Run tests (if applicable).

---