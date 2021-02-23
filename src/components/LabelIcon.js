import React from "react";
import { SquareIcon } from "../src/components/SquareIcon";

export const LabelIcon = ({ label }) => {
  const colors = window.TrelloPowerUp.util.colors;
  const color = colors.getHexString(label.color);

  return <SquareIcon color={color} />;
};
