<template>
  <q-page class="account-table-page">
    <q-tabs
      v-model="orderOptionTab"
      dense
      no-caps
      class="order-option-tab"
      indicator-color="transparent"
      align="justify"
    >
      <q-tab name="withdrawal" :label="$t('order.withdrawal')" />
      <q-tab name="recharge" :label="$t('order.recharge')" />
    </q-tabs>

    <LoadingComponent v-if="isLoading[orderOptionTab]"></LoadingComponent>
    <NoInfoComponent v-else-if="isNoInfo[orderOptionTab]" :noInfoTitle="$t('records.noRecord')"></NoInfoComponent>
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
          <div class="order-row order-row--content">
            <div class="order-subrow">
              <div class="order-col">
                <span class="date">{{ e.withdrawDate }}</span>
              </div>
              <div class="order-col">
                <span class="yellow">-{{ convertToCommaAmount(e.withdrawAmount, true) }}</span>
              </div>
            </div>
            <div class="order-subrow">
              <div class="order-col">{{ $t("records.bank") }}</div>
              <div class="order-col">
                <span
                  :class="{
                    'btn--green': ['SUCCESS'].includes(e.status),
                    'btn--red': ['FAIL', 'STEP_5', 'FAIL_REVIEW'].includes(e.status),
                    'btn--orange': [
                      'APPLY',
                      'STEP_1',
                      'STEP_2',
                      'STEP_3',
                      'STEP_4',
                      'AUTOPAY',
                      'PENDING',
                      'SENDING',
                      'WAITING_CALLBACK',
                      'PAYING',
                      'WAITING_AUTO_PAY',
                      'WAITING_RETRY'
                    ].includes(e.status)
                  }"
                >
                  {{ getWithdrawStatus(e.status) }}
                </span>
              </div>
            </div>
          </div>
          <div class="order-row order-num">
            <div class="order-col order-number-col">{{ $t("records.orderNo") }}</div>
            <div class="order-col flex-c-end gap-8">
              {{ e.serialNumber }}
              <div @click="copyText(e.serialNumber)">
                <img
                  class="copy-btn btn-pointer"
                  src="../../assets/images/account/content-copy.svg"
                  size="24px"
                  fill="#fff"
                />
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="recharge">
        <div v-for="(e, i) in depositData" :key="`${e}-${i}`" class="order-table">
          <div class="order-row order-row--content">
            <div class="order-subrow">
              <div class="order-col">
                <span class="date">{{ e.depositDate }}</span>
              </div>
              <div class="order-col">
                <span class="green">+{{ convertToCommaAmount(e.depositAmount, true) }}</span>
              </div>
            </div>
            <div class="order-subrow">
              <div class="order-col">{{ e.paymentType }}</div>
              <div class="order-col">
                <span
                  :class="{
                    'btn--green': ['SUCCESS', 'SUPPLEMENT_SUCCESS'].includes(e.status),
                    'btn--red': ['CLOSED'].includes(e.status),
                    'btn--orange': e.status === 'PENDING'
                  }"
                >
                  {{ getDepositStatus(e.status) }}
                </span>
              </div>
            </div>
          </div>
          <div class="order-row order-num">
            <div class="order-col order-number-col">{{ $t("records.orderNo") }} {{ e.serialNumber }}</div>
            <div class="order-col flex-c-end gap-8">
              <div @click="copyText(e.serialNumber)">
                <img
                  class="copy-btn btn-pointer"
                  src="../../assets/images/account/content-copy.svg"
                  size="24px"
                  fill="#fff"
                />
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
    <q-input style="width: 100%; opacity: 0" filled color="white" ref="copyinput" v-model="text_copied" />
  </q-page>
</template>

<script setup>
import { onActivated, onMounted, reactive, ref } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { updateDate, convertToGMT8, convertToGMT55, convertToGMT7 } from "src/boot/utils";
import SwiperNav from "../../components/SwiperNav.vue";
import ProfileSummary from "../../components/ProfileSummary.vue";
import LoadingComponent from "../../components/LoadingComponent.vue";
import NoInfoComponent from "../../components/NoInfoComponent.vue";
import { useQuasar } from "quasar";
import { convertToCommaAmount } from "src/boot/utils";
import { t } from "src/boot/lang";

const $q = useQuasar();
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

const copyinput = ref(null);
const text_copied = ref("");
const copyText = (text) => {
  text_copied.value = text;
  console.log(text_copied.value);

  setTimeout(() => {
    const copyText = copyinput.value;
    console.log(copyText);

    copyText.select();
    document.execCommand("copy");
    console.log("Copied");

    $q.notify({
      color: "positive",
      position: "top",
      message: t("notify.serialNumberCopied"),
      icon: "check_circle_outline"
    });
  }, 100);
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
      return t("records.pending");
    case "WAITING_AUTO_PAY":
      return t("records.waitingAutoPay");
    case "FAIL":
    case "STEP_5":
      return t("records.failed");
    case "SUCCESS":
      return t("records.success");
    default:
      return withdrawStatus;
  }
};

const getDepositStatus = (depositStatus) => {
  switch (depositStatus) {
    case "PENDING":
      return t("records.pending");
    case "SUCCESS":
      return t("records.success");
    case "SUPPLEMENT_SUCCESS":
      return t("records.success");
    case "CLOSED":
      return t("records.closed");
    default:
      return depositStatus;
  }
};

onActivated(() => {
  setTime();
  // NOTE: load both 1st, change if need implement search field
  searchWithdrawalRecord();
  searchDepositRecord();
});
</script>

<style lang="scss" scoped>
.order-option-tab {
  width: calc(100% - 20px);
  margin: 30px auto 10px;
  // border: 1px solid #00B9A1;
  aspect-ratio: 335/32;

  :deep(.q-tabs__content) {
    gap: 16px;
  }

  :deep(.q-tab__label) {
    color: #4b4943;
    font-weight: 700;
  }

  .q-tab {
    flex: 1;
    border-radius: 4px;
    border: 1px solid #4b4943;
  }

  :deep(.q-tab--active) {
    border: none;
    background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
    color: #2d2d2d;
  }
}

.order-option-tab-panel {
  background: transparent;

  :deep(.q-tab-panel) {
    padding: 0;
    width: calc(100% - 20px);
    margin: auto;
  }
  .order-table {
    background: #1f241f;
    border-radius: 4px;
    margin-bottom: 15px;
    overflow: hidden;

    .order-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      gap: 10px;
      flex-wrap: no-wrap;

      &--content {
        padding: 16px 10px;
        gap: 15px;
        flex-wrap: wrap;
        flex-direction: column;
      }

      .order-subrow {
        display: flex;
        justify-content: space-between;
      }

      &.order-num {
        background-color: #ffffff1a;
      }

      .order-number-col{
        white-space: normal
      }
    }

    .copy-btn {
      filter: brightness(0) invert(1);
    }

    .order-col {
      &:nth-child(even) {
        text-align: right;
      }

      span.date {
        color: #ffffff4d;
      }

      span.green {
        color: #00fd7c;
      }

      span.yellow {
        color: #fbab1b;
      }

      img {
        display: block;
      }

      .btn--green {
        padding: 6px 12px;
        color: #00ff11;
        background-color: #00ff1133;
        border-radius: 4px;
      }

      .btn--red {
        padding: 6px 12px;
        color: #ff3434;
        background-color: #ff343433;
        border-radius: 4px;
      }

      .btn--orange {
        padding: 6px 12px;
        color: #fbab1b;
        background-color: #fbab1b33;
        border-radius: 4px;
      }
    }
  }
}
</style>
