<template>
  <div style="width: 100%; height: 100%;padding-top: 14px;">
    <img style="border-radius: 12px;" src="./img/N-title.jpg" />
  </div>
  <div class="wheel-stage-wrapper">
    <!-- <div class="plant-bg">
      <img src="./img/N-bg.png" >
    </div> -->
    <div class="wheel-wrapper">
      <!-- <img
              class="decoration penguin"
              src="../../../assets/images/promotion/spin-lucky-wheel/decoration-penguin.png"
            />
            <img
              class="decoration ox"
              src="../../../assets/images/promotion/spin-lucky-wheel/decoration-ox.png"
            /> -->
      <div class="wheel-inner-wrapper">
        <img
          ref="spinWheelRef"
          class="wheel"
          src="./img/wheel-bg.png"
        />
        <!-- <img class="indicate" src="./img/wheel-arraw.png" /> -->
        <button class="btn" :class="{ disabled: !info.availableSpin }" @click="handleWheelClick">
          {{ info.availableSpin }}
        </button>
      </div>

      <!-- <img
              class="decoration tiger"
              src="../../../assets/images/promotion/spin-lucky-wheel/decoration-tiger.png"
            />
            <img
              class="decoration rabbit"
              src="../../../assets/images/promotion/spin-lucky-wheel/decoration-rabbit.png"
            /> -->

      <!-- <span v-if="isWheelEnded" class="next-spin-remaining-time">{{ $t("hotPromo.this_round_has_ended") }}</span> -->
      <!-- <span v-if="!isWheelEnded" class="next-spin-remaining-time">
        {{ $t("hotPromo.countdown_to_next_free_spins") }}: {{ nextFreeSpinRemainingTime }}
      </span> -->
    </div>

    <!-- <div class="winning-record-outer-wrapper">
      <div ref="winningRecordRef" class="winning-record-wrapper">
        <template v-if="winningRecord.length">
          <div v-for="(record, index) in winningRecord" :key="index" class="winning-record-item">
            <span>{{ moment(record.recordTime).format("MM-DD HH:mm:ss") }}</span>
            <span class="name">{{ record.loginName }}</span>
            <span>
              {{ $t("hotPromo.receive") }}
              <span class="amount">{{ store.currency.value }}{{ record.bonus }}</span>
            </span>
          </div>
        </template>
        <div v-else class="no-record-text">{{ $t("hotPromo.no_records") }}</div>
      </div>
    </div> -->
    <div class="history-component">
        <div class="history-header">
            <img style="width: 80%;position: relative;top: -6px;" src="./img/N-table-tittle.png"> 
        </div>
        <div class="history-table-container" ref="historyTableContainer">
          <table>
            <thead>
              <tr>
                <!-- <th style="height:40px; background: #6D0000; opacity: 0.5;">ID</th> -->
                <th style="background: #6D0000; opacity: 0.5;">Horário</th>
                <th style="background: #6D0000; opacity: 0.5;">Prêmio</th>
              </tr>
            </thead>
            <tbody class="history-tbody-scroll">
              <tr v-for="(record, index) in winningRecord.records" :key="record.recordTime">
                <!-- <td style="border:0px; background: #270001;" :class="index === 0 ? 'history-td-br-left' : ''">{{ record.loginName }}</td> -->
                <td style="border:0px; background: #270001; border-left: solid 1px #2e3039; border-right: solid 1px #2e3039;" :class="index === winningRecord.length - 1 ? 'history-td-br-right' : ''">{{ record.recordTime && moment(record.recordTime).format("YYYY-MM-DD HH:mm:ss") }}</td>
                <td style="border:0px; background: #270001;">R${{ record.bonus }}</td>
              </tr>
              <!-- <tr>
                <td class="history-td-br-left" style="border:0px; background: #270001;">3636</td>
                <td style="border:0px; background: #270001; border-left: solid 1px #2e3039; border-right: solid 1px #2e3039;">2026-09-12</td>
                <td class="history-td-br-right" style="border:0px; background: #270001;">1,000</td>
              </tr> -->
            </tbody>
          </table>
        </div>
    </div>

    <div class="block-wrapper">
      <div class="title-wrapper">
        <img src="./img/N-rule-title.png" >
        <!-- {{ $t("hotPromo.activityRules") }} -->
        <!-- <img
          style="width: 100%; max-width: 250px; padding: 0 0 5px 0"
          src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/activity-rules-title.png"
        /> -->
      </div>
      <ol>
        <!-- <li>{{ $t("content.message1") }}</li>
        <li>{{ $t("content.message2") }}</li>
        <li>{{ $t("content.message3") }}</li>
        <li>{{ $t("content.message4") }}</li>
        <li>{{ $t("content.message5") }}</li>
        <li>{{ $t("content.message6") }}</li>
        <li>{{ $t("content.message7") }}</li>
        <li>{{ $t("content.message8") }}</li> -->
        <li>Jogue o jogo Aviator e ganhe prêmios em dinheiro gratuitamente</li>
        <li> cada 10 apostas no jogo Aviator, você ganha uma chance na roleta. Super prêmio de 10.000 </li>
        <li>s chances de roleta são válidas apenas no mesmo dia. No dia seguinte, a contagem recomeça. Participe todos os dias!</li>
        <li> bônus (excluindo o principal) requer 1 vezes de apostas válidas para sacar;</li>
        <li>Somente o proprietário da conta pode realizar operações manuais normais, caso contrário, o bônus será cancelado ou deduzido, congelado ou até mesmo colocado na lista negra;</li>
        <li>Para evitar diferenças na compreensão do texto, a plataforma se reserva o direito final de interpretação desta atividade.</li>
       
      </ol>
    </div>

    <q-dialog v-model="showWithdrawDialog">
      <div class="withdraw-container">
        <img
          v-if="languageVal === 'pt'"
          class="withdraw-header"
          src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/withdraw/withdraw-header-pt.png"
        />
        <img
          v-else
          class="withdraw-header"
          src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/withdraw/withdraw-header.png"
        />
        <div class="withdraw-amount">
          <img
            class="cash"
            src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/withdraw/cash-icon.png"
          />
          <RedGradientTextAmount :amountText="`${info.accumulatedBonus}`" />
          <img
            class="currency"
            src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/withdraw/rs-text.svg"
          />
        </div>
        <img
          v-if="languageVal === 'pt'"
          class="payment-method-header"
          src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/withdraw/payment-method-header-pt.svg"
        />
        <img
          v-else
          class="payment-method-header"
          src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/withdraw/payment-method-header.svg"
        />
        <div class="progress">
          <div class="progress-item">
            <img
              class="icon"
              src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/withdraw/checked.svg"
            />
            <div>{{ $t("hotPromo.spinReferWheel.paymentRequestSubmitted") }}</div>
          </div>

          <div class="progress-item">
            <img class="icon" src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/withdraw/line.svg" />
            <div></div>
          </div>

          <div class="progress-item">
            <img
              class="icon"
              src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/withdraw/checked.svg"
            />
            <div>{{ $t("hotPromo.spinReferWheel.stillNeedToMakeWithdrawal") }} {{ extractionDifference }}</div>
          </div>

          <div class="progress-item">
            <img class="icon" src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/withdraw/line.svg" />
            <div></div>
          </div>

          <div class="progress-item">
            <img
              v-if="extractionDifference <= 0"
              class="icon"
              src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/withdraw/checked.svg"
            />
            <img
              v-else
              class="icon"
              src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/withdraw/unchecked.svg"
            />
            <div>
              {{ info.claimBonus }}
              {{ $t("hotPromo.spinReferWheel.willBePaidToYourRsAccount", { symbol: store.currency.value }) }}
            </div>
          </div>
        </div>

        <div class="desc">* {{ $t("hotPromo.spinReferWheel.referFriendToRegister") }}</div>
        <div class="invite-friends-btn" @click="handleInviteClick">
          {{ $t("hotPromo.spinReferWheel.inviteFriendsToHelp") }}
        </div>
      </div>
    </q-dialog>

    <WheelResultDialog v-model="showResultDialog" :prize="prize" @hide="$emit('reload')" />
    <RecordDialog v-model="showRecordDialog" />
    <CashOutPopup ref="cashOutPopupRef" v-model="isCashOutPopupVisible" />
    <SharePopup ref="sharePopupRef" v-model="isSharePopupVisible" />
  </div>
</template>
<script setup>
import moment from "moment-timezone";
import { computed, onMounted, onUnmounted, ref, toRefs, provide, inject, watch } from "vue";
import CommonButton from "./CommonButton.vue";
import WheelResultDialog from "./WheelResultDialog.vue";
import RecordDialog from "./RecordDialog.vue";
import { useRouter } from "vue-router";
import { eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";
import ProgressBar from "./ProgressBar.vue";
import CashOutPopup from "./CashOutPopup.vue";
import SharePopup from "./SharePopup.vue";
import GradientTextAmount from "./GradientTextAmount.vue";
import { userStore } from "src/stores";
import { t } from "src/boot/lang";
import RedGradientTextAmount from "./withdrawDialog/GradientTextAmount.vue";
import { i18nStore } from "src/router/language";
import { storeToRefs } from "pinia";

const { languageVal } = storeToRefs(i18nStore());

const historyTableContainer = ref();
const store = userStore();
const emit = defineEmits(["reload"]);
const props = defineProps(["info"]);
const { info } = toRefs(props);

const TOTAL_ITEMS = 8;
const DEFAULT_SPEED = 1;
const MAX_SPEED = 4;
const FULL_DEGREE = 360;
const SPIN_WHEEL_PRIZES = [0.02, 0.03, 0.04, 0.05, 0.06, 0.07,0.08, 0.09];
const SPIN_DURATION = 5000;
const SPIN_DECELERATION_TIME = 3;
const RESULT_DIALOG_OPEN_DELAY = 1000;

const router = useRouter();
const $q = useQuasar();

const remainingTime = ref("");
const nextFreeSpinRemainingTime = ref("");
const showRecordDialog = ref(false);
const showWithdrawDialog = ref(false);
const showResultDialog = ref(false);
const spinWheelRef = ref();
const spinButtonDisable = ref(false);
const finalDegree = ref(0);
const degree = ref(0);
const speed = ref(1);
const spinStartTime = ref();
const degreeToStopAt = ref([]);
const prizeIndex = ref(0);
const timer = ref();
const prize = ref(0);
const winningRecordRef = ref();
const isCashOutPopupVisible = ref(false);
const cashOutPopupRef = ref();
const isSharePopupVisible = ref(false);
const sharePopupRef = ref();
const winningRecord = ref([]);
const isWheelEnded = ref(false);

provide("nextFreeSpinRemainingTime", nextFreeSpinRemainingTime);
const extractionDifference = inject("extractionDifference");

// const winningRecord = computed(() => {
//   const result = [];
//   for (let i = 0; i < 20; i++) {
//     const date = moment()
//       .subtract(Math.random() * 24 * 60 * 60 * 1000, "milliseconds")
//       .format("YYYY-MM-DD HH:mm:ss");
//     const name = `User${Math.floor(Math.random() * 900) + 100}`;
//     result.push({
//       date,
//       name
//     });
//   }
//   return result;
// });

const rotate = (timestamp, stopCallback) => {
  if (!spinStartTime.value) {
    spinStartTime.value = timestamp;
  }

  const elapsed = timestamp - spinStartTime.value;
  degree.value++;
  if (speed.value < MAX_SPEED) {
    speed.value += 0.005;
  }
  if (speed.value > MAX_SPEED) {
    speed.value = MAX_SPEED;
  }

  finalDegree.value = (degree.value * speed.value) % FULL_DEGREE;
  const transformValue = `rotate(${finalDegree.value+20}deg)`;
  spinWheelRef.value.style.transform = transformValue;

  if (elapsed < SPIN_DURATION) {
    requestAnimationFrame((_timestamp) => rotate(_timestamp, stopCallback));
  } else {
    const stopSpinRound = SPIN_DECELERATION_TIME * FULL_DEGREE;
    const endDegree = degreeToStopAt.value[prizeIndex.value].degree;
    finalDegree.value = stopSpinRound + endDegree;
    spinWheelRef.value.style.transition = `transform ${SPIN_DECELERATION_TIME}s ease-out`;
    spinWheelRef.value.style.transform = `rotate(${finalDegree.value+20}deg)`;
    setTimeout(() => {
      spinButtonDisable.value = false;
      stopCallback?.();
      getRecords();
      store.getBalance();
    }, SPIN_DECELERATION_TIME * 1000);
  }
};

const spin = (_prizeIndex, stopCallback) => {
  spinButtonDisable.value = true;
  prizeIndex.value = _prizeIndex;
  reset();
  requestAnimationFrame((timestamp) => rotate(timestamp, stopCallback));
};

const reset = () => {
  degree.value = finalDegree.value % FULL_DEGREE;
  speed.value = DEFAULT_SPEED;
  spinStartTime.value = undefined;

  spinWheelRef.value.style.transition = "";
};

const handleWheelClick = () => {
  //dan test
  
  if (spinButtonDisable.value || !info.value.availableSpin) return;
  
  eventapi.post("/session/aviator-wheel-bet-count/spin?promoCode=br2-aviator-wheel-bet-count").then((res) => {
    if (res.code == 0) {
      prize.value = res.data;
      const prizeIndex = prize.value.bonusAmount > 4 ? 5 : 7 // 5鈔票 7金幣
      spin(prizeIndex, () => {
        setTimeout(() => {
          showResultDialog.value = true;
        }, RESULT_DIALOG_OPEN_DELAY);
      });
    }
    emit("reload");
  }).catch((err) => {
    emit("reload");
  });
};

const handleInviteClick = () => {
  // isCashOutPopupVisible.value = true;
  // cashOutPopupRef.value?.showInviteWins();
  isSharePopupVisible.value = true;
  // sharePopupRef.value?.showInviteWins();
};

const getRemainingTime = (endTime) => {
  let result = "00:00:00";
  if (endTime) {
    const now = moment(Date.now());
    const _endTime = moment(endTime);
    const totalSeconds = _endTime.diff(now, "seconds");
    if (totalSeconds > 0) {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      result = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  }
  return result;
};

// const handleReceiveClick = () => {
//   eventapi.post("/session/refer-wheel-spin/claimBonus?promoCode=br2-refer-wheel").then((res) => {
//     // eventapi.post("/session/refer-wheel/claimBonus?promoCode=br2-refer-wheel").then((res) => {
//     if (res.code === 0) {
//       $q.notify({
//         message: t("content.receiveSuccessfully"),
//         color: "positive",
//         position: "top"
//       });
//       emit("reload");
//     }
//   });
// };

// const handleRecordClick = () => {
//   showRecordDialog.value = true;
// };

// const handleWithdrawClick = () => {
//   showWithdrawDialog.value = true;
// };

const updateCountdownTime = () => {
  // console.log("updateCountdownTime")
  const wheelEndTime = moment.tz(info.value.wheelEndTime, "America/Sao_Paulo");
  const wheelResetTime = moment.tz(info.value.wheelResetTime, "America/Sao_Paulo");
  const now = moment();

  const endTime = now.isAfter(moment.min(wheelEndTime, wheelResetTime))
    ? moment.max(wheelEndTime, wheelResetTime)
    : moment.min(wheelEndTime, wheelResetTime);

  if (now.isAfter(wheelEndTime)) {
    isWheelEnded.value = true;
  }

  const nextFreeSpinEndTime = moment().tz("America/Sao_Paulo").add(1, "days").startOf("day");
  if (timer.value) {
    clearInterval(timer.value);
  }
  timer.value = setInterval(() => {
    remainingTime.value = getRemainingTime(endTime);
    nextFreeSpinRemainingTime.value = getRemainingTime(nextFreeSpinEndTime);
    if (winningRecordRef.value) {
      const isScrollToEnd = winningRecordRef.value.scrollTop >= winningRecordRef.value.offsetHeight;
      winningRecordRef.value.scrollTo({
        top: isScrollToEnd ? 0 : winningRecordRef.value.scrollTop + 20,
        behavior: isScrollToEnd ? "instant" : "smooth"
      });
    }
  }, 1000);
};

const getRecords = () => {
  // dan test
  // /session/aviator-wheel-bet-count/records?promoCode=br2-aviator-wheel-bet-count&size=30&current=1
  eventapi.get("/session/aviator-wheel-bet-count/records?promoCode=br2-aviator-wheel-bet-count&size=30&current=1").then((res) => {
    // eventapi.get("/session/refer-wheel/getRecords?promoCode=br2-refer-wheel").then((res) => {
    if (res.code === 0) {
      winningRecord.value = res.data;
    }
  }).catch((err) => {
  });
};

watch(info, () => {
  updateCountdownTime();
});

onMounted(() => {
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    // 每個獎項多偏移4度，讓指針永遠不會剛好在中線上
    const _degree = ((FULL_DEGREE / TOTAL_ITEMS) * i * -1) + 4;
    degreeToStopAt.value.push({ degree: _degree, prize: SPIN_WHEEL_PRIZES[i] });
  }

  // 初始角度設為4度
  finalDegree.value = 20;
  degree.value = 20;
  if (spinWheelRef.value) {
    spinWheelRef.value.style.transform = `rotate(20deg)`;
  }

  // updateCountdownTime();
  // dan test
  setInterval(() => {
    const el = historyTableContainer.value?.querySelector('.history-tbody-scroll');
    if (el) {
      // 若已經到底，回到頂部，否則往下捲一行高度
      const row = el.querySelector('tr');
      if (row) {
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
          el.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ top: row.offsetHeight, behavior: 'smooth' });
        }
      }
    }
  }, 1000); // 每秒捲動一次
  getRecords();
});

defineExpose({
  updateCountdownTime
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>
<style lang="scss" scoped>
.wheel-stage-wrapper {
  // height: 710px;
  max-width: 350px;
  margin: 0 auto;

  img {
    margin-bottom: 0 !important;
  }

  .countdown {
    display: flex;
    align-items: center;
    justify-content: center;
    background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/countdown-bg.png) no-repeat;
    background-size: 100% 100%;
    aspect-ratio: 295 / 24;
    margin: 14px 0 16px;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
  }

  .winning-record-outer-wrapper {
    padding: 18px 20px;
    margin-top: 100px;
    position:relative;
    width: 100%;
    background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/records-bg.png) no-repeat;
    background-size: 100% 100%;
    border-radius: 8px;

    .winning-record-wrapper {
      display: flex;
      flex-direction: column;
      height: 200px;
      overflow: hidden;

      .winning-record-item {
        display: flex;
        justify-content: space-between;
        gap: 4px;
        min-height: 20px;

        > span {
          line-height: 20px;
          flex: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;

          &:last-child {
            text-align: right;
            min-width: 100px;
          }
        }

        .amount {
          font-weight: 600;
          color: #feba02;
        }

        .name {
          text-align: center;
        }
      }

      .no-record-text {
        text-align: center;
        font-weight: 700;
      }
    }
  }

  .draw-btn {
    position: relative;
    max-width: 70%;
    margin: -5% auto 0;
    min-height: 80px;
    font-size: 16px;

    &.common-btn {
      background-size: 100% 100%;
    }

    &.disabled {
      filter: grayscale(0.7);
      pointer-events: none;
    }
  }

  .wheel-wrapper {
    position: relative;
    width: 100%;
    height: 100%;

    .wheel-inner-wrapper {
      position: relative;
      top: 10px;
      padding: 0 20px;

      .indicate {
        -webkit-user-drag: none;
        position: absolute;
        top: 35%;
        left: 50%;
        transform: translateX(-50%);
        width: 217px;
        max-width: 20%;
      }

      .btn {
        -webkit-user-drag: none;
        height: 96px;
        position: absolute;
        top: 48%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: url(./img/wheel-arraw.png);
        background-size: cover;
        aspect-ratio: 250/300;
        border: none;
        width: 80px;
        max-width: 35%;
        font-size: 40px;
        font-weight: 700;
        color: #f9f9f9;
        padding-top: 16px;

        &.disabled {
          filter: grayscale(0.7);
          opacity: 1 !important;
        }
      }
    }

    .decoration {
      position: absolute;
      -webkit-user-drag: none;

      &.penguin {
        top: 9%;
        left: 0;
        width: 105px;
        max-width: 21%;
        transform: rotate(-5.8deg);
      }

      &.ox {
        top: 9%;
        right: 0;
        width: 150px;
        max-width: 30%;
        transform: rotate(13.85deg);
      }

      &.tiger {
        bottom: 18%;
        right: 0;
        width: 145px;
        max-width: 29%;
      }

      &.rabbit {
        bottom: 18%;
        left: 0;
        width: 130px;
        max-width: 26%;
      }
    }

    // .next-spin-remaining-time {
    //   font-weight: 700;
    //   color: #fff;
    //   display: block;
    //   text-align: center;
    //   background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/next-spin-countdown-bg.png)
    //     no-repeat;
    //   background-size: 100% 100%;
    //   padding: 8px;
    //   margin-top: 10px;
    // }
  }

  .wheel-outer-wrapper {
    background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/bg.png) no-repeat;
    background-size: 100% 100%;
    position: relative;
    min-height: 160px;

    .summary-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 38px 34px 0;

      > * {
        margin-bottom: 10px;
      }

      .prize {
        margin-top: 4px;
        margin-bottom: -12px;
        font-size: 32px;
        font-weight: 900;
        color: #91ffab;

        .amount {
          font-size: 32px;
        }
      }

      .extraction-require-amount,
      .extraction-require-percentage {
        color: #fff;
        font-family: "Poppins";
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0px;
        text-align: left;

        .amount {
          font-weight: 500;
          color: #feba02;
        }
      }

      .extraction-progress-bar {
        position: relative;
        width: 100%;
        height: 12px;
        background-color: #cc9f8c;
        border-radius: 100px;

        .progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(356.25deg, #3b156e -0.21%, #8100ae 93.65%);
          background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/progress-bar-bg.png) no-repeat;
          background-size: 100% 100%;
          border-radius: 4px;
        }

        .indicate {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 28px;
        }
      }

      .receive-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        background: linear-gradient(180deg, #d29d3a 0%, #d55a35 100%);
        border-radius: 4px;
        border: 1px solid #e8c4ff33;
        padding: 10px 0;
        font-size: 18px;
        font-weight: 700;
        line-height: 28px;
        color: #fff;

        &.disabled {
          filter: grayscale(0.7);
        }

        img {
          max-width: 28px;
        }
      }
    }

    .record-btn {
      position: absolute;
      top: 8%;
      right: 7%;
      border: none;
      background-color: #c93f1e;
      border-radius: 87px;
      padding: 3px 6px;
      color: #ec9823;
    }

    .rules-btn {
      position: absolute;
      top: 8%;
      left: 9%;
      border: none;
      background-color: #c93f1e;
      border-radius: 87px;
      padding: 3px 6px;
      color: #ec9823;
    }
  }

  > div:not(:last-child) {
    margin-bottom: 12px;
  }
}

.block-wrapper {
  background-color: #2a2f3b;
  border-radius: 12px;
  padding: 16px 10px;
  width: 100%;

  .title-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    color: #f9f9f9;
    font-weight: 700;
    font-size: 22px;
    line-height: 100%;
    letter-spacing: 0px;
    text-align: left;
    text-transform: uppercase;
    padding: 10px 5px 0px 10px;

    .title-decoration {
      display: flex;
      gap: 12px;

      > div {
        width: 8px;
        height: 8px;
        transform: rotate(45deg);
        background-color: #cd91ff;
      }
    }
  }

  ol {
    li {
      margin-bottom: 5px !important;
    }
  }
}

@media screen and (max-width: 500px) {
  .wheel-stage-wrapper {
    .wheel-outer-wrapper {
      .summary-wrapper {
      }
    }
  }
}

@media screen and (max-width: 450px) {
  .wheel-stage-wrapper {
    .winning-record-outer-wrapper {
      .winning-record-wrapper {
        .winning-record-item > span {
          font-size: 9px;
        }
      }
    }

    // .wheel-wrapper {
    //   .wheel-inner-wrapper {
    //     .btn {
    //       font-size: 14px;
    //       line-height: 18px;
    //     }
    //   }
    // }
  }
}

@media screen and (max-width: 375px) {
  .wheel-stage-wrapper {
    .wheel-wrapper {
      .countdown {
        font-size: 12px;
      }
    }

    .wheel-outer-wrapper {
      .summary-wrapper {
        .prize {
          font-size: 24px;

          .amount {
            font-size: 32px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 350px) {
  .wheel-stage-wrapper {
    .wheel-wrapper {
      .wheel-inner-wrapper {
        .btn {
          font-size: 11vw;
        }
      }
    }
  }
}

.cash-out-btn {
  background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/cash-out-btn.svg) no-repeat;
  background-size: 100% 100%;
  aspect-ratio: 287 / 36;
  min-height: 36px;
  width: 100%;

  &:active {
    transform: translateY(2px);
  }

  &.disabled {
    filter: grayscale(0.7);
    pointer-events: none;
  }
}

.withdraw-container {
  background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/withdraw-bg.png) no-repeat;
  background-size: 100% 100%;
  width: 320px;
  height: 450px;
  padding: 10px 20px;

  .withdraw-header {
    width: 250px;
    display: flex;
    margin: 0 auto;
  }

  .withdraw-amount {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70%;
    margin: 0 auto;

    .cash {
      width: 35px;
      height: 35px;
    }

    .currency {
      width: 35px;
      height: 35px;
    }
  }

  .progress {
    display: flex;
    flex-direction: column;
    color: #fff;
    background-color: #ec0105;
    padding: 10px;
    border-radius: 16px;
    margin: 10px 0;

    .progress-item {
      display: flex;
      align-items: center;
      font-size: 10px;

      .icon {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
      }
    }
  }

  .desc {
    color: #a42628;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0px;
  }

  .invite-friends-btn {
    background: linear-gradient(270deg, #f43030 0%, #ff7070 100%);
    font-weight: 700;
    font-size: 12.76px;
    line-height: 16.67px;
    letter-spacing: 0px;
    text-align: center;
    text-transform: uppercase;
    padding: 10px;
    color: #fff;
    border-radius: 6px;
    margin-top: 10px;
  }
}
.plant-bg{
  position: absolute;
  top: 0;
  left: 0;
  top: 8%;
  left: -18%;
  width: 109%;
  height: 100%;

}
.history-header{
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  position: relative;
  width: 100%;
  background-color: #270001;
  display: flex;
  justify-content: center;
  align-items: center;
}
.history-component{
  border-radius: 12px;
  margin-top: 6%;;
}
.history-td-br-right {
  border-bottom-right-radius: 12px;
  overflow: hidden;
}
.history-td-br-left {
  border-bottom-left-radius: 12px;
  overflow: hidden;
}
.history-table-container {
  max-height: 220px;
  // height: 220px;
  overflow: hidden;
  border-radius: 0 0 12px 12px;
  background: #270001;
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }
  .history-tbody-scroll {
    display: block;
    max-height: 180px;
    overflow-y: auto;
    width: 100%;
  }
  thead, tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
}
</style>
