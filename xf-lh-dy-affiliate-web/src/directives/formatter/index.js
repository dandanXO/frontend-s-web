import moment from "moment";
import { formatMoney } from "@/utils/format-money";
import { useStore } from '@/store'

const store = useStore()
export const formatter = {
  beforeMount(el, binding) {
    if (binding.value.type === "date") {
      if (binding.value.data) {
        el.innerHTML = moment(binding.value.data).format(binding.value.formatter);
      } else {
        el.innerHTML = "";
      }
    } else if (binding.value.type === "money") {
      if (parseInt(store.state.user.siteId) === 10) {
        el.innerHTML = formatMoney(binding.value.data, 0);
      } else {
        el.innerHTML = formatMoney(binding.value.data, 2);
      }
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
      if (parseInt(store.state.user.siteId) === 10) {
        el.innerHTML = formatMoney(binding.value.data, 0);
      } else {
        el.innerHTML = formatMoney(binding.value.data, 2);
      }
    }
  }
};
