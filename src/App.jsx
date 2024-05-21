import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import Landing from "./Landing";
import Home from "./pages/Home";
import AddEntry from "./pages/AddEntry";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/add-entry" element={<AddEntry />} />
    </Routes>
  );
}

export default App;
