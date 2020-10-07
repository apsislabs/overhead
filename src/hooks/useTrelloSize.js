import _ from "lodash";
import { useEffect, useRef } from "react";

export const useTrelloSize = (trello) => {
  const rootEl = useRef(null);
  const resize = () => {
    if (rootEl.current && _.isFunction(trello.sizeTo)) {
      trello.sizeTo(rootEl.current);
    }
  };
  // Resize when recalculating the estimates
  useEffect(resize, [trello, rootEl.current]);

  return [rootEl, resize];
};
