import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Radio, message, Alert, Tabs } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  
  const [email, setEmail] = useState('student@sydney.edu.au');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('STUDENT');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (activeTab === 'login') {
        const resp = await axios.post('http://localhost:8080/api/v1/auth/login', { email, password });
        const returnedRole = resp.data.role;
        localStorage.setItem('cas_token', resp.data.token);
        localStorage.setItem('cas_role', returnedRole);
        message.success('登录成功！已获取系统凭证。');
        
        if (returnedRole === 'STUDENT') navigate('/student');
        else navigate('/' + returnedRole.toLowerCase());
      } else {
        await axios.post('http://localhost:8080/api/v1/auth/register', { email, password, fullName, role });
        message.success('账户创建成功！您可以直接登录了。');
        setActiveTab('login');
      }
    } catch (err: any) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setErrorMsg(err.response.data);
      } else if (err.response && err.response.status === 401) {
        setErrorMsg('账号或密码不匹配，请重试。');
      } else {
        setErrorMsg('Network error: Does Spring Boot running on port 8080?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative font-sans">
      <div className="absolute top-0 w-full h-[32vh] bg-[#4CAF50] z-0"></div>

      <Card className="w-full max-w-[420px] shadow-xl border-none z-10 rounded-sm">
        <div className="text-center mb-6 pt-4">
          <h1 className="text-xl font-semibold text-slate-800 mb-1">Capstone Administration System</h1>
          <p className="text-slate-500 text-sm">Please authenticate to continue</p>
        </div>

        {errorMsg && (
          <Alert message={errorMsg} type="error" showIcon className="mb-4 text-xs" />
        )}

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          centered
          items={[
            { key: 'login', label: 'Sign In' },
            { key: 'register', label: 'Create Account' }
          ]}
        />

        <div className="space-y-4 mt-2">
          {activeTab === 'register' && (
            <Input 
              size="large" 
              placeholder="Your Full Name" 
              prefix={<IdcardOutlined className="text-slate-400 mr-1" />} 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-sm h-11 text-[13px]"
            />
          )}

          <Input 
            size="large" 
            placeholder="Unikey / Institutional Email" 
            prefix={<UserOutlined className="text-slate-400 mr-1" />} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-sm h-11 text-[13px]"
          />
          <Input.Password 
            size="large" 
            placeholder="Password" 
            prefix={<LockOutlined className="text-slate-400 mr-1" />} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={handleAuth}
            className="rounded-sm h-11 text-[13px]"
          />
          
          {activeTab === 'register' && (
            <div className="pt-2 pb-2">
              <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Select Role Type:</p>
              <Radio.Group onChange={(e) => setRole(e.target.value)} value={role} className="flex justify-between w-full">
                <Radio value="STUDENT"><span className="text-[13px] text-slate-600">Student</span></Radio>
                <Radio value="ADMIN"><span className="text-[13px] text-slate-600">Admin</span></Radio>
                <Radio value="SPONSOR"><span className="text-[13px] text-slate-600">Sponsor</span></Radio>
              </Radio.Group>
            </div>
          )}

          <Button 
            type="primary" 
            size="large" 
            block 
            onClick={handleAuth}
            loading={loading}
            className="bg-[#4CAF50] hover:bg-[#388E3C] border-none mt-2 h-11 rounded-sm font-semibold text-sm tracking-wide"
          >
            {activeTab === 'login' ? 'Proceed & Sign in' : 'Register Now'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
