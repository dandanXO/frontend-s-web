import { api } from "boot/axios";
import { Platform } from "quasar";

export const getCodeDetail = async () => {
  const json = {
    isOk: false,
    codeId: "",
    verificationImg: "",
    message: ""
  };

  try {
    const res = await api.get("/member/verificationCode");

    if (res?.code === 0) {
      json.isOk = true;
      json.codeId = res.data.id;
      json.verificationImg = `data:image/png;base64,${res.data.img}`;
    }
  } catch (e) {
    json.message = e.message;
  }

  return json;
};

export function isAndroid() {
  if (Platform.is.android && Platform.is.capacitor) {
    return true;
  } else {
    return false;
  }
}

export const getStorage = () => (Platform.is.android && Platform.is.capacitor ? localStorage : sessionStorage);

export function charType(num) {
  if (num >= 48 && num <= 57) {
    return 1;
  }
  if (num >= 97 && num <= 122) {
    return 2;
  }
  if (num >= 65 && num <= 90) {
    return 4;
  }
  return 8;
}
