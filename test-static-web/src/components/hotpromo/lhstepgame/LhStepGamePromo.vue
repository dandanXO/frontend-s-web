<template>
  <div class="stepgame-wrapper" :class="'step-' + currentStage">
    <div class="stepgame-container">
      <div class="head-title">
        <img src="../../../assets/images/promotion/hotpromo/lh-step-game/head-title-01.png" />
      </div>

      <div class="game-container">
        <div class="game-header">
          <img
            src="../../../assets/images/promotion/hotpromo/lh-step-game/game-header-01.png"
            v-if="currentStage === 1"
          />

          <img
            src="../../../assets/images/promotion/hotpromo/lh-step-game/game-header-02.png"
            v-if="currentStage === 2"
          />
        </div>

        <!-- <div class="game-header-img">
          <img src="../../../assets/images/promotion/hotpromo/lh-step-game/stepgame-top-img.png" />
        </div> -->

        <!-- <div class="game-btns-container">
          <button class="game-btn game-btn--01" :disabled="isBtnLoading" @click="handleSpin">
            转盘次数 ({{ spinLeft }})
          </button>
        </div> -->

        <div class="game-item-container">
          <div
            class="game-item-player"
            :class="gamePlayerStepSway && 'sway'"
            :style="{
              'grid-row': playerPosition.row,
              'grid-column': playerPosition.column
            }"
          >
            <img :src="require(`../../../assets/images/promotion/hotpromo/lh-step-game/player-pin-game${currentStage}.png`)">
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
                    :src="require(`../../../assets/images/promotion/hotpromo/lh-step-game/game-btn-reward-${step}.png`)" v-if="step !== '59'"
                  />

                  <img :src="require(`../../../assets/images/promotion/hotpromo/lh-step-game/game-btn-reward-${step}-game${currentStage}.png`)" v-else>
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

        <div class="game-spin-wheel-container">
          <div>
            <div class="game-spin-wheel">
              <div class="spin-wheel-shadow" :class="smoothSpinOn && 'shadow-spin'"></div>
              <div class="spin-wheel-board" :class="smoothSpinOn && 'smooth-spin'">
                <div style="transition: 1s all" :class="`spin-to-${spinToNum}`">
                  <img src="../../../assets/images/promotion/hotpromo/lh-step-game/spin-wheel-board.png" />
                </div>
              </div>
              <div class="spin-wheel-pin">
                <img src="../../../assets/images/promotion/hotpromo/lh-step-game/spin-wheel-pin.png" />
              </div>
            </div>
          </div>

          <div class="game-spin-left-details">可用转动次数：{{ spinLeft }}次</div>

          <div class="game-spin-btns-container">
            <button class="game-pointer game-pointer--02" :disabled="isBtnLoading" @click="handleSpin">开始闯关</button>
            <button class="game-pointer game-pointer--01" @click="router.push('/center/deposit')">去存款</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="game-side-btns-container">
    <div class="game-side-btn" @click="gameRulesDialog = true">
      <img src="../../../assets/images/promotion/hotpromo/lh-step-game/side-btn-01.png" />
    </div>
    <div class="game-side-btn" @click="onGameRecordsDialogClicked()">
      <img src="../../../assets/images/promotion/hotpromo/lh-step-game/side-btn-02.png" />
    </div>
  </div>

  <!-- game dialogs start -->
  <el-dialog v-model="gameRulesDialog" width="1000px" align-center :close-on-click-modal="false" class="game-dialog">
    <div class="dialog-header">
      <div class="game-header-title">活动规则</div>
    </div>
    <div class="dialog-body" v-html="pageContent"></div>
  </el-dialog>

  <el-dialog v-model="gameRecordsDialog" width="1000px" align-center :close-on-click-modal="false" class="game-dialog">
    <div class="dialog-header">
      <div class="game-header-title">转动记录</div>
    </div>
    <div class="dialog-body step-history-body">
      <el-select v-model="stageValue" size="large" style="width: 120px; margin-bottom: 12px">
        <el-option
          v-for="item in stageOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          @click="onGameRecordsDialogClicked"
        />
      </el-select>

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
      <div class="game-header-title">中奖啦</div>
    </div>
    <div class="dialog-body won-bonus-body">
      <div class="won-txt">
        恭喜您获得
        <span>{{ wonBonus }}</span>
        元奖金！
      </div>
    </div>
  </el-dialog>

  <el-dialog v-model="endStepDialog" width="1000px" align-center :close-on-click-modal="false" class="game-dialog">
    <div class="dialog-header">
      <div class="game-header-title">完成啦</div>
    </div>
    <div class="dialog-body">
      <div class="won-txt notoppadding">恭喜您完成了这个游戏！</div>

      <button class="game-btn" @click="endStepDialog = false">继续闯关</button>
    </div>
  </el-dialog>
  <!-- game dialogs end -->
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted, reactive, defineProps } from "vue";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import { getCurrentStepInit, submitGameStep, getStepRecords } from "@/api/index/promo";
import { ArrowDown } from "@element-plus/icons-vue";
import { useNotify } from "@/hooks/notify";


defineProps(["pageContent"]);

const store = userStore();
const notify = useNotify();
const router = useRouter();
const gameRulesDialog = ref(false);
const gameRecordsDialog = ref(false);
const wonBonusDialog = ref(false);
const endStepDialog = ref(false);
const isBtnLoading = ref(false);
const smoothSpinOn = ref(false);
const spinToNum = ref(0);
const wonBonus = ref(0);
const stepData = ref();
const spinLeft = ref(0);
const stepCurrentPlace = ref(0);
const stepEndPlace = ref(0);
const claimedBonus = ref([]);
const currentStage = ref(1);
const spinnedStepData = ref();
const stageValue = ref(1);
const stageOptions = ref([]);

const loadGamePlayerCurrentStep = (callback) => {
  getCurrentStepInit().then((res) => {
    const { code, data } = res;

    if (code == 0) {
      stepData.value = data;
      stepCurrentPlace.value = data.currentPlace;
      spinLeft.value = data.availableSpin;
      claimedBonus.value = data.claimedPlaces;
      currentStage.value = data.currentStage;

      stageOptions.value = [];

      for (let i = 1; i <= currentStage.value; i++) {
        stageOptions.value.push({
          value: i,
          label: `第${i}阶段`
        });
      }

      handlePlayerStepDirect(stepCurrentPlace.value);
    }

    callback && callback();
  });
};

const handleSpin = () => {
  isBtnLoading.value = true;

  const param = { stage: "" };
  param.stage = currentStage.value;
  submitGameStep(param)
    .then((res) => {
      if (res.code === 0) {
        spinnedStepData.value = res.data;
        handleSmoothSpin(res.data.steps, res.data.currentPlace);
        wonBonus.value = res.data.bonus;
        stepEndPlace.value = res.data.endPlace;
        if (stepCurrentPlace.value === stepEndPlace.value) {
          console.log("end");
          currentStage.value = currentStage.value + 1;
        }
      } else {
        isBtnLoading.value = false;
        notify(res.message)
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

const loadGamePlayerCurrentStepSecond = (callback) => {
  getCurrentStepInit().then((res) => {
    const { code, data } = res;

    if (code == 0) {
      stepData.value = data;
      stepCurrentPlace.value = data.currentPlace;
      spinLeft.value = data.availableSpin;
      claimedBonus.value = data.claimedPlaces;
      currentStage.value = data.currentStage;

      stageOptions.value = [];

      for (let i = 1; i <= currentStage.value; i++) {
        stageOptions.value.push({
          value: i,
          label: `第${i}阶段`
        });
      }
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

      if (currentStep === stepEndPlace.value) {
        setTimeout(() => {
          endStepDialog.value = true;
          gamePlayerStep.value = 0;
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
  getStepRecordsApi(1, stageValue.value);
};

const getStepRecordsApi = (current, stage) => {
  getStepRecords(current, stage).then((res) => {
    const { code, data } = res;
    if (code === 0) {
      if (data && data.records && data.records.length) {
        dataSource.value = data.records;

        pagination.pages = data.pages;
        pagination.total = data.total;
        pagination.current = data.current;
      }
    }
  });
};

const handleCurrentChange = (val) => {
  pagination.current = val;

  getStepRecordsApi(pagination.current, stageValue.value);
};

onMounted(() => {
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
  background-image: url("../../../assets/images/promotion/hotpromo/lh-step-game/game1-bg.png");
  padding: 1px 1px 100px;
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  background-color: #fedcbd;

  &.step-2 {
    background-image: url("../../../assets/images/promotion/hotpromo/lh-step-game/game2-bg.png");

    .game-spin-wheel-container {
      border: 2px solid #f9dd94;
    }

    .game-container {
      border: 2px solid #f9dd94;
    }

    .game-item-number {
      background: #fffba0;

      &:nth-child(even) {
        background: #ffb763;
      }

      &--start {
        background: #ff5620 !important;
      }
    }
  }

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
    background: rgba(43, 8, 8, 0.6);
    border-radius: 36px;
    border: 2px solid #ed4f4f;
  }

  .game-header {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .game-header-img {
    position: absolute;
    top: -230px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;

    img {
      display: block;
      width: 1400px;
    }
  }

  .game-head-title {
    display: flex;
    justify-content: center;
    position: absolute;
    top: -60px;
  }

  .game-spin-wheel-container {
    // position: absolute;
    // top: calc(100% - 150px);
    // right: 00px;
    background: rgba(43, 8, 8, 0.6);
    margin-left: auto;
    border: 2px solid #ed4f4f;
    border-radius: 30px;
    padding: 20px 30px;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;

    .game-spin-left-details {
      display: flex;
      justify-content: center;
      text-align: center;
      font-size: 16px;
      color: #ffffff;
      margin-top: 16px;
    }
    .game-spin-btns-container {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 200px;

      .game-pointer {
        cursor: pointer;
        height: 50px;
        width: 170px;
        color: #351102;
        font-weight: 700;
        background-size: 100% 100%;
        font-size: 20px;
        line-height: 1;
        border-radius: 12px;
        background-color: transparent;

        &:hover {
          filter: brightness(0.8);
        }

        &--01 {
          background-image: url("../../../assets/images/promotion/hotpromo/lh-step-game/game-btn-01.png");
        }

        &--02 {
          background-image: url("../../../assets/images/promotion/hotpromo/lh-step-game/game-btn-02.png");
        }
      }

      img {
        display: block;
        width: 100%;
      }
    }

    .game-spin-wheel-frame {
      position: relative;

      img {
        width: 500px;
      }
    }

    .game-spin-wheel {
      // position: absolute;
      // top: 40px;
      // left: 135px;
      position: relative;

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
        z-index: 20;
      }

      .spin-wheel-shadow {
        background-image: url("../../../assets/images/promotion/hotpromo/lh-step-game/spin-wheel-shadow.png");
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
        background-image: url("../../../assets/images/promotion/hotpromo/lh-step-game/game-btn-01.png");
      }

      &--02 {
        background-image: url("../../../assets/images/promotion/hotpromo/lh-step-game/game-btn-02.png");
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
    grid-template-rows: repeat(8, 55px); /* 8 rows */

    padding: 50px 20px;
    // background: teal;
  }

  .game-item-player {
    z-index: 3;
    height: 55px;
    width: 70px;
    position: relative;
    transition: 0.3s all;

    img {
      display: block;
      top: -60px;
      right: -15px;
      position: absolute;
    }
  }

  .game-item-number {
    height: 55px;
    width: 70px;
    background: #ffe2d5;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    line-height: 1;
    color: #b10e0e;

    &:nth-child(even) {
      background: #ff3e3e;
      color: #ffffff;
    }

    &--reward {
      img {
        display: block;
        height: 50px;
      }

      &.reward-claimed {
        filter: grayscale(0.8);
      }
    }

    &--start {
      background: #ed0909 !important;
      font-weight: 700;
      color: #ffffff;
      border-radius: 12px;
      transform: scale(1.3);
      margin-left: -6px;
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
  background: linear-gradient(180deg, #ffffff 0%, #c6e8fb 100%);
  border-radius: 12px;

  .dialog-header {
    display: flex;
    justify-content: center;
    margin-top: -95px;

    .game-header-title {
      background-image: url("../../../assets/images/promotion/hotpromo/lh-step-game/game-header-frame.png");
      background-size: 100% 100%;
      width: 390px;
      height: 100px;
      padding-bottom: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 1px;
      font-size: 22px;
    }

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
      background-image: url("../../../assets/images/promotion/hotpromo/lh-step-game/won-bonus.png");
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

      &.notoppadding {
        padding-top: 0;
      }

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
      background: #ccc;
      border-radius: 50%;
      border: 2px solid #ffffff;

      color: #ffffff !important;
      height: 40px !important;
      width: 40px !important;
    }
  }

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
    background-image: url("../../../assets/images/promotion/hotpromo/lh-step-game/game-btn-01.png");
    margin: 30px auto 0;

    &:hover {
      filter: brightness(0.8);
      cursor: pointer;
    }

    &.disabled,
    &[disabled] {
      filter: brightness(0.4);
      cursor: auto;
    }
  }
}
</style>
