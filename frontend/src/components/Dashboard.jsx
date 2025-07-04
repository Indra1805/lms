import React, { useEffect, useState } from 'react';
import {
  Card,
  Alert,
  Button,
  Row,
  Col,
  Image,
  Modal,
  Form,
  Spinner,
  Accordion
} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axiosInstance';
import '../css/Dashboard.module.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const resUser = await api.get('lms/user/');
        const fetchedUser = resUser.data;
        setUser(fetchedUser);

        const resProfile = await api.get('lms/profiles/');
        const userProfile = resProfile.data.find(p => p.user === fetchedUser.id);
        setProfile(userProfile || null);

        if (fetchedUser.role === 'student') {
          const resEnrollments = await api.get('lms/enrollments/');
          setEnrollments(resEnrollments.data);
        } else {
          const resCourses = await api.get(`lms/courses/?created_by=${fetchedUser.id}`);
          setCourses(resCourses.data);
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong. Please try again.');
      }
    };

    fetchAllData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !user) return;

    const formData = new FormData();
    formData.append('dp', selectedFile);

    try {
      setUploading(true);

      if (profile) {
        await api.patch(`lms/profiles/${profile.id}/`, formData);
      } else {
        formData.append('user', user.id);
        await api.post('lms/profiles/', formData);
      }

      const resProfile = await api.get('lms/profiles/');
      const updatedProfile = resProfile.data.find(p => p.user === user.id);
      setProfile(updatedProfile || null);
      setShowModal(false);
      setSelectedFile(null);

    } catch {
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!user) return <div>Loading...</div>;

  const displayCourses =
    user.role === 'student'
      ? enrollments.map(e => e.course_details).filter(Boolean)
      : courses;

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handleCloseCourseModal = () => {
    setShowCourseModal(false);
    setSelectedCourse(null);
  };

  return (
    <>
      <Card className="p-3 mt-3">
        <div className="d-flex align-items-center mb-3">
          <Image
            src={
              profile?.dp?.includes('://')
                ? profile.dp
                : profile?.dp
                  ? `http://localhost:8000${profile.dp}`
                  : 'https://via.placeholder.com/80?text=DP'
            }
            roundedCircle
            width={100}
            height={100}
            className="me-3 border border-secondary"
          />

          <div>
            <p className="mb-1"><strong>{user.username}</strong></p>
            <p className="mb-1">Email: {user.email}</p>
            <p className="mb-1">Name: {user.first_name} {user.last_name}</p>
            <p className="mb-1">Role: {user.role}</p>
          </div>
        </div>

        <div className="mb-2">
          <Button variant="outline-primary" onClick={() => setShowModal(true)}>
            {profile?.dp ? 'Change Profile Picture' : 'Set Profile Picture'}
          </Button>
          <Button
            variant="outline-info"
            className="ms-2"
            onClick={() => navigate('/update-profile')}
          >
            Update Profile
          </Button>
          {user.role !== 'student' && (
            <Link to="/create-course" className="btn btn-outline-success ms-2">
              Create Course
            </Link>
          )}
        </div>
      </Card>

      <h5 className="mt-4">
        {user.role === 'student' ? 'Enrolled Courses' : 'Created Courses'}
      </h5>

      <Row className="mt-2" lg={4}>
        {displayCourses.map(course => (
          <Col md={4} key={course.id} className="mb-4">
            <Card className="h-100 shadow-sm" onClick={() => handleCardClick(course)} style={{ cursor: 'pointer' }}>
              <Card.Img
                variant="top"
                src={
                  course.image
                    ? course.image.startsWith('http')
                      ? course.image
                      : `http://localhost:8000${course.image}`
                    : 'https://via.placeholder.com/400x200?text=No+Image'
                }
                alt={course.title}
                style={{ height: '180px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between mb-2">
                  <Card.Title>{course.title}</Card.Title>
                  <strong>₹{course.price || 0}</strong>
                </div>
                {user.role !== 'student' && (
                  <Button
                    variant="warning"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-course/${course.id}`);
                    }}
                  >
                    Edit
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {profile?.dp ? 'Change' : 'Set'} Profile Picture
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpload}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Select Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={uploading}>
              {uploading ? <Spinner animation="border" size="sm" /> : 'Upload'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showCourseModal} onHide={handleCloseCourseModal} size="lg" centered>
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
                    {/* <p><strong>Description:</strong> {concept.content}</p> */}
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

                    {concept.duration && (
                      <p><strong>Duration:</strong> {concept.duration}</p>
                    )}
                    {concept.video_link && (
                      <p>
                        <strong>Video:</strong>{' '}
                        <a href={concept.video_link} target="_blank" rel="noopener noreferrer">
                          Watch
                        </a>
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
          <Button variant="secondary" onClick={handleCloseCourseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Dashboard;
