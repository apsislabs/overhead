/* global TrelloPowerUp */

import React, { useEffect, useState } from "react";
import { withTrello } from "../src/withTrello";

const EstimatePage = ({ trello, t }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetch = async () => {
      const allData = await t.getAll();
      setData(allData);
    };

    fetch();
  }, [t])

  console.log(data);
  return <div>Estimate!</div>;
};

export default withTrello(EstimatePage);
