const EstimatePopup = (t) =>
  t.popup({
    title: "Points Estimate",
    url: "estimate",
  });

const DistributionPopup = (t) =>
  t.popup({
    title: "Work Distribution",
    url: "distribution",
  });

const BreakdownPopup = (t) =>
  t.popup({
    title: "Breakdowns",
    url: "breakdowns",
  });

TrelloPowerUp.initialize({
  // Start adding handlers for your capabilities here!
  "card-buttons": function (t, options) {
    return [
      {
        text: "Estimate Size",
        callback: EstimatePopup,
      },
    ];
  },
  "card-badges": function (t, options) {
    return t.get("card", "shared").then((data) => {
      const { estimate, sprint } = data;

      return [
        {
          text: estimate ? `${estimate} Hours` : null,
          color: estimate ? "green" : null,
        },
        {
          text: sprint,
          color: sprint ? "light-gray" : null,
        },
      ];
    });
  },
  "card-detail-badges": function (t, options) {
    return t.get("card", "shared").then((data) => {
      const { estimate, sprint } = data;

      return [
        {
          title: "Estimate",
          text: estimate ? `${estimate} Hours` : null,
          color: estimate ? "green" : null,
          callback: EstimatePopup,
        },
      ];
    });
  },
  "board-buttons": (t, options) => {
    return [
      {
        text: "Work Distribution",
        callback: DistributionPopup,
      },
      {
        text: "Breakdowns",
        callback: BreakdownPopup,
      },
    ];
  },
});
