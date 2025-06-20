<template>
  <div class="container">
    <div class="spin-wheel-container">
      <div :class="`draw-btn click-pointer ${spinButtonDisable ? 'disabled' : ''}`" @click="spinWheel">
        <img src="../../../assets/images/promotion/hotpromo/newplayer-spinwheel/click-spin-btn.png" />
      </div>
      <div class="wheel-top-btn">
        <!-- <img src="../../../assets/images/promotion/hotpromo/newplayer-spinwheel/click-spin-indicate.png" /> -->
      </div>
      <div class="spin-wheel-board">
        <div class="spin-wheel-frame">
          <div id="spin-wheel-id" class="spin-wheel">
            <img
              id="spin-wheel-bg"
              class="wheel-bg"
              src="../../../assets/images/promotion/hotpromo/newplayer-spinwheel/spin-wheel-bg.png"
            />
            <div id="spin-wheel-number" class="spin-wheel-number" style="display: none"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="remaining-draw-wrapper">
      <span class="remaining-draw-text">
        {{ $t("hotPromo.aviatorWheel.remainingDrawTimes") }}:
        <span id="remaning-draw-amt">{{ remainingDraws }}</span>
      </span>
    </div>
  </div>

  <q-dialog v-model="showPrizePopup" backdrop-filter="none">
    <div class="congrats-container">
      <!-- <div class="congrats-header"><img src="../../../assets/images/index/modal/congrats-header.png" /></div>
      <div class="congrats-coupons"><img src="../../../assets/images/index/modal/congrats-coupons.png" /></div> -->
      <div class="congrats-title">You get a coupon，Recharge $300 Get</div>
      <div class="congrats-highlight">Rs28</div>

      <div class="congrats-button">
        <q-btn no-caps unelevated :loading="false" @click="router.push('/deposit')">
          {{ $t("btn.recharge") }}
        </q-btn>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, toRefs } from "vue";
import { eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";
import moment from "moment";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const $q = useQuasar();
const router = useRouter();

// spin wheel constants
const TOTAL_ITEMS = 6;
const DEFAUL_SPEED = 1;
const MAX_SPEED = 4;
const FULL_DEGREE = 360;
const SPIN_WHEEL_PRIZES = [28, 999999, 188, 888, 999998, 388, 488, 588];

// spin wheel element refs
const spinBoardRef = ref();
const spinNumRef = ref();
const drawBtnRef = ref();

const spinButtonDisable = ref(false);
const degreesToStopAt = ref([]);
const showPrizePopup = ref(false);
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

const spinWheel = () => {
  //FOr TesTING START
  // const res = {
  //   data: {
  //     bonusAmount: 999999,
  //     availableSpin: 0
  //   }
  // }
  // var bonusIndex = res.data.bonusAmount;
  // if (res.data.type === "CONSOLATION") {
  //   bonusIndex = -1;
  // }
  // const prizeIndex = SPIN_WHEEL_PRIZES.findIndex((prize) => prize === bonusIndex);
  //
  // spin(prizeIndex, () => {
  //   showPrizePopup.value = true;
  //   prizePopupBonusAmt.value = res.data.bonusAmount;
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

        spin(3, () => {
          showPrizePopup.value = true;
          prizePopupBonusAmt.value = res.data.bonusAmount;
          remainingDraws.value = 0;
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const initSpinWheel = () => {
  eventapi.get("/new-user-roulette/init").then((res) => {
    if (res.code == 0) {
      remainingDraws.value = res.data.spinChance;
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

  if (store.hasToken()) {
    initSpinWheel();
  }
});
</script>

<style lang="scss" scoped>
#remaning-draw-amt {
  font-size: 13px;
  color: #FEC778;
  font-weight: bold;
}
.spin-wheel-container {
  position: relative;
  margin: 0px auto;
  text-align: center;
  width: 330px;
  height: 330px;
}

.spin-wheel-frame {
  position: relative;
  width: 330px;
  height: 330px;
  margin: 0 auto;
  background: url(../../../assets/images/promotion/hotpromo/newplayer-spinwheel/spin-wheel-frame.png) no-repeat center
    center;
  background-size: 100%;
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
  width: 330px;
  height: 330px;
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
  width: 155px;
  height: 115px;
  position: absolute;
  top: 21px;
  left: 50%;
  right: 0;
  z-index: 24;
  transform: translateX(-50%);
  img {
    width: 155px;
    height: 115px;
  }
}
.draw-btn {
  width: 80px;
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
  margin-top: -30px;
  margin-bottom: 8px;
  padding: 2px;

  .remaining-draw-text {
    color: #ffffff;
    font-size: 13px;
    // margin: 0px auto 15px;
    margin: auto;
    text-align: center;
    width: 300px;
    position: relative;
    z-index: 23;
    margin: 0 auto;
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

<style lang="scss" scoped>
.congrats-button {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  background: url(img/purpleglow-btn.png)no-repeat center center;
  background-size: contain;
  padding: 8px 20px;
}
.congrats-wrapper {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.congrats-container {
  // background-color: #113413;
  max-width: 400px;
  width: 100%;
  padding: 16px;
  position: relative;
  overflow: visible;
  border-radius: 12px;
  background: url('img/modal-bg.png')no-repeat center center;
  background-size: contain;
  min-height: 500px;

  &:before {
    display: none;
  }
  // &:before {
  //   content: "";
  //   background-image: url(../../../assets/images/index/modal/congrats-container-light.png);
  //   background-size: 100% 100%;
  //   background-position: center center;
  //   background-repeat: no-repeat;
  //   width: 100%;
  //   height: 150px;
  //   position: absolute;
  //   left: 0;
  //   top: -150px;
  // }

  .congrats-header {
    display: flex;
    justify-content: center;
    margin-top: -18px;
    z-index: 2;

    img {
      display: block;
      width: 100%;
      max-width: 320px;
    }
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
    // color: #ffffff;
    display: flex;
    justify-content: center;
    // font-size: 16px;
    // font-weight: bold;
    // text-align: center;
    color: #B573FF;
    text-shadow: 0.57px 0.57px #00000040;
    font-family: "Manrope";
    font-weight: 700;
    font-size: 13.9px;
    line-height: 170%;
    position: absolute;
    top: 41%;
    left: 0;
    right: 0;
    margin: auto;
    letter-spacing: -1px;
  }

  .congrats-highlight {
    // color: #fff96f;
    // font-size: 26px;
    // font-weight: bold;
    // text-align: center;
    // background-image: url(../../../assets/images/index/modal/congrats-highlight-bg.png);
    padding: 15px 12px;
    // background-repeat: no-repeat;
    // background-size: 70% 100%;
    // background-position: center;
    // margin-top: 16px;
    background: unset;
    position: absolute;
    top: 60%;
    left: 0;
    right: 0;
    margin: auto;
    color: #CF3AFF;
    display: flex;
    justify-content: center;
  }
}
</style>

<style lang="scss">
.pak-newplayer-welcome-spin-table {
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
  th {
    background: linear-gradient(rgba(122,1,288, 100%), rgba(122,1,288, 85%)) !important;
  }

  td {
    background-color: transparent !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
  }

  tbody {
    background: linear-gradient(180deg, rgba(184, 83, 255, 0.63) 0%, rgba(122, 1, 228, 0.63) 100%) !important;
  }
}
</style>
