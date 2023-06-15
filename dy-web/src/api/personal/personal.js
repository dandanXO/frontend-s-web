import { server } from "@/utils/request";

export function loadBalance(platform) {
  return server.REST.get("/session/balance?v=123", {
    params: {
      platform,
    },
  });
}
export function getAnnouncement() {
  return server.REST.get(`/announcement`);
}

export function loadMemberInfo() {
  return server.REST.get("/session/member");
}

export function changePwd(oldPassword, password) {
  return server.REST.post("/session/password", { oldPassword, password });
}

export function updateAccount(updateInfo) {
  return server.REST.post("/session/account", updateInfo);
}

const recordUrl = {
  deposit: "/session/member/deposit",
  // transfer: "/session/member/betRecord",
  turnover: "/session/member/moneyChange",
  withdraw: "/session/member/withdraw",
  rebates: "/session/member/privilege",
  betRecord: "/session/member/betRecord",
  gameBetRecord: "/session/member/gameBetRecord",
};

export function loadRecords(type, p) {
  return server.REST.get(recordUrl[type], { params: p });
}

export function gameBetRecordTotal(p) {
  return server.REST.get("/session/member/gameBetRecordTotal", { params: p });
}

export function financeFeedbackList(p) {
  return server.REST.get("/session/member/financeFeedback", { params: p });
}

export function loadCurrency() {
  return server.REST.get("/session/withdraw/currency");
}

export function loadBanks(currencyId) {
  return server.REST.get("/session/withdraw/card", { params: { currencyId } });
}

export function loadBankCards() {
  return server.REST.get("/session/bankCard");
}

export function loadUnbindRecord(params) {
  return server.REST.get("/session/unbindLog", { params: params });
}

export function addBankCard(bci) {
  return server.REST.post("/session/bankCard", bci);
}

export function confirmWithdraw(bci) {
  return server.REST.post("/session/withdraw/", bci);
}

export function withdrawEntrance() {
  return server.REST.get("/session/withdraw/entrance");
}

export function deleteBankCard(cardId) {
  return server.REST.post(`/session/bankCard/${cardId}?_method=delete`);
}

export function sendEmail(emailInfo) {
  return server.REST.post("/otp/sendEmail", emailInfo);
}

export function verifyEmail(emailInfo) {
  return server.REST.post("/otp/verifyEmail", emailInfo);
}

export function saveFinanceFeedback(reminderInfo) {
  return server.REST.post("/session/saveFinanceFeedback", reminderInfo);
}

export function getVerifyingFeedbackCount(data) {
  return server.REST.get("session/getVerifyingFeedbackCount", data);
}
