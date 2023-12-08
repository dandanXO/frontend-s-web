<template>
  <q-dialog v-model="isShowTotalWin" class="total-win-dialog">
    <div class="total-win">
      <img src="../../../assets/images/promotion/spinwheel/total_win_text.png" />
      <div class="total-win-content-container">
        <img src="../../../assets/images/promotion/spinwheel/total_win_board.png" />
        <div class="total-win-content">
          <div class="title">{{ $t("lang.youWon") }}</div>
          <div v-if="outerAmount !== finalAmount">
            <span>{{ outerAmount }}</span>
            X
            <span>{{ innerAmount }}</span>
            % =
          </div>
          <div>{{ $t("lang.totalBonus") }}</div>
          <div>
            <span>{{ finalAmount }}</span>
          </div>
        </div>
      </div>

      <div class="collect-btn" @click="onCollectClick">
        <div class="collect-text">Collect</div>
      </div>
    </div>
  </q-dialog>

  <div class="spinwheel-container">
    <div class="spin-count-board">
      <img
        class="spin-count-board-img"
        src="../../../assets/images/promotion/spinwheel/spin_count_board.png"
      />
      <span>{{
        $t("lang.spinRemaining", {
          spinCount: availableSpinCount,
        })
      }}</span>
    </div>

    <div :ref="outerWheelConfig.wheelRef" class="outer-wheel">
      <img class="outer-wheel-img" src="../../../assets/images/promotion/spinwheel/outer_wheel.png" />
    </div>
    <div :ref="innerWheelConfig.wheelRef" class="inner-wheel">
      <img class="inner-wheel-img" src="../../../assets/images/promotion/spinwheel/inner_wheel.png" />

      <template v-if="unlockDay < 1 ? true : false">
        <div class="prize-lock" style="transform: rotate(0deg)">
          <img src="../../../assets/images/promotion/spinwheel/prize_lock.png" />
        </div>
        <div class="prize-lock-day" style="transform: rotate(0deg)">
          <span>day{{ 1 }}</span>
        </div>
      </template>

      <template v-if="unlockDay < 2 ? true : false">
        <div class="prize-lock" style="transform: rotate(52deg)">
          <img src="../../../assets/images/promotion/spinwheel/prize_lock.png" />
        </div>
        <div class="prize-lock-day" style="transform: rotate(52deg)">
          <span>day{{ 2 }}</span>
        </div>
      </template>

      <template v-if="unlockDay < 3 ? true : false">
        <div class="prize-lock" style="transform: rotate(104deg)">
          <img src="../../../assets/images/promotion/spinwheel/prize_lock.png" />
        </div>
        <div class="prize-lock-day" style="transform: rotate(104deg)">
          <span>day{{ 3 }}</span>
        </div>
      </template>

      <template v-if="unlockDay < 4 ? true : false">
        <div class="prize-lock" style="transform: rotate(156.25deg)">
          <img src="../../../assets/images/promotion/spinwheel/prize_lock.png" />
        </div>
        <div class="prize-lock-day" style="transform: rotate(156.25deg)">
          <span>day{{ 4 }}</span>
        </div>
      </template>

      <template v-if="unlockDay < 5 ? true : false">
        <div class="prize-lock" style="transform: rotate(208.25deg)">
          <img src="../../../assets/images/promotion/spinwheel/prize_lock.png" />
        </div>
        <div class="prize-lock-day" style="transform: rotate(208.25deg)">
          <span>day{{ 5 }}</span>
        </div>
      </template>

      <template v-if="unlockDay < 6 ? true : false">
        <div class="prize-lock" style="transform: rotate(258.25deg)">
          <img src="../../../assets/images/promotion/spinwheel/prize_lock.png" />
        </div>
        <div class="prize-lock-day" style="transform: rotate(258.25deg)">
          <span>day{{ 6 }}</span>
        </div>
      </template>
    </div>

    <div class="prize-arrow">
      <img class="prize-arrow-img" src="../../../assets/images/promotion/spinwheel/prize_arrow.png" />
    </div>

    <div ref="spinButtonRef" :class="`spin-button ${bounceAnimationDisable ? 'bounce' : ''}`">
      <img class="spin-button-img" src="../../../assets/images/promotion/spinwheel/spin_button.png" @click="spin()" />
    </div>

    <div class="infoboard">
      <img class="infoboard-img" src="../../../assets/images/promotion/spinwheel/infoboard.png" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { eventapi } from "boot/axios";
import { useI18n } from "vue-i18n";
import { userStore } from "src/stores";

const { t } = useI18n();
const $q = useQuasar();
const store = userStore();

/**
 * NOTE:
 * -. 0 index starts from where the arrow pointing
 * -. since it wasn't perfect square, readjust arrow means readjust the entire degree.
 */
const outerWheelData = [
  { degree: -52.25, amount: 38 },
  { degree: -78, amount: 588 },
  { degree: -102, amount: 238 },
  { degree: -128, amount: 188 },
  { degree: -154.5, amount: 58 },
  { degree: -180.5, amount: 288 },
  { degree: -206.75, amount: 28 },
  { degree: -233, amount: 88 },
  { degree: -259, amount: 68 },
  { degree: -284, amount: 388 },
  { degree: -309, amount: 38 },
  { degree: -335, amount: 88 },
  { degree: -361, amount: 28 },
  { degree: -386.25, amount: 880 }
];
const innerWheelData = [
  { degree: -27, amount: 200 },
  { degree: -52, amount: 110 },
  { degree: -77, amount: 130 },
  { degree: -104, amount: 300 },
  { degree: -130, amount: 150 },
  { degree: -156, amount: 250 },
  { degree: -181, amount: 140 },
  { degree: -205, amount: 120 },
  { degree: -232, amount: 160 },
  { degree: -259, amount: 500 },
  { degree: -284, amount: 110 },
  { degree: -310, amount: 200 },
  { degree: -336, amount: 1000 },
  { degree: -361, amount: 0 }
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
  stopIndex: 0
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
  stopIndex: 0
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
      icon: "report_problem"
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
  const { isRotateClockwise, stopTime, stopSpinRound, wheelData, stopIndex } = config;

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

function initWheelRotation(config, defaultIndex = 0) {
  const { wheelRef, wheelData } = config;
  wheelRef.value.style.transform = `rotate(${wheelData[defaultIndex].degree}deg)`;
}

const availableSpinCount = ref(0);
const unlockDay = ref(0);
function initSpinWheelAPI() {
  eventapi
    .get("/multiWheel/init?promoCode=multi-wheel")
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

const outerAmount = ref(0);
const innerAmount = ref(0);
const finalAmount = ref(0);
function submitSpinWheelAPI(outerWheelConfig, innerWheelConfig, callback) {
  eventapi
    .post("/multiWheel/submit?promoCode=multi-wheel")
    .then((res) => {
      const { code, data } = res.data;
      if (code === 0) {
        const { leftCount, outer, inner, innerDays, bonus } = data;

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
            const minusValue = i % 2 === 0 ? 2 : 1;
            const innerDaysIndex = innerDays * 2 - minusValue;
            if (innerDaysIndex === i) {
              innerWheelConfig.stopIndex = innerDaysIndex;
              return;
            }
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

const isShowTotalWin = ref(false);
function onCollectClick() {
  isShowTotalWin.value = false;
  store.getBalance();
}

onMounted(() => {
  initWheelRotation(outerWheelConfig);
  initWheelRotation(innerWheelConfig, 1);

  initSpinWheelAPI();
});
</script>

<style scoped lang="scss">
.total-win-dialog {
  .q-dialog__inner--minimized > div {
    max-width: unset;
  }

  .total-win {
    background: url(../../../assets/images/promotion/spinwheel/total_win_bg.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    aspect-ratio: 1;
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    pointer-events: none;

    img {
      width: 90%;
    }

    span {
      background: linear-gradient(0deg, #ff932f 9.54%, #fffca9 86.08%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .total-win-content-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;

      .total-win-content {
        position: absolute;
        margin: 0 0 0 2%;
        color: white;
        text-align: center;
        font-size: 3vw;
        font-family: Arial Black;
        font-weight: 900;
        line-height: normal;
        letter-spacing: 0.14063rem;

        .title {
          font-size: 6vw;
        }
      }
    }

    .collect-btn {
      background: url(../../../assets/images/promotion/spinwheel/collect_btn.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      width: 30%;
      height: 10%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 0;
      margin: 0 0 0 2%;

      .collect-text {
        text-align: center;
        font-family: Archivo Black;
        font-size: 4vw;
        font-weight: 400;
        line-height: 3.29344rem;
        letter-spacing: 0.07319rem;
        text-transform: uppercase;

        background: linear-gradient(180deg, #fffede 0%, rgba(255, 227, 79, 0.89) 75.52%, #fffede 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
}

.spinwheel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: url(../../../assets/images/promotion/spinwheel/h5_bg.png);
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
      bottom: 10%;
      color: #fff;
      text-align: center;
      font-family: FZHanZhenGuangBiaoS-GB;
      font-size: 3vw;
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
        font-size: 2.5vw;
        font-weight: 600;
        line-height: 100%; /* 2.11175rem */
      }
    }
  }

  .prize-arrow {
    position: absolute;
    // top: 32.95%;
    // left: 22.75%;
    display: flex;
    width: 100%;
    z-index: 1;
    top: 14.5%;
    left: 0.25%;
    transform: rotate(-78deg);

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
      cursor: pointer;
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
  .total-win {
    .total-win-content {
      font-size: 2vw !important;

      .title {
        font-size: 2.5vw !important;
      }
    }

    .collect-btn {
      margin: 0 0 0 1% !important;

      .collect-text {
        font-size: 30px !important;
      }
    }
  }

  .spinwheel-container {
    background: url(../../../assets/images/promotion/spinwheel/web_bg.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    .spin-count-board {
      .spin-count-board-img {
        width: 30%;
      }

      span {
        font-size: 1.1rem;
      }
    }

    .outer-wheel {
      .outer-wheel-img {
        width: 60%;
      }
    }

    .inner-wheel {
      .inner-wheel-img {
        width: 30%;
      }

      .prize-lock {
        img {
          width: 8.4%;
          left: 7%;
        }
      }

      .prize-lock-day {
        span {
          top: 4%;
          left: 7%;
          font-size: 1.15rem;
        }
      }
    }

    .prize-arrow {
      //top: 32.5%;
      //left: 13.75%;

      .prize-arrow-img {
        width: 22%;
      }
    }

    .spin-button {
      .spin-button-img {
        width: 10.5%;
      }
    }

    .infoboard {
      .infoboard-img {
        width: 30%;
      }
    }
  }
}

@media (min-width: 980px) {
  .spinwheel-container .spin-count-board span {
    font-size: 1.3rem;
  }
}

@media (min-width: 1080px) {
  .spinwheel-container .spin-count-board span {
    font-size: 1.5rem;
  }
}
</style>
