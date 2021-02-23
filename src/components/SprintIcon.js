import React from "react";
import { SquareIcon } from "./SquareIcon";

const hashCode = function (s) {
  var h = 0,
    l = s.length,
    i = 0;
  if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
  return h;
};

const COLOR_NAMES = [
  "blue",
  "green",
  "orange",
  "red",
  "yellow",
  "purple",
  "pink",
  "sky",
  "lime",
];

const COLOR_WEIGHTS = [50, 100, 200, 300, 400, 500];

export const SprintIcon = ({ sprint }) => {
  const colors = window.TrelloPowerUp.util.colors;
  const hash = hashCode(sprint.toString());
  const colorIdx = hash % COLOR_NAMES.length;
  const weightIdx = hash % COLOR_WEIGHTS.length;

  const color = colors.getHexString(
    COLOR_NAMES[colorIdx],
    COLOR_WEIGHTS[weightIdx]
  );

  return <SquareIcon color={color} />;
};
