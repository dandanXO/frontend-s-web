<template>
  <div class="stepgame-wrapper" id="id-stepgame-wrapper" :class="'step-' + currentStage">
    <div class="stepgame-container" id="id-stepgame-container">
      <div class="game-container" id="id-game-container">
        <div class="game-header">
          <img src="../../../assets/images/promo/hotpromo/lh-step-game/game-header-01.png" v-if="currentStage === 1" />

          <img src="../../../assets/images/promo/hotpromo/lh-step-game/game-header-02.png" v-if="currentStage === 2" />
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
            <img :src="require(`../../../assets/images/promo/hotpromo/lh-step-game/player-pin-game${currentStage}.png`)">
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
                    :src="require(`../../../assets/images/promo/hotpromo/lh-step-game/game-btn-reward-${step}.png`)" v-if="step !== '59'"
                  />

                  <img :src="require(`../../../assets/images/promo/hotpromo/lh-step-game/game-btn-reward-${step}-game${currentStage}.png`)" v-else>
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

    <div class="game-btns-container">
      <button class="game-btn game-btn--01" @click="router.push('/finance/deposit')">去存款</button>
      <button class="game-btn game-btn--02" :disabled="isBtnLoading" @click="handleSpin">开始闯关</button>
    </div>

    <div class="game-spin-left">可转动次数：{{ spinLeft }}</div>

    <div class="game-spin-wheel-container">
      <!-- <div class="game-spin-wheel-frame">
        <img src="../../../assets/images/promo/hotpromo/lh-step-game/spin-wheel-frame.png" />
      </div> -->
      <div class="game-spin-wheel">
        <div class="spin-wheel-shadow" :class="smoothSpinOn && 'shadow-spin'"></div>
        <div class="spin-wheel-board" :class="smoothSpinOn && 'smooth-spin'">
          <div style="transition: 1s all" :class="`spin-to-${spinToNum}`">
            <img src="../../../assets/images/promo/hotpromo/lh-step-game/spin-wheel-board.png" />
          </div>
        </div>
        <div class="spin-wheel-pin">
          <img src="../../../assets/images/promo/hotpromo/lh-step-game/spin-wheel-pin.png" />
        </div>
      </div>
    </div>
  </div>

  <div class="game-side-btns-container">
    <div class="game-side-btn" @click="gameRulesDialog = true">
      <img src="../../../assets/images/promo/hotpromo/lh-step-game/side-btn-01.png" />
    </div>
    <div class="game-side-btn" @click="openRecordDialog()">
      <img src="../../../assets/images/promo/hotpromo/lh-step-game/side-btn-02.png" />
    </div>
  </div>

  <!-- game dialogs start -->
  <q-dialog v-model="gameRulesDialog" width="500px" align-center class="game-dialog">
    <div class="dialog-html">
      <div class="dialog-header">
        <div class="game-header-title">活动规则</div>
        <div class="dialog-close">
          <q-btn
            @click="gameRecordsDialog = false"
            v-close-popup
            rounded
            class="close-btn"
            icon="close"
            height="30"
            width="30"
          ></q-btn>
        </div>
      </div>
      <div class="dialog-body">
        <div class="dialog-list" v-html="pageContent"></div>
      </div>
    </div>
  </q-dialog>

  <q-dialog v-model="gameRecordsDialog" width="500px" align-center class="game-dialog">
    <div class="dialog-html">
      <div class="dialog-header">
        <div class="game-header-title">转动记录</div>
        <div class="dialog-close">
          <q-btn
            @click="gameRecordsDialog = false"
            v-close-popup
            rounded
            class="close-btn"
            icon="close"
            height="30"
            width="30"
          ></q-btn>
        </div>
      </div>
      <div class="dialog-body">
        <q-select filled v-model="stageValue" :options="stageOptions" @update:model-value="handleStageChange">
          <template v-slot:selected>
            {{ stageValue.label }}
          </template>
        </q-select>

        <q-table
          :columns="columns"
          :rows="stepRecords"
          no-data-label="暂无资料"
          :rows-per-page-options="[0]"
          :hide-pagination="false"
        ></q-table>

        <q-pagination
          @update:model-value="handleCurrentChange"
          v-model="pagination.current"
          :max="pagination.max"
          direction-links
          flat
          color="grey"
          active-color="primary"
        />
      </div>
    </div>
  </q-dialog>

  <q-dialog v-model="wonBonusDialog" width="500px" align-center class="game-dialog">
    <div class="dialog-html">
      <div class="dialog-header">
        <div class="game-header-title">中奖啦</div>
        <div class="dialog-close">
          <q-btn
            @click="wonBonusDialog = false"
            v-close-popup
            rounded
            class="close-btn"
            icon="close"
            height="30"
            width="30"
          ></q-btn>
        </div>
      </div>
      <div class="dialog-body won-bonus-body">
        <div class="won-txt">
          恭喜您获得
          <span>{{ wonBonus }}</span>
          元奖金！
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog v-model="endStepDialog" width="500px" align-center class="game-dialog">
    <div class="dialog-html">
      <div class="dialog-header">
        <div class="game-header-title">完成啦</div>
        <div class="dialog-close">
          <q-btn
            @click="endStepDialog = false"
            v-close-popup
            rounded
            class="close-btn"
            icon="close"
            height="30"
            width="30"
          ></q-btn>
        </div>
      </div>

      <div class="dialog-body end-step">
        <div class="won-txt notoppadding">恭喜您完成了这个游戏！</div>

        <button class="game-btn" @click="endStepDialog = false">继续闯关</button>
      </div>
    </div>
  </q-dialog>
  <!-- game dialogs end -->
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted, reactive, defineProps } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { getCurrentStepInit, submitGameStep, getStepRecords } from "../../../api/index/promo";
import moment from "moment";

defineProps(["pageContent"]);

const store = userStore();
const router = useRouter();
const gameRulesDialog = ref(false);
const gameRecordsDialog = ref(false);
const wonBonusDialog = ref(false);
const endStepDialog = ref(false);
const wonBonus = ref(0);
const isBtnLoading = ref(false);
const smoothSpinOn = ref(false);
const spinToNum = ref(0);

const stageValue = ref({
  value: 1,
  label: "第1阶段"
});
const stageOptions = ref([]);

const stepRecords = ref([]);
const pagination = reactive({
  pageSize: 10,
  total: 0,
  current: 0,
  pages: 0,
  pagingState: "",
  max: 0
});
const openRecordDialog = () => {
  gameRecordsDialog.value = true;

  getStepRecordsApi(1, stageValue.value.value);
};

const handleCurrentChange = (val) => {
  pagination.current = val;

  getStepRecordsApi(pagination.current, stageValue.value.value);
};

const getStepRecordsApi = (current, stage) => {
  getStepRecords(current, stage).then((res) => {
    const { code, data } = res;
    if (code === 0) {
      if (data && data.records && data.records.length) {
        stepRecords.value = data.records;

        stepRecords.value.forEach((records) => {
          records.createTime = moment(records.createTime).format("MM-DD HH:mm:ss");
        });

        pagination.pages = data.pages;
        pagination.total = data.total;
        pagination.current = data.current;
        pagination.max = Math.ceil(pagination.total / pagination.pageSize);
      }
    }
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
const stepEndPlace = ref(0);
const claimedBonus = ref([]);
const currentStage = ref(1);

const spinnedStepData = ref();

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
  0: { row: 1, column: 1 },
  1: { row: 1, column: 2 },
  2: { row: 1, column: 3 },
  3: { row: 1, column: 4 },
  4: { row: 1, column: 5 },
  5: { row: 1, column: 6 },
  6: { row: 1, column: 7 },
  7: { row: 2, column: 7 },
  8: { row: 3, column: 7 },
  9: { row: 3, column: 6 },
  10: { row: 3, column: 5 },
  11: { row: 3, column: 4 },
  12: { row: 3, column: 3 },
  13: { row: 3, column: 2 },
  14: { row: 3, column: 1 },
  15: { row: 4, column: 1 },
  16: { row: 5, column: 1 },
  17: { row: 5, column: 2 },
  18: { row: 5, column: 3 },
  19: { row: 5, column: 4 },
  20: { row: 5, column: 5 },
  21: { row: 5, column: 6 },
  22: { row: 5, column: 7 },
  23: { row: 6, column: 7 },
  24: { row: 7, column: 7 },
  25: { row: 7, column: 6 },
  26: { row: 7, column: 5 },
  27: { row: 7, column: 4 },
  28: { row: 7, column: 3 },
  29: { row: 7, column: 2 },
  30: { row: 7, column: 1 },
  31: { row: 8, column: 1 },
  32: { row: 9, column: 1 },
  33: { row: 9, column: 2 },
  34: { row: 9, column: 3 },
  35: { row: 9, column: 4 },
  36: { row: 9, column: 5 },
  37: { row: 9, column: 6 },
  38: { row: 9, column: 7 },
  39: { row: 10, column: 7 },
  40: { row: 11, column: 7 },
  41: { row: 11, column: 6 },
  42: { row: 11, column: 5 },
  43: { row: 11, column: 4 },
  44: { row: 11, column: 3 },
  45: { row: 11, column: 2 },
  46: { row: 11, column: 1 },
  47: { row: 12, column: 1 },
  48: { row: 13, column: 1 },
  49: { row: 13, column: 2 },
  50: { row: 13, column: 3 },
  51: { row: 13, column: 4 },
  52: { row: 13, column: 5 },
  53: { row: 13, column: 6 },
  54: { row: 13, column: 7 },
  55: { row: 14, column: 7 },
  56: { row: 15, column: 7 },
  57: { row: 15, column: 6 },
  58: { row: 15, column: 5 },
  59: { row: 15, column: 4 }
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

const columns = [
  {
    label: "日期",
    field: "createTime",
    align: "center"
  },
  {
    label: "转动步数",
    field: "steps",
    align: "center"
  },
  {
    label: "位置",
    field: "currentPlace",
    align: "center"
  },
  {
    label: "获得奖金",
    field: "bonus",
    align: "center"
  }
];

onMounted(() => {
  loadGamePlayerCurrentStep();

  resizeGame();
  window.addEventListener(
    "resize",
    function () {
      resizeGame();
    },
    true
  );
});

const resizeGame = () => {
  var currentWidth = window.innerWidth;
  var gameEle = document.getElementById("id-game-container");
  if (currentWidth < 500) {
    var scaleVar = currentWidth / 500;

    gameEle.style.transformOrigin = "left top";
    gameEle.style.transform = `scale(${scaleVar})`;

    var marginTopVar = 170 * scaleVar;
    gameEle.style.marginTop = `${marginTopVar}px`;

    var ptTopVar = 110 * scaleVar;
    gameEle.style.paddingBottom = `${ptTopVar}px`;

    var wrapperEle = document.getElementById("id-stepgame-wrapper");
    var containerEle = document.getElementById("id-stepgame-container");
    // if (currentWidth > 410) {
    //   // var pdTopVar = 0 * scaleVar;
    //   wrapperEle.style.paddingBottom = `100px`;
    // } else {
    //   wrapperEle.style.paddingBottom = `0px`;
    // }
    // if (currentWidth < 400) {
    //   var mbVar = 500 - currentWidth;
    //   containerEle.style.marginBottom = `-${mbVar}px`;
    // } else {
    //   containerEle.style.marginBottom = `0px`;
    // }
  }
};

const handleStageChange = () => {
  getStepRecordsApi(pagination.current, stageValue.value.value);
};

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped lang="scss">
.stepgame-wrapper {
  background-image: url("../../../assets/images/promo/hotpromo/lh-step-game/game1-bg.jpg");
  padding: 1px 1px 0px;
  background-size: 100% auto;
  background-position: top center;
  background-repeat: no-repeat;
  // background-attachment: fixed;
  background-color: #042212;

  &.step-2 {
    background-image: url("../../../assets/images/promo/hotpromo/lh-step-game/game2-bg.jpg");

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
    width: 500px;
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
    width: calc(100% - 28px);
    margin: auto;
    margin-top: 115px;
    padding: 50px 12px 200px;
    border-radius: 20px;
  }

  .game-header {
    position: absolute;
    top: -24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .game-head-title {
    display: flex;
    justify-content: center;
    position: absolute;
    top: -60px;
  }

  .game-spin-wheel-container {
    position: fixed;
    //right: 5px;
    bottom: -10px;
    z-index: 10;
    width: 300px;
    max-width: 300px;
    left: 50%;
    margin-left: -150px;
    //right: 20%;
    aspect-ratio: 291/254;

    .game-spin-wheel-frame {
      position: relative;

      > img {
        width: 100%;
      }
    }

    .game-spin-wheel {
      position: absolute;
      top: 10px;
      left: 50%;
      margin-left: -75px;
      width: 150px;
      height: 150px;

      img {
        display: block;
        width: 150px;
      }

      .spin-wheel-board {
        position: absolute;
        left: 0;
        top: 0px;
        width: 150px;
        height: 150px;
        transition: transform 1s;
      }

      .spin-wheel-pin {
        position: absolute;
        top: 0;
        left: 0;
        top: 0px;
        width: 150px;
        height: 150px;
        z-index: 20;
      }

      .spin-wheel-shadow {
        background-image: url("../../../assets/images/promo/hotpromo/lh-step-game/spin-wheel-shadow.png");
        background-size: 100% 100%;
        background-position: center center;
        height: 200px;
        width: 200px;
        position: absolute;
        top: -25px;
        left: -25px;
      }
    }
  }

  .game-spin-left {
    position: fixed;
    text-align: center;
    display: flex;
    justify-content: center;
    color: #7a80a1;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 1);
    font-weight: bold;
    bottom: 70px;
    margin: auto;
    width: 100%;
  }

  .game-btns-container {
    position: fixed;
    display: flex;
    justify-content: center;
    bottom: 80px;
    z-index: 25;
    width: 100%;
    max-width: 500px;
    gap: 150px;
    margin-left: auto;
    margin-right: auto;

    .game-btn {
      position: relative;
      background-size: 100% 100%;
      background-position: center center;
      background-repeat: no-repeat;
      width: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #351102;
      font-weight: 700;
      line-height: 0;
      padding-bottom: 5px;
      aspect-ratio: 183/54;
      height: 45px;
      background-color: transparent;
      border: 0;

      &:hover {
        filter: brightness(0.8);
        cursor: pointer;
      }

      &.disabled,
      &[disabled] {
        filter: brightness(0.8);
        cursor: auto;
      }

      &--01 {
        background-image: url("../../../assets/images/promo/hotpromo/lh-step-game/game-btn-01.png");
      }

      &--02 {
        background-image: url("../../../assets/images/promo/hotpromo/lh-step-game/game-btn-02.png");
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
    grid-template-columns: repeat(7, 65px); /* 15 columns */
    grid-template-rows: repeat(9, 65px); /* 8 rows */
  }

  .game-item-player {
    z-index: 3;
    height: 65px;
    width: 65px;
    position: relative;
    transition: 0.3s all;

    img {
      display: block;
      top: -28px;
      right: 0px;
      position: absolute;
    }
  }

  .game-item-number {
    height: 65px;
    width: 65px;
    background: #ffe2d5;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    line-height: 1;
    color: #b10e0e;

    &:nth-child(even) {
      background: #ff3e3e;
      color: #ffffff;
    }

    &--reward {
      img {
        display: block;
        height: 60px;
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
  bottom: 30%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 120;
  width: 60px;
  height: 60px;

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
  // background-color: #ffeacf;
  border-radius: 12px;

  .dialog-header {
    display: flex;
    justify-content: center;
    top: 40px;
    position: relative;
    width: 100%;
    // height: 100px;

    .game-header-title {
      background-image: url("../../../assets/images/promo/hotpromo/lh-step-game/game-header-frame.png");
      background-size: 100% 100%;
      width: 240px;
      height: 70px;
      padding-bottom: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 1px;
    }

    .dialog-close {
      position: absolute;
      right: 8px;
      bottom: 28px;
      width: 32px;
      height: 32px;

      .close-btn {
        width: 32px;
        height: 32px;
        background: #ccc;
        color: #ffffff;
        border: 2px solid #ffffff;
      }
    }

    img {
      //   position: absolute;
      //   top: 0px;
      //   left: 15vw;
      //   width: 70vw;
      // aspect-ratio: 340/111;
      display: block;
      width: 70%;
    }
  }

  .dialog-html {
    width: 100%;
    height: 100%;
    max-height: 100% !important;
    position: relative;
  }

  .dialog-body {
    color: #000000;
    font-size: 16px;
    // background: #ffeacf;
    background: linear-gradient(180deg, #ffffff 0%, #c6e8fb 100%);
    border-radius: 20px;
    width: calc(100% - 30px);
    padding: 40px 10px 30px;
    //max-height: calc(100vh - 240px);
    min-height: calc(85vh);
    margin: 0 auto 20px;

    &.end-step {
      min-height: 0;
    }

    ol {
      margin-top: 0px;

      li {
        //position: relative;
        margin-bottom: 10px;
      }
    }

    .dialog-list {
      overflow: scroll;
      width: 100%;
      margin-top: 10px;
    }

    &.won-bonus-body {
      background-image: url("../../../assets/images/promo/hotpromo/lh-step-game/won-bonus.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      //height: 600px;
      width: calc(100% - 40px);
      min-height: auto;
      margin: 0 auto;
      aspect-ratio: 10/12;
    }

    .won-txt {
      font-size: 30px;
      padding-top: 10px;
      color: #000;
      text-align: center;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      font-weight: 700;

      span {
        font-size: 150%;
        color: #bc0629;
      }
    }

    .q-table td {
      padding: 5px 6px;
    }

    .game-btn {
      position: relative;
      background-size: 100% 100%;
      background-position: center center;
      background-repeat: no-repeat;
      width: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #ffffff;
      font-weight: 700;
      line-height: 0;
      padding-bottom: 5px;
      aspect-ratio: 183/54;
      height: 45px;
      background-color: transparent;
      border: 0;
      background-image: url("../../../assets/images/promo/hotpromo/lh-step-game/game-btn-01.png");
      margin: 12px auto 0;

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

  .el-dialog__headerbtn {
    top: -20px !important;
    right: -20px !important;

    .el-dialog__close {
      background: #00000033;
      border-radius: 50%;
      border: 2px solid #ffffff;

      color: #ffffff !important;
      height: 40px !important;
      width: 40px !important;
    }
  }
}
</style>
