import React, { useState, useEffect } from "react";
import _ from "lodash";
import { withTrello } from "../src/withTrello";
import { useImmerReducer } from "use-immer";

const INITIAL_STATE = {
  loading: false,
  members: [],
  lists: [],
  cards: [],
  estimates: [],
};

const reducer = (draft, action) => {
  switch (action.type) {
    case "set":
      draft[action.key] = action.value;
      break;

    case "reset":
      return INITIAL_STATE;
  }
};

const calculateEstimates = (cards, estimates) => {
  return _.reduce(
    cards,
    (acc, card) => {
      if (!_.has(estimates, card.id)) {
        return; // continue
      }

      const estimate = parseFloat(_.get(estimates, card.id));

      if (card.members.length < 1) {
        if (!_.has(acc, "none")) {
          _.set(acc, "none", 0);
        }

        acc["none"] += estimate;
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

const rowStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
};

const EstimateRow = ({ name, hours, avatarUrl, ...rest }) => {
  return (
    <div style={rowStyles}>
      {avatarUrl && <img src={avatarUrl} />}
      <span>{name}</span>
      <span>{hours}</span>
    </div>
  );
};

const DistributionPage = ({ t }) => {
  const [state, dispatch] = useImmerReducer(reducer, INITIAL_STATE);
  const { loading, members, lists, cards, estimates } = state;

  useEffect(() => {
    const fetch = async () => {
      try {
        dispatch({ type: "set", key: "loading", value: true });

        const [members, lists] = await Promise.all([
          t.board("members"),
          t.lists("all"),
        ]);

        const cards = _.flatten(_.map(lists, (l) => l.cards));

        const estimatePromises = _.map(cards, (c) =>
          t.get(c.id, "shared", "estimate", null)
        );

        const estimateValues = await Promise.all(estimatePromises);

        const estimates = _.reduce(
          cards,
          (e, c, i) => {
            e[c.id] = estimateValues[i];
            return e;
          },
          {}
        );

        dispatch({ type: "set", key: "estimates", value: estimates });
        dispatch({ type: "set", key: "members", value: members });
        dispatch({ type: "set", key: "lists", value: lists });
        dispatch({ type: "set", key: "cards", value: cards });
      } catch (err) {
        console.error(err);
      } finally {
        dispatch({ type: "set", key: "loading", value: false });
      }
    };

    fetch();
  }, [t]);

  const estimateTotals = calculateEstimates(cards, estimates);
  console.log(members);

  return loading ? (
    "Loading..."
  ) : (
    <div>
      {_.map(estimateTotals, (e, memberId) => {
        console.log(memberId, e);
        const member = _.find(members, (m) => m.id === memberId);
        const name = _.get(member, "fullName", "Unassigned");
        const avatarUrl = _.get(member, "avatar", null);
        const estimate = e ? `${e} hours` : "Zilch";

        return (
          <EstimateRow name={name} avatarUrl={avatarUrl} estimate={estimate} />
        );
      })}
    </div>
  );
};

export default withTrello(DistributionPage);
