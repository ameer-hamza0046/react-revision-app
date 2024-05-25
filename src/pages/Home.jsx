import { getAuth } from "firebase/auth";
import { app, db } from "../firebaseConfig";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import { toast } from "react-toastify";
import { toastOptions } from "../config";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Item from "../components/Item";
import MySpinner from "../components/MySpinner";
import { Col, Container, Row } from "react-bootstrap";

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayDate = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    console.log("updated 25-05-2024 18:00");
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
            if (docSnapshot.docs.length === 0) {
              throw "No such user exists!";
            }
            // find the revisions
            const q = query(
              collection(db, "users", docSnapshot.docs[0].id, "revisions"),
              where("dateRevisions", "array-contains", todayDate)
            );
            onSnapshot(q, (querySnapshot) => {
              const arr = [];
              querySnapshot.forEach((doc) => {
                arr.push(doc.data());
              });
              setItems(arr);
              setLoading(false);
            });
          })
          .catch((err) => {
            toast.error(err.message, toastOptions);
          });
      }
    });
  }, []);
  return (
    <>
      <NavigationBar />
      {loading ? (
        <MySpinner />
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4 mx-1">
          {items.map((item, index) => (
            <Col key={index}>
              <Item item={item} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default Home;
