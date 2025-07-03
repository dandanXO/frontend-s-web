import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getVoucherList = (query) => {
  return https().request("/member-privilege-voucher", Method.GET, query, ContentType.form);
};

export const createBatchVouchers = (vouchers) => {
  return https(5 * 60 * 1000).request("/member-privilege-voucher/createBatch", Method.POST, { vouchers: JSON.stringify(vouchers) }, ContentType.form);
};

export const cancelVoucher = (id) => {
  return https().request(`/member-privilege-voucher/${id}/cancel?_method=PUT`, Method.POST);
};
