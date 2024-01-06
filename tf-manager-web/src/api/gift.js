import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getGift = (query) => {
  return https().request("/gift", Method.GET, query, ContentType.form);
};

export const createGift = (gift) => {
  return https().request("/gift", Method.POST, gift, ContentType.form);
};

export const updateGift = (gift) => {
  return https().request(`/gift/${gift.id}?_method=PUT`, Method.POST, gift, ContentType.form);
};

export const getGiftRecord = (query) => {
  return https().request("/gift-record", Method.GET, query, ContentType.form);
};

export const redeemGiftRecordCash = (id) => {
  return https().request(`/gift-record/${id}/redeemCash?_method=PUT`, Method.POST);
};

export const cancelGiftRecord = (record) => {
  return https().request(`/gift-record/${record.id}/cancel?_method=PUT`, Method.POST, { remark: record.remark }, ContentType.form);
};

export const deliverGift = (gift) => {
  return https().request(`/gift-record/${gift.id}/deliver?_method=PUT`, Method.POST, gift, ContentType.form);
};

export const giftDelivered = (id) => {
  return https().request(`/gift-record/${id}/delivered?_method=PUT`, Method.POST);
};
