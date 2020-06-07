import React from "react";

import styles from "../styles/CheckboxRow.module.scss";

export const CheckboxRow = ({ label, ...rest }) => (
  <label className={styles.label}>
    <input type="checkbox" className={styles.checkbox} {...rest} /> {label}
  </label>
);
