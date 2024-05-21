import { getAuth } from "firebase/auth";
import React, { useEffect } from "react";
import { app } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import { Button } from "react-bootstrap";
import { toastOptions } from "../config";
import { toast } from "react-toastify";

const Home = () => {
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
  return (
    <>
      <NavigationBar />
    </>
  );
};

export default Home;
