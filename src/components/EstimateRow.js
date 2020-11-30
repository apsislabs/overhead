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

const DEFAULT_COLOR = ["shades", 40];

const getBadgeColor = (hours) => {
  if (hours >= 18 && hours <= 22) {
    return ["green", 500];
  } else if (hours < 18) {
    return ["yellow", 500];
  } else if (hours > 22) {
    return ["red", 500];
  } else {
    return DEFAULT_COLOR;
  }
};



export const EstimateRow = ({
  name,
  hours,
  avatarUrl,
  avatar = true,
  useColors = true,
  ...rest
}) => {
  const badgeVariant = useColors ? getBadgeColor(hours) : DEFAULT_COLOR;
  const hoursLabel = hours ? `${hours} hours` : "Zilch";

  return (
    <div style={rowStyles} {...rest}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {avatar && (
          <>
            {avatarUrl ? (
              <img style={avatarStyles} src={avatarUrl} />
            ) : (
              <div style={unknownAvatarStlyes} />
            )}
          </>
        )}

        <span>{name}</span>
      </div>

      <Badge variant={badgeVariant[0]} weight={badgeVariant[1]}>
        {hoursLabel}
      </Badge>
    </div>
  );
};
