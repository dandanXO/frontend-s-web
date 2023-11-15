<template>
  <div class="spinwheel-container">
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
        :ref="setItemRef"
        class="prize-lock"
      >
        <div class="trapezoid"></div>
        <div class="content">
          <img src="../assets/images/promotion/spinwheel/prize_lock.png" />
          <div class="lock-day">day1</div>
        </div>
      </div>

      <img
        class="inner-frame-img"
        src="../assets/images/promotion/spinwheel/inner_wheel_frame.png"
      />
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
      @click="spin()"
    >
      <img
        class="spin-button-img"
        src="../assets/images/promotion/spinwheel/spin_button.png"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const outerWheelStopDegree = [
  { degree: 0 },
  { degree: 25.5 },
  { degree: 51.25 },
  { degree: 77 },
  { degree: 102.5 },
  { degree: 128.25 },
  { degree: 152.25 },
  { degree: 177.75 },
  { degree: 203.5 },
  { degree: 229.75 },
  { degree: 256 },
  { degree: 282.5 },
  { degree: 309 },
  { degree: 335 },
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

const spinButtonRef = ref(null);
const spinButtonDisable = ref(false);

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

function spin() {
  if (spinButtonDisable.value === true) return;

  updateSpinButton(true);
  spinButtonBounce();

  reset(outerWheelConfig);
  reset(innerWheelConfig);

  spinWheel(outerWheelConfig); // spin outer wheel
  spinWheel(innerWheelConfig); // spin inner wheel

  // setTimeout written in the func
  let count = 0;
  const onStopSpinCb = () => {
    count++;
    if (count === 2) updateSpinButton(false);
  };
  stopSpin(outerWheelConfig, onStopSpinCb);
  stopSpin(innerWheelConfig, onStopSpinCb);
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

const innerMaskDegree = [
  { degree: 63 },
  { degree: 90 },
  { degree: 116 },
  { degree: 141.5 },
  { degree: 167 },
  { degree: 193 },
  { degree: 219 },
  { degree: 245.5 },
  { degree: 271 },
  { degree: 297 },
  { degree: 322 },
  { degree: 347 },
  { degree: 372 },
  { degree: 398 },
];

const lockIndex = [1, 2, 3, 5, 7, 9];
function setupLock() {
  // call api
  for (let i = 0, l = lockIndex.length; i < l; i++) {
    const currIndex = lockIndex[i];
    const degree = innerMaskDegree[currIndex].degree;
    maskRef.value[i].style.transform = `rotate(${degree}deg)`;
  }
}

const maskRef = ref([]);
function setItemRef(el) {
  if (el) maskRef.value.push(el);
}

onMounted(() => {
  setupLock();
});
</script>

<style lang="scss">
.spinwheel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: -30rem 0;
  transform: scale(0.5);

  .outer-wheel {
    .outer-wheel-img {
    }
  }

  .inner-wheel {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;

    .inner-wheel-img {
    }
    .inner-frame-img {
      position: absolute;
    }

    .prize-lock {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;

      .trapezoid {
        border-top: 130px solid black;
        border-left: 30px solid transparent;
        border-right: 30px solid transparent;
        height: 0;
        width: 110px;
        opacity: 0.7;
        transform: translate(40px, -165px) rotate(15deg);
      }

      .mask {
        width: 30rem;
        height: unset;
        opacity: 0.7;
      }

      .content {
        position: absolute;
        transform: translate(40px, -165px) rotate(15deg);
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        justify-content: center;
        gap: 5px;
        backdrop-filter: blur(1px);

        img {
          width: 3rem;
          transform: rotate(-15deg);
        }

        .lock-day {
          color: #fbff1e;
          text-align: center;
          font-family: FZHanZhenGuangBiaoS-GB;
          font-size: 2.11175rem;
          font-weight: 400;
          transform: rotate(-90deg);
        }
      }
    }
  }

  .prize-arrow {
    position: absolute;
    margin: 0 0 8.65rem 40.75rem;
    .prize-arrow-img {
    }
  }

  .spin-button {
    position: absolute;
    transition: 0.3s;
    .spin-button-img {
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
}
</style>
