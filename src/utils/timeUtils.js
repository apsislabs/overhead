export const convertNumToTime = (number) => {
  let hour = Math.floor(Math.abs(number));
  let decpart = number - hour;

  let min = 1 / 60;
  decpart = min * Math.round(decpart / min);
  let minute = Math.floor(decpart * 60) + "";

  // Add padding if need
  if (minute.length < 2) {
    minute = "0" + minute;
  }

  return `${hour}:${minute}`;
};
