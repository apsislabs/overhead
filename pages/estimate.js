/* global TrelloPowerUp */

import React, { useEffect, useState, useRef } from "react";
import { withTrello } from "../src/withTrello";

const EstimatePage = ({ t }) => {
  const rootEl = useRef(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    t.sizeTo(rootEl.current);
  }, [rootEl.current]);

  const handleUpdate = async () => {
    setSaving(true);
    await t.set("card", "shared", "estimate", estimate);
    setSaving(false);
    t.closePopup();
  };

  if (loading) {
    return "Loading...";
  }

  return (
    <div ref={rootEl}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="number"
          value={estimate}
          style={{ marginRight: 8 }}
          onChange={(e) => setEstimate(e.target.value)}
        />
        <button disabled={saving} onClick={() => handleUpdate()}>
          Save
        </button>
      </div>
    </div>
  );
};

export default withTrello(EstimatePage);
