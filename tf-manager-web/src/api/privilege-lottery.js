import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const lotteryResult = (lottery) => {
  return https().request("/privilege/lotteryResult", Method.POST, lottery, ContentType.form);
};

export const getLotteryRecords = (query) => {
  return https().request("/privilege/lotteryRecords", Method.GET, query, ContentType.form);
};

export const getLotteryResults = (query) => {
  return https().request("/privilege/lotteryResults", Method.GET, query, ContentType.form);
};
