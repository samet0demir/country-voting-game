# Country Voting Game

A full-stack web application that allows users to vote for countries, view voting statistics, and participate in chat rooms.

## Features

- User authentication with JWT
- Vote for your favorite country (limited to one vote per day)
- Interactive world map with Leaflet.js
- Real-time chat rooms (global and country-specific) with Socket.io
- Voting statistics with Chart.js

## Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: React, Bootstrap
- **Authentication**: JWT
- **Real-time Communication**: Socket.io
- **Visualization**: Leaflet.js, Chart.js

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL

## Setup Instructions

### Database Setup

1. Create a PostgreSQL database named `oy_oyunu`
2. The application will automatically create the required tables on startup

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   DB_HOST=localhost
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_NAME=oy_oyunu
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

## Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```

2. In a separate terminal, start the frontend:
   ```
   cd client
   npm start
   ```

3. Access the application in your browser at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get user profile (protected)

### Countries and Voting
- `GET /api/countries` - Get all countries
- `POST /api/countries/vote` - Vote for a country (protected)
- `GET /api/countries/stats` - Get voting statistics

### Chat
- `GET /api/chats/country/:country` - Get chat messages for a country (protected)
- `GET /api/chats/global` - Get global chat messages (protected)
- `POST /api/chats` - Create a chat message (protected)