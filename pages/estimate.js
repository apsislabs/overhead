/* global TrelloPowerUp */

import React, { useEffect, useState, useRef } from "react";
import { withTrello } from "../src/withTrello";
import { useForm, useField } from "react-final-form-hooks";

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
    if ( rootEl.current ) {
      t.sizeTo(rootEl.current);
    }
  }, [rootEl.current]);

  const onSubmit = async (values) => {
    const { estimate } = values;
    await t.set("card", "shared", "estimate", estimate);
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
