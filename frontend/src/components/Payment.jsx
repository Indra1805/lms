import React from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  // --- Safely handle missing data ---
  const selectedCourses = state?.courses || (state?.course ? [state.course] : []);
  const registrationData = state?.registrationData || {};
  
  // --- Calculate totals safely ---
  const total = selectedCourses.reduce((sum, course) => sum + Number(course.price || 0), 0);
  const gst = total * 0.18;
  const grandTotal = total + gst;

  const handlePayment = async () => {
    try {
      // Loop over all selected courses and enroll
      for (const course of selectedCourses) {
        await api.post('/lms/enrollments/', { course: course.id });
      }

      alert('Payment successful! You are enrolled in the selected course(s).');
      navigate('/dashboard'); // redirect after payment
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Enrollment failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <Card className="p-4">
        <h3 className="mb-4">Payment Summary</h3>

        {/* --- Selected Courses --- */}
        <h5>Selected Courses</h5>
        {selectedCourses.length > 0 ? (
          <ListGroup className="mb-3">
            {selectedCourses.map((course) => (
              <ListGroup.Item key={course.id} className="d-flex justify-content-between align-items-center">
                <span>{course.title}</span>
                <strong>₹{Number(course.price).toFixed(2)}</strong>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No courses selected.</p>
        )}

        {/* --- Totals --- */}
        <div className="d-flex justify-content-between">
          <span>Total:</span>
          <span>₹{Number(total).toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>GST (18%):</span>
          <span>₹{Number(gst).toFixed(2)}</span>
        </div>
        <hr />
        <div className="d-flex justify-content-between fw-bold">
          <span>Grand Total:</span>
          <span>₹{Number(grandTotal).toFixed(2)}</span>
        </div>

        {/* --- Registration Details --- */}
        {Object.keys(registrationData).length > 0 && (
          <>
            <hr />
            <h5>Registration Details</h5>
            <p><strong>Name:</strong> {registrationData.first_name} {registrationData.last_name}</p>
            <p><strong>Email:</strong> {registrationData.email}</p>
            <p><strong>Phone:</strong> {registrationData.phone}</p>
          </>
        )}

        {/* --- Make Payment Button --- */}
        <Button variant="success" className="mt-3 w-100" onClick={handlePayment}>
          Make Payment
        </Button>
      </Card>
    </div>
  );
};

export default Payment;


