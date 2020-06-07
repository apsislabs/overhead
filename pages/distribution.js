import React, { useState, useEffect } from "react";
import _ from "lodash";
import { withTrello } from "../src/withTrello";
import { useImmerReducer } from "use-immer";

const INITIAL_STATE = {
  loading: false,
  members: [],
  lists: [],
  cards: [],
  estimates: []
};

const reducer = (draft, action) => {
  switch (action.type) {
    case "set":
      draft[action.key] = action.value;
      break;

    case "reset":
      return INITIAL_STATE;
  }
}

const calculateEstimates = (cards, estimates) => {
  return _.reduce(cards, (acc, card) => {
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
  }, {});
}

const DistributionPage = ({ t }) => {
  const [state, dispatch] = useImmerReducer(reducer, INITIAL_STATE);
  const {loading, members, lists, cards, estimates} = state;

  useEffect(() => {
    const fetch = async () => {
      console.log("Fetching...");

      try {
        setLoading(true);

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

        dispatch({ action: "set", key: "estimates", value: estimates });
        dispatch({ action: "set", key: "members", value: members });
        dispatch({ action: "set", key: "lists", value: lists });
        dispatch({ action: "set", key: "cards", value: cards });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [t]);

  const estimateTotals = calculateEstimates(cards, estimates);
  console.log(estimateTotals);
  return loading ? "Loading..." : <div>Distribution!</div>;
};

export default withTrello(DistributionPage);
