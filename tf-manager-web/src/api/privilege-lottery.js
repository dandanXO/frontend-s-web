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

export const getUefaLotteryRecords = (query) => {
  return https().request("/privi-uefa-lottery/get-record", Method.GET, query, ContentType.form);
};

export const getUefaLotteryResults = (query) => {
  return https().request("/privi-uefa-lottery/get-result", Method.GET, query, ContentType.form);
};

export const getUefaLotteryPrivilege = () => {
  return https().request("/privi-uefa-lottery/get-privileges", Method.GET, ContentType.form);
};

export const addRecord = (record) => {
  return https().request("/privi-uefa-lottery/add-lottery-record", Method.POST, record, ContentType.form);
};

export const addLotteryResult = (lottery) => {
  return https().request("/privi-uefa-lottery/add-result", Method.POST, lottery, ContentType.form);
};
