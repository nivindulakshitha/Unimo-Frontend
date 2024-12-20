import React, { useState } from 'react';
import { Input, Button, Checkbox, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../assets/css/LoginForm.css';
import { useAuth } from '../context/AuthContext';
import newApiRequest from '../utils/apiRequests';

const LoginForm = () => {
	const { setUser } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const [loginIn, setLoginIn] = useState(false)

	const handleLogin = async () => {
		setLoginIn(true);
		try {
			const response = await newApiRequest(
				`/api/auth/login`,
				'POST',
				{
					email,
					password,
				}
			);

			if (response.status === 200) {
				if (response.success) {
					console.log('Login successful:', response);
					setUser(response);
					sessionStorage.setItem('userBio', JSON.stringify(response));
					navigate('/dashboard', { state: response });
				} else {
					console.log('Unexpected response:', response);
					message.error('Failed to login. Please try again.');
					setLoginIn(false)
				}
			} else {
				console.log('Unexpected response:', response);
				message.error(response.message || 'Failed to login. Please try again.');
				setLoginIn(false)
			}
		} catch (error) {
			console.error('Login error:', error);
			setLoginIn(false);

			// Specific error handling based on the error response
			if (error.response) {
				// Backend response with error
				if (error.response.status === 401) {
					message.error('Invalid username or password');
				} else if (error.response.status === 403) {
					message.error('Email not verified. Please check your email to verify your account.');
				} else {
					message.error('Failed to login. Please try again.');
				}
			} else {
				// Network error or other issue
				message.error('An error occurred. Please check your internet connection and try again.');
			}
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
			<Spin spinning={loginIn}>
				<Button
					type="primary"
					size="large"
					className="login-button"
					onClick={handleLogin}
				>
					Login
				</Button>
			</Spin>
		</div>
	);
};

export default LoginForm;
