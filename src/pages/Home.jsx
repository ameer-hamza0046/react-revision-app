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
  const navigate = useNavigate();
  const auth = getAuth(app);
  const todayDate = new Date(new Date().toLocaleDateString("en-CA"));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(items);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
        toast.info("Login to continue...", toastOptions);
      } else {
        const q = query(
          collection(db, "revisions"),
          where("userEmail", "==", user.email),
          where("dateRevision", "==", todayDate)
        );
        onSnapshot(q, (querySnapshot) => {
          const arr = [];
          querySnapshot.forEach((doc) => {
            arr.push(doc.data());
          });
          setItems(arr);
        });
        setLoading(false);
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
