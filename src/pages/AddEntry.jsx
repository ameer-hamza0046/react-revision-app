import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { app, db } from "../firebaseConfig";
import { toast } from "react-toastify";
import { toastOptions } from "../config";
import { addDoc, collection } from "firebase/firestore";

const AddEntry = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  useEffect(() => {
    // if user is not logged in then take him to the login page
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
        toast.info("Login to continue...", toastOptions);
      }
    });
  }, []);
  const initialData = {
    subject: "",
    topic: "",
    note: "",
    // "en-CA" gives dddd-mm-yy format which is used for <input type="date" />
    date: new Date().toLocaleDateString("en-CA"),
    // prefix sum of 1, 3, 7, 21, 30, 45, 60
    // is ---------> 1, 4, 11, 32, 62, 107, 167
    intervals: [
      { day: 1, check: true },
      { day: 4, check: true },
      { day: 11, check: true },
      { day: 32, check: true },
      { day: 62, check: true },
      { day: 107, check: true },
      { day: 167, check: true },
    ],
  };
  const [data, setData] = useState(initialData);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.subject) {
      toast.error("Subject name cannot be empty.", toastOptions);
      return;
    }
    if (!data.topic) {
      toast.error("Topic name cannot be empty.", toastOptions);
      return;
    }
    toast.info("Please wait...", toastOptions);
    data.intervals.forEach(({ day, check }, index) => {
      if (check) {
        addDoc(collection(db, "revisions"), {
          userEmail: auth.currentUser.email,
          subject: data.subject,
          topic: data.topic,
          note: data.note,
          date: new Date(
            new Date(data.date).getTime() + day * 24 * 60 * 60 * 1000
          ),
        })
          .then((res) => {
            toast.success(
              `Added revision-${index + 1} after ${day} day${
                day > 1 ? "s" : ""
              }.`,
              toastOptions
            );
            setData(initialData);
          })
          .catch((err) => toast.error(err.message, toastOptions));
      }
    });
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
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={data.date}
              onChange={(e) => setData({ ...data, date: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Note/Link</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Note related to this topic | Link to lecture/slides"
              value={data.note}
              onChange={(e) => setData({ ...data, note: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Revision this topic after (in days)</Form.Label>
            <Container>
              {data.intervals.map(({ day, check }, index) => (
                <Form.Check
                  inline
                  label={`${day} day${day > 1 ? "s" : ""}`}
                  checked={check}
                  key={index}
                  onChange={(e) => {
                    const arr = [...data.intervals];
                    arr[index].check = e.target.checked;
                    setData({ ...data, intervals: arr });
                  }}
                />
              ))}
            </Container>
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
