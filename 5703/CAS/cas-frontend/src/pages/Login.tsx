import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import FluidBackground from '../components/FluidBackground';

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 回显上次成功登录账号
  useEffect(() => {
    const lastEmail = localStorage.getItem('last_cas_email');
    if (lastEmail) {
      setEmail(lastEmail);
    }
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter both identifier and passcode.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const resp = await axios.post('http://localhost:8080/api/v1/auth/login', { email, password });
      const returnedRole = resp.data.role;
      
      localStorage.setItem('cas_token', resp.data.token);
      localStorage.setItem('cas_role', returnedRole);
      localStorage.setItem('last_cas_email', email);
      message.success('Authentication sequence completed.');
      
      if (returnedRole === 'STUDENT') navigate('/student/welcome');
      else navigate(`/${returnedRole.toLowerCase()}`);
    } catch (err: any) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setErrorMsg(err.response.data);
      } else if (err.response && err.response.status === 401) {
        setErrorMsg('Denial: Identifier or passcode anomaly detected.');
      } else {
        setErrorMsg('Fatal: Core authentication network unreachable.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative font-sans overflow-hidden">
      {/* Fluid WebGL Component interacting with cursor drops */}
      <FluidBackground />

      {/* Massive Typography Centered Canvas - OFFSET LEFT to prevent panel overlap */}
      <h1 className="heading z-10 select-none hidden md:block" style={{ left: '33%', transform: 'translate(-50%, -50%)' }}>
        SYDNEY CAS
      </h1>
      <h1 className="heading z-10 select-none md:hidden" style={{ top: '25%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '3.5rem' }}>
        CAS
      </h1>

      {/* Reutilized WebGL/Color-Adjuster Panel for Login */}
      <div className="fixed top-1/2 right-6 md:right-24 transform -translate-y-1/2 z-20 w-full max-w-[360px]">
        <div className="color-adjuster-panel">
          
          <div className="border-b border-white/10 pb-4 mb-6">
            <h2 className="text-white font-['Syne'] text-lg font-bold letter-spacing-wide uppercase">System Access</h2>
            <p className="text-[#86868b] text-[12px] mt-1 font-['Inter']">Establish bi-directional auth connection</p>
          </div>

          {errorMsg && (
            <Alert message={errorMsg} type="error" showIcon className="mb-6 bg-red-950/30 border-red-900/50 text-red-200" />
          )}

          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-white font-['Syne'] text-[11px] uppercase tracking-[0.1em] mb-2 opacity-80">Identifier</label>
              <Input 
                size="large" 
                placeholder="Unikey / Institutional Email" 
                prefix={<UserOutlined className="text-white/50 mr-2" />} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="panel-input h-11 text-[13px]"
                onPressEnter={handleAuth}
              />
            </div>
            
            <div>
              <label className="block text-white font-['Syne'] text-[11px] uppercase tracking-[0.1em] mb-2 opacity-80">Passcode</label>
              <Input.Password 
                size="large" 
                placeholder="Secure Password" 
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
            {loading ? 'AUTHENTICATING...' : 'INITIALIZE'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
