/* global TrelloPowerUp */

import React from "react";
import { calculateHoursByDueDate } from "../src/calculators/calculateDistributions";
import { Loader } from "../src/components/Loader";
import { useTrello } from "../src/contexts/TrelloContext";
import { useTrelloData } from "../src/hooks/useTrelloData";
import { withTrello } from "../src/withTrello";

const BreakdownsPage = () => {
  const { trello, resize } = useTrello();
  const { trelloData, toggleListExclusion } = useTrelloData(trello);

  const {
    loading,
    members,
    lists,
    cards,
    estimates,
    excludedLists,
  } = trelloData;

  calculateHoursByDueDate(cards, estimates, excludedLists);

  return <Loader />;
};

export default withTrello(BreakdownsPage);
