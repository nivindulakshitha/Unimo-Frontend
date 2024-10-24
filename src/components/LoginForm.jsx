import React, { useState } from 'react';
import { Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/LoginForm.css';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
    const {setUser} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                `/api/auth/login`,
                {
                    email,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if (response.status === 200) {
                if (response.data.success) {
                    setUser(response.data);
                    sessionStorage.setItem('userBio', JSON.stringify(response.data));
                    navigate('/dashboard', { state: response.data });
                } else {
                    console.log('Login failed:', response.data.message);
                    message.error('Invalid email or password');
                }
            } else {
                console.log('Unexpected response status:', response.status);
                message.error('Failed to login. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('Failed to login. Please try again.');
        }
    };
    

    return (
        <div className="login-form">
            <Input
                size="large"
                placeholder="Email"
                prefix={<UserOutlined />}
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input.Password
                size="large"
                placeholder="Password"
                prefix={<LockOutlined />}
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="login-options">
                <Checkbox>Remember email</Checkbox>
                <a href="#" className="forgot-password-link">Forgot Password</a>
            </div>
            <Button
                type="primary"
                size="large"
                className="login-button"
                onClick={handleLogin}
            >
                Login
            </Button>
        </div>
    );
};

export default LoginForm;
