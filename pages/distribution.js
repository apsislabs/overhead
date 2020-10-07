/* global TrelloPowerUp */

import _ from "lodash";
import React, { useState } from "react";
import { Collapse } from "react-collapse";
import { CheckboxRow } from "../src/components/CheckboxRow";
import { EstimateRow } from "../src/components/EstimateRow";
import { Loader } from "../src/components/Loader";
import { useTrelloData } from "../src/hooks/useTrelloData";
import { useTrelloSize } from "../src/hooks/useTrelloSize";
import { withTrello } from "../src/withTrello";

const calculateDistributions = (cards, estimates, excludedLists = []) => {
  return _.reduce(
    cards,
    (acc, card) => {
      if (
        excludedLists.indexOf(card.idList) > -1 ||
        !_.has(estimates, card.id)
      ) {
        return acc;
      }

      const estimate = parseFloat(_.get(estimates, card.id));
      if (_.isNaN(estimate)) {
        return acc;
      }

      if (card.members.length < 1) {
        if (!_.has(acc, "unassigned")) {
          _.set(acc, "unassigned", 0);
        }

        acc["unassigned"] += estimate;
      }

      _.forEach(card.members, (member) => {
        if (!_.has(acc, member.id)) {
          _.set(acc, member.id, 0);
        }

        acc[member.id] += estimate;
      });

      return acc;
    },
    {}
  );
};

const DistributionPage = ({ t }) => {
  const [rootEl, resize] = useTrelloSize(t);
  const [open, setOpen] = useState(false);
  const [trelloData, dispatch] = useTrelloData(t);

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

  const handleToggle = (id) => {
    if (excludedLists.indexOf(id) > -1) {
      dispatch({ type: "excludeList", id });
    } else {
      dispatch({ type: "includeList", id });
    }
  };

  return loading ? (
    <Loader />
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

      <button
        style={{ width: "100%", marginBottom: 8 }}
        onClick={() => setOpen(!open)}
      >
        Edit Lists
      </button>

      <Collapse isOpened={open}>
        <div className="pop-over-section">
          <h4>Excluded Lists</h4>
          <fieldset style={{ marginBottom: 0 }}>
            {_.map(lists, (l) => {
              return (
                <CheckboxRow
                  key={l.id}
                  checked={excludedLists.indexOf(l.id) > -1}
                  onChange={() => handleToggle(l.id)}
                  label={l.name}
                />
              );
            })}
          </fieldset>
        </div>
      </Collapse>
    </div>
  );
};

export default withTrello(DistributionPage);
