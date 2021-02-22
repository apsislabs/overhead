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

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  return response.json(); // parses JSON response into native JavaScript objects
}

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
      {
        text: "Post",
        callback: () => {
          console.log("Notifying Slack!");
          postData(
            "https://kumh2i8hk7.execute-api.us-west-2.amazonaws.com/prod/sprint"
          );
        },
      },
    ];
  },
});
