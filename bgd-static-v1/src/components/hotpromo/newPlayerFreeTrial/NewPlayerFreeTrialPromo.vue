<template>
  <div class="spin-wheel-container">
    <div :class="`draw-btn click-pointer ${spinButtonDisable ? 'disabled' : ''}`" @click="spinWheel">
      <img
        v-if="languageVal === 'en'"
        class="spin-btn"
        src="./../../../assets/images/promotion/hotpromo/new-player-free-trial/click-spin-btn-en.png"
      />
      <img
        v-else
        class="spin-btn"
        src="./../../../assets/images/promotion/hotpromo/new-player-free-trial/click-spin-btn-bn.png"
      />
      <img
        class="hand"
        v-if="!spinButtonDisable"
        src="./../../../assets/images/promotion/hotpromo/new-player-free-trial/hand.png"
      />
    </div>
    <img
      class="wheel-stage-img"
      src="./../../../assets/images/promotion/hotpromo/new-player-free-trial/spin-wheel-stg.png"
    />
    <img
      class="wheel-stage-effects-img"
      src="./../../../assets/images/promotion/hotpromo/new-player-free-trial/spin-wheel-stg-effects.png"
    />
    <div class="spin-wheel-board">
      <div id="spin-wheel-id" class="spin-wheel">
        <img
          v-if="languageVal === 'en'"
          id="spin-wheel-bg"
          class="wheel-bg"
          src="./../../../assets/images/promotion/hotpromo/new-player-free-trial/spin-wheel-bg-en.png"
        />
        <img
          v-else
          id="spin-wheel-bg"
          class="wheel-bg"
          src="./../../../assets/images/promotion/hotpromo/new-player-free-trial/spin-wheel-bg-bn.png"
        />
        <div id="spin-wheel-number" class="spin-wheel-number" style="display: none"></div>
      </div>
    </div>
  </div>
  <table class="content-table" border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
    <thead>
      <tr>
        <th>{{ $t("hotPromo.newPlayerFreeTrial.timePeriod") }}</th>
        <th>{{ $t("hotPromo.newPlayerFreeTrial.numberOfPlaces") }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>00:00-06:00</td>
        <td>30%</td>
      </tr>
      <tr>
        <td>06:00-12:00</td>
        <td>20%</td>
      </tr>
      <tr>
        <td>12:00-18:00</td>
        <td>25%</td>
      </tr>
      <tr>
        <td>18:00-24:00</td>
        <td>25%</td>
      </tr>
    </tbody>
  </table>
  <div class="sign-up-bonus-section">
    <img
      v-if="languageVal === 'en'"
      src="../../../assets/images/promotion/hotpromo/new-player-free-trial/sign-up-bonus-title-en.png"
    />
    <img v-else src="../../../assets/images/promotion/hotpromo/new-player-free-trial/sign-up-bonus-title-bn.png" />
    <p>
      {{ $t("hotPromo.newPlayerFreeTrial.signUpBonus1") }}
    </p>
    <p>
      {{ $t("hotPromo.newPlayerFreeTrial.signUpBonus2") }}
      <span style="color: #ff0000cc">18, 58, 88, 200, 300, 500 BDT</span>
      <span>{{ `. ` }}</span>
      {{ $t("hotPromo.newPlayerFreeTrial.signUpBonus3") }}
    </p>
    <p>{{ $t("hotPromo.newPlayerFreeTrial.signUpBonus4") }}</p>
    <p style="color: #ff9d00">
      {{ $t("hotPromo.newPlayerFreeTrial.signUpBonus5") }}
    </p>
  </div>
  <div class="activity-rule-section">
    <img
      v-if="languageVal === 'en'"
      src="../../../assets/images/promotion/hotpromo/new-player-free-trial/activity-rule-en.png"
    />
    <img v-else src="../../../assets/images/promotion/hotpromo/new-player-free-trial/activity-rule-bn.png" />
    <ul>
      <li>
        {{ $t("hotPromo.newPlayerFreeTrial.activityRule1") }}
      </li>
      <li>
        {{ $t("hotPromo.newPlayerFreeTrial.activityRule2") }}
      </li>
      <li>
        {{ $t("hotPromo.newPlayerFreeTrial.activityRule3") }}
      </li>
      <li>
        {{ $t("hotPromo.newPlayerFreeTrial.activityRule4") }}
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { api, eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { userStore } from "src/stores";
import { i18nStore } from "src/router/language";
import { storeToRefs } from "pinia";

const { t } = useI18n();
const $q = useQuasar();
const store = userStore();
const { languageVal } = storeToRefs(i18nStore());

const spinButtonDisable = ref(false);
const remainingDraws = ref(0);
const showPrizePopup = ref(false);
const prizePopupBonusAmt = ref();
const endDate = ref();
const accumulatedBonus = ref();
const invitedList = ref([]);
const degreesToStopAt = ref([]);
const remainingTimeTimer = ref();
const winnersList = ref([]);

// spin wheel constants
const TOTAL_ITEMS = 8;
const DEFAUL_SPEED = 1;
const MAX_SPEED = 4;
const FULL_DEGREE = 360;
const SPIN_WHEEL_PRIZES = [18, 58, 88, 200, 300, 500, "RECHARGE100GET18", "RECHARGE200GET28"];

// spin wheel element refs
const spinBoardRef = ref();
const spinNumRef = ref();
const drawBtnRef = ref();

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

const reset = () => {
  degree = finalDegree % 360;
  speed = DEFAUL_SPEED;

  spinBoardRef.value.style.transition = "";
  spinNumRef.value.style.transition = "";
};

const spinWheel = () => {
  //FOr TesTING START
  const res = {
    data: {
      bonus: 8,
      availableSpin: 1,
      spinType: "THANKS"
    }
  };
  // var bonusIndex = res.data.spinType === "FIXEDBONUS" ? res.data.bonus : res.data.spinType;
  var bonusIndex = "RECHARGE200GET28";

  const prizeIndex = SPIN_WHEEL_PRIZES.findIndex((prize) => prize === bonusIndex);

  console.log("here", bonusIndex, prizeIndex);
  spin(prizeIndex, () => {
    showPrizePopup.value = true;
    prizePopupBonusAmt.value = ["RANDBONUS", "FIXEDBONUS"].includes(res.data.spinType)
      ? res.data.bonus
      : res.data.spinType;
    remainingDraws.value = res.data.availableSpin;
  });
  return;
  //FOr TesTING END

  // if (spinButtonDisable.value === true) {
  //   return;
  // }

  // if (remainingDraws.value <= 0) {
  //   $q.notify({
  //     color: "negative",
  //     position: "top",
  //     message: t("hotPromo.referWheel.remainingDrawTimes") + `: 0`,
  //     icon: "report_problem"
  //   });
  //   return;
  // }

  // eventapi
  //   .post("/session/refer-wheel/spin?promoCode=bgd-refer-wheel")
  //   .then((res) => {
  //     if (res.code == 0) {
  //       var bonusIndex =
  //         res.data.spinType === "FIXEDBONUS"
  //           ? res.data.bonus
  //           : res.data.spinType === "FIRSTBONUS"
  //           ? "RANDBONUS"
  //           : res.data.spinType;

  //       const prizeIndex = SPIN_WHEEL_PRIZES.findIndex((prize) => prize === bonusIndex);

  //       spin(prizeIndex, () => {
  //         showPrizePopup.value = true;
  //         prizePopupBonusAmt.value = ["RANDBONUS", "FIRSTBONUS", "FIXEDBONUS"].includes(res.data.spinType)
  //           ? res.data.bonus
  //           : res.data.spinType;
  //         remainingDraws.value = res.data.availableSpin;
  //         initSpinWheel();
  //       });
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

const initSpinWheel = () => {
  eventapi.get("/session/refer-wheel/init?promoCode=bgd-refer-wheel").then((res) => {
    if (res.code == 0) {
      remainingDraws.value = res.data.availableSpin;
      endDate.value = res.data.endDate;
      accumulatedBonus.value = res.data.accumulatedBonus;
      invitedList.value = res.data.invitedList;

      if (!remainingTimeTimer.value) {
        setInterval(() => {
          if (endDate.value) {
            endDate.value = endDate.value - 1;
          }
        }, 1000);
      }
    }
  });

  getRecords();
};

const getRecords = () => {
  eventapi
    .get("/session/refer-wheel/getRecords?promoCode=bgd-refer-wheel")
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

onUnmounted(() => {
  clearInterval(remainingTimeTimer.value);
});
</script>
<style scoped lang="scss">
.spin-wheel-container {
  position: relative;
  margin: 20px 0px 60px;
  text-align: center;

  .draw-btn {
    width: 92px;
    height: auto;
    aspect-ratio: 95 / 117;
    z-index: 25;
    position: absolute;
    top: 47.5%;
    left: 50%;
    transform: translate(-50%, -50%);

    &.disabled {
      filter: brightness(0.85);
      opacity: 1 !important;
      pointer-events: none;
    }
    img {
      width: 100%;
    }
    img.hand {
      width: 50px !important;
      position: absolute;
      top: 60%;
      left: 66%;
      animation: swipe-hand 3s infinite;
      animation-delay: 1s;
    }

    .click-pointer,
    .history-btn {
      cursor: pointer;
    }

    .click-pointer:hover,
    .history-btn {
      filter: brightness(1);
    }

    .click-pointer:active {
      transform: translate(-50%, calc(-50% + 1px));
      filter: brightness(0.9);
    }
  }

  .wheel-stage-img {
    width: 290px !important;
    z-index: 20;
    position: absolute;
    bottom: 8%;
    left: 50%;
    transform: translate(-50%, 50%);
  }

  .wheel-stage-effects-img {
    z-index: 20;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .spin-wheel-board {
    position: relative;
    z-index: 20;
    background-size: contain;
  }
}

.content-table {
  text-align: center;
  font-family: "Manrope", sans-serif;
  font-size: 10px;
  color: #000;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  thead {
    background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);

    th {
      color: #076b2c;
      font-weight: 700;
      font-size: 12px;
      min-width: 100px;
    }
  }

  tbody {
    td {
      color: #fff;
      padding: 10px 4px;
      font-size: 12px;
      border: 1px solid #ffffff1a;
    }

    tr {
      background: none !important;
      &:nth-child(even) {
        td {
          background-color: #70bc621a !important;
        }
      }
      &:nth-child(odd) {
        td {
          background-color: transparent !important;
        }
      }

      .player-details {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
    }
  }
}

.sign-up-bonus-section {
  img {
    margin-bottom: 20px !important;
  }
  p {
    margin: 0 0 10px !important;
    font-size: 13px !important;
  }
}

.activity-rule-section {
  img {
    margin: 20px 0 !important;
  }
  li {
    margin-bottom: 6px !important;
  }
}
</style>
