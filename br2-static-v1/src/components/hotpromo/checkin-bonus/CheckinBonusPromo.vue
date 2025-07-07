<template>
  <div>
    <div class="checkin-promo">
      <div class="checkin-btn" @click="claimPromo()">CHECK-IN</div>
      <div class="checkin-grid">
        <div
          class="checkin-day"
          v-for="(day, i) in checkDays"
          :key="i"
          :class="[`day-${i + 1}`, { checkedin: day.checkedin, expired: day.expired, today: day.today }]"
        >
          <img
            class="tickbox"
            :src="
              require(`../../../assets/images/promotion/checkin-bonus/tickbox${day.checkedin ? '-active' : ''}.png`)
            "
          />
          <div class="day-indication">
            {{ "Day " + (i + 1) }}
          </div>
          <div class="treasure-amt">
            <div class="treasure">
              <img
                class="treasure-icon"
                :src="require(`../../../assets/images/promotion/checkin-bonus/day-${i + 1}.png`)"
              />
            </div>
            <div class="money">{{ day.bonus }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="promo-subtitle">{{ $t("hotPromo.dailyRewards") }}</div>
    <div class="receive-bar-container">
      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-duration.svg" />
          {{ $t("hotPromo.duration") }}
        </div>
        <div class="bar-desc">
          <div class="bar-desc">{{ $t("hotPromo.longTerm") }}</div>
        </div>
      </div>

      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-eligibility.svg" />
          {{ $t("hotPromo.eligibility") }}
        </div>
        <div class="bar-desc">{{ $t("hotPromo.allMembers") }}</div>
      </div>

      <div class="receive-bar">
        <div class="bar-ribbon">
          <img src="../../../assets/images/promotion/receive-earn/icon-description.svg" />
          {{ $t("hotPromo.desc") }}
        </div>
        <div class="bar-desc">{{ $t("hotPromo.signIn7Days.description") }}</div>
      </div>
    </div>

    <!-- <div class="promo-subtitle">{{ $t("hotPromo.tnc") }}</div> -->

    <!-- <div class="tnc-content">
      <ol>
        <li v-for="index in 7" :key="index">
          {{ $t(`hotPromo.signIn7Days.tnc${`${index}`.padStart(2, "0")}`) }}
        </li>
      </ol>
    </div> -->
  </div>

  <q-dialog v-model="showPrizePopup" backdrop-filter="none">
    <!-- <q-btn icon="close" round dense v-close-popup class="money-rain-close" /> -->
    <div class="congrats-wrapper">
      <div class="congrats-container">
        <div class="congrats-highlight">+ {{ $t("hotPromo.rs") }}{{ prizeAmount }}</div>
        <div class="congrats-txt">{{ $t("hotPromo.youGet") }} {{ $t("hotPromo.rs") }}{{ prizeAmount }}</div>

        <div class="congrats-btns">
          <q-btn flat no-caps :loading="false" @click="showPrizePopup = false" class="btn-cancel">
            {{ $t("btn.cancel") }}
          </q-btn>

          <q-btn flat no-caps :loading="false" @click="showPrizePopup = false" class="btn-confirm">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { api, eventapi } from "boot/axios";

const router = useRouter();

const props = defineProps(["params"]);
const params = JSON.parse(props.params || "{}");

// const checkDays = ref([
//   {
//     day: 1,
//     amt: 188,
//     checkedin: true
//   },
//   {
//     day: 2,
//     amt: 288,
//     checkedin: true
//   },
//   {
//     day: 3,
//     amt: 388,
//     checkedin: true
//   },
//   {
//     day: 4,
//     amt: 488,
//     checkedin: true
//   },
//   {
//     day: 5,
//     amt: 588,
//     checkedin: true
//   },
//   {
//     day: 6,
//     amt: 688
//   },
//   {
//     day: 7,
//     amt: 888
//   }
// ]);

const checkDays = ref([
  { day: 1, bonus: "MÁXIMA R$18" },
  { day: 2, bonus: "MÁXIMA R$28" },
  { day: 3, bonus: "Grande Prêmio" },
  { day: 4, bonus: "MÁXIMA R$68" },
  { day: 5, bonus: "MÁXIMA R$108" },
  { day: 6, bonus: "MÁXIMA R$168" },
  { day: 7, bonus: "Grande Prêmio" }
]);

const showPrizePopup = ref(false);
const prizeAmount = ref();

const promoInfo = ref();

const loadPromoInit = () => {
  eventapi
    .get("/session/cycle-check-in?promoCode=br2-daily-check-in")
    .then((res) => {
      // debugger;
      if (res.code === 0) {
        const { checkedInDays, expiredDays, currentDay } = res.data;
        promoInfo.value = res.data;

        checkDays.value.forEach((day) => {
          day.checkedin = checkedInDays.includes(day.day);
          day.expired = expiredDays.includes(day.day);
          day.today = day.day === currentDay;
        });
      }
    })
    .catch((e) => {});
};

const claimPromo = () => {
  eventapi
    .post("/session/cycle-check-in?promoCode=br2-daily-check-in")
    .then((res) => {
      // debugger;
      if (res.code === 0) {
        showPrizePopup.value = true;
        prizeAmount.value = res.data;
        loadPromoInit();
      }
    })
    .catch((e) => {});
};

onMounted(() => {
  loadPromoInit();
});
</script>

<style lang="scss" scoped>
.checkin-promo {
  width: 100%;
  margin: 0 auto;
  .checkin-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    border: 1.5px solid #e0c4a8;
    background: linear-gradient(180deg, #419f74 0%, #1d3f31 100%);
    box-shadow: 0px 4px 4px 0px #ffffff66 inset;
    color: #ffffff;
    padding: 10px;
  }
  .checkin-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 20px auto;
    .checkin-day {
      background: url(../../../assets/images/promotion/checkin-bonus/day-bg.png) no-repeat center center;
      background-size: 100% 100%;
      position: relative;
      padding: 5px;
      border-radius: 5px;

      &.expired {
        opacity: 0.5;
        filter: grayscale(100%);
      }
      &.today {
        // border: 2px solid gold;
      }

      .treasure-amt {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .treasure {
          width: 100%;
          background: url(../../../assets/images/promotion/checkin-bonus/treasure-bg.png) no-repeat center center;
          background-size: contain;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 85px;
          margin: -10px;
          .treasure-icon {
            width: 40px !important;
          }
        }
        .money {
          background: linear-gradient(149.86deg, #c4ffa8 21.97%, #ffee56 57.74%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          /* Optional for smoother rendering */
          background-clip: text;
          color: transparent;
          font-weight: 700;
          font-size: 13px;
          text-align: center;
        }
      }
      &:nth-child(7) {
        grid-column: span 3;

        .treasure-amt {
          flex-direction: row;
          .treasure {
            min-height: 140px;
            padding: 0;
            margin: -20px 0;
            .treasure-icon {
              width: 70px !important;
            }
          }
          .money {
            font-size: 25px;
            width: 100%;
          }
        }
      }
      .tickbox {
        position: absolute;
        top: 5px;
        left: 5px;
        width: 20px !important;
      }
      .day-indication {
        background: url(../../../assets/images/promotion/checkin-bonus/day-indicator.png) no-repeat center center;
        background-size: 100% 100%;
        width: 25px;
        padding: 3px;
        font-size: 8px;
        top: 0;
        right: 5px;
        position: absolute;
        color: #14461f;
        text-align: center;
      }
    }
  }
}
.receive-bar-container {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .receive-bar {
    background: #1f241f;
    border: 1px solid #4b4943;
    padding: 48px 12px 8px;
    position: relative;
    border-radius: 6px;

    .bar-ribbon {
      background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
      display: inline-flex;
      padding: 8px;
      height: 34px;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      color: #2d2d2d;
      font-weight: bold;
      align-items: center;
      position: absolute;
      top: 12px;
      left: 0;
      img {
        display: block;
        margin-right: 8px;
      }
    }

    .bar-desc {
      padding: 8px;
    }
  }
}

.tnc-content {
  ol li {
    margin-bottom: 8px !important;
  }
}

.congrats-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  // background: url(../../assets/images/index/money-rain/congrats-bg.png) no-repeat top center;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  background-size: contain;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  // padding-top: 100px;
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
  color: #ffd288;
}
.congrats-container {
  position: relative;
  background: url(../../../assets/images/promotion/checkin-bonus/congrats-modal.png) no-repeat center center;
  background-size: contain;
  width: 100%;
  height: 470px;
  .congrats-highlight {
    font-family: "Poppins";
    font-weight: 700;
    font-size: 3rem;
    line-height: 100%;
    letter-spacing: 0px;
    text-align: center;
    color: #10d16f;
    margin-top: 280px;
  }

  .congrats-txt {
    font-family: "Poppins";
    font-weight: 700;
    font-size: 1rem;
    line-height: 100%;
    letter-spacing: 0px;
    text-align: center;
    color: #2d2d2d;
    margin-top: 20px;
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

  .congrats-btns {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 40px;
    .btn-cancel {
      border: 1px solid #10d16f;
      color: #2d2d2d;
    }
    .btn-confirm {
      background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
      color: #ffffff;
    }
  }
}
</style>
