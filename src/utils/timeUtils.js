export const convertNumToTime = (number) => {
  const hour = Math.floor(Math.abs(number));
  const decpart = number - hour;

  const min = 1 / 60;
  decpart = min * Math.round(decpart / min);
  const minute = Math.floor(decpart * 60) + "";

  // Add padding if need
  if (minute.length < 2) {
    minute = "0" + minute;
  }

  return `${hour}H${minute}M`;
};
