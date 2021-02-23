/* global TrelloPowerUp */

import _ from "lodash";
import React, { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
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

  const handlePost = async () => {
    setLoading(true);
    try {
      await postData(SHAMEBOT_URL, { type: "estimates", data: teamTotals });
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <EstimateTable>
        {_.map(teamTotals, (e, memberId) => {
          const member = _.find(members, (m) => m.id === memberId);
          const name = _.get(member, "fullName", "Unassigned");
          const avatarUrl = _.get(member, "avatar", null);

          return (
            <EstimateRow
              key={memberId}
              name={name}
              avatarUrl={avatarUrl}
              labels={e.labels}
              showLabels={true}
              hours={e.hours}
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

      <Button onClick={handlePost} loading={loading} loadingLabel="Slacking...">
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
