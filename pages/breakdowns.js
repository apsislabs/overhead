/* global TrelloPowerUp */

import _ from "lodash";
import React, { useEffect, useMemo } from "react";
import {
  calculateHoursByDueDate,
  calculateHoursByLabel
} from "../src/calculators/calculateDistributions";
import { EstimateRow } from "../src/components/EstimateRow";
import { Loader } from "../src/components/Loader";
import { useTrello } from "../src/contexts/TrelloContext";
import { useTrelloData } from "../src/hooks/useTrelloData";
import { withTrello } from "../src/withTrello";

const BreakdownsPage = () => {
  const { trello, resize } = useTrello();
  const { trelloData } = useTrelloData(trello);

  const { loading, labels, cards, estimates } = trelloData;
  const { noDeadline, ...dates } = calculateHoursByDueDate(cards, estimates);

  const vals = useMemo(() => calculateHoursByLabel(cards, labels, estimates), [
    JSON.stringify(cards),
    JSON.stringify(labels),
    JSON.stringify(estimates),
  ]);

  useEffect(resize, [JSON.stringify(dates), noDeadline]);

  return loading ? (
    <Loader />
  ) : (
    <div>
      <h4>Points by Due Date</h4>

      <EstimateRow avatar={false} name="No Deadline" hours={noDeadline} />

      {_.map(dates, (estimate, date) => {
        if (date === null) {
          return;
        }

        return (
          <EstimateRow
            avatar={false}
            name={date.toLocaleString()}
            hours={estimate}
          />
        );
      })}
    </div>
  );
};

export default withTrello(BreakdownsPage);
