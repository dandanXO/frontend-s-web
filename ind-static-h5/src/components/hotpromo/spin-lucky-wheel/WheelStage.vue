<template>
  <div class="wheel-stage-wrapper">
    <div class="wheel-outer-wrapper">
      <span class="title">Countdown: {{ remainingTime }}</span>
      <div class="summary-wrapper">
        <span class="prize">
          $
          <span class="amount">{{ currentAmount }}</span>
        </span>

        <template v-if="extractionDifference > 0">
          <span class="extraction-require-amount">
            Extraction requires only
            <span class="amount">{{ extractionDifference }}$</span>
          </span>

          <div class="extraction-progress-bar">
            <div class="progress" :style="{ width: `calc(100% - ${extractionDifference}%)` }"></div>
            <img
              class="pointer"
              :style="{ left: `calc(100% - ${extractionDifference}%)` }"
              src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/coin.png"
            />
          </div>
        </template>

        <button v-else class="receive-btn">
          <img src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/coin-2.png" />
          <span>RECEIVE</span>
        </button>

        <div class="winning-record-wrapper">
          <div v-for="(record, index) in winningRecord" :key="index" class="winning-record-item">
            <span>{{ moment(record.date).format("MM-DD hh:mm:ss") }}</span>
            <span>{{ record.name }}</span>
            <span>
              RECEIVE
              <span class="amount">{{ record.amount }}$</span>
            </span>
          </div>
        </div>
        <div class="foreground-wrapper">
          <div class="wheel-wrapper">
            <img
              class="decoration penguin"
              src="../../../assets/images/promotion/spin-lucky-wheel/decoration-penguin.png"
            />
            <img class="decoration ox" src="../../../assets/images/promotion/spin-lucky-wheel/decoration-ox.png" />

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
              <button class="btn" @click="handleWheelClick">
                rotate
                <br />
                {{ remainingSpinTimes }} time
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
            <CommonButton class="draw-btn">Invitation wins</CommonButton>
            <span class="next-spin-remaining-time">Countdown to next free spins: 21:21:21</span>
          </div>
        </div>
      </div>
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
          When the accumulated amount reaches 500 yuan, you can apply for withdrawal (withdrawal is to the game wallet)
        </li>
        <li>When there are no spins available, re-refer a new player to get a free spin.</li>
        <li>
          The event lasts for 3 days. After the event, the accumulated bonus will be reset and the event will start
          again.
        </li>
        <li>
          Each user can enjoy one free spin opportunity per day, and the number of spins is reset at 24:00 every day.
        </li>
        <li>After the application is approved, the bonus is deposited directly into your wallet.</li>
        <li>The bonus needs to be rolled over twice before it can be withdrawn.</li>
        <li>
          The invitee needs to bind his or her phone number and link it with the inviter's invitation code in order to
          be considered for recommendation
        </li>
        <li>
          The right to interpret the event belongs to xxxx. If you have any questions, please contact customer service
        </li>
      </ol>
    </div>
    <WheelResultDialog v-model="showResultDialog" :prize="0.02" />
    <RecordDialog v-model="showRecordDialog" />
  </div>
</template>
<script setup>
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import CommonButton from "./CommonButton.vue";
import WheelResultDialog from "./WheelResultDialog.vue";
import RecordDialog from "./RecordDialog.vue";

const TOTAL_ITEMS = 6;
const DEFAULT_SPEED = 1;
const MAX_SPEED = 4;
const FULL_DEGREE = 360;
const SPIN_WHEEL_PRIZES = [0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
const SPIN_DURATION = 5000;
const SPIN_DECELERATION_TIME = 3;
const RESULT_DIALOG_OPEN_DELAY = 1000;

const remainingTime = ref("71:59:59");
const extractionRequireAmount = ref(500);
const currentAmount = ref(498.11);
const winningRecord = ref(new Array(10).fill({ date: "2025-02-03 15:34:32", amount: 500, name: "John Doe" }));
const remainingSpinTimes = ref(2);
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

const extractionDifference = computed(() =>
  Math.min(Math.round((extractionRequireAmount.value - currentAmount.value) * 100) / 100, 100)
);

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
  if (spinButtonDisable.value) return;
  spin(0, () => {
    setTimeout(() => {
      showResultDialog.value = true;
    }, RESULT_DIALOG_OPEN_DELAY);
  });
};

onMounted(() => {
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    const _degree = (FULL_DEGREE / TOTAL_ITEMS) * i * -1;
    degreeToStopAt.value.push({ degree: _degree, prize: SPIN_WHEEL_PRIZES[i] });
  }
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

    .title {
      position: absolute;
      top: 4%;
      transform: translateY(-50%);
      width: 100%;
      text-align: center;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
    }

    .summary-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 58px 34px 0;

      .prize {
        font-size: 32px;
        font-weight: 900;
        color: #cd91ff;
        .amount {
          font-size: 40px;
        }
      }

      .extraction-require-amount {
        font-size: 16px;
        font-weight: 700;
        color: #fff;
        .amount {
          font-size: 20px;
          font-weight: 900;
          color: #cd91ff;
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
          border-radius: 4px;
        }

        .pointer {
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

        img {
          max-width: 28px;
        }
      }

      .winning-record-wrapper {
        display: flex;
        flex-direction: column;
        background-color: #5817aa99;
        border: 1px solid #e8c4ff99;
        border-radius: 8px;
        padding: 12px 14px;
        width: 100%;

        .winning-record-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          > span {
            line-height: 20px;
            flex: 1;
          }
          .amount {
            font-weight: 600;
            color: #cd91ff;
          }
        }
      }

      .foreground-wrapper {
        position: absolute;
        bottom: 0;
        left: -1px;
        right: -1px;
        background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/fg.png) no-repeat;
        background-size: 100% 100%;
        aspect-ratio: 343 / 437;
        padding-top: 36px;
        text-align: center;

        .wheel-wrapper {
          position: relative;
          width: 100%;
          height: 100%;

          .wheel-inner-wrapper {
            position: relative;
            top: 0;
            padding: 0 20px;

            .indicate {
              position: absolute;
              top: 3px;
              left: 50%;
              transform: translateX(-50%);
              width: 217px;
              max-width: 47%;
            }

            .btn {
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
              font-size: 20px;
              font-weight: 700;
              line-height: 24px;
              color: #f33d31;
            }
          }

          .decoration {
            position: absolute;
            -webkit-user-drag: none;

            &.penguin {
              top: 0;
              left: 0;
              width: 105px;
              max-width: 21%;
              transform: rotate(-5.8deg);
            }

            &.ox {
              top: 0;
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
          }

          .next-spin-remaining-time {
            font-weight: 700;
            color: #fff;
          }
        }
      }
    }
  }

  .block-wrapper {
    background-color: #1e1f24;
    border-radius: 12px;
    padding: 16px 10px;

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
        padding: 11vw 7vw 0;

        .winning-record-wrapper {
          .winning-record-item > span {
            font-size: 10px;
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
</style>
