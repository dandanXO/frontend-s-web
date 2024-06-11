import { server } from "@/utils/request";
import { userStore } from "@/store";
export function getNbaMatch() {
  return server.EVENT.get("/nba-match/upcoming");
}

export function getNbaRecord() {
  return server.EVENT.get("/nba-match/history");
}

// export function submitNbaMatch(params) {
//   console.log(params);
//   const { matchId, team } = params;
//   return server.EVENT.post(
//     "/nba-match/submit",
//     { matchId, team },
//     {
//       headers: {
//         "Content-Type": "application/json;charset=UTF-8"
//       }
//     }
//   );
// }

export function submitNbaMatch(params) {
  console.log(params);
  const { matchId, team } = params;
  const requestOptions = {
    method: "POST",
    body: JSON.stringify({ matchId: matchId, team: team }),
    headers: {
      token: userStore().token,
      "Content-Type": "application/json"
    }
  };
  let evtUrl = process.env.VUE_APP_EVT_API.split(",")[0];

  return fetch(evtUrl + "/nba-match/submit", requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
