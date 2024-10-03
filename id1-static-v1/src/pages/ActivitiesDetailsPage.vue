<template>
  <div class="activities-container">
    <div class="activity-banner">
      <img src="@/assets/images/promotion/activities/deposit-promo-topbanner.png" />
    </div>
    <div class="activities-content">
      {{ $t("promo_activitiesDetails.activitiesContent") }}
    </div>
    <router-link :to="`/deposit?from=${route.path}`" class="activities-btn">
      <img src="@/assets/images/promotion/activities/deposit-btn-1.png" />
    </router-link>
    <div class="activities-stats-container">
      <div class="stats-info">
        <div class="info-title">{{ $t("promo_activitiesDetails.depositOftheDay") }}</div>
        <div class="info-progress">
          <q-linear-progress :value="progressDeposit" rounded size="16px" class="info-linear-progress">
            <div class="info-label">
              {{ progressDepositLabel }}
            </div>
          </q-linear-progress>
          <div class="info-linear-amt">
            {{ rules[bonusSeq] ? rules[bonusSeq].deposit.toLocaleString() : 0 }}
            <br />
            {{ store.currency.label }}
          </div>
        </div>
      </div>
      <div class="stats-info">
        <div class="info-title">{{ $t("promo_activitiesDetails.numberOfDailyWager") }}</div>
        <div class="info-progress">
          <q-linear-progress :value="progressDailyWager" rounded size="16px" class="info-linear-progress">
            <div class="info-label">
              {{ progressDailyWagerLabel }}
            </div>
          </q-linear-progress>
          <div class="info-linear-amt">
            {{ rules[bonusSeq] ? rules[bonusSeq].bet.toLocaleString() : 0 }}
            <br />
            {{ store.currency.label }}
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
        <div class="box-ribbon">{{ $t("promo_activitiesDetails.day") }} {{ i + 1 }}</div>
        <div class="box-img">
          <img
            v-if="(i === bonusSeq && isReceivedToday) || i < bonusSeq"
            :src="require(`@/assets/images/promotion/activities/day-received.png`)"
          />
          <img v-else :src="require(`@/assets/images/promotion/activities/day-0${i + 1}.png`)" />
        </div>
        <div>
          <div class="box-title">
            {{ $t("promo_activitiesDetails.free") }} {{ convertToCommaAmount(rule.bonus) }}{{ store.currency.label }}
          </div>
          <div class="box-subtitle" v-if="(i === bonusSeq && isReceivedToday) || i < bonusSeq">
            <img :src="require(`@/assets/images/promotion/activities/tick.png`)" />

            {{ $t("promo_activitiesDetails.received") }}
          </div>
          <div class="box-subtitle" v-else>
            {{ $t("promo_activitiesDetails.wagerX5") }}
            <br />
            {{ $t("promo_activitiesDetails.deposit") }}
            <br />
            {{ rule.deposit.toLocaleString() }} {{ store.currency.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="activities-notice">
      <div class="notice-img"><img src="@/assets/images/promotion/activities/alert-img.png" /></div>
      <div>{{ $t("promo_activitiesDetails.noticeDesc") }}</div>
    </div>

    <div class="activities-rules-container">
      {{ $t("promo_activitiesDetails.rules_01") }}
      <br />
      {{ $t("promo_activitiesDetails.rules_02") }}
      <br />
      {{ $t("promo_activitiesDetails.rules_03") }}
      <br />
      {{ $t("promo_activitiesDetails.rules_04") }}
    </div>
  </div>
</template>

<script setup>
import { computed, onActivated, ref } from "vue";
import { useRoute } from "vue-router";

import { eventapi } from "@/boot/axios";
import { userStore } from "@/stores/index";
import { convertToCommaAmount } from "@/boot/utils";

const route = useRoute();
const store = userStore();

const progressDeposit = ref(0);
const progressDailyWager = ref(0);

const bonusSeq = ref(0);
const isReceivedToday = ref(false);
const rules = ref([]);

const progressDepositLabel = computed(() => (progressDeposit.value * 100).toFixed(2) + "%");
const progressDailyWagerLabel = computed(() => (progressDailyWager.value * 100).toFixed(2) + "%");

const isLoading = ref(false);
onActivated(() => {
  const acitivtyApi = "/ind/deposit/bonus";
  rules.value = [];
  eventapi.get(acitivtyApi).then((res) => {
    const resp = res.data;
    isLoading.value = false;
    bonusSeq.value = resp.bonusSeq;
    isReceivedToday.value = resp.isReceivedToday;
    resp.rules.forEach((element) => {
      rules.value.push(element);
    });

    if (resp.rules && resp.rules.length >= resp.bonusSeq + 1) {
      progressDeposit.value =
        resp.deposit >= rules.value[resp.bonusSeq].deposit
          ? 1
          : Number(resp.deposit) / Number(rules.value[resp.bonusSeq].deposit);
      progressDailyWager.value =
        resp.bet >= rules.value[resp.bonusSeq].bet ? 1 : Number(resp.bet) / Number(rules.value[resp.bonusSeq].bet);
    }
  });
});
</script>

<style lang="scss" scoped>
.activities-container {
  padding: 0px 1rem 1rem;

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
    padding: 1rem;
    color: #98a6b4;
    border-radius: 8px;
    margin-top: 1rem;
  }

  .activities-btn {
    margin: 1rem 0;
    display: block;
    img {
      display: block;
      width: 100%;
      max-width: 500px;
    }
  }

  .activities-stats-container {
    background: #5817aa99;
    padding: 1rem;
    border-radius: 8px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 2rem;

    .stats-info {
      text-align: center;
      font-size: 12px;

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
            font-size: 10px;
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
      background: #3b156e4d;
      padding: 12px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      position: relative;

      &.isReceived {
        background: linear-gradient(356.25deg, #3b156e -0.21%, #8100ae 93.65%);
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
        background: #4f004b;
        width: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 6px;
        height: 20px;
        font-size: 12px;
      }

      .box-img {
        height: 50px;
        display: flex;
        align-items: center;
        img {
          display: block;
        }
      }

      .box-title {
        font-size: 14px;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
        // white-space: nowrap;
        margin: 4px 10px 0;
      }

      .box-subtitle {
        font-size: 12px;
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
