/* global TrelloPowerUp */

import React, { useEffect } from "react";
import _ from "lodash";
import { calculateHoursByDueDate } from "../src/calculators/calculateDistributions";
import { Loader } from "../src/components/Loader";
import { useTrello } from "../src/contexts/TrelloContext";
import { useTrelloData } from "../src/hooks/useTrelloData";
import { withTrello } from "../src/withTrello";
import { EstimateRow } from "../src/components/EstimateRow";

const BreakdownsPage = () => {
  const { trello, resize } = useTrello();
  const { trelloData } = useTrelloData(trello);

  const { loading, cards, estimates } = trelloData;
  const { noDeadline, ...dates } = calculateHoursByDueDate(cards, estimates);

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
