/* global TrelloPowerUp */
import React from "react";
import _ from "lodash";

const badgeStyles = {
  display: "inline-block",
  padding: "1px 4px",
  borderRadius: 2,
};

export const Badge = ({
  invert = false,
  variant = "neutrals",
  weight = 40,
  style,
  ...props
}) => {
  const colors = window.TrelloPowerUp.util.colors;
  let color = null;
  let backgroundColor = null;

  if (invert) {
    color = colors.getHexString(variant, weight);
    backgroundColor = colors.getHexString("neutrals", 40);
  } else {
    color = weight >= 300 ? "white" : "inherit";
    backgroundColor = colors.getHexString(variant, weight);
  }

  return (
    <span
      style={{
        ...badgeStyles,
        backgroundColor,
        color,
        ...style,
      }}
      {...props}
    />
  );
};
