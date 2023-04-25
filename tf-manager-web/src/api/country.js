import https from "@/utils/https";
import { Method } from "axios-mapper";

export const getCountries = () => {
  return https().request("/country", Method.GET);
};
