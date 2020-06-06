/* global TrelloPowerUp */

import React from "react";
import { withTrello } from "../src/withTrello";

const EstimatePage = ({ trello, t }) => {
  console.log(trello, t.getAll());

  return <div>Estimate!</div>;
};

export default withTrello(EstimatePage);
