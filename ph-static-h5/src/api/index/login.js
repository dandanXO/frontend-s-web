import { api } from "src/boot/axios";
import { getDevice } from "src/boot/utils";

export function register(regForm) {
  const regDevice = getDevice();
  regForm.regDevice = regDevice;
  return api.post("/member/register", regForm);
}

export function login(loginInfo) {
  const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
  loginInfo.way = regDevice;
  return api.post("/member/login", loginInfo);
}

export function logout() {
  return api.post("/session/logout");
}

export function getVerificationCode() {
  return api.get("/member/verificationCode");
}
