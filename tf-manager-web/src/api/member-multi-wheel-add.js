import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberMultiWheelAdd = (query) => {
  return https().request("/member-multi-wheel/additional/list", Method.GET, query, ContentType.form);
};

export const deleteMemberMultiWheelAdd = (ids) => {
  return https().request("/member-multi-wheel/additional/delete?id=" + ids, Method.POST);
};

export const addMemberMultiWheelAdd = (row) => {
  return https().request("/member-multi-wheel/additional/add", Method.POST, row, ContentType.form);
};
