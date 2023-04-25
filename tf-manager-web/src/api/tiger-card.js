import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getTigerCardList = (tigerCardQuery) => {
  return https().request("/tiger-card/record", Method.GET, tigerCardQuery, ContentType.form);
};

export const getTigerCardSetting = (query) => {
  return https().request("/tiger-card/setting", Method.GET, query, ContentType.form);
};

export const updateTigerCardSetting = (tigerCardSetting) => {
  return https().request(`/tiger-card/${tigerCardSetting.id}?_method=PUT`, Method.POST, tigerCardSetting, ContentType.form);
};
