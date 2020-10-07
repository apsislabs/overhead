/* global TrelloPowerUp */

import _ from "lodash";
import React, { useEffect } from "react";
import { calculateDistributions } from "../src/calculators/calculateDistributions";
import { EstimateRow } from "../src/components/EstimateRow";
import { ListToggler } from "../src/components/ListToggler";
import { Loader } from "../src/components/Loader";
import { useTrelloData } from "../src/hooks/useTrelloData";
import { useTrelloSizer } from "./_app";

const DistributionPage = () => {
  const { trello } = useTrello();
  const { resize } = useTrelloSizer();
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

  // This page resizes when estimate totals changes
  useEffect(resize, [JSON.stringify(estimateTotals), loading]);

  return loading ? (
    <Loader />
  ) : (
    <>
      {_.map(teamTotals, (e, memberId) => {
        const member = _.find(members, (m) => m.id === memberId);
        const name = _.get(member, "fullName", "Unassigned");
        const avatarUrl = _.get(member, "avatar", null);

        return (
          <EstimateRow
            key={memberId}
            name={name}
            avatarUrl={avatarUrl}
            hours={e}
          />
        );
      })}

      <hr />

      {typeof unassigned !== "undefined" && (
        <div>
          <strong>Unassigned:</strong> {unassigned} Hours
        </div>
      )}

      {typeof teamTotals !== "undefined" && (
        <div>
          <strong>Total:</strong> {_.sum(Object.values(teamTotals))} Hours
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

export default DistributionPage;
