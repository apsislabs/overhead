/* global TrelloPowerUp */
import React from "react";

const badgeStyles = {
  display: "inline-block",
  padding: "1px 3px",
  borderRadius: 2,
};

export const Badge = ({ variant = "shades", weight = 40, ...props }) => {
  const colors = window.TrelloPowerUp.util.colors;
  const backgroundColor = colors.getHexString(variant, weight);
  const color = weight > 300 ? "white" : "inherit";

  return (
    <span
      style={{
        ...badgeStyles,
        backgroundColor,
        color,
      }}
      {...props}
    />
  );
};
