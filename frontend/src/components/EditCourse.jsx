// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Form, Button, Card, Alert, Image } from 'react-bootstrap';
// import api from '../utils/axiosInstance';

// const EditCourse = ({ token }) => {
//   const { id } = useParams();
//   const [course, setCourse] = useState({ title: '', description: '', price:null, image: null });
//   const [existingImage, setExistingImage] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const response = await api.get(`lms/courses/${id}/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCourse({
//           title: response.data.title,
//           description: response.data.description,
//           price: response.data.price,
//         });
//         setExistingImage(response.data.image);
//       } catch (err) {
//         setError('Failed to load course');
//       }
//     };
//     fetchCourse();
//   }, [id, token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('title', course.title);
//     formData.append('description', course.description);
//     formData.append('price', course.price);
//     if (course.image) {
//       formData.append('image', course.image);
//     }

//     try {
//       await api.put(`lms/courses/${id}/`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       navigate('/dashboard');
//     } catch (err) {
//       setError('Failed to update course');
//     }
//   };

//   return (
//     <Card className="p-4 mt-3">
//       <h4>Edit Course</h4>
//       {error && <Alert variant="danger">{error}</Alert>}
//       <Form onSubmit={handleSubmit}>
//         <Form.Group className="mb-3">
//           <Form.Label>Title</Form.Label>
//           <Form.Control
//             type="text"
//             value={course.title}
//             onChange={(e) => setCourse({ ...course, title: e.target.value })}
//             required
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Description</Form.Label>
//           <Form.Control
//             as="textarea"
//             value={course.description}
//             onChange={(e) => setCourse({ ...course, description: e.target.value })}
//             required
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Price</Form.Label>
//           <Form.Control
//             type="number"
//             value={course.price}
//             onChange={(e) => setCourse({ ...course, price: e.target.value })}
//             required
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Course Image</Form.Label>
//           <Form.Control
//             type="file"
//             accept="image/*"
//             onChange={(e) => setCourse({ ...course, image: e.target.files[0] })}
//           />
//         </Form.Group>
//         {existingImage && (
//           <div className="mb-3">
//             <p>Current Image:</p>
//             <Image src={`http://localhost:8000${existingImage}`} fluid rounded />
//           </div>
//         )}
//         <Button type="submit" variant="primary">
//           Update Course
//         </Button>
//       </Form>
//     </Card>
//   );
// };

// export default EditCourse;



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Image, Row, Col } from 'react-bootstrap';
import api from '../utils/axiosInstance';

const EditCourse = ({ token }) => {
  const { id } = useParams();
  const [course, setCourse] = useState({ title: '', description: '', price: null, image: null });
  const [existingImage, setExistingImage] = useState('');
  const [concepts, setConcepts] = useState([]);
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
        console.log(response.data)
        setExistingImage(response.data.image);
        setConcepts(response.data.concepts || []);
      } catch (err) {
        setError('Failed to load course');
      }
    };
    fetchCourse();
  }, [id, token]);

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

    const payload = {
      title: course.title,
      description: course.description,
      price: course.price,
      concepts: concepts,
    };

    try {
      await api.put(`lms/courses/${id}/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If a new image is selected, upload separately
      if (course.image) {
        const formData = new FormData();
        formData.append('image', course.image);
        await api.patch(`lms/courses/${id}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
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
          <Form.Label>Update Course Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setCourse({ ...course, image: e.target.files[0] })}
          />
        </Form.Group>

        {existingImage && (
          <div className="mb-3">
            <p>Current Image:</p>
            <Image src={existingImage} fluid rounded style={{height:'100px'}}/>
          </div>
        )}

        <h5>Edit Concepts</h5>
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

        <Button type="submit" variant="outline-primary" className='mb-3 ms-1'>
          Update Course
        </Button>

        <Button className="mb-3 ms-1" variant="outline-info" style={{ width: '130px' }} onClick={() => navigate('/dashboard')}>
          Back
        </Button>
      </Form>
    </Card>
  );
};

export default EditCourse;
