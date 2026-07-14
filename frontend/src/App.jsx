import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { FacilitiesManagement } from './pages/FacilitiesManagement';
import { BookingsManagement } from './pages/BookingsManagement';
import { IssuesManagement } from './pages/IssuesManagement';
import { StaffFacilities } from './pages/StaffFacilities';
import { BookingForm } from './pages/BookingForm';
import { MyBookings } from './pages/MyBookings';
import { ReportIssue } from './pages/ReportIssue';
import { MyIssues } from './pages/MyIssues';
import './styles/App.css';

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading-screen">Loading application...</div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/facilities"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <FacilitiesManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <BookingsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/issues"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <IssuesManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/facilities"
            element={
              <ProtectedRoute requiredRole="STAFF">
                <StaffFacilities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/booking"
            element={
              <ProtectedRoute requiredRole="STAFF">
                <BookingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/my-bookings"
            element={
              <ProtectedRoute requiredRole="STAFF">
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/report-issue"
            element={
              <ProtectedRoute requiredRole="STAFF">
                <ReportIssue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/my-issues"
            element={
              <ProtectedRoute requiredRole="STAFF">
                <MyIssues />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/staff/facilities'} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
