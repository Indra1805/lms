import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Alert, Image } from 'react-bootstrap';
import api from '../utils/axiosInstance';

const EditCourse = ({ token }) => {
  const { id } = useParams();
  const [course, setCourse] = useState({ title: '', description: '', price:null, image: null });
  const [existingImage, setExistingImage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`lms/courses/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse({
          title: response.data.title,
          description: response.data.description,
          price: response.data.price,
        });
        setExistingImage(response.data.image);
      } catch (err) {
        setError('Failed to load course');
      }
    };
    fetchCourse();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', course.title);
    formData.append('description', course.description);
    formData.append('price', course.price);
    if (course.image) {
      formData.append('image', course.image);
    }

    try {
      await api.put(`lms/courses/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to update course');
    }
  };

  return (
    <Card className="p-4 mt-3">
      <h4>Edit Course</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={course.title}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            value={course.description}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            value={course.price}
            onChange={(e) => setCourse({ ...course, price: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Course Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setCourse({ ...course, image: e.target.files[0] })}
          />
        </Form.Group>
        {existingImage && (
          <div className="mb-3">
            <p>Current Image:</p>
            <Image src={`http://localhost:8000${existingImage}`} fluid rounded />
          </div>
        )}
        <Button type="submit" variant="primary">
          Update Course
        </Button>
      </Form>
    </Card>
  );
};

export default EditCourse;
