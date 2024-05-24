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
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Item from "../components/Item";
import MySpinner from "../components/MySpinner";

const Home = () => {
  console.log("updated 24-05-2024 20:50");

  const navigate = useNavigate();
  const auth = getAuth(app);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayDate = new Date(new Date().toLocaleDateString("en-CA"));

  useEffect(() => {
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
              where("dateRevision", "==", todayDate)
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
        items.map((item, index) => <Item item={item} key={index} />)
      )}
    </>
  );
};

export default Home;
