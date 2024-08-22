import { server } from "@/utils/request";
import { userStore } from "@/store";
export function getTeams() {
  return server.EVENT.get("/uefa/team");
}
export const submitTeam = (teamIds) => {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify(teamIds),
    headers: {
      token: `${userStore().token}`,
      "Content-Type": "application/json"
    }
  };
  var evtUrl = process.env.VUE_APP_EVT_API.split(",")[0];

  return fetch(evtUrl + "/uefa/team/submit", requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
export function euroMatchAll() {
  return server.EVENT.get("/uefa/match/all");
}
export function euroMatchOngoing() {
  return server.EVENT.get("/uefa/match/ongoing");
}
export function euroMatchSubmit(matchId, selectedTeamId) {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify({ matchId: matchId, selectedTeamId: selectedTeamId }),
    headers: {
      token: `${userStore().token}`,
      "Content-Type": "application/json"
    }
  };
  var evtUrl = process.env.VUE_APP_EVT_API.split(",")[0];

  return fetch(evtUrl + "/uefa/match/submit", requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function euroMatchPoints() {
  return server.EVENT.get("/uefa/matchPoints");
}
export function euroClaimMatchPoints(points) {
  return server.EVENT.post("/uefa/matchPoints/claim", { point: points });
}
export function firstBet(gameType) {
  return server.EVENT.post("/first-bet/claim", { gameType: gameType });
}

export function claimSaveBonus() {
  return server.EVENT.post("/first-bet/refund", {});
}

// export function firstBet(gameType) {
//     const requestOptions = {
//         method: 'POST',
//         body: JSON.stringify( {gameType: gameType }),
//         headers: {
//             token: `${userStore().token}`,
//             'Content-Type': 'application/json'
//         },
//       };
//         var evtUrl = process.env.VUE_APP_EVT_API.split(",")[0];

//       return fetch(evtUrl + '/first-bet/claim', requestOptions)
//         .then(response => {
//           return response.json()
//         })
//         .catch(error => {
//           return Promise.reject(error);
//         });
// }
