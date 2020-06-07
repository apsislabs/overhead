import React from "react";

import styles from "../styles/components/Loader.module.scss";

export const Loader = ({ size = 20, backgroundColor = "#999" }) => {
  return (
    <div className={styles.spinner} style={{ width: size, height: size }}>
      <div className={styles.bounce1} style={{ backgroundColor }}></div>
      <div className={styles.bounce2} style={{ backgroundColor }}></div>
    </div>
  );
};
