import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import InnerLayout from './components/InnerLayout';
import Proposals from './pages/Proposals';

// Placeholder standard components
const Placeholder = ({ title }: { title: string }) => (
  <div className="py-12 text-center text-slate-500">
    <h2 className="text-3xl font-bold mb-4 text-slate-700">{title}</h2>
    <p>We are actively implementing this module interface based on your screenshots...</p>
  </div>
);

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4CAF50',
          borderRadius: 2, // Less rounded corners like the screenshots
          fontFamily: "'Segoe UI', 'Inter', -apple-system, sans-serif"
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Path */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Student Panel & Navigation Root */}
          <Route path="/student" element={<StudentDashboard />} />
          
          <Route path="/student" element={<InnerLayout />}>
            <Route path="welcome" element={<Placeholder title="Welcome Page" />} />
            <Route path="proposals" element={<Proposals />} />
            <Route path="teams" element={<Placeholder title="My Capstone Team Page" />} />
            <Route path="reflections" element={<Placeholder title="Weekly Temperature Check & Reflection" />} />
            <Route path="submit-proposal" element={<Placeholder title="Submit Project Proposal" />} />
            <Route path="tips" element={<Placeholder title="Tips & Tricks" />} />
          </Route>

          {/* Tutor & Sponsor Dashboard Mock Entrances */}
          <Route path="/admin" element={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <h1 className="text-2xl text-slate-600">Admin Control Center (To Be Built)</h1>
            </div>
          } />
          <Route path="/sponsor" element={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <h1 className="text-2xl text-slate-600">Sponsor Portal (To Be Built)</h1>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
