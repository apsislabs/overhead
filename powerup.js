console.log(TrelloPowerUp);

TrelloPowerUp.initialize;
({
  "card-buttons": (t, options) => {
    return [
      {
        text: "Hello World",
      },
    ];
  },
});

// TrelloPowerUp.initialize({
//   // Start adding handlers for your capabilities here!
//   "card-buttons": function (t, options) {
//     return [
//       {
//         text: "Estimate Size",
//         callback: EstimatePopup,
//       },
//       {
//         text: "Sprint",
//         callback: SprintPopup,
//       },
//     ];
//   },
//   "card-badges": function (t, options) {
//     return t.get("card", "shared").then((data) => {
//       const { estimate, sprint } = data;

//       return [
//         {
//           text: estimate ? `${estimate} Hours` : null,
//           color: estimate ? "green" : null,
//         },
//         {
//           text: sprint,
//           color: sprint ? "light-gray" : null,
//         },
//       ];
//     });
//   },
//   "card-detail-badges": function (t, options) {
//     return t.get("card", "shared").then((data) => {
//       const { estimate, sprint } = data;

//       return [
//         {
//           title: "Estimate",
//           text: estimate ? `${estimate} Hours` : null,
//           color: estimate ? "green" : null,
//           callback: EstimatePopup,
//         },
//         {
//           title: "Sprint",
//           text: sprint,
//           color: sprint ? "light-gray" : null,
//           callback: SprintPopup,
//         },
//       ];
//     });
//   },
//   "board-buttons": (t, options) => {
//     return [
//       {
//         text: "Estimates",
//         callback: (t) =>
//           t.popup({
//             title: "Work Distribution",
//             url: "totals.html",
//           }),
//       },
//     ];
//   },
// });
