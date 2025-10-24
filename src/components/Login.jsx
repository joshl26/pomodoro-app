import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setError("");

    // TODO: Replace with real authentication logic
    if (email === "user@example.com" && password === "password123") {
      alert("Login successful!");
      // Redirect or update app state here
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <Container
      className="login-container"
      style={{ maxWidth: "400px", marginTop: "3rem" }}
    >
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Login</h1>
        </Col>
      </Row>

      {error && (
        <Row>
          <Col>
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="loginEmail" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email address.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="loginPassword" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Form.Control.Feedback type="invalid">
            Please enter your password (at least 6 characters).
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Log In
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
