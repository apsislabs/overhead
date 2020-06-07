import React from "react";

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
  return (
    <div style={rowStyles}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {avatarUrl ? (
          <img style={avatarStyles} src={avatarUrl} />
        ) : (
          <div style={unknownAvatarStlyes} />
        )}

        <span>{name}</span>
      </div>

      <span>{hours}</span>
    </div>
  );
};
