import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getWithdrawShow = (data) => {
  return https().request("/site-withdraw-show", Method.GET, data, ContentType.form);
};

export const updateWithdrawShow = (data) => {
  return https().request(`/site-withdraw-show/${data.id}?_method=PUT`, Method.POST, data, ContentType.form);
};

export const copyWithdrawShow = (data) => {
  return https().request(`/site-withdraw-show/copy?_method=PUT`, Method.POST, data, ContentType.form);
};

export const deleteWithdrawShow = (ids) => {
  return https().request(`/site-withdraw-show?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const createWithdrawShow = (data) => {
  return https().request("/site-withdraw-show", Method.POST, data, ContentType.form);
};
