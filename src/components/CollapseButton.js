import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import { useTrelloSizer } from "../../pages/_app";

export const CollapseButton = ({ label, children, onOpen, onClose }) => {
  const { resize } = useTrelloSizer();
  const [open, setOpen] = useState(false);

  const handleToggleOpen = () => {
    if (open) {
      setOpen(false);
      if (_.isFunction(onClose)) {
        onClose();
      }
    } else {
      setOpen(true);
      if (_.isFunction(onOpen)) {
        onOpen();
      }
    }
  };

  useEffect(() => {
    if (_.isFunction(resize)) {
      resize();
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
