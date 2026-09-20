# CyberShield – Cybersecurity Learning & Simulation Platform

CyberShield is an interactive, gamified cybersecurity learning platform. It allows users to investigate simulated security incidents, make crucial decisions, receive instant feedback, earn XP, unlock achievements, and incrementally improve their real-world cybersecurity skills through hands-on learning.

## Features

- **Authentication System**: Secure JWT-based registration and login.
- **Mission System**: Question-based challenges with contextual storytelling.
- **Interactive Simulations**:
  - Phishing identification
  - Password security evaluation
  - Network intrusion investigation
  - Malware investigation
  - Incident response procedures
- **Evidence & Investigation**: A dynamic timeline system to collect and analyze artifacts.
- **Gamification**:
  - XP & Leveling system
  - Achievements and Badges
  - Daily login streaks
  - Global Leaderboard
- **Adaptive Learning System**:
  - Comprehensive skill assessment tracking
  - Topic-based learning recommendations
  - Dedicated Knowledge Hub
- **AI Security Assistant**: Context-aware help to guide users without spoiling answers.
- **Administration**:
  - Comprehensive Admin Dashboard
  - User and Mission management
  - Aggregated system analytics
  - Secure Audit logging for high-risk actions
- **UI/UX**: Responsive modern interface featuring Light/Dark modes.

## Technology Stack

- **Frontend**: React, JavaScript, HTML, CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **Security Middleware**: Helmet, express-rate-limit, express-mongo-sanitize

## Project Structure

```
CyberShield/
├── backend/
│   ├── src/
│   │   ├── config/       # Database & Env config
│   │   ├── controllers/  # API Route Handlers (auth, admin, ai, missions, users)
│   │   ├── middleware/   # Auth, Admin, Error handlers
│   │   ├── models/       # Mongoose Schemas
│   │   ├── routes/       # Express Routes
│   │   ├── services/     # External integrations (AI)
│   │   └── utils/        # Helpers & Database seeders
│   └── server.js         # Backend Entry Point
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI elements (Navbar, AI Assistant, AdminRoute)
│   │   ├── context/      # React Context (Auth, Theme)
│   │   ├── pages/        # Main App views (Dashboard, Learn, Admin, Simulations)
│   │   ├── services/     # Frontend API fetch wrappers
│   │   └── index.css     # Global CSS and Design Tokens
│   └── vite.config.js    # Frontend build config
└── README.md             # Project documentation
```

## Installation

Clone the repository and install dependencies for both the frontend and backend.

```bash
git clone <your-repo-url>
cd CyberShield

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Environment Variables

Copy the example configuration files and update them with your actual values.
**Note:** Never commit your actual `.env` files.

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cybershield
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1d
AI_API_KEY=your_gemini_api_key_here
```
*(If `AI_API_KEY` is omitted, the AI Assistant will seamlessly fall back to an internal rule-based engine).*

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## Running Locally

To run the application in a development environment:

**1. Start the Backend server:**
```bash
cd backend
npm run dev
```

**2. Start the Frontend development server:**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## API Overview

The backend exposes several RESTful API groups:

- `/api/auth` - User registration, login, and admin bootstrapping.
- `/api/missions` - Fetch active missions, submit mission attempts.
- `/api/users` - Fetch user profiles, gamification stats, and leaderboard.
- `/api/learn` - Fetch topic-specific educational content.
- `/api/ai` - Communicate with the AI Security Assistant.
- `/api/admin` - Protected routes for dashboard analytics, audit logs, and system health.

## Security Controls

- **Authentication**: JWT-based session management.
- **Authorization**: Role-based access control (`user` vs `admin`) strictly enforced on the server.
- **Data Protection**: Passwords securely hashed with `bcrypt`.
- **System Hardening**: `Helmet` for HTTP headers, `express-rate-limit` to prevent brute force, and `express-mongo-sanitize` for NoSQL injection prevention.
- **Audit Logs**: Centralized logging for sensitive administrative and authentication actions.
- **Fair Play**: Server-side scoring logic and duplicate reward protections ensure XP and Achievements cannot be manipulated from the client.
