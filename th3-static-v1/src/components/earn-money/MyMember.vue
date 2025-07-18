<template>
  <div class="history">
    <div class="history-summary">
      <div class="frame">
        <div class="content-wrapper">
          <div class="left">
            <div>Total Rebates from {{ totalBetRebateData.rebateFrom }}</div>
            <img src="../../assets/images/earn-money/total-rebate-cash.png" />
          </div>
          <div class="right">
            <div class="amount">₹ {{ convertToCommaAmount(totalBetRebateData.totalRebate, false) }}</div>
            <div class="title">Total Rebates</div>
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
      indicator-color="green"
    >
      <q-tab name="month" label="Month"></q-tab>
      <q-tab name="week" label="Week"></q-tab>
    </q-tabs>

    <q-tab-panels v-model="activeKey" class="history-panels">
      <q-tab-panel name="month">
        <div v-for="(e, i) in monthlyDailyBetRebateData" :key="`${e}-${i}`" class="member-info">
          <div class="amount-container">
            <div class="amount-text">Date</div>
            <div class="amount">
              <span>{{ e.recordTime }}</span>
            </div>
          </div>

          <div class="amount-container">
            <div class="amount-text text-right">Rebate Amount</div>
            <div class="amount text-right">
              <span>₹ {{ convertToCommaAmount(e.rebateAmount, false) }}</span>
            </div>
          </div>
        </div>

        <NoInfoComponent v-if="isNoInfo" noInfoTitle="No Record" shortenContainer="true"></NoInfoComponent>
      </q-tab-panel>
      <q-tab-panel name="week">
        <div v-for="(e, i) in weeklyDailyBetRebateData" :key="`${e}-${i}`" class="member-info">
          <div class="amount-container">
            <div class="amount-text">Date</div>
            <div class="amount">
              <span>{{ e.recordTime }}</span>
            </div>
          </div>

          <div class="amount-container">
            <div class="amount-text text-right">Rebate Amount</div>
            <div class="amount text-right">
              <span>₹ {{ convertToCommaAmount(e.rebateAmount, false) }}</span>
            </div>
          </div>
        </div>

        <NoInfoComponent v-if="isNoInfo" noInfoTitle="No Record" shortenContainer="true"></NoInfoComponent>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { api } from "boot/axios";
import { convertToCommaAmount } from "src/boot/utils";
import NoInfoComponent from "../../components/NoInfoComponent.vue";
import moment from 'moment';

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
    // background: url("../../assets/images/earn-money/history-bg.png");
    // background-repeat: no-repeat;
    // background-size: cover;
    border-radius: 0.625rem;
    padding: 15px;

    .frame {
      border-radius: 0.625rem;
      // border: 2px solid #fff;
      padding: 2.5px;

      .content-wrapper {
        border-radius: 0.625rem;
        background: #ffffff0d;
        border: 1px solid #FFFFFF0D;
        margin: 0 auto;
        text-align: center;
        padding: 20px;
        display: grid;
        grid-template-columns: 1fr 1fr;

        .left {
          text-align: left;
          font-size: 14px;
          font-weight: 700;
          line-height: 21px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
        }

        .right {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-end;
          gap: 5px;
        }

        .title {
          color: #FFFFFF66;
          font-size: 14px;
          font-weight: 400;
          line-height: 21px;
        }

        .amount {
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          line-height: 28px;
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

    :deep(.q-tabs__content--align-justify .q-tab) {
      flex: none;
    }
  }

  .history-panels {
    background: transparent;

    .member-info {
      border-radius: 10px;
      padding: 1.25rem;
      margin: 0 0 1rem 0;
      background: #ffffff0d;
      display: flex;
      justify-content: space-between;

      .amount-container {
        .amount-text {
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 400;
          line-height: 16.8px;
        }

        .amount {
          color: white;
          font-size: 16px;
          font-weight: 400;
          line-height: 22.4px;

        }
      }
    }
  }
}
</style>
