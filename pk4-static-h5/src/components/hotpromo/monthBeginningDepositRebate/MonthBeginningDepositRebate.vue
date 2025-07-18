<template>
  <div>
    <img
      class="promo-banner-img"
      src="./../../../assets/images/promotion/hotpromo/month-beginning-deposit-rebate/promo-banner.png"
    />
    <div class="vip-progress">
      <div class="bar-wrapper">
        <div class="percentage" :style="{ left: percent + '%' }">
          {{ percent }}%
          <span class="triangle"></span>
        </div>
        <div class="bar-border">
          <div class="bar">
            <div class="bar-img-fill" :style="{ width: percent + '%' }">
              <img
                src="./../../../assets/images/promotion/hotpromo/month-beginning-deposit-rebate/progress-bar-fill.png"
                alt="progress fill"
                class="bar-img-fill"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="vip-labels">
        <!-- <span class="label">VIP1</span>
        <span class="label">VIP2</span> -->
          {{ totalDeposit + '/' + minDeposit }}
      </div>
    </div>
    <div class="receive-btn" @click="claimApi">{{ $t("hotPromo.monthBeginningDepositRebate.receive") }}</div>
    <div class="rebate-table-container">
      <div class="big-rebate-title-container">
        <img src="./../../../assets/images/promotion/hotpromo/month-beginning-deposit-rebate/title-bg.png" />
        <div>{{ $t("hotPromo.monthBeginningDepositRebate.bigRebate") }}</div>
      </div>

      <table class="rebate-table">
        <thead>
          <tr>
            <th align="center">{{ $t("hotPromo.monthBeginningDepositRebate.vipLevel") }}</th>
            <th align="center">{{ $t("hotPromo.monthBeginningDepositRebate.rebate") }}</th>
            <th align="center">{{ $t("hotPromo.monthBeginningDepositRebate.runningWater") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>VIP1-VIP2</td>
            <td><span style="color: #ff9500">1%</span></td>
            <td rowspan="6">X2</td>
          </tr>
          <tr>
            <td>VIP3-VIP4</td>
            <td><span style="color: #3dd3f0">2%</span></td>
          </tr>
          <tr>
            <td>VIP5-VIP6</td>
            <td><span style="color: #e3d730">2%</span></td>
          </tr>
          <tr>
            <td>VIP7-VIP8</td>
            <td>4%</td>
          </tr>
          <tr>
            <td>VIP9-VIP10</td>
            <td>5%</td>
          </tr>
          <tr>
            <td>VIP11-VIP12</td>
            <td>6%</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "src/stores";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const props= defineProps(["promocode"])


const $q = useQuasar();
const { t } = useI18n();
const store= userStore()
const totalDeposit = ref(0);
const minDeposit = ref(0);
const progress= ref(0);
const rebate= ref(0)

const percent = ref(0);
const vipDepositCount = ref({
  "vip0" : 0,
  "vip1" : 1000,
  "vip2" : 3000,
  "vip3" : 5000,
  "vip4" : 10000,
  "vip5" : 30000,
  "vip6" : 50000,
  "vip7" : 100000,
  "vip8" : 300000,
  "vip9" : 500000,
  "vip10" : 1000000,
  "vip11" : 3000000,
  "vip12" : 5000000,
});

const claimApi = () => {
  eventapi.post(`/session/month-beginning-deposit-rebate/claim-rebate?promoCode=${props.promocode}`).then((res) => {
    if (res.code === 0) {
      $q.notify({
        message: t("header.sucessClaimed") + res.data,
        color: "positive",
        position: "top",
        timeout: 2000
      });
    } else {
      $q.notify({
        message: res.message || "Error",
        color: "negative",
        position: "top",
        timeout: 2000
      });
    }
  });
};

const initApi = () => {
  eventapi.get(`/session/month-beginning-deposit-rebate/calculate-rebate?promoCode=${props.promocode}`).then((res) => {
    if (res.code === 0) {
      totalDeposit.value = res.data.totalDeposit;
      minDeposit.value = res.data.minDeposit;

      if (store.vip === "VIP0") {
        percent.value = 0;
      } else {
        if (res.data.progress > 1) {
          percent.value = 100;
        } else {
          percent.value = res.data.progress * 100;
        }
      }
    }
  });
}


onMounted(() => {
  initApi();
});
</script>

<style lang="scss" scoped>
.promo-banner-img {
  place-self: center;
}
.receive-btn {
  background: linear-gradient(90deg, #0287f2 0%, #0664d2 100%);
  width: fit-content;
  padding: 12px;
  border-radius: 4px;
  font-family: Poppins;
  font-weight: 600;
  place-self: center;
  font-size: 14px;
  margin-top: 30px;

  &:active{
    filter: brightness(90%);
  }
}
.rebate-table-container {
  position: relative;
  display: flex;
  justify-content: center;
  // margin: 28px 0;
  
    margin: 28px 20px 0;

  .big-rebate-title-container {
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    img {
      height: 34px;
      width: auto !important;
      margin-bottom: 0 !important;
    }

    div {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      white-space: nowrap;
      z-index: 1;
      color: white;
      font-weight: bold;
    }
  }
  .rebate-table {
    font-size: 14px;
    th {
      background: #121829 !important;
      border: 1px solid #2e3039;
      padding: 40px 0 10px 0 !important;
      color: #ffffff80;
    }
    td {
      background-color: #121829 !important;
      font-weight: 700;
      padding: 10px 5px !important;
    }
  }
}

.rule-title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Poppins;
  font-weight: 700;
  font-size: 1.25rem;
  
    margin: 0 20px;
  img {
    width: 25% !important;
    margin-bottom: 10px !important;
  }
  div {
    width: 50% !important;
    background: linear-gradient(90deg, #0287f2 0%, #0664d2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }
}
.rule_list {
  // margin-top: 20px !important;
  margin: 20px 20px 0 !important;
}

.vip-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: sans-serif;
  // margin-top: 36px;
  margin: 36px 25px 0 25px;

  .bar-wrapper {
    position: relative;
    height: 26px;

    .percentage {
      position: absolute;
      top: -35px;
      transform: translateX(-50%);
      background: #0666d3;
      color: #fff;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;

      .triangle {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #0666d3;
      }
    }

    .bar-border {
      height: 100%;
      border-radius: 999px;
      padding: 3px;
      background: linear-gradient(
        47.73deg,
        #21c9ec 9.9%,
        #176ec9 20.93%,
        #21c9ec 47.13%,
        #ffffff 61.38%,
        #176ec9 86.2%,
        #21c9ec 101.83%
      );
    }

    .bar {
      height: 100%;
      width: 100%;
      background: #000b30;
      border-radius: 999px;
      overflow: hidden;
      position: relative;

      .bar-img-fill {
        height: 100%;
        object-fit: cover;
        border-radius: 999px 0 0 999px;
        display: block;
        transition: width 0.3s ease;
      }
    }
  }

  .vip-labels {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 3px;

    .label {
      width: auto;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
