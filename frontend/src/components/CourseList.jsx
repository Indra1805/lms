import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/axiosInstance';

const CourseList = ({ token, role }) => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('lms/courses/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to load courses:', error);
        setError('Failed to load courses.');
      }
    };

    if (token) fetchCourses();
  }, [token]);

  console.log('User role:', role);

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={1} md={2} lg={4} className="g-4">
        {courses.map((course) => {
          if (!course || !course.id) return null;

          return (
            <Col key={course.id} className='mb-2'>
              <Card className="h-100 rounded-3 shadow-sm overflow-hidden">
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

                {role === 'student' && (
                  <div className="d-flex border-top">
                    <EnrollButton token={token} courseId={course.id} />
                    <Button
                      variant="outline-secondary"
                      className="w-50 rounded-0 border-start"
                      onClick={() => addToCart(course)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

const EnrollButton = ({ token, courseId }) => {
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (!courseId) {
      alert('Invalid course ID. Cannot enroll.');
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
      onClick={handleEnroll}
      disabled={enrolled || loading}
      className="w-50 rounded-0"
    >
      {enrolled ? 'Enrolled' : loading ? 'Enrolling...' : 'Get Enrolled'}
    </Button>
  );
};

export default CourseList;
