<template>
  <div class="wheel-stage-wrapper">
    <div class="wheel-outer-wrapper">
      <!-- <span class="title">Countdown: {{ remainingTime }}</span> -->
      <div class="summary-wrapper">
        <!-- <span class="prize">
         Rs
          <span class="amount">{{ info.accumulatedBonus }}</span>
        </span> -->

        <GradientTextAmount :amountText="`${store.currency.label} ${info.accumulatedBonus}`" />

        <template v-if="extractionDifference > 0 && !info.hasWithdrawn">
          <ProgressBar />
          <div class="cash-out-btn" :class="{ disabled: isWheelEnded }" @click="isCashOutPopupVisible = true" />
        </template>

        <button v-else-if="!info.hasWithdrawn" class="receive-btn" @click="handleReceiveClick">
          <img src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/coin-2.png" />
          <span>RECEIVE</span>
        </button>

        <button v-else-if="info.hasWithdrawn" class="receive-btn disabled">
          <img src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/coin-2.png" />
          <span>RECEIVED</span>
        </button>

        <div class="winning-record-outer-wrapper">
          <div ref="winningRecordRef" class="winning-record-wrapper">
            <template v-if="winningRecord.length">
              <div v-for="(record, index) in winningRecord" :key="index" class="winning-record-item">
                <span>{{ moment(record.recordTime).format("MM-DD HH:mm:ss") }}</span>
                <span class="name">{{ record.loginName }}</span>
                <span>
                  RECEIVE
                  <span class="amount">Rs{{ record.bonus }}</span>
                </span>
              </div>
            </template>
            <div v-else class="no-record-text">No Records</div>
          </div>
        </div>
        <div class="foreground-wrapper">
          <div class="wheel-wrapper">
            <!-- <img
              class="decoration penguin"
              src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/decoration-penguin.png"
            />
            <img
              class="decoration ox"
              src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/decoration-ox.png"
            /> -->

            <div class="countdown">
              {{ isWheelEnded ? "Next Round" : "Countdown" }}
              : {{ remainingTime }}
            </div>
            <div class="wheel-inner-wrapper">
              <img
                ref="spinWheelRef"
                class="wheel"
                src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/wheel-bg.png"
              />
              <img
                class="indicate"
                src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/wheel-indicate.png"
              />
              <button class="btn" :class="{ disabled: !info.availableSpin }" @click="handleWheelClick">
                rotate
                <br />
                {{ info.availableSpin }} time
              </button>
            </div>

            <!-- <img
              class="decoration tiger"
              src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/decoration-tiger.png"
            />
            <img
              class="decoration rabbit"
              src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/decoration-rabbit.png"
            /> -->
            <CommonButton class="draw-btn" :class="{ disabled: isWheelEnded }" @click="handleInviteClick">
              Invite To Earn Spin
            </CommonButton>
            <span v-if="isWheelEnded" class="next-spin-remaining-time">This round has ended.</span>
            <span v-if="!isWheelEnded" class="next-spin-remaining-time">Countdown to next free spins: {{ nextFreeSpinRemainingTime }}</span>
          </div>
        </div>
      </div>

      <button class="rules-btn" @click="handleRulesClick">Rules</button>
      <button class="record-btn" @click="handleRecordClick">Record</button>
    </div>

    <q-dialog v-model="showRulesDialog">
      <div class="block-wrapper">
      <div class="title-wrapper">
        Activity Rules
        <!-- <img
          style="width: 100%; max-width: 250px; padding: 0 0 5px 0"
          src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/activity-rules-title.png"
        /> -->
      </div>
      <ol>
        <li>When the accumulated amount reaches 1000 PKR, you can apply for a withdrawal (the reward will be directly added to your wallet).</li>
        <li>When there are no available spins, referring a new player to register and deposit will earn you free spins.</li>
        <li>The event lasts for 3 days. After the event ends, the accumulated rewards will be reset, and the event will restart.</li>
        <li>Each user can enjoy one free spin per day, which will be added at 00:00 daily.</li>
        <li>Once the application is approved, the bonus will be directly credited to your wallet.</li>
        <li>The bonus must be rolled over once before it can be withdrawn.</li>
        <li>The invitee must verify their phone number, register using the inviter's referral link, and must not have a duplicate IP address to qualify for the referral.</li>
      </ol>
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

const store = userStore();
const emit = defineEmits(["reload"]);
const props = defineProps(["info"]);
const { info } = toRefs(props);

const TOTAL_ITEMS = 6;
const DEFAULT_SPEED = 1;
const MAX_SPEED = 4;
const FULL_DEGREE = 360;
const SPIN_WHEEL_PRIZES = [0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
const SPIN_DURATION = 5000;
const SPIN_DECELERATION_TIME = 3;
const RESULT_DIALOG_OPEN_DELAY = 1000;

const router = useRouter();
const $q = useQuasar();

const remainingTime = ref("");
const nextFreeSpinRemainingTime = ref("");
const showRecordDialog = ref(false);
const showRulesDialog = ref(false);
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
  const transformValue = `rotate(${finalDegree.value}deg)`;
  spinWheelRef.value.style.transform = transformValue;

  if (elapsed < SPIN_DURATION) {
    requestAnimationFrame((_timestamp) => rotate(_timestamp, stopCallback));
  } else {
    const stopSpinRound = SPIN_DECELERATION_TIME * FULL_DEGREE;
    const endDegree = degreeToStopAt.value[prizeIndex.value].degree;
    finalDegree.value = stopSpinRound + endDegree;
    spinWheelRef.value.style.transition = `transform ${SPIN_DECELERATION_TIME}s ease-out`;
    spinWheelRef.value.style.transform = `rotate(${finalDegree.value}deg)`;
    setTimeout(() => {
      spinButtonDisable.value = false;
      stopCallback?.();
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
  if (spinButtonDisable.value || !info.value.availableSpin) return;
  eventapi.post("/session/refer-wheel-spin/spin?promoCode=pak-refer-wheel-spin").then((res) => {
    if (res.code === 0) {
      prize.value = res.data;
      const prizeIndex = Math.floor(Math.random() * TOTAL_ITEMS);

      spin(prizeIndex, () => {
        setTimeout(() => {
          showResultDialog.value = true;
        }, RESULT_DIALOG_OPEN_DELAY);
      });
    }
  });
};

const handleInviteClick = () => {
  // isCashOutPopupVisible.value = true;
  // cashOutPopupRef.value?.showInviteWins();
  isSharePopupVisible.value = true
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

const handleReceiveClick = () => {
  eventapi.post("/session/refer-wheel-spin/claimBonus?promoCode=pak-refer-wheel-spin").then((res) => {
    if (res.code === 0) {
      $q.notify({
        message: "Receive successfully",
        color: "positive",
        position: "top"
      });
      emit("reload");
    }
  });
};

const handleRecordClick = () => {
  showRecordDialog.value = true;
};
const handleRulesClick = () => {
  showRulesDialog.value = true;
};

const updateCountdownTime = () => {
  // console.log("updateCountdownTime")
  const wheelEndTime = moment.tz(info.value.wheelEndTime, "Asia/Karachi");
  const wheelResetTime = moment.tz(info.value.wheelResetTime, "Asia/Karachi");
  const now = moment();

  const endTime = now.isAfter(moment.min(wheelEndTime, wheelResetTime))
    ? moment.max(wheelEndTime, wheelResetTime)
    : moment.min(wheelEndTime, wheelResetTime);

  if (now.isAfter(wheelEndTime)) {
    isWheelEnded.value = true;
  }

  const nextFreeSpinEndTime = moment().tz("Asia/Karachi").add(1, "days").startOf("day");
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
  eventapi.get("/session/refer-wheel-spin/getRecords?promoCode=pak-refer-wheel-spin").then((res) => {
    if (res.code === 0) {
      winningRecord.value = res.data;
    }
  });
};

watch(info, () => {
  updateCountdownTime();
});

onMounted(() => {
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    const _degree = (FULL_DEGREE / TOTAL_ITEMS) * i * -1;
    degreeToStopAt.value.push({ degree: _degree, prize: SPIN_WHEEL_PRIZES[i] });
  }

  updateCountdownTime();
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
  height: 710px;
  max-width: 320px;
  margin: 0 auto;
  img {
    margin-bottom: 0 !important;
  }

  .wheel-outer-wrapper {
    background: url(../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/bg.png) no-repeat;
    background-size: 100% 100%;
    aspect-ratio: 343 / 656;
    position: relative;

    .summary-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 58px 34px 0;

      .prize {
        margin-top: 4px;
        margin-bottom: -12px;
        font-size: 32px;
        font-weight: 900;
        color: #91ffab;
        .amount {
          font-size: 40px;
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
          background: url(../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/progress-bar-bg.png)
            no-repeat;
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

      .winning-record-outer-wrapper {
        padding: 12px 14px;
        width: 100%;
        background: linear-gradient(245.79deg, rgba(249, 0, 18, 0.6) 6.76%, rgba(255, 98, 66, 0.6) 102.95%);
        border: 1px solid #c4ffd599;
        border-radius: 8px;

        .winning-record-wrapper {
          display: flex;
          flex-direction: column;
          height: 200px;
          overflow: hidden;

          .winning-record-item {
            display: grid;
            gap: 4px;
            grid-template-columns: 3fr minmax(40px, 2fr) 3fr;
            > span {
              line-height: 20px;
              flex: 1;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              &:last-child {
                text-align: right;
              }
            }
            .amount {
              font-weight: 600;
              color: #FEBA02;
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

      .foreground-wrapper {
        position: absolute;
        bottom: -60px;
        left: -1px;
        right: -1px;
        background: url(../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/fg.png) no-repeat;
        background-size: 100% 100%;
        aspect-ratio: 343 / 470;
        padding-top: 36px;
        text-align: center;

        .wheel-wrapper {
          position: relative;
          width: 100%;
          height: 100%;

          .countdown {
            display: flex;
            align-items: center;
            justify-content: center;
            background: url(../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/countdown-bg.png)
              no-repeat;
            background-size: 100% 100%;
            aspect-ratio: 295 / 24;
            margin: 4px 24px 16px;
            font-size: 16px;
            font-weight: 700;
            color: #fff;
          }

          .wheel-inner-wrapper {
            position: relative;
            top: 0;
            padding: 0 20px;

            .indicate {
              -webkit-user-drag: none;
              position: absolute;
              top: 3px;
              left: 50%;
              transform: translateX(-50%);
              width: 217px;
              max-width: 47%;
            }

            .btn {
              -webkit-user-drag: none;
              position: absolute;
              top: 48%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: url(../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/wheel-btn.png);
              background-size: cover;
              aspect-ratio: 250/300;
              border: none;
              width: 80px;
              max-width: 35%;
              font-size: 18px;
              font-weight: 700;
              line-height: 20px;
              color: #f9f9f9;
              padding-top: 10px;
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

          .draw-btn {
            position: relative;
            max-width: 70%;
            margin: -5% auto 0;

            &.disabled {
              filter: grayscale(0.7);
              pointer-events: none;
            }
          }

          .next-spin-remaining-time {
            font-weight: 700;
            color: #fff;
            display: block;
            margin-top: -8px;
          }
        }
      }
    }

    .record-btn {
      position: absolute;
      top: 2%;
      right: 7%;
      border: none;
      background-color: #C93F1E;
      border-radius: 87px;
      padding: 3px 6px;
      color: #EC9823;
    }
    .rules-btn {
      position: absolute;
      top: 2%;
      left: 9%;
      border: none;
      background-color: #C93F1E;
      border-radius: 87px;
      padding: 3px 6px;
      color: #EC9823;
    }
  }



  > div:not(:last-child) {
    margin-bottom: 12px;
  }
}
.block-wrapper {
    background-color: #2A2F3B;
    border-radius: 12px;
    padding: 16px 10px;
    width: 90%;

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
    .wheel-outer-wrapper {
      .summary-wrapper {
        padding: 11vw 7vw 0;

        .winning-record-outer-wrapper {
          .winning-record-wrapper {
            .winning-record-item > span {
              font-size: 10px;
            }
          }
        }

        .foreground-wrapper {
          padding-top: 7vw;

          .wheel-wrapper {
            .wheel-inner-wrapper {
              .btn {
                font-size: 14px;
                line-height: 18px;
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 375px) {
  .wheel-stage-wrapper {
    .wheel-outer-wrapper {
      .summary-wrapper {
        .foreground-wrapper {
          padding-top: 7vw;

          .wheel-wrapper {
            .countdown {
              font-size: 12px;
            }
          }
        }

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

.cash-out-btn {
  background: url(../../../assets/images/promotion/hotpromo/spin-lucky-wheel/wheel-stage/cash-out-btn.svg) no-repeat;
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
</style>
