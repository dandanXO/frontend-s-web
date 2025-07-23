import https from "@/utils/https";
import {ContentType, Method} from "axios-mapper";

export const getAllSportPlatform = () => {
  return https().request("/sport-config/all-sport-platform", Method.GET, ContentType.form);
};

export const getAllTFSportType = () => {
  return https().request("/sport-config/all-tf-sport-type", Method.GET, ContentType.form);
};

export const getAllTFMarketType = () => {
  return https().request("/sport-config/all-tf-market-type", Method.GET, ContentType.form);
};

export const getAllSportDataSyncSuccessTimes = () => {
  return https().request("/sport-config/all-data-sync-success-time", Method.GET, ContentType.form);
};
