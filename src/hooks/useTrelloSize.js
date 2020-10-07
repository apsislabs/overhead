import { useEffect, useRef } from "react";

export const useTrelloSize = (trello) => {
  const rootEl = useRef(null);
  const resize = () => {
    if (rootEl.current) {
      trello.sizeTo(rootEl.current);
    }
  };
  // Resize when recalculating the estimates
  useEffect(resize, [rootEl.current]);

  return [rootEl, resize];
};
