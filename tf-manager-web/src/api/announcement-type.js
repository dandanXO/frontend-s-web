import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAnnouncementType = (announcementType) => {
  return https().request("/announcementType", Method.GET, announcementType, ContentType.form);
};

export const getActiveAnnouncementType = () => {
  return https().request("/announcementType/active", Method.GET);
};

export const createAnnouncementType = (announcementType) => {
  return https().request("/announcementType", Method.POST, announcementType, ContentType.form);
};

export const updateAnnouncementType = (announcementType) => {
  return https().request(`/announcementType/${announcementType.id}?_method=PUT`, Method.POST, announcementType, ContentType.form);
};

export const updateAnnouncementTypeState = (id, state) => {
  return https().request(`/announcementType/${id}/state?_method=PUT`, Method.POST, { state: state }, ContentType.form);
};

export const deleteAnnouncementType = (ids) => {
  return https().request(`/announcementType?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
