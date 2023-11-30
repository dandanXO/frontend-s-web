import moment from "moment";
import { formatMoney } from "@/utils/format-money";

export const formatter = {
  beforeMount(el, binding) {
    if (binding.value.type === "date") {
      if (binding.value.data) {
        el.innerHTML = moment(binding.value.data).format(binding.value.formatter);
      } else {
        el.innerHTML = "";
      }
    } else if (binding.value.type === "money") {
      el.innerHTML = formatMoney(binding.value.data, 2);
    }
  },
  updated(el, binding) {
    if (binding.value.type === "date") {
      if (binding.value.data) {
        el.innerHTML = moment(binding.value.data).format(binding.value.formatter);
      } else {
        el.innerHTML = "";
      }
    } else if (binding.value.type === "money") {
      el.innerHTML = formatMoney(binding.value.data, 2);
    }
  }
};
