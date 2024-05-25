import React from "react";
import { Card, Form } from "react-bootstrap";

const Item = ({ item }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{item.subject}</Card.Title>
        <Card.Subtitle className="text-muted">{item.topic}</Card.Subtitle>
        <Card.Subtitle className="text-muted">
          Date Created: {item.dateCreated}
        </Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">
          Iteration:{" "}
          {item.dateRevisions.findIndex(
            (e) => e === new Date().toLocaleDateString("en-CA")
          ) + 1}
        </Card.Subtitle>
        <Form.Control as="textarea" readOnly rows={3} value={item.note} />
      </Card.Body>
    </Card>
  );
};

export default Item;
