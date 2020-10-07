import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Collapse } from "react-collapse";

export const CollapseButton = ({ label, children, onOpen, onClose }) => {
  const [open, setOpen] = useState(false);

  const handleToggleOpen = () => setOpen(!open);

  useEffect(() => {
    if (open) {
      if (_.isFunction(onOpen)) {
        onOpen();
      }
    } else {
      if (_.isFunction(onClose)) {
        onClose();
      }
    }
  }, [open]);

  return (
    <>
      <button
        style={{ width: "100%", marginBottom: open ? 8 : 0 }}
        onClick={handleToggleOpen}
      >
        {label}
      </button>

      <Collapse isOpened={open}>
        <div className="pop-over-section">{children}</div>
      </Collapse>
    </>
  );
};
