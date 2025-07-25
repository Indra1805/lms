import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UpdateProfile from './components/UpdateProfile';
import CourseCreate from './components/CourseCreate';
import CourseList from './components/CourseList';
import CartPage from './components/CartPage';
import EditCourse from './components/EditCourse';
import Layout from './components/Layout';
import Home from './components/Home';
import Payment from './components/Payment';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from './context/CartContext';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || '');


  // Keep token state synced with localStorage
  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem('access'));
    window.addEventListener('storage', syncToken);
    return () => window.removeEventListener('storage', syncToken);
  }, []);

  return (
    <CartProvider>
      <Router>
        <div className="mt-3 mx-3">
          <Routes>
            <Route path="/" element={<Layout token={token} setToken={setToken} />}>
              <Route index element={<Home />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login setToken={setToken} setRole={setRole} />} />
              <Route path="dashboard" element={token ? <Dashboard token={token} /> : <Navigate to="/login" />} />
              <Route path="update-profile" element={token ? <UpdateProfile token={token} /> : <Navigate to="/login" />} />
              <Route path="courses" element={<CourseList token={token} role={role} />} />
              <Route path="create-course" element={token ? <CourseCreate token={token} /> : <Navigate to="/login" />} />
              <Route path="edit-course/:id" element={token ? <EditCourse token={token} /> : <Navigate to="/login" />} />
              <Route path="cart" element={token ? <CartPage /> : <Navigate to="/login" />} />
              <Route path="/payment" element={<Payment token={token} />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
