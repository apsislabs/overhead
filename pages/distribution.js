import React from "react";
import { withTrello } from "../src/withTrello";

const DistributionPage = ({ t }) => {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [estimates, setEstimate] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);

        const [members, lists] = await Promise.all([
          t.board("members"),
          t.lists("all"),
        ]);

        const cards = _.flatten(_.map(lists, (l) => l.cards));

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

  console.log(members, lists, cards);

  return loading ? "Loading..." : <div>Distribution!</div>;
};

export default withTrello(DistributionPage);
