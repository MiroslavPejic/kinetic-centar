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
import ResetPassword from './components/Authentication/ResetPassword';
import ForgotPassword from './components/Authentication/ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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
            
              <Dashboard />
            
          } 
        />
        <Route path="/profile" element={
          
            <Profile/>
          
          } 
        />
        <Route path="/customers" element={
          
            <Customers/>
          
          } 
        />
        <Route path="/customers/:id" element={
          
            <CustomerDetails />
          
          } 
        />
        {/* Add other routes here */}
      </Routes>
    </>
  );
}

export default App;
