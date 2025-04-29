<template>
  <div class="q-pa-md">
    <div class="deposit-overview-wrapper">
      <div class="do-container">
        <div class="do-header">
          <div class="do-title">
            {{ $t("interestProfit.depositOverview") }}
            <div @click="toggleAmountVisibility">
              <q-icon :name="isAmountVisible ? 'visibility' : 'visibility_off'" size="20px" />
            </div>
          </div>
        </div>

        <div class="do-amount">
          <div class="amount-txt">
            {{ store.currency.value
            }}{{ isAmountVisible ? convertToTwoDecimalAmount(depositOverview.totalDeposit) : "*****" }}
          </div>
          <img src="../assets/images/interest-profit/chevron-right.png" />
        </div>

        <div class="do-content">
          <div class="content-item">
            <div class="item-title">{{ $t("interestProfit.unexpiredEarnings") }}</div>
            <div class="item-amount">
              {{ store.currency.value
              }}{{ isAmountVisible ? convertToTwoDecimalAmount(depositOverview.unexpiredEarning) : "*****" }}
            </div>
          </div>
          <div class="content-item">
            <div class="item-title">{{ $t("interestProfit.cumulativeIncome") }}</div>
            <div class="item-amount">
              {{ store.currency.value
              }}{{ isAmountVisible ? convertToTwoDecimalAmount(depositOverview.profitAmount) : "*****" }}
            </div>
          </div>
        </div>
      </div>

      <div class="do-input-container">
        <InputRowGrid>
          <template #fields>
            <div class="select-label">{{ $t("interestProfit.storageTime") }}</div>
            <q-select
              class="do-select"
              outlined
              v-model="interestProfitField.storageTime"
              :options="dayList"
              @update:model-value="onDayChange"
              :rules="[(val) => !!val || $t('interestProfit.storageTime_required')]"
            />

            <div class="select-label">{{ $t("interestProfit.rates") }}</div>
            <q-select
              class="do-select"
              outlined
              v-model="interestProfitField.odds"
              :options="oddList"
              :rules="[(val) => !!val || $t('interestProfit.rates_required')]"
            />
            <InputField :label="$t('interestProfit.deposit')">
              <template #input>
                <q-input
                  type="number"
                  class="q-pb-xs dialog-input"
                  hide-bottom-space
                  outlined
                  v-model="interestProfitField.deposits"
                  label-color="secondary"
                  @keydown.enter="submitDeposit"
                  :rules="[(val) => !!val || $t('interestProfit.deposit_required')]"
                >
                  <template v-slot:prepend>
                    <div>{{ store.currency.value }}</div>
                  </template>
                </q-input>
              </template>
            </InputField>
          </template>
        </InputRowGrid>

        <div class="do-actions">
          <div class="">
            <q-btn
              no-caps
              unelevated
              class="do-btn-grey"
              @click="submitTrialCalculation"
              :loading="isLoading"
              style="white-space: nowrap"
            >
              {{ $t("interestProfit.trialCalculation") }}
            </q-btn>
          </div>
          <div class="">
            <q-btn no-caps unelevated class="do-btn-green" @click="submitDeposit" :loading="isLoading">
              {{ $t("interestProfit.deposit") }}
            </q-btn>
          </div>
        </div>
      </div>

      <div class="do-results-container">
        <template v-if="isLoading">
          <div class="row justify-center"><q-spinner color="primary" size="3em" /></div>
        </template>
        <template v-else>
          <div class="do-result-item">
            <div class="item-title">{{ $t("interestProfit.annualInterestRate") }}</div>
            <div class="item-rates">{{ estimatePlan.odds * 100 }}%</div>
          </div>
          <div class="do-result-item">
            <div class="item-title">{{ $t("interestProfit.distributeInterest") }}</div>
            <div class="item-rates">{{ convertToTwoDecimalAmount(estimatePlan.profitAmount) }}</div>
          </div>
        </template>
      </div>

      <q-tabs
        v-model="recordTabs"
        class="do-record-tabs q-mt-lg"
        color="black"
        no-caps
        narrow-indicator
        @update:model-value="onRecordTabChange"
      >
        <q-tab name="pending" :label="$t('interestProfit.pending')"></q-tab>
        <q-tab name="expired" :label="$t('interestProfit.ended')"></q-tab>
      </q-tabs>

      <div class="do-record-container q-mt-md">
        <template v-if="isRecordLoading">
          <div class="q-pa-lg text-center"><q-spinner color="primary" size="3em" :thickness="10" /></div>
        </template>

        <template v-else>
          <template v-if="depositData.length > 0">
            <div v-for="(e, i) in depositData" :key="`${e}-${i}`" class="order-table">
              <div class="order-row order-row--content">
                <div class="order-subrow">
                  <div class="order-col">
                    <span class="txt-green">{{ store.currency.value }}{{ e.amount }}</span>
                  </div>
                  <div class="order-col">
                    <q-btn
                      unelevated
                      :class="{
                        'btn--green': ['SUCCESS'].includes(e.status),
                        'btn--red': ['CLOSED'].includes(e.status),
                        'btn--orange': e.status === 'PENDING'
                      }"
                      :label="`${getDepositStatus(e.status)}`"
                    ></q-btn>
                  </div>
                </div>
                <div class="order-subrow">
                  <div class="order-col">
                    <span class="txt-gray">{{ moment(e.placeTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
                  </div>
                  <div class="order-col">
                    <span class="txt-green">+{{ convertToTwoDecimalAmount(e.estimateRate) }}</span>
                  </div>
                </div>

                <div class="order-btns">
                  <q-btn no-caps unelevated class="do-btn-grey shorter" @click="viewDetails(e)">
                    {{ $t("interestProfit.details") }}
                  </q-btn>
                  <q-btn
                    no-caps
                    unelevated
                    class="do-btn-green shorter"
                    @click="collectDeposit(e.id)"
                    :loading="isLoading"
                    v-if="e.status === 'PENDING' && recordTabs === 'expired'"
                  >
                    {{ $t("interestProfit.collect") }}
                  </q-btn>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="q-pa-lg text-center">{{ $t("interestProfit.noData") }}</div>
          </template>
        </template>
      </div>
    </div>
  </div>

  <q-dialog v-model="isRecordDetails" full-width>
    <q-card class="q-pa-md record-details-card">
      <q-card-section class="row items-center">
        <q-space />
        <div><q-btn icon="close" round dense v-close-popup /></div>
      </q-card-section>

      <q-card-section class="q-mt-md">
        <div class="details-box">
          <div class="box-title">No.</div>
          <div class="box-value">{{ recordDetails.id }}</div>
        </div>
        <div class="details-box">
          <div class="box-title">{{ $t("interestProfit.annualInterestRate") }}</div>
          <div class="box-value">{{ convertToTwoDecimalAmount(recordDetails.odds * 100) }}%</div>
        </div>
        <div class="details-box">
          <div class="box-title">{{ $t("interestProfit.depositAmount") }}</div>
          <div class="box-value">{{ recordDetails.amount }}</div>
        </div>
        <div class="details-box">
          <div class="box-title">{{ $t("interestProfit.depositDuration") }}</div>
          <div class="box-value">{{ recordDetails.days }} day(s)</div>
        </div>
        <div class="details-box">
          <div class="box-title">{{ $t("records.turnover_requi") }}</div>
          <div class="box-value">{{ turnoverAmt }} x</div>
        </div>
        <div class="details-box">
          <div class="box-title">{{ $t("interestProfit.placeTime") }}</div>
          123
          <div class="box-value">{{ moment(recordDetails.placeTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
        </div>
        <div class="details-box">
          <div class="box-title">{{ $t("interestProfit.matureTime") }}</div>
          <div class="box-value">{{ moment(recordDetails.matureTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
        </div>
        <div class="details-box">
          <div class="box-title">{{ $t("interestProfit.status") }}</div>
          <!-- <div class="box-value">{{ recordDetails.status }}</div> -->
          <div class="box-value">
            <q-btn
              :class="{
                'btn--green': ['SUCCESS'].includes(recordDetails.status),
                'btn--red': ['CLOSED'].includes(recordDetails.status),
                'btn--orange': recordDetails.status === 'PENDING'
              }"
              unelevated
              :label="`${getDepositStatus(recordDetails.status)}`"
            ></q-btn>
          </div>
        </div>
        <q-btn no-caps unelevated class="do-btn-green q-mt-md" v-close-popup>{{ $t("interestProfit.confirm") }}</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="errorDialog">
    <q-card class="q-pa-md">
      <q-card-section class="row items-center">
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-mt-md">
        <div>{{ errorDialogMsg }}</div>
      </q-card-section>
      <q-card-actions align="center" class="q-mt-md">
        <q-btn no-caps v-close-popup>{{ $t("btn.confirm") }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
// import RecordComponent from "../../components/RecordComponent.vue";
// import RecordComponent from "../components/RecordComponent.vue";
import { updateDate, convertToGMT8, convertToGMT55, convertToCommaAmount } from "src/boot/utils";
import { eventapi } from "src/boot/axios";
import { api } from "boot/axios";
import moment from "moment/moment";
import { cached, TIME_EXPIRED } from "boot/cache";
import { useI18n } from "vue-i18n";
import InputField from "../components/auth/InputField.vue";
import InputRowGrid from "../components/auth/InputRowGrid.vue";
import { useQuasar } from "quasar";
import { userStore } from "stores/index";

const { t } = useI18n();
const interestProfitField = reactive({ storageTime: "", odds: "", deposits: "" });
const $q = useQuasar();
const store = userStore();
const qs = require("qs");
const isLoading = ref(false);
const isRecordLoading = ref(false);
const errorDialog = ref(false);
const errorDialogMsg = ref("");
const depositData = ref([]);
const isAmountVisible = ref(true);
const storageTimeOptions = ref([
  { label: "1 month", val: 30 },
  { label: "3 months", val: 90 },
  { label: "6 months", val: 180 },
  { label: "1 year", val: 365 }
]);

const toggleAmountVisibility = () => {
  isAmountVisible.value = !isAmountVisible.value;
};

const searchForm = reactive({ startDate: "", endDate: "" });
const setTime = () => {
  searchForm.startDate = updateDate(6);
  searchForm.endDate = updateDate(-1);
};

const searchDepositRecord = () => {
  isRecordLoading.value = true;
  depositData.value = [];

  const { startDate, endDate } = searchForm;
  const gmtStartDate = convertToGMT8(startDate);
  const gmtEndDate = convertToGMT8(endDate);
  eventapi
    // .get("/interestPlan/getPlanOrderList/expired", {
    //   params: { current: 1, size: 10 }
    // })
    .get(`/interestPlan/getPlanOrderList/${recordTabs.value}`)
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
      isRecordLoading.value = false;
    });
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

const estimatePlan = reactive({
  odds: 0,
  profitAmount: 0
});

const showValidationErrors = () => {
  if (!interestProfitField.storageTime) {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("interestProfit.storageTime_required"),
      icon: "report_problem"
    });
  }
  if (!interestProfitField.deposits) {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("interestProfit.deposit_required"),
      icon: "report_problem"
    });
  }
  if (!interestProfitField.odds) {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("interestProfit.rates_required"),
      icon: "report_problem"
    });
  }
};

const submitTrialCalculation = () => {
  if (!interestProfitField.storageTime || !interestProfitField.deposits || !interestProfitField.odds) {
    showValidationErrors();
    return;
  }

  isLoading.value = true;

  const putData = {
    days: interestProfitField.storageTime.val,
    placeAmount: interestProfitField.deposits,
    selectedOdds: interestProfitField.odds.val
  };

  eventapi
    .put(
      `/interestPlan/calcEstimatePlan?days=${putData.days}&placeAmount=${putData.placeAmount}&selectedOdds=${putData.selectedOdds}`
    )
    .then((res) => {
      if (res.code === 0) {
        estimatePlan.odds = res.data.odds;
        estimatePlan.profitAmount = res.data.profitAmount;

        isLoading.value = false;
      }
    })
    .catch((err) => {
      console.log(err.message);
    })
    .then(() => {
      isLoading.value = false;
    });
};

const submitDeposit = () => {
  if (!interestProfitField.storageTime || !interestProfitField.deposits || !interestProfitField.odds) {
    showValidationErrors();
    return;
  }

  isLoading.value = true;

  const putData = {
    days: interestProfitField.storageTime.val,
    placeAmount: interestProfitField.deposits,
    selectedOdds: interestProfitField.odds.val
  };

  eventapi
    .put(
      `/interestPlan/submitPlanOrder?days=${putData.days}&placeAmount=${putData.placeAmount}&selectedOdds=${putData.selectedOdds}`
    )
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          type: "positive",
          position: "top",
          message: `${putData.placeAmount} deposited successfully`,
          icon: "check_circle_outline"
        });
        isLoading.value = false;
        searchDepositRecord();
        getDepositOverview();

        interestProfitField.storageTime = "";
        interestProfitField.odds = "";
        interestProfitField.deposits = "";
      } else {
        errorDialog.value = true;
        errorDialogMsg.value = t(`error.${res.code}`);
      }
    })
    .catch((err) => {
      console.log(err.message);
    })
    .then(() => {
      isLoading.value = false;
    });
};

const depositOverview = reactive({
  totalDeposit: 0,
  unexpiredEarning: 0,
  profitAmount: 0
});

const getDepositOverview = () => {
  isLoading.value = true;
  eventapi
    .get(`interestPlan/init`)
    .then((res) => {
      depositOverview.totalDeposit = res.data.totalDeposit;
      depositOverview.unexpiredEarning = res.data.unexpiredEarning;
      depositOverview.profitAmount = res.data.profitAmount;
      isLoading.value = false;
    })
    .catch((err) => {
      console.log(err.message);
    })
    .then(() => {
      isLoading.value = false;
    });
};

const convertToTwoDecimalAmount = (amount) => {
  let formattedAmount = parseFloat(amount).toFixed(2);
  return formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const dayList = ref([]);
const oddList = ref([]);
const allData = ref([]);

const getDayList = async () => {
  try {
    const res = await eventapi.get("interestPlan/form");
    allData.value = res.data;

    dayList.value = allData.value.map((item) => ({ label: `${item.day}`, val: item.day }));

    oddList.value = [];
  } catch (err) {
    console.log(err.message);
  }
};

const onDayChange = (selectedDay) => {
  interestProfitField.odds = "";
  const selectedData = allData.value.find((item) => item.day === selectedDay.val);
  if (selectedData) {
    oddList.value = selectedData.odds.map((odd, index) => ({
      label: `${(odd * 100).toFixed(2)}%`,
      val: odd
    }));
  } else {
    oddList.value = [];
  }
};

const collectDeposit = (planOrderId) => {
  isLoading.value = true;
  eventapi
    .put(`/interestPlan/claimProfit/${planOrderId}`)
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          type: "positive",
          position: "top",
          message: `Collect successfully`,
          icon: "check_circle_outline"
        });
        searchDepositRecord();
        isLoading.value = false;
      }
    })
    .catch((err) => {
      console.log(err.message);
    })
    .then(() => {
      isLoading.value = false;
    });
};

const turnoverAmt = ref(1);
const isRecordDetails = ref(false);
const recordDetails = ref();
const viewDetails = (record) => {
  recordDetails.value = record;
  isRecordDetails.value = true;
  if (recordDetails.value.odds === 0.06) {
    turnoverAmt.value = 3;
  } else if (recordDetails.value.odds === 0.04) {
    turnoverAmt.value = 2;
  } else {
    turnoverAmt.value = 1;
  }
};

const humanDatetime = (ts) => {
  return moment(ts).format("YYYY-MM-DD - HH:mm:ss");
};

const recordTabs = ref("pending");

const onRecordTabChange = () => {
  searchDepositRecord();
};

onMounted(() => {
  setTime();
  searchDepositRecord();
  getDepositOverview();
  getDayList();
});
</script>

<style lang="scss" scoped>
.do-container {
  padding: 16px;
  box-shadow: 0px 0px 10px 4px #7fc34933;
  border-radius: 12px;
  // border: 1px solid #33b085;
  // background-color: #1f1f1f;
  background: url(../assets/images/index/interest-bg.png) no-repeat;
  background-size: cover;
  height: 0;
  padding-bottom: calc(136 / 343 * 100);
  aspect-ratio: 343 / 136;
  color: #fff;
}

.do-header {
  display: flex;
  justify-content: space-between;
  .do-title {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.do-amount {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 16px;
  .amount-txt {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 800;
    background: linear-gradient(270deg, #3080f4 0%, #70b1ff 100%);
    background-size: 100%;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
    font-size: 24px;
    line-height: 1;
  }

  .amount-arrow {
    display: flex;
    align-items: center;
  }
}

.do-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 12px;
  row-gap: 6px;
  margin-top: 16px;

  .content-item {
    width: 100%;

    .item-title {
      margin-bottom: 4px;
    }

    .item-amount {
      font-weight: bold;
    }
  }
}

.do-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.do-btn-green {
  color: #ffffff;
  height: 34px;
  background: linear-gradient(270deg, #3080f4 0%, #70b1ff 100%);
  font-weight: 700;
  border-radius: 6px;
  width: 100%;
  height: 40px;
  font-size: 16px;

  // &:before {
  //   content: "";
  //   position: absolute;
  //   background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
  //   z-index: -1;
  //   top: -1px;
  //   bottom: -1px;
  //   left: -1px;
  //   right: -1px;
  // }

  &.shorter {
    width: auto;
  }
}

.do-btn-grey {
  color: #424f72;
  height: 34px;
  background: linear-gradient(180deg, rgba(115, 178, 255, 0.1) 0%, rgba(57, 129, 255, 0.1) 100%);
  font-weight: 700;
  border-radius: 6px;
  width: 100%;
  height: 40px;
  font-size: 16px;

  &.shorter {
    width: auto;
  }
}

.do-results-container {
  padding: 16px;
  border-radius: 12px;
  margin-top: 16px;
  background: #fcfdfe;
  box-shadow: 0px -2.76px 2.76px 0px #c3d4e6 inset, 0px 1.38px 0px 0px #a7c2dd;
  .do-result-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;

    .item-title {
      font-weight: 600;
      color: #424f72;
    }
    .item-rates {
      font-weight: 600;
      color: #3181f5;
    }
  }
}

.do-input-container {
  padding: 16px;
  border-radius: 12px;
  margin-top: 24px;
  background: #fcfdfe;
  box-shadow: 0px -2.76px 2.76px 0px #c3d4e6 inset, 0px 1.38px 0px 0px #a7c2dd;
}

.do-record-tabs {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  :deep(.q-tab--inactive) {
    color: #9a9a9a;
  }
  :deep(.q-tab--active) {
    color: #5682f9;
  }
}

.do-record-container {
  min-height: 100px;
}

.record-details-card {
  // background: #131313;

  .details-box {
    padding: 12px;
    background: #e9f2ff;
    box-shadow: 0px 0px 8px 0px #a9c9ea inset;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    // border: 1px solid #072a19;
    margin-bottom: 16px;

    .box-title {
      color: #424f72;
    }
    .box-value {
      color: #00b900;
      font-weight: bold;
    }
  }
}

.selection-item {
  display: flex;
  margin-top: 16px;

  .item-title {
    width: 50%;
    text-align: center;
    padding: 12px 16px;
    position: relative;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);

    &.active {
      color: #70bc62;
      &:before {
        content: "";
        background-color: #70bc62;
        position: absolute;
        bottom: -2px;
        width: 40%;
        left: 50%;
        transform: translateX(-50%);
        height: 2px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.order-table {
  // background: #171e2b80;
  // border-radius: 10px;
  border-bottom: 1px solid #ffffff33;
  padding: 6px 0px;
  margin-bottom: 10px;
  .order-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    flex-wrap: wrap;

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
    }

    .order-btns {
      display: flex;
      margin-left: auto;
      margin-top: 12px;
      gap: 12px;
    }
  }

  .copy-btn {
    filter: brightness(0) invert(1);
  }

  .order-col {
    &:nth-child(even) {
      text-align: right;
    }

    span.txt-gray {
      color: #9a9a9a;
      // background: rgba(136, 136, 136, 0.2);
    }

    span.txt-green {
      color: #00b900;
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
.warn-text {
  font-size: 0.825rem;
  padding-left: 8px;
  color: #00b900;
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

.select-label {
  color: #424f72;
}

.do-select {
  :deep(.q-field__control) {
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 10px;
    background-color: #fff;

    &:before {
      border: none;
      border-radius: 10px;
      box-shadow: 0px 0px 8px 0px #a9c9ea inset;
    }
  }
}
</style>
