import React, { useEffect, useState } from "react";
import { Container, Tabs, Tab, Form, Button } from "react-bootstrap";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { app, db } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "./config";

const Landing = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/home");
        toast.success("Logged In", toastOptions);
      }
    });
  }, []);
  return (
    <Container className="my-center">
      <h1>Revision App</h1>
      <Container className="mt-2">
        <Tabs defaultActiveKey="signIn" className="mb-3" fill>
          <Tab eventKey="signIn" title="Sign In">
            <SignIn />
          </Tab>
          <Tab eventKey="signUp" title="Sign Up">
            <SignUp />
          </Tab>
        </Tabs>
      </Container>
    </Container>
  );
};

function SignIn() {
  const [data, setData] = useState({ email: "", password: "" });
  //
  const auth = getAuth(app);
  //
  const handleSignIn = (e) => {
    e.preventDefault();
    toast.info("Please wait...", toastOptions);
    signInWithEmailAndPassword(auth, data.email, data.password).catch((err) =>
      toast.error(err.message, toastOptions)
    );
  };
  return (
    <Form onSubmit={handleSignIn}>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Sign In
      </Button>
    </Form>
  );
}

function SignUp() {
  const [data, setData] = useState({
    name: "",
    email: "",
    setPassword: "",
    confirmPassword: "",
  });
  //
  const auth = getAuth(app);
  //
  const handleSignUp = (e) => {
    e.preventDefault();
    if (data.setPassword !== data.confirmPassword) {
      toast.error("Password not matching with Confirm-Password");
      return;
    }
    toast.info("Please wait...", toastOptions);
    createUserWithEmailAndPassword(auth, data.email, data.setPassword)
      .then((res) => {
        console.log(res);
        addDoc(collection(db, "users"), {
          name: data.name,
          email: data.email,
        }).catch((err) => toast.error(err.message, toastOptions));
        toast.success("Signed up successfully!", toastOptions);
      })
      .catch((err) => toast.error(err.message, toastOptions));
  };
  return (
    <Form onSubmit={handleSignUp}>
      <Form.Group className="mb-3">
        <Form.Label>Email name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Set Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Set Password"
          value={data.setPassword}
          onChange={(e) => setData({ ...data, setPassword: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          value={data.confirmPassword}
          onChange={(e) =>
            setData({ ...data, confirmPassword: e.target.value })
          }
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Sign Up
      </Button>
    </Form>
  );
}

export default Landing;
