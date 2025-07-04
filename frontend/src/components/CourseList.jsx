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
                    <EnrollButton token={token} courseId={course.id} navigate={navigate} />
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

      {/* Modal to show concepts */}
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
                    {/* <p><strong>Description:</strong>{concept.content}</p> */}
                    <p><strong>Description:</strong></p>
                    <ul>
                      {concept.content
                        .split(/([.?])/g)
                        .reduce((acc, part, idx, arr) => {
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
    </div>
  );
};

const EnrollButton = ({ token, courseId, navigate }) => {
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (!courseId) {
      alert('Invalid course ID.');
      return;
    }

    setLoading(true);
    try {
      await api.post(
        'lms/enrollments/',
        { course: courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolled(true);
    } catch (err) {
      console.error('Enrollment error:', err.response?.data || err.message);
      alert('Enrollment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline-success"
      onClick={(e) => {
        e.stopPropagation();
        handleEnroll();
      }}
      disabled={enrolled || loading}
      className="w-50 rounded-0"
    >
      {enrolled ? 'Enrolled' : loading ? 'Enrolling...' : 'Get Enrolled'}
    </Button>
  );
};

export default CourseList;
