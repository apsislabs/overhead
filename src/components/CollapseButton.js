import React, { useState } from "react";
import { Collapse } from "react-collapse";

export const CollapseButton = ({ label, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        style={{ width: "100%", marginBottom: open ? 8 : 0 }}
        onClick={() => setOpen(!open)}
      >
        {label}
      </button>

      <Collapse isOpened={open}>
        <div className="pop-over-section">{children}</div>
      </Collapse>
    </>
  );
};
