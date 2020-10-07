/* global TrelloPowerUp */

import React from "react";
import _ from "lodash";
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

  const { noDeadline, ...dates } = calculateHoursByDueDate(
    cards,
    estimates,
    excludedLists
  );

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
