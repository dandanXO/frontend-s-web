<template>
  <div class="q-pa-md">
    <div class="deposit-overview-wrapper">
      <div class="do-container">
        <div class="do-header">
          <div class="do-title">
            Deposit overview
            <div @click="toggleAmountVisibility">
              <q-icon :name="isAmountVisible ? 'visibility' : 'visibility_off'" size="20px" />
            </div>
          </div>
          <div class="do-side-title">More activities</div>
        </div>

        <div class="do-amount">
          <div class="amount-txt">₹{{ isAmountVisible ? "2041.86" : "*****" }}</div>
          <img src="../assets/images/interest-profit/chevron-right.png" />
        </div>

        <div class="do-content">
          <div class="content-item">
            <div class="item-title">Unexpired earnings</div>
            <div class="item-amount">₹{{ isAmountVisible ? "0.00" : "*****" }}</div>
          </div>
          <div class="content-item">
            <div class="item-title">Cumulative income</div>
            <div class="item-amount">₹{{ isAmountVisible ? "0.00" : "*****" }}</div>
          </div>
        </div>

        <div class="do-actions">
          <div class="">
            <q-btn no-caps unelevated class="do-btn-grey">Trial calculation</q-btn>
          </div>

          <div class="">
            <q-btn no-caps unelevated class="do-btn-green">Deposit</q-btn>
          </div>
        </div>
      </div>

      <div class="do-input-container">
        <InputRowGrid>
          <template #fields>
            <InputField :label="'Storage time'">
              <template #input>
                <q-input
                  type="number"
                  class="q-pb-xs dialog-input"
                  hide-bottom-space
                  outlined
                  v-model="interestProfitField.storageTime"
                  lazy-rules
                  label-color="secondary"
                >
                  <template v-slot:prepend>
                    <div>₹</div>
                  </template>
                </q-input>
              </template>
            </InputField>

            <InputField :label="'Deposits'">
              <template #input>
                <q-input
                  type="number"
                  class="q-pb-xs dialog-input"
                  hide-bottom-space
                  outlined
                  v-model="interestProfitField.deposits"
                  lazy-rules
                  label-color="secondary"
                >
                  <template v-slot:prepend>
                    <div>₹</div>
                  </template>
                </q-input>
              </template>
            </InputField>
          </template>
        </InputRowGrid>
      </div>

      <div class="do-record-container q-mt-md">
        <div v-for="(e, i) in depositData" :key="`${e}-${i}`" class="order-table">
          <div class="order-row order-row--title">
            <div class="order-col">No. {{ e.serialNumber }}</div>
            <!-- <div class="order-col flex-c-end gap-8"> -->
            <!-- <div @click="copyText(e.serialNumber)">
                <img
                  class="copy-btn btn-pointer"
                  src="../../assets/images/account/content-copy.svg"
                  size="24px"
                  fill="#fff"
                />
              </div> -->
            <!-- </div> -->
          </div>
          <div class="order-row order-row--content">
            <div class="order-subrow">
              <div class="order-col">{{ e.paymentType }}</div>
              <div class="order-col">
                <!-- <span :class="`${['SUCCESS', 'SUPPLEMENT_SUCCESS'].includes(e.status) ? 'txt-green' : 'txt-red'}`">
                  {{ getDepositStatus(e.status) }}
                </span> -->

                <q-btn
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
              <div class="order-col">{{ convertToCommaAmount(e.depositAmount, true) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
// import RecordComponent from "../../components/RecordComponent.vue";
// import RecordComponent from "../components/RecordComponent.vue";
import { updateDate, convertToGMT8, convertToGMT55, convertToCommaAmount } from "src/boot/utils";
import { api } from "boot/axios";
import moment from "moment/moment";
import { cached, TIME_EXPIRED } from "boot/cache";
import { t } from "src/boot/lang";
import InputField from "../components/auth/InputField.vue";
import InputRowGrid from "../components/auth/InputRowGrid.vue";

const interestProfitField = reactive({ storageTime: "", deposits: "" });

const isLoading = ref(false);
const depositData = ref([]);
const isAmountVisible = ref(true);

const toggleAmountVisibility = () => {
  isAmountVisible.value = !isAmountVisible.value;
};

const searchForm = reactive({ startDate: "", endDate: "" });
const setTime = () => {
  searchForm.startDate = updateDate(6);
  searchForm.endDate = updateDate(-1);
};

const searchDepositRecord = () => {
  isLoading.value = true;
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
      isLoading.value = false;
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

onMounted(() => {
  setTime();
  searchDepositRecord();
});
</script>

<style lang="scss" scoped>
.do-container {
  padding: 16px;
  box-shadow: 0px 0px 10px 4px #7fc34933;
  border-radius: 12px;
  border: 1px solid #33b085;
  background-color: #1f1f1f;
}

.do-header {
  display: flex;
  justify-content: space-between;
  .do-title {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .do-side-title {
    color: #13a89e;
    font-weight: bold;
    background-image: linear-gradient(180deg, #13a89e 0%, #8cc63f 100%);
    background-size: 100%;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
  }
}

.do-amount {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 16px;
  .amount-txt {
    color: #13a89e;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 800;
    background-image: linear-gradient(180deg, #13a89e 0%, #8cc63f 100%);
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
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  .do-btn-green {
    color: #ffffff;
    height: 34px;
    background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
    font-weight: 700;
    border-radius: 6px;
    width: 100%;
    height: 40px;
    font-size: 16px;

    &:before {
      content: "";
      position: absolute;
      background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
      z-index: -1;
      top: -1px;
      bottom: -1px;
      left: -1px;
      right: -1px;
    }
  }

  .do-btn-grey {
    color: #ffffff;
    height: 34px;
    background: #353535;
    font-weight: 700;
    border-radius: 6px;
    width: 100%;
    height: 40px;
    font-size: 16px;
  }
}

.do-input-container {
  padding: 16px;
  border-radius: 12px;
  background-color: #1f1f1f;
  margin-top: 24px;
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
  }

  .copy-btn {
    filter: brightness(0) invert(1);
  }

  .order-col {
    &:nth-child(even) {
      text-align: right;
    }

    span.txt-gray {
      color: #888888;
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
