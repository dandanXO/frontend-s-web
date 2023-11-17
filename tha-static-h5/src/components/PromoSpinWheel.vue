<template>
  <q-dialog v-model="isShowTotalWin" class="total-win-dialog">
    <div class="total-win">
      <div class="won">
        <div>You've Won!</div>
        <div>
          <span>{{ outerAmount }}</span> X <span>{{ innerAmount }}</span
          >% =
        </div>
        <div>Total Bonus</div>
        <div>
          <span>{{ finalAmount }}</span>
        </div>
      </div>
    </div>
  </q-dialog>

  <div class="spinwheel-container">
    <div class="spin-count-board">
      <img
        class="spin-count-board-img"
        src="../assets/images/promotion/spinwheel/spin_count_board.png"
      />
      <span>คุณมี {{ availableSpinCount }} ตั๋วที่หมุนได้</span>
    </div>

    <div :ref="outerWheelConfig.wheelRef" class="outer-wheel">
      <img
        class="outer-wheel-img"
        src="../assets/images/promotion/spinwheel/outer_wheel.png"
      />
    </div>
    <div :ref="innerWheelConfig.wheelRef" class="inner-wheel">
      <img
        class="inner-wheel-img"
        src="../assets/images/promotion/spinwheel/inner_wheel.png"
      />

      <template v-if="unlockDay < 1 ? true : false">
        <div class="prize-lock" style="transform: rotate(309.25deg)">
          <img src="../assets/images/promotion/spinwheel/prize_lock.png" />
        </div>
        <div class="prize-lock-day" style="transform: rotate(309.25deg)">
          <span>day{{ 1 }}</span>
        </div>
      </template>

      <template v-if="unlockDay < 2 ? true : false">
        <div class="prize-lock" style="transform: rotate(0deg)">
          <img src="../assets/images/promotion/spinwheel/prize_lock.png" />
        </div>
        <div class="prize-lock-day" style="transform: rotate(0deg)">
          <span>day{{ 2 }}</span>
        </div>
      </template>

      <template v-if="unlockDay < 3 ? true : false">
        <div class="prize-lock" style="transform: rotate(52deg)">
          <img src="../assets/images/promotion/spinwheel/prize_lock.png" />
        </div>
        <div class="prize-lock-day" style="transform: rotate(52deg)">
          <span>day{{ 3 }}</span>
        </div>
      </template>

      <template v-if="unlockDay < 4 ? true : false">
        <div class="prize-lock" style="transform: rotate(104deg)">
          <img src="../assets/images/promotion/spinwheel/prize_lock.png" />
        </div>
        <div class="prize-lock-day" style="transform: rotate(104deg)">
          <span>day{{ 4 }}</span>
        </div>
      </template>

      <template v-if="unlockDay < 5 ? true : false">
        <div class="prize-lock" style="transform: rotate(156.25deg)">
          <img src="../assets/images/promotion/spinwheel/prize_lock.png" />
        </div>
        <div class="prize-lock-day" style="transform: rotate(156.25deg)">
          <span>day{{ 5 }}</span>
        </div>
      </template>

      <template v-if="unlockDay < 6 ? true : false">
        <div class="prize-lock" style="transform: rotate(208.25deg)">
          <img src="../assets/images/promotion/spinwheel/prize_lock.png" />
        </div>
        <div class="prize-lock-day" style="transform: rotate(208.25deg)">
          <span>day{{ 6 }}</span>
        </div>
      </template>

      <template v-if="unlockDay < 7 ? true : false">
        <div class="prize-lock" style="transform: rotate(258.25deg)">
          <img src="../assets/images/promotion/spinwheel/prize_lock.png" />
        </div>
        <div class="prize-lock-day" style="transform: rotate(258.25deg)">
          <span>day{{ 7 }}</span>
        </div>
      </template>
    </div>

    <div class="prize-arrow">
      <img
        class="prize-arrow-img"
        src="../assets/images/promotion/spinwheel/prize_arrow.png"
      />
    </div>

    <div
      ref="spinButtonRef"
      :class="`spin-button ${bounceAnimationDisable ? 'bounce' : ''}`"
    >
      <img
        class="spin-button-img"
        src="../assets/images/promotion/spinwheel/spin_button.png"
        @click="spin()"
      />
    </div>

    <div class="infoboard">
      <img
        class="infoboard-img"
        src="../assets/images/promotion/spinwheel/infoboard.png"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { eventapi } from "boot/axios";

const $q = useQuasar();

// NOTE: 0 index starts from where the arrow pointing
const outerWheelData = [
  { degree: 0, amount: 588 },
  { degree: -25, amount: 238 },
  { degree: -50.5, amount: 188 },
  { degree: -77, amount: 58 },
  { degree: -103, amount: 288 },
  { degree: -129.25, amount: 28 },
  { degree: -155.5, amount: 88 },
  { degree: -181.5, amount: 68 },
  { degree: -206.5, amount: 388 },
  { degree: -231.5, amount: 38 },
  { degree: -257.5, amount: 88 },
  { degree: -283.5, amount: 28 },
  { degree: -309, amount: 880 },
  { degree: -335, amount: 38 },
];
const innerWheelData = [
  { degree: 0, amount: 130 },
  { degree: -26, amount: 300 },
  { degree: -52, amount: 150 },
  { degree: -77, amount: 250 },
  { degree: -102, amount: 140 },
  { degree: -128, amount: 120 },
  { degree: -155, amount: 160 },
  { degree: -182, amount: 500 },
  { degree: -207, amount: 110 },
  { degree: -233, amount: 200 },
  { degree: -258, amount: 1000 },
  { degree: -283, amount: 0 },
  { degree: -309, amount: 200 },
  { degree: -335, amount: 110 },
];

/**
 * NOTE:
 * speed must be 1, to avoid jump degree during respin
 * e.g. 350 * 1.5 = way pass 360
 */
const outerWheelConfig = {
  wheelRef: ref(null),
  defaultSpeed: 1,
  maxSpeed: 4,
  spinSchedule: null,
  degree: 0,
  finalDegree: 0,
  speed: 1,
  isRotateClockwise: true,
  stopTime: 3,
  stopSpinRound: 3 * 360,
  wheelData: outerWheelData,
  stopIndex: 0,
};
const innerWheelConfig = {
  wheelRef: ref(null),
  defaultSpeed: 1,
  maxSpeed: 4,
  spinSchedule: null,
  degree: 0,
  finalDegree: 0,
  speed: 1,
  isRotateClockwise: false,
  stopTime: 5,
  stopSpinRound: 3 * 360,
  wheelData: innerWheelData,
  stopIndex: 0,
};

const spinButtonRef = ref(null);
const spinButtonDisable = ref(false);

function spin() {
  if (spinButtonDisable.value === true) return;
  if (availableSpinCount.value === 0) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "No Spin Count Remaining",
      icon: "report_problem",
    });
    return;
  }
  availableSpinCount.value--;

  updateSpinButton(true);
  spinButtonBounce();

  reset(outerWheelConfig);
  reset(innerWheelConfig);

  spinWheel(outerWheelConfig); // spin outer wheel
  spinWheel(innerWheelConfig); // spin inner wheel

  submitSpinWheelAPI(outerWheelConfig, innerWheelConfig, () => {
    // setTimeout written in the func
    let count = 0;
    const onStopSpinCb = () => {
      count++;
      if (count === 2) {
        updateSpinButton(false);
        isShowTotalWin.value = true;
      }
    };

    stopSpin(outerWheelConfig, onStopSpinCb);
    stopSpin(innerWheelConfig, onStopSpinCb);
  });
}

function spinWheel(config) {
  let { maxSpeed, isRotateClockwise } = config;

  config.spinSchedule = setInterval(() => {
    if (isRotateClockwise) config.degree++;
    else config.degree--;

    config.speed += 0.005;
    if (config.speed >= maxSpeed) config.speed = maxSpeed;

    config.finalDegree = (config.degree * config.speed) % 360;
    const transformValue = `rotate(${config.finalDegree}deg)`;
    config.wheelRef.value.style.transform = transformValue;
  }, 1);
}

function stopSpin(config, callback) {
  const { isRotateClockwise, stopTime, stopSpinRound, wheelData, stopIndex } =
    config;

  let spinTimeEnd = false;
  let isApiReturned = true;
  setTimeout(() => {
    spinTimeEnd = true;
    attemptStopSpin();
  }, 5000);

  const attemptStopSpin = () => {
    const endDegree = wheelData[stopIndex].degree;
    if (isRotateClockwise) config.finalDegree = endDegree + stopSpinRound;
    else config.finalDegree = endDegree - stopSpinRound;

    if (spinTimeEnd && isApiReturned) {
      clearInterval(config.spinSchedule);

      const transitionTime = `transform ${stopTime}s ease-out`;
      const transformValue = `rotate(${config.finalDegree}deg)`;

      const wheelRefStyle = config.wheelRef.value.style;
      wheelRefStyle.transition = transitionTime;
      wheelRefStyle.transform = transformValue;

      setTimeout(() => {
        callback && callback();
      }, stopTime * 1000);
    }
  };
}

function reset(config) {
  let { wheelRef, finalDegree, defaultSpeed } = config;

  config.degree = finalDegree % 360;
  config.speed = defaultSpeed;

  config.spinSchedule = null;

  wheelRef.value.style.transition = "";
}

const bounceAnimationDisable = ref(false);
function spinButtonBounce() {
  bounceAnimationDisable.value = true;
  setTimeout(() => {
    bounceAnimationDisable.value = false;
  }, 500);
}

function updateSpinButton(isDisable) {
  if (isDisable) {
    spinButtonDisable.value = true;
    spinButtonRef.value.style.filter = "grayscale(0.5)";
  } else {
    spinButtonRef.value.style.filter = "";
    spinButtonDisable.value = false;
  }
}

const availableSpinCount = ref(0);
const unlockDay = ref(7);
function initSpinWheelAPI() {
  eventapi
    .get("/multiWheel/init?promoCode=tha-multi-wheel")
    .then((res) => {
      const { code, data } = res.data;
      if (code === 0) {
        const { leftCount, unlock } = data;
        availableSpinCount.value = leftCount;
        unlockDay.value = unlock;
      }
    })
    .catch((e) => {
      console.log("error", e);
    });
}

const isShowTotalWin = ref(true);
const outerAmount = ref(0);
const innerAmount = ref(0);
const finalAmount = ref(0);
function submitSpinWheelAPI(outerWheelConfig, innerWheelConfig, callback) {
  eventapi
    .post("/multiWheel/submit?promoCode=tha-multi-wheel")
    .then((res) => {
      const { code, data } = res.data;
      if (code === 0) {
        const { leftCount, outer, inner, bonus } = data;

        outerAmount.value = outer;
        innerAmount.value = inner;
        finalAmount.value = bonus;
        availableSpinCount.value = leftCount;

        outerWheelData.map((e, i) => {
          if (e.amount === outer) {
            outerWheelConfig.stopIndex = i;
            return;
          }
        });
        innerWheelData.map((e, i) => {
          if (e.amount === inner) {
            innerWheelConfig.stopIndex = i;
            return;
          }
        });
      }
    })
    .catch((e) => {
      console.log("error", e);
    })
    .then(() => {
      callback && callback();
    });
}

onMounted(() => {
  initSpinWheelAPI();
});
</script>

<style scoped lang="scss">
.total-win-dialog {
  .total-win {
    background: url(../assets/images/promotion/spinwheel/total_win.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    color: white;
    text-align: center;
    font-family: Arial Black;
    font-size: 14px;
    font-weight: 900;
    line-height: normal;
    letter-spacing: 0.14063rem;

    pointer-events: none;

    span {
      color: #eda1ff;
    }

    .won {
      position: relative;
      top: 17.5%;
      left: 1%;
    }
  }
}

.spinwheel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: url(../assets/images/promotion/spinwheel/h5_bg.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  .spin-count-board {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    bottom: 4%;

    .spin-count-board-img {
      width: 50%;
      margin: 0 auto;
    }

    span {
      position: absolute;
      bottom: 9%;
      color: #fff;
      text-align: center;
      font-family: FZHanZhenGuangBiaoS-GB;
      font-size: 4vw;
      font-weight: 400;
      line-height: normal;
    }
  }

  .outer-wheel {
    width: 100%;
    display: flex;
    z-index: 1;

    .outer-wheel-img {
      width: 100.5%;
      margin: 0 auto;
    }
  }

  .inner-wheel {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    z-index: 1;

    .inner-wheel-img {
      width: 50%;
    }
    .inner-frame-img {
      position: absolute;
      width: 100%;
    }

    .prize-lock {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 13.9%;
        height: 21.5%;
        position: relative;
        top: 1.5%;
        left: 11.5%;
        transform: rotate(75.5deg);
      }
    }

    .prize-lock-day {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        position: relative;
        top: 4%;
        left: 11.5%;
        color: #fbff1e;
        text-align: center;
        font-family: FZHanZhenGuangBiaoS-GB;
        font-size: 18px;
        font-weight: 600;
        line-height: 100%; /* 2.11175rem */
      }
    }
  }

  .prize-arrow {
    position: absolute;
    top: 32.95%;
    left: 22.75%;
    display: flex;
    width: 100%;
    z-index: 1;

    .prize-arrow-img {
      width: 36%;
      margin: 0 auto;
    }
  }

  .spin-button {
    position: absolute;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    z-index: 1;

    .spin-button-img {
      width: 17.5%;
    }

    &.bounce {
      animation: bounce 0.5s ease-in-out;
      transform: scale(1);
    }

    @keyframes bounce {
      0% {
        transform: scale(1);
      }
      25% {
        transform: scale(0.85);
      }
      75% {
        transform: scale(1.15);
      }
      100% {
        transform: scale(1);
      }
    }
  }

  .infoboard {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    bottom: 12.5%;
    z-index: 1;

    .infoboard-img {
      width: 50%;
      margin: 0 auto;
    }
  }
}

@media (min-width: 768px) {
}
</style>
