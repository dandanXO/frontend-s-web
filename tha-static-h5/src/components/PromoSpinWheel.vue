<template>
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

      <div
        v-for="(e, i) in lockIndex"
        :key="`${e}-${i}`"
        :ref="setMaskRef"
        class="prize-lock"
      >
        <img src="../assets/images/promotion/spinwheel/prize_lock.png" />
      </div>

      <div
        v-for="(e, i) in lockIndex"
        :key="`${e}-${i}`"
        :ref="setMaskDayRef"
        class="prize-lock-day"
      >
        <span>day{{ e / 2 + 1 }}</span>
      </div>
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
const outerWheelStopDegree = [
  { degree: 0, amount: 588 },
  { degree: 25.5, amount: 238 },
  { degree: 51.25, amount: 188 },
  { degree: 77, amount: 58 },
  { degree: 102.5, amount: 288 },
  { degree: 128.25, amount: 28 },
  { degree: 152.25, amount: 88 },
  { degree: 177.75, amount: 68 },
  { degree: 203.5, amount: 388 },
  { degree: 229.75, amount: 38 },
  { degree: 256, amount: 88 },
  { degree: 282.5, amount: 28 },
  { degree: 309, amount: 880 },
  { degree: 335, amount: 38 },
];
const innerWheelStopDegree = [
  { degree: 0 },
  { degree: 25 },
  { degree: 50 },
  { degree: 76 },
  { degree: 100 },
  { degree: 125 },
  { degree: 151 },
  { degree: 176 },
  { degree: 204 },
  { degree: 231 },
  { degree: 256 },
  { degree: 282 },
  { degree: 307 },
  { degree: 333 },
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
  degreeToStop: outerWheelStopDegree,
  stopIndex: 1,
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
  degreeToStop: innerWheelStopDegree,
  stopIndex: 2,
};

const spinButtonRef = ref(null);
const spinButtonDisable = ref(false);

const availableSpinCount = ref(0);

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

  submitSpinWheelAPI(() => {
    // setTimeout written in the func
    let count = 0;
    const onStopSpinCb = () => {
      count++;
      if (count === 2) updateSpinButton(false);
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
  const {
    isRotateClockwise,
    stopTime,
    stopSpinRound,
    degreeToStop,
    stopIndex,
  } = config;

  let spinTimeEnd = false;
  let isApiReturned = true;
  setTimeout(() => {
    spinTimeEnd = true;
    attemptStopSpin();
  }, 5000);

  const attemptStopSpin = () => {
    const endDegree = degreeToStop[stopIndex].degree;
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

const maskRef = ref([]);
function setMaskRef(el) {
  if (el) maskRef.value.push(el);
}
const maskDayRef = ref([]);
function setMaskDayRef(el) {
  if (el) maskDayRef.value.push(el);
}

function initSpinWheelAPI(callback) {
  eventapi
    .get("/multiWheel/init?promoCode=tha-multi-wheel")
    .then((res) => {
      const { code, data } = res.data;
      if (code === 0) {
        const { leftCount, unlock } = data;
        availableSpinCount.value = leftCount;

        // 1 - 7 [lockIndex formula: (n - 1) * 2]
        lockIndex.value = [];
        for (let i = unlock, l = 7; i < l; i++) {
          const index = i * 2;
          lockIndex.value.push(index);
        }

        callback && callback();
      }
    })
    .catch((e) => {
      console.log("error", e);
    });
}

function submitSpinWheelAPI(callback) {
  callback && callback();

  //   eventapi
  //     .post("/multiWheel/submit?promoCode=tha-multi-wheel")
  //     .then((res) => {
  //       const { code, data } = res.data;
  //       if (code === 0) {
  //         const { leftCount, outer, inner, bonus } = data;
  //         availableSpinCount.value = leftCount;

  //         // TODO: outer & inner

  //         $q.notify({
  //           type: "positive",
  //           position: "top",
  //           message: `Congratulation, You Acquired A Total Of ${bonus} Amount!`,
  //           icon: "check_circle_outline",
  //         });

  //         callback && callback();
  //       }
  //     })
  //     .catch((e) => {
  //       console.log("error", e);
  //     });
}

const innerMaskDegree = [
  { degree: 309.25 },
  { degree: 335 },
  { degree: 0 },
  { degree: 27 },
  { degree: 52 },
  { degree: 79 },
  { degree: 104 },
  { degree: 130.25 },
  { degree: 156.25 },
  { degree: 182.25 },
  { degree: 208.25 },
  { degree: 233.25 },
  { degree: 258.25 },
  { degree: 283.25 },
];

const lockIndex = ref([0, 2, 4, 6, 8, 10, 12]);
function setupLock() {
  for (let i = 0, l = lockIndex.value.length; i < l; i++) {
    const index = lockIndex.value[i];
    const degree = innerMaskDegree[index].degree;

    maskRef.value[i].style.transform = `rotate(${degree}deg)`;
    maskDayRef.value[i].style.transform = `rotate(${degree}deg)`;
  }
}

onMounted(() => {
  initSpinWheelAPI(() => {
    setupLock();
  });
});
</script>

<style lang="scss">
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
        transform: rotate(76.5deg);
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
    top: 33.5%;
    left: 22.5%;
    display: flex;
    width: 100%;
    z-index: 1;

    .prize-arrow-img {
      width: 35%;
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
</style>
