import _ from "lodash";
import { getSprintNumber } from "../utils/dateUtils";

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

export const calculateHoursByLabel = (
  cards,
  labels,
  estimates,
  excludedLists = []
) => {
  const accumulator = { noLabel: 0 };
  _.each(labels, (l) => {
    if (l.id) {
      accumulator[l.id] = 0;
    }
  });

  return reduceEstimatesByCard(
    cards,
    estimates,
    accumulator,
    (acc, estimate, card) => {
      if (excludedLists.indexOf(card.idList) > -1) {
        return acc;
      }

      if (card.labels && card.labels.length > 0) {
        _.each(card.labels, (l) => {
          acc[l.id] += estimate;
        });
      } else {
        acc.noLabel += estimate;
      }

      return acc;
    }
  );
};

export const calculateHoursByDueDate = (
  cards,
  estimates,
  excludedLists = []
) => {
  const accumulator = { noDeadline: 0 };

  _.each(cards, (c) => {
    if (c.due) {
      const sprint = getSprintNumber(new Date(c.due));
      accumulator[sprint] = 0;
    }
  });

  return reduceEstimatesByCard(
    cards,
    estimates,
    accumulator,
    (acc, estimate, card) => {
      if (excludedLists.indexOf(card.idList) > -1) {
        return acc;
      }

      if (!card.due) {
        acc.noDeadline += estimate;
      } else {
        const sprint = getSprintNumber(new Date(c.due));
        acc[sprint] += estimate;
      }

      return acc;
    }
  );
};

export const countUnestimatedCards = (cards, estimates, excludedLists = []) => {
  const includedCards = _.filter(
    cards,
    (c) => excludedLists.indexOf(c.idList) === -1
  );

  const unestimatedCards = _.filter(
    includedCards,
    (c) => _.get(estimates, c.id, null) === null
  );

  return unestimatedCards.length;
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
        _.get(estimates, card.id, null) === null
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

      const numMembers = Math.max(1, card.members.length);
      const splitEstimate = estimate / numMembers;

      _.forEach(card.members, (member) => {
        if (!_.has(acc, member.id)) {
          _.set(acc, member.id, 0);
        }

        acc[member.id] += splitEstimate;
      });

      return acc;
    },
    {}
  );
};
