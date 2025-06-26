<template>
  <img
    class="promo-banner-img"
    src="./../../../assets/images/promotion/hotpromo/piggy-bank/promo-banner.png"
  />
  <div class="piggy-bank-promo-wrapper">
    <div class="piggy-bank-claim-wrapper">
      <img
        class="piggy-bank-claim-title piggy-bank-claim-item"
        src="../../../assets/images/promotion/hotpromo/piggy-bank/text-cash-back-white.png"
      />
      <span class="piggy-bank-claim-item">Total</span>
      <div class="piggy-bank-linear-bg-text piggy-bank-claim-item">
        <div class="piggy-bank-linear-bg-text__text">Rs {{ cashbackGet }}</div>
      </div>
      <div class="piggy-bank-claim-prize">
        <img
          class="piggy-bank-claim-prize-icon"
          src="../../../assets/images/promotion/hotpromo/piggy-bank/icon-cash.png"
        />
        CASH：Rs{{yesterdayLoss}}
      </div>
      <q-btn class="piggy-bank-claim-btn" @click="claimApi">Receive</q-btn>
    </div>

    <q-dialog v-model="showClaimDialog" persistent>
      <div class="piggy-bank-dialog-wrapper">
        <img
          class="piggy-bank-dialog-header"
          src="../../../assets/images/promotion/hotpromo/piggy-bank/dialog-header.png"
        />
        <div class="piggy-bank-dialog-inner-wrapper">
          <img
            class="piggy-bank-dialog-title piggy-bank-dialog-item"
            src="../../../assets/images/promotion/hotpromo/piggy-bank/text-cash-back-blue.png"
          />
          <img
            class="piggy-bank-dialog-decorator"
            src="../../../assets/images/promotion/hotpromo/piggy-bank/dialog-decorator.png"
          />
          <div class="piggy-bank-linear-bg-text dialog piggy-bank-dialog-item">
            <div class="piggy-bank-linear-bg-text__text">RS {{ cashback }}</div>
          </div>
          <div class="piggy-bank-dialog-prize">
            <img
              class="piggy-bank-dialog-prize-icon"
              src="../../../assets/images/promotion/hotpromo/piggy-bank/icon-cash.png"
            />
            CASH：Rs{{yesterdayLoss}}
          </div>
          <q-btn class="piggy-bank-dialog-btn" @click="handleReceiveClick"></q-btn>
        </div>
        <q-btn v-close-popup class="piggy-bank-dialog-close-btn" color="white" flat round>
          <img src="../../../assets/images/promotion/hotpromo/piggy-bank/close-btn.png" />
        </q-btn>
      </div>
    </q-dialog>
  </div>
</template>
<script setup>
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "src/stores";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps(["promocode"]);

const $q = useQuasar();
const { t } = useI18n();
const store = userStore();
const cashback = ref(0);
const yesterdayLoss = ref(0);
const cashbackGet= ref(0);

const showClaimDialog = ref(false);


const claimApi = () => {
  eventapi.post(`/session/cashback-for-yesterday-loss/claim-cashback?promoCode=${props.promocode}`).then((res) => {
    if (res.code === 0) {
      console.log(res)
      showClaimDialog.value = true;
      cashbackGet.value= res.data;
    }else{
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message,
        icon: "report_problem"
      });
    }
  });
};

const initApi = () => {
  eventapi.get(`/session/cashback-for-yesterday-loss/calculate-cashback?promoCode=${props.promocode}`).then((res) => {
    if (res.code === 0) {
      console.log(res);
      const { cashback: cb, yesterdayLoss: yl} = res.data;

      cashback.value = cb;
      yesterdayLoss.value = yl;
    }
  });
};


onMounted(() => {
  initApi();
});
</script>
<style lang="scss" scoped>
.piggy-bank-promo-wrapper {
  padding: 20px;
  .piggy-bank-claim-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px 0;
    background-color: #121829;
    border: 1px solid #ffffff14;
    border-radius: 4px;
    margin: 4px 0;
    font-size: 16px;
    color: #00d0ff;

    .piggy-bank-claim-item {
      margin-bottom: 16px !important;
    }

    .piggy-bank-claim-title {
      width: 50vw;
      max-width: 173px;
    }

    .piggy-bank-claim-prize {
      display: flex;
      align-items: center;
      margin-bottom: 28px;
      .piggy-bank-claim-prize-icon {
        margin-right: 6px;
        width: 100%;
        max-width: 23px;
      }
    }

    .piggy-bank-claim-btn {
      width: 57vw;
      max-width: 214px;
      padding: 11px 0;
      background: linear-gradient(90deg, #0287f2 0%, #0664d2 100%);
      border: none;
      border-radius: 4px;
      font-weight: 700;
      color: #fff;

      &:active{
        filter: brightness(0.9);
        transform: translate(0px, 1px);
      }
    }
  }
}

.piggy-bank-linear-bg-text {
  width: 50%;
  background: linear-gradient(90deg, rgba(2, 135, 242, 0) 0%, rgba(2, 135, 242, 0.7) 53.37%, rgba(2, 135, 242, 0) 100%);
  text-align: center;

  &::before,
  &::after {
    display: block;
    content: "";
    height: 1px;
    background: linear-gradient(90deg, rgba(0, 141, 255, 0) 0%, #008dff 53.37%, rgba(0, 141, 255, 0) 100%);
  }

  &.dialog {
    width: 80%;
    padding: 4px 0;
    position: relative;
    background: linear-gradient(
        90deg,
        rgba(6, 102, 211, 0) 0%,
        rgba(6, 102, 211, 0.3) 49.58%,
        rgba(6, 102, 211, 0) 100%
    );

    &::before,
    &::after {
      position: absolute;
      width: 100%;
      background: linear-gradient(
          90deg,
          rgba(33, 167, 239, 0) 0%,
          rgba(33, 167, 239, 0.7) 49.58%,
          rgba(33, 167, 239, 0) 100%
      );
    }

    &::before {
      top: -1px;
    }

    &::after {
      bottom: -1px;
    }

    .piggy-bank-linear-bg-text__text {
      color: #0666d3;
    }
  }

  .piggy-bank-linear-bg-text__text {
    background: linear-gradient(180deg, #fdd601 0%, #ffee90 31.25%, #fdd601 100%);
    background-clip: text;
    font-weight: 700;
    font-size: 27px;
    color: transparent;
  }
}

.piggy-bank-dialog-wrapper {
  position: relative;
  width: 90vw;
  max-width: 450px;

  .piggy-bank-dialog-header {
    width: 100%;
    max-width: 100%;
  }
  .piggy-bank-dialog-inner-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 27px;
    margin-top: -22px;
    background: url("../../../assets/images/promotion/hotpromo/piggy-bank/dialog-bg.png") no-repeat center center;
    background-size: 100% 100%;

    .piggy-bank-dialog-item {
      margin-bottom: 18px !important;
    }

    .piggy-bank-dialog-title {
      width: 50%;
      max-width: 168px;
    }
    .piggy-bank-dialog-decorator {
      width: 53%;
      margin-top: -38px;
      margin-bottom: -10px;
    }
    .piggy-bank-dialog-prize {
      display: flex;
      align-items: center;
      margin-bottom: 28px;
      font-weight: 700;
      font-size: 14px;
      color: #63acff;
      .piggy-bank-dialog-prize-icon {
        margin-right: 6px;
        width: 100%;
        max-width: 23px;
      }
    }

    .piggy-bank-dialog-btn {
      background: url("../../../assets/images/promotion/hotpromo/piggy-bank/receive-btn.png") no-repeat center center;
      background-size: 100% 100%;
      aspect-ratio: 144 / 50;
      min-width: 144px;
      &::before {
        display: none;
      }
    }
  }
}

.piggy-bank-dialog-close-btn {
  position: absolute;
  top: 0;
  right: 0;
  img {
    width: 32px;
  }
}
</style>
