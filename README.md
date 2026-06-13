# Full-Stack E-Commerce Website

A fully functional, full-stack e-commerce application built with React, Spring Boot, and MySQL.

## 🚀 Technologies Used

*   **Frontend:** React (Vite), React Context API for state management (Auth & Cart), custom CSS.
*   **Backend:** Spring Boot (Java), Spring Security (JWT Authentication), Spring Data JPA (Hibernate).
*   **Database:** MySQL.
*   **Build Tools:** Maven (Backend), npm/Vite (Frontend).

## 🛠️ Features

*   **User Authentication:** Secure registration and login using JSON Web Tokens (JWT).
*   **Product Catalog:** Browse products by categories, view details, prices, and stock quantity.
*   **Shopping Cart:** Add products to the cart, update quantities, and view the total price.
*   **Checkout & Orders:** Place orders and view order history.
*   **Admin Dashboard:** Basic admin functionalities (ready for expansion).
*   **Responsive Design:** A beautiful and modern user interface that works on different screen sizes.

## 📦 Project Structure

The project is divided into two main directories:

*   `/frontend`: Contains the React application.
*   `/backend`: Contains the Spring Boot REST API.

## ⚙️ Setup & Installation

### Prerequisites

*   **Node.js** and **npm** (for the frontend)
*   **Java Development Kit (JDK) 17+** (for the backend)
*   **Maven** (to build the backend)
*   **MySQL Server** running locally on port `3306`.

### Database Configuration

1.  Open MySQL and ensure you have a user with the username `root` and password `YOUR_DB_PASSWORD`.
2.  The application will automatically create the database `ecommerce_db` and all necessary tables upon startup.
3.  *(Optional)* If you wish to change the database credentials, update the `src/main/resources/application.properties` file in the `backend` directory:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
    spring.datasource.username=root
    spring.datasource.password=YOUR_DB_PASSWORD
    ```

### Running the Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Run the Spring Boot application using Maven:
    ```bash
    mvn spring-boot:run
    ```
3.  The backend server will start on `http://localhost:8080`.

### Running the Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  The frontend will be accessible at `http://localhost:5173`.

## 📜 API Endpoints

### Authentication
*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - Authenticate and get a JWT token

### Products
*   `GET /api/products` - Get all products
*   `GET /api/products/{id}` - Get a specific product
*   `POST /api/products` - Create a product (Admin)
*   `PUT /api/products/{id}` - Update a product (Admin)
*   `DELETE /api/products/{id}` - Delete a product (Admin)

### Orders
*   `POST /api/orders` - Place a new order
*   `GET /api/orders/{userId}` - Get orders for a specific user

## 🛡️ Security

This application uses stateless JWT authentication. When a user logs in, the server returns a signed token, which the frontend stores in `localStorage`. Subsequent protected API requests must include this token in the `Authorization` header.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
