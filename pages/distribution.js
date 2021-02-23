/* global TrelloPowerUp */

import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import {
  calculateDistributions,
  countUnestimatedCards,
} from "../src/calculators/calculateDistributions";
import { Button } from "../src/components/Button";
import { EstimateRow } from "../src/components/EstimateRow";
import { EstimateTable } from "../src/components/EstimateTable";
import { ListToggler } from "../src/components/ListToggler";
import { Loader } from "../src/components/Loader";
import { useTrello } from "../src/contexts/TrelloContext";
import { useTrelloData } from "../src/hooks/useTrelloData";
import { postData, SHAMEBOT_URL } from "../src/utils/postData";
import { withTrello } from "../src/withTrello";

const DistributionPage = () => {
  const [posting, setPosting] = useState(false);
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

  const estimateTotals = calculateDistributions(
    cards,
    estimates,
    excludedLists
  );

  const { unassigned, ...teamTotals } = estimateTotals;
  const unestimated = countUnestimatedCards(cards, estimates, excludedLists);

  // This page resizes when estimate totals changes
  useEffect(resize, [JSON.stringify(estimateTotals), loading]);

  const memberTotals = useMemo(() => {
    return _.map(estimateTotals, (e, memberId) => {
      const member = _.find(members, (m) => m.id === memberId);
      const name = _.get(member, "fullName", "Unassigned");
      const avatarUrl = _.get(member, "avatar", null);
      const labels = e.labels;
      const hours = e.hours;

      return { memberId, name, avatarUrl, labels, hours };
    });
  }, [estimateTotals]);

  const handlePost = async () => {
    setPosting(true);
    try {
      await postData(SHAMEBOT_URL, {
        type: "estimates",
        data: { memberTotals, unestimated },
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
      <EstimateTable>
        {_.map(memberTotals, (row) => {
          return (
            <EstimateRow
              key={row.memberId}
              name={row.name}
              avatarUrl={row.avatarUrl}
              labels={row.labels}
              hours={row.hours}
              showLabels={true}
            />
          );
        })}
      </EstimateTable>

      <hr />

      {typeof unassigned !== "undefined" && (
        <div>
          <strong>Unassigned:</strong> {unassigned.hours} Hours
        </div>
      )}

      {typeof unestimated !== "undefined" && (
        <div>
          <strong>Unestimated:</strong> {unestimated} Cards
        </div>
      )}

      {typeof teamTotals !== "undefined" && (
        <div>
          <strong>Total:</strong>{" "}
          {_.chain(teamTotals)
            .map((x) => x.hours)
            .sum()
            .value()}{" "}
          Hours
        </div>
      )}

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

export default withTrello(DistributionPage);
