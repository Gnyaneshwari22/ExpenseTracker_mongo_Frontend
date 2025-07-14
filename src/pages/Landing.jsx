import { useState } from "react";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import Login from "./Login";
import Register from "./Register";

const Landing = () => {
  const [key, setKey] = useState("login");

  return (
    <Container className="mt-5">
      {/* Features Section */}
      <Row className="mb-5 text-center">
        <h1>Welcome to Expense Tracker</h1>
        <p className="text-muted">Track, Save, Upgrade.</p>
        <Col md={4}>
          <h5>✅ Track Expenses</h5>
          <p>Effortlessly record and manage your daily expenses.</p>
        </Col>
        <Col md={4}>
          <h5>📊 Leaderboard</h5>
          <p>Compete with others on spending insights (Premium only).</p>
        </Col>
        <Col md={4}>
          <h5>📥 Download Reports</h5>
          <p>Export your expenses anytime in CSV format.</p>
        </Col>
      </Row>

      {/* Auth Tabs Section */}
      <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
        <Nav variant="tabs" justify>
          <Nav.Item>
            <Nav.Link eventKey="login">Login</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="register">Register</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className="mt-4">
          <Tab.Pane eventKey="login">
            <Login />
          </Tab.Pane>
          <Tab.Pane eventKey="register">
            <Register />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default Landing;
