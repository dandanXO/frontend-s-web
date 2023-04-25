import { server } from "@/utils/request";
import { getDevice } from "@/utils/utils";

export function register(regForm) {
  const regDevice = getDevice();
  regForm.regDevice = regDevice;
  return server.REST.post("/member/register", regForm);
}

export function login(loginInfo) {
  const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
  loginInfo.way = regDevice;
  return server.REST.post("/member/login", loginInfo);
}

export function logout() {
  return server.REST.post("/session/logout");
}

export function getVerificationCode() {
  return server.REST.get("/member/verificationCode");
}
