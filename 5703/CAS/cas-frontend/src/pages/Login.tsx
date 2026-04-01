import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '../api/axios';
import FluidBackground from '../components/FluidBackground';
import { SYSTEM_MESSAGES } from '../constants/SystemMessages';

// Night mode persistent key (shared across app)
const NIGHT_MODE_KEY = 'cas_night_mode';

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Night mode state — shared with InnerLayout via localStorage
  const [nightMode, setNightMode] = useState(() => {
    const stored = localStorage.getItem(NIGHT_MODE_KEY);
    if (stored !== null) return stored === 'true';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  // Sync data-theme attribute to body
  useEffect(() => {
    if (nightMode) {
      document.body.setAttribute('data-theme', 'night');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [nightMode]);

  // Listen for system preference changes
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

  const toggleNightMode = () => {
    const next = !nightMode;
    setNightMode(next);
    localStorage.setItem(NIGHT_MODE_KEY, String(next));
  };

  // Recall last successful login email
  useEffect(() => {
    const lastEmail = localStorage.getItem('last_cas_email');
    if (lastEmail) {
      setEmail(lastEmail);
    }
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter both identifier and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const resp = await api.post('/auth/login', { email, password });
      const returnedRole = resp.data.role;
      
      localStorage.setItem('cas_token', resp.data.token);
      localStorage.setItem('cas_role', returnedRole);
      localStorage.setItem('last_cas_email', email);
      message.success(SYSTEM_MESSAGES.AUTH_SUCCESS);
      
      if (returnedRole === 'STUDENT') navigate('/student/welcome');
      else navigate(`/${returnedRole.toLowerCase()}`);
    } catch (err: any) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setErrorMsg(err.response.data);
      } else if (err.response && err.response.status === 401) {
        setErrorMsg(SYSTEM_MESSAGES.AUTH_FAILURE);
      } else {
        setErrorMsg(SYSTEM_MESSAGES.NETWORK_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative font-sans overflow-hidden">
      {/* WebGL fluid background with night mode support */}
      <FluidBackground nightMode={nightMode} />

      {/* Night mode toggle — fixed top-right */}
      <button 
        onClick={toggleNightMode}
        className="fixed top-6 right-6 z-50 color-btn flex items-center gap-2 px-4 py-2"
        title={nightMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
      >
        {nightMode ? '☀️' : '🌙'}
      </button>

      {/* Large typography */}
      <h1 className="heading z-10 select-none hidden md:block" style={{ left: '33%', transform: 'translate(-50%, -50%)' }}>
        SYDNEY CAS
      </h1>
      <h1 className="heading z-10 select-none md:hidden" style={{ top: '25%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '3.5rem' }}>
        CAS
      </h1>

      {/* Login panel */}
      <div className="fixed top-1/2 right-6 md:right-24 transform -translate-y-1/2 z-20 w-full max-w-[360px]">
        <div className="color-adjuster-panel">
          
          <div className="border-b border-white/10 pb-4 mb-6">
            <h2 className="text-white font-['Syne'] text-lg font-bold letter-spacing-wide uppercase">CAS Authenticator</h2>
            <p className="text-[#86868b] text-[12px] mt-1 font-['Inter']">Login to academic operations</p>
          </div>

          {errorMsg && (
            <Alert message={errorMsg} type="error" showIcon className="mb-6 bg-red-950/30 border-red-900/50 text-red-200" />
          )}

          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-white font-['Syne'] text-[11px] uppercase tracking-[0.1em] mb-2 opacity-80">Credentials</label>
              <Input 
                size="large" 
                placeholder="Unikey / Email Address" 
                prefix={<UserOutlined className="text-white/50 mr-2" />} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="panel-input h-11 text-[13px]"
                onPressEnter={handleAuth}
              />
            </div>
            
            <div>
              <label className="block text-white font-['Syne'] text-[11px] uppercase tracking-[0.1em] mb-2 opacity-80">Password</label>
              <Input.Password 
                size="large" 
                placeholder="Academic Password" 
                prefix={<LockOutlined className="text-white/50 mr-2" />} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onPressEnter={handleAuth}
                className="panel-input h-11 text-[13px]"
              />
            </div>
          </div>
          
          <button 
            onClick={handleAuth}
            disabled={loading || !email || !password}
            className="w-full export-btn h-11 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
