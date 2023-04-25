import { server } from "@/utils/request";

export function loadBalance(platform) {
  return server.REST.get("/session/balance?v=123", {
    params: {
      platform,
    },
  });
}

export function loadMemberInfo() {
  return server.REST.get("/session/member");
}

export function changePwd(oldPassword, password) {
  return server.REST.post("/session/password", { oldPassword, password });
}

const recordUrl = {
  deposit: "/session/member/deposit",
  transfer: "/session/member/transfer",
  turnover: "/session/member/moneyChange",
  withdraw: "/session/member/withdraw",
  rebates: "/session/member/privilege",
};

export function loadRecords(type, p) {
  return server.REST.get(recordUrl[type], { params: p });
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
