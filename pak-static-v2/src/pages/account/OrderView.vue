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

    <LoadingComponent v-if="isLoading[orderOptionTab]&& !withdrawalData && !depositData"></LoadingComponent>
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
        <q-infinite-scroll @load="loadMore" :initial-index="0" :offset="50" :disable="isEnded.withdrawal">
          <div v-for="(e, i) in withdrawalData" :key="`${e}-${i}`" class="order-table">
            <div class="order-row order-row--title">
              <div class="order-col">{{ $t("records.orderNo") }}</div>
              <div class="order-col flex-c-end gap-8 serial-number">
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
            <div class="order-row order-row--content">
              <div class="order-subrow">
                <div class="order-col withdraw-amount">{{ convertToCommaAmount(e.withdrawAmount, true) }}</div>
                <div class="order-col">{{ e.currencyName }}</div>
              </div>
              <div class="order-subrow">
                <div class="order-col">
                  <span class="txt-gray">{{ convertToGMT55(e.withdrawDate) }}</span>
                </div>
                <div class="order-col q-mt-sm">
                  <!-- <span :class="`${e.status === 'SUCCESS' ? 'txt-green' : 'txt-red'}`">
                    {{ getWithdrawStatus(e.status) }}
                  </span> -->

                  <q-btn
                    unelevated
                    :class="{
                    'btn--green': ['SUCCESS'].includes(e.status),
                    'btn--red': ['FAIL', 'STEP_5'].includes(e.status),
                    'btn--orange': ['APPLY', 'STEP_1', 'STEP_2', 'STEP_3', 'STEP_4'].includes(e.status)
                  }"
                    :label="`${getWithdrawStatus(e.status)}`"
                  ></q-btn>
                </div>
              </div>
            </div>
          </div>

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-tab-panel>

      <q-tab-panel name="recharge">
        <q-infinite-scroll @load="loadMore" :initial-index="0" :offset="50" :disable="isEnded.recharge">
          <div v-for="(e, i) in depositData" :key="`${e}-${i}`" class="order-table">
            <div class="order-row order-row--title">
              <div class="order-col">{{ $t("records.orderNo") }}</div>
              <div class="order-col flex-c-end gap-8 serial-number">
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
            <div class="order-row order-row--content">
              <div class="order-subrow">
                <div class="order-col">{{ e.paymentType }}</div>
                <div class="order-col">
                  <!-- <span :class="`${['SUCCESS', 'SUPPLEMENT_SUCCESS'].includes(e.status) ? 'txt-green' : 'txt-red'}`">
                    {{ getDepositStatus(e.status) }}
                  </span> -->

                  <q-btn
                    unelevated
                    :class="{
                    'btn--green': ['SUCCESS', 'SUPPLEMENT_SUCCESS'].includes(e.status),
                    'btn--red': ['CLOSED'].includes(e.status),
                    'btn--orange': e.status === 'PENDING'
                  }"
                    :label="`${getDepositStatus(e.status)}`"
                  ></q-btn>
                </div>
              </div>
              <div class="order-subrow">
                <div class="order-col">
                  <span class="txt-gray">{{ convertToGMT55(e.depositDate) }}</span>
                </div>
                <div class="order-col deposit-amount">{{ convertToCommaAmount(e.depositAmount, true) }}</div>
              </div>
            </div>
          </div>

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
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

const currentDep = ref(1);
const currentWith = ref(1);

const isLoading = reactive({ withdrawal: true, recharge: true });
const isNoInfo = reactive({ withdrawal: true, recharge: true });

const isEnded = reactive({ withdrawal: false, recharge: false });

const orderOptionTab = ref("withdrawal");

const searchForm = reactive({ startDate: "", endDate: "" });
const setTime = () => {
  searchForm.startDate = updateDate(6);
  searchForm.endDate = updateDate(-1);
};

const withdrawalData = ref([]);
const searchWithdrawalRecord = () => {
  return new Promise((resolve, reject) => {
    isLoading.withdrawal = true;

    const { startDate, endDate } = searchForm;

    const gmtStartDate = convertToGMT8(startDate);
    const gmtEndDate = convertToGMT8(endDate);
    api
      .get("/session/member/withdraw", {
        params: { startDate: gmtStartDate, endDate: gmtEndDate, current: currentWith.value, size: 10 }
      })
      .then((response) => {
        if (response.code === 0) {
          const data = response.data.records;

          currentWith.value++;
          withdrawalData.value.push(...data);

          if (data.length === 0) {
            isNoInfo.withdrawal = true;
          } else {
            isNoInfo.withdrawal = false;
          }

          if (response.data.records.length < 10) {
            isEnded.withdrawal = true;
          }
        }
      })
      .catch((error) => {
        isEnded.withdrawal = true;
      })
      .then(() => {
        isLoading.withdrawal = false;
      });
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
  return new Promise((resolve, reject) => {
    isLoading.recharge = true;

    const { startDate, endDate } = searchForm;
    const gmtStartDate = convertToGMT8(startDate);
    const gmtEndDate = convertToGMT8(endDate);
    api
      .get("/session/member/deposit", {
        params: { startDate: gmtStartDate, endDate: gmtEndDate, current: currentDep.value, size: 10 }
      })
      .then((response) => {
        if (response.code === 0) {
          const data = response.data.records;
          depositData.value.push(...data);

          currentDep.value++;

          if (data.length === 0) {
            isNoInfo.recharge = true;
          } else {
            isNoInfo.recharge = false;
          }

          if (response.data.records.length < 10) {
            isEnded.recharge = true;
          }
        }
      })
      .catch((error) => {
        isEnded.recharge = true;
      })
      .then(() => {
        isLoading.recharge = false;
      });
  });
};

const loadMore = (index, done) => {
  console.log("LOAD MORe");

  if (orderOptionTab.value === "withdrawal") {
    setTimeout(() => {
      searchWithdrawalRecord().then((afterr) => {
        done();
      });
    }, 2000);
  } else {
    setTimeout(() => {
      searchDepositRecord().then((afterr) => {
        done();
      });
    }, 2000);
  }
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
  background: url(../../assets/images/account/deposit-withdraw-tab-bg.png) no-repeat center center;
  background-size: 100% 100%;

  border-radius: 8px;
  width: calc(100% - 20px);
  //margin-bottom: 10px;
  margin: 10px auto;
  height: 0;
  // padding-bottom: calc(32 / 335 * 100);
  aspect-ratio: 335/32;
  min-height: 50px;

  .right {
    color: white;
    // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-right.png) no-repeat center center;
    // background-size: 0;
  }

  .left {
    color: white;
    // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-left.png) no-repeat center center;
    // background-size: 0;
  }

  :deep(.q-tab__label) {
    font-weight: 700;
  }

  :deep(.q-tab--active) {
    color: white;
    // background: url(../assets/images/account/deposit-withdraw-tab-active-bg-left.png) no-repeat center center;
    // background-size: 100% 100%;
    // background: linear-gradient(180deg, rgba(97, 255, 0, 0) 0%, rgba(97, 255, 0, 0.25) 50.5%, rgba(97, 255, 0, 0) 100%);
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);

    &:before {
      content: "";
      background-color: #fff;
      height: 3px;
      border-radius: 4px;
      width: 30%;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
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
    border-bottom: 1px solid #d8e7fd;
    padding: 6px 0px;
    margin-bottom: 10px;
    .order-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      // flex-wrap: wrap;
      flex-direction: column;
      align-items: flex-start;

      &--title {
        border-top-right-radius: 16px;
        border-top-left-radius: 16px;
      }

      &--content {
        flex-wrap: wrap;
        flex-direction: column;
      }

      .order-subrow {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
    }

    .copy-btn {
      // filter: brightness(0) invert(1);
    }

    .order-col {
      color: #424f72;

      &:nth-child(even) {
        text-align: right;
      }

      span.txt-gray {
        color: #9a9a9a;
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

      &.serial-number {
        color: #5e88fb;
      }

      &.deposit-amount {
        color: #00b900;
      }

      &.withdraw-amount {
        color: #b81212;
      }
    }
  }
}

.btn--orange {
  color: #ff7a00;
  font-size: 0.825rem;
  font-weight: 700;
  text-transform: capitalize;
  padding: 4px 10px;
  border-radius: 4px;
  background: rgba(255, 122, 0, 0.2);
  min-height: unset;
  margin-bottom: 4px;
}

.btn--red {
  color: #b81212;
  font-size: 0.825rem;
  font-weight: 700;
  text-transform: capitalize;
  padding: 4px 10px;
  border-radius: 4px;
  background: rgba(184, 18, 18, 0.2);
  min-height: unset;
  margin-bottom: 4px;
}

.btn--green {
  color: #00b900;
  font-size: 0.825rem;
  font-weight: 700;
  text-transform: capitalize;
  padding: 4px 10px;
  border-radius: 4px;
  background: rgba(0, 185, 0, 0.2);
  min-height: unset;
  margin-bottom: 4px;
}
</style>
