import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getNotes = (query) => {
  return https().request(`/notes`, Method.GET, query, ContentType.form);
};

export const createNote = (note) => {
  return https().request("/notes", Method.POST, note, ContentType.form);
};

export const deleteNotes = async (id) => {
  await https().request(`/notes?_method=DELETE`, Method.POST, { ids: id }, ContentType.form);
};
