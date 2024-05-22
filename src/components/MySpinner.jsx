import React from "react";
import { Container, Spinner } from "react-bootstrap";

const MySpinner = () => {
  return (
    <Container className="w-100 d-flex justify-content-center">
      <Spinner animation="grow" />
    </Container>
  );
};

export default MySpinner;
