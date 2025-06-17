<template>
  <div class="container" :style="props.isHomePopup ? 'padding: 0;' : 'padding-top: 30px;'">
    <div class="spin-wheel-container">
      <div :class="`draw-btn click-pointer ${spinButtonDisable ? 'disabled' : ''}`" @click="spinWheel">
        <img src="../../../assets/images/promotion/hotpromo/newplayer-spinwheel/new-click-spin-btn.png" />
      </div>
      <div class="wheel-top-btn">
        <img src="../../../assets/images/promotion/hotpromo/newplayer-spinwheel/new-click-spin-indicate.png" />
      </div>
      <div class="spin-wheel-board">
        <div class="spin-wheel-frame">
          <div class="spin-wheel-shine">
          </div>
          <div id="spin-wheel-id" class="spin-wheel">
            <img
              id="spin-wheel-bg"
              class="wheel-bg"
              src="../../../assets/images/promotion/hotpromo/newplayer-spinwheel/new-spin-wheel-bg.png"
            />
            <div id="spin-wheel-number" class="spin-wheel-number" style="display: none"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="remaining-draw-wrapper">
      <span class="remaining-draw-text">
        {{ $t("hotPromo.aviatorWheel.remainingDrawTimes") }}:
        <span id="remaining-draw-amt">{{ remainingDraws }}</span>
      </span>
    </div>
  </div>

  
  <CongratsReuseableModal
    :isShowDialog="showPrizePopup"
    :btnTxt="$t('btn.goNow')"
    :bonusAmount="prizePopupBonusAmt"
    :contentImg="require('../../../assets/images/index/modal/congrats-coupons.png')"
    :headerImg="require(`../../../assets/images/index/modal/congrats-header-${langVal}.png`)"
    @handleBtnClick="handleReceiveCodeBonus"
    @handleBtnClose="showPrizePopup = false"
  />
  <!-- <CongratsReuseableModal
    :isShowDialog="showHasUnusedPopup"
    :btnTxt="$t('btn.goNow')"
    :bonusTitle="$t('hotPromo.unusedCoupons')"
    :contentImg="require('../../../assets/images/index/modal/congrats-coupons.png')"
    :headerImg="require(`../../../assets/images/index/modal/congrats-header-${langVal}.png`)"
    @handleBtnClick="router.push('/deposit?from=/home')"
    @handleBtnClose="showHasUnusedPopup = false"
  /> -->
  <q-dialog class="isCentreDialog" v-model="showHasUnusedPopup" @hide="showHasUnusedPopup = false">
    <div class="congrats-container">
      <q-btn icon="close" round dense v-close-popup class="congrats-close" />
      <div class="congrats-heading">COUPON</div>
      <div class="congrats-coupons">
        <img :src="require('../../../assets/images/index/modal/congrats-coupons.png')" />
      </div>
      <div class="congrats-title">{{ $t('hotPromo.unusedCoupons') }}</div>

      <div class="congrats-button-container">
        <q-btn no-caps unelevated class="congrats-btn" @click="handleReceiveCodeBonus">
          {{ $t('btn.goNow') }}
        </q-btn>
      </div>
    </div>
  </q-dialog>
  
</template>

<script setup>
import { ref, onMounted, toRefs, computed, defineProps } from "vue";
import { eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";
import { i18nStore } from "src/router/language";
import moment from "moment";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const i18nStoreLanguage = i18nStore();

import { isAndroid } from "boot/utils";

const langVal = computed(() => i18nStoreLanguage.languageVal);

import CongratsReuseableModal from "src/components/modal/CongratsReuseableModal.vue";
// import { store } from "quasar/wrappers";

import { userStore } from "src/stores";
const { t } = useI18n();
const $q = useQuasar();
const store = userStore();
const router = useRouter();
const props = defineProps([
  "isHomePopup",
  "hasUnusedCoupon"
])
// spin wheel constants
const TOTAL_ITEMS = 7;
const DEFAUL_SPEED = 1;
const MAX_SPEED = 4;
const FULL_DEGREE = 360;
const SPIN_WHEEL_PRIZES = [38, 999999, 188, 888, 999998, 388, 488];

// spin wheel element refs
const spinBoardRef = ref();
const spinNumRef = ref();
const drawBtnRef = ref();

const spinButtonDisable = ref(false);
const degreesToStopAt = ref([]);
const showPrizePopup = ref(false);
const showHasUnusedPopup = ref(false);
const prizePopupBonusAmt = ref();
const remainingDraws = ref(0);
const winnersList = ref([]);

let finalDegree = 0;
let speed = 1;
var spinSchedule;
var degree;

const spin = (prizeIndex, stopCallback) => {
  spinButtonDisable.value = true;
  // drawBtnRef.value.style.filter = "brightness(0.85)";

  reset();

  spinSchedule = setInterval(() => {
    degree++;
    speed += 0.005;
    if (speed >= MAX_SPEED) speed = MAX_SPEED;

    finalDegree = (degree * speed) % 360;
    const transformValue = `rotate(${finalDegree}deg)`;
    spinBoardRef.value.style.transform = transformValue;
    spinNumRef.value.style.transform = transformValue;
  }, 1);

  // 5s + api return
  stopSpin(prizeIndex, stopCallback);
};

const getRecords = () => {
  eventapi
    .get("/aviatorWheel/records")
    .then((res) => {
      if (res.code == 0) {
        winnersList.value = res.data;
      }
    })
    .catch((err) => {
      console.log("here", err);
    });
};

const stopSpin = (prizeIndex, stopCallback) => {
  // call api

  let spinTimeEnd = false;
  let isApiReturned = true;
  setTimeout(() => {
    spinTimeEnd = true;
    attemptStopSpin();
  }, 5000);

  // stop spin variables
  const stopTime = 3;
  const stopSpinRound = 3 * 360;
  const endDegree = degreesToStopAt.value[prizeIndex].degree;

  const attemptStopSpin = () => {
    finalDegree = endDegree + stopSpinRound;

    if (spinTimeEnd && isApiReturned) {
      clearInterval(spinSchedule);

      const spinBoardRefStyle = spinBoardRef.value.style;
      const spinNumRefStyle = spinNumRef.value.style;

      const transitionTime = `transform ${stopTime}s ease-out`;
      const transformValue = `rotate(${finalDegree}deg)`;

      spinBoardRefStyle.transition = transitionTime;
      spinBoardRefStyle.transform = transformValue;

      spinNumRefStyle.transition = transitionTime;
      spinNumRefStyle.transform = transformValue;

      setTimeout(() => {
        spinButtonDisable.value = false;

        setTimeout(() => {
          // drawBtnRef.value.style.filter = "none";
          stopCallback?.();
        }, 750);
      }, stopTime * 1000);
    }
  };
};

const reset = () => {
  degree = finalDegree % 360;
  speed = DEFAUL_SPEED;

  spinBoardRef.value.style.transition = "";
  spinNumRef.value.style.transition = "";
};
const handleReceiveCodeBonus = () => {
  router.push('/deposit?from=/home')
};
const spinWheel = () => {
  //FOr TesTING START
  // const res = {
  //   data: {
  //     bonusAmount: null,
  //     bonusName: null,
  //     privilegeId: 552
  //   }
  // }
  // var bonusIndex = res.data.bonusAmount;
  // if (res.data.type === "CONSOLATION") {
  //   bonusIndex = -1;
  // }
  // const prizeIndex = SPIN_WHEEL_PRIZES.findIndex((prize) => prize === bonusIndex);
  
  // spin(0, () => {
  //   showPrizePopup.value = true;
  //   prizePopupBonusAmt.value = 38;
  //   remainingDraws.value = res.data.availableSpin;
  // });
  // return;
  //FOr TesTING END

  if (spinButtonDisable.value === true) {
    return;
  }
  if (remainingDraws.value <= 0) {
    $q.notify({
      color: "negative",
      position: "top",
      message: t("hotPromo.aviatorWheel.remainingDrawTimes") + `: 0`,
      icon: "report_problem"
    });
    return;
  }
  eventapi
    .post("/new-user-roulette/spin")
    .then((res) => {
      if (res.code == 0) {
        var bonusIndex = res.data.bonusAmount;
        if (res.data.type === "CONSOLATION") {
          bonusIndex = -1;
        }
        const prizeIndex = SPIN_WHEEL_PRIZES.findIndex((prize) => prize === bonusIndex);

        spin(0, () => {
          showPrizePopup.value = true;
          prizePopupBonusAmt.value = 38;
          remainingDraws.value = 0;
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const alreadyDeposited = JSON.parse(localStorage.getItem('onAppFirstDeposit'));

const isNotInApp = window.location.pathname === "/promo";
const initSpinWheel = () => {
  eventapi.get("/new-user-roulette/init").then((res) => {
    if (res.code == 0) {
      remainingDraws.value = res.data.spinChance;
      store.hasUnusedCoupon = res.data.hasUnusedCoupon;
      if (props.isHomePopup) {
        showHasUnusedPopup.value = store.canClaimFtdPrivilege ? true : false
      }
      else {
        showHasUnusedPopup.value = (isAndroid() || !isNotInApp) && res.data.hasUnusedCoupon === 'YES' ? true : false
      }

      
    }
  });

  // getRecords();
};

onMounted(() => {
  // calc no of spin wheel items and potential stops
  for (var i = 0; i < TOTAL_ITEMS; i++) {
    var the_degree = (FULL_DEGREE / TOTAL_ITEMS) * i * -1;
    degreesToStopAt.value.push({ degree: the_degree, prize: SPIN_WHEEL_PRIZES[i] });
  }

  spinBoardRef.value = document.getElementById("spin-wheel-bg");
  spinNumRef.value = document.getElementById("spin-wheel-number");
  drawBtnRef.value = document.querySelector(".draw-btn");

  initSpinWheel();
});
</script>

<style lang="scss" scoped>
#remaining-draw-amt {
  font-size: 13px;
  color: #61FF00;
  font-weight: bold;
}
.spin-wheel-container {
  position: relative;
  margin: 0px auto;
  text-align: center;
  width: 250px;
  height: 250px;
}

.spin-wheel-frame {
  position: relative;
  width: 250px;
  height: 250px;
  margin: 0 auto;
  // background: url(../../../assets/images/promotion/hotpromo/newplayer-spinwheel/spin-wheel-frame.png) no-repeat center
  //   center;
  // background-size: 100%;
}
.spin-wheel-shine {
    height: 302px;
    left: -33px;
    pointer-events: none;
    position: absolute;
    top: -22px;
    width: 315px;
    z-index: 999;
    animation: blink-rotate .8s ease-in-out infinite;
    background: url(./img/shinee.png)no-repeat center center;
    background-position: center center;
    background-size: contain;
}
@keyframes blink-rotate {
  0% {
    background-image: url(./img/shinee.png);
  }
  50% {
   
  }
  100% {
    background-image: url(./img/shine-alt.png);
  }
}
.wheel-frame {
  position: relative;
  z-index: 3;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
}

.chosen-color-bg {
  position: absolute;
  z-index: 3;
  top: -0px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 230px;
}

.spin-wheel {
  position: absolute;
  z-index: 2;
  top: 0px;
  left: 0px;
  width: 250px;
  height: 250px;
  overflow: hidden;
}

.wheel-bg {
  width: 100%;
  height: 100%;
  position: relative;
}
.spin-wheel-cny-hat {
  width: 100%;
  height: 100%;
}

.spin-wheel-number {
  position: absolute;
  z-index: 5;
  top: 0px;
  left: 0px;
  width: 550px;
  height: 550px;
}

.spin-wheel-number img {
  width: 100%;
  height: 100%;
}
.wheel-top-btn {
  width: 140px;
  height: 115px;
  position: absolute;
  top: -11%;
  left: 60%;
  right: 0;
  z-index: 24;
  transform: translateX(-50%);
  img {
    width: 140px;
    // height: 115px;
  }
}
.draw-btn {
  width: 150px;
  height: auto;
  aspect-ratio: 1/1;
  z-index: 25;
  position: absolute;
  top: calc(50%);
  left: 50%;
  transform: translate(-50%, -50%);

  &.disabled {
    filter: brightness(0.85);
    opacity: 1 !important;
    pointer-events: none;
  }
}

.click-pointer,
.history-btn {
  cursor: pointer;
}

.click-pointer:hover,
.history-btn {
  filter: brightness(1);
}

.history-btn:active {
  transform: translate(0px, 1px);
  filter: brightness(0.9);
}

.click-pointer:active {
  transform: translate(-50%, calc(-50% + 1px));
  filter: brightness(0.9);
}

.wheel-stage {
  width: 100%;
  height: auto;
  z-index: 20;
  position: absolute;
  bottom: 95px;
  left: 53%;
  transform: translate(-50%, 50%);

  img {
    width: 100%;
  }
}

.cny-hat {
  width: 120px;
  height: auto;
  z-index: 22;
  position: absolute;
  top: -45px;
  left: 50%;
  transform: translate(-50%, 0%);

  img {
    width: 100%;
  }
}

.draw-btn img {
  width: 100%;
}

.spin-wheel-board {
  position: relative;
  z-index: 20;
  background-size: contain;
}

::-webkit-scrollbar {
  width: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

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

.prizePopupContainer {
  display: flex;
  justify-content: center;
  align-items: center;

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    // width: 300px;
    // height: 345px;
    gap: 0px;

    position: relative;
    .close {
      position: absolute;
      right: 0;
      top: 38px;
      width: 20px;
      height: 20px;
    }

    .bold-text {
      font-family: sans-serif;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 1px;
      text-align: center;
      color: #530102;
    }

    .golden-text {
      font-size: 25px;
      letter-spacing: 2px;
      background: linear-gradient(94.81deg, #f6ff8c 7.45%, #ffba88 95.9%),
        linear-gradient(360deg, #ff932f 9.54%, #fffca9 86.08%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .darkred-text {
      color: #8c3b00;
      font-size: 20px;
    }
    .red-text {
      color: #ff0000;
      font-size: 28px;
    }

    .win-text {
      font-size: 28px;
      letter-spacing: 2px;
      background: linear-gradient(360deg, #ffc700 9.54%, #fff500 86.08%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(1px 1px #00000050);
    }

    .popup-header {
      letter-spacing: normal;
      font-size: 25px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .content {
      height: 260px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      margin-right: 10px;

      .action-btn {
        // background-size: contain;
        // width: 100%;
        // height: 100%;
        // max-height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}

.remaining-draw-wrapper {
  // background-image: url(../../../assets/images/promotion/hotpromo/newplayer-spinwheel/spin-wheel-highlight.png);
  // background-size: 75% 100%;
  // background-repeat: no-repeat;
  // background-position: center center;
  // margin-top: -30px;
  // margin-bottom: 8px;
  // padding: 2px;
  margin: 10px auto;
  background: linear-gradient(90deg, rgba(75, 125, 65, 0) 0%, rgba(75, 125, 65, 0.4) 52.5%, rgba(75, 125, 65, 0) 93.5%);
  padding: 5px 0;
  width: 80%;
    max-width: 240px;

  .remaining-draw-text {
    color: #ffffff;
    font-size: 13px;
    // margin: 0px auto 15px;
    margin: auto;
    text-align: center;
    width: 250px;
    position: relative;
    z-index: 23;
    margin: 0 auto;
    gap: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.promo-info-container {
  display: grid;
  border: 1px solid #3f8cff;
  border-radius: 15px;
  padding: 10px;
  max-width: 1200px;
  margin: 50px auto 0;
  //   margin-bottom: 150px;

  .promo-info-banner {
    background-size: 100% 100%;
    width: 100%;
    height: 200px;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
    border-radius: 15px;
    background: #3f8cff0d;
    position: relative;
  }

  .promo-info-content {
    height: 100%;
    max-height: 140px;
    overflow-y: auto;

    .event-info-item {
      display: grid;
      grid-template-columns: 100px 1fr;
      justify-content: center;
      align-items: center;
      padding: 7px;
      color: #530102;

      .event-info-title {
        font-weight: bold;
      }
    }
    .nowinners-list {
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      color: #7a8eb9;
      font-size: 16px;
    }
    .winners-list-item {
      font-size: 12px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      padding: 7px;
      text-align: center;

      &:not(:last-child) {
        border-bottom: 0.58px dotted #53010233;
      }

      .winner-date {
        font-weight: 700;
        color: #7a8eb9;
      }

      .winner-loginName {
        font-weight: 700;
        color: #7a8eb9;
      }

      .winner-prize {
        font-weight: 700;
        color: #3f8cff;
      }
    }
  }
}
</style>

<style lang="scss">
.pak-newplayer-welcome-spin-greentable {
  p {
    margin: 0;
    padding: 8px;
  }
  border-collapse: collapse !important;
  tr:nth-child(2),tr:nth-child(4) {
    td:nth-child(2) {
      p {
        color: #FFC554;
      }
    }
  }
  tr:nth-child(3) {
    td:nth-child(2) {
      p {
        color: #6D8FF5;
      }
    }
  }
  // th {
  //   background: linear-gradient(rgba(122,1,288, 100%), rgba(122,1,288, 85%)) !important;
  // }

  // td {
  //   background-color: transparent !important;
  //   border-color: rgba(255, 255, 255, 0.1) !important;
  // }

  // tbody {
  //   background: linear-gradient(180deg, rgba(184, 83, 255, 0.63) 0%, rgba(122, 1, 228, 0.63) 100%) !important;
  // }
}
</style>

<style lang="scss" scoped>
.congrats-container {
  background-image: unset;
  background-color: #1e371f;
  border: 1px solid #337e3a;
  border-radius: 10px !important;
  max-width: 350px;
  width: 100%;
  padding: 16px;
  position: relative;
  overflow: visible;
  border-radius: 12px;
  height: unset;
  aspect-ratio: unset;

  &:before {
    content: "";
    background-image: url(../../../assets/images/index/modal/congrats-container-light.png);
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 150px;
    position: absolute;
    left: 0;
    top: -158px;
  }

  // .congrats-header {
  //   display: flex;
  //   justify-content: center;
  //   margin-top: -26px;
  //   z-index: 2;

  //   img {
  //     display: block;
  //     width: 100%;
  //     max-width: 320px;
  //   }
  // }

  .congrats-heading {
    font-family: Poppins;
    font-weight: 700;
    font-size: 22px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    text-transform: uppercase;
  }

  .congrats-coupons {
    img {
      display: block;
      width: 100%;
      margin: auto;
      max-width: 240px;
    }
  }

  .congrats-title {
    color: #ffffff;
    display: flex;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
  }

  .congrats-highlight-txt,
  .congrats-highlight {
    color: #fff96f;
    font-size: 45px;
    text-align: center;
    // background: linear-gradient(90deg, transparent, #fff96f29, transparent);
    background-image: url(../../../assets/images/index/modal/green-congrats-highlight-bg.png);
    padding: 0 12px;
    background-repeat: no-repeat;
    background-size: 70% 100%;
    background-position: center;
    margin-top: 16px;
    position: relative;
    text-align: center;
    top: unset;
    left: 0;
    transform: unset;
    bottom: unset;
    margin: 16px auto;
  }

  .congrats-highlight-txt {
    font-size: 14px;
  }
}

.congrats-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.1);
}

.congrats-button-container {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  .congrats-btn {
    background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
    border-radius: 10px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #000a01;
  }
}
</style>
