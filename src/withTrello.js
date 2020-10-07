import React from "react";

export const withTrello = (Component) => ({ trello, ...rest }) => {
  return (
    <TrelloSizer trello={trello}>
      <Component {...rest} />
    </TrelloSizer>
  );
};
