import { server } from "@/utils/request";
import { getDevice } from "@/utils/utils";

export function register(regForm) {
  const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
  regForm.regDevice = regDevice;
  return server.REST.post("/member/fbRegister", regForm);
}

export function login(loginInfo) {
  const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
  loginInfo.way = regDevice;
  return server.REST.post("/member/login", loginInfo);
}

export function mobileLogin(loginInfo) {
  const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
  loginInfo.way = regDevice;
  return server.REST.post("/member/mobileLogin", loginInfo);
}

export function logout() {
  return server.REST.post("/session/logout");
}

export function loadBankList() {
  return server.REST.options(`/session/withdraw/banks?siteId=7`);
}

export function registerWBankCard(regForm) {
  const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
  regForm.regDevice = regDevice;
  return server.REST.post("/member/register-with-bank-card", regForm);
}

export function getVerificationCode() {
  return server.REST.get("/member/verificationEasyCode");
}

export function memberAccessLog(log) {
  return server.REST.post("/memberAccessLog", log);
}
