import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

const AddEntry = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
        toast.info("Login to continue...", toastOptions);
      }
    });
  }, []);
  const [data, setData] = useState({
    subject: "",
    topic: "",
    note: "",
    link: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <NavigationBar />
      <Container className="mt-3">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject name"
              value={data.subject}
              onChange={(e) => setData({ ...data, subject: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Topic</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter topic name"
              value={data.topic}
              onChange={(e) => setData({ ...data, topic: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Note</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Note related to this topic"
              value={data.note}
              onChange={(e) => setData({ ...data, note: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Link (if any)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Link to the lecture/slides"
              value={data.link}
              onChange={(e) => setData({ ...data, link: e.target.value })}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default AddEntry;
