import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import MySpinner from "../components/MySpinner";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { app, db } from "../firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { toastOptions } from "../config";

const AddEntry = () => {
  // 1. check if the user is logged in or logged out?
  // if authentication fails then navigate him to the login page
  const navigate = useNavigate();
  const auth = getAuth(app);

  // load the current user's Document to get the nextRevisionId
  const [userSnapshot, setUserSnapshot] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // authentication check
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
        toast.info("Login to continue...", toastOptions);
      } else {
        // if user is logged in then fetch user data
        const q = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );
        // used getDocs instead of getDoc to be able to use "where email == user.email"
        getDocs(q)
          .then((docSnapshot) => {
            // there is only 1 result in the query
            setUserSnapshot(docSnapshot.docs[0]);
            setLoading(false);
          })
          .catch((err) => {
            toast.error("No such user exists!", toastOptions);
          });
      }
    });
  }, []);

  // 2. define the initial data of the form fields
  // this data will be used to reset the form
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

  // the state of the form fields
  const [data, setData] = useState(initialData);

  // handle the submit of the form
  const handleSubmit = (e) => {
    e.preventDefault();
    // subject, topic and note cannot be empty
    // date and interval are already there by default
    if (!data.subject) {
      toast.error("Subject name cannot be empty.", toastOptions);
      return;
    }
    if (!data.topic) {
      toast.error("Topic name cannot be empty.", toastOptions);
      return;
    }
    if (!data.note) {
      toast.error("Note/Link field cannot be empty.", toastOptions);
      return;
    }
    if (!data.intervals.some(({ check }) => check)) {
      toast.error("At least one revision day must be selected.", toastOptions);
      return;
    }
    setLoading(true);
    toast.info("Please wait...", toastOptions);
    // first update the nextRevisionId for this user
    // for each revision interval
    // add a document in the collection if checkbox is true
    updateDoc(userSnapshot.ref, { nextRevisionId: increment(1) })
      .then(() => {
        data.intervals.forEach(({ day, check }, index) => {
          if (check) {
            addDoc(collection(db, "revisions"), {
              // userDetails: email
              userEmail: auth.currentUser.email,
              // revisionDetails: subject, topic, dateCreated, note,
              // dateRevision, revisionIteration, revisionId
              subject: data.subject,
              topic: data.topic,
              dateCreated: new Date(data.date),
              note: data.note,
              dateRevision: new Date(
                new Date(data.date).getTime() + day * 24 * 60 * 60 * 1000
              ),
              revisionIteration: index + 1,
              revisionId: userSnapshot.data().nextRevisionId,
            })
              .then(() => {
                toast.success(
                  `Added revision-${index + 1} after ${day} day${
                    day > 1 ? "s" : ""
                  }.`,
                  toastOptions
                );
                setData(initialData);
                setLoading(false);
              })
              .catch((err) => toast.error(err.message, toastOptions));
          }
        });
      })
      .catch((err) => toast.error(err.message, toastOptions));
  };
  return (
    <>
      <NavigationBar />
      <Container className="mt-3">
        {loading ? (
          <MySpinner />
        ) : (
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
              <Form.Label>Revise this topic after</Form.Label>
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
        )}
      </Container>
    </>
  );
};

export default AddEntry;
