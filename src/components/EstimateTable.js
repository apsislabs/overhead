import React from "react";

export const EstimateTable = ({ children }) => {
  return (
    <table style={{ width: "100%", borderWidth: 0 }}>
      <tbody>{children}</tbody>
    </table>
  );
};
