# CyberShield

**Learn cybersecurity by solving simulated attacks.**

CyberShield is a web-based learning platform where users can practice cybersecurity skills through interactive missions. This repository contains the Phase 1 implementation, providing a stable full-stack foundation with authentication, protected routes, and a dashboard.

## Phase 1 Features
- **User Authentication**: Secure registration and login using JWT.
- **Password Hashing**: User passwords are encrypted using bcrypt.
- **Protected Routes**: Dashboard and Profile pages require an active login session.
- **Modern UI**: Cybersecurity-themed responsive interface using React and custom CSS.

## Technologies Used
**Frontend**
- React.js (Vite)
- React Router
- CSS3 (Custom Design System)
- Lucide React (Icons)

**Backend**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs

## Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas)

## Installation & Setup

1. **Clone the repository** (if applicable) and navigate to the root directory:
   ```bash
   cd CyberShield
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` folder based on `.env.example`:
     ```env
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/cybershield
     JWT_SECRET=your_super_secret_jwt_key
     JWT_EXPIRES_IN=1d
     ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```
   - Create a `.env` file in the `frontend` folder:
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```

## Running the Application

**Start the Backend**
```bash
cd backend
npm run dev
```
The backend API will run on `http://localhost:5000`.

**Start the Frontend**
```bash
cd frontend
npm run dev
```
The React frontend will be available at `http://localhost:5173`.

## API Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate user & get token
- `GET /api/auth/me`: Get current authenticated user profile (Requires Bearer Token)

## Definition of Done (Phase 1)
- [x] Frontend and backend are separate applications.
- [x] React communicates with Express through REST APIs.
- [x] MongoDB connection established.
- [x] User registration & login implemented securely.
- [x] Passwords are securely hashed.
- [x] JWT authentication guards protected routes.
- [x] User profile & Dashboard load dynamically.
- [x] Clean, responsive cybersecurity-themed UI.
