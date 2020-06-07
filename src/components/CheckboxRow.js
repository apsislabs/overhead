import React from "react";
import { checkboxStyles, labelStyle } from "../../pages/distribution";

const checkboxStyles = {
  margin: 0,
  marginRight: 4,
};

const labelStyle = {
  margin: 0,
  marginBottom: 8,
};

export const CheckboxRow = ({ label, ...rest }) => (
  <label style={labelStyle}>
    <input type="checkbox" style={checkboxStyles} {...rest} /> {label}
  </label>
);
