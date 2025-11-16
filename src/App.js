import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import CreateTicket from './pages/student/CreateTicket';
import TicketList from './pages/student/TicketList';
import TicketDetail from './pages/student/TicketDetail';

// Lecturer Pages
import LecturerDashboard from './pages/lecturer/Dashboard';
import LecturerTicketList from './pages/lecturer/TicketList';
import ReviewTicket from './pages/lecturer/ReviewTicket';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminTicketList from './pages/admin/TicketList';
import AdminTicketDetail from './pages/admin/TicketDetail';

// Styles
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['mahasiswa']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/tickets"
              element={
                <ProtectedRoute allowedRoles={['mahasiswa']}>
                  <TicketList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/create-ticket"
              element={
                <ProtectedRoute allowedRoles={['mahasiswa']}>
                  <CreateTicket />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/tickets/:id"
              element={
                <ProtectedRoute allowedRoles={['mahasiswa']}>
                  <TicketDetail />
                </ProtectedRoute>
              }
            />

            {/* Lecturer Routes */}
            <Route
              path="/lecturer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['dosen']}>
                  <LecturerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lecturer/tickets"
              element={
                <ProtectedRoute allowedRoles={['dosen']}>
                  <LecturerTicketList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lecturer/tickets/:id"
              element={
                <ProtectedRoute allowedRoles={['dosen']}>
                  <ReviewTicket />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tickets"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminTicketList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tickets/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminTicketDetail />
                </ProtectedRoute>
              }
            />

            {/* Unauthorized Page */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Unauthorized Page Component
const UnauthorizedPage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      gap: '20px'
    }}>
      <h1>403 - Unauthorized</h1>
      <p>You don't have permission to access this page.</p>
      <a href="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>
        Go to Login
      </a>
    </div>
  );
};

// Not Found Page Component
const NotFoundPage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      gap: '20px'
    }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>
        Go to Login
      </a>
    </div>
  );
};

export default App;