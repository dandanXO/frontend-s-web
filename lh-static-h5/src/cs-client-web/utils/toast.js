import { Notify } from "quasar";

const toast = {
  info(content, options = {}) {
    Notify.create({ type: "info", message: content, ...options });
  },
  success(content, options = {}) {
    Notify.create({ type: "positive", message: content, ...options });
  },
  warning(content, options = {}) {
    Notify.create({ type: "warning", message: content, ...options });
  },
  error(content, options = {}) {
    Notify.create({ type: "negative", message: content, ...options });
  },
};

export default toast;
