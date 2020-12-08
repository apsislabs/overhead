/* global TrelloPowerUp */

import _ from "lodash";
import React, { useEffect } from "react";
import {
  calculateDistributions,
  countUnestimatedCards,
} from "../src/calculators/calculateDistributions";
import { EstimateRow } from "../src/components/EstimateRow";
import { ListToggler } from "../src/components/ListToggler";
import { Loader } from "../src/components/Loader";
import { useTrello } from "../src/contexts/TrelloContext";
import { useTrelloData } from "../src/hooks/useTrelloData";
import { withTrello } from "../src/withTrello";

const DistributionPage = () => {
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

  return loading ? (
    <Loader />
  ) : (
    <>
      <table>
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
              hours={e.hours}
            />
          );
        })}
      </table>

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
          <strong>Total:</strong> {_.chain(teamTotals).map(x => x.hours).sum().value()} Hours
        </div>
      )}

      <ListToggler
        lists={lists}
        excludedLists={excludedLists}
        onToggle={toggleListExclusion}
      />
    </>
  );
};

export default withTrello(DistributionPage);
