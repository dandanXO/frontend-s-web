<template>
  <div class="container">
    <div class="sign-in-7days-container">
      <div class="container-title">
        {{ $t("hotPromo.signIn7Days.continuousSignIn") }}
        <span>{{ todayDay }}{{ $t("hotPromo.signIn7Days.days") }}</span>
      </div>

      <div class="wrap-checkin">
        <div class="container-checkin">
          <div class="checkin-item" v-for="item in checkInDayHistory" :key="item">
            <template v-if="item.rewardState === 'CLAIMED'">
              <div class="checkin-coin">
                <img src="./../../../assets/images/promotion/hotpromo/signin-7days/checkin-tick.png" />
              </div>
            </template>
            <template v-else-if="item.rewardState === 'EXPIRED'">
              <div class="checkin-coin expired-coin">
                <img src="./../../../assets/images/promotion/hotpromo/signin-7days/checkin-coin.png" />
              </div>
              <div class="checkin-txt">{{ item.day }}{{ $t("hotPromo.signIn7Days.day") }}</div>
              <span class="expired-txt">{{ $t("hotPromo.signIn7Days.expired") }}</span>
            </template>
            <template v-else>
              <div class="checkin-coin">
                <img src="./../../../assets/images/promotion/hotpromo/signin-7days/checkin-coin.png" />
              </div>
              <div class="checkin-txt">{{ item.day }}{{ $t("hotPromo.signIn7Days.day") }}</div>
            </template>
          </div>
        </div>

        <template v-if="todayCheckInState === 'YES'">
          <div class="btn-checkin-wrap" @click="checkInClaim()">
            <div class="btn-checkin">
              <template v-if="btn_loading"><a-spin /></template>
              <template v-else>
                <div><img src="./../../../assets/images/promotion/hotpromo/signin-7days/btn-checkin-icon.png" /></div>
                {{ $t("hotPromo.signIn7Days.signIn") }}
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="btn-checkin-wrap checked">
            <div class="btn-checkin">{{ $t("hotPromo.signIn7Days.signedIn") }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>

  <el-dialog v-model="showPrizePopup" backdrop-filter="none">
    <div class="prize-popup">
      <q-btn icon="close" flat round dense v-close-popup class="q-ml-auto" />
      <div class="prize-gold">
        <img src="./../../../assets/images/promotion/hotpromo/signin-7days/prize-gold.png" width="150" />
      </div>

      <div class="prize-amount">Rs {{ bonusAmount }}</div>

      <button no-caps unelevated class="btn-primary confirm-modal-action confirm" @click="showPrizePopup = false">
        {{ $t("common.confirmModal.confirmButton") }}
      </button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { getNewRegcheckInInit, claimNewRegCheckIn } from "../../../api/index/promo";
const showPrizePopup = ref(false);

const days7 = ref([]);
const todayDay = ref();
const todayCheckInState = ref();
const checkInDayHistory = ref([]);
const bonusAmount = ref();

const getCheckInDayHistory = () => {
  initDays7();
};

const initDays7 = () => {
  getNewRegcheckInInit().then((res) => {
    if (res.code == 0) {
      days7.value = res.data;
      todayDay.value = res.data.todayDay;
      todayCheckInState.value = res.data.todayCheckInState;
      checkInDayHistory.value = res.data.checkInDayHistory;
    }
  });
};

const btn_loading = ref(false);

const checkInClaim = () => {
  btn_loading.value = true;
  claimNewRegCheckIn().then((res) => {
    if (res.code == 0) {
      showPrizePopup.value = true;
      todayDay.value = res.data.todayDay;
      todayCheckInState.value = res.data.todayCheckInState;
      checkInDayHistory.value = res.data.checkInDayHistory;
      bonusAmount.value = res.data.bonusAmount;

      btn_loading.value = false;
    }
  });
};

onMounted(() => {
  getCheckInDayHistory();
});
</script>

<style lang="scss">
.prize-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden !important;
}

.prize-gold {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #c7c7c7;
}

.prize-amount {
  font-size: 38px;
  color: #ffffff;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 20px;
}

.sign-in-7days-container {
  background: #1f1f1f;
  padding: 16px;
  margin-top: 40px;
  border-radius: 12px;

  .container-title {
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
    position: relative;

    span {
      color: #ffffff;
    }

    .title-img {
      position: absolute;
      top: -80px;
      right: 0;
      width: 120px;
    }
  }

  .wrap-checkin {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .container-checkin {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(7, 1fr);
    row-gap: 16px;
    column-gap: 16px;
    margin-top: 16px;
    .checkin-item {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      height: 70px;
      max-width: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;

      .checkin-coin {
        &.expired-coin {
          filter: grayscale(100%);
        }
        img {
          display: block;
          width: 36px !important;
        }
      }

      .checkin-txt {
        font-size: 12px;
        color: #9f9f9f;
      }

      .expired-txt {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-30deg);
        color: #db0011;
      }
    }
  }

  .btn-checkin-wrap {
    width: 200px;
    margin-top: 20px;
    background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
    padding: 2px;
    border-radius: 8px;
    height: 46px;
    cursor: pointer;

    &.checked {
      background: rgba(255, 255, 255, 0.05);
      .btn-checkin {
        color: #999999;
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }
  .btn-checkin {
    background: #1f1f1f;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 42px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    color: #70bc62;
    text-transform: uppercase;
    line-height: 1;
    gap: 12px;

    img {
      display: block;
      width: 14px;
      margin: 0 !important;
    }
  }
}

.confirm-modal-action {
  padding: 11px 12px;
  border-radius: 4px;
  background: transparent;
  flex: 1;
  font-size: 16px;
  line-height: 20.92px;
  text-align: center;

  &.confirm {
    background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
    color: #000a01;
  }

  &.cancel {
    color: #ffffff;
    position: relative;

    &::after {
      position: absolute;
      content: "";
      inset: 0;
      padding: 1px;
      border-radius: 4px;
      background: linear-gradient(180deg, #13a89e 0%, #8cc63f 100%);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
      pointer-events: none;
    }
  }
}
</style>
