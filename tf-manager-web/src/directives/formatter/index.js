import moment from "moment";
import { formatMoney } from "@/utils/format-money";
import { formatTimeZone } from "@/utils/format-timeZone";

export const formatter = {
  beforeMount(el, binding) {
    if (binding.value.type === "date") {
      if (binding.value.data) {
        if (binding.value.formatter) {
          el.innerHTML = moment(binding.value.data).format(binding.value.formatter);
        } else {
          el.innerHTML = formatTimeZone(binding.value.data, binding.value.timeZone);
        }
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
        if (binding.value.formatter) {
          el.innerHTML = moment(binding.value.data).format(binding.value.formatter);
        } else {
          el.innerHTML = formatTimeZone(binding.value.data, binding.value.timeZone);
        }
      } else {
        el.innerHTML = "";
      }
    } else if (binding.value.type === "money") {
      el.innerHTML = formatMoney(binding.value.data, 2);
    }
  }
};
