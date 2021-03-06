import _ from "lodash";
import { useEffect } from "react";
import { useImmerReducer } from "use-immer";

const INITIAL_STATE = {
  loading: false,
  members: [],
  lists: [],
  labels: [],
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

export const useTrelloData = (trello) => {
  const [trelloData, dispatch] = useImmerReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    const fetch = async () => {
      try {
        dispatch({ type: "set", key: "loading", value: true });

        const [memberData, labelData, lists, excludedLists] = await Promise.all([
          trello.board("members"),
          trello.board("labels"),
          trello.lists("all"),
          trello.get("member", "private", "excludedLists", []),
        ]);

        const cards = _.flatten(_.map(lists, (l) => l.cards));

        const estimatePromises = _.map(cards, (c) =>
          trello.get(c.id, "shared", "estimate", null)
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
        dispatch({ type: "set", key: "labels", value: labelData.labels });
        dispatch({ type: "set", key: "cards", value: cards });
        dispatch({ type: "set", key: "excludedLists", value: excludedLists });
      } catch (err) {
        console.error(err);
      } finally {
        dispatch({ type: "set", key: "loading", value: false });
      }
    };

    fetch();
  }, [trello]);

  // Store any change to excluded lists
  useEffect(() => {
    trello.set("member", "private", "excludedLists", trelloData.excludedLists);
  }, [trello, JSON.stringify(trelloData.excludedLists)]);

  const toggleListExclusion = (id) => {
    if (trelloData.excludedLists.indexOf(id) > -1) {
      dispatch({ type: "excludeList", id });
    } else {
      dispatch({ type: "includeList", id });
    }
  };

  return { trelloData, dispatch, toggleListExclusion };
};
