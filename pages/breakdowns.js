/* global TrelloPowerUp */

import _ from "lodash";
import React, { useEffect, useMemo } from "react";
import {
  calculateHoursByDueDate,
  calculateHoursByLabel,
} from "../src/calculators/calculateDistributions";
import { EstimateRow } from "../src/components/EstimateRow";
import { ListToggler } from "../src/components/ListToggler";
import { Loader } from "../src/components/Loader";
import { useTrello } from "../src/contexts/TrelloContext";
import { useTrelloData } from "../src/hooks/useTrelloData";
import { withTrello } from "../src/withTrello";

const Section = ({ title, children, ...rest }) => (
  <div className="pop-over-section">
    {title && <h4>{title}</h4>}
    {children}
  </div>
);

const BreakdownsPage = () => {
  const { trello, resize } = useTrello();
  const { trelloData, toggleListExclusion } = useTrelloData(trello);

  const {
    loading,
    labels,
    lists,
    cards,
    estimates,
    excludedLists,
  } = trelloData;

  const { noDeadline, ...dates } = useMemo(
    () => calculateHoursByDueDate(cards, estimates, excludedLists),
    [JSON.stringify(cards), JSON.stringify(estimates)]
  );

  const { noLabel, ...labelTotals } = useMemo(
    () => calculateHoursByLabel(cards, labels, estimates, excludedLists),
    [JSON.stringify(cards), JSON.stringify(labels), JSON.stringify(estimates)]
  );

  useEffect(resize, [
    JSON.stringify(dates),
    noDeadline,
    JSON.stringify(labelTotals),
    noLabel,
  ]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Section ttile="Points by Due Date">
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
      </Section>

      <hr />

      <Section title="Points by Label">
        <EstimateRow avatar={false} name="No Label" hours={noLabel} />

        {_.map(labels, (l) => {
          const labelTotal = _.get(labelTotals, l.id);

          return labelTotal ? (
            <EstimateRow avatar={false} name={l.name} hours={labelTotal} />
          ) : null;
        })}
      </Section>

      <hr />

      <ListToggler
        lists={lists}
        excludedLists={excludedLists}
        onToggle={toggleListExclusion}
      />
    </>
  );
};

export default withTrello(BreakdownsPage);
