import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getPriviSpinEventRecordList = (form) => {
  return https().request("/privi-spin-event-record", Method.GET, form, ContentType.form);
};

export const addPriviSpinEventRecord = (form) => {
  return https().request("/privi-spin-event-record", Method.POST, form, ContentType.form);
};

export const updatePriviSpinEventRecord = (id, record) => {
  return https().request(`/privi-spin-event-record?_method=PUT`, Method.POST, record, ContentType.form);
};
