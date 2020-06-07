import React from "react";
import { Badge } from "./Badge";

const rowStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginBottom: 8,
};

const avatarStyles = {
  width: 20,
  borderRadius: 20,
  marginRight: 8,
};

const unknownAvatarStlyes = {
  width: 20,
  height: 20,
  borderRadius: 20,
  marginRight: 8,
  backgroundColor: "#ddd",
};

const getBadgeColor = (hours) => {
  if (hours > 10) {
    return ["green", 300];
  } else if (hours > 16) {
    return ["yellow", 300];
  } else if (hours > 19) {
    return ["red", 300];
  } else {
    return ["shades", 40];
  }
};

export const EstimateRow = ({ name, hours, avatarUrl, ...rest }) => {
  const badgeVariant = getBadgeColor(hours);
  const hoursLabel = hours ? `${hours} hours` : "Zilch";

  return (
    <div style={rowStyles} {...rest}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {avatarUrl ? (
          <img style={avatarStyles} src={avatarUrl} />
        ) : (
          <div style={unknownAvatarStlyes} />
        )}

        <span>{name}</span>
      </div>

      <Badge variant={badgeVariant[0]} weight={badgeVariant[1]}>
        {hoursLabel}
      </Badge>
    </div>
  );
};
