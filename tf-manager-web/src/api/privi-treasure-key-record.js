import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const addTreasureKey = (form) => {
  return https().request("/privi-treasure-key-record/add", Method.POST, form, ContentType.form);
};

export const deductTreasureKey = (form) => {
  return https().request("/privi-treasure-key-record/deduct", Method.POST, form, ContentType.form);
};

export const listTreasureKeyRecord = (form) => {
  return https().request("/privi-treasure-key-record", Method.GET, form, ContentType.form);
};

export const getMemberKey = (loginName, siteId, code) => {
  return https().request("/privi-treasure-key-record/get-key", Method.GET,
    {
      loginName,
      siteId,
      promoCode: code
    },
    ContentType.form);
};

export const requestExportTreasureKey = (form) => {
  return https().request("/privi-treasure-key-record/export", Method.GET, form, ContentType.form);
};
