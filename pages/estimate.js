/* global TrelloPowerUp */

import React, { useEffect, useRef, useState } from "react";
import { useField, useForm } from "react-final-form-hooks";
import { withTrello } from "../src/withTrello";

const inputStyles = {
  marginRight: 8,
  marginBottom: 0,
  width: "100%",
};

const buttonStyles = {
  margin: 0,
};

const rowStyles = {
  display: "flex",
};

const mustBeNumber = (value) => (isNaN(value) ? "Must be a number" : undefined);

const EstimatePage = ({ t }) => {
  const rootEl = useRef(null);
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const storedEstimate = await t.get("card", "shared", "estimate", "");
        setEstimate(storedEstimate);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [t]);

  useEffect(() => {
    if (rootEl.current) {
      t.sizeTo(rootEl.current);
    }
  }, [rootEl.current]);

  const onSubmit = async (values) => {
    const { estimate } = values;
    await t.set("card", "shared", "estimate", estimate);
    t.closePopup();
  };

  const { form, handleSubmit, pristine, submitting } = useForm({
    onSubmit,
    initialValues: { estimate },
  });

  const estimateField = useField("estimate", form, mustBeNumber);

  return loading ? (
    "Loading..."
  ) : (
    <div ref={rootEl}>
      <form onSubmit={handleSubmit}>
        <div style={rowStyles}>
          <input
            type="number"
            autoFocus
            style={inputStyles}
            {...estimateField.input}
            placeholder="Estimate"
          />

          <button
            style={buttonStyles}
            className="mod-primary"
            type="submit"
            disabled={pristine || submitting}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default withTrello(EstimatePage);
