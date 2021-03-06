import React from "react";
import { convertNumToTime } from "../utils/timeUtils";
import { Badge } from "./Badge";

const avatarStyles = {
  width: 20,
  borderRadius: 20,
  marginRight: 8,
};

const unknownAvatarStyles = {
  width: 20,
  height: 20,
  borderRadius: 20,
  marginRight: 8,
  backgroundColor: "#ddd",
};

const tableCell = {
  borderWidth: 0,
};

const lastCell = {
  textAlign: "right",
};

const DEFAULT_COLOR = ["shades", 40];

const getBadgeColor = (hours) => {
  if (hours >= 18 && hours <= 22) {
    return ["green", 500];
  } else if (hours < 18) {
    return ["yellow", 500];
  } else if (hours > 22) {
    return ["red", 500];
  } else {
    return DEFAULT_COLOR;
  }
};

const getLabelColor = (labels) => {
  if (labels.size === 0) {
    return ["orange", 50];
  } else if (labels.size < 3) {
    return ["green", 50];
  } else if (labels.size == 3) {
    return ["yellow", 50];
  } else {
    return ["red", 50];
  }
};

export const EstimateRow = ({
  name,
  hours,
  labels, // Set<string>
  avatarUrl,
  avatar = true,
  useColors = true,
  showLabels = false,
  AvatarComponent,
  ...rest
}) => {
  const badgeVariant = useColors ? getBadgeColor(hours) : DEFAULT_COLOR;
  const labelBadgeVariant = useColors ? getLabelColor(labels) : DEFAULT_COLOR;
  const hoursLabel = hours ? convertNumToTime(hours) : "0H";
  const labelsLabel = labels ? `${labels.size}L` : `0L`;

  return (
    <tr {...rest}>
      <td style={tableCell}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {avatar && (
            <>
              {avatarUrl ? (
                <img style={avatarStyles} src={avatarUrl} />
              ) : (
                <>
                  {AvatarComponent ? (
                    <AvatarComponent />
                  ) : (
                    <div style={unknownAvatarStyles} />
                  )}
                </>
              )}
            </>
          )}

          <span>{name}</span>
        </div>
      </td>

      {showLabels && (
        <td style={tableCell}>
          <Badge
            variant={labelBadgeVariant[0]}
            weight={labelBadgeVariant[1]}
          >
            {labelsLabel}
          </Badge>
        </td>
      )}

      <td style={Object.assign({}, tableCell, lastCell)}>
        <Badge variant={badgeVariant[0]} weight={badgeVariant[1]}>
          {hoursLabel}
        </Badge>
      </td>
    </tr>
  );
};
