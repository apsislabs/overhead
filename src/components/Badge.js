/* global TrelloPowerUp */
import React from "react";

export const Badge = ({ variant = "gray", ...props }) => {
  const colors = window.TrelloPowerUp.util.colors;
  console.log(colors);
  return (
    <span
      style={{
        display: "inline-block",
        padding: 2,
        borderRadius: 2,
        backgroundColor: colors.getHexString(variant),
      }}
      {...props}
    />
  );
};
