import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Student/Dashboard';
import Profile from './pages/Student/Profile';
import ResumeBuilder from './pages/Student/ResumeBuilder';
import History from './pages/Student/History';

import CompanyDashboard from './pages/Company/Dashboard';
import PostJob from './pages/Company/PostJob';
import ApplicantsList from './pages/Company/ApplicantsList';

import JobsPage from './pages/Jobs/JobsPage';
import JobDetails from './pages/Jobs/JobDetails';

import Messages from './pages/Messages/Messages';
import Notifications from './pages/Notifications/Notifications';
import { useAuth } from './context/AuthContext';

const NotFound = () => (
  <div className="container" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
    <h1>404 - Page Not Found</h1>
  </div>
);

// Public pages layout wrapper
const PublicLayout = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {user ? (
        // For logged-in users, wrap all routes in the new sidebar DashboardLayout
        <Route element={<DashboardLayout />}>
          {/* Redirect auth pages if already logged in */}
          <Route path="/" element={<Navigate to={`/${user.role}-dashboard`} replace />} />
          <Route path="/login" element={<Navigate to={`/${user.role}-dashboard`} replace />} />
          <Route path="/register" element={<Navigate to={`/${user.role}-dashboard`} replace />} />
          
          {/* Jobs viewed in Dashboard layout for logged in users */}
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          {/* Student Specific */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student-dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
          </Route>

          {/* Recruiter Specific */}
          <Route element={<ProtectedRoute allowedRoles={['company']} />}>
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/jobs/:id/applicants" element={<ApplicantsList />} />
            <Route path="/candidates" element={<div className="container">Candidate Search</div>} />
          </Route>
        </Route>
      ) : (
        // For guest users, wrap routes in the traditional PublicLayout (navbar + footer)
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Jobs viewed in Public Layout for guests */}
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          
          {/* Fallback redirect to login for guests trying to access app pages */}
          <Route path="/student-dashboard" element={<Navigate to="/login" replace />} />
          <Route path="/history" element={<Navigate to="/login" replace />} />
          <Route path="/company-dashboard" element={<Navigate to="/login" replace />} />
          <Route path="/profile" element={<Navigate to="/login" replace />} />
          <Route path="/resume-builder" element={<Navigate to="/login" replace />} />
          <Route path="/messages" element={<Navigate to="/login" replace />} />
          <Route path="/notifications" element={<Navigate to="/login" replace />} />
        </Route>
      )}

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
