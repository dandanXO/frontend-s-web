import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const sendOneSms = (request) => {
  return https().request("/send-sms/onesms", Method.GET, request, ContentType.form);
};

export const sendGroupSms = (request) => {
  return https().request("/send-sms/onesms/group", Method.GET, request, ContentType.form);
};
