import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Auth from './components/Authentication/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import SignUp from './components/Authentication/SignUp';
import Profile from './components/Profile/Profile'
import Customers from './components/Customers/Customers';
import CustomerDetails from './components/Customers/CustomerDetails';
import TopNavBar from './components/TopNavBar/TopNavBar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="*"
          element={<PageWithNav />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function PageWithNav() {
  const location = useLocation();
  const noNav = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <>
      {!noNav && <TopNavBar />}
      <Routes>
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
          } 
        />
        <Route path="/customers" element={
          <ProtectedRoute>
            <Customers/>
          </ProtectedRoute>
          } 
        />
        <Route path="/customers/:id" element={
          <ProtectedRoute>
            <CustomerDetails />
          </ProtectedRoute>
          } 
        />
        {/* Add other routes here */}
      </Routes>
    </>
  );
}

export default App;
