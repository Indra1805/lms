// // UpdateProfile.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Card, Form, Button, Alert } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import api from '../utils/axiosInstance';

// const UpdateProfile = ({ token }) => {
//   const [user, setUser] = useState({ username: '', first_name: '', last_name: '', email: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await api.get('lms/user/', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setUser(response.data);
//       } catch (error) {
//         setError('Error loading user information');
//       }
//     };
//     if (token) {
//       fetchUser();
//     }
//   }, [token]);

//   const handleChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };
  
//   const handleUpdate = async () => {
//     try {
//       await api.put(
//         'lms/user/update/',
//         user,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       alert('Profile updated successfully!');
//       navigate('/dashboard');
//     } catch (error) {
//       alert('Error updating profile!');
//     }
//   };
  
//   if (error) {
//     return <Alert variant="danger">{error}</Alert>;
//   }

//   return (
//     <Card className="p-3 mt-3">
//       <h3>Update Profile</h3>
//       <Form.Group>
//         <Form.Label>Username:</Form.Label>
//         <Form.Control
//           name="username"
//           value={user.username}
//           onChange={handleChange}
//         />
//       </Form.Group>
//       <Form.Group className="mt-2">
//         <Form.Label>First Name:</Form.Label>
//         <Form.Control
//           name="first_name"
//           value={user.first_name}
//           onChange={handleChange}
//         />
//       </Form.Group>
//       <Form.Group className="mt-2">
//         <Form.Label>Last Name:</Form.Label>
//         <Form.Control
//           name="last_name"
//           value={user.last_name}
//           onChange={handleChange}
//         />
//       </Form.Group>
//       <Form.Group className="mt-2">
//         <Form.Label>Email:</Form.Label>
//         <Form.Control
//           name="email"
//           value={user.email}
//           onChange={handleChange}
//         />
//       </Form.Group>
//       <div className='d-flex gap-2'>
//         <Button className="mt-3" variant="outline-success" style={{'width':"130px"}} onClick={handleUpdate}>
//           Save Changes
//         </Button>
//         <Button className="mt-3" variant="outline-info" style={{'width':"130px"}} onClick={() => navigate('/dashboard')}>
//           Back
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default UpdateProfile;


import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';

const UpdateProfile = () => {
  const [user, setUser] = useState({ username: '', first_name: '', last_name: '', email: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('lms/user/');
        setUser(response.data);
      } catch (error) {
        setError('Error loading user information');
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await api.put('lms/user/update/', user);
      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Error updating profile!');
    }
  };

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card className="p-3 mt-3">
      <h3>Update Profile</h3>
      <Form.Group>
        <Form.Label>Username:</Form.Label>
        <Form.Control name="username" value={user.username} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mt-2">
        <Form.Label>First Name:</Form.Label>
        <Form.Control name="first_name" value={user.first_name} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mt-2">
        <Form.Label>Last Name:</Form.Label>
        <Form.Control name="last_name" value={user.last_name} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mt-2">
        <Form.Label>Email:</Form.Label>
        <Form.Control name="email" value={user.email} onChange={handleChange} />
      </Form.Group>
      <div className='d-flex gap-2'>
        <Button className="mt-3" variant="outline-success" style={{ width: '130px' }} onClick={handleUpdate}>
          Save Changes
        </Button>
        <Button className="mt-3" variant="outline-info" style={{ width: '130px' }} onClick={() => navigate('/dashboard')}>
          Back
        </Button>
      </div>
    </Card>
  );
};

export default UpdateProfile;
