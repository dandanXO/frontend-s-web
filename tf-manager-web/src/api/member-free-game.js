import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberFreeGame = (query) => {
  return https().request("/member-free-game", Method.GET, query, ContentType.form);
};

export const resend = (ids) => {
  return https().request("/member-free-game/resend?id=" + ids, Method.POST);
};

export const addMemberFreeGame = (row) => {
  return https().request("/member-free-game/add", Method.POST, row, ContentType.form);
};
