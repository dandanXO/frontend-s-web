import { eventapi } from "boot/axios";
import { userStore } from "src/stores";
const store = userStore();
const qs = require("qs");
export function getNbaMatch() {
  return eventapi.get("/nba-match/upcoming");
}

export function getNbaRecord() {
  return eventapi.get("/nba-match/history");
}

// export function submitNbaMatch(params) {
//   return eventapi.post("/nba-match/submit", qs.stringify(params));
// }

export function submitNbaMatch(params) {
  console.log(params);
  const { matchId, team } = params;
  const requestOptions = {
    method: "POST",
    body: JSON.stringify({ matchId: matchId, team: team }),
    headers: {
      token: store.token,
      Authorization: process.env.SITE,
      "Content-Type": "application/json"
    }
  };
  let evtUrl = localStorage.getItem("DY_H5_EVT_URL");

  return fetch(evtUrl + "/nba-match/submit", requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
