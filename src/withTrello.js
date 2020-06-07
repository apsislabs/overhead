import React, { useMemo } from "react";

export const withTrello = (Component) => ({ trello, ...rest }) => {
  if (!trello) {
    return "Waiting for Trello...";
  }

  const t = useMemo(() => trello.iframe(), [trello]);
  return <Component trello={trello} t={t} {...rest} />;
};
