import _ from "lodash";
import React, { useState } from "react";
import { Collapse } from "react-collapse";
import { CheckboxRow } from "./CheckboxRow";

export const ListToggler = ({ label = "Edit Lists", lists, onToggle }) => {
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
        <div className="pop-over-section">
          <h4>Excluded Lists</h4>
          <fieldset style={{ marginBottom: 0 }}>
            {_.map(lists, (l) => {
              return (
                <CheckboxRow
                  key={l.id}
                  checked={excludedLists.indexOf(l.id) > -1}
                  onChange={() => onToggle(l.id)}
                  label={l.name}
                />
              );
            })}
          </fieldset>
        </div>
      </Collapse>
    </>
  );
};
