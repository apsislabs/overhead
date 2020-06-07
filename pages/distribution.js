/* global TrelloPowerUp */

import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { withTrello } from "../src/withTrello";
import { useImmerReducer } from "use-immer";
import { EstimateRow } from "../src/components/EstimateRow";
import { Collapse } from "react-collapse";

const INITIAL_STATE = {
  loading: false,
  members: [],
  lists: [],
  cards: [],
  estimates: [],
  excludedLists: [],
};

const reducer = (draft, action) => {
  switch (action.type) {
    case "set":
      draft[action.key] = action.value;
      break;

    case "excludeList":
      draft.excludedLists = draft.excludedLists.filter((l) => l !== action.id);
      break;

    case "includeList":
      draft.excludedLists = [action.id, ...draft.excludedLists];
      break;

    case "reset":
      return INITIAL_STATE;
  }
};

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

const DistributionPage = ({ t }) => {
  const rootEl = useRef(null);
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useImmerReducer(reducer, INITIAL_STATE);
  const { loading, members, lists, cards, estimates, excludedLists } = state;

  useEffect(() => {
    const fetch = async () => {
      try {
        dispatch({ type: "set", key: "loading", value: true });

        const [memberData, lists, excludedLists] = await Promise.all([
          t.board("members"),
          t.lists("all"),
          t.get("member", "private", "excludedLists", []),
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
        dispatch({ type: "set", key: "excludedLists", value: excludedLists });
      } catch (err) {
        console.error(err);
      } finally {
        dispatch({ type: "set", key: "loading", value: false });
      }
    };

    fetch();
  }, [t]);

  const estimateTotals = calculateDistributions(
    cards,
    estimates,
    excludedLists
  );

  // Resize when recalculating the estimates
  useEffect(() => {
    if (rootEl.current) {
      t.sizeTo(rootEl.current);
    }
  }, [rootEl.current, estimateTotals]);

  // Store any change to excluded lists
  useEffect(() => {
    t.set("member", "private", "excludedLists", excludedLists);
  }, [excludedLists]);

  const handleToggle = (id) => {
    if (excludedLists.indexOf(id) > -1) {
      dispatch({ type: "excludeList", id });
    } else {
      dispatch({ type: "includeList", id });
    }
  };

  return loading ? (
    "Loading..."
  ) : (
    <div ref={rootEl}>
      {_.map(estimateTotals, (e, memberId) => {
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

      <button style={{ width: "100%" }} onClick={() => setOpen(!open)}>
        Edit Lists
      </button>

      <Collapse isOpened={open}>
        <fieldset>
          {_.map(lists, (l) => {
            return (
              <label key={l.id}>
                <input
                  checked={excludedLists.indexOf(l.id) > -1}
                  type="checkbox"
                  onChange={() => handleToggle(l.id)}
                />{" "}
                {l.name}
              </label>
            );
          })}
        </fieldset>
      </Collapse>
    </div>
  );
};

export default withTrello(DistributionPage);
