<template>
  <div id="money-container">
    <span v-for="n in 190" :key="n"></span>
  </div>

  <div class="rain-money-bg">
    <img src="../../assets/images/index/money-rain/bird-decor.png" />
  </div>
  <div class="rain-money-title"><img src="../../assets/images/index/money-rain/money-rain-title.png" /></div>

  <div class="rain-money-tabs-wrapper">
    <div class="rain-money-tabs-container" :class="{ 'has-controller': !!$slots.controller }">
      <slot name="controller">
        <div class="logo-img"><img src="../../assets/images/auth/auth-logo-text-only.png" /></div>
      </slot>
      <!-- <div class="logo-img"><img src="../../assets/images/auth/auth-logo-text-only.png" /></div> -->
      <div class="rain-money-header">
        <span class="orange">666,666PKR&nbsp;</span>
        <span class="green">every time maximum surplus</span>
        <span class="orange">&nbsp;66,666PKR</span>
      </div>

      <div class="rain-money-tabs">
        <div class="tab-header" :class="{ active: moneyRainTab === 'events' }" @click="selectMoneyRainTab('events')">
          Events
        </div>
        <div class="tab-header" :class="{ active: moneyRainTab === 'records' }" @click="selectMoneyRainTab('records')">
          Records
        </div>
      </div>

      <div class="rain-money-tab-content" v-show="moneyRainTab === 'events'">
        <div class="content-sec">
          <div class="treasure-img"><img src="../../assets/images/index/money-rain/baoxiang.gif" /></div>
          <div class="rewind-title">
            Rewind time
            <span>
              <template v-if="nextRainTime.nowIsRain">starts now</template>

              <template v-else>starts at {{ nextRainTime.rainStartNext }}</template>
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
          <div class="timing-head">Every Friday, Saturday, and Sunday</div>
          <div class="timing-body">
            <span>00:00-00:59</span>
            <span>12:00-12:59</span>
            <span>14:00-14:59</span>
            <span>18:00-18:59</span>
            <span>21:00-21:59</span>
          </div>

          <div class="timing-divider"></div>

          <div class="timing-head">On Other Days, Three Times Daily</div>
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
          <div class="footer-title q-mt-sm">Terms and Conditions:</div>
          <div class="footer-content">
            Each round of cash rain freely distributes 666,666 PKR.
            <br />
            Maximum cashback amount per round: 66,666 PKR.
            <br />
            Each round freely distributes cashback.
            <br />
            Deposit ≥ PKR 300 on the same day and complete daily bets totaling ≥ PKR 350 to claim your free bonus.
            <br />
            The received money can be directly used for playing games or withdrawing.
            <br />
            The higher the VIP membership level, the greater the amount received.
          </div>
        </div>
      </div>

      <div class="rain-money-tab-content" v-show="moneyRainTab === 'records'">
        <div class="content-sec">
          <div class="treasure-img"><img src="../../assets/images/index/money-rain/baoxiang.gif" /></div>
          <div class="rewind-title">
            Rewind time
            <span>
              <template v-if="nextRainTime.nowIsRain">starts now</template>

              <template v-else>starts at {{ nextRainTime.rainStartNext }}</template>
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
          <div class="table-title">List of winners</div>

          <div class="table-data">
            <table border="0" cellpadding="4" cellspacing="0" width="100%">
              <thead>
                <tr>
                  <td>Name</td>
                  <td>Date</td>
                  <td>Amount</td>
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
                    <td>Name</td>
                    <td>Date</td>
                    <td>Amount</td>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in listingData" :key="index">
                    <tr>
                      <td>{{ item.name }}</td>
                      <td style="font-size: 70%">{{ item.date }}</td>
                      <td style="font-size: 80%">Rs {{ item.amount }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <q-dialog v-model="showPrizePopup" backdrop-filter="none">
    <q-btn icon="close" round dense v-close-popup class="money-rain-close" />
    <div class="congrats-container">
      <div class="congrats-header"><img src="../../assets/images/index/money-rain/congrats-header.png" /></div>
      <div class="congrats-coupons"><img src="../../assets/images/index/money-rain/congrats-money.png" /></div>
      <div class="congrats-highlight">Rs {{ prizeAmount }}</div>

      <div class="congrats-button">
        <q-btn no-caps unelevated class="btn-primary" :loading="false" @click="showPrizePopup = false">
          {{ $t("btn.confirm") }}
        </q-btn>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { eventapi } from "src/boot/axios";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";

const router = useRouter();
const store = userStore();
const moneyRainTab = ref("events");
const showPrizePopup = ref(false);
const listingData = ref([]);
const draftListing = ref([]);

const convertToTwoDecimalAmount = (amount) => {
  let formattedAmount = parseFloat(amount).toFixed(2);
  return formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
      .get("/redPacketVip/list?promoCode=pk2-red-envelope-rain")
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
    .get("/redPacketVip/nextRainTime?promoCode=pk2-red-envelope-rain")
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
    .get(`/redPacketVip/claim?promoCode=pk2-red-envelope-rain`)
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
  background: #0274dd;
  display: flex;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;
  margin-top: 10px;

  .tab-header {
    padding: 12px;
    width: 50%;
    text-align: center;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.6);

    &.active {
      background: #309cff;
      color: #ffffff;
    }
  }
}

.rain-money-tab-content {
  background: #309cff;;
  min-height: 30dvh;
  height: calc(100vh - 550px);
  overflow-y: auto;
  padding: 16px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;

  .content-footer {
    color: #fff;
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
    background: #0274dd;;
    padding: 8px;
    border-radius: 12px;
    margin-top: 12px;

    .table-title {
      color: #edff1e;
      font-weight: bold;
      font-size: 16px;
    }

    .table-data {
      color: #fff;
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
    background: #0274dd;
    padding: 8px;
    border-radius: 12px;
    text-align: center;
    margin-top: 12px;
    color: #fff;

    .timing-divider {
      display: block;
      height: 1px;
      width: 100%;
      background: rgba(255, 255, 255, 0.21);
      margin: 12px 0;
    }

    .timing-head {
      font-weight: bold;
    }
    .timing-body {
      margin-top: 12px;
      display: flex;
      // gap: 6px;
      :not(:last-child) {
        margin-right: 6px;
        margin-bottom: 6px;
      }
      flex-wrap: wrap;
      justify-content: center;
      span {
        position: relative;
        padding-left: 13px;
        font-size: 12px;

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
    background: #0274dd;
    padding: 8px;
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
      color: #fff;

      span {
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

@supports (height: 100dvh) {
  .rain-money-tab-content {
    height: calc(100dvh - 450px); /* Preferred on modern mobile browsers */
  }
}
.rain-money-bg {
  display: block;
  margin-bottom: -190px;
  img {
    display: block;
    width: 302px;
  }
}

.rain-money-title {
  width: 100%;
  margin-bottom: -150px;
  max-width: 420px;
  z-index: 2;
  img {
    display: block;
    width: 100%;
  }
}

.rain-money-tabs-wrapper {
  background: linear-gradient(149.95deg, #94CBFE 1.35%, #96C3F8 41.73%, #90C8FC 84.62%);
  padding: 6px;
  border-radius: 12px;
  margin: 16px;
  max-width: 400px;
  font-family: "Poppins";

  .rain-money-tabs-container {
    background: linear-gradient(151.97deg, #FEFEFC 2.12%, #BBCAFD 83.61%);
    padding: 16px 10px 4px;
    border-radius: 12px;
    // position: relative;
    // max-height: 325px;

    &.has-controller {
      padding-top: 40px;
    }
    .logo-img {
      width: 100%;
      justify-content: center;
      display: flex;

      img {
        max-width: 115px;
        width: 100%;
        text-align: center;
        height: 34px;
      }
    }

    .rain-money-header {
      font-size: 18px;
      font-weight: 900;
      margin-top: 5px;

      span.orange {
        background-clip: text;
        font-weight: 900;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: linear-gradient(180deg, #ff7527 0%, #ffa011 100%);
      }

      span.green {
        background-clip: text;
        font-weight: 900;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: linear-gradient(92.08deg, #1B3AAA -1.85%, #426FC5 81.76%);

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
  background-image: url("../../assets/images/index/money-rain/money-img.png");
  background-size: cover;
  animation: fall linear infinite;
  animation-duration: calc(4s + var(--random-duration) * 10s); // Random duration between 2s and 5s
  animation-delay: calc(var(--random-delay) * 2s); // Random delay between 0s and 2s
  --random-x: calc(var(--random-x));
  left: -100px;
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
