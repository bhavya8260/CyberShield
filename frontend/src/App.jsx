import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import Missions from './pages/Missions';
import MissionDetails from './pages/MissionDetails';
import Challenge from './pages/Challenge';
import MissionResult from './pages/MissionResult';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="/missions" element={<Missions />} />
              <Route path="/missions/:id" element={<MissionDetails />} />
              <Route 
                path="/missions/:id/challenge" 
                element={
                  <ProtectedRoute message="Login or register to start this mission.">
                    <Challenge />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/missions/:id/result" 
                element={
                  <ProtectedRoute message="Authentication required to view mission results.">
                    <MissionResult />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
