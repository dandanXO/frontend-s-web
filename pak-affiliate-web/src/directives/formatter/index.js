import moment from "moment";
import { formatMoney } from "@/utils/format-money";
import { useStore } from '@/store'

const store = useStore()

const getVipLevel = (vip) => {
  return vip.replace('VIP', '');
}

export const formatter = {
  beforeMount(el, binding) {
    if (binding.value.type === "date") {
      if (binding.value.data) {
        el.innerHTML = `<div class="textCenter">${moment(binding.value.data).subtract(3, 'hours').locale('en').format(binding.value.formatter || 'LLL')}</div>`;
      } else {
        el.innerHTML = "-";
      }
    } else if (binding.value.type === "money") {
      el.innerHTML = `<div class="money-wrapper">
                        <div>${formatMoney(binding.value.data, 0)}</div>
                        <div>PKR</div>
                      </div>`;
    } else if (binding.value.type === "p&l") {
      el.innerHTML = `<div class="textRight ${binding.value.data < 0 ? 'textRed' : binding.value.data > 0 ? 'textGreen' : ''}">${formatMoney(binding.value.data, 0)}</div>`;
    } else if (binding.value.type === "loginName") {
      el.innerHTML = `<div class="vip-name-wrapper">
                        ${binding.value.data.vip ? `<div class="vip-badge">${getVipLevel(binding.value.data.vip)}</div>` : ''}
                        <div class="login-name">${binding.value.data.loginName}</div>
                      </div>`;
    } else if (binding.value.type === "gameType") {
      el.innerHTML = `<div class="colorBox ${binding.value.data === 'SLOT' ? 'orange' : (binding.value.data === 'SPORT' || binding.value.data === 'ESPORT') ? 'purple' : 'blue'}">
                        ${binding.value.data}
                      </div>`;
    } else if (binding.value.type === "decimal") {
      el.innerHTML = `<div>${formatMoney(binding.value.data, 2)}</div>`;
    }
  },
  updated(el, binding) {
    if (binding.value.type === "date") {
      if (binding.value.data) {
        el.innerHTML = `<div class="textCenter">${moment(binding.value.data).subtract(3, 'hours').locale('en').format(binding.value.formatter || 'LLL')}</div>`;
      } else {
        el.innerHTML = "-";
      }
    } else if (binding.value.type === "money") {
      el.innerHTML =`<div class="money-wrapper">
                        <div>${formatMoney(binding.value.data, 0)}</div>
                        <div>PKR</div>
                      </div>`;
    } else if (binding.value.type === "p&l") {
      el.innerHTML = `<div class="textRight ${binding.value.data < 0 ? 'textRed' : binding.value.data > 0 ? 'textGreen' : ''}">${formatMoney(binding.value.data, 0)}</div>`;
    } else if (binding.value.type === "loginName") {
      el.innerHTML = `<div class="vip-name-wrapper">
                        ${binding.value.data.vip ? `<div class="vip-badge">${getVipLevel(binding.value.data.vip)}</div>` : ''}
                        <div class="login-name">${binding.value.data.loginName}</div>
                      </div>`;
    } else if (binding.value.type === "gameType") {
      el.innerHTML = `<div class="colorBox ${binding.value.data === 'SLOT' ? 'orange' : (binding.value.data === 'SPORT' || binding.value.data === 'ESPORT') ? 'purple' : 'blue'}">
                        ${binding.value.data}
                      </div>`;
    } else if (binding.value.type === "decimal") {
      el.innerHTML = `<div>${formatMoney(binding.value.data, 2)}</div>`;
    }
  }
};
