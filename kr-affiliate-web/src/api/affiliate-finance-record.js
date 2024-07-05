import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getFinanceReport = (id, recordDate) => {
  return https().request(`/affiliateFinance/${id}`, Method.GET, { recordDate: recordDate.join(',') }, ContentType.form);
};
