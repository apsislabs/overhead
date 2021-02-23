export const SHAMEBOT_URL = "http://localhost:3000/prod/sprint";
// export const SHAMEBOT_URL =
//   "https://kumh2i8hk7.execute-api.us-west-2.amazonaws.com/prod/sprint";

export const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    mode: "no-cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });

  return response.json();
};
