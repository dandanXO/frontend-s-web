import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getAnnouncement = (announcement) => {
  return https().request("/announcement", Method.GET, announcement, ContentType.form);
};

export const createAnnouncement = (announcement) => {
  return https().request("/announcement", Method.POST, announcement, ContentType.form);
};

export const updateAnnouncement = (announcement) => {
  return https().request(`/announcement/${announcement.id}?_method=PUT`, Method.POST, announcement, ContentType.form);
};

export const updateAnnouncementState = (id, state) => {
  return https().request(`/announcement/${id}/state?_method=PUT`, Method.POST, { state: state }, ContentType.form);
};

export const deleteAnnouncement = (ids) => {
  return https().request(`/announcement?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
