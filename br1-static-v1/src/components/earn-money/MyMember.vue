<template>
  <div class="history">
    <div class="history-summary">
      <div class="frame">
        <div class="content-wrapper">
          <div class="title">{{ $t("earnMoney.history.totalRebates") }}</div>
          <div class="amount">
            {{ store.currency.value }} {{ convertToCommaAmount(totalBetRebateData.totalRebate, false) }}
          </div>
        </div>
      </div>
    </div>
    <q-tabs
      v-model="activeKey"
      class="history-tabs q-mb-lg"
      color="black"
      no-caps
      narrow-indicator
      indicator-color="white"
    >
      <q-tab name="month" :label="$t('earnMoney.history.month')"></q-tab>
      <q-tab name="week" :label="$t('earnMoney.history.week')"></q-tab>
    </q-tabs>

    <q-tab-panels v-model="activeKey" class="history-panels">
      <q-tab-panel name="month">
        <div v-for="(e, i) in monthlyDailyBetRebateData" :key="`${e}-${i}`" class="member-info">
          <div class="amount-container">
            <div class="amount-text">{{ $t("earnMoney.history.date") }}</div>
            <div class="amount">
              <span>{{ e.recordTime }}</span>
            </div>
          </div>
          <div class="amount-container">
            <div class="amount-text text-right">{{ $t("earnMoney.history.rebateAmount") }}</div>
            <div class="amount text-right">
              <span>{{ store.currency.value }} {{ convertToCommaAmount(e.rebateAmount, false) }}</span>
            </div>
          </div>
        </div>
        <NoInfoComponent v-if="isNoInfo" :noInfoTitle="$t('records.noRecord')" shortenContainer="true"></NoInfoComponent>
      </q-tab-panel>
      <q-tab-panel name="week">
        <div v-for="(e, i) in weeklyDailyBetRebateData" :key="`${e}-${i}`" class="member-info">
          <div class="amount-container">
            <div class="amount-text">{{ $t("earnMoney.history.date") }}</div>
            <div class="amount">
              <span>{{ e.recordTime }}</span>
            </div>
          </div>
          <div class="amount-container">
            <div class="amount-text text-right">{{ $t("earnMoney.history.rebateAmount") }}</div>
            <div class="amount text-right">
              <span>{{ store.currency.value }} {{ convertToCommaAmount(e.rebateAmount, false) }}</span>
            </div>
          </div>
        </div>
        <NoInfoComponent v-if="isNoInfo" :noInfoTitle="$t('records.noRecord')" shortenContainer="true"></NoInfoComponent>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { api } from "boot/axios";
import { convertToCommaAmount } from "src/boot/utils";
import NoInfoComponent from "../../components/NoInfoComponent.vue";
import { userStore } from "stores/index";

const store = userStore();

const activeKey = ref("month");

let totalBetRebateData = reactive({
  totalRebate: 0,
  rebateFrom: ""
});
const getTotalBetRebateAPI = () => {
  api.get(`/session/member/totalBetRebate`).then((res) => {
    const { code, data } = res;
    if (code === 0) {
      totalBetRebateData.totalRebate = data.totalRebate;
      totalBetRebateData.rebateFrom = data.rebateFrom;
    }
  });
};

const isNoInfo = ref(true);

const monthlyDailyBetRebateData = ref([]);
const weeklyDailyBetRebateData = ref([]);
const getDailyBetRebateAPI = () => {
  api.get(`/session/member/dailyBetRebate?queryTime=30`).then((res) => {
    const { code, data } = res;
    if (code === 0) monthlyDailyBetRebateData.value = data;
    if (data.length > 0) isNoInfo.value = false;
  });

  api.get(`/session/member/dailyBetRebate?queryTime=7`).then((res) => {
    const { code, data } = res;
    if (code === 0) weeklyDailyBetRebateData.value = data;
    if (data.length > 0) isNoInfo.value = false;
  });
};

onMounted(() => {
  getTotalBetRebateAPI();
  getDailyBetRebateAPI();
});
</script>

<style scoped lang="scss">
.history {
  .history-summary {
    background: url("../../assets/images/earn-money/history-bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 0.625rem;
    padding: 15px;

    .frame {
      border-radius: 0.625rem;
      border: 2px solid #fff;
      padding: 2.5px;

      .content-wrapper {
        border-radius: 0.625rem;
        background: rgba(255, 255, 255, 0.7);
        margin: 0 auto;
        text-align: center;
        padding: 30px 50px 25px 50px;
        .title {
          color: #000;
          font-size: 1.75rem;
          font-weight: 600;
        }

        .amount {
          color: #f3930a;
          font-size: 3rem;
          font-weight: 700;
        }

        .date {
          color: rgba(0, 0, 0, 0.6);
          font-size: 1.25rem;
          font-weight: 400;
          margin-top: 25px;
        }
      }
    }
  }

  .history-tabs {
    :deep(.q-tab) {
      color: rgba(255, 255, 255, 0.3);
      border-radius: 0.25rem;
    }

    :deep(.q-tab--active) {
      color: white;
    }
  }

  .history-panels {
    background: transparent;

    .member-info {
      border-radius: 1.25rem;
      padding: 1.25rem;
      margin: 0 0 1rem 0;
      background: linear-gradient(180deg, rgba(139, 54, 248, 0.4) 0%, rgba(51, 74, 214, 0.4) 100%);
      display: flex;
      justify-content: space-between;

      .amount-container {
        .amount-text {
          color: rgba(255, 255, 255, 0.5);
          font-family: Helvetica;
          font-size: 0.95rem;
          font-style: normal;
          font-weight: 400;
          margin-bottom: 6px;
        }

        .amount {
          color: white;
          font-size: 1rem;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
