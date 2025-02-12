import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getGameJackpotRecordList = (gameJackpot) => {
  return https().request("/privi-game-jackpot-record", Method.GET, gameJackpot, ContentType.form);
};

// export const createTopRanking = (topRanking) => {
//   return https().request("/privi-game-jackpot-record", Method.POST, topRanking, ContentType.form);
// };

// export const updateTopRanking = (topRanking) => {
//   return https().request(`/privi-game-jackpot-record?_method=PUT`, Method.POST, topRanking, ContentType.form);
// };

// export const delTopRanking = (ids) => {
//   return https().request(`/privi-game-jackpot-record?_method=DELETE`, Method.POST, { ids: ids }, ContentType.form);
// };
