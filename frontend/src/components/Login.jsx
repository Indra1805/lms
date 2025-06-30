import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';

const Login = ({ setToken, setRole }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ✅ Show error for full 60 seconds
  useEffect(() => {
    if (!error) return;
    console.log('Error set:', error);  // Debug
    const timer = setTimeout(() => {
      console.log('Clearing error');
      setError('');
    }, 5000); // 60 seconds
    return () => clearTimeout(timer);
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('lms/login/', {
        username,
        password,
      });

      const { access, refresh, role } = response.data;

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('role', role);

      setToken(access);
      setRole(role);
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.detail || 'Invalid credentials';
        if (/no active account/i.test(message)) {
          setError('User does not exist with the provided credentials.');
        } else if (error.response.status === 401) {
          setError(message);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } else {
        setError('Server is unreachable. Please check your connection.');
      }
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center'>
      <Card className="p-4 mt-4 w-100" style={{ maxWidth: '500px' }}>
        <h3 className="text-center mb-3">Login</h3>

        {/* ✅ Dismissible alert (optional) */}
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100">Login</Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
