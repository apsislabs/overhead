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

export const EstimateRow = ({ name, hours, avatarUrl, ...rest }) => {
  const badgeVariant = hours > 18 ? "R300" : "N50";
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

      <Badge variant={badgeVariant}>{hours}</Badge>
    </div>
  );
};
