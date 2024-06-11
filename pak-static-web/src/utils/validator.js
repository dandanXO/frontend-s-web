import { i18n } from "@/i18n";

const t = i18n.global.t;

export const validateLoginName = async (_, val) => {
  const regex = /^03/;
  if (!val) {
    return Promise.reject(t("common.form.loginName.error.required"));
  }
  if (val.length < 11) {
    return Promise.reject(t("common.form.loginName.error.len"));
  }
  if (!regex.test(val)) {
    return Promise.reject(t("common.form.loginName.error.pattern"));
  }
  return Promise.resolve();
};

export const validatePassword = async (_, val) => {
  if (!val) {
    return Promise.reject(t("common.form.password.error.required"));
  }
  if (val.length < 6) {
    return Promise.reject(t("common.form.password.error.min"));
  }
  return Promise.resolve();
};
