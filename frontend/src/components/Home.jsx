import React, { useEffect } from 'react';
import { Carousel, Container, Row, Col, Card } from 'react-bootstrap';
import AOS from 'aos';
import vk2 from '../assets/vk2.jpg'
import vk3 from '../assets/vk3.jpg'
import vk4 from '../assets/vk4.jpg'
import vk5 from '../assets/vk5.jpg'
import vk6 from '../assets/vk6.jpg'
import vk7 from '../assets/vk7.jpg'
import 'aos/dist/aos.css';

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      {/* Carousel Section */}
      <Carousel fade className="mb-5">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={vk2}
            alt="First slide"
            // height={500}
            style={{ height: '80vh', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h3>Learn from Industry Experts</h3>
            <p>High-quality content from real-world professionals</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={vk3}
            alt="Second slide"
            height={500}
          />
          <Carousel.Caption>
            <h3>Flexible Learning</h3>
            <p>Study at your own pace, anytime, anywhere</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={vk4}
            alt="Third slide"
            height={500}
          />
          <Carousel.Caption>
            <h3>Join a Growing Community</h3>
            <p>Thousands of students trust our platform</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* About Section */}
      <Container className="mb-5">
        <div data-aos="fade-up">
          <h2 className="text-center mb-4">About E-Learn</h2>
          <p className="text-center lead px-2 px-md-5">
            E-Learn is your one-stop platform for professional and academic learning. Whether you're aiming to upskill, reskill, or teach, our courses and tools empower every learner and educator to succeed.
          </p>
        </div>
      </Container>

      {/* Achievements Section */}
      <Container className="mb-5">
        <h2 className="text-center mb-4" data-aos="fade-up">Our Achievements</h2>
        <Row className="g-4">
          <Col md={4} data-aos="fade-up" data-aos-delay="100">
            <Card className="h-100 shadow border-0">
              <Card.Img variant="top" src={vk5} height={250} />
              <Card.Body>
                <Card.Title>10,000+ Students</Card.Title>
                <Card.Text>
                  We've empowered thousands of learners to achieve their goals through quality education.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} data-aos="fade-up" data-aos-delay="200">
            <Card className="h-100 shadow border-0">
              <Card.Img variant="top" src={vk6} height={250} />
              <Card.Body>
                <Card.Title>100+ Courses</Card.Title>
                <Card.Text>
                  Learn everything from AI to marketing, all designed by industry professionals.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} data-aos="fade-up" data-aos-delay="300">
            <Card className="h-100 shadow border-0">
              <Card.Img variant="top" src={vk7} height={250} />
              <Card.Body>
                <Card.Title>Global Reach</Card.Title>
                <Card.Text>
                  Our learners span over 30+ countries, building a truly global community.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
