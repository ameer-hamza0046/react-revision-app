import { getAuth } from "firebase/auth";
import React from "react";
import { app } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  auth.onAuthStateChanged((user) => {
    if (!user) {
      navigate("/");
    }
  });
  return (
    <div>
      Home
      <button
        onClick={() =>
          auth
            .signOut()
            .then((res) => navigate("/"))
            .catch((err) => alert(err.message))
        }
      >
        Sign Out
      </button>
    </div>
  );
};

export default Home;
