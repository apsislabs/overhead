/* global TrelloPowerUp */
import React from "react";

export const Badge = ({ variant = "gray", ...props }) => {
  const colors = window.TrelloPowerUp.util.colors;
  return (
    <span
      style={{ backgroundColor: colors.getHexString(variant) }}
      {...props}
    />
  );
};
