import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getWinnerList = (code) => {
  return https().request("/privi-christmas/queryWinner", Method.GET, { promoCode: code }, ContentType.form);
};

export const calculateWinner = (code) => {
  return https().request("/privi-christmas/calculateWinner", Method.POST, { promoCode: code }, ContentType.form);
};

export const getParticipants = (form) => {
  return https().request("/privi-christmas/queryParticipant", Method.GET, form, ContentType.form);
};
