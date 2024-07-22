import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getCouponRecords = (query) => {
  return https().request("/promotionCoupon/promoCouponRecords", Method.GET, query, ContentType.form);
};
