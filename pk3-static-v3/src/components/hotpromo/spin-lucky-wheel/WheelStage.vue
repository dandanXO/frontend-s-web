<template>
  <div class="wheel-stage-wrapper">
    <div class="wheel-outer-wrapper">
      <!-- <span class="title">Countdown: {{ remainingTime }}</span> -->
      <div class="summary-wrapper">
        <GradientTextAmount :amountText="`${store.currency.value} ${info.currAmount}`" />

        <template v-if="extractionDifference > 0 && info.status === 'IN_PROGRESS'">
          <ProgressBar />
          <div class="cash-out-btn" @click="isCashOutPopupVisible = true" />
        </template>

        <button v-else-if="info.status === 'IN_PROGRESS'" class="receive-btn" @click="handleReceiveClick">
          <img src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/coin-2.png" />
          <span>RECEIVE</span>
        </button>

        <button v-else-if="info.status === 'CLAIMED'" class="receive-btn disabled">
          <img src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/coin-2.png" />
          <span>RECEIVED</span>
        </button>

        <div class="winning-record-outer-wrapper">
          <div ref="winningRecordRef" class="winning-record-wrapper">
            <div v-for="(record, index) in winningRecord" :key="index" class="winning-record-item">
              <span>{{ moment(record.date).format("MM-DD hh:mm:ss") }}</span>
              <span class="name">{{ record.name }}</span>
              <span>
                RECEIVE
                <span class="amount">{{ `${store.currency.value} 5,000` }}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="foreground-wrapper">
          <div class="wheel-wrapper">
            <img
              class="decoration penguin"
              src="../../../assets/images/promotion/spin-lucky-wheel/decoration-penguin.png"
            />
            <img class="decoration ox" src="../../../assets/images/promotion/spin-lucky-wheel/decoration-ox.png" />

            <div class="countdown">Next Round: {{ remainingTime }}</div>
            <div class="wheel-inner-wrapper">
              <img
                ref="spinWheelRef"
                class="wheel"
                src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/wheel-bg.png"
              />
              <img
                class="indicate"
                src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/wheel-indicate.png"
              />
              <button class="btn" :class="{ disabled: !info.spinChance || isClaimedStatus }" @click="handleWheelClick">
                rotate
                <br />
                {{ info.spinChance }} time
              </button>
            </div>

            <img
              class="decoration tiger"
              src="../../../assets/images/promotion/spin-lucky-wheel/decoration-tiger.png"
            />
            <img
              class="decoration rabbit"
              src="../../../assets/images/promotion/spin-lucky-wheel/decoration-rabbit.png"
            />
            <CommonButton v-if="isClaimedStatus" class="draw-btn disabled">Invite To Earn Spin</CommonButton>
            <CommonButton v-else class="draw-btn" @click="handleInviteClick">Invite To Earn Spin</CommonButton>
            <span class="next-spin-remaining-time" v-if="!isClaimedStatus">Countdown to next free spins: {{ nextFreeSpinRemainingTime }}</span>
          </div>
        </div>
      </div>

      <button class="record-btn" @click="handleRecordClick">Record</button>
    </div>
    <div class="block-wrapper">
      <div class="title-wrapper">
        <div class="title-decoration">
          <div v-for="index in 3" :key="index"></div>
        </div>
        <span>Activity rules</span>
        <div class="title-decoration">
          <div v-for="index in 3" :key="index"></div>
        </div>
      </div>
      <ol>
        <li>
          When the accumulated amount reaches {{ `${store.currency.value} 5,000` }}, you can apply for withdrawal (Rewards will add to your wallet
          directly).
        </li>
        <li>When there are no spin available, refer a new player to get a free spin.</li>
        <li>
          The event lasts for 3 days. After the event, the accumulated bonus will be reset, and the event will start
          again.
        </li>
        <li>
          Each user can enjoy one free spin opportunity per day, the free spins will be added at 12:00 a.m. every day.
        </li>
        <li>After the application is approved, the bonus is deposited directly into your wallet.</li>
        <li>The bonus needs to be rolled over once before it can be withdrawn.</li>
        <li>
          The invitee must bind their phone number and register via inviter's invitation link to be considered for the
          recommendation.
        </li>
        <li>
          The more your invitees play on the website, the higher your next spin reward will be. Invite friends and win more rewards together!
        </li>
        <li>
          The right to interpret the event belongs to 55Ace. If you have any questions, please contact to customer
          service.
        </li>
      </ol>
    </div>
    <WheelResultDialog v-model="showResultDialog" :prize="prize" @hide="$emit('reload')" />
    <RecordDialog v-model="showRecordDialog" />
    <CashOutPopup ref="cashOutPopupRef" v-model="isCashOutPopupVisible" />
  </div>
</template>
<script setup>
import moment from "moment-timezone";
import { computed, onMounted, onUnmounted, ref, toRefs, provide, inject } from "vue";
import CommonButton from "./CommonButton.vue";
import WheelResultDialog from "./WheelResultDialog.vue";
import RecordDialog from "./RecordDialog.vue";
import { useRouter } from "vue-router";
import { eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";
import ProgressBar from './ProgressBar.vue';
import CashOutPopup from "./CashOutPopup.vue";
import GradientTextAmount from "./GradientTextAmount.vue";
import { userStore } from "@/stores/index";

const emit = defineEmits(["reload"]);
const props = defineProps(["info"]);
const { info } = toRefs(props);
const store = userStore();


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
const isClaimedStatus = computed(() => info.value.status === 'CLAIMED');

provide('nextFreeSpinRemainingTime', nextFreeSpinRemainingTime);
provide('remainingTime', remainingTime);
const extractionDifference = inject('extractionDifference');

const winningRecord = computed(() => {
  const result = [];
  for (let i = 0; i < 20; i++) {
    const date = moment()
      .subtract(Math.random() * 24 * 60 * 60 * 1000, "milliseconds")
      .format("YYYY-MM-DD HH:mm:ss");
    const name = `User${Math.floor(Math.random() * 900) + 100}`;
    result.push({
      date,
      name
    });
  }
  return result;
});

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
  if (spinButtonDisable.value || !info.value.spinChance || isClaimedStatus.value) return;
  eventapi.post("/refer-spin/spin").then((res) => {
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
  isCashOutPopupVisible.value = true;
  cashOutPopupRef.value?.showInviteWins();
};

const getRemainingTime = (endTime) => {
  let result = "00:00:00";
  if (endTime) {
    const now = moment(Date.now()).tz("Asia/Karachi");
    const _endTime = moment(endTime).tz("Asia/Karachi");
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
  eventapi.post("/refer-spin/withdraw").then((res) => {
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

const updateCountdownTime = () => {
  // console.log("updateCountdownTime")
  const endTime = isClaimedStatus.value ? moment().tz("Asia/Karachi").add(1, "days").startOf("day") : moment(info.value.startTime).tz("Asia/Karachi").add(3, "days");
  const nextFreeSpinEndTime = moment().tz("Asia/Karachi").add(1, "days").startOf("day");
  if(timer.value){
    clearTimeout(timer.value);
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
}

onMounted(() => {
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    const _degree = (FULL_DEGREE / TOTAL_ITEMS) * i * -1;
    degreeToStopAt.value.push({ degree: _degree, prize: SPIN_WHEEL_PRIZES[i] });
  }

  updateCountdownTime();
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
  img {
    margin-bottom: 0 !important;
  }

  .wheel-outer-wrapper {
    background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/bg.png) no-repeat;
    background-size: 100% 100%;
    aspect-ratio: 343 / 656;
    position: relative;
    min-height: 650px;

    .summary-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 58px 34px 0;

      > * {
        margin-top: 8px;
      }

      .prize {
        margin-top: 4px;
        margin-bottom: -12px;
        font-size: 32px;
        font-weight: 900;
        color: #cd91ff;
        .amount {
          font-size: 40px;
        }
      }

      .extraction-require-amount, .extraction-require-percentage {
        color: #fff;
        font-family: 'Poppins';
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0px;
        text-align: left;

        .amount {
          font-weight: 500;
          color: #FEBA02;
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

      .winning-record-outer-wrapper {
        padding: 12px 14px;
        width: 100%;
        background-color: #1E1F24;
        border-radius: 8px;

        .winning-record-wrapper {
          display: flex;
          flex-direction: column;
          height: 200px;
          overflow: hidden;

          .winning-record-item {
            display: grid;
            gap: 8px;
            grid-template-columns: 2fr minmax(40px, 1fr) 2fr;
            > span {
              line-height: 20px;
              flex: 1;
              &:last-child {
                text-align: right;
              }
            }
            .amount {
              font-weight: 600;
              color: #cd91ff;
            }
            .name {
              text-align: center;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
      }

      .foreground-wrapper {
        position: absolute;
        bottom: -60px;
        left: -1px;
        right: -1px;
        background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/fg.png) no-repeat;
        background-size: 100% 100%;
        aspect-ratio: 343 / 470;
        padding-top: 36px;
        text-align: center;

        .wheel-wrapper {
          position: relative;
          width: 100%;
          height: 100%;

          .wheel {
            width: 100% !important;
          }

          .countdown {
            display: flex;
            align-items: center;
            justify-content: center;
            background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/countdown-bg.png) no-repeat;
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
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/wheel-btn.png);
              background-size: cover;
              aspect-ratio: 1;
              border: none;
              width: 158px;
              max-width: 35%;
              height: 40%;
              font-size: 20px;
              font-weight: 700;
              line-height: 24px;
              color: #f33d31;
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
            height: 100px;

            &.common-btn {
              background-size: 100% 100%;
            }
          }

          .next-spin-remaining-time {
            font-weight: 700;
            color: #fff;
          }
        }
      }
    }

    .record-btn {
      position: absolute;
      top: 2%;
      right: 7%;
      border: none;
      background-color: #e8c4ff33;
      border-radius: 87px;
      padding: 3px 6px;
      color: #cd91ff;
    }
  }

  .block-wrapper {
    background-color: #1e1f24;
    border-radius: 12px;
    padding: 16px 10px;
    margin-top: 70px;

    .title-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 700;
      color: #cd91ff;

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

  > div:not(:last-child) {
    margin-bottom: 12px;
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
        padding: 9vw 7vw 0;

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
                font-size: 16px;
                line-height: 20px;
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
              font-size: 14px;
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
  background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/cash-out-btn.svg) no-repeat;
  background-size: 100% 100%;
  aspect-ratio: 287 / 36;
  min-height: 36px;
  width: 100%;

  &:active {
      transform: translateY(2px);
  }
}
</style>
