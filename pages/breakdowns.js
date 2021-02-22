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
import { EstimateTable } from "../src/components/EstimateTable";
import { Section } from "../src/components/Section";

const sortDescByValue = (c) => _.fromPairs(_.sortBy(_.toPairs(c), 1).reverse());

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
    [
      JSON.stringify(cards),
      JSON.stringify(estimates),
      JSON.stringify(excludedLists),
    ]
  );

  const { noLabel, ...labelTotals } = useMemo(
    () => calculateHoursByLabel(cards, labels, estimates, excludedLists),
    [
      JSON.stringify(cards),
      JSON.stringify(labels),
      JSON.stringify(estimates),
      JSON.stringify(excludedLists),
    ]
  );

  useEffect(resize, [
    JSON.stringify(dates),
    noDeadline,
    JSON.stringify(labelTotals),
    noLabel,
  ]);

  const sortedLabelTotals = sortDescByValue(labelTotals);
  const sortedDates = sortDescByValue(dates);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Section title="Points by Due Date">
        <EstimateTable>
          <EstimateRow
            avatar={false}
            name="No Deadline"
            hours={noDeadline}
            useColors={false}
          />

          {_.map(sortedDates, (estimate, date) => {
            if (date === null || estimate === 0) {
              return;
            }

            return (
              <EstimateRow
                avatar={false}
                name={date}
                hours={estimate}
                useColors={false}
              />
            );
          })}
        </EstimateTable>
      </Section>

      <hr />

      <Section title="Points by Label">
        <EstimateTable>
          <EstimateRow
            avatar={false}
            name="No Label"
            hours={noLabel}
            useColors={false}
          />

          {_.map(sortedLabelTotals, (hours, labelId) => {
            const label = _.find(labels, (label) => label.id == labelId);

            console.log("LABEL", label);

            return hours ? (
              <EstimateRow
                avatar={false}
                name={label.name}
                hours={hours}
                useColors={false}
              />
            ) : null;
          })}
        </EstimateTable>
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
