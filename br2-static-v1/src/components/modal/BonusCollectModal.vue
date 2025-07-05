<template>
  <q-dialog class="isCentreDialog" v-model="isBonusCollectModal" no-backdrop-dismiss no-esc-dismiss>
    <div class="bonus-collect-dialog-container">
      <div class="bonus-collect-board">
        <div class="close-click-icon" @click="closePopup">&nbsp;</div>
        <img class="bonus-collect-content-img" src="../../assets/images/index/bonus-collect/bonus-collect-img.png" />
      </div>

      <div class="bonus-collect-frame">
        <!-- bonus-collect-frame -->
        <div class="bonus-collect-title">
          <img src="../../assets/images/index/bonus-collect/bonus-collect-title.png" alt="" />
        </div>

        <div class="bonus-collect-inner">
          <div class="inner-row">
            <div class="col-icon">
              <img src="../../assets/images/index/bonus-collect/icon-checkin.svg" alt="" />
            </div>
            <div class="col-desc">
              Check-in e divida
              <span>Complete the sign-in get R$588</span>
            </div>
            <div class="col-status">
              <template v-if="checkedInDays.indexOf(currentDay) > -1">
                <img src="../../assets/images/index/bonus-collect/status-ticked.png" alt="" class="status-ticked" />
              </template>
              <template v-else>
                <q-btn class="collect-btn" no-caps @click="gotoCheckin()">Entrar</q-btn>
              </template>
            </div>
          </div>

          <div class="inner-row">
            <div class="col-icon">
              <img src="../../assets/images/index/bonus-collect/icon-firstdeposit.svg" alt="" />
            </div>
            <div class="col-desc">
              no 1º depósito
              <span>Deposit get 100% CASHBACK</span>
            </div>
            <div class="col-status">
              <template v-if="hasClaimed">
                <img src="../../assets/images/index/bonus-collect/status-ticked.png" alt="" class="status-ticked" />
              </template>
              <template v-else>
                <q-btn class="collect-btn" no-caps @click="gotoDepositPage()">Depósito</q-btn>
              </template>
            </div>
          </div>

          <div class="inner-row">
            <div class="col-icon">
              <img src="../../assets/images/index/bonus-collect/icon-redeposit.svg" alt="" />
            </div>
            <div class="col-desc">
              Recarregue
              <span>Deposit get R$288</span>
            </div>
            <div class="col-status">
              <q-btn class="collect-btn" no-caps @click="gotoDepositPage()">Depósito</q-btn>
            </div>
          </div>

          <div class="inner-row">
            <div class="col-icon">
              <img src="../../assets/images/index/bonus-collect/icon-reimbursement.svg" alt="" />
            </div>
            <div class="col-desc">
              Reembolso
              <span>R${{convertToCommaAmount(betRebateAmount, true)}}</span>
            </div>
            <div class="col-status">
              <img src="../../assets/images/index/bonus-collect/status-ticked.png" alt="" class="status-ticked" />
            </div>
          </div>

          <div class="inner-row">
            <div class="col-icon">
              <img src="../../assets/images/index/bonus-collect/icon-dailycashback.svg" alt="" />
            </div>
            <div class="col-desc">
              Cashback diário
              <span>R${{convertToCommaAmount(lossRebateAmount, true)}}</span>
            </div>
            <div class="col-status">
              <img src="../../assets/images/index/bonus-collect/status-ticked.png" alt="" class="status-ticked" />
            </div>
          </div>
        </div>
        <q-btn
          dense
          flat
          rounded
          icon="close"
          class="bg-transparent text-white collect-bonus-close"
          @click="closePopup()"
        />
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { convertToCommaAmount } from "boot/utils";
import { computed, onMounted, ref } from "vue";
import { useUI } from "stores/ui";
import { useRoute, useRouter } from "vue-router";
import { SessionStorage } from "quasar";
import { api, eventapi } from "boot/axios";
import { userStore } from "stores/index";

const route = useRoute();
const router = useRouter();
const uiStore = useUI();
const props = defineProps(["detail", "modelValue"]);
const emit = defineEmits(["update:modelValue", "closeDialog"]);
const store = userStore();

const lossRebateAmount = ref(0);
const betRebateAmount= ref(0);

const closePopup = () => {
  emit("closeDialog");
  SessionStorage.remove("IS_COLLECTBONUS_POPUP");
};

const isBonusCollectModal = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
});

const goLogin = () => {
  uiStore.loginView = "login";
};

const gotoDepositPage = () => {
  router.push("/deposit");
  SessionStorage.remove("IS_COLLECTBONUS_POPUP");
};

const gotoCheckin = () => {
  router.push("/promo?name=br2-checkin-bonus");
  SessionStorage.remove("IS_COLLECTBONUS_POPUP");
};

const currentDay = ref("");
const checkedInDays= ref([])
const loadCycleCheckIn = () => {
  eventapi
    .get("/session/cycle-check-in?promoCode=br2-daily-check-in")
    .then((res) => {
      if (res.code === 0) {
        currentDay.value = res.data.currentDay;
        checkedInDays.value= res.data.checkedInDays;
      }
    })
    .catch((e) => {});
};

const hasClaimed = ref(false);
const loadCheckHasClaimed = () => {
  eventapi
    .get("/session/common-promo/check-has-claimed?promoCode=br2-ftd-bonus")
    .then((res) => {
      if (res.code === 0) {
        // currentDay.value = res.data.currentDay;
        hasClaimed.value = res.data;
        console.log(res.data);
      }
    })
    .catch((e) => {});
};

const loadRebateAndCashback = () => {
  api
    .get(
      "/session/member/rebateAndCashback?betRebatePromoCode=br2-daily-bet-rebate&lossRebatePromoCode=br2-loss-rebate"
    )
    .then((res) => {
      if (res.code === 0) {
        console.log(res.data);
        betRebateAmount.value= res.data.betRebateAmount;
        lossRebateAmount.value = res.data.lossRebateAmount;
      }
    })
    .catch((e) => {});
};

onMounted(() => {
  if (store.token) {
    loadCycleCheckIn();
    loadCheckHasClaimed();
    loadRebateAndCashback();
  }
});
</script>

<style scoped lang="scss">
.bonus-collect-dialog-container {
  padding: 20px 0;
  background-color: #000000cc;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: none !important;
  position: relative;
  > img {
    width: 50%;
    @media (min-width: 400px) {
      width: 40%;
    }
  }
  .bonus-collect-content-img {
    width: 100%;
    @media (min-width: 400px) {
      width: 90%;
    }
  }

  .bonus-collect-board {
    position: relative;
    width: 75%;
    margin: -20% auto 0;
    text-align: center;

    .close-click-icon {
      position: absolute;
      z-index: 88;
      right: 10%;
      top: 10%;
      width: 60px;
      height: 60px;
      background: transparent;
    }
  }

  .bonus-title {
    margin-bottom: 20px;
  }
  .cashback-row {
    display: flex;
    font-family: Poppins;
    align-items: center;
    padding: 0 10px;
    .label {
      font-size: 1rem;
      color: #feb300;
      @media (max-width: 400px) {
        font-size: 0.9rem;
      }
    }
    .amount {
      display: inline-block;
      font-size: 1.3rem;
      font-weight: bolder;
      background: linear-gradient(180deg, #ffa200 18.32%, #ff7700 77.61%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      -webkit-text-stroke: 0.6px #ffffff;
      // text-shadow: 0px 0.1px 0.1px rgba(123, 62, 0, 0.96);
      @media (max-width: 400px) {
        font-size: 1.2rem;
      }
    }
    .status {
      font-size: 1.1rem;
      margin-left: 6px;
      @media (max-width: 400px) {
        font-size: 1rem;
      }
      &.sent {
        color: #41eb93;
      }
      &.processing {
        color: #2eecff;
      }
    }
  }
  .confirm-btn {
    margin-top: 10px;
    background-image: url(data:image/png;base64,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);
    background-size: contain;
    background-repeat: no-repeat;
    width: 30%;
    aspect-ratio: 3 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 30px 14px;
    font-size: 1.4rem;
    font-family: Poppins;
    font-weight: 700;
    line-height: 100%;
    letter-spacing: 0px;
    text-align: center;
    text-shadow: -1px -1px 0 #014997, 1px -1px 0 #014997, -1px 1px 0 #014997, 1px 1px 0 #014997;

    &:active {
      filter: brightness(0.9);
      transform: translate(0px, 1px);
    }
  }
}

.bonus-collect-frame {
  background-image: url(../../assets/images/index/bonus-collect/bonus-collect-frame.png);
  background-size: 100% auto;
  background-position: top center;
  background-repeat: no-repeat;
  width: 90%;
  height: 100%;
  // max-height: calc(100% - 25%);
  max-height: 400px;
  position: relative;
  margin-top: -25%;

  .bonus-collect-title {
    display: flex;
    justify-content: center;
    margin-top: -16px;
    position: relative;

    img {
      display: block;
      width: 100%;
      max-width: 200px;
    }
  }

  .bonus-collect-inner {
    display: flex;
    background: #ffffff;
    height: 100%;
    border-radius: 16px;
    margin-top: 10px;
    color: #333333;
    flex-direction: column;
    align-items: center;
    padding-top: 16px;
    gap: 16px;
    justify-content: space-between;
    padding-bottom: 16px;

    .inner-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      width: 90%;
      // margin: auto;
      align-items: center;

      .col-icon {
        img {
          display: block;
          width: 36px;
          height: 36px;
        }
      }
      .col-desc {
        color: #333333;
        text-transform: uppercase;
        font-weight: 600;
        width: 100%;

        span {
          text-transform: none;
          font-size: 10px;
          color: #ff7c00;
          display: block;
          font-weight: normal;
        }
      }
      .col-status {
        min-width: 80px;
        display: flex;
        justify-content: center;
        // height:80px;
        .collect-btn {
          background: linear-gradient(180deg, #4dfda3 0%, #12d371 100%);
          border-radius: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          height: 27px;
          font-weight: bold;
          width: 100%;
        }

        .status-reimbursement {
          display: block;
          width: 32px;
        }
        .status-dailycashback {
          display: block;
          width: 72px;
        }
        .status-ticked {
          display: block;
          width: 32px;
        }
      }
    }
  }
}

.collect-bonus-close {
  position: absolute;
  top: 6px;
  right: 6px;
}
</style>
