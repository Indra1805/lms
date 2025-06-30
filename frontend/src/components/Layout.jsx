// import React, { useEffect, useState } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { Col, Row } from 'react-bootstrap';
// import api from '../utils/axiosInstance';
// import Navbar from './Navbar';

// const Layout = ({ token, setToken }) => {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [role, setRole] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       if (!token) return;

//       try {
//         const resUser = await api.get('lms/user/', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setUser(resUser.data);
//         setRole(resUser.data.role);

//         const resProfile = await api.get('lms/profiles/', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const matchedProfile = resProfile.data.find(
//           (p) => p.user === resUser.data.id
//         );
//         setProfile(matchedProfile || null);
//       } catch (err) {
//         console.error('Failed to fetch user/profile info', err);
//         setToken(null);
//         navigate('/login');
//       }
//     };

//     fetchUserInfo();
//   }, [token, setToken, navigate]);

//   return (
//     <>
//       <Row>
//         <Navbar token={token} setToken={setToken} role={role} user={user} profile={profile} />
//         {/* <Col sm={2}></Col> */}
//         {/* <Col sm={8} className="border-start border-end border-2"> */}
//           <Outlet context={{ token, user, role, profile }} />
//         {/* </Col> */}
//         {/* <Col sm={2}></Col> */}
//       </Row>
//     </>
//   );
// };

// export default Layout;



import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import api from '../utils/axiosInstance';
import Navbar from './Navbar';

const Layout = ({ token, setToken }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const resUser = await api.get('lms/user/');
        setUser(resUser.data);
        setRole(resUser.data.role);

        const resProfile = await api.get('lms/profiles/');
        const matchedProfile = resProfile.data.find(p => p.user === resUser.data.id);
        setProfile(matchedProfile || null);
      } catch (err) {
        console.error('Failed to fetch user/profile info', err);
        setToken(null);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
      }
    };

    if (token) {
      fetchUserInfo();
    }
  }, [token, setToken, navigate]);

  return (
    <>
      <Row>
        <Navbar token={token} setToken={setToken} role={role} user={user} profile={profile} />
        <Outlet context={{ token, user, role, profile }} />
      </Row>
    </>
  );
};

export default Layout;
