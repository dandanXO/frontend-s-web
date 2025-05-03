<template>
  <div class="envelope-stage-wrapper">
    <div class="envelope-stage-inner-wrapper">
      <img
        class="title"
        src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/envelope-stage/title.png"
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
        <span class="prize">{{$t("hotPromo.rs")}}{{ prizeList[selectedIndex]?.prize }}</span>
        <span class="desc">{{$t("hotPromo.withdraw_money_over_rs") }} {{ targetWithdrawAmount }}</span>
        <CommonButton class="withdraw-btn" @click="$emit('envelopeClick')">{{ $t("hotPromo.go_withdraw_now") }}</CommonButton>
        <span class="remaining-time">{{ $t("hotPromo.time_left") }}: {{ remainingTime }}</span>
      </div>
      <img class="footer dragon" src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/envelope-stage/footer.png" />
      <!-- <img class="footer tiger" src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/decoration-tiger.png" />
      <img
        class="footer rabbit"
        src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/decoration-rabbit.png"
      />
      <img
        class="footer coin"
        src="../../../assets/images/promotion/hotpromo/spin-lucky-wheel/envelope-stage/footer-coin.png"
      /> -->
    </div>
  </div>
</template>
<script setup>
import moment from "moment";
import { inject, onUnmounted, ref } from "vue";
import CommonButton from "./CommonButton.vue";
import { eventapi } from "src/boot/axios";

defineEmits(["envelopeClick"]);

const envelopeStatus = ref("idle");
const prizeList = ref(new Array(6).fill().map(() => ({ status: "idle", prize: 0 })));
const selectedIndex = ref(0);
const remainingTime = ref("00:00:00");
const endTime = ref("");
const isClaiming = ref(false);
const timer = ref();
const wheelNo = ref(0);

const targetWithdrawAmount = inject("targetWithdrawAmount");

const delay = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const handleEnvelopeClick = (index) => {
  if (prizeList.value[index].status !== "idle" || isClaiming.value) return;

  isClaiming.value = true;
  selectedIndex.value = index;
  eventapi.post("/session/refer-wheel-spin/red-packet?promoCode=pk2-refer-wheel-spin").then(async (res) => {
    let otherPrizeCounter = 0;

    prizeList.value[index].status = "selected";
    prizeList.value[index].prize = res.data.bonus;

    const targetIndex = res.data.redPackets.findIndex((prize) => prize === res.data.bonus);
    const temp = res.data.redPackets[index];
    res.data.redPackets[index] = res.data.redPackets[targetIndex];
    res.data.redPackets[targetIndex] = temp;

    // let constantIndex = Math.floor(Math.random() * 6);
    // while (constantIndex === index) {
    //   constantIndex = Math.floor(Math.random() * 6);
    // }

    await delay(1000);
    prizeList.value.forEach((prize, _index) => {
      // if (_index === constantIndex) {
      //   prize.status = "unselected";
      //   prize.prize = targetWithdrawAmount.value;
      // } else
      if (_index !== index) {
        prize.status = "unselected";
        prize.prize = res.data.redPackets[otherPrizeCounter];
      }
      otherPrizeCounter++;
    });

    const [initRes] = await Promise.all([
      eventapi.get("/session/refer-wheel-spin/init?promoCode=pk2-refer-wheel-spin"),
      delay(1000)
    ]);

    const wheelEndTime = moment.tz(initRes.data.wheelEndTime, "Asia/Karachi");
    const wheelResetTime = moment.tz(initRes.data.wheelResetTime, "Asia/Karachi");
    const now = moment();

    endTime.value = now.isAfter(moment.min(wheelEndTime, wheelResetTime))
      ? moment.max(wheelEndTime, wheelResetTime)
      : moment.min(wheelEndTime, wheelResetTime);

    wheelNo.value = initRes.data.wheelNo;
    envelopeStatus.value = "selected";
    updateRemainingTime();
    timer.value = setInterval(updateRemainingTime, 1000);
    isClaiming.value = false;
  }).catch((err) => {
    isClaiming.value = false;
  })
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
    }

    .envelope-wrapper {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(3, 1fr);
      position: relative;
      z-index: 999;
      .envelope-item {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        background: url(../../../assets/images/promotion/hotpromo/spin-lucky-wheel/envelope-stage/envelope-close.png)
          no-repeat;
        background-size: 100% 100%;
        aspect-ratio: 109 / 133;
        border: none;
        padding: 13% 0 0;
        // transition: backg;
        min-height: 126px;

        &.selected,
        &.unselected {
          background-image: url(../../../assets/images/promotion/hotpromo/spin-lucky-wheel/envelope-stage/envelope-opened.png);
        }

        &.unselected {
          opacity: 0.6;
        }

        .prize-wrapper {
          font-size: 20px;
          font-weight: 700;
          line-height: 24px;
          color: #f33d31;
          min-height: 110px;

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
      background: url(../../../assets/images/promotion/hotpromo/spin-lucky-wheel/envelope-stage/envelope-detail.png)
        no-repeat;

      background-size: 100% 100%;
      aspect-ratio: 485 / 574;
      margin: 0 auto;
      position: relative;
      min-height: 330px;
      z-index: 1000;

      .prize {
        position: absolute;
        top: 26%;
        width: 100%;
        transform: translateY(-50%);
        font-size: 50px;
        font-weight: 900;
        color: #ee281d;
        text-align: center;
      }

      .desc {
        position: absolute;
        top: 34%;
        left: 50%;
        transform: translateX(-50%);
        width: 70%;
        font-size: 20px;
        font-weight: 900;
        color: #ee281d;
        text-align: center;
      }

      .withdraw-btn {
        position: absolute;
        top: 75%;
        font-size: 25px;
        left: 50%;
        width: 80%;
        transform: translate(-50%, -50%);
        margin: 0 auto;
        background: unset;
        color: #D01608;
        min-height: 60px;

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

      &.dragon {
        left: 50%;
        bottom: 0%;
        transform: translateX(-50%);
        width: 100%;
        margin-bottom: 0 !important;
      }

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
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .envelope-stage-wrapper {
    .envelope-stage-inner-wrapper {
      // padding-bottom: 44vw;
        padding-bottom: 75vw;

      .selected-envelope {
        .prize {
          font-size: 10vw;
        }
        .desc {
          font-size: 4vw;
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

          min-height: 100px;
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
