import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getHomeBannerList = (homeBanner) => {
  for (const key in homeBanner) {
    if (homeBanner[key] === null || homeBanner[key] === undefined || homeBanner[key] === "") {
      delete homeBanner[key];
    }
  }
  return https().request("/home-banner", Method.GET, homeBanner, ContentType.form);
};

export const createHomeBanner = (homebanner) => {
  return https().request("/home-banner/create", Method.POST, homebanner, ContentType.json);
};

export const updateHomeBanner = (homeBanner) => {
  return https().request(`/home-banner/update?_method=PUT`, Method.POST, homeBanner, ContentType.json);
};

export const updateBannerState = async (id, state) => {
  await https().request(`/home-banner/${id}/state?_method=PUT`, Method.POST, { state: state }, ContentType.form);
};

export const deleteHomeBanner = async (ids) => {
  await https().request(`/home-banner?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
