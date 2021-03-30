import React from "react";
import { SquareIcon } from "./SquareIcon";

export const LabelIcon = ({ label }) => {
  const colors = window.TrelloPowerUp.util.colors;
  const colorString = label.color ? label.color : 'shades';
  const color = colors.getHexString(label.color);

  return <SquareIcon color={color} />;
};
