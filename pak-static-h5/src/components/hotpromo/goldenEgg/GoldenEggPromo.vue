<template>
  <div class="golden-egg-wrapper">
    <div class="prize-outer-wrapper">
      <div class="prize-inner-wrapper">
        <button
          v-for="(prize, index) in prizeList"
          :key="index"
          class="prize-item"
          :class="{ disabled: !availableDraw }"
          @click="handlePrizeClick(index)"
        >
          <Transition name="fade">
            <div v-if="prize.status !== 'claimed'">
              <img
                class="golden-egg"
                :class="{ shake: prize.status === 'claim' && availableDraw }"
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
              <span class="prize-info">{{ store.currency.value }}{{ convertToCommaAmount(prize.prize) }}</span>
            </div>
          </Transition>
        </button>
      </div>
      <button class="claim-btn">{{ $t("hotPromo.remainingTimes") }}:{{ availableDraw }}</button>
    </div>

    <div class="progressbar-wrapper">
      <div
        class="progressbar-progress"
        :style="{ left: `clamp(10px, calc(${betProgress}% + 2px), calc(100% - 10px))` }"
      >
        {{ betProgress }}%
      </div>
      <div class="progressbar-border" />
      <div class="progressbar-inner" :style="{ width: `${betProgress}%` }" />
    </div>

    <div class="bets-wrapper">
      {{$t("hotPromo.current_valid_bets")}}: {{ convertToCommaAmount(validBet) }}/{{ convertToCommaAmount(minValidBet) }}
      PKR
    </div>

    <div class="activities-wrapper">
      <div class="block-title">{{ $t("hotPromo.activities") }}</div>
      <!-- <img class="block-title" src="../../../assets/images/promotion/hotpromo/golden-egg/activities-title.png" /> -->
      <p>
        {{ $t("content.aviatorPromoIntro") }}
      </p>
      <p>
        {{ $t("content.aviatorGoldenEgg") }}
      </p>
      <p style="color: #fff">
        {{ $t("content.aviatorTopTurnover") }}
      </p>
    </div>

    <div class="ranking-wrapper">
      <!-- <img class="block-title" src="../../../assets/images/promotion/hotpromo/golden-egg/ranking-title.png" /> -->
      <div class="ranking-list-wrapper">
        <img
          class="ranking-decoration"
          src="../../../assets/images/promotion/hotpromo/golden-egg/ranking-decoration.png"
        />
        <div class="ranking-list-slot" />
        <div class="ranking-list-content" :style="{ height: `${rankingListHeight}px` }">
          <div class="ranking-block-title">{{ $t("hotPromo.ranking_and_bonus") }}</div>
          <!-- <div class="ranking-list-title">
            <span>TIME</span>
          </div> -->

          <div class="ranking-list-table-wrapper">
            <table class="ranking-list-table">
              <thead>
                <tr>
                  <th width="10%" align="center">{{ $t("hotPromo.goldenEgg.ranking") }}</th>
                  <th width="45%" align="center">{{ $t("hotPromo.goldenEgg.userName") }}</th>
                  <th width="45%" align="center">{{ $t("hotPromo.goldenEgg.betVolume") }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="rankingLists.length">
                  <tr v-for="(item, index) in rankingLists" :key="index">
                    <td width="20%" align="center">
                      <div class="ranking-icon" :class="{ crown: index < 3 }">
                        <img
                          v-if="index < 3"
                          :src="
                            require(`../../../assets/images/promotion/hotpromo/golden-egg/ranking-icon-${
                              index + 1
                            }.png`)
                          "
                        />
                        <span v-else>{{ index + 1 }}</span>
                      </div>
                    </td>
                    <td width="40%" align="center">{{ item.loginName }}</td>
                    <td width="40%" align="center">{{ convertToCommaAmount(item.amount) }} PKR</td>
                  </tr>
                </template>
                <div v-else class="no-record">{{ $t("hotPromo.noRecords") }}</div>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="showPrizeDetail" @show="handlePrizeDetailShow">
      <div class="prize-detail-wrapper">
        <span class="prize-detail">{{ store.currency.value }}{{ convertToCommaAmount(prizeDetail) }}</span>
        <button class="confirm-btn" v-close-popup></button>
        <q-icon class="close-btn" name="close" v-close-popup></q-icon>
      </div>
    </q-dialog>
  </div>
</template>
<script setup>
import { useQuasar } from "quasar";
import { eventapi } from "src/boot/axios";
import { convertToCommaAmount } from "src/boot/utils";
import { userStore } from "src/stores";
import { computed, onMounted, ref } from "vue";

const store = userStore();
const $q = useQuasar();

const availableDraw = ref(0);
const validBet = ref(0);
const minValidBet = ref(0);
const isClaiming = ref(false);
const rankingLists = ref([]);
const showPrizeDetail = ref(false);
const prizeDetail = ref("");
const prizeList = ref([
  { status: "claim", prize: null },
  { status: "claim", prize: null },
  { status: "claim", prize: null },
  { status: "claim", prize: null },
  { status: "claim", prize: null },
  { status: "claim", prize: null }
]);

const betProgress = computed(() => {
  const progress = Math.floor((validBet.value / minValidBet.value) * 100);
  if (isNaN(progress)) return 0;
  return progress > 100 ? 100 : progress;
});

const rankingListHeight = computed(() => {
  return rankingLists.value.length * 30 + 80;
});

const handlePrizeClick = async (index) => {
  if (isClaiming.value || !availableDraw.value) return;

  isClaiming.value = true;
  prizeList.value[index].status = "claiming";

  eventapi
    .post("/session/aviator-golden-egg/draw?promoCode=pak-aviator-golden-egg")
    .then((res) => {
      if (res.code === 0) {
        let otherPrizeCounter = 0;

        prizeList.value.forEach((_, _index) => {
          if (_index === index) {
            prizeList.value[_index].prize = res.data.bonus;
            prizeList.value[_index].status = "claimed";
          } else {
            prizeList.value[_index].prize = res.data.otherBonus[otherPrizeCounter++];
          }
        });

        setTimeout(() => {
          prizeList.value.forEach((prize) => {
            prize.status = "claimed";
          });
        }, 1000);

        setTimeout(() => {
          prizeDetail.value = res.data.bonus;
          showPrizeDetail.value = true;
          isClaiming.value = false;
        }, 2000);
      } else {
        resetClaimStatus();
        $q.notify({
          color: "negative",
          position: "top",
          message: res.message,
          icon: "report_problem"
        });
      }
    })
    .catch(resetClaimStatus);
};

const resetClaimStatus = () => {
  prizeList.value.forEach((prize) => {
    prize.status = "claim";
    prize.prize = null;
  });
  isClaiming.value = false;
};

const initGoldenEggPromo = () => {
  eventapi.get("/session/aviator-golden-egg/init?promoCode=pak-aviator-golden-egg").then((res) => {
    if (res.code === 0) {
      availableDraw.value = res.data.availableDraw;
      validBet.value = res.data.validBet;
      minValidBet.value = res.data.minValidBet;
    }
  });
};

const getRankingData = () => {
  eventapi.post("/session/aviator-golden-egg/top-ranking?promoCode=pak-aviator-top-bet-ranking").then((res) => {
    if (res.code === 0) {
      rankingLists.value = res.data;
    }
  });
};

const handlePrizeDetailShow = () => {
  initGoldenEggPromo();
  store.getBalance();
  prizeList.value.forEach((prize) => {
    prize.status = "claim";
    prize.prize = null;
  });
};

onMounted(() => {
  initGoldenEggPromo();
  getRankingData();
});
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
        background-size: contain;
    aspect-ratio: 135 / 135;
    border: none;
    background-position: center top;
        border: none;
        &.disabled {
          .golden-egg {
            animation: none;
            filter: grayscale(1);
          }
        }
        .golden-egg {
          width: 60%;
          position: absolute;
          top: 0%;
          left: 23%;
          margin-bottom: 0;
          &.shake {
            animation: shake 1s linear infinite;
          }
          &.prize-item-opened {
            animation: none;
            width: 88%;
            top: -18%;
            left: 8%;
          }
        }
        .hammer {
          width: 34px;
          position: absolute;
          top: 10%;
          left: 77%;
          animation: knock 0.5s linear 1;
        }
        .prize-info {
          position: absolute;
          top: 20%;
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
      aspect-ratio: 300 / 80;
      margin: 30px auto 0;
      line-height: 16px;
      color: #fff;
      font-weight: 900;
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
      min-width: 1%;
      max-width: calc(100% - 4px);
      // background: url(../../../assets/images/promotion/hotpromo/golden-egg/progressbar-inner.png) no-repeat;
      background: linear-gradient(90deg, #ff8b00 0%, #fde30f 100%);
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
      font-size: 10px;
      line-height: 32px;
      font-weight: 900;
      color: #fff;
    }
  }

  .bets-wrapper {
    margin-top: 8px;
    text-align: center;
    color: #9f9f9f;
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
        // height: 25px;
      }
      .ranking-list-content {
        border-radius: 20px;
        border: 1px solid #f4bb90;
        background: linear-gradient(180deg, rgba(120, 76, 41, 0.8) 0%, rgba(44, 23, 9, 0.8) 100%);
        // width: calc(100% - 24px);
        min-height: 200px;
        max-height: 318px;
        // margin: -12px auto 0;
        // background: url(../../../assets/images/promotion/hotpromo/golden-egg/ranking-list-bg.png) no-repeat,
        //   linear-gradient(36.43deg, #0e1e08 6.88%, #1b6026 100.29%);

        background-size: 100% 100%;
        padding: 10px 10px 10px;
        position: relative;
        .ranking-block-title {
          color: #e0b690;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto 20px;
          font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-weight: 700;
          font-size: 1rem;
          line-height: 100%;
          letter-spacing: 0;
          text-align: center;
          text-transform: uppercase;
        }
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
            thead {
              border: 1px solid #f9cda8;
              border-radius: 10px;
              display: table-caption;
              overflow: hidden;
            }
            th {
              padding: 5px;
              text-align: right;
              color: #E0B690;
              font-weight: 600;
              font-family: "Poppins";
              background: linear-gradient(180deg, #794d2a 0%, #5a3a1e 51%, #341400 100%);
            }
            /* Apply colors to specific rows */
            tr:nth-child(1) td,
            tr:nth-child(2) td,
            tr:nth-child(3) td {
              color: #d88e4f; /* White text for contrast */
            }
            td {
              border: none;
              border-bottom: 1.38px solid #bb9473;
              background-color: unset;
              // color: #6db85f;
              font-weight: 700;
              color: #e0b690;
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
            .no-record {
              width: 100%;
              text-align: center;
              // color: #6db85f;
              color: #E0B690;
              padding: 35px 0;
            }
          }
        }
      }
    }
  }
}

.block-title {
  width: 100%;
  font-family: Poppins;
  font-weight: 700;
  font-size: 22.07px;
  line-height: 100%;
  letter-spacing: -0.69px;
  text-align: left;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 15px;
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
    font-family: Poppins;
    font-weight: 700;
    font-size: 18.26px;
    line-height: 13.89px;
    letter-spacing: 0px;
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
