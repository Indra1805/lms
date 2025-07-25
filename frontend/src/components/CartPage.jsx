import React, { useState } from 'react';
import { Card, Button, Row, Col, ListGroup, Modal } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, course) => sum + Number(course.price || 0), 0);
  const gst = (total * 18) / 100;
  const grand_total = total + gst;

  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: ''
  });

  const handleProceedCheckout = () => {
    setShowRegistration(true);
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    setShowRegistration(false);
    navigate('/payment', {
      state: {
        ...registrationData,
        courses: cart,
        total,
        gst,
        grand_total
      }
    });
  };

  return (
    <div>
      <h3 className="mb-4">Your Cart</h3>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <Row lg={2}>
          <Col className='w-50'>
            <ListGroup className="mb-3">
              {cart.map(course => (
                <ListGroup.Item key={course.id} className="d-flex justify-content-between align-items-center">
                  <div className='d-flex gap-2'>
                    <img src={course.image} alt={course.title} height={70} width={130}/>
                    <div>
                      <h6>{course.title}</h6>
                      ₹{course.price || 0}
                    </div>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => removeFromCart(course.id)}>
                    Remove
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col className='w-50'>
            <Card className="p-3 mb-3">
              <Row>
                <Col>
                  <p>Total</p>
                  <p>(+) GST</p> <hr />
                  <h5>Grand Total</h5>
                </Col>
                <Col>
                  <p>: ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  <p>: ₹{gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p> <hr />
                  <h5>: ₹{grand_total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h5>
                </Col>
              </Row>
              <div className="d-flex justify-content-start mt-1">
                <Button variant="success" onClick={handleProceedCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      )}

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

export default CartPage;
