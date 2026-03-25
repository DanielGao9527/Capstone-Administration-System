import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import InnerLayout from './components/InnerLayout';
import Proposals from './pages/Proposals';

// New Real Pages
import ProfileSetup from './pages/ProfileSetup';
import TeamHub from './pages/TeamHub';
import Preferences from './pages/Preferences';
import Reflections from './pages/Reflections';
import Tips from './pages/Tips';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4CAF50',
          borderRadius: 2,
          fontFamily: "'Segoe UI', 'Inter', -apple-system, sans-serif"
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Main Dashboard Grid */}
          <Route path="/student" element={<StudentDashboard />} />
          
          {/* Inner Layout Container */}
          <Route path="/student" element={<InnerLayout />}>
            <Route path="welcome" element={<div className="py-12 text-center text-slate-500">Select a module from the top bar</div>} />
            <Route path="profile" element={<ProfileSetup />} />
            <Route path="proposals" element={<Proposals />} />
            <Route path="preferences" element={<Preferences />} />
            <Route path="teams" element={<TeamHub />} />
            <Route path="reflections" element={<Reflections />} />
            <Route path="tips" element={<Tips />} />
          </Route>

          <Route path="/admin" element={<div className="min-h-screen flex items-center justify-center bg-slate-50"><h1 className="text-2xl text-slate-600">Admin Control Center (To Be Built)</h1></div>} />
          <Route path="/sponsor" element={<div className="min-h-screen flex items-center justify-center bg-slate-50"><h1 className="text-2xl text-slate-600">Sponsor Portal (To Be Built)</h1></div>} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
