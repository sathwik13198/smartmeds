# Smart Hospital AI

A comprehensive healthcare management system that leverages AI to streamline hospital operations, enhance patient care, and improve medical safety monitoring.

## Features

### User Management
- Secure authentication system
- Role-based access control (doctors, patients)
- User profile management

![Login Screen](./images/login.svg)
*Secure login interface for user authentication*

### Patient Management
- Patient registration and profile management
- Medical history tracking
- Patient appointment history

![Patient List](./images/patient-list.svg)
*Patient management interface showing registered patients and their details*

### Appointment System
- Schedule management for doctors
- Patient appointment booking
- Today's appointment view
- Appointment modification and cancellation

![Appointment Management](./images/appointments.svg)
*Appointment scheduling interface with upcoming appointments and booking options*

### Medication Management
- Comprehensive medication database
- Prescription management
- Medication tracking

![Medicine Management](./images/medicine-management.svg)
*Medication management interface showing available medicines and prescriptions*

### ADR (Adverse Drug Reaction) Reporting
- Real-time ADR reporting system
- Historical ADR data tracking
- Recent ADR reports monitoring

![Doctor Dashboard](./images/doctor-dashboard.svg)
*Doctor dashboard showing ADR monitoring and analytics*

### Chat System
- Secure doctor-patient communication
- Message history tracking
- Patient-specific chat threads

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Express Session with MongoDB Store

### Frontend
- React
- Vite
- TailwindCSS
- TypeScript

### Development Tools
- ESLint
- Vitest for testing
- PostCSS

## Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd smart_meds
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

4. Start the development server
```bash
npm run dev
```

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/             # Source files
│   └── index.html       # Entry HTML file
├── server/              # Backend Express application
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── storage.ts       # Data storage layer
└── shared/              # Shared TypeScript interfaces
    └── schema.ts        # Data schemas
```

## API Documentation

The API provides endpoints for:
- User authentication and management
- Patient data management
- Appointment scheduling
- Medication and prescription management
- ADR reporting
- Chat functionality

Detailed API documentation is available in the server routes.

## Security

- Session-based authentication
- Secure password handling
- MongoDB session store
- Environment variable protection



