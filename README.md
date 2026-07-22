# Registration App

A full-stack web application built with React, Node.js, Express, and MongoDB for user registration and dashboard management.

## Features

- **Registration Page**: Form to collect user details including:
  - First Name
  - Last Name
  - Email
  - Phone Number
  - Highest Qualification
  - Year of Passing
  - Message (optional - for explaining why they are contacting)
- **Dashboard**: View all registered users with details
- **Header & Footer**: Consistent navigation and branding across pages
- **MongoDB Integration**: Store and retrieve registration data
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running locally)
- npm or yarn

## Project Structure

```
registration-app/
├── server/                 # Backend (Node.js/Express)
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env               # Environment variables
└── client/                # Frontend (React)
    ├── public/
    │   └── index.html
    └── src/
        ├── components/    # Header, Footer
        ├── pages/         # Registration, Dashboard
        ├── App.js
        ├── index.js
        └── index.css
```

## Setup Instructions

### 1. Install MongoDB

Make sure MongoDB is installed and running on your machine. By default, it runs on `mongodb://localhost:27017`.

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd registration-app/server
npm install
```

### 3. Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd registration-app/client
npm install
```

### 4. Configure Environment Variables

The backend `.env` file is already configured with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/registrationDB
```

If your MongoDB is running on a different port or URI, update the `MONGODB_URI` in `server/.env`.

## Running the Application

### Start the Backend Server

Open a terminal and run:

```bash
cd registration-app/server
npm start
```

The server will start on `http://localhost:5000`

### Start the React Frontend

Open a new terminal and run:

```bash
cd registration-app/client
npm start
```

The React app will open in your browser at `http://localhost:3000`

## Usage

1. **Registration Page** (`http://localhost:3000/`)
   - Fill out the registration form with all required fields
   - The message field is optional and can be used to explain why you're contacting
   - Click "Submit Registration" to save the data to MongoDB

2. **Dashboard** (`http://localhost:3000/dashboard`)
   - View all registered users in a table format
   - Click "Refresh" to reload the data
   - Click "Delete" to remove a registration

## API Endpoints

### Backend API (http://localhost:5000)

- `POST /api/register` - Create a new registration
- `GET /api/registrations` - Get all registrations
- `DELETE /api/registrations/:id` - Delete a registration by ID

## Technologies Used

### Frontend
- React 18
- React Router DOM
- Axios
- CSS3

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- CORS
- dotenv

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: Check if MongoDB service is active
- Verify the connection string in `server/.env`

### Frontend Not Connecting to Backend
- Ensure the backend server is running on port 5000
- Check browser console for CORS errors
- Verify the API URL in the React components (`http://localhost:5000`)

### Port Already in Use
- If port 5000 is in use, change the PORT in `server/.env`
- If port 3000 is in use, React will prompt to use a different port

## License

This project is open source and available for educational purposes.
