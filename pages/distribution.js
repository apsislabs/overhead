import React, { useState, useEffect } from "react";
import _ from "lodash";
import { withTrello } from "../src/withTrello";

const DistributionPage = ({ t }) => {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [estimates, setEstimates] = useState({});

  useEffect(() => {
    const fetch = async () => {
      console.log("Fetching...");

      try {
        setLoading(true);

        const [members, lists] = await Promise.all([
          t.board("members"),
          t.lists("all"),
        ]);

        const cards = _.flatten(_.map(lists, (l) => l.cards));

        const estimatePromises = _.map(cards, (c) =>
          t.get(c.id, "shared", "estimate", null)
        );

        const estimateValues = await Promise.all(estimatePromises);

        const estimates = _.reduce(
          cards,
          (e, c, i) => {
            e[c.id] = estimateValues[i];
            return e;
          },
          {}
        );

        setEstimates(estimates);
        setMembers(members);
        setLists(lists);
        setCards(cards);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [t]);

  console.log(members, lists, cards, estimates);

  return loading ? "Loading..." : <div>Distribution!</div>;
};

export default withTrello(DistributionPage);
