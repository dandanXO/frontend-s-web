import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getWinnerList = (id) => {
  return https().request("/privi-christmas/queryWinner", Method.GET, { id: id }, ContentType.form);
};

export const calculateWinner = (id) => {
  return https().request("/privi-christmas/calculateWinner", Method.POST, { id: id }, ContentType.form);
};

export const getParticipants = (form) => {
  return https().request("/privi-christmas/queryParticipant", Method.GET, form, ContentType.form);
};
