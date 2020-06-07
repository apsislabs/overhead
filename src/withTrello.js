import React, { useCallback } from "react";

export const withTrello = (Component) => ({ trello, ...rest }) => {
  if (!trello) {
    return "Waiting for Trello...";
  }

  const t = useCallback(trello.iframe, [trello]);
  return <Component trello={trello} t={t()} {...rest} />;
};
