/* global TrelloPowerUp */

import React from "react";
import { calculateHoursByDueDate } from "../src/calculators/calculateDistributions";
import { Loader } from "../src/components/Loader";
import { useTrello } from "../src/contexts/TrelloContext";
import { useTrelloData } from "../src/hooks/useTrelloData";
import { withTrello } from "../src/withTrello";

const DistributionPage = () => {
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

  const estimateTotals = calculateHoursByDueDate(cards, estimates);

  // const { unassigned, ...teamTotals } = estimateTotals;

  // // This page resizes when estimate totals changes
  // useEffect(resize, [JSON.stringify(estimateTotals), loading]);

  return <Loader />;
};

export default withTrello(DistributionPage);
