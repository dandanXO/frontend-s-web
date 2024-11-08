import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getUsers = (query) => {
  return https().request("/telegram/list-user", Method.GET, query, ContentType.form);
};

export const addUser = (user) => {
  return https().request("/telegram/add-user", Method.POST, user, ContentType.form);
};

export const deleteUser = async ids => {
  await https().request(
    `/telegram?_method=DELETE`,
    Method.POST,
    { ids: ids.join(',') },
    ContentType.form
  )
}

export const approveUser = (user) => {
  return https().request("/telegram/approve?_method=PUT", Method.POST, user, ContentType.form);
};
