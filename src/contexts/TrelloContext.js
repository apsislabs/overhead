import React, { useCallback, useContext } from "react";
import { useTrelloSize } from "../hooks/useTrelloSize";

const TrelloContext = React.createContext({
  rootEl: null,
  resize: null,
  trello: null,
});

export const useTrello = () => useContext(TrelloContext);

export const TrelloProvider = ({ trello, children }) => {
  if (!trello) {
    return "Waiting for Trello...";
  }

  const t = useCallback(trello.iframe, [trello]);
  const trelloFrame = t();
  const [rootEl, resize] = useTrelloSize(trelloFrame);

  return (
    <div ref={rootEl}>
      <TrelloContext.Provider value={{ rootEl, resize, trello: trelloFrame }}>
        {children}
      </TrelloContext.Provider>
    </div>
  );
};
