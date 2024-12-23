<template>
  <div class="golden-egg-wrapper">
    <div class="prize-outer-wrapper">
      <div class="prize-inner-wrapper">
        <button v-for="(prize, index) in prizeList" :key="index" class="prize-item" @click="handlePrizeClick(index)">
          <Transition name="fade">
            <div v-if="prize.status !== 'claimed'">
              <img
                class="golden-egg"
                :class="{ shake: prize.status === 'claim' }"
                src="../../../assets/images/promotion/hotpromo/golden-egg/golden-egg.png"
              />
              <img
                v-if="prize.status === 'claiming'"
                class="hammer"
                src="../../../assets/images/promotion/hotpromo/golden-egg/hammer.png"
              />
            </div>
            <div v-else>
              <img
                class="golden-egg prize-item-opened"
                src="../../../assets/images/promotion/hotpromo/golden-egg/golden-egg-broken.png"
              />
              <span class="prize-info">RS 500,000</span>
            </div>
          </Transition>
        </button>
      </div>
      <button class="claim-btn" :class="{ disabled: !remainingTime }">Remaining times：{{ remainingTime }}</button>
    </div>

    <div class="progressbar-wrapper">
      <div class="progressbar-progress" :style="{ left: `calc(${progress}% + 2px)` }">{{ progress }}%</div>
      <div class="progressbar-border" />
      <div class="progressbar-inner" :style="{ width: `${progress}%` }" />
    </div>

    <div class="activities-wrapper">
      <img class="block-title" src="../../../assets/images/promotion/hotpromo/golden-egg/activities-title.png" />
      <p>
        Enjoy the thrill of betting with Aviator! Your Aviator can win a staggering 3,216x with just one click! ! The
        prize pool for the top 50 is 1,250,000PKR!
      </p>
      <p>
        When betting in Aviator every day, when the effective betting amount reaches 3,000PKR, you can get the chance to
        smash the golden egg (SUNEHRI ANDY). Maximum reward: 88,888PKR, the probability of winning is 3.6%
      </p>
      <p style="color: #fff">
        When betting on Aviator, the player with the highest cumulative turnover will qualify for first place.
      </p>
    </div>

    <div class="ranking-wrapper">
      <img class="block-title" src="../../../assets/images/promotion/hotpromo/golden-egg/ranking-title.png" />
      <div class="ranking-list-wrapper">
        <img
          class="ranking-decoration"
          src="../../../assets/images/promotion/hotpromo/golden-egg/ranking-decoration.png"
        />
        <div class="ranking-list-slot" />
        <div class="ranking-list-content">
          <div class="ranking-list-title">
            <span>TIME</span>
          </div>

          <div class="ranking-list-table-wrapper">
            <table class="ranking-list-table">
              <tr v-for="(item, index) in rankingLists" :key="index">
                <td align="center">
                  <div class="ranking-icon" :class="{ crown: index < 3 }">
                    <img
                      v-if="index < 3"
                      :src="
                        require(`../../../assets/images/promotion/hotpromo/golden-egg/ranking-icon-${index + 1}.png`)
                      "
                    />
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                </td>
                <td align="center">{{ item.username }}</td>
                <td align="center">{{ convertToCommaAmount(item.amount) }}PKR</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="showPrizeDetail">
      <div class="prize-detail-wrapper">
        <span class="prize-detail">{{ prizeDetail }}</span>
        <button class="confirm-btn" v-close-popup></button>
        <q-icon class="close-btn" name="close" v-close-popup></q-icon>
      </div>
    </q-dialog>
  </div>
</template>
<script setup>
import { convertToCommaAmount } from "src/boot/utils";
import { ref } from "vue";

const progress = ref(30);
const rankingLists = ref(Array(10).fill({ username: "USERNAME", amount: 660000 }));
const remainingTime = ref(0);
const showPrizeDetail = ref(false);
const prizeDetail = ref("₨ 500,000");
const prizeList = ref([
  { status: "claim" },
  { status: "claim" },
  { status: "claim" },
  { status: "claimed" },
  { status: "claimed" },
  { status: "claimed" }
]);

const handlePrizeClick = async (index) => {
  if (prizeList.value[index].status === "claimed") return;
  prizeList.value[index].status = "claiming";
  setTimeout(() => {
    prizeList.value[index].status = "claimed";
    showPrizeDetail.value = true;
  }, 700);
};
</script>
<style lang="scss" scoped>
.golden-egg-wrapper {
  padding: 10px;
  > div {
    margin-bottom: 10px;
  }

  .prize-outer-wrapper {
    .prize-inner-wrapper {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      .prize-item {
        display: block;
        position: relative;
        background: url(../../../assets/images/promotion/hotpromo/golden-egg/golden-egg-bg.png) no-repeat;
        background-size: cover;
        aspect-ratio: 94/119;
        border: none;
        .golden-egg {
          width: 64%;
          position: absolute;
          top: 24%;
          left: 23%;
          margin-bottom: 0;
          &.shake {
            animation: shake 1s linear infinite;
          }
          &.prize-item-opened {
            animation: none;
          }
        }
        .hammer {
          width: 34px;
          position: absolute;
          top: 35%;
          left: 75%;
          animation: knock 0.5s linear 1;
        }
        .prize-info {
          position: absolute;
          top: 37%;
          left: 55%;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(246, 103, 56, 0.9) 0%, rgba(217, 54, 0, 0.9) 100%);
          background-clip: text;
          color: transparent;
          font-weight: 900;
          font-size: 8px;
        }
      }
    }
    .claim-btn {
      display: block;
      border: none;
      background: url(../../../assets/images/promotion/hotpromo/golden-egg/btn.png) no-repeat;
      background-size: cover;
      padding: 0 10px;
      aspect-ratio: 258 / 78;
      margin: 30px auto 0;
      line-height: 16px;
      color: #fff;
      font-weight: 900;
      &.disabled {
        cursor: not-allowed;
        pointer-events: none;
        filter: grayscale(100%);
      }
    }
  }

  .progressbar-wrapper {
    position: relative;
    display: flex;
    padding-top: 40px;
    &::before {
      display: block;
      content: "";
      background: url(../../../assets/images/promotion/hotpromo/golden-egg/progressbar-border-left.png) no-repeat;
      background-size: cover;
      width: 8px;
      height: 15px;
    }
    &::after {
      display: block;
      content: "";
      background: url(../../../assets/images/promotion/hotpromo/golden-egg/progressbar-border-right.png) no-repeat;
      background-size: cover;
      width: 8px;
      height: 15px;
    }
    .progressbar-border {
      background: url(../../../assets/images/promotion/hotpromo/golden-egg/progressbar-border-center.png) 100%;
      background-repeat: repeat-x;
      background-size: cover;
      width: 100%;
      height: 15px;
    }
    .progressbar-inner {
      max-width: calc(100% - 4px);
      background: url(../../../assets/images/promotion/hotpromo/golden-egg/progressbar-inner.png) no-repeat;
      position: absolute;
      height: 8px;
      top: 44px;
      left: 2px;
      border-radius: 4px;
      animation: flow 30s linear infinite;
    }
    .progressbar-progress {
      position: absolute;
      top: 0;
      transform: translateX(-50%);
      height: 40px;
      background: url(../../../assets/images/promotion/hotpromo/golden-egg/progressbar-progress-bg.png) no-repeat 100%
        100%;
      background-size: cover;
      aspect-ratio: 35 / 33;
      text-align: center;
      font-size: 14px;
      line-height: 32px;
      font-weight: 900;
      color: #fff;
    }
  }

  .activities-wrapper {
    font-size: 12px;
    line-height: 16px;
    color: #9f9f9f;
  }

  .ranking-wrapper {
    .ranking-list-wrapper {
      .ranking-decoration {
        max-width: 70%;
        margin: 0 auto;
      }
      .ranking-list-slot {
        width: 100%;
        height: 25px;
        background-color: #33562d;
        border: 7px solid #6db85f;
        border-radius: 12px;
      }
      .ranking-list-content {
        width: calc(100% - 24px);
        height: 318px;
        margin: -12px auto 0;
        background: url(../../../assets/images/promotion/hotpromo/golden-egg/ranking-list-bg.png) no-repeat,
          linear-gradient(36.43deg, #0e1e08 6.88%, #1b6026 100.29%);
        background-size: 100% 100%;
        padding: 16px 0 10px;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        position: relative;
        .ranking-list-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          width: 50%;
          height: 18px;
          margin: 0 auto;
          padding: 0 7px;
          background: #b6ffa81a;
          border-radius: 8px;
          font-weight: 600;
          color: #6db85f;
          &::before,
          &::after {
            content: "";
            display: block;
            height: 1px;
            background: #ffffff1a;
            width: 100%;
          }
        }
        .ranking-list-table-wrapper {
          height: calc(100% - 31px);
          overflow: auto;
          margin-top: 13px;
          &::-webkit-scrollbar {
            width: 4px;
            border: none;
          }

          &::-webkit-scrollbar-thumb {
            background-color: #4d7e44;
            border-radius: 6px;
            border: none;
            background-clip: padding-box;
            box-shadow: none;
          }

          &::-webkit-scrollbar-track {
            background: transparent;
            border: none;
            box-shadow: none;
          }

          .ranking-list-table {
            margin: 0;
            td {
              border: none;
              background-color: unset;
              color: #6db85f;
              font-weight: 700;
            }
            .ranking-icon {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 5vw;
              max-width: 25px;
              height: 5vw;
              max-height: 25px;
              margin: 0 auto;
              border: 0.42px solid #ffd9b3;
              background: linear-gradient(308.12deg, #cda175 15.8%, #f9e1cb 89.35%);
              border-radius: 50%;
              color: #73421e;
              font-weight: 600;
              &.crown {
                border: none;
                background: none;
                img {
                  width: 100%;
                  margin-bottom: 0;
                }
              }
            }
          }
        }
      }
    }
  }
}

.block-title {
  width: 100%;
}

.prize-detail-wrapper {
  width: 90%;
  max-width: 450px;
  margin: 0 auto;
  background: url(../../../assets/images/promotion/hotpromo/golden-egg/prize-detail-bg.png) no-repeat;
  background-size: cover;
  aspect-ratio: 1 / 1;
  position: relative;
  .prize-detail {
    position: absolute;
    top: 47%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(180deg, #ffffff 0%, #fbd167 100%);
    background-clip: text;
    color: transparent;
    font-weight: 700;
    font-size: 22px;
  }
  .confirm-btn {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background: url(../../../assets/images/promotion/hotpromo/golden-egg/btn-2.png) no-repeat;
    background-size: cover;
    aspect-ratio: 130 / 34;
    border: none;
    width: 37%;
  }
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}

@keyframes flow {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0;
  }
}

@keyframes shake {
  0% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(10deg);
  }
  30% {
    transform: rotate(-10deg);
  }
  40% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(0deg);
  }
}

@keyframes knock {
  0% {
    transform: rotate(30deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
