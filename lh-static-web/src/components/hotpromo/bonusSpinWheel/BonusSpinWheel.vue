<template>
  <div class="cny-spin-wheel-wrapper">
    <div class="evt-top-header">投注真人场馆与棋牌场馆即可获得转动机会</div>

    <div class="container">
      <div class="spin-wheel-container">
        <div
          :class="`draw-btn click-pointer ${remainingDraws <= 0 || spinButtonDisable ? 'disabled' : ''}`"
          @click="spinWheel"
        >
          <img src="./../../../assets/images/promotion/hotpromo/bonus-spinwheel/click-spin-btn.png" />
        </div>
        <div class="top-btn">
          <img src="./../../../assets/images/promotion/hotpromo/bonus-spinwheel/click-spin-top.png" />
        </div>
        <div class="wheel-stage">
          <img src="./../../../assets/images/promotion/hotpromo/bonus-spinwheel/spin-wheel-stage.png" />
        </div>
        <div class="spin-wheel-board">
          <div class="spin-wheel-frame">
            <div id="spin-wheel-id" class="spin-wheel">
              <img
                id="spin-wheel-bg"
                class="wheel-bg"
                src="./../../../assets/images/promotion/hotpromo/bonus-spinwheel/spin-wheel-bg.png"
              />
              <div id="spin-wheel-number" class="spin-wheel-number" style="display: none"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="remaining-draw-wrapper">
        <p class="remaining-draw-text">
          剩余抽奖次数：
          <span id="remaning-draw-amt">{{ remainingDraws }}</span>
        </p>

        <p style="text-align: center">系统每30~40分钟刷新一次数据，注单结算后40分钟内派发您的转盘次数</p>
      </div>

      <div class="promo-info-container">
        <div class="promo-info-banner">
          <div class="promo-info-header"></div>
          <div class="promo-info-content">
            <div v-if="winnersList.length > 0" class="winners-list">
              <div class="winners-list-item" v-for="(item, index) in winnersList" :key="index">
                <div class="winner-date">{{ moment(item.recordTime).format("YYYY-MM-DD") }}</div>
                <div class="winner-loginName">恭喜 {{ item.loginName }}</div>
                <div class="winner-prize">{{ item.bonus }}</div>
              </div>
            </div>
            <div v-else class="nowinners-list">暂无数据</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="showPrizePopup" class="prizePopupContainer">
    <div class="wrapper">
      <!-- <div class="popup-header bold-text golden-text">恭喜!</div> -->
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
import { userStore } from "@/store";
import { getRecords, getSpinWheelPrize, initSpinWheelData } from "@/api/promotion/bonusSpinWheel";
import moment from "moment";
import { useNotify } from "@/hooks/notify";
import { ElMessage, ElMessageBox } from "element-plus";

const store = userStore();
const notify = useNotify();

// spin wheel constants
const TOTAL_ITEMS = 8;
const DEFAUL_SPEED = 1;
const MAX_SPEED = 4;
const FULL_DEGREE = 360;
const SPIN_WHEEL_PRIZES = [1888, -1, 8, 18, 88, 188, 588, 888];

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
  if (!store.hasToken()) {
    ElMessageBox.alert("请登录后再操作", "系统提示", {
      autofocus: false,
      center: true,
      confirmButtonText: "确认",
      showClose: false,
      buttonSize: "large",
      closeOnClickModal: true
    }).then(() => {
      store.loginPageVisible = true;
    });
    return;
  }
  if (spinButtonDisable.value === true) {
    return;
  }

  if (remainingDraws.value <= 0) {
    notify.error("剩余抽奖次数：0");
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
        if (res.data.type === "CONSOLATION") {
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
  if (!store.token) {
    return;
  }
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
.evt-top-header {
  background: url("./../../../assets/images/promotion/hotpromo/bonus-spinwheel/top-header.png") no-repeat center center;
  background-size: auto 100%;
  display: flex;
  height: 70px;
  align-items: center;
  justify-content: center;
  margin-bottom: 100px;
  color: #fff;
  font-weight: bold;
  font-size: 20px;
}

.cny-spin-wheel-wrapper {
  padding-top: 60px;
}

.spin-wheel-container {
  position: relative;
  //   margin-bottom: 80px;
  text-align: center;
  margin-top: -110px;
}

.spin-wheel-frame {
  position: relative;
  width: 675px;
  height: 675px;
  margin: 0 auto;
  background: url(../../../assets/images/promotion/hotpromo/bonus-spinwheel/spin-wheel-frame.png) no-repeat center
    center;
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
  top: 30px;
  left: 30px;
  width: 615px;
  height: 615px;
}

.wheel-bg {
  width: 100%;
  height: 100%;
}

.wheel-stage {
  width: 100%;
  height: 100%;
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
.top-btn {
  position: absolute;
  z-index: 25;
  top: 16.5%;
  left: 50%;
  transform: translate(-50%, -50%);
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

.wheel-stage {
  width: 1365px;
  height: auto;
  z-index: 20;
  position: absolute;
  top: 53%;
  left: 50%;
  transform: translate(-46%, -50%);

  img {
    width: 100%;
  }
}

.cny-hat {
  width: 200px;
  height: auto;
  z-index: 22;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);

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
  width: 480px;
  height: 500px;
  background: url("./../../../assets/images/promotion/hotpromo/bonus-spinwheel/prize-popup.png");
  background-size: 100% 100%;
  box-shadow: none;

  .el-dialog__header {
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
      color: #8c3b00;
      font-size: 20px;
    }
    .red-text {
      color: #ff0000;
      font-size: 28px;
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
      height: 340px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 30px;
      margin-right: 30px;

      .action-btn {
        background: url("./../../../assets/images/promotion/hotpromo/bonus-spinwheel/prize-popup-action-btn.png")
          no-repeat center center;
        background-size: 100% 100%;
        width: 80%;
        height: 100%;
        max-height: 80px;
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

.remaining-draw-wrapper {
  .remaining-draw-text {
    color: #7a8eb9;
    font-size: 25px;
    margin: 60px auto 10px;
    text-align: center;
    width: 300px;
  }
}

.promo-info-container {
  display: grid;
  border: 1px solid #3f8cff;
  border-radius: 15px;
  padding: 10px;
  max-width: 1200px;
  margin: 100px auto 0;
  //   margin-bottom: 150px;

  .promo-info-banner {
    background-size: 100% 100%;
    width: 100%;
    height: 330px;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
    border-radius: 15px;
    background: #3f8cff0d;
    position: relative;
  }

  .promo-info-header {
    margin-top: -60px;
    font-size: 23px;
    font-weight: 700;
    line-height: 30px;
    text-align: center;
    color: #ffffff;
    padding: 60px 30px;
    background: url(../../../assets/images/promotion/hotpromo/bonus-spinwheel/spin-header.png) no-repeat center center;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
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
    .nowinners-list {
      font-size: 24px;
      color: #7a8eb9;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .winners-list-item {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      text-align: center;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      padding: 10px;
      font-size: 18px;

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
