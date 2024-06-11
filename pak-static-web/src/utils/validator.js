import { i18n } from "@/i18n";

const t = i18n.global.t;

export const validateLoginName = async (_, val) => {
  const regex = /^03/;
  if (!val) {
    return Promise.reject(t("common.validator.loginName.required"));
  }
  if (val.length < 11) {
    return Promise.reject(t("common.validator.loginName.len"));
  }
  if (!regex.test(val)) {
    return Promise.reject(t("common.validator.loginName.pattern"));
  }
  return Promise.resolve();
};
