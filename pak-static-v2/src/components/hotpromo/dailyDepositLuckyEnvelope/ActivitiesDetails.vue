<template>
  <div class="activities-container">
    <div class="activities-title">
      <img src="../../../assets/images/promotion/hotpromo/dailyDepositLuckyEnvelope/title-activities.png" />
    </div>
    <div class="activities-content">
      The more consecutive days of deposit requirements you complete, the more extra bonus you will get
    </div>
    <div class="activities-btn" @click="claimBonus" :class="hasClaimed && 'disabled'">
      <img src="../../../assets/images/promotion/hotpromo/dailyDepositLuckyEnvelope/deposit-btn-1.png" />
    </div>
    <div class="current-signin">
      <div class="current">
        <img
          class="calendar-icon"
          src="../../../assets/images/promotion/hotpromo/dailyDepositLuckyEnvelope/daycal.png"
        />
        Current Sign-in:
      </div>
      <div class="noOfDays">Day {{ currentDay }}</div>
    </div>
    <div class="activities-stats-container">
      <div class="stats-info">
        <div class="info-title">Deposits of the day</div>
        <div class="info-progress">
          <q-linear-progress :value="progressDeposit" rounded size="16px" class="info-linear-progress">
            <div class="info-label">
              {{ progressDepositLabel }}
            </div>
          </q-linear-progress>
          <div class="info-linear-amt">
            {{ rules[bonusSeq] ? rules[bonusSeq].minDeposit : 0 }}
            <br />
            RS
          </div>
        </div>
      </div>
      <div class="stats-info">
        <div class="info-title">Number of daily wager</div>
        <div class="info-progress">
          <q-linear-progress :value="progressDailyWager" rounded size="16px" class="info-linear-progress">
            <div class="info-label">
              {{ progressDailyWagerLabel }}
            </div>
          </q-linear-progress>
          <div class="info-linear-amt">
            {{ rules[bonusSeq] ? rules[bonusSeq].minDeposit * betTimes : 0 }}
            <br />
            RS
          </div>
        </div>
      </div>
    </div>
    <div class="activities-days-container">
      <div
        class="days-box"
        v-for="(rule, i) in rules"
        :key="rule"
        :class="[
          i + 1 === 7 ? 'days-box__last' : 'days-box',
          { isReceived: (i === bonusSeq && hasClaimed) || i < bonusSeq }
        ]"
      >
        <div class="box-ribbon">Day {{ i + 1 }}</div>
        <div class="box-cal">
          <img
            v-if="i === bonusSeq && !isReceivedToday"
            src="../../../assets/images/promotion/hotpromo/dailyDepositLuckyEnvelope/cal-active.png"
          />
          <img
            v-if="i > bonusSeq && !isReceivedToday"
            src="../../../assets/images/promotion/hotpromo/dailyDepositLuckyEnvelope/cal.png"
          />
        </div>
        <div class="box-img">
          <img
            v-if="(i === bonusSeq && isReceivedToday) || i < bonusSeq"
            :src="require(`../../../assets/images/promotion/hotpromo/dailyDepositLuckyEnvelope/day-received.png`)"
          />
          <img
            v-else
            :src="require(`../../../assets/images/promotion/hotpromo/dailyDepositLuckyEnvelope/day-0${i + 1}.png`)"
          />
        </div>
        <div>
          <div class="box-title">Max {{ rule.bonusAmount }}rs</div>
          <div class="box-subtitle" v-if="(i === bonusSeq && hasClaimed) || i < bonusSeq">
            <img :src="require(`../../../assets/images/promotion/hotpromo/dailyDepositLuckyEnvelope/tick.png`)" />
            Received
          </div>
          <div class="box-subtitle" v-else>Deposit {{ rule.minDeposit }}rs</div>
        </div>
      </div>
    </div>
    <div class="activities-notice">
      <div class="notice-img">
        <img src="../../../assets/images/promotion/hotpromo/dailyDepositLuckyEnvelope/alert-img.png" />
      </div>
      <div>Notice : This promotion is not counted towards CASINO and SPORTS wager!</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from "vue";
import { eventapi } from "boot/axios";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "src/stores";
import { Dialog, useQuasar } from "quasar";

const store = userStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const progressDeposit = ref(0);
const progressDailyWager = ref(0);

const hasClaimed = ref(false);
const currentDay = ref(0);
const bonusSeq = ref(0);
const isReceivedToday = ref(false);
const rules = ref([
  {
    bet: 10000,
    minDeposit: 2000,
    bonusAmount: "388"
  },
  {
    bet: 10000,
    minDeposit: 2000,
    bonusAmount: "588"
  },
  {
    bet: 10000,
    minDeposit: 2000,
    bonusAmount: "888"
  },
  {
    bet: 10000,
    minDeposit: 2000,
    bonusAmount: "1288"
  },
  {
    bet: 10000,
    minDeposit: 2000,
    bonusAmount: "1688"
  },
  {
    bet: 10000,
    minDeposit: 2000,
    bonusAmount: "2088"
  },
  {
    bet: 10000,
    minDeposit: 2000,
    bonusAmount: "2888"
  }
]);

const totalDeposit = ref(0);
const totalValidBet = ref(0);
const betTimes = ref(0);

const progressDepositLabel = computed(() => {
  const percent = (progressDeposit.value * 100).toFixed(2);
  if (percent >= 100) {
    return "100%";
  }
  return percent + "%";
});
const progressDailyWagerLabel = computed(() => {
  const percent = (progressDailyWager.value * 100).toFixed(2);
  if (percent >= 100) {
    return "100%";
  }
  return percent + "%";
});

const isLoading = ref(false);

const claimBonus = () => {
  eventapi.put("/bonus/claim/pk2-daily-deposit-lucky-envelope").then((res) => {
    const { code, data } = res;

    if (code === 0) {
      $q.notify({
        type: "positive",
        position: "top",
        message: `Claimed bonus amount: ${data}`,
        icon: "check_circle_outline"
      });

      // initDailyDeposit();
      hasClaimed.value = true;
    }
  });
};

const initDailyDeposit = () => {
  eventapi.get("/session/dailyDepositLuckyEnvelope/init").then((res) => {
    const { code, data } = res;

    if (code === 0) {
      currentDay.value = data.todayCheckIn;
      totalDeposit.value = data.totalDeposit;
      totalValidBet.value = data.totalValidBet;
      betTimes.value = data.betTimes;
      hasClaimed.value = data.hasClaimed;
      rules.value = data.rules;

      // progressDeposit.value = totalDeposit.value / 2000;
      bonusSeq.value = currentDay.value - 1;
      if (bonusSeq.value < 0) {
        bonusSeq.value = 0;
      }
      progressDeposit.value = totalDeposit.value / rules.value[bonusSeq.value].minDeposit;
      if (progressDeposit.value > 1) {
        progressDeposit.value = 1;
      }

      // progressDailyWager.value = totalValidBet.value / 10000;
      progressDailyWager.value = totalValidBet.value / (rules.value[bonusSeq.value].minDeposit * betTimes.value);
      if (progressDailyWager.value > 1) {
        progressDailyWager.value = 1;
      }
    }
  });
};

onMounted(() => {
  initDailyDeposit();
});

onActivated(() => {
  // const acitivtyApi = "/ind/deposit/bonus";
  // rules.value = [];

  // eventapi.get(acitivtyApi).then((res) => {
  //   const resp = res.data
  //   isLoading.value = false;
  //   bonusSeq.value = resp.bonusSeq
  //   isReceivedToday.value = resp.isReceivedToday
  //   resp.rules.forEach(element => {
  //     rules.value.push(element)
  //   });

  //   if (resp.rules && resp.rules.length >= resp.bonusSeq + 1) {
  //     progressDeposit.value = resp.deposit >= rules.value[resp.bonusSeq].deposit ? 1 : Number(resp.deposit) / Number(rules.value[resp.bonusSeq].deposit);
  //     progressDailyWager.value = resp.bet >= rules.value[resp.bonusSeq].bet ? 1 : Number(resp.bet) / Number(rules.value[resp.bonusSeq].bet);
  //   }
  // });

  if (!store.token) {
    return Dialog.create({
      class: "login-card",
      title: "Please Login",
      message: "Please log in to operate",
      cancel: { color: "negative", label: "Cancel" },
      ok: { color: "brightbtn", label: "Login" },
      padding: "20px",
      persistent: true
    }).onOk(() => {
      router.push("/login");
    });
  }
});
</script>

<style lang="scss" scoped>
.activities-container {
  .activities-title {
    display: flex;
    justify-content: center;
    img {
      display: block;
      width: 100%;
      max-width: 160px;
      max-height: 35px;
    }
  }

  .activities-content {
    background: rgba(255, 255, 255, 0.05);
    padding: 0.5rem 1rem;
    color: #98a6b4;
    border-radius: 8px;
    margin-top: 1rem;
  }

  .activities-btn {
    margin: 1rem 0;
    display: block;

    &:active {
      transform: translateY(2px);
    }

    &.disabled {
      pointer-events: none;
      opacity: 0.5;
    }

    img {
      display: block;
      width: 100%;
      max-width: 500px;
    }
  }

  .current-signin {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px auto;
    .current {
      display: flex;
      // gap: 5px;
      :not(.last-child) {
        margin-right: 5px;
      }

      .calendar-icon {
        width: 15px;
        max-height: 15px;
      }
    }
    .noOfDays {
      font-weight: bold;
    }
  }
  .activities-stats-container {
    background: linear-gradient(270deg, #3080f4 0%, #70b1ff 100%);
    padding: 1rem;
    border-radius: 8px;
    color: #fff;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 2rem;

    .stats-info {
      text-align: center;

      .info-title {
        margin-bottom: 0.5rem;
      }

      .info-progress {
        display: flex;
        align-items: center;
        gap: 1rem;
        .info-linear-progress {
          border-radius: 20px;
          width: 100%;
          display: flex;

          :deep(.q-linear-progress__model--determinate) {
            background: linear-gradient(90deg, #fff501 0%, #beff06 100%);
            border-radius: 20px;
          }

          .info-label {
            position: absolute;
            top: 0px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
            font-size: 12px;
            color: #ffffff;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7), -1px -1px 2px rgba(0, 0, 0, 0.7),
              1px -1px 2px rgba(0, 0, 0, 0.7), -1px 1px 2px rgba(0, 0, 0, 0.7), 1px 1px 2px rgba(255, 255, 255, 0.7),
              -1px -1px 2px rgba(255, 255, 255, 0.7), 1px -1px 2px rgba(255, 255, 255, 0.7),
              -1px 1px 2px rgba(255, 255, 255, 0.7);
          }
        }
        .info-linear-amt {
          min-width: 40px;
          width: 40px;
          font-size: 10px;
        }
      }
    }
  }

  .activities-days-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 1rem;
    row-gap: 1rem;
    margin-top: 1rem;
    .days-box {
      background: linear-gradient(270deg, #3080f4 0%, #70b1ff 100%);

      padding: 6px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      position: relative;

      &.isReceived {
        background: #d7e9ff;
        .box-img {
          background: unset;
        }
      }

      &__last {
        grid-column: span 3;
        flex-direction: row;
        justify-content: space-evenly;
      }

      .box-ribbon {
        position: absolute;
        top: 10px;
        right: 0;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        color: rgba(255, 255, 255, 0.8);
        background: rgba(16, 79, 0, 1);
        width: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 6px;
        height: 20px;
        font-size: 12px;
      }

      .box-cal {
        position: absolute;
        left: 10px;
        top: 10px;
        img {
          width: 15px;
        }
      }

      .box-img {
        // height: 50px;
        display: flex;
        align-items: center;
        background: url(../../../assets/images/promotion/hotpromo/dailyDepositLuckyEnvelope/blink.png) no-repeat center
          center;
        background-size: contain;
        padding: 15px;
        min-height: 80px;
        img {
          display: block;
        }
      }

      .box-title {
        font-size: 12px;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
        margin-top: 4px;
        // white-space: nowrap;
      }

      .box-subtitle {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
        margin-top: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        img {
          width: 15px;
        }
      }
    }
  }

  .activities-notice {
    background: rgba(234, 0, 28, 0.1);
    height: 50px;
    width: 100%;
    padding: 0 12px;
    text-align: center;
    color: #ea001c;
    display: flex;
    font-size: 12px;
    margin-top: 1rem;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    position: relative;
    padding-left: 40px;

    .notice-img {
      position: absolute;
      left: -10px;
      top: -10px;
      img {
        display: block;
        width: 70px;
      }
    }
  }
  .activities-rules-container {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 1rem;
    color: #98a6b4;
    margin-top: 6px;
  }
  .activity-banner {
    img {
      width: 100%;
    }
  }
}
</style>
