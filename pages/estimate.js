/* global TrelloPowerUp */

import React, { useEffect, useRef, useState } from "react";
import { useField, useForm } from "react-final-form-hooks";
import { Loader } from "../src/components/Loader";
import { useTrello } from "../src/contexts/TrelloContext";

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

const EstimatePage = () => {
  const { trello } = useTrello();
  const rootEl = useRef(null);
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const storedEstimate = await trello.get(
          "card",
          "shared",
          "estimate",
          ""
        );
        setEstimate(storedEstimate);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [trello]);

  useEffect(() => {
    if (rootEl.current) {
      trello.sizeTo(rootEl.current);
    }
  }, [rootEl.current]);

  const onSubmit = async (values) => {
    const { estimate } = values;
    await trello.set("card", "shared", "estimate", estimate);
    trello.closePopup();
  };

  const { form, handleSubmit, pristine, submitting } = useForm({
    onSubmit,
    initialValues: { estimate },
  });

  const estimateField = useField("estimate", form, mustBeNumber);

  return loading ? (
    <Loader />
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
