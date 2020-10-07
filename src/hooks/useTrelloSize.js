import { useEffect, useRef } from "react";

export const useTrelloSize = (trello) => {
  const rootEl = useRef(null);

  // Resize when recalculating the estimates
  useEffect(() => {
    if (rootEl.current) {
      trello.sizeTo(rootEl.current);
    }
  }, [rootEl.current]);

  return rootEl;
};
