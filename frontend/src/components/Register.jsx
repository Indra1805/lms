import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('lms/register/', {
        username,
        password,
        role,
      });
      setMessage('Registration successful!');
      setUsername('');
      setPassword('');
      setRole('');
      navigate('/login'); // ✅ Redirect to Login
    } catch (error) {
      setMessage('Error registering user!');
    }
  };
  
  return (
    <div className='d-flex justify-content-center align-items-center'>
      <Card className="p-3 mt-3 w-50">
        <h3>Register</h3>
        {message && <Alert variant={message.includes('Error') ? 'danger' : 'success'}>{message}</Alert>}
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
              autoComplete="new-password"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">Register</Button>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
