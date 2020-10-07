import React from "react";
import { TrelloProvider } from "./contexts/TrelloContext";

export const withTrello = (Component) => ({ trello, ...rest }) => {
  return (
    <TrelloProvider trello={trello}>
      <Component {...rest} />
    </TrelloProvider>
  );
};
