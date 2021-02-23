/* global TrelloPowerUp */

import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
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
import { postData, SHAMEBOT_URL } from "../src/utils/postData";
import { Button } from "../src/components/Button";

const sortDescByValue = (c) => _.fromPairs(_.sortBy(_.toPairs(c), 1).reverse());

const hashCode = function (s) {
  var h = 0,
    l = s.length,
    i = 0;
  if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
  return h;
};

const COLOR_NAMES = [
  "blue",
  "green",
  "orange",
  "red",
  "yellow",
  "purple",
  "pink",
  "sky",
  "lime",
];

const COLOR_WEIGHTS = [50, 100, 200, 300, 400, 500];

const SquareIcon = ({ color }) => {
  return (
    <span
      style={{
        marginRight: 8,
        color,
      }}
    >
      ◼
    </span>
  );
};

const LabelIcon = ({ label }) => {
  const colors = window.TrelloPowerUp.util.colors;
  const color = colors.getHexString(label.color);

  return <SquareIcon color={color} />;
};

const SprintIcon = ({ sprint }) => {
  const colors = window.TrelloPowerUp.util.colors;
  const hash = hashCode(sprint.toString());
  const colorIdx = hash % COLOR_NAMES.length;
  const weightIdx = hash % COLOR_WEIGHTS.length;

  const color = colors.getHexString(
    COLOR_NAMES[colorIdx],
    COLOR_WEIGHTS[weightIdx]
  );

  return <SquareIcon color={color} />;
};

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
      alert(err.message);
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

      <Button onClick={handlePost} loading={posting} loadingLabel="Slacking...">
        Slack it!
      </Button>

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
