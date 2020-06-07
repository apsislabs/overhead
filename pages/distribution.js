import React, { useState, useEffect, useRef } from "react";
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
  marginBottom: 8,
};

const avatarStyles = {
  width: 20,
  borderRadius: 20,
  marginRight: 8,
};

const unknownAvatarStlyes = {
  width: 20,
  height: 20,
  borderRadius: 20,
  marginRight: 8,
  backgroundColor: "#ddd",
};

const EstimateRow = ({ name, hours, avatarUrl, ...rest }) => {
  return (
    <div style={rowStyles}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {avatarUrl ? (
          <img style={avatarStyles} src={avatarUrl} />
        ) : (
          <div style={unknownAvatarStlyes} />
        )}

        <span>{name}</span>
      </div>

      <span>{hours}</span>
    </div>
  );
};

const DistributionPage = ({ t }) => {
  const rootEl = useRef(null);
  const [state, dispatch] = useImmerReducer(reducer, INITIAL_STATE);
  const { loading, members, lists, cards, estimates } = state;

  useEffect(() => {
    const fetch = async () => {
      try {
        dispatch({ type: "set", key: "loading", value: true });

        const [memberData, lists] = await Promise.all([
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
        dispatch({ type: "set", key: "members", value: memberData.members });
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

  useEffect(() => {
    if (rootEl.current) {
      t.sizeTo(rootEl.current);
    }
  }, [rootEl.current]);

  return loading ? (
    "Loading..."
  ) : (
    <div ref={rootEl}>
      {_.map(estimateTotals, (e, memberId) => {
        const member = _.find(members, (m) => m.id === memberId);
        const name = _.get(member, "fullName", "Unassigned");
        const avatarUrl = _.get(member, "avatar", null);
        const hours = e ? `${e} hours` : "Zilch";

        return <EstimateRow name={name} avatarUrl={avatarUrl} hours={hours} />;
      })}
    </div>
  );
};

export default withTrello(DistributionPage);
