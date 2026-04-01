import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import CustomCursor from './components/CustomCursor';
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
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#2997ff',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, sans-serif",
          colorBgContainer: '#111111',
          colorBgElevated: '#1a1a1a',
          colorBorder: 'rgba(255,255,255,0.08)',
        },
      }}
    >
      <CustomCursor />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Main Dashboard Grid */}
          <Route path="/student" element={<StudentDashboard />} />
          
          {/* Inner Layout Container */}
          <Route path="/student" element={<InnerLayout />}>
            <Route path="welcome" element={<StudentDashboard />} />
            <Route path="profile" element={<ProfileSetup />} />
            <Route path="proposals" element={<Proposals />} />
            <Route path="preferences" element={<Preferences />} />
            <Route path="teams" element={<TeamHub />} />
            <Route path="reflections" element={<Reflections />} />
            <Route path="tips" element={<Tips />} />
          </Route>

          <Route path="/admin" element={<div className="min-h-screen flex items-center justify-center bg-black"><h1 className="text-2xl text-slate-400">Admin Control Center (Deferred)</h1></div>} />
          <Route path="/sponsor" element={<div className="min-h-screen flex items-center justify-center bg-black"><h1 className="text-2xl text-slate-400">Sponsor Portal (Deferred)</h1></div>} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
