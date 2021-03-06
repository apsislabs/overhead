/* global TrelloPowerUp */

import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import {
  calculateHoursByDueDate,
  calculateHoursByLabel,
} from "../src/calculators/calculateDistributions";
import { Button } from "../src/components/Button";
import { EstimateRow } from "../src/components/EstimateRow";
import { EstimateTable } from "../src/components/EstimateTable";
import { ListToggler } from "../src/components/ListToggler";
import { Loader } from "../src/components/Loader";
import { Section } from "../src/components/Section";
import { useTrello } from "../src/contexts/TrelloContext";
import { useTrelloData } from "../src/hooks/useTrelloData";
import { postData, SHAMEBOT_URL } from "../src/utils/postData";
import { withTrello } from "../src/withTrello";
import { LabelIcon } from "../src/components/LabelIcon";
import { SprintIcon } from "../src/components/SprintIcon";

const sortDescByValue = (c) => _.fromPairs(_.sortBy(_.toPairs(c), 1).reverse());

const BreakdownsPage = () => {
  const [posting, setPosting] = useState(false);
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

  const formattedLabels = useMemo(() => {
    return _.map(sortedLabelTotals, (hours, labelId) => {
      const label = _.find(labels, (label) => label.id == labelId);
      return { label, labelId, hours };
    });
  }, [sortedLabelTotals, labels]);

  const handlePost = async () => {
    setPosting(true);

    try {
      await postData(SHAMEBOT_URL, {
        type: "breakdowns",
        data: { sprints: sortedDates, clients: formattedLabels },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

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
                avatar
                AvatarComponent={() => <SprintIcon sprint={date} />}
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

          {_.map(formattedLabels, (row) => {
            return row.hours ? (
              <EstimateRow
                avatar
                key={row.labelId}
                AvatarComponent={() => <LabelIcon label={row.label} />}
                name={row.label.name}
                hours={row.hours}
                useColors={false}
              />
            ) : null;
          })}
        </EstimateTable>
      </Section>

      <Button onClick={handlePost} loading={posting} loadingLabel="Slacking...">
        Slack it!
      </Button>

      <ListToggler
        lists={lists}
        excludedLists={excludedLists}
        onToggle={toggleListExclusion}
      />
    </>
  );
};

export default withTrello(BreakdownsPage);
