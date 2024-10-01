import { api } from "src/boot/axios";
import axios from "axios"

export function loadBalance(platform) {
  return api.get("/session/balance?v=123", {
    params: { platform },
  });
}

export function loadMemberInfo() {
  return api.get("/session/member");
}

export function changePwd(oldPassword, password) {
  return api.post("/session/password", { oldPassword, password });
}

const recordUrl = {
  deposit: "/session/member/deposit",
  transfer: "/session/member/transfer",
  turnover: "/session/member/moneyChange",
  withdraw: "/session/member/withdraw",
  rebates: "/session/member/privilege",
};

export function loadRecords(type, p) {
  return api.get(recordUrl[type], { params: p });
}

export function loadCurrency() {
  return api.get("/session/withdraw/currency");
}

export function loadBanks(currencyId) {
  return api.get("/session/withdraw/card", { params: { currencyId } });
}

export function loadBankCards() {
  return api.get("/session/bankCard");
}

export function addBankCard(bci) {
  return api.post("/session/bankCard", bci);
}

export function confirmWithdraw(bci) {
  return api.post("/session/withdraw/", bci);
}

export function withdrawEntrance() {
  return api.get("/session/withdraw/entrance");
}

export function deleteBankCard(cardId) {
  return api.post(`/session/bankCard/${cardId}?_method=delete`);
}

export const verifyID = (formData, token) => {
  // const requestOptions = {
  //   method: "POST",
  //   body: formData
  // for (var [key, value] of formData.entries()) {
  //   console.log(key, value);
  // }
  const restUrl = localStorage.getItem("P2W_H5_URL_RST") ?? process.env.RST_API;
  return axios.post( restUrl +"/session/idVerify", formData, {
    headers: {
      "Content-Type": `multipart/form-data`,
      "TOKEN": token,
      "Authorization": 'PHB'
    },
  });
};

