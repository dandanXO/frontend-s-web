<template>
  <div class="bonus-spin-wheel-wrapper">
    <div class="container">
      <div class="spin-wheel-container">
        <div :class="`draw-btn click-pointer ${remainingDraws <= 0 || spinButtonDisable ? 'disabled' : ''}`"
          @click="spinWheel">
          <img src="./../../../assets/images/promotion/hotpromo/bonus-spinwheel/click-spin-btn.png" />
        </div>
        <div class="spin-wheel-board">
          <div class="spin-wheel-frame">
            <div id="spin-wheel-id" class="spin-wheel">
              <img id="spin-wheel-bg" class="wheel-bg"
                src="./../../../assets/images/promotion/hotpromo/bonus-spinwheel/spin-wheel-bg.png" />
              <div id="spin-wheel-number" class="spin-wheel-number" style="display: none"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="remaining-draw-wrapper">
        <div class="remaining-draw-text">
          剩余抽奖次数：
          <span id="remaning-draw-amt">{{ remainingDraws }}</span>
        </div>
      </div>

      <div class="promo-info-container">
        <div class="promo-info-banner">
          <div class="promo-info-header">活动说明</div>
          <div class="promo-info-content">
            <div class="event-info-item">
              <div class="event-info-title">活动对象：</div>
              <div class="event-info-desc">全体会员</div>
            </div>
            <div class="event-info-item">
              <div class="event-info-title">抽奖次数：</div>
              <div class="event-info-desc">每日存款每达到500元 可获得1次抽奖机会</div>
            </div>
            <div class="event-info-item">
              <div class="event-info-title">抽奖时间：</div>
              <div class="event-info-desc">2024年02月07日起</div>
            </div>
          </div>
        </div>
        <div class="promo-info-banner">
          <div class="promo-info-header">中奖名单</div>
          <div class="promo-info-content">
            <div class="winners-list">
              <div class="winners-list-item" v-for="(item, index) in winnersList" :key="index">
                <div class="winner-username">恭喜 {{ item.loginName }}</div>
                <div class="winner-prize">抽中 {{ item.bonus }} 礼金</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="showPrizePopup" class="bonus-spinwheel-prize-popup-container">
    <div class="wrapper">
      <div class="content">
        <div class="bold-text">
          <div class="darkred-text">恭喜获得</div>
          <div class="red-text">{{ prizePopupBonusAmt }}元彩金</div>
        </div>
        <div class="action-btn" @click="showPrizePopup = false"></div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { userStore } from "@/store";
import { getRecords, getSpinWheelPrize, initSpinWheelData } from "@/api/promotion/bonusSpinWheel";

const store = userStore();

// spin wheel constants
const TOTAL_ITEMS = 8;
const DEFAUL_SPEED = 1;
const MAX_SPEED = 4;
const FULL_DEGREE = 360;
const SPIN_WHEEL_PRIZES = [1888, 18, 188, 88, 588, 58, 888, 8];

// spin wheel element refs
const spinBoardRef = ref();
const spinNumRef = ref();
const drawBtnRef = ref();

const spinButtonDisable = ref(false);
const degreesToStopAt = ref([]);
const showPrizePopup = ref(false);
const prizePopupBonusAmt = ref(0);
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
  if (spinButtonDisable.value === true) {
    return;
  }

  if (remainingDraws.value <= 0) {
    ElMessage.error("剩余抽奖次数：0");
    return;
  }

  // const prizeIndex = SPIN_WHEEL_PRIZES.findIndex((prize) => prize === -1);
  // spin(prizeIndex, () => {
  //   showPrizePopup.value = true;
  //   prizePopupBonusAmt.value = 33;
  //   remainingDraws.value = 9;
  // });
  // return;

  getSpinWheelPrize()
    .then((res) => {
      if (res.code == 0) {

        var bonusIndex = res.data.bonus;
        if (res.data.type === 'CONSOLATION') {
          bonusIndex = -1;
        }
        const prizeIndex = SPIN_WHEEL_PRIZES.findIndex((prize) => prize === bonusIndex);

        spin(prizeIndex, () => {
          showPrizePopup.value = true;
          prizePopupBonusAmt.value = res.data.bonus;
          remainingDraws.value = res.data.availableSpin;
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getRecordsList = () => {
  getRecords()
    .then((res) => {
      if (res.code == 0) {
        winnersList.value = res.data;
      }
    })
    .catch((err) => {
      console.log("here", err);
    });
};

const initSpinWheel = () => {
  initSpinWheelData().then((res) => {
    if (res.code == 0) {
      remainingDraws.value = res.data.availableSpin;
    }
  });

  getRecordsList();
};

onMounted(() => {
  // calc no of spin wheel items and potential stops
  for (var i = 0; i < TOTAL_ITEMS; i++) {
    var the_degree = (FULL_DEGREE / TOTAL_ITEMS) * i * -1;
    degreesToStopAt.value.push({ degree: the_degree });
  }

  spinBoardRef.value = document.getElementById("spin-wheel-bg");
  spinNumRef.value = document.getElementById("spin-wheel-number");
  drawBtnRef.value = document.querySelector(".draw-btn");

  initSpinWheel();
});
</script>

<style lang="scss">
.bonus-spinwheel-prize-popup-container {
  width: 951px;
  height: 645px;
  background: url("./../../../assets/images/promotion/hotpromo/bonus-spinwheel/prize-popup.png");
  background-size: 100% 100%;
  box-shadow: none;

  .el-dialog__header {
    border: none;
    box-shadow: none;

    .el-dialog__headerbtn {
      top: 50px;
      width: 45px;
      height: 45px;
      right: -8px;
      opacity: 0;
    }
  }

  .el-dialog__body {
    background: none;
    box-shadow: none;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 470px;
    gap: 0px;

    .bold-text {
      font-family: sans-serif;
      font-size: 35px;
      font-weight: 700;
      letter-spacing: 1px;
      text-align: center;
      color: #530102;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .golden-text {
      font-size: 55px;
      letter-spacing: 2px;
      background: linear-gradient(94.81deg, #f6ff8c 7.45%, #ffba88 95.9%),
        linear-gradient(360deg, #ff932f 9.54%, #fffca9 86.08%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .darkred-text {
      color: #8C3B00;
      font-size: 42px;
    }

    .red-text {
      color: #ff0000;
      font-size: 50px;
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
      height: 370px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 30px;
      margin-left: 28px;

      .action-btn {
        background: url("./../../../assets/images/promotion/hotpromo/bonus-spinwheel/prize-popup-action-btn.png") no-repeat center center;
        background-size: 100% 100%;
        width: 100%;
        height: 100%;
        max-height: 210px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        font-size: 30px;
        font-weight: bold;
        cursor: pointer;
        background-size: contain;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.bonus-spin-wheel-wrapper {
  padding-top: 110px;
}

.spin-wheel-container {
  position: relative;
  text-align: center;
  margin-top: -110px;
}

.spin-wheel-frame {
  position: relative;
  width: 772px;
  height: 772px;
  margin: 0 auto;
  background: url(../../../assets/images/promotion/hotpromo/bonus-spinwheel/spin-wheel-frame.png) no-repeat center center;
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
  top: 45px;
  left: 45px;
  width: 684px;
  height: 684px;
}

.wheel-bg {
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
  width: 195px;
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

.remaining-draw-wrapper {
  background: url("./../../../assets/images/promotion/hotpromo/bonus-spinwheel/remaining-spins-bg.png") no-repeat center center;
  aspect-ratio: 387/136;
  display: flex;
  align-items: center;
  width: 387px;
  height: 136px;
  color: #480F12;
  font-family: 'Microsoft YaHei UI';
  font-size: 24px;
  font-weight: 700;
  line-height: 31.92px;
  letter-spacing: 0.05em;
  margin: 0 auto;

  .remaining-draw-text {
    color: #480F12;
    margin: 0 auto;
  }
}

.promo-info-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  align-items: center;
  margin-top: -70px;

  .promo-info-banner {
    background: url("./../../../assets/images/promotion/hotpromo/bonus-spinwheel/promo-info-banner.png") no-repeat center center;
    width: 646px;
    height: 404px;
    aspect-ratio: 646/404;
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
    padding: 38px 30px;
  }

  .promo-info-content {
    height: 100%;
    max-height: 300px;
    overflow-y: auto;
    font-family: Microsoft YaHei UI;
    font-size: 20px;
    line-height: 26.6px;
    letter-spacing: 0.05em;
    text-align: left;
    margin: 0px 20px 50px;


    .event-info-item {
      display: grid;
      grid-template-columns: 120px 1fr;
      justify-content: center;
      align-items: center;
      padding: 15px;
      color: #FFF9DB;

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
      padding: 10px;

      &:not(:last-child) {
        border-bottom: 0.58px dashed #FFFFFF33;
      }

      .winner-username {
        color: #FFFFFF99;
      }

      .winner-prize {
        color: #FFF9DB;
        font-weight: bold;
      }
    }
  }
}
</style>