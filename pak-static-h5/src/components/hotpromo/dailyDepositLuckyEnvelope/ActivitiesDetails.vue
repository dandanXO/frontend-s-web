<template>
  <div class="activities-container">
    <div class="activities-title">
      <img src="../../../assets/images/promotion/hotpromo/dailyDepositLuckyEnvelope/title-activities.png" />
    </div>
    <div class="activities-content">
      The more consecutive days of deposit requirements you complete, the more extra bonus you will get
    </div>
    <div class="activities-btn" @click="claimBonus">
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
      <div class="noOfDays">Day {{ bonusSeq + 1 }}</div>
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
            {{ rules[bonusSeq] ? rules[bonusSeq].deposit : 0 }}
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
            {{ rules[bonusSeq] ? rules[bonusSeq].bet : 0 }}
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
          { isReceived: (i === bonusSeq && isReceivedToday) || i < bonusSeq }
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
          <div class="box-title">Max {{ rule.bonus }}rs</div>
          <div class="box-subtitle" v-if="(i === bonusSeq && isReceivedToday) || i < bonusSeq">
            <img :src="require(`../../../assets/images/promotion/hotpromo/dailyDepositLuckyEnvelope/tick.png`)" />
            Received
          </div>
          <div class="box-subtitle" v-else>Deposit {{ rule.deposit }}rs</div>
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

const bonusSeq = ref(0);
const isReceivedToday = ref(false);
const rules = ref([
  {
    bet: 10000,
    bonus: "388",
    deposit: 2000
  },
  {
    bet: 10000,
    bonus: "588",
    deposit: 2000
  },
  {
    bet: 10000,
    bonus: "888",
    deposit: 2000
  },
  {
    bet: 10000,
    bonus: "1288",
    deposit: 2000
  },
  {
    bet: 10000,
    bonus: "1688",
    deposit: 2000
  },
  {
    bet: 10000,
    bonus: "2088",
    deposit: 2000
  },
  {
    bet: 10000,
    bonus: "2888",
    deposit: 2000
  }
]);

const totalDeposit = ref(0);
const totalValidBet = ref(0);

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
  eventapi.put("/bonus/claim/pak-daily-deposit-lucky-envelope").then((res) => {
    const { code, data } = res;

    if (code === 0) {
      $q.notify({
        type: "positive",
        position: "top",
        message: `Claimed bonus amount: ${data}`,
        icon: "check_circle_outline"
      });
    }
  });
};

onMounted(() => {
  eventapi.get("/session/dailyDepositLuckyEnvelope/init").then((res) => {
    const { code, data } = res;

    if (code === 0) {
      bonusSeq.value = data.todayCheckIn;
      totalDeposit.value = data.totalDeposit;
      totalValidBet.value = data.totalValidBet;

      progressDeposit.value = totalDeposit.value / 2000;
      progressDailyWager.value = totalValidBet.value / 10000;
    }
  });
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
      gap: 5px;

      .calendar-icon {
        width: 15px;
      }
    }
    .noOfDays {
      font-weight: bold;
    }
  }
  .activities-stats-container {
    background: linear-gradient(356.25deg, #00430b -0.21%, #027402 93.65%);
    padding: 1rem;
    border-radius: 8px;
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
            text-shadow:
              1px 1px 2px rgba(0, 0, 0, 0.7),
              -1px -1px 2px rgba(0, 0, 0, 0.7),
              1px -1px 2px rgba(0, 0, 0, 0.7),
              -1px 1px 2px rgba(0, 0, 0, 0.7),
              1px 1px 2px rgba(255, 255, 255, 0.7),
              -1px -1px 2px rgba(255, 255, 255, 0.7),
              1px -1px 2px rgba(255, 255, 255, 0.7),
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
      background: linear-gradient(356.25deg, rgba(0, 67, 11, 0.3) -0.21%, rgba(2, 116, 2, 0.3) 93.65%);
      &.isReceived {
        background: linear-gradient(356.25deg, #00430b -0.21%, #00ae00 93.65%);
        .box-img {
          background: unset;
        }
      }
      padding: 6px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      position: relative;

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
