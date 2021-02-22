import React from "react";

export const Section = ({ title, children, ...rest }) => (
  <div className="pop-over-section">
    {title && <h4>{title}</h4>}
    {children}
  </div>
);
