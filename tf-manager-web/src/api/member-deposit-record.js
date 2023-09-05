import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const supplementDeposit = (depositRecord) => {
  return https().request(`/deposit/${depositRecord.id}?_method=PUT`, Method.POST, depositRecord, ContentType.form);
};

export const cancelDeposit = (depositRecord) => {
  return https().request(`/deposit/${depositRecord.id}/cancel?_method=PUT`, Method.POST, depositRecord, ContentType.form);
};

export const getDepositRecord = (query) => {
  return https().request("/deposit/depositRecordList", Method.GET, query, ContentType.form);
};

export const getExportDepositRecord = (query) => {
  return https().request("/deposit/depositRecordListExport", Method.GET, query, ContentType.form);
};

export const getTotalDepositAmount = (query) => {
  return https().request("/deposit/totalDepositAmount", Method.GET, query, ContentType.form);
};

export const editDeposit = (depositRecord) => {
  return https().request(`/deposit/${depositRecord.id}/edit?_method=PUT`, Method.POST, depositRecord, ContentType.form);
};
