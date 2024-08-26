<template>
  <div class="stepgame-wrapper">
    <div class="stepgame-container">
      <div class="head-title">
        <img src="../../../assets/images/promotion/hotpromo/cnystepgame2024/head-title-01.png" />
      </div>

      <div class="game-container">
        <div class="game-btns-container">
          <button class="game-btn game-btn--01" :disabled="isBtnLoading" @click="handleSpin">
            转盘次数 ({{ spinLeft }})
          </button>
        </div>

        <div class="game-spin-wheel-container">
          <div>
            <div class="game-spin-wheel-frame">
              <img src="../../../assets/images/promotion/hotpromo/cnystepgame2024/spin-wheel-frame.png" />
            </div>
            <div class="game-spin-wheel">
              <div class="spin-wheel-shadow" :class="smoothSpinOn && 'shadow-spin'"></div>
              <div class="spin-wheel-board" :class="smoothSpinOn && 'smooth-spin'">
                <div style="transition: 1s all" :class="`spin-to-${spinToNum}`">
                  <img src="../../../assets/images/promotion/hotpromo/cnystepgame2024/spin-wheel-board.png" />
                </div>
              </div>
              <div class="spin-wheel-pin">
                <img src="../../../assets/images/promotion/hotpromo/cnystepgame2024/spin-wheel-pin.png" />
              </div>
            </div>
          </div>
        </div>

        <div class="game-item-container">
          <div
            class="game-item-player"
            :class="gamePlayerStepSway && 'sway'"
            :style="{
              'grid-row': playerPosition.row,
              'grid-column': playerPosition.column
            }"
          >
            <img src="../../../assets/images/promotion/hotpromo/cnystepgame2024/player-pin.png" />
          </div>
          <template v-for="(position, step) in stepPositionMapping" :key="step">
            <template
              v-if="
                step === '8' ||
                step === '18' ||
                step === '28' ||
                step === '38' ||
                step === '46' ||
                step === '58' ||
                step === '59'
              "
            >
              <div
                class="game-item-number game-item-number--reward"
                :class="{ 'reward-claimed': claimedBonus.includes(parseInt(step)) }"
                :style="{ 'grid-row': position.row, 'grid-column': position.column }"
              >
                <span>
                  <img
                    :src="
                      require(`../../../assets/images/promotion/hotpromo/cnystepgame2024/game-btn-reward-${step}.png`)
                    "
                  />
                </span>
              </div>
            </template>

            <template v-else-if="step === '0'">
              <div
                class="game-item-number game-item-number--start"
                :style="{ 'grid-row': position.row, 'grid-column': position.column }"
              >
                <span>起点</span>
              </div>
            </template>
            <template v-else>
              <div class="game-item-number" :style="{ 'grid-row': position.row, 'grid-column': position.column }">
                <span>{{ step }}</span>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>

  <div class="game-side-btns-container">
    <div class="game-side-btn" @click="gameRulesDialog = true">
      <img src="../../../assets/images/promotion/hotpromo/cnystepgame2024/side-btn-01.png" />
    </div>
    <div class="game-side-btn" @click="onGameRecordsDialogClicked()">
      <img src="../../../assets/images/promotion/hotpromo/cnystepgame2024/side-btn-02.png" />
    </div>
  </div>

  <!-- game dialogs start -->
  <el-dialog v-model="gameRulesDialog" width="1000px" align-center :close-on-click-modal="false" class="game-dialog">
    <div class="dialog-header">
      <img src="../../../assets/images/promotion/hotpromo/cnystepgame2024/game-head-title-02.png" />
    </div>
    <div class="dialog-body">
      <ol>
        <li>
          活动期间，每日可免费获得3次转动转盘机会，超出免费次数则每存款200元即可获得一次转动转盘机会，每日最高可转动20次转盘；
        </li>
        <li>本活动仅能通关一次，每个步格奖励仅派发一次彩金；</li>
        <li>本活动转盘数字定义:抽中正数即往前进相应步数，抽中0保持原关卡不动，抽中负数即往后退相应步数；</li>
        <li>
          本活动获取关卡奖励需到达指定关卡。例：用户从第12关出发，抽中6即往前进6步，到达关卡18，只能领取关卡18的奖励，不能领取关卡8的奖励。
        </li>
        <li>本活动所得彩金将实时派发至用户【中心钱包】，彩金仅需完成3倍流水即可提交出款申请。</li>
        <li>本活动全体用户皆可参与，参与前需完善个人资料，绑定手机号码及银行卡；</li>
        <li>本活动仅对已结算并产生输赢结果的有效投注进行计算，任何走水、串关、特殊投注、取消的赛事不计算有效投注。</li>
        <li>本活动与其它优惠活动共享。（特殊活动除外）</li>
        <li>同一姓名、手机号、银行卡号、邮箱地址等信息的用户账号，仅可参与一次，若有违规者，将不享受此优惠。</li>
        <li>
          任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单。
        </li>
        <li>为避免文字理解差异，本活动最终解释权归雷火电竞所有。</li>
      </ol>
    </div>
  </el-dialog>

  <el-dialog v-model="gameRecordsDialog" width="1000px" align-center :close-on-click-modal="false" class="game-dialog">
    <div class="dialog-header">
      <img src="../../../assets/images/promotion/hotpromo/cnystepgame2024/game-head-title-03.png" />
    </div>
    <div class="dialog-body step-history-body">
      <el-table :data="dataSource" stripe style="width: 100%">
        <el-table-column prop="createTime" label="日期" />
        <el-table-column prop="steps" label="转动步数" />
        <el-table-column prop="currentPlace" label="位置" />
        <el-table-column prop="bonus" label="获得奖金" />
      </el-table>
      <el-divider />
      <el-pagination
        @current-change="handleCurrentChange"
        :total="pagination.total"
        :current-page="pagination.current"
        :page-size="pagination.size"
      />
    </div>
  </el-dialog>

  <el-dialog v-model="wonBonusDialog" width="1000px" align-center :close-on-click-modal="false" class="game-dialog">
    <div class="dialog-header">
      <img src="../../../assets/images/promotion/hotpromo/cnystepgame2024/game-head-title-04.png" />
    </div>
    <div class="dialog-body won-bonus-body">
      <div class="won-txt">
        恭喜您获得
        <span>{{ wonBonus }}</span>
        元奖金！
      </div>
    </div>
  </el-dialog>
  <!-- game dialogs end -->
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted, reactive } from "vue";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import { getCurrentStepInit, submitGameStep, getStepRecords } from "@/api/index/promo";
import { useNotify } from "@/hooks/notify";

const store = userStore();
const notify = useNotify();
const router = useRouter();

const gameRulesDialog = ref(false);
const gameRecordsDialog = ref(false);
const wonBonusDialog = ref(false);

const isBtnLoading = ref(false);

const smoothSpinOn = ref(false);
const spinToNum = ref(0);

const wonBonus = ref(0);

const handleSpin = () => {
  isBtnLoading.value = true;

  submitGameStep()
    .then((res) => {
      if (res.code === 0) {
        spinnedStepData.value = res.data;
        handleSmoothSpin(res.data.steps, res.data.currentPlace);
        wonBonus.value = res.data.bonus;
      } else {
        notify({
          type: "error",
          message: res.message
        });
        isBtnLoading.value = false;
      }
    })
    .catch((error) => {
      isBtnLoading.value = false;
      console.error("An unexpected error occurred:", error);
    });
};

const handleSmoothSpin = (steps, currentPlace) => {
  smoothSpinOn.value = true;
  spinToNum.value = 0;

  setTimeout(() => {
    spinToNum.value = steps;
  }, 1000);

  setTimeout(() => {
    smoothSpinOn.value = false;
    handlePlayerStep(currentPlace);
    loadGamePlayerCurrentStepSecond();
    isBtnLoading.value = false;
  }, 3000);
};

const stepData = ref();
const spinLeft = ref(0);
const stepCurrentPlace = ref(0);
const claimedBonus = ref([]);

const spinnedStepData = ref();

const loadGamePlayerCurrentStep = (callback) => {
  getCurrentStepInit().then((res) => {
    const { code, data } = res;

    if (code == 0) {
      stepData.value = data;
      stepCurrentPlace.value = data.currentPlace;
      spinLeft.value = data.availableSpin;
      claimedBonus.value = data.claimedPlaces;

      handlePlayerStepDirect(stepCurrentPlace.value);
    }

    callback && callback();
  });
};

const loadGamePlayerCurrentStepSecond = (callback) => {
  getCurrentStepInit().then((res) => {
    const { code, data } = res;

    if (code == 0) {
      stepData.value = data;
      stepCurrentPlace.value = data.currentPlace;
      spinLeft.value = data.availableSpin;
      claimedBonus.value = data.claimedPlaces;
    }

    callback && callback();
  });
};

const gamePlayerStep = ref(0);
const gamePlayerStepSway = ref(false);

const stepPositionMapping = {
  // Step: {row: x, column: y}
  0: { row: 1, column: 2 },
  1: { row: 1, column: 3 },
  2: { row: 1, column: 4 },
  3: { row: 1, column: 5 },
  4: { row: 1, column: 6 },
  5: { row: 1, column: 7 },
  6: { row: 2, column: 7 },
  7: { row: 3, column: 7 },
  8: { row: 4, column: 7 },
  9: { row: 4, column: 8 },
  10: { row: 4, column: 9 },
  11: { row: 3, column: 9 },
  12: { row: 2, column: 9 },
  13: { row: 1, column: 9 },
  14: { row: 1, column: 10 },
  15: { row: 1, column: 11 },
  16: { row: 1, column: 12 },
  17: { row: 1, column: 13 },
  18: { row: 1, column: 14 },
  19: { row: 1, column: 15 },
  20: { row: 2, column: 15 },
  21: { row: 3, column: 15 },
  22: { row: 4, column: 15 },
  23: { row: 5, column: 15 },
  24: { row: 6, column: 15 },
  25: { row: 6, column: 14 },
  26: { row: 6, column: 13 },
  27: { row: 5, column: 13 },
  28: { row: 4, column: 13 },
  29: { row: 3, column: 13 },
  30: { row: 3, column: 12 },
  31: { row: 3, column: 11 },
  32: { row: 4, column: 11 },
  33: { row: 5, column: 11 },
  34: { row: 6, column: 11 },
  35: { row: 6, column: 10 },
  36: { row: 6, column: 9 },
  37: { row: 6, column: 8 },
  38: { row: 6, column: 7 },
  39: { row: 6, column: 6 },
  40: { row: 6, column: 5 },
  41: { row: 5, column: 5 },
  42: { row: 4, column: 5 },
  43: { row: 3, column: 5 },
  44: { row: 3, column: 4 },
  45: { row: 3, column: 3 },
  46: { row: 4, column: 3 },
  47: { row: 5, column: 3 },
  48: { row: 6, column: 3 },
  49: { row: 6, column: 2 },
  50: { row: 6, column: 1 },
  51: { row: 7, column: 1 },
  52: { row: 8, column: 1 },
  53: { row: 8, column: 2 },
  54: { row: 8, column: 3 },
  55: { row: 8, column: 4 },
  56: { row: 8, column: 5 },
  57: { row: 8, column: 6 },
  58: { row: 8, column: 7 },
  59: { row: 8, column: 8 }
};

const playerPosition = computed(() => {
  return stepPositionMapping[gamePlayerStep.value] || stepPositionMapping[0];
});

let intervalId = null;

const handlePlayerStep = (targetStep) => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  const fastInterval = 100;
  const slowInterval = 500;
  let interval = fastInterval;

  intervalId = setInterval(() => {
    gamePlayerStepSway.value = false;

    const currentStep = gamePlayerStep.value;
    const remainingDistance = targetStep - currentStep;

    if (Math.abs(remainingDistance) <= 5) {
      interval = slowInterval;
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        updateStep(targetStep);
      }, interval);
    }

    updateStep(targetStep);
  }, interval);

  function updateStep(targetStep) {
    const currentStep = gamePlayerStep.value;

    if (currentStep !== targetStep) {
      const stepDirection = currentStep < targetStep ? 1 : -1;
      gamePlayerStep.value += stepDirection;
      if (currentStep !== targetStep) {
        gamePlayerStepSway.value = true;
      }
    } else {
      clearInterval(intervalId);
      intervalId = null;
      gamePlayerStepSway.value = false;

      if (wonBonus.value > 0) {
        setTimeout(() => {
          wonBonusDialog.value = true;
        }, 500);
      }
    }
  }
};

const handlePlayerStepDirect = (targetStep) => {
  gamePlayerStep.value = targetStep;
  gamePlayerStepSway.value = true;
  setTimeout(() => {
    gamePlayerStepSway.value = false;
  }, 500);
};

const dataSource = ref([]);
const pagination = reactive({
  pageSize: 10,
  total: 0,
  current: 0,
  pages: 0,
  pagingState: ""
});

const onGameRecordsDialogClicked = () => {
  gameRecordsDialog.value = true;

  getStepRecordsApi(1);
};

const getStepRecordsApi = (current) => {
  getStepRecords(current).then((res) => {
    const { code, data, message } = res;
    if (code === 0) {
      if (data && data.records && data.records.length) {
        dataSource.value = data.records;

        pagination.pages = data.pages;
        pagination.total = data.total;
        pagination.current = data.current;
      }
    } else {
      notify.error(message)
    }
  });
};

const handleCurrentChange = (val) => {
  pagination.current = val;

  getStepRecordsApi(pagination.current);
};

onMounted(() => {
  if (!store.token) {
    notify({
      message: "请登录后操作",
      type: "error"
    });
    return;
  }
  loadGamePlayerCurrentStep();
});

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped lang="scss">
.stepgame-wrapper {
  background-image: url("../../../assets/images/promotion/hotpromo/cnystepgame2024/stepgame-bg.png");
  padding: 1px 1px 200px;
  background-size: 100% 100%;
  background-position: top center;
  background-repeat: no-repeat;
  background-color: #fedcbd;

  .stepgame-container {
    width: 1400px;
    margin: 0 auto;
  }

  .head-title {
    margin-top: 50px;
    margin-bottom: 50px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      display: block;
      width: 100%;
      max-width: 600px;
    }
  }

  .game-container {
    display: flex;
    justify-content: center;
    position: relative;
  }

  .game-head-title {
    display: flex;
    justify-content: center;
    position: absolute;
    top: -60px;
  }

  .game-spin-wheel-container {
    position: absolute;
    top: calc(100% - 150px);
    right: 00px;

    .game-spin-wheel-frame {
      position: relative;

      img {
        width: 500px;
      }
    }

    .game-spin-wheel {
      position: absolute;
      top: 40px;
      left: 135px;
      width: 230px;
      height: 230px;

      img {
        display: block;
        width: 230px;
      }

      .spin-wheel-board {
        position: absolute;
        top: 0;
        left: 0;
        width: 230px;
        height: 230px;
        transition: transform 1s;
      }

      .spin-wheel-pin {
        position: absolute;
        top: 0;
        left: 0;
        width: 230px;
        height: 230px;
      }

      .spin-wheel-shadow {
        background-image: url("../../../assets/images/promotion/hotpromo/cnystepgame2024/spin-wheel-shadow.png");
        background-size: 100% 100%;
        background-position: center center;
        height: 300px;
        width: 300px;
        position: absolute;
        top: -50px;
        left: -50px;
      }
    }
  }

  .game-btns-container {
    position: absolute;
    display: flex;
    justify-content: center;
    bottom: -195px;
    z-index: 4;
    right: 150px;

    .game-btn {
      position: relative;
      background-size: 100% 100%;
      background-position: center center;
      background-repeat: no-repeat;
      width: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 17px;
      color: #ffffff;
      font-weight: 700;
      line-height: 0;
      padding-bottom: 5px;
      height: 60px;
      background-color: transparent;

      &:hover {
        filter: brightness(0.8);
        cursor: pointer;
      }

      &.disabled,
      &[disabled] {
        filter: brightness(0.4);
        cursor: auto;
      }

      &--01 {
        background-image: url("../../../assets/images/promotion/hotpromo/cnystepgame2024/game-btn-01.png");
      }

      &--02 {
        background-image: url("../../../assets/images/promotion/hotpromo/cnystepgame2024/game-btn-02.png");
      }

      .game-spin-left {
        display: block;
        position: absolute;
        top: 0px;
        right: 62px;
        margin-top: 15px;
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
        z-index: 3;
      }

      img {
        display: block;
        width: 200px;
      }
    }
  }

  .game-item-container {
    display: grid;
    grid-template-columns: repeat(15, 70px); /* 15 columns */
    grid-template-rows: repeat(8, 70px); /* 8 rows */
  }

  .game-item-player {
    z-index: 3;
    height: 70px;
    width: 70px;
    position: relative;
    transition: 0.3s all;

    img {
      display: block;
      top: -50px;
      right: 15px;
      position: absolute;
    }
  }

  .game-item-number {
    height: 70px;
    width: 70px;
    background: #fff0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    line-height: 1;
    color: #000000;

    &:nth-child(even) {
      background: #ffc3c2;
    }

    &--reward {
      img {
        display: block;
        height: 70px;
      }

      &.reward-claimed {
        filter: grayscale(0.8);
      }
    }

    &--start {
      background: #fa4b48 !important;
      font-weight: 700;
      color: #ffffff;
      border-radius: 12px;
      transform: scale(1.1);
    }

    span {
      z-index: 2;
    }
  }
}

.game-side-btns-container {
  position: fixed;
  right: 0;
  top: 30%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .game-side-btn {
    cursor: pointer;

    &:hover {
      filter: brightness(0.8);
    }

    img {
      display: block;
      width: 80px;
    }
  }
}

.sway {
  animation: sway 0.5s ease-in-out infinite;
}

@keyframes sway {
  0%,
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  50% {
    transform: translateY(5px) scale(0.95) rotate(10deg);
  }
}

.shadow-spin {
  animation: shadowSpin 3s infinite;
}

@keyframes shadowSpin {
  0% {
    transform: scale(1) rotate(-45deg);
    opacity: 0.75;
  }
  25% {
    transform: scale(1.25) rotate(-45deg);
    opacity: 1;
  }
  50% {
    transform: scale(1) rotate(-45deg);
    opacity: 0.75;
  }
  75% {
    transform: scale(1.25) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(-45deg);
    opacity: 0.75;
  }
}

.smooth-spin {
  animation: smoothSpin 3s forwards;
}

.spin-to--3 {
  transform: rotate(0deg);
}

.spin-to--2 {
  transform: rotate(-35deg);
}

.spin-to--1 {
  transform: rotate(-70deg);
}

.spin-to-0 {
  transform: rotate(-105deg);
}

.spin-to-1 {
  transform: rotate(-145deg);
}

.spin-to-2 {
  transform: rotate(-180deg);
}

.spin-to-3 {
  transform: rotate(140deg);
}

.spin-to-4 {
  transform: rotate(105deg);
}

.spin-to-5 {
  transform: rotate(70deg);
}

.spin-to-6 {
  transform: rotate(35deg);
}

@keyframes smoothSpin {
  0% {
    transform: rotate(0deg);
    animation-timing-function: ease-in;
  }
  60% {
    transform: rotate(900deg);
    animation-timing-function: ease-out;
  }
  70% {
    transform: rotate(1035deg);
    animation-timing-function: ease-out;
  }
  100% {
    transform: rotate(1080deg);
  }
}
</style>

<style lang="scss">
// dialog styling
.game-dialog {
  background-color: #ffeacf;
  border-radius: 12px;

  .dialog-header {
    display: flex;
    justify-content: center;
    margin-top: -95px;

    img {
      width: 350px;
      display: block;
    }
  }

  .dialog-body {
    color: #000000;
    font-size: 16px;

    ol {
      li {
        position: relative;
        margin-bottom: 10px;
      }
    }

    &.step-history-body {
      .el-table {
        .cell {
          text-align: center;
        }
      }
    }

    &.won-bonus-body {
      background-image: url("../../../assets/images/promotion/hotpromo/cnystepgame2024/won-bonus.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      height: 600px;
      width: calc(100% + 40px);
      margin: -50px -20px -30px;
    }

    .won-txt {
      font-size: 40px;
      padding-top: 70px;
      color: #000;
      text-align: center;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      font-weight: 700;

      span {
        font-size: 150%;
        color: #bc0629;
      }
    }
  }

  .el-dialog__headerbtn {
    top: -20px !important;
    right: -20px !important;

    .el-dialog__close {
      background: #b0031d;
      border-radius: 50%;
      border: 2px solid #fdcf35;

      color: #fdcf35 !important;
      height: 40px !important;
      width: 40px !important;
    }
  }
}
</style>
