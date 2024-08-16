# Real-Time Data Processing System for Weather Monitoring with Rollups and Aggregates

## Overview

Develop a real-time data processing system to monitor weather conditions and provide summarized insights using rollups and aggregates. The system utilizes data from the [OpenWeatherMap API](https://openweathermap.org/) to retrieve and analyze weather data.

Development Stack: The application is built using the MERN stack (MongoDB, Express, React, Node.js) due to its flexibility, scalability, and suitability for full-stack JavaScript development. The MERN stack allows seamless integration between the frontend and backend, ensuring a smoother development process and a more responsive user interface.

## Description

The application provides a single-page interface to monitor weather conditions for five default cities in World and the user’s current location. Key features include:

- **Real-Time Data Retrieval**: Fetches weather data from the OpenWeatherMap API at configurable intervals (e.g., every 5 minutes).
- **Temperature Conversion**: Converts temperatures from Kelvin to Celsius or Fahrenheit based on user preference.
- **Daily Weather Summary**: Aggregates daily weather data to provide average, maximum, minimum temperatures, and dominant weather conditions.
- **Alerting System**: Users can set thresholds for temperature and specific weather conditions. Alerts are triggered when thresholds are exceeded.
- **Data Visualization**: Displays daily weather summaries, historical trends, and forecasts using line charts powered by Chart.js.
- **Summary Storage**: Allows users to save daily weather summaries to a database.

# Data Storage:

**MongoDB** was chosen for its flexible schema design and scalability, which is well-suited to handle the dynamic nature of rule changes and modifications in the application

```javascript
const userSchema = new mongoose.Schema({ 
    date: { 
        type: String, 
        required: true
    },  

    summary1: { 
        type: String, 
        required: true, 
    },

    city:{
        type:String,
        required: true, 
    }
}); 

module.exports = mongoose.model('summaries', userSchema);
```
# Quickstart Guide

## Setup Instructions

By default, the MongoDB URI and port are present, so you do not need to add different values unless required.

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- MongoDB installed and running.
- Docker and Docker Compose installed (if you plan to use Docker).

### Dependencies

To set up and run the application, you will need the following dependencies:

- **Backend Dependencies** (specified in `backend/package.json`):
  - Express
  - Mongoose
  - dotenv

- **Frontend Dependencies** (specified in `frontend/package.json`):
  - React
  - Tailwind

### Step-by-Step Setup

#### 1. Clone the Repository

Clone the GitHub repository to your local machine using the following command:

```bash
git clone <https://github.com/saras1122/Rule_engine_ast.git>
cd <repository-name>
```
### Backend Setup

1. **Navigate to the Backend Directory**

   ```bash
   cd backend
   ```
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Start the Backend Server**
    ```bash
    nodemon index.js
    ```

### Frontend Setup

1. **Navigate to the Backend Directory**

   ```bash
   cd frontend
   ```
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Start the Backend Server**
    ```bash
    npm run dev
    ```

# Access the Application

Once the setup is complete, access the application at:

Frontend: http://localhost:3000

Backend API: http://localhost:8000