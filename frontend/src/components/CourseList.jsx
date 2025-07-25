import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, Row, Col, Modal, Accordion } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';

const CourseList = ({ token, role }) => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('lms/courses/', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to load courses:', error);
        setError('Failed to load courses.');
      }
    };
    fetchCourses();
  }, [token]);

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setShowRegistration(true);
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    setShowRegistration(false);
    navigate('/payment', {
      state: {
        ...registrationData,
        courses: [selectedCourse]
      }
    });
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={1} md={2} lg={4} className="g-4">
        {courses.map((course) => {
          if (!course || !course.id) return null;
          return (
            <Col key={course.id} className='mb-2'>
              <Card
                className="h-100 rounded-3 shadow-sm overflow-hidden"
                onClick={() => handleCardClick(course)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Img
                  variant="top"
                  src={course.image || 'https://via.placeholder.com/400x200.png?text=Course+Image'}
                  alt={course.title || 'Course'}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <Card.Title className="mb-0">{course.title}</Card.Title>
                  <strong>₹{course.price || 0}</strong>
                </Card.Body>

                {token && role === 'student' ? (
                  <div className='d-flex border-top'>
                    <Button
                      variant="outline-success"
                      className="w-50 rounded-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnrollClick(course);
                      }}
                    >
                      Get Enrolled
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="w-50 rounded-0 border-start"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(course);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                ) : !token ? (
                  <Button
                    variant="outline-success"
                    className="w-100 rounded-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/login');
                    }}
                  >
                    Login to Enroll or Add to Cart
                  </Button>
                ) : null}
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Course Concepts Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCourse?.title} - Concepts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse?.concepts?.length ? (
            <Accordion defaultActiveKey="0">
              {selectedCourse.concepts.map((concept, idx) => (
                <Accordion.Item eventKey={String(idx)} key={concept.id || idx}>
                  <Accordion.Header>{concept.title}</Accordion.Header>
                  <Accordion.Body>
                    <p><strong>Description:</strong></p>
                    <ul>
                      {concept.content
                        .split(/([.?])/g)
                        .reduce((acc, part) => {
                          if (part === '.' || part === '?') {
                            acc[acc.length - 1] += part;
                          } else {
                            acc.push(part.trim());
                          }
                          return acc;
                        }, [])
                        .filter(line => line)
                        .map((line, index) => (
                          <li key={index}>{line}</li>
                        ))}
                    </ul>
                    {concept.duration && <p><strong>Duration:</strong> {concept.duration}</p>}
                    {concept.video_link && (
                      <p>
                        <strong>Video:</strong>{' '}
                        <a href={concept.video_link} target="_blank" rel="noopener noreferrer">Watch</a>
                      </p>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          ) : (
            <p>No concepts available for this course.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Registration Modal */}
      <Modal show={showRegistration} onHide={() => setShowRegistration(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Course Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleRegistrationSubmit}>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="First Name"
              required
              onChange={(e) => setRegistrationData({ ...registrationData, first_name: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Last Name"
              required
              onChange={(e) => setRegistrationData({ ...registrationData, last_name: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Phone"
              required
              onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
            />
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              required
              onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
            />
            <Button type="submit" className="w-100" variant="success">
              Proceed to Payment
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CourseList;
