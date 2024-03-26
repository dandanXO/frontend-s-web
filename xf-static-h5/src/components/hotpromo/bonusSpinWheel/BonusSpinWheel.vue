<template>
  <div class="bonus-spin-wheel-container">
    <img src="./../../../assets/images/promotion/hotpromo/bonus-spinwheel/banner.png" />
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

  <q-dialog v-model="showPrizePopup">
    <div class="bonus-spinwheel-prize-popup-container">
      <div class="wrapper">
        <div class="close" @click="showPrizePopup = false"></div>
        <div class="content">
          <div class="bold-text">
            <div class="darkred-text">恭喜获得</div>
            <div class="red-text">{{ prizePopupBonusAmt }}元彩金</div>
          </div>
          <div class="action-btn" @click="showPrizePopup = false"></div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { eventapi } from "src/boot/axios";

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
    .get("/vipWheel/records")
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
  // const prizeIndex = SPIN_WHEEL_PRIZES.findIndex((prize) => prize === -1);
  // spin(prizeIndex, () => {
  //   showPrizePopup.value = true;
  //   prizePopupBonusAmt.value = 33;
  //   remainingDraws.value = 9;
  // });
  // return;

  if (spinButtonDisable.value === true) {
    return;
  }

  if (remainingDraws.value <= 0) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "剩余抽奖次数：0",
      icon: "report_problem"
    });
    return;
  }

  eventapi
    .post("/vipWheel/spin")
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

const initSpinWheel = () => {
  eventapi.get("/vipWheel/init").then((res) => {
    if (res.code == 0) {
      remainingDraws.value = res.data.availableSpin;
    }
  });

  getRecords();
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

<style lang="scss">
.spin-wheel-container {
  position: relative;
  margin: 25px 0px 55px;
  text-align: center;
}

.spin-wheel-frame {
  position: relative;
  width: 330px;
  height: 330px;
  margin: 0 auto;
  background: url(../../../assets/images/promotion/hotpromo/bonus-spinwheel/spin-wheel-frame.png) no-repeat center center;
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
  top: 20px;
  left: 20px;
  width: 290px;
  height: 290px;
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
  width: 100px;
  height: auto;
  aspect-ratio: 206/220;
  z-index: 25;
  position: absolute;
  top: calc(50%);
  left: 50%;
  transform: translate(-50%, -50%);

  &.disabled {
    filter: brightness(0.85);
    opacity: 1 !important;
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

.bonus-spinwheel-prize-popup-container {
  display: flex;
  justify-content: center;
  align-items: center;

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 600px;
    height: 300px;
    gap: 0px;
    background: url("./../../../assets/images/promotion/hotpromo/bonus-spinwheel/prize-popup.png");
    background-size: 100% 100%;
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
      margin-left: 10px;

      .action-btn {
        background: url("./../../../assets/images/promotion/hotpromo/bonus-spinwheel/prize-popup-action-btn.png") no-repeat center center;
        background-size: contain;
        width: 100%;
        height: 100%;
        max-height: 90px;
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

.bonus-spin-wheel-container {
  .promo-info-container {
    display: grid;
    grid-template-rows: 1fr 1fr;
    justify-content: center;
    align-items: center;

    .promo-info-banner {
      background: url("./../../../assets/images/promotion/hotpromo/bonus-spinwheel/promo-info-banner.png") no-repeat center center;
      background-size: 100% 100%;
      width: 450px;
      height: 370px;
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
      padding: 15px 30px;
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
}
</style>