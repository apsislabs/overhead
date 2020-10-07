import _ from "lodash";

export const calculateHoursByDueDate = (cards, estimates) => {
  const e =  _.reduce(
    cards,
    (acc, card) => {
      console.log(card.due, card.dueComplete, card.dateLastActivity);

      if ( !_.has(estimates, card.id)) {
        return acc;
      }

      const estimate = parseFloat(_.get(estimates, card.id));

      if (_.isNaN(estimate)) {
        return acc;
      }

      if (!card.due) {
        if (!_.has(acc, "noDeadline")) {
          _.set(acc, "noDeadline", 0);
        }

        acc["noDeadline"] += estimate;
      } else {
        if(!_.has(acc, card.due)) {
          _.set(acc, card.due, 0);
        }

        acc[card.due] += estimate;
      }

      return acc;
    },
    {}
  )

  console.log(e);
}

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
