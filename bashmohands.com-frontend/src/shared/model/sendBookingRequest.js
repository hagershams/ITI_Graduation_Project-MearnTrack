import getAuthData from "./getAuthData";

const { user, token } = getAuthData();
export default function sendBookingRequest({
  instructorHandler,
  clientHandler,
  date,
  notes,
}) {
  // Request to server
  console.log(date);
  const baseUrl = `${process.env.REACT_APP_BACKEND_API}session/book`;
  // const baseUrl = `http://localhost:5000/api/session/book`;
  return fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      instructorHandler,
      clientHandler,
      date,
      notes,
      topics: [],
    }),
  });
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     console.log("Server Request Resolved! with value: ", res);
  //     // if (name === "no") reject(new Error("You can't use that name"));
  //     resolve(res);
  //   }, 3000);
  // });
}
