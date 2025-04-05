<template>
  <div class="envelope-stage-wrapper">
    <div class="envelope-stage-inner-wrapper">
      <img
        class="title"
        src="../../../assets/images/promotion/spin-lucky-wheel/envelope-stage/title.png"
        alt="get cash every day"
      />
      <div v-if="envelopeStatus === 'idle'" class="envelope-wrapper">
        <button
          v-for="(prize, index) in prizeList"
          :key="index"
          class="envelope-item"
          :class="prize.status"
          @click="handleEnvelopeClick(index)"
        >
          <div v-if="prize.status !== 'idle'" class="prize-wrapper">
            <span>
              {{ prize.status === "selected" ? "Winning" : `BONUS ${index + 1}` }}
            </span>
            <br />
            <span class="prize">
              {{ prize.prize }}
            </span>
          </div>
        </button>
      </div>
      <div v-else class="selected-envelope">
        <span class="prize">{{ store.currency.value }} {{ prizeList[selectedIndex]?.prize }}</span>
        <CommonButton class="withdraw-btn" @click="$emit('envelopeClick')">Go withdraw now!</CommonButton>
        <span class="remaining-time">time left: {{ remainingTime }}</span>
      </div>
      <img class="footer tiger" src="../../../assets/images/promotion/spin-lucky-wheel/decoration-tiger.png" />
      <img class="footer rabbit" src="../../../assets/images/promotion/spin-lucky-wheel/decoration-rabbit.png" />
      <img class="footer coin" src="../../../assets/images/promotion/spin-lucky-wheel/envelope-stage/footer-coin.png" />
    </div>
  </div>
</template>
<script setup>
import moment from "moment";
import { onUnmounted, ref } from "vue";
import CommonButton from "./CommonButton.vue";
import { eventapi } from "src/boot/axios";
import { userStore } from "stores/index";

defineEmits(["envelopeClick"]);

const store = userStore();
const envelopeStatus = ref("idle");
const prizeList = ref(new Array(6).fill().map(() => ({ status: "idle", prize: 0 })));
const selectedIndex = ref(0);
const remainingTime = ref("00:00:00");
const endTime = ref("");
const isClaiming = ref(false);
const timer = ref();

const delay = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const handleEnvelopeClick = (index) => {
  if (prizeList.value[index].status !== "idle" || isClaiming.value) return;

  isClaiming.value = true;
  selectedIndex.value = index;
  eventapi.post("/refer-spin/start", { box: index }).then(async (res) => {
    let otherPrizeCounter = 0;

    prizeList.value[index].status = "selected";
    prizeList.value[index].prize = res.data.bonus;

    await delay(1000);

    prizeList.value.forEach((prize, _index) => {
      if (_index === index) return;

      prize.status = "unselected";
      prize.prize = res.data.otherBonus[otherPrizeCounter++];
    });

    await delay(1000);

    envelopeStatus.value = "selected";
    endTime.value = moment(res.data.startTime).add(3, "days");
    updateRemainingTime();
    timer.value = setInterval(updateRemainingTime, 1000);
    isClaiming.value = false;
  });
};

const updateRemainingTime = () => {
  let result = "00:00:00";
  if (endTime.value) {
    const now = moment(Date.now());
    const _endTime = moment(endTime.value);
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
  remainingTime.value = result;
};

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>
<style lang="scss">
.envelope-stage-wrapper {
  width: 100%;
  height: 100%;

  .envelope-stage-inner-wrapper {
    position: relative;
    padding: 24px 20px 220px;

    .title {
      margin-bottom: 20px !important;
      width: 100% !important;
    }

    .envelope-wrapper {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(3, 1fr);

      .envelope-item {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        background: url(../../../assets/images/promotion/spin-lucky-wheel/envelope-stage/envelope-close.png) no-repeat;
        background-size: 100% 100%;
        aspect-ratio: 109 / 133;
        border: none;
        padding: 13% 0 0;
        // transition: backg;
        height: 110px;
        background-position: center;

        &.selected,
        &.unselected {
          background-image: url(../../../assets/images/promotion/spin-lucky-wheel/envelope-stage/envelope-opened.png);
        }

        &.unselected {
          opacity: 0.6;
        }

        .prize-wrapper {
          font-size: 20px;
          font-weight: 700;
          line-height: 24px;
          color: #8100ae;
          min-height: 100px;

          .prize {
            font-size: 24px;
            font-weight: 900;
            line-height: 28px;
          }
        }
      }
    }

    .selected-envelope {
      max-width: 325px;
      background: url(../../../assets/images/promotion/spin-lucky-wheel/envelope-stage/envelope-detail.png) no-repeat;
      background-size: 100% 100%;
      aspect-ratio: 485 / 574;
      margin: 0 auto;
      position: relative;
      min-height: 350px;

      .prize {
        position: absolute;
        top: 26%;
        width: 100%;
        transform: translateY(-50%);
        font-size: 50px;
        font-weight: 900;
        color: #8100ae;
        text-align: center;
      }

      .withdraw-btn {
        position: absolute;
        top: 69%;
        left: 50%;
        width: 80%;
        transform: translate(-50%, -50%);
        margin: 0 auto;
        height: 100px;

        &.common-btn {
          background-size: 100% 100%;
        }
      }

      .remaining-time {
        position: absolute;
        bottom: -1%;
        width: 100%;
        transform: translateY(-50%);
        font-size: 20px;
        font-weight: 700;
        color: #fff;
        text-align: center;
      }
    }

    .footer {
      position: absolute;
      -webkit-user-drag: none;

      &.tiger {
        left: -5.4%;
        bottom: -5.4%;
        max-width: 32%;
        width: 161px;
      }

      &.rabbit {
        right: -3.6%;
        bottom: -4.4%;
        max-width: 26%;
        width: 130px;
      }

      &.coin {
        left: 50%;
        bottom: -8%;
        transform: translateX(-50%);
        width: 100% !important;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .envelope-stage-wrapper {
    .envelope-stage-inner-wrapper {
      padding-bottom: 44vw;

      .selected-envelope {
        .prize {
          font-size: 30px;
        }
        .remaining-time {
          font-size: 4vw;
        }
      }
    }
  }
}

@media screen and (max-width: 450px) {
  .envelope-stage-wrapper {
    .envelope-stage-inner-wrapper {
      .envelope-wrapper {
        .envelope-item {
          .prize-wrapper {
            font-size: 16px;
            line-height: 20px;

            .prize {
              font-size: 20px;
              line-height: 24px;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 375px) {
  .envelope-stage-wrapper {
    .envelope-stage-inner-wrapper {
      .envelope-wrapper {
        .envelope-item {
          .prize-wrapper {
            font-size: 14px;
            line-height: 18px;

            .prize {
              font-size: 18px;
              line-height: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
