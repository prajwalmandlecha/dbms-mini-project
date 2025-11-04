# Internship Management System

This is a full-stack web application designed to manage student internships. It provides a platform for students, mentors, and companies to track and manage internship information.

## Tech Stack

**Backend:**

*   **Node.js:** A JavaScript runtime environment.
*   **Express:** A web application framework for Node.js.
*   **Prisma:** A next-generation ORM for Node.js and TypeScript.
*   **PostgreSQL:** A powerful, open-source object-relational database system.

**Frontend:**

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **Bootstrap:** A popular CSS framework for developing responsive and mobile-first websites.
*   **Axios:** A promise-based HTTP client for the browser and Node.js.

## Setup and Installation

### Backend

1.  **Navigate to the project root directory:**
    ```bash
    cd dbmsminiproject
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up the database:**
    *   Make sure you have PostgreSQL installed and running.
    *   Create a `.env` file in the root directory and add your database connection string:
        ```
        DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
        ```
4.  **Run database migrations:**
    ```bash
    npx prisma migrate dev
    ```
5.  **Start the server:**
    ```bash
    npm start
    ```
    The server will be running on `http://localhost:3000`.

### Frontend

1.  **Navigate to the frontend directory:**
    ```bash
    cd react-frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm start
    ```
    The application will be running on `http://localhost:3001`.

## Database Schema

The database schema is defined using Prisma. Here's a high-level overview of the models:

*   **Department:** Represents a department in the college (e.g., Computer Science, Information Technology).
*   **Company:** Represents a company that offers internships.
*   **InternalMentor:** Represents a mentor from within the college.
*   **ExternalMentor:** Represents a mentor from a company.
*   **Student:** Represents a student in the college.
*   **Internship:** Represents an internship opportunity.
*   **StudentInternship:** A join table that links students and internships.

## API Endpoints

The backend provides the following API endpoints:

*   `GET /`: A simple test endpoint to check if the server is running.
*   `/departments`: a set of CRUD operations for departments.
*   `/companies`: a set of CRUD operations for companies.
*   `/mentors`: a set of CRUD operations for mentors.
*   `/students`: a set of CRUD operations for students.
*   `/internships`: a set of CRUD operations for internships.
