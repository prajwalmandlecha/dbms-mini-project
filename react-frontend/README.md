# DBMS Frontend - Internship Management System

A React-based frontend for managing internships in educational institutions. This application provides an intuitive interface to manage departments, companies, mentors, students, and internships.

## Features

- **Department Management**: Create, update, and delete academic departments
- **Company Management**: Manage companies offering internships
- **Mentor Management**: Handle both internal and external mentors
- **Student Management**: Maintain student records and information
- **Internship Management**: Create internship programs and enroll students

## Setup Instructions

1. Make sure you have Node.js installed on your system
2. Ensure the backend server is running on `http://localhost:3000`
3. Install the frontend dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. The application will be available at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory with the following content:

```
REACT_APP_API_URL=http://localhost:3000
```

## Technologies Used

- React with TypeScript
- React Bootstrap for UI components
- React Router for navigation
- Axios for API requests
- Bootstrap for responsive design

## Folder Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── services/       # API service functions
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## API Integration

The frontend communicates with the backend API through the services defined in `src/services/api.ts`. Currently, the application connects to a backend running on port 3000.

## Development

For development, run:

```bash
npm start
```

For building the project for production:

```bash
npm run build
```