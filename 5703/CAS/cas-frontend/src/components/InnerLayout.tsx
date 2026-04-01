import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogoutOutlined, HomeOutlined, TeamOutlined, ProfileOutlined } from '@ant-design/icons';
import { ConfigProvider, theme } from 'antd';
import FluidBackground from './FluidBackground';

const InnerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('cas_token');
    localStorage.removeItem('cas_role');
    navigate('/login');
  };

  const getRole = () => localStorage.getItem('cas_role');
  const role = getRole();
  let activeScheme = 1;
  if (location.pathname.includes('team_hub')) activeScheme = 2;
  else if (location.pathname.includes('preferences')) activeScheme = 3;
  else if (location.pathname.includes('reflections')) activeScheme = 4;

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-white">
      {/* Real Interactive WebGL Background dynamically colored by route */}
      <FluidBackground scheme={activeScheme} />

      {/* Floating navigation panel imitating .color-controls */}
      <div className="fixed top-6 right-6 z-50 flex gap-4">
        {role === 'STUDENT' && (
          <>
            <button 
              className={`color-btn flex items-center gap-2 ${location.pathname.includes('/student/welcome') ? 'active' : ''}`}
              onClick={() => navigate('/student/welcome')}
            >
              <HomeOutlined /> HOME
            </button>
            <button 
              className={`color-btn flex items-center gap-2 ${location.pathname.includes('/student/team_hub') ? 'active' : ''}`}
              onClick={() => navigate('/student/team_hub')}
            >
              <TeamOutlined /> ROSTER
            </button>
            <button 
              className={`color-btn flex items-center gap-2 ${location.pathname.includes('/student/reflections') ? 'active' : ''}`}
              onClick={() => navigate('/student/reflections')}
            >
              <ProfileOutlined /> LOGOUT
            </button>
          </>
        )}
        
        {/* Extensibility for tutor/admin... */}

        <button 
          onClick={handleLogout}
          className="export-btn flex items-center gap-2 px-6 ml-4 text-red-100 hover:text-red-400 border-red-900/40 hover:border-red-500 hover:bg-red-900/10"
        >
          <LogoutOutlined /> DISCONNECT
        </button>
      </div>

      <div className="relative z-10 w-full h-full pb-16 pt-24 max-h-screen overflow-y-auto overflow-x-hidden">
        <ConfigProvider theme={{ 
          algorithm: theme.darkAlgorithm, 
          token: { 
            colorPrimary: '#ffffff',
            colorBgBase: 'rgba(0,0,0,0.1)',
            colorBgContainer: 'rgba(255,255,255,0.05)',
            colorBgElevated: 'rgba(15,15,25,0.85)',
            colorBorder: 'rgba(255,255,255,0.2)',
            fontFamily: 'Inter, sans-serif',
            colorText: '#ffffff'
          } 
        }}>
          <Outlet />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default InnerLayout;
