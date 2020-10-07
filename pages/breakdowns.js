/* global TrelloPowerUp */

import React, { useEffect } from "react";
import _ from "lodash";
import { calculateHoursByDueDate } from "../src/calculators/calculateDistributions";
import { Loader } from "../src/components/Loader";
import { useTrello } from "../src/contexts/TrelloContext";
import { useTrelloData } from "../src/hooks/useTrelloData";
import { withTrello } from "../src/withTrello";

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
      <div>No Deadline: {noDeadline}</div>

      {_.map(dates, (estimate, date) => {
        if (date === null) {
          return;
        }

        return (
          <div>
            {date}: {estimate}
          </div>
        );
      })}
    </div>
  );
};

export default withTrello(BreakdownsPage);
