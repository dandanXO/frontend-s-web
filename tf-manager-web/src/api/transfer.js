import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getTransferRecords = (transfer) => {
  return https().request("/transfer", Method.GET, transfer, ContentType.form);
};

export const update = async (transfer) => {
  await https().request(`/transfer/${transfer.id}?_method=PUT`, Method.POST, transfer, ContentType.form);
};
