import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogoutOutlined, HomeOutlined, ProfileOutlined } from '@ant-design/icons';
import { ConfigProvider, theme } from 'antd';
import FluidBackground from './FluidBackground';

// 夜间模式持久化 key
const NIGHT_MODE_KEY = 'cas_night_mode';

const InnerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ---- 夜间模式状态管理 ----
  const [nightMode, setNightMode] = useState(() => {
    // 优先读取用户手动设定
    const stored = localStorage.getItem(NIGHT_MODE_KEY);
    if (stored !== null) return stored === 'true';
    // 否则跟随系统偏好
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  // 监听系统偏好变化（仅在用户未手动设定时生效）
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(NIGHT_MODE_KEY) === null) {
        setNightMode(e.matches);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // 同步 data-theme 到 body
  useEffect(() => {
    if (nightMode) {
      document.body.setAttribute('data-theme', 'night');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [nightMode]);

  // 用户手动切换
  const toggleNightMode = () => {
    const next = !nightMode;
    setNightMode(next);
    localStorage.setItem(NIGHT_MODE_KEY, String(next));
  };

  const handleLogout = () => {
    localStorage.removeItem('cas_token');
    localStorage.removeItem('cas_role');
    navigate('/login');
  };

  const role = localStorage.getItem('cas_role');

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-white">
      {/* WebGL fluid background — only nightMode, no per-page scheme */}
      <FluidBackground nightMode={nightMode} />

      {/* 顶部浮动导航栏 */}
      <div className="fixed top-6 right-6 z-50 flex gap-4">
        {role === 'STUDENT' && (
          <>
            <button 
              className={`color-btn flex items-center gap-2 ${location.pathname.includes('/student/dashboard') ? 'active' : ''}`}
              onClick={() => navigate('/student/dashboard')}
            >
              <HomeOutlined /> DASHBOARD
            </button>
            <button 
              className={`color-btn flex items-center gap-2 ${location.pathname.includes('/student/profile') ? 'active' : ''}`}
              onClick={() => navigate('/student/profile')}
            >
              <ProfileOutlined /> PROFILE
            </button>
          </>
        )}
        
        {/* 夜间模式切换按钮 */}
        <button 
          onClick={toggleNightMode}
          className="color-btn flex items-center gap-2 px-4"
          title={nightMode ? '切换到标准模式' : '切换到夜间模式'}
        >
          {nightMode ? '☀️' : '🌙'}
        </button>

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
