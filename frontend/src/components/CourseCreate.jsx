// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Form, Button, Card, Alert } from 'react-bootstrap';
// import api from '../utils/axiosInstance';

// const CourseCreate = ({ token }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState(null);
//   const [image, setImage] = useState(null);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('price', price);
//     if (image) formData.append('image', image);

//     try {
//       await api.post('lms/courses/', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       navigate('/courses');
//     } catch (err) {
//       setError('Failed to create course');
//     }
//   };

//   return (
//     <Card className="p-4">
//       <h4>Create New Course</h4>
//       {error && <Alert variant="danger">{error}</Alert>}
//       <Form onSubmit={handleSubmit} encType="multipart/form-data">
//         <Form.Group className="mb-3">
//           <Form.Label>Title</Form.Label>
//           <Form.Control
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <Form.Label>Description</Form.Label>
//           <Form.Control
//             as="textarea"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <Form.Label>Price</Form.Label>
//           <Form.Control
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <Form.Label>Course Image</Form.Label>
//           <Form.Control
//             type="file"
//             accept="image/*"
//             onChange={(e) => setImage(e.target.files[0])}
//           />
//         </Form.Group>

//         <div className="d-flex">
//           <Button type="submit" variant="outline-success">
//             Create
//           </Button>
//           <Button variant="outline-primary" className="ms-2" onClick={() => navigate(-1)}>
//             Back
//           </Button>
//         </div>
//       </Form>
//     </Card>
//   );
// };

// export default CourseCreate;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import api from '../utils/axiosInstance';

const CourseCreate = ({ token }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [concepts, setConcepts] = useState([
    { title: '', content: '', order: 1 },
  ]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleConceptChange = (index, field, value) => {
    const updated = [...concepts];
    updated[index][field] = value;
    setConcepts(updated);
  };

  const addConcept = () => {
    setConcepts([...concepts, { title: '', content: '', order: concepts.length + 1 }]);
  };

  const removeConcept = (index) => {
    const updated = [...concepts];
    updated.splice(index, 1);
    setConcepts(updated.map((c, i) => ({ ...c, order: i + 1 }))); // reorder
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseData = new FormData();
    courseData.append('title', title);
    courseData.append('description', description);
    courseData.append('price', price);
    if (image) courseData.append('image', image);

    const payload = {
      title,
      description,
      price,
      concepts,
    };

    try {
      await api.post('lms/courses/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/courses');
    } catch (err) {
      console.error(err);
      setError('Failed to create course');
    }
  };

  return (
    <Card className="p-4">
      <h4>Create New Course</h4>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Course Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Form.Group>

        <h5>Concepts</h5>
        {concepts.map((concept, index) => (
          <Card key={index} className="p-3 mb-2 bg-light">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={concept.title}
                    onChange={(e) => handleConceptChange(index, 'title', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Order</Form.Label>
                  <Form.Control
                    type="number"
                    value={concept.order}
                    onChange={(e) => handleConceptChange(index, 'order', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-2">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={concept.content}
                onChange={(e) => handleConceptChange(index, 'content', e.target.value)}
                required
              />
            </Form.Group>
            <Button
              variant="outline-danger"
              onClick={() => removeConcept(index)}
              disabled={concepts.length === 1}
            >
              Remove Concept
            </Button>
          </Card>
        ))}

        <Button variant="outline-secondary" onClick={addConcept} className="mb-3">
          + Add Concept
        </Button>

        <div className="d-flex">
          <Button type="submit" variant="outline-success">
            Create Course
          </Button>
          <Button variant="outline-primary" className="ms-2" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default CourseCreate;
