import React from "react";

export const Button = ({
  children,
  loading = false,
  loadingLabel = "Loading...",
  disabled = false,
  style,
  ...props
}) => {
  return (
    <button
      style={{ width: "100%", ...style }}
      {...props}
      disabled={loading || disabled}
    >
      {loading ? loadingLabel : children}
    </button>
  );
};
