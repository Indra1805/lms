// CartPage.jsx
import React from 'react';
import { Card, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  // const total = cart.reduce((sum, course) => sum + (course.price || 0), 0);
  const total = cart.reduce((sum, course) => sum + Number(course.price || 0), 0);


  return (
    <div>
      <h3 className="mb-4">Your Cart</h3>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ListGroup className="mb-3">
            {cart.map(course => (
              <ListGroup.Item key={course.id} className="d-flex justify-content-between align-items-center">
                <div className='d-flex gap-2'>
                  <img src={course.image} alt={course.title} height={70}/>
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
          <Card className="p-3 mb-3">
            {/* <h5>Total: ₹{total}</h5> */}
            <h5>Total: ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h5>

            <div className="d-flex justify-content-end">
              <Button variant="success" onClick={() => alert('Proceeding to checkout...')}>Proceed to Checkout</Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default CartPage;
