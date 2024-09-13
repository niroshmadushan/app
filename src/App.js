// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import UserManagement from './components/UserManagement';
import BookingForm from './components/BookingForm';
import PaymentForm from './components/PaymentForm';
import AccountSettings from './components/AccountSettings';
import UserDashboard from './pages/UserDashboard';
import UserBooking from './pages/UserBooking';
import UserPayments from './pages/UserPayments';
import UserAccountSettings from './pages/UserAccountSettings';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import ViewBookings from './components/ViewBookings'
import InventoryManagement from './pages/InventoryManagement';

function AppContent() {
  const { user } = useAuth(); // Correctly using useAuth within a component wrapped by AuthProvider

  return (
    <>
      {user && <Navbar />}
      <div style={{ display: 'flex', flexGrow: 1, paddingTop: '64px', paddingBottom: '40px', overflowY: 'auto' }}>
        {user && <Sidebar />} {/* Conditionally render Sidebar based on user login */}
        <main style={{ flexGrow: 1, padding: '16px', marginLeft: user ? '10px' : '0' }}> {/* Adjust layout based on Sidebar presence */}
          <Routes>
            <Route path="/" element={<LoginPage />} />

            {/* Admin Routes */}
            {user?.role === 'admin' && (
              <>
                <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
                <Route path="/admin/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
                <Route path="/admin/book" element={<PrivateRoute><ViewBookings /></PrivateRoute>} />
                <Route path="/admin/bookings" element={<PrivateRoute><BookingForm /></PrivateRoute>} />
                <Route path="/admin/payments" element={<PrivateRoute><PaymentForm /></PrivateRoute>} />
                <Route path="/admin/inventory" element={<PrivateRoute><InventoryManagement /></PrivateRoute>} />
                <Route path="/admin/settings" element={<PrivateRoute><AccountSettings /></PrivateRoute>} />
              </>
            )}

            {/* User Routes */}
            {user?.role === 'user' && (
              <>
                <Route path="/user" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
                <Route path="/user/bookings" element={<PrivateRoute><UserBooking /></PrivateRoute>} />
                <Route path="/user/book" element={<PrivateRoute><ViewBookings /></PrivateRoute>} />
                <Route path="/user/payments" element={<PrivateRoute><UserPayments /></PrivateRoute>} />
                <Route path="/user/inventory" element={<PrivateRoute><InventoryManagement /></PrivateRoute>} />
                <Route path="/user/settings" element={<PrivateRoute><UserAccountSettings /></PrivateRoute>} />
              </>
            )}

            {/* Default Redirect Based on User Role */}
            <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/user/dashboard'} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap the entire app with AuthProvider */}
        <BookingProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppContent />
          </div>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
