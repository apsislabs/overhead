/* global TrelloPowerUp */

import React from "react";

const EstimatePage = ({ trello }) => {
  console.log(trello);
  if (!trello) {
    return null;
  }

  console.log(trello, trello.getAll());

  return <div>Estimate!</div>;
};

EstimatePage.getInitialProps = async (ctx) => {
  if (typeof window === "undefined") {
    return  { trello: null };
  }

  return { trello: TrelloPowerUp.iframe() };
}

export default EstimatePage;
