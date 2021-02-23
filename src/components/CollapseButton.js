import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import { useTrello } from "../contexts/TrelloContext";
import { Button } from "./Button";

export const CollapseButton = ({ label, children, onOpen, onClose }) => {
  const { resize } = useTrello();
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
      <Button style={{ marginBottom: open ? 8 : 0 }} onClick={handleToggleOpen}>
        {label}
      </Button>

      <Collapse isOpened={open}>
        <div className="pop-over-section">{children}</div>
      </Collapse>
    </>
  );
};
