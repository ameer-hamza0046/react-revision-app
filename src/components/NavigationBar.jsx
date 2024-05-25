import { getAuth } from "firebase/auth";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import { app } from "../firebaseConfig";

function NavigationBar() {
  const navigate = useNavigate();
  const auth = getAuth(app);
  return (
    <Navbar expand="md" bg="dark" data-bs-theme="dark" className="mb-3">
      <Container>
        <Navbar.Brand href="#home">Revision App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto w-100" activeKey={`${location.pathname}`}>
            <Nav.Link onClick={() => navigate("/home")} eventKey="/home">
              Home
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/add-entry")}
              eventKey="/add-entry"
            >
              Add Entry
            </Nav.Link>
            <Nav.Link className="ms-auto" onClick={() => auth.signOut()}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
