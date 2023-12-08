<template>
  <ProfileSummary />

  <SwiperNav :slideList="slideList" :slideListPath="slideListPath" :isActiveSlide="isActiveSlide"></SwiperNav>

  <ContentView contentTopStatus="solid">
    <q-tabs
      v-model="orderOptionTab"
      dense
      no-caps
      class="order-option-tab"
      indicator-color="transparent"
      align="justify"
    >
      <q-tab name="withdrawal" label="Withdrawal" />
      <q-tab name="recharge" label="Recharge" />
    </q-tabs>

    <LoadingComponent v-if="isLoading[orderOptionTab]"></LoadingComponent>
    <NoInfoComponent v-else-if="isNoInfo[orderOptionTab]" noInfoTitle="No Record"></NoInfoComponent>
    <q-tab-panels
      v-else
      class="order-option-tab-panel"
      v-model="orderOptionTab"
      animated
      transition-prev="fade"
      transition-next="fade"
    >
      <q-tab-panel name="withdrawal">
        <div v-for="(e, i) in withdrawalData" :key="`${e}-${i}`" class="order-table">
          <div class="order-row order-row--title">
            <div class="order-col">Order NO.</div>
            <div class="order-col">{{ e.serialNumber }}</div>
          </div>
          <div class="order-row order-row--content">
            <div class="order-subrow">
              <div class="order-col">{{ e.withdrawAmount }}</div>
              <div class="order-col">BANK</div>
            </div>
            <div class="order-subrow">
              <div class="order-col">
                <span class="txt-gray">{{ convertToGMT55(e.withdrawDate) }}</span>
              </div>
              <div class="order-col">
                <span :class="`${e.status === 'SUCCESS' ? 'txt-green' : 'txt-red'}`">
                  {{ getWithdrawStatus(e.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="recharge">
        <div v-for="(e, i) in depositData" :key="`${e}-${i}`" class="order-table">
          <div class="order-row order-row--title">
            <div class="order-col">Order NO.</div>
            <div class="order-col">{{ e.serialNumber }}</div>
          </div>
          <div class="order-row order-row--content">
            <div class="order-subrow">
              <div class="order-col">{{ e.depositAmount }}</div>
              <div class="order-col">{{ e.paymentType }}</div>
            </div>
            <div class="order-subrow">
              <div class="order-col">
                <span class="txt-gray">{{ e.depositDate }}</span>
              </div>
              <div class="order-col">
                <span :class="`${e.status === 'SUCCESS' ? 'txt-green' : 'txt-red'}`">
                  {{ getDepositStatus(e.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </ContentView>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { updateDate, convertToGMT8, convertToGMT55 } from "src/boot/utils";
import SwiperNav from "../../components/SwiperNav.vue";
import ContentView from "../../components/ContentView.vue";
import ProfileSummary from "../../components/ProfileSummary.vue";
import LoadingComponent from "../../components/LoadingComponent.vue";
import NoInfoComponent from "../../components/NoInfoComponent.vue";

const router = useRouter();

let slideList = ref(["Order", "Bank", "Message", "Personal Center", "Discount", "Record"]);
let slideListPath = ref([
  "/account/order",
  "/account/bank",
  "/account/message",
  "/account",
  "/account/discount",
  "/account/record"
]);
let currentSlide = ref(slideList.value[0]);

const isActiveSlide = (e) => {
  if (e === currentSlide.value) return true;
  return false;
};

const isLoading = reactive({ withdrawal: true, recharge: true });
const isNoInfo = reactive({ withdrawal: true, recharge: true });

const orderOptionTab = ref("withdrawal");

const searchForm = reactive({ startDate: "", endDate: "" });
const setTime = () => {
  searchForm.startDate = updateDate(7);
  searchForm.endDate = updateDate(0);
};

const withdrawalData = ref([]);
const searchWithdrawalRecord = () => {
  isLoading.withdrawal = true;
  withdrawalData.value = [];

  const { startDate, endDate } = searchForm;
  
  const gmtStartDate = convertToGMT8(startDate);
  const gmtEndDate = convertToGMT8(endDate);
  api
    .get("/session/member/withdraw", {
      params: { startDate: gmtStartDate, endDate: gmtEndDate, current: 1, size: 10 }
    })
    .then((response) => {
      if (response.code === 0) {
        const data = response.data.records;
        withdrawalData.value.push(...data);

        if (data.length === 0) isNoInfo.withdrawal = true;
        else isNoInfo.withdrawal = false;
      }
    })
    .catch((error) => {})
    .then(() => {
      isLoading.withdrawal = false;
    });
};

const depositData = ref([]);
const searchDepositRecord = () => {
  isLoading.recharge = true;
  depositData.value = [];

  const { startDate, endDate } = searchForm;
  const gmtStartDate = convertToGMT8(startDate);
  const gmtEndDate = convertToGMT8(endDate);
  api
    .get("/session/member/deposit", {
      params: { startDate: gmtStartDate, endDate: gmtEndDate, current: 1, size: 10 }
    })
    .then((response) => {
      if (response.code === 0) {
        const data = response.data.records;
        depositData.value.push(...data);

        if (data.length === 0) isNoInfo.recharge = true;
        else isNoInfo.recharge = false;
      }
    })
    .catch((error) => {})
    .then(() => {
      isLoading.recharge = false;
    });
};

const getWithdrawStatus = (withdrawStatus) => {
  switch (withdrawStatus) {
    case "APPLY":
    case "STEP_1":
    case "STEP_2":
    case "STEP_3":
    case "STEP_4":
      return "Pending";
    case "FAIL":
    case "STEP_5":
      return "Failed";
    case "SUCCESS":
      return "Success";
    default:
      return withdrawStatus;
  }
};

const getDepositStatus = (depositStatus) => {
  switch (depositStatus) {
    case "PENDING":
      return "Pending";
    case "SUCCESS":
      return "Success";
    case "SUPPLEMENT_SUCCESS":
      return "Success";
    case "CLOSED":
      return "Closed";
    default:
      return depositStatus;
  }
};

onMounted(() => {
  setTime();

  // NOTE: load both 1st, change if need implement search field
  searchWithdrawalRecord();
  searchDepositRecord();
});
</script>

<style lang="scss" scoped>
.order-option-tab {
  background-color: rgba(21, 0, 37, 0.6);
  border-radius: 8px;
  margin-bottom: 4px;

  :deep(.q-tab__label) {
    font-weight: 700;
  }

  :deep(.q-tab--active) {
    color: #000000;
    background: linear-gradient(180deg, #ffcd5c 0%, #fea800 100%);
  }
}

.order-option-tab-panel {
  background: transparent;

  :deep(.q-tab-panel) {
    // padding: 8px 12px;
    padding: 0;
  }
  .order-table {
    margin-top: 12px;
    .order-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;

      &--title {
        background-color: rgba(21, 0, 37, 0.5);
        border-top-right-radius: 16px;
        border-top-left-radius: 16px;
      }

      &--content {
        background-color: rgba(21, 0, 37, 0.2);
        flex-wrap: wrap;
        flex-direction: column;
      }

      .order-subrow {
        display: flex;
        justify-content: space-between;
      }
    }

    .order-col {
      &:nth-child(even) {
        text-align: right;
      }

      span.txt-gray {
        color: #888888;
      }

      span.txt-green {
        color: #5bf25c;
      }

      span.txt-red {
        color: #f24c5a;
      }
    }
  }
}
</style>
