import _ from "lodash";
import React from "react";
import { CheckboxRow } from "./CheckboxRow";
import { CollapseButton } from "./CollapseButton";

export const ListToggler = ({ label = "Edit Lists", lists, excludedLists, onToggle }) => {
  return (
    <>
      <CollapseButton label={label}>
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
      </CollapseButton>
    </>
  );
};
