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
  mono = false,
  ...props
}) => {
  const colors = window.TrelloPowerUp.util.colors;
  let color = null;
  let backgroundColor = null;

  if (invert) {
    color = colors.getHexString(variant, 400);
    backgroundColor = "white";
  } else {
    color = weight >= 300 ? "white" : "inherit";
    backgroundColor = colors.getHexString(variant, weight);
  }

  const fontFamily = mono
    ? "SF Mono,Segoe UI Mono,Roboto Mono,Ubuntu Mono,Menlo,Courier,monospace"
    : "inherit";

  return (
    <span
      style={{
        ...badgeStyles,
        backgroundColor,
        color,
        fontFamily,
        ...style,
      }}
      {...props}
    />
  );
};
