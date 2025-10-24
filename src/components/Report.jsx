import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Report.css";

const Report = () => {
  return (
    <Container className="report-container" style={{ marginTop: "2rem" }}>
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Pomodoro Reports</h1>
          <p className="text-center text-muted">
            Overview of your productivity and session statistics.
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        {/* Summary cards */}
        <Col md={4} sm={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Total Sessions</Card.Title>
              <Card.Text className="display-4 text-primary">42</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Focus Time</Card.Title>
              <Card.Text className="display-4 text-success">21h 30m</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={12} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Break Time</Card.Title>
              <Card.Text className="display-4 text-warning">7h 15m</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Session Trends</Card.Title>
              <div
                style={{
                  height: "300px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                  fontStyle: "italic",
                }}
              >
                {/* Placeholder for chart */}
                Chart component coming soon...
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Report;
