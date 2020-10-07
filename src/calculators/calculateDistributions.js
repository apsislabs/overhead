import _ from "lodash";

export const calculateHoursByLabel = (cards, estimates) => {
  console.log(cards);
}

export const calculateHoursByDueDate = (cards, estimates) => {
  const accumulator = { noDeadline: 0 };

  _.each(cards, (c) => {
    if (c.due) {
      accumulator[c.due] = 0;
    }
  });

  return _.reduce(
    cards,
    (acc, card) => {
      if (!_.has(estimates, card.id)) {
        return acc;
      }

      const estimate = parseFloat(_.get(estimates, card.id));

      if (_.isNaN(estimate)) {
        return acc;
      }

      if (!card.due) {
        acc.noDeadline += estimate;
      } else {
        acc[card.due] += estimate;
      }

      return acc;
    },
    accumulator
  );
};

export const calculateDistributions = (
  cards,
  estimates,
  excludedLists = []
) => {
  return _.reduce(
    cards,
    (acc, card) => {
      if (
        excludedLists.indexOf(card.idList) > -1 ||
        !_.has(estimates, card.id)
      ) {
        return acc;
      }

      const estimate = parseFloat(_.get(estimates, card.id));
      if (_.isNaN(estimate)) {
        return acc;
      }

      if (card.members.length < 1) {
        if (!_.has(acc, "unassigned")) {
          _.set(acc, "unassigned", 0);
        }

        acc["unassigned"] += estimate;
      }

      _.forEach(card.members, (member) => {
        if (!_.has(acc, member.id)) {
          _.set(acc, member.id, 0);
        }

        acc[member.id] += estimate;
      });

      return acc;
    },
    {}
  );
};
