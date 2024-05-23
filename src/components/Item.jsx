import React from "react";

const Item = ({ item }) => {
  console.log(item.dateCreated);
  return (
    <div className="m-3 p-2 border border-dark">
      <div>Iteration: {item.revisionIteration}</div>
      <div>Subject: {item.subject}</div>
      <div>Topic: {item.topic}</div>
      <div>Note/Link: {item.note}</div>
      <div>
        Date Created: {item.dateCreated.toDate().toLocaleDateString("en-IN")}
      </div>
    </div>
  );
};

export default Item;
