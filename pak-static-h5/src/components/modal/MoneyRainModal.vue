<template>
  <div id="money-container">
    <span v-for="n in 10" :key="n" :class="`decor-${Math.floor(Math.random() * (2 - 1 + 1) + 1)}`"></span>
  </div>

  <div class="rain-money-bg" v-if="moneyRainTab === 'events'">
    <img src="../../assets/images/index/money-rain/money-rain-title.png" />
  </div>
  <div class="rain-money-bg" v-if="moneyRainTab === 'records'">
    <img src="../../assets/images/index/money-rain/money-rain-title.png" />
  </div>

  <div class="rain-money-tabs-wrapper">
    <!-- <img class="decor-left" src="../../assets/images/index/money-rain/decor-left.png" /> -->
    <!-- <img class="decor-left-behind" src="../../assets/images/index/money-rain/decor-left-behind.png" /> -->
    <!-- <img class="decor-right" src="../../assets/images/index/money-rain/decor-right.png" /> -->
    <div class="rain-money-tabs-container" :class="{ 'has-controller': !!$slots.controller }">
      <slot name="controller">
        <div class="logo-img"><img src="../../assets/images/auth/auth-logo-text-only.png" /></div>
      </slot>
      <!-- <div class="rain-money-header">
        <span class="orange">666,666PKR&nbsp;</span>
        <span class="green">every time maximum surplus</span>
        <span class="orange">&nbsp;66,666PKR</span>
      </div> -->

      <div class="rain-money-tabs">
        <div class="tab-header" :class="{ active: moneyRainTab === 'events' }" @click="selectMoneyRainTab('events')">
          {{ $t("hotPromo.events") }}
        </div>
        <div class="tab-header" :class="{ active: moneyRainTab === 'records' }" @click="selectMoneyRainTab('records')">
          {{ $t("hotPromo.record") }}
        </div>
      </div>

      <div class="rain-money-tab-content" v-show="moneyRainTab === 'events'">
        <div class="content-sec">
          <div class="treasure-img"><img src="../../assets/images/index/money-rain/treasure-img.png" /></div>
          <div class="rewind-title">
            {{$t("hotPromo.rewind_time")}}
            <span>
              <template v-if="nextRainTime.nowIsRain">{{$t("hotPromo.starts_now")}}</template>

              <template v-else>{{ $t("hotPromo.starts_at") }} {{ nextRainTime.rainStartNext }}</template>
            </span>
          </div>

          <div class="go-btn" v-if="nextRainTime.nowIsRain">
            <q-btn
              round
              @click="onClaimBonus"
              :disable="claimBonusClicked"
              :loading="loadingClaim"
              class="claim-bonus-btn"
            >
              <img src="../../assets/images/index/money-rain/go-btn.png" />
            </q-btn>
          </div>
        </div>
        <div class="content-timing">
          <div class="timing-head">{{ $t("hotPromo.every_friday_saturday_and_sunday") }}</div>
          <div class="timing-body">
            <span>00:00-00:59</span>
            <span>12:00-12:59</span>
            <span>14:00-14:59</span>
            <span>18:00-18:59</span>
            <span>21:00-21:59</span>
          </div>

          <div class="timing-divider"></div>

          <div class="timing-head">{{ $t("hotPromo.on_other_days_three_times_daily") }}</div>
          <div class="timing-body">
            <span>00:00-00:59</span>
            <span>12:00-12:59</span>
            <span>20:00-20:59</span>
          </div>
        </div>

        <div class="content-footer">
          <!-- <div class="footer-title">
            Limited to
            <span>3000 Participants</span>
          </div> -->
          <div class="footer-title q-mt-sm">{{ $t("hotPromo.terms_and_Conditions") }}:</div>
          <div class="footer-content">
            {{ $t("content.cashRainIntro") }}
            
            <br />
            {{ $t("content.cashRainMaxPerRound") }}
            
            <br />
            {{ $t("content.cashRainFreeDistribution") }}
            
            <br />
            {{ $t("content.cashRainClaimCondition") }}
            
            <br />
            {{ $t("content.cashRainUsage") }}
            
            <br />
            {{ $t("content.cashRainVIP") }}
            
          </div>
        </div>
      </div>

      <div class="rain-money-tab-content" v-show="moneyRainTab === 'records'">
        <div class="content-sec">
          <div class="treasure-img"><img src="../../assets/images/index/money-rain/treasure-img.png" /></div>
          <div class="rewind-title">
            {{ $t("hotPromo.rewind_time") }}
            <span>
              <template v-if="nextRainTime.nowIsRain">{{ $t("hotPromo.starts_now") }}</template>

              <template v-else>{{ $t("hotPromo.starts_at") }} {{ nextRainTime.rainStartNext }}</template>
            </span>
          </div>
        </div>

        <!-- <div class="content-table">
          <div class="table-title">Personal records</div>

          <div class="table-data">
            <table cellpadding="4">
              <thead>
                <tr>
                  <td>Game name</td>
                  <td>Point amount</td>
                  <td>Total engagement</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>****</td>
                  <td>Rs 0</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> -->

        <div class="content-table">
          <div class="table-title">{{ $t("hotPromo.list_of_winners") }}</div>

          <div class="table-data">
            <table border="0" cellpadding="4" cellspacing="0" width="100%">
              <thead>
                <tr>
                  <td>{{ $t("hotPromo.name") }}</td>
                  <td>{{ $t("hotPromo.date") }}</td>
                  <td>{{ $t("hotPromo.amount") }}</td>
                </tr>
              </thead>
              <!-- <tbody>
                <tr>
                  <td>55****66</td>
                  <td>Rs 1.3</td>
                  <td>11:00</td>
                </tr>
                <tr>
                  <td>55****66</td>
                  <td>Rs 1.3</td>
                  <td>11:00</td>
                </tr>
                <tr>
                  <td>55****66</td>
                  <td>Rs 1.3</td>
                  <td>11:00</td>
                </tr>
                <tr>
                  <td>55****66</td>
                  <td>Rs 1.3</td>
                  <td>11:00</td>
                </tr>
                <tr>
                  <td>55****66</td>
                  <td>Rs 1.3</td>
                  <td>11:00</td>
                </tr>
                <tr>
                  <td>55****66</td>
                  <td>Rs 1.3</td>
                  <td>11:00</td>
                </tr>
              </tbody> -->
            </table>

            <div class="table-container" ref="tableContainer">
              <table border="0" cellpadding="4" cellspacing="0" width="100%">
                <thead style="opacity: 0">
                  <tr>
                  <td>{{ $t("hotPromo.name") }}</td>
                  <td>{{ $t("hotPromo.date") }}</td>
                  <td>{{ $t("hotPromo.amount") }}</td>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in listingData" :key="index">
                    <tr>
                      <td>{{ item.name }}</td>
                      <td style="font-size: 70%">{{ item.date }}</td>
                      <td style="font-size: 80%">{{ $t("hotPromo.rs") }} {{ item.amount }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
    <img @click="closeModalHandler" class="return-enveloper-btn" src="../../assets/images/index/money-rain/return-red-envelope-btn.png" />
  </div>
  
  <q-dialog v-model="showPrizePopup" backdrop-filter="none">
    <q-btn icon="close" round dense v-close-popup class="money-rain-close" />
    <div class="congrats-wrapper">
      <div class="congrats-head">{{ $t('hotPromo.earnMoney.congratsOnGetting') }}</div>
    <div class="congrats-container">
      <!-- <div class="congrats-header"><img src="../../assets/images/index/money-rain/congrats-header.png" /></div> -->
      <!-- <div class="congrats-coupons"><img src="../../assets/images/index/money-rain/congrats-money.png" /></div> -->
      <div class="congrats-highlight"> {{ $t("hotPromo.rs") }}{{ prizeAmount }}</div>

      <div class="congrats-button">
        <q-btn flat :loading="false" @click="showPrizePopup = false">
          {{ $t("btn.recharge") }}
        </q-btn>
      </div>
    </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref, reactive, defineEmits } from "vue";
import { eventapi } from "src/boot/axios";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";

const router = useRouter();
const store = userStore();
const moneyRainTab = ref("events");
const showPrizePopup = ref(false);
const listingData = ref([]);
const draftListing = ref([]);
const emit = defineEmits(["closeModal"]);
const convertToTwoDecimalAmount = (amount) => {
  let formattedAmount = parseFloat(amount).toFixed(2);
  return formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const closeModalHandler = () => {
  emit("closeModal");
};
const oriListing = {
  roleId: "55****66",
  amount: "1.3",
  time: "11:00"
};

const selectMoneyRainTab = (tab) => {
  moneyRainTab.value = tab;
  if (tab === "records") {
    startAutoScroll();
  }
};

const tableContainer = ref(null);

let scrollIntervalId = null;

const startAutoScroll = () => {
  const container = tableContainer.value;

  if (!container) return;

  let scrollPosition = 0;

  // Clear any existing interval before starting a new one
  if (scrollIntervalId) {
    clearInterval(scrollIntervalId);
  }

  scrollIntervalId = setInterval(() => {
    scrollPosition += 30;

    container.scrollTo({
      top: scrollPosition,
      behavior: "smooth"
    });

    // Reset scroll position if it reaches the bottom
    if (scrollPosition >= container.scrollHeight - container.clientHeight) {
      scrollPosition = 0;
    }
  }, 2000);
};

const stopAutoScroll = () => {
  if (scrollIntervalId) {
    clearInterval(scrollIntervalId);
    scrollIntervalId = null;
  }
};

const getListing = () => {
  if (store.hasToken()) {
    eventapi
      .get("/redPacketVip/list?promoCode=pak-red-envelope-rain")
      .then((res) => {
        if (res.code === 0) {
          // listingData.value = res.data;
          res.data.forEach((item) => {
            if (item.hasOwnProperty("amount")) {
              item.amount = convertToTwoDecimalAmount(item.amount);
            }
          });
          listingData.value = res.data;
          listingData.value.push(...listingData.value);
          listingData.value.push(...listingData.value);
          listingData.value.push(...listingData.value);
          listingData.value.push(...listingData.value);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
};

const claimBonusClicked = ref(false);

const nextRainTime = reactive({
  nowIsRain: false,
  rainStartNext: ""
});

const getNextRainTime = () => {
  eventapi
    .get("/redPacketVip/nextRainTime?promoCode=pak-red-envelope-rain")
    .then((res) => {
      if (res.code === 0) {
        nextRainTime.nowIsRain = res.data.nowIsRain;
        claimBonusClicked.value = res.data.gotAlready;

        // Parse the start time
        const dateTimeString = res.data.rainDuration.startTime;

        // Split the date and time parts
        const [datePart, timePart] = dateTimeString.split("-").reduce(
          (acc, part, index, array) => {
            if (index < 3) acc[0] += (index > 0 ? "-" : "") + part;
            else acc[1] += (index > 3 ? ":" : "") + part;
            return acc;
          },
          ["", ""]
        );

        // Split into individual components
        const [year, month, day] = datePart.split("-").map(Number);
        const [hours, minutes] = timePart.split(":").map(Number);

        // Create a Date object
        const startTime = new Date(year, month - 1, day, hours, minutes);

        const formattedHours = String(startTime.getHours()).padStart(2, "0");
        const formattedMinutes = String(startTime.getMinutes()).padStart(2, "0");
        nextRainTime.rainStartNext = `${formattedHours}:${formattedMinutes}`;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const prizeAmount = ref();
const loadingClaim = ref(false);
const onClaimBonus = () => {
  loadingClaim.value = true;
  eventapi
    .get(`/redPacketVip/claim?promoCode=pak-red-envelope-rain`)
    .then((res) => {
      if (res.code === 0) {
        loadingClaim.value = false;
        showPrizePopup.value = true;
        prizeAmount.value = res.data.vipAmount;
        store.getBalance();

        claimBonusClicked.value = true;
      }
    })
    .catch((err) => {
      console.log(err.message);
      loadingClaim.value = false;
    });
};

onMounted(() => {
  getListing();
  startAutoScroll();
  getNextRainTime();

  const spans = document.querySelectorAll("#money-container span");
  spans.forEach((span) => {
    span.style.setProperty("--random-x", Math.random());
    span.style.setProperty("--random-duration", Math.random());
    span.style.setProperty("--random-delay", Math.random());
    span.style.setProperty("--random-size", Math.random());
  });
});
</script>

<style scoped lang="scss">
.congrats-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(../../assets/images/earn-money/congrats-bg.png)no-repeat top center;
  background-color: rgba(0, 0, 0, .8);
  width: 100%;
    background-size: contain;
    flex-direction: column;
    gap: 20px;
    padding-top: 100px;
}
.congrats-head {
  margin-top: -100px;
  font-family: "Poppins";
  font-weight: 900;
  font-size: 2.4rem;
  line-height: 3.4rem;
  max-width: 300px;
  letter-spacing: 0px;
  text-align: center;
  color: #FFD288;
  
}
.congrats-container {
  position: relative;
  background: url(../../assets/images/earn-money/congrats-card.png)no-repeat center center;
  background-size: contain;
  width: 75%;
  height: 300px;
  .congrats-highlight {
    font-family: "Poppins";
    font-weight: 700;
    font-size: 3rem;
    line-height: 100%;
    letter-spacing: 0px;
    text-align: center;
    color: #F23030;
    margin-top: 50px;
  }
  .congrats-button {
    position: absolute;
    bottom: 11.5%;
    left: 0;
    right: 0;
    margin: auto;
    font-family: Poppins;
    font-weight: 700;
    font-size: 26.48px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    color: #ffffff;

  }
}
.table-container {
  // max-height: 181px;
  max-height: 150px;
  overflow-y: auto;
  position: relative;
  pointer-events: none;

  tr:first-child {
    position: relative;
  }

  tr {
    height: 30px;
  }
}
.table-container::-webkit-scrollbar {
  display: none;
}

.rain-money-tabs {
  display: flex;
  overflow: hidden;
  margin-top: 10px;
  padding-bottom: 10px;
  justify-content: space-around;

  .tab-header {
    padding: 6px;
    width: 143px;
    text-align: center;
    font-weight: bold;
    color: #AA1414;
    position: relative;
    background: #FFFFFF;
    border-radius: 4px;
    font-family: Poppins;

    &.active {
      background: #EE4034;
      color: #ffffff;

      &:before {
        content: "";
        height: 0;
        width: 0;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-top: 12px solid #EE4034;
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translate(-30%, 0%);
        margin: 0 0 0 -3px;
      }
    }
  }
}

.rain-money-tab-content {
  min-height: 30dvh;
  height: calc(100dvh - 450px);
  overflow-y: auto;
  padding: 6px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  font-family: Poppins;

  .content-footer {
    color: #B90704;
    margin-top: 12px;
    .footer-title {
      font-weight: bold;

      span {
        color: #edff1e;
      }
    }
    .footer-content {
      font-size: 12px;
    }
  }

  .content-table {
    background: #EE4034;
    padding: 8px;
    border-radius: 12px;
    margin-top: 12px;

    .table-title {
      color: #edff1e;
      font-weight: bold;
      font-size: 16px;
    }

    .table-data {
      margin-top: 6px;
      table {
        width: 100%;
        thead tr td {
          font-size: 12px;
          text-align: center;
        }

        tbody tr td {
          text-align: center;
          font-weight: bold;
        }
      }
    }
  }

  .content-timing {
    color: #B90704;
    // background: #00b352;
    padding: 8px;
    border-radius: 12px;
    text-align: center;
    margin-top: 6px;

    .timing-divider {
      display: block;
      height: 1px;
      width: 100%;
      background: rgba(255, 255, 255, 0.21);
      margin: 6px 0;
    }

    .timing-head {
      font-weight: bold;
      color: #970503;
    }
    .timing-body {
      margin-top: 6px;
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      justify-content: center;
      span {
        position: relative;
        padding-left: 13px;
        font-size: 12px;
        letter-spacing: 0px;

        &:before {
          content: "";
          background-image: url("../../assets/images/index/money-rain/icon-stopwatch.png");
          height: 12px;
          width: 12px;
          background-size: 100% 100%;
          background-position: center center;
          display: block;
          position: absolute;
          left: 0;
          top: 2px;
        }
      }
    }
  }

  .content-sec {
    background: #F97474;
    padding: 0 8px;
    border-radius: 12px;
    display: flex;
    align-items: center;

    .treasure-img {
      padding-left: 8px;
      img {
        display: block;
        width: 70px;
      }
    }

    .rewind-title {
      font-weight: bold;
      text-align: center;
      margin-left: auto;
      margin-right: auto;

      span {
        font-family: "Arial", sans-serif;
        font-weight: 900;
        display: block;
        font-size: 18px;
        color: #edff1e;
        // white-space: nowrap;
      }
    }

    .go-btn {
      margin: 0 12px;
    }
  }
}

.return-enveloper-btn {
  width: 280px;
  display: flex;
  margin: 0 auto;
  padding: 10px 0;
}

.rain-money-bg {
  display: block;
  margin-bottom: -80px;
  z-index: 1;
  img {
    display: block;
    width: 370px;
    aspect-ratio: 1656 / 768;
  }
}

.rain-money-title {
  width: 100%;
  margin-bottom: -63px;
  max-width: 420px;
  z-index: 2;
  img {
    display: block;
    width: 100%;
  }
}

.rain-money-tabs-wrapper {
  // background: linear-gradient(149.95deg, #94febe 1.35%, #96f8ec 41.73%, #90fc9b 84.62%);
  padding: 6px;
  border-radius: 12px;
  margin: 26px;
  max-width: 400px;
  letter-spacing: -1px;

  .decor-left {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0%, -50%);
    z-index: 1;
    width: 60px;
  }

  .decor-left-behind {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0%, -50%);
    z-index: 0;
    width: 50px;
  }

  .decor-right {
    position: absolute;
    top: 50%;
    right: -2%;
    transform: translate(0%, -50%);
    z-index: 1;
    width: 60px;
  }


  .rain-money-tabs-container {
    background: #FFE9D5;
    border: 1.38px solid #FFC18A;
    padding: 16px 20px 50px;
    border-radius: 12px;
    position: relative;
    clip-path: polygon(100% 0%, 100% 95%, 50% 100%, 0% 95%, 0% 0%);

    &.has-controller {
      padding-top: 40px;
    }

    .logo-img {
      width: 100%;
      justify-content: center;
      display: flex;

      img {
        width: 115px;
        height: 42px;
        width: 100%;
        text-align: center;
      }
    }

    .rain-money-header {
      font-size: 18px;
      font-weight: 900;
      margin-top: 5px;

      span.orange {
        font-family: "Arial", sans-serif;
        background-clip: text;
        font-weight: 900;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: linear-gradient(180deg, #ff7527 0%, #ffa011 100%);
      }

      span.green {
        font-family: "Arial", sans-serif;
        background-clip: text;
        font-weight: 900;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
      }
    }
  }
}

#money-container {
  position: fixed;
  top: 0;
  // left: 0;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
  left: 50%;
  transform: translateX(-50%);
  z-index: -1;
  pointer-events: none;
}

#money-container span {
  position: absolute;
  // width: 100px;
  // height: 77px;
  width: calc(50px + var(--random-size) * 50px); /* Random width between 50px and 100px */
  height: calc(38.5px + var(--random-size) * 38.5px); /* Maintain aspect ratio */
  background-image: url("../../assets/images/index/money-rain/money-rain-decor-1.png");
  background-size: contain;
  background-repeat: no-repeat;
  animation: fall linear infinite;
  animation-duration: calc(4s + var(--random-duration) * 10s); // Random duration between 2s and 5s
  animation-delay: calc(var(--random-delay) * 2s); // Random delay between 0s and 2s
  --random-x: calc(var(--random-x));
  left: -100px;

  &.decor-2 {
    background-image: url("../../assets/images/index/money-rain/money-rain-decor-2.png");
    background-repeat: no-repeat;
    background-size: contain;
    width: calc(50px + var(--random-size) * 50px); /* Random width between 50px and 100px */
    height: calc(38.5px + var(--random-size) * 38.5px); /* Maintain aspect ratio */
  }
  // pointer-events: none;
}

.claim-bonus-btn {
  &.disabled {
    filter: grayscale(100%);
  }
}

@keyframes fall {
  0% {
    transform: translate(0, -100vh) rotate(0deg) scale(0.5);
    left: 0px;
  }
  100% {
    transform: translate(calc(100vw * var(--random-x)), 100vh) rotate(720deg) scale(1);
    left: 0px;
  }
}
</style>
<style lang="scss">

::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
  ::-webkit-scrollbar-thumb {
    background: transparent;
  }
  </style>
