import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Map from './pages/Map';
import CalendarPage from './pages/CalendarPage';
import StatsPage from './pages/StatsPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPassword from './pages/ForgotPassword';
import VerifyCode from './pages/VerifyCode';
import ResetPassword from './pages/ResetPassword';
import PasswordChanged from './pages/PasswordChanged';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<Map />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password-changed" element={<PasswordChanged />} />
      </Routes>
    </Router>
  );
}

export default App;
