/* global TrelloPowerUp */

import React, { useEffect, useState } from "react";
import { withTrello } from "../src/withTrello";

const EstimatePage = ({ t }) => {
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const storedEstimate = await t.get("card", "shared", "estimate", "");
      setEstimate(storedEstimate);
      setLoading(false);
    };

    fetch();
  }, [t]);

  const handleUpdate = () => {
    t.set("card", "shared", "estimate", estimate);
  };

  if (loading) {
    return "Loading...";
  }

  return (
    <div>
      <input
        type="number"
        value={estimate}
        onChange={(e) => setEstimate(e.target.value)}
      />
      <button onClick={() => handleUpdate()}>Save</button>
    </div>
  );
};

export default withTrello(EstimatePage);
