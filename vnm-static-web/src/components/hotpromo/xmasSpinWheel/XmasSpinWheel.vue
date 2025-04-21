<template>
  <div class="container">
    <div class="spin-wheel-container">
      <div :class="`draw-btn click-pointer ${remainingDraws <= 0 ? 'disabled' : ''}`" @click="spinWheel">
        <img src="./../../../assets/images/promotion/hotpromo/xmas-spinwheel/click-spin-btn2.png" />
      </div>
      <div class="wheel-stage">
        <img src="./../../../assets/images/promotion/hotpromo/xmas-spinwheel/spin-wheel-stage2.png" />
      </div>
      <div class="spin-wheel-board">
        <div class="spin-wheel-frame">
          <div class="spin-wheel-pointer">
            <img src="./../../../assets/images/promotion/hotpromo/xmas-spinwheel/pointer.png" alt="" />
          </div>
          <div id="spin-wheel-id" class="spin-wheel">
            <img
              id="spin-wheel-bg"
              class="wheel-bg"
              src="./../../../assets/images/promotion/hotpromo/xmas-spinwheel/spin-wheel-bg2.png"
            />
            <div id="spin-wheel-number" class="spin-wheel-number" style="display: none"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="remaining-draw-wrapper">
            <p class="remaining-draw-text">剩余抽奖次数：<span id="remaning-draw-amt">{{ remainingDraws }}</span></p>
        </div> -->
  </div>

  <el-dialog v-model="showPrizePopup" class="prizePopupContainer">
    <div class="wrapper">
      <!-- <div class="popup-header bold-text golden-text">恭喜!</div> -->
      <div class="content">
        <!-- <div class="bold-text">您获得</div> -->
        <div class="bold-text">{{ prizePopupBonusAmt }}</div>
        <!-- <div class="bold-text">元</div> -->
        <!-- <div class="action-btn" @click="showPrizePopup.value = false">
                    立即领取
                </div> -->
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { userStore } from "@/store";
import { claimDrawEvent, drawEventInit } from "@/api/promotion/drawEvent";
// import {
//     receiveLuckydrawBonus
// } from "@/api/promotion/xmasSpinWheel";

const PRIZE_ARRAY = [-999, 88, -998, 28, 8888, 38, -997, 888, -996, 18];
const store = userStore();
const props = defineProps(["promoCode"]);

// spin wheel constants
const TOTAL_ITEMS = 10;
const DEFAUL_SPEED = 1;
const MAX_SPEED = 4;
const FULL_DEGREE = 360;

// spin wheel element refs
const spinBoardRef = ref();
const spinNumRef = ref();
const drawBtnRef = ref();

const spinButtonDisable = ref(false);
const degreesToStopAt = ref([]);

const remainingDraws = ref(5);

const showPrizePopup = ref(false);
const prizePopupBonusAmt = ref();

const validBet = ref(0);
const minValidBet = ref(0);
const availableDraw = ref(0);
const usedDraw = ref(0);
const totalDraw = ref(0);

let finalDegree = 0;
let speed = 1;
var spinSchedule;
var degree;

const spin = (prizeIndex, stopCallback) => {
  spinButtonDisable.value = true;
  drawBtnRef.value.style.filter = "brightness(0.85)";

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

  stopSpin(prizeIndex, stopCallback);
};

const stopSpin = (prizeIndex, stopCallback) => {
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
          drawBtnRef.value.style.filter = "none";
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
  if (spinButtonDisable.value === true) {
    return;
  }

  if (remainingDraws.value <= 0) {
    ElMessage.error("剩余抽奖次数：0");
    return;
  }

  // spin(0, () => {
  //   showPrizePopup.value = true;
  //   prizePopupBonusAmt.value = "88";
  //   // remainingDraws.value = 1
  // });

  claimDrawEvent(props.promoCode).then((res) => {
    if (res.code === 0) {
      const index = PRIZE_ARRAY.findIndex((item) => item === res.data[0].bonus);
      spin(index, () => {
        showPrizePopup.value = true;
        prizePopupBonusAmt.value = res.data[0].bonusName;
        // remainingDraws.value = 1
      });
    } else {
      ElMessage.error(res.message);
    }
  });
};

const initPage = () => {
  drawEventInit(props.promoCode).then((res) => {
    if (res.code === 0) {
      const { data } = res;
      validBet.value = data.validBet;
      minValidBet.value = data.minValidBet;
      availableDraw.value = data.availableDraw;
      usedDraw.value = data.usedDraw;
      totalDraw.value = data.totalDraw;
    } else {
      ElMessage.error(res.message);
    }
  });
};

onMounted(() => {
  initPage();
  // calc no of spin wheel items and potential stops
  for (var i = 0; i < TOTAL_ITEMS; i++) {
    var the_degree = (FULL_DEGREE / TOTAL_ITEMS) * i * -1;
    degreesToStopAt.value.push({ degree: the_degree });
  }

  spinBoardRef.value = document.getElementById("spin-wheel-bg");
  spinNumRef.value = document.getElementById("spin-wheel-number");
  drawBtnRef.value = document.querySelector(".draw-btn");
});
</script>

<style lang="scss">
.spin-wheel-container {
  position: relative;
  margin-bottom: 80px;
  text-align: center;
}

.spin-wheel-frame {
  position: relative;
  width: 360px;
  height: 360px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
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

.spin-wheel-pointer {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1;
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
}

.wheel-bg {
  width: 100%;
  height: 100%;
}

.spin-wheel-santa-hat {
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

.draw-btn {
  width: 66px;
  height: auto;
  aspect-ratio: 206/220;
  z-index: 25;
  position: absolute;
  top: calc(50%);
  left: 50%;
  transform: translate(-50%, -50%);

  &.disabled {
    filter: brightness(0.85);
  }
}

.click-pointer,
.history-btn {
  cursor: pointer;
}

.click-pointer:hover,
.history-btn {
  filter: brightness(1.2);
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
  height: auto;
  z-index: 20;
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%, 0);
}

.draw-btn img {
  width: 100%;
}

.spin-wheel-board {
  position: relative;
  z-index: 20;
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

.prizePopupContainer {
  background: url("./../../../assets/images/promotion/hotpromo/xmas-spinwheel/prize-popup2.png");
  background-size: 100% 100%;
  box-shadow: none;
  width: 446px;
  margin-top: 25vh;
  height: 178px;

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 220px;
    gap: 55px;

    .bold-text {
      font-family: sans-serif;
      font-size: 48px;
      font-weight: bold;
      letter-spacing: 1px;
      text-align: center;
      color: #000;
    }

    .golden-text {
      font-size: 55px;
      letter-spacing: 2px;
      background: linear-gradient(94.81deg, #f6ff8c 7.45%, #ffba88 95.9%),
        linear-gradient(360deg, #ff932f 9.54%, #fffca9 86.08%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .popup-header {
      letter-spacing: normal;
      font-size: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .content {
      height: 260px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      padding: 30px;

      .action-btn {
        //background: url("./../../../assets/images/promotion/hotpromo/xmas-spinwheel/prize-popup-action-btn.png");
        background-size: 100% 100%;
        width: 80%;
        height: 100%;
        max-height: 65px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #c12c1e;
        font-size: 30px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}

.remaining-draw-wrapper {
  .remaining-draw-text {
    color: #e6d796;
    font-size: 25px;
    margin: 10px auto;
    text-align: center;
    width: 300px;
  }
}

.promo-info-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  align-items: center;
  margin-bottom: 150px;

  .promo-info-banner {
    background: url("./../../../assets/images/promotion/hotpromo/xmas-spinwheel/promo-info-banner.png");
    background-size: 100% 100%;
    width: 400px;
    height: 383px;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
  }

  .promo-info-header {
    font-size: 23px;
    font-weight: 700;
    line-height: 30px;
    text-align: center;
    color: #ffffff;
    padding: 30px;
  }

  .promo-info-content {
    height: 100%;
    max-height: 220px;
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

    .winners-list-item {
      display: grid;
      grid-template-columns: 1fr 1fr;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      padding: 7px;

      &:not(:last-child) {
        border-bottom: 0.58px dotted #53010233;
      }

      .winner-username {
        color: #53010299;
      }

      .winner-prize {
        color: #530102;
        font-weight: bold;
      }
    }
  }
}
</style>
