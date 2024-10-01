<template>
  <div class="container">
    <span class="period">活动时间：2024年9月13日00:00起</span>
    <div class="spin-wheel-container">
      <div
        :class="`draw-btn click-pointer ${remainingDraws <= 0 || spinButtonDisable ? 'disabled' : ''}`"
        @click="spinWheel(remainingDraws)"
      >
        <img src="./../../../assets/images/promo/hotpromo/midautum-spinWheel/click-spin-btn.png" />
      </div>
      <div class="wheel-stage">
        <img src="./../../../assets/images/promo/hotpromo/midautum-spinWheel/spin-wheel-stg.png" />
        <p class="spin-wheel-stg-text" @click="spinWheel(remainingDraws)">转动一次</p>
      </div>
      <div class="spin-wheel-board">
        <div class="spin-wheel-frame">
          <div id="spin-wheel-id" class="spin-wheel">
            <img
              id="spin-wheel-bg"
              class="wheel-bg"
              src="./../../../assets/images/promo/hotpromo/midautum-spinWheel/spin-wheel-bg.png"
            />
            <div id="spin-wheel-number" class="spin-wheel-number" style="display: none"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="remaining-draw-wrapper">
      <p class="remaining-draw-text">
        剩余次数：
        <span id="remaning-draw-amt" style="color: #3981ff">{{ remainingDraws }} 次</span>
      </p>
      <span class="prize-record-btn" @click="prizeRecordPopup.init()">「中奖记录」</span>
    </div>

    <div class="livepoker-rebate-game-bottom-rule">
      <div class="title-container">
        <div class="title">活动规则</div>
      </div>
      <div class="content">
        <div class="item">
          <div class="item-num">1</div>
          <div style="font-weight: 500">活动期间，用户当日每累计有效投注达到 3,888 元即可获得一次转盘机会；</div>
        </div>
        <div class="item">
          <div class="item-num">2</div>
          <div style="font-weight: 500">
            活动期间，用户每日最高可获得 5 次转盘次数，超出次数则不累计，转盘次数仅限当日有效，次日即清零。转盘彩金实时派发，彩金 3 倍流水即可提款；
          </div>
        </div>
        <div class="item">
          <div class="item-num">3</div>
          <div style="font-weight: 500">
            若抽奖获得豪华版【黑神话·悟空】，抽取实物奖品者需联系【在线客服】进行兑换，获取CDK，也可根据游戏码实际价格的 8 折兑换彩金；
          </div>
        </div>
        <div class="item">
          <div class="item-num">4</div>
          <div style="font-weight: 500">
            根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
          </div>
        </div>
        <div class="item">
          <div class="item-num">5</div>
          <div style="font-weight: 500">
            此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及IP地址视为同一账户，若有违规者，将不享受此红利；
          </div>
        </div>
        <div class="item">
          <div class="item-num">6</div>
          <div style="font-weight: 500">为避免文字理解差异，本站保留此活动最终解释权；</div>
        </div>
      </div>
    </div>
  </div>

  <q-dialog v-model="showPrizePopup">
    <div class="prizePopupContainer">
      <div class="wrapper">
        <div class="close" @click="showPrizePopup = false"></div>
        <div class="content">
          <div class="bold-text">
            <div class="darkred-text">恭喜获得</div>
            <div class="red-text" v-if="prizePopupBonusAmt">{{ prizePopupBonusAmt }}元彩金</div>
            <div class="red-text" v-else>豪华版【黑神话·悟空】</div>
          </div>
          <div class="action-btn" @click="showPrizePopup = false"></div>
        </div>
      </div>
    </div>
  </q-dialog>

  <PrizeHistory ref="prizeRecordPopup" />
</template>
<script setup>
import { ref, onMounted } from "vue";
import { eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";

import { userStore } from "../../../stores/index";
import { useRouter } from "vue-router";
import PrizeHistory from "./PrizeHistory.vue";
const store = userStore();
const router = useRouter();
const $q = useQuasar();

// spin wheel constants
const DEFAUL_SPEED = 1;
const MAX_SPEED = 4;
const FULL_DEGREE = 360;

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
const prizeRecordPopup = ref();

let finalDegree = 0;
let speed = 1;
var spinSchedule;
var degree;

const spin = (prizeIndex, stopCallback) => {
  spinButtonDisable.value = true;

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

const spinWheel = (times) => {
  // spin(0, () => {
  //   showPrizePopup.value = true;
  //   prizePopupBonusAmt.value = 8;
  //   remainingDraws.value = 1;
  // });
  // return;
  if (!store.token) {
    $q.dialog({
      class: "q-px-md q-pt-md",
      title: "系统提示",
      message: "请登录后再操作",
      ok: {
        push: true,
        color: "primary",
        label: "去登录",
        tabindex: 1
      },
      cancel: {
        push: true,
        color: "warning",
        label: "取消",
        tabindex: 0
      },
      persistent: true
    }).onOk(() => {
      router.push("/login");
    });
    return;
  }
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
    .post(`/mooncakeFestSpin/spin?spinTimes=1`)
    .then((res) => {
      if (res.code === 0) {
        var bonusIndex = (() => {
          if(res.data.spinBonusVOList[0].bonusName && res.data.spinBonusVOList[0].bonus === 0) {
            return "黑神话 - 悟空";
          }

          return res.data.spinBonusVOList[0].bonus;
        })()
        remainingDraws.value = res.data.availableSpin;
        const prizeIndex = degreesToStopAt.value.findIndex((item) => item.prize === bonusIndex);

        spin(prizeIndex, () => {
          showPrizePopup.value = true;
          prizePopupBonusAmt.value = res.data.spinBonusVOList[0].bonus;
          remainingDraws.value = res.data.availableSpin;
          store.getBalance();
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const initSpinWheel = () => {
  eventapi.get("/mooncakeFestSpin/init").then((res) => {
    if (res.code === 0) {
      remainingDraws.value = res.data.availableSpin;
    }
  });
};

onMounted(() => {
  if (!store.token) {
    return;
  }

  degreesToStopAt.value = [
    {
      degree: 110,
      prize: 188
    },
    {
      degree: 64,
      prize: 888
    },
    {
      degree: 5,
      prize: "黑神话 - 悟空"
    },
    {
      degree: 164,
      prize: 1888
    },
    {
      degree: 218,
      prize: 88
    },
    {
      degree: 265,
      prize: 18
    },
    {
      degree: 315,
      prize: 8
    }
  ];

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
  background: url(../../../assets/images/promo/hotpromo/midautum-spinWheel/spin-wheel-frame.png) no-repeat center center;
  background-size: 115%;
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
}

.wheel-bg {
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
.wheel-top-btn {
  width: 20px;
  position: absolute;
  top: 25px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 25;
}
.draw-btn {
  width: 125px;
  height: auto;
  aspect-ratio: 206/220;
  z-index: 25;
  position: absolute;
  top: 51%;
  left: 50.5%;
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

.wheel-stage {
  bottom: -70px;
  height: auto;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  width: 350px;
  z-index: 20;
  margin: 0 auto;

  img {
    width: 100%;
  }

  .spin-wheel-stg-text {
    display: none;
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    box-shadow: 0px -1.25px 2.86px 0px #b1d7ff inset;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    padding: 10px 0;
    width: 150px;
    margin: 0 auto;
    border-radius: 20px;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, -50%);
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

.prizePopupContainer {
  display: flex;
  justify-content: center;
  align-items: center;

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 230px;
    height: 250px;
    gap: 0px;
    background: url("./../../../assets/images/promo/hotpromo/midautum-spinWheel/prize-popup.png");
    background-size: 100% 100%;
    position: relative;
    .close {
      position: absolute;
      right: 0px;
      top: 25px;
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
      font-size: 18px;
    }
    .red-text {
      color: #ff0000;
      font-size: 22px;
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
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      margin-right: 10px;

      .action-btn {
        background: url("./../../../assets/images/promo/hotpromo/midautum-spinWheel/prize-popup-action-btn.png")
          no-repeat center center;
        background-size: contain;
        width: 100%;
        height: 100%;
        max-height: 60px;
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
  position: relative;

  .remaining-draw-text {
    color: #7a8eb9;
    font-size: 20px;
    margin: 80px auto 15px;
    text-align: center;
    width: 300px;
    position: relative;
    z-index: 23;
  }

  .prize-record-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #3981ff;
    font-weight: 700;
    cursor: pointer;
    z-index: 24;

    &:hover {
      filter: brightness(1.1);
    }
  }
}

.promo-info-container {
  padding: 10px;
  max-width: 1200px;
  margin: 30px auto 0;
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

<style scoped>
.livepoker-rebate-game-bottom-rule {
  width: 90%;
  max-width: 1024px;
  height: 100%;
  margin: 40px auto 0;
  background: #f4dfff3b;
  border-radius: 12px;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 12px 12px 0 0;
    background: linear-gradient(180deg, #c5ceff 0%, #a79eff 100%);
    width: 100%;
    padding: 10px 0;
  }

  .title {
    background-image: url("./../../../assets/images/promo/hotpromo/midautum-spinWheel/rule-title-bg.png");
    background-repeat: no-repeat;
    background-size: 100%;
    width: 290px;
    color: #9742f8;
    font-weight: 600;
    font-size: 24px;
    text-align: center;
    height: 46px;
    line-height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content {
    font-size: 17px;
    font-weight: 400;
    line-height: 32px;
    color: #000000;
    border: 2px solid #ffffff;
    border-top: none;
    padding: 20px 20px 20px 10px;
    border-radius: 0 0 12px 12px;
    .item {
      padding-left: 10px;
      display: flex;
      gap: 10px;

      .item-num {
        color: #ffffff;
        font-size: 16px;
        line-height: 1;
        border-radius: 50%;
        height: 28px !important;
        width: 28px !important;
        min-width: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2px;
        background: url("./../../../assets/images/promo/hotpromo/midautum-spinWheel/rule-item-bg.png");
        background-size: 100% 100%;
      }

      .hint {
        font-size: 18px;
        font-weight: 400;
        line-height: 22.4px;
        color: #ff0000;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

.period {
  margin-left: 5%;
  font-size: 16px;
}
</style>
