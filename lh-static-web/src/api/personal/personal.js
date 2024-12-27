import { server } from "@/utils/request";

export function loadBalance(platform) {
  return server.REST.get("/session/balance?v=" + new Date().getTime(), {
    params: {
      platform
    }
  });
}
export function getAnnouncement() {
  return server.REST.get(`/announcement`);
}

export function loadMemberInfo() {
  return server.REST.get("/session/member");
}

export function loadMemberTelephone() {
  return server.REST.get("/session/member/telephone");
}

export function changePwd(oldPassword, password) {
  return server.REST.post("/session/password", { oldPassword, password });
}

export function updateAccount(updateInfo) {
  return server.REST.post("/session/account", updateInfo);
}

const recordUrl = {
  deposit: "/session/member/deposit",
  transfer: "/session/member/transfer",
  turnover: "/session/member/moneyChange",
  withdraw: "/session/member/withdraw",
  rebates: "/session/member/privilege",
  betRecord: "/session/member/betRecord",
  gameBetRecord: "/session/member/gameBetRecordWithType"
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

export function loadAllBankCards() {
  return server.REST.get("/session/allBankCard");
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

export function confirmationOfWithdrawalReceived(bci) {
  return server.REST.post("/session/withdraw/confirm", bci);
}

export function cancellationOfWithdrawalReceived(bci) {
  return server.REST.post("/session/withdraw/cancel", bci);
}

export function withdrawEntrance() {
  return server.REST.get("/session/withdraw/entrance/status");
}

export function withdrawRemainingRollover() {
  return server.REST.get("/session/member/remainingRolloverByType")
}

export function fetchWithdrawableBalance() {
  return server.REST.get("/session/withdraw/withdrawableBalance/refresh")
}

export function deleteBankCard(cardId) {
  return server.REST.post(`/session/bankCard/${cardId}?_method=delete`);
}

export function deleteBankCardByNumber(cardNo) {
  return server.REST.post(`/session/bankCardByCardNo/${cardNo}?_method=delete`);
}

export function sendEmail(emailInfo) {
  return server.REST.post("/otp/sendNewEmail", emailInfo);
}

export function verifyEmail(emailInfo) {
  return server.REST.post("/session/verifyAndUpdateEmail", emailInfo);
}

export function saveFinanceFeedback(reminderInfo) {
  return server.REST.post("/session/saveFinanceFeedback", reminderInfo);
}

export function getVerifyingFeedbackCount(data) {
  return server.REST.get("session/getVerifyingFeedbackCount", data);
}
export function sendSms(telephoneInfo) {
  return server.REST.post("/otp/sendSms", telephoneInfo);
}
export function sendSessionSms(telephoneInfo) {
  return server.REST.post("/session/sendSms", telephoneInfo);
}
export function verifySms(telephoneInfo) {
  return server.REST.post("/session/verifyAndUpdatePhone", telephoneInfo);
}

export const upgradeToAutoWithdrawal = () => {
  return server.REST.get("/session/updateAutoWithdraw");
};
