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
      <q-tab class="left" name="withdrawal" :label="$t('order.withdrawal')" />
      <q-tab class="right" name="recharge" :label="$t('order.recharge')" />
    </q-tabs>

    <LoadingComponent v-if="isLoading[orderOptionTab]"></LoadingComponent>
    <NoInfoComponent v-else-if="isNoInfo[orderOptionTab]" :noInfoTitle="$t('notify.noRecord')"></NoInfoComponent>
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
                <span class="txt-gray">{{ e.withdrawDate }}</span>
              </div>
              <!-- <span :class="`${e.status === 'SUCCESS' ? 'txt-green' : 'txt-red'}`">
                  {{ getWithdrawStatus(e.status) }}
                </span> -->

              <div class="order-col orange">- {{ convertToCommaAmount(e.withdrawAmount, true) }}</div>
            </div>
            <div class="order-subrow">
              <div class="order-col">{{ $t("records.bank") }}</div>
              <div class="order-col">
                <q-btn
                  flat
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
                  :label="`${getWithdrawStatus(e.status)}`"
                ></q-btn>
              </div>
            </div>
          </div>
          <div class="order-row order-row--title">
            <div class="order-col">{{ $t("records.orderNo") }}</div>
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
                <span class="txt-gray">{{ e.depositDate }}</span>
              </div>
              <div class="order-col">+{{ convertToCommaAmount(e.depositAmount, true) }}</div>
            </div>
            <div class="order-subrow">
              <div class="order-col">{{ e.paymentType }}</div>
              <div class="order-col">
                <!-- <span :class="`${['SUCCESS', 'SUPPLEMENT_SUCCESS'].includes(e.status) ? 'txt-green' : 'txt-red'}`">
                  {{ getDepositStatus(e.status) }}
                </span> -->

                <q-btn
                  flat
                  :class="{
                    'btn--green': ['SUCCESS', 'SUPPLEMENT_SUCCESS'].includes(e.status),
                    'btn--red': ['CLOSED'].includes(e.status),
                    'btn--orange': e.status === 'PENDING'
                  }"
                  :label="`${getDepositStatus(e.status)}`"
                ></q-btn>
              </div>
            </div>
          </div>
          <div class="order-row order-row--title">
            <div class="order-col">{{ $t("records.orderNo") }}</div>
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
    </q-tab-panels>

    <q-input style="width: 100%; opacity: 0" filled color="white" ref="copyinput" v-model="text_copied" />
  </q-page>
</template>

<script setup>
import { onActivated, onMounted, reactive, ref } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { updateDate, convertToGMT8, convertToGMT55 } from "src/boot/utils";
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
  searchForm.startDate = updateDate(6);
  searchForm.endDate = updateDate(-1);
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
      message: "Serial Number Copied to clipboard.",
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
    case "SUCCESS":
      return t("records.success");
    case "FAIL":
      return t("records.failed");
    case "APPLY":
      return t("records.applying");
    case "STEP_1":
      return t("records.underReview");
    case "STEP_2":
      return t("records.toBePaid");
    case "STEP_3":
      return t("records.paymentOnGoing");
    case "AUTOPAY":
      return t("records.automaticPayment");
    case "PENDING":
      return t("records.pending");
    case "SENDING":
      return t("records.sending");
    case "WAITING_CALLBACK":
      return t("records.waitCallback");
    case "PAYING":
      return t("records.paying");
    case "WAITING_AUTO_PAY":
      return t("records.waitingAutoPay");
    case "FAIL_REVIEW":
      return t("records.failReview");
    case "WAITING_RETRY":
      return t("records.waitingRetry");
    case "STEP_5":
      return t("records.failed");
    case "CLOSED":
      return t("records.closed");
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
  background: #3237384D;
  background-size: 100% 100%;
  border-radius: 8px;
  margin: 20px 16px 4px;
  padding: 1px;
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0px;
  text-align: center;
  color: #ffffff80;
  vertical-align: middle;
  :deep(.q-tabs__content) {
    height: 44px;
  }

  // .right {
  //   padding: 12px 0;
  //   // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-right.png) no-repeat center center;
  //   // background-size: 0;
  // }

  // .left {
  //   padding: 12px 0;
  //   // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-left.png) no-repeat center center;
  //   // background-size: 0;
  // }

  :deep(.q-tab__label) {
    font-weight: 700;
  }

  :deep(.q-tab--active) {
    background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
    color: white;
    border-radius: 6px;
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
    // background: #171e2b80;
    // border-radius: 10px;
    // border-bottom: 1px solid #ffffff33;
    // padding: 6px 0px;
    // margin-bottom: 10px;
    // background: #292d2e;
    background: linear-gradient(90deg, #1C273D 0%, #12192B 100%);

    border-radius: 6px;
    margin: 5px 5px 15px;
    overflow: hidden;
    .order-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      flex-wrap: wrap;

      &--title {
        align-items: center;
        // border-top-right-radius: 16px;
        // border-top-left-radius: 16px;
        background: #ffffff0f;
        .order-col {
          font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-weight: 400;
          font-size: 12px;
          line-height: 14px;
          letter-spacing: 0px;
          color: #b2bdbf;
          &.flex-c-end {
            color: #ffffff;
          }
        }
      }

      &--content {
        flex-wrap: wrap;
        flex-direction: column;
        gap: 10px;
        .order-col:nth-child(2) {
          font-weight: 700;
        }
      }

      .order-subrow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .order-col:nth-child(1) {
          font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-weight: 700;
          font-size: 14px;
          line-height: 14px;
          letter-spacing: 0px;
          color: #ffffff;
        }
      }
    }

    .copy-btn {
      filter: brightness(0) invert(1);
    }

    .order-col {
      &:nth-child(even) {
        text-align: right;
        color: #21ef89;

        &.orange {
          color: #fbab1b;
        }
      }

      span.txt-gray {
        color: #b2bdbf;
        font-size: 12px;
        // background: rgba(136, 136, 136, 0.2);
      }

      span.txt-green {
        color: #5bf25c;
        background: #00b90033;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 0.825rem;
      }

      span.txt-red {
        color: #f24c5a;
        background: #b8121233;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 0.825rem;
      }
    }
  }
}

.btn--orange {
  color: #fbab1b;
  font-size: 0.825rem;
  font-weight: 700;
  text-transform: capitalize;
  padding: 4px 10px;
  border-radius: 4px;
  background: rgba(251, 171, 27, 0.2);
  min-height: unset;
  margin-bottom: 4px;
}

.btn--red {
  color: #ff3434;
  font-size: 0.825rem;
  font-weight: 700;
  text-transform: capitalize;
  padding: 4px 10px;
  border-radius: 4px;
  background: rgba(255, 52, 52, 0.2);
  min-height: unset;
  margin-bottom: 4px;
}

.btn--green {
  color: #21ef89;
  font-size: 0.825rem;
  font-weight: 700;
  text-transform: capitalize;
  padding: 4px 10px;
  border-radius: 4px;
  background: rgba(33, 239, 137, 0.2);
  min-height: unset;
  margin-bottom: 4px;
}
</style>
