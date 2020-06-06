import React from "react";

const EstimatePage = ({ trello }) => {
  if (!trello) {
    return null;
  }

  const t = trello.iframe();
  console.log(t.getAll());

  return <div>Estimate!</div>;
};

export default EstimatePage;
