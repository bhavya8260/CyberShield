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
import Learn from './pages/Learn';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMissions from './pages/admin/AdminMissions';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import Challenge from './pages/Challenge';
import MissionResult from './pages/MissionResult';
import Simulation from './pages/Simulation';
import Leaderboard from './pages/Leaderboard';
import Paths from './pages/Paths';
import PathDetails from './pages/PathDetails';
import Challenges from './pages/Challenges';
import Skills from './pages/Skills';
import History from './pages/History';

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
              <Route 
                path="/leaderboard" 
                element={
                  <ProtectedRoute message="Authentication required to view the leaderboard.">
                    <Leaderboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/paths" 
                element={
                  <ProtectedRoute>
                    <Paths />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/paths/:id" 
                element={
                  <ProtectedRoute>
                    <PathDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/challenges" 
                element={
                  <ProtectedRoute>
                    <Challenges />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/skills" 
                element={
                  <ProtectedRoute>
                    <Skills />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/history" 
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                } 
              />
              <Route path="/learn" element={<Learn />} />
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
                path="/missions/:id/simulation" 
                element={
                  <ProtectedRoute message="Login or register to start this simulation.">
                    <Simulation />
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
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/missions" 
                element={
                  <AdminRoute>
                    <AdminMissions />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/audit-logs" 
                element={
                  <AdminRoute>
                    <AdminAuditLogs />
                  </AdminRoute>
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
