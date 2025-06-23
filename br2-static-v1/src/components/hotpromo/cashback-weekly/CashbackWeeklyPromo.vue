<template>
  <div>
    <div class="bet-wrapper">
      <div class="bet-info">
        <img class="bet-info__icon" src="../../../assets/images/promotion/cashback-weekly/icon-cash.png" />
        <div class="bet-info-title">
          <span class="bet-info-title__current-cashback">
            {{ $t("hotPromo.cashbackWeekly.cashback", { num: currentCashbackRate }) }}
          </span>
          <span class="bet-info-title__max-cashback">
            {{ $t("hotPromo.cashbackWeekly.cashback", { num: currentCashbackRate }) }}
          </span>
        </div>
        <div class="bet-info-vip">
          <img class="bet-info-vip__icon" src="../../../assets/images/promotion/cashback-weekly/icon-crown.png" />
          <div class="bet-info-vip__vip-level">V{{ vipLevel }}</div>
        </div>
      </div>
      <div class="bet-progressbar">
        <div class="bet-progressbar__inner" :style="{ width: `${promoInfo.bonusPercentage * 100}%` }" />
      </div>
      <div class="bet-next-level">
        {{ $t("hotPromo.cashbackWeekly.upgradeDifference", { amount: promoInfo.totalLoss, vip: vipLevel }) }}
      </div>
    </div>

    <q-btn class="receive-earn-btn" no-caps @click="claimPromo()">
      <img src="../../../assets/images/promotion/receive-earn/receive-earn-icon.png" />
      &nbsp;&nbsp;{{ $t("hotPromo.receive") }}
    </q-btn>

    <div class="receive-bar-container">
      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-duration.svg" />
          {{ $t("hotPromo.duration") }}
        </div>
        <div class="bar-desc">{{ $t("hotPromo.longTerm") }}</div>
      </div>

      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-eligibility.svg" />
          {{ $t("hotPromo.eligibility") }}
        </div>
        <div class="bar-desc">{{ $t("hotPromo.successfulDepositMember") }}</div>
      </div>

      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-description.svg" />
          {{ $t("hotPromo.desc") }}
        </div>
        <div class="bar-desc">{{ $t("hotPromo.cashbackWeekly.description") }}</div>
      </div>
    </div>

    <div class="promo-subtitle">{{ $t("hotPromo.tnc") }}</div>

    <div class="tnc-content">
      <ol>
        <li v-for="index in 10" :key="index">
          {{ $t(`hotPromo.cashbackWeekly.tnc${`${index}`.padStart(2, "0")}`) }}
        </li>
      </ol>
    </div>
  </div>

  <q-dialog v-model="showPrizePopup" backdrop-filter="none">
    <q-btn icon="close" round dense v-close-popup class="money-rain-close" />
    <div class="congrats-wrapper">
      <div class="congrats-container">
        <div class="congrats-highlight">+ {{ $t("hotPromo.rs") }}{{ prizeAmount }}</div>
        <div class="congrats-txt">{{ $t("hotPromo.youGet") }} {{ $t("hotPromo.rs") }}{{ prizeAmount }}</div>

        <div class="congrats-btns">
          <q-btn flat no-caps :loading="false" @click="showPrizePopup = false" class="btn-cancel">
            {{ $t("btn.cancel") }}
          </q-btn>

          <q-btn flat no-caps :loading="false" @click="showPrizePopup = false" class="btn-confirm">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { userStore } from "src/stores";
import { computed, ref, onMounted } from "vue";
import { api, eventapi } from "boot/axios";

const store = userStore();

const currentCashbackRate = ref(12);
const maximumCashbackRate = ref(25);
const currentBet = ref(500);
const nextLevelBet = ref(1000);

const vipLevel = computed(() => store.vip.replace("VIP", ""));
const remainingBet = computed(() => nextLevelBet.value - currentBet.value);

const promoInfo = ref([]);
const loadPromoInit = () => {
  eventapi
    .get("/session/loss-bonus/init?promoCode=br2-weekly-loss-cashback")
    .then((res) => {
      // debugger;
      if (res.code === 0) {
        const { data } = res;
        promoInfo.value = data;
      }
    })
    .catch((e) => {});
};

const claimPromo = () => {
  eventapi
    .post("/session/loss-bonus/claim?promoCode=br2-weekly-loss-cashback")
    .then((res) => {
      // debugger;
      if (res.code === 0) {
        showPrizePopup.value = true;
        prizeAmount.value = res.data;
      }
    })
    .catch((e) => {});
};

const showPrizePopup = ref(false);
const prizeAmount = ref();

onMounted(() => {
  loadPromoInit();
});
</script>
<style lang="scss" scoped>
.bet-wrapper {
  position: relative;
  padding: 15px 34px 40px;
  margin: 4px 0 16px;
  background: #1d1e22;
  border: 1px solid #4b4943;
  border-radius: 4px;

  .bet-info {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;

    .bet-info__icon {
      max-width: 44px;
    }
    .bet-info-title {
      display: flex;
      flex-direction: column;
      font-weight: 500;

      .bet-info-title__current-cashback {
        font-size: 22px;
        color: #00fd7c;
      }

      .bet-info-title__max-cashback {
        font-size: 10px;
        color: #fff;
      }
    }
    .bet-info-vip {
      display: flex;
      align-items: center;
      align-self: center;
      .bet-info-vip__icon {
        max-width: 20px;
        margin-right: 4px;
      }
      .bet-info-vip__vip-level {
        background: #1ead72;
        border-radius: 4px;
        padding: 0 4px;
        font-size: 15px;
        line-height: 1.5;
        color: #fff;
        text-shadow: 0px 1px 0px #00000040;
      }
    }
  }

  .bet-progressbar {
    --bet-progressbar-border-radius: 10px;
    --bet-progressbar-height: 3px;
    position: relative;
    height: var(--bet-progressbar-height);
    background: #ffffff1a;
    border-radius: var(--bet-progressbar-border-radius);
    overflow: hidden;

    .bet-progressbar__inner {
      height: var(--bet-progressbar-height);
      border-radius: var(--bet-progressbar-border-radius);
      background-color: #fff;
      transition: width 0.3s ease-in-out;
    }
  }

  .bet-next-level {
    position: absolute;
    right: 34px;
    bottom: 10px;
    font-size: 10px;
    font-weight: 500;
    color: #fff;
  }
}

.receive-earn-btn {
  background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
  width: 100%;
  color: #2d2d2d;
  font-weight: bold;

  img {
    width: 34px !important;
  }
}

.receive-bar-container {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .receive-bar {
    background: #1f241f;
    border: 1px solid #4b4943;
    padding: 48px 12px 8px;
    position: relative;
    border-radius: 6px;

    .bar-ribbon {
      background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
      display: inline-flex;
      padding: 8px;
      height: 34px;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      color: #2d2d2d;
      font-weight: bold;
      align-items: center;
      position: absolute;
      top: 12px;
      left: 0;
      img {
        display: block;
        margin-right: 8px;
      }
    }

    .bar-desc {
      padding: 8px;
    }
  }
}

.promo-subtitle {
  // padding: 0 24px;
  margin-top: 24px;
  text-transform: uppercase;
  font-weight: 900;
  color: #ffffff;
  font-size: 18px;
  line-height: 1;
  font-style: italic;
  text-align: center;
  position: relative;
  display: flex;
  justify-content: center;

  &:before {
    content: "";
    background: url(../../../assets/images/promotion/receive-earn/promo-subtitle-icon.png);
    width: 25px;
    height: 9px;
    display: block;
    background-size: 100% 100%;
    margin-right: 8px;
    margin-top: 4px;
  }

  &:after {
    content: "";
    background: url(../../../assets/images/promotion/receive-earn/promo-subtitle-icon.png);
    width: 25px;
    height: 9px;
    display: block;
    background-size: 100% 100%;
    transform: scaleX(-1);
    margin-left: 8px;
    margin-top: 4px;
  }
}

.tnc-content {
  ol li {
    margin-bottom: 8px !important;
  }

  ol {
    padding-left: 24px !important;
  }
}

.congrats-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  // background: url(../../assets/images/index/money-rain/congrats-bg.png) no-repeat top center;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  background-size: contain;
  flex-direction: column;
  gap: 20px;
  // padding-top: 100px;
}
.congrats-head {
  margin-top: -100px;
  font-family: "Poppins";
  font-weight: 900;
  font-size: 2.4rem;
  line-height: 3.4rem;
  max-width: 300px;
  letter-spacing: 0px;
  text-align: center;
  color: #ffd288;
}
.congrats-container {
  position: relative;
  background: url(../../../assets/images/promotion/receive-earn/congrats-modal.png) no-repeat center center;
  background-size: contain;
  width: 100%;
  height: 470px;
  .congrats-highlight {
    font-family: "Poppins";
    font-weight: 700;
    font-size: 3rem;
    line-height: 100%;
    letter-spacing: 0px;
    text-align: center;
    color: #10d16f;
    margin-top: 280px;
  }

  .congrats-txt {
    font-family: "Poppins";
    font-weight: 700;
    font-size: 1rem;
    line-height: 100%;
    letter-spacing: 0px;
    text-align: center;
    color: #2d2d2d;
    margin-top: 20px;
  }
  .congrats-button {
    position: absolute;
    bottom: 11.5%;
    left: 0;
    right: 0;
    margin: auto;
    font-family: Poppins;
    font-weight: 700;
    font-size: 26.48px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    color: #ffffff;
  }

  .congrats-btns {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 40px;
    .btn-cancel {
      border: 1px solid #10d16f;
      color: #2d2d2d;
    }
    .btn-confirm {
      background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
      color: #ffffff;
    }
  }
}
</style>
