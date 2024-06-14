import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const createWithdrawalChannelOrder = (withdrawalChannelOrders) => {
  return https().request("/WithdrawalChannelOrder", Method.POST, withdrawalChannelOrders, ContentType.form);
};
