/* global TrelloPowerUp */

import _ from "lodash";
import React, { useEffect } from "react";
import { calculateDistributions } from "../src/calculators/calculateDistributions";
import { EstimateRow } from "../src/components/EstimateRow";
import { ListToggler } from "../src/components/ListToggler";
import { Loader } from "../src/components/Loader";
import { useTrelloData } from "../src/hooks/useTrelloData";
import { useTrelloSize } from "../src/hooks/useTrelloSize";
import { withTrello } from "../src/withTrello";

const DistributionPage = ({ t }) => {
  const [rootEl, resize] = useTrelloSize(t);

  const { trelloData, toggleListExclusion } = useTrelloData(t);

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
    <div ref={rootEl}>
      <Loader />
    </div>
  ) : (
    <div ref={rootEl}>
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
    </div>
  );
};

export default withTrello(DistributionPage);
