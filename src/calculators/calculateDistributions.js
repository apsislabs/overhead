import _ from "lodash";

const reduceEstimatesByCard = (cards, estimates, accumulator, cb) => {
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

      return cb(acc, estimate, card);
    },
    accumulator
  );
};

export const calculateHoursByLabel = (cards, labels, estimates) => {
  const accumulator = { noLabels: 0 };
  _.each(labels, (l) => (accumulator[l.id] = 0));

  const e = reduceEstimatesByCard(
    cards,
    estimates,
    accumulator,
    (acc, estimate, card) => {
      _.each(card.labels, (l) => {
        console.log("Adding", acc[l.id], estimate);
        acc[l.id] += estimate
      });

      return acc;
    }
  );

  console.log(e);
};

export const calculateHoursByDueDate = (cards, estimates) => {
  const accumulator = { noDeadline: 0 };

  _.each(cards, (c) => {
    if (c.due) {
      accumulator[c.due] = 0;
    }
  });

  return reduceEstimatesByCard(cards, estimates, accumulator, (acc, estimate, card) => {
    if (!card.due) {
      acc.noDeadline += estimate;
    } else {
      acc[card.due] += estimate;
    }

    return acc;
  });
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
