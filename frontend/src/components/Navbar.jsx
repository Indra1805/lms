import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Navbar as BsNavbar,
  Nav,
  Container,
  Badge,
  Dropdown,
  Image,
} from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = ({ token, setToken, role, user, profile }) => {
  const navigate = useNavigate();
  const { cart } = useCart();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setToken(null);
    navigate('/login');
  };

  const getProfileImage = () => {
    if (!profile || !profile.dp) return 'https://via.placeholder.com/35?text=DP';
    return profile.dp.includes('://')
      ? profile.dp
      : `http://localhost:8000${profile.dp}`;
  };

  return (
    <BsNavbar bg="light" expand="lg" className="mb-3">
      <Container fluid>
        <BsNavbar.Brand as={Link} to="/" className='text-info'>Mentoraa</BsNavbar.Brand>

        <Nav className="me-auto">
          {<Nav.Link as={Link} to="/courses">Courses</Nav.Link>}
        </Nav>

        <Nav className="align-items-center">
          {token ? (
            <>
              <Nav.Link as={Link} to="/cart">
                <FaShoppingCart size={20} />
                {cart.length > 0 && (
                  <Badge bg="danger" className="ms-1" pill style={{
                    position: "absolute",
                    top: "12px",
                    right: "135px",
                    fontSize: "0.65rem",
                  }}>{cart.length}</Badge>
                )}
              </Nav.Link>

              <Dropdown align="end" className="ms-3">
                <Dropdown.Toggle variant="light" className="d-flex align-items-center">
                  <Image
                    src={getProfileImage()}
                    roundedCircle
                    width={30}
                    height={30}
                    className="me-2 border border-secondary"
                  />
                  <span>{user?.username || 'User'}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/dashboard">Dashboard</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
