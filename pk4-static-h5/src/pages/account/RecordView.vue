<template>
  <q-page class="account-table-page">
    <q-card flat class="search-container">
      <q-form layout="inline" :model="searchForm">
        <div class="date-field">
          <q-input filled v-model="searchForm.startDate" readonly>
            <template v-slot:append>
              <img src="../../assets/images/earn-money/calendar-icon.svg" />
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="searchForm.startDate" @update:model-value="searchRecord(true)" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="white" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </template>
          </q-input>
          <span>to</span>
          <q-input filled v-model="searchForm.endDate" readonly>
            <template v-slot:append>
              <img src="../../assets/images/earn-money/calendar-icon.svg" />
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="searchForm.endDate" @update:model-value="searchRecord(true)" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="white" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </template>
          </q-input>
        </div>
        <!--        <div class="platform-field">-->
        <!--          <q-btn class="search-btn" label="Search" @click="searchRecord(true)" />-->
        <!--        </div>-->
      </q-form>
    </q-card>

    <!-- <q-tabs v-model="selectedRange" @update:model-value="updateDateRange" active-color="green" indicator-color="green">
      <q-tab name="1" label="1 Day" />
      <q-tab name="7" label="7 Days" />
      <q-tab name="30" label="30 Days" />
    </q-tabs> -->

    <LoadingComponent v-if="isLoading"></LoadingComponent>
    <NoInfoComponent v-else-if="isNoInfo" :noInfoTitle="$t('notify.noRecord')"></NoInfoComponent>

    <template v-else>
      <NoInfoComponent
        v-if="isNoInfoAtEnd"
        shortenContainer="true"
        noInfoTitle="You have reached the end of the page."
      ></NoInfoComponent>
      <q-card v-for="(e, i) in gameBetRecordData" :key="`${e}-${i}`" class="record-container">
        <!-- <q-card-section class="top-wrapper">


        </q-card-section> -->

        <q-card-section class="mid-wrapper">
          <div class="game-platform-val">
            <img :src="require(`../../assets/images/index/logo/logo-${e.platform.toLowerCase()}.png`)" />
            / {{ e.platform }}
          </div>
          <q-btn
            flat
            :class="{
              'btn--green': ['SETTLE', 'SETTLED', 'BET_N_SETTLE'].includes(e.betStatus),
              'btn--red': ['CANCEL', 'ROLLBACK', 'PATCH'].includes(e.betStatus),
              'btn--orange': e.betStatus === 'BET',
              'btn--yellow': e.betStatus === 'UNSETTLED',
              'btn--blue': ['JACKPOT', 'BONUS'].includes(e.betStatus)
            }"
            :label="getRecordStatus(e.betStatus)"
          ></q-btn>
        </q-card-section>

        <q-card-section class="bot-wrapper">
          <div class="origin">
            <div class="bet">{{ $t("records.date") }}</div>
            <div class="bet">{{ $t("records.bet") }}</div>
            <!-- <div class="game-platform">{{ $t("records.gamePlatform") }}</div> -->
          </div>
          <div class="origin-val">
            <div class="bet-val">{{ normalDateTime(e.betTime) }}</div>
            <div class="bet-val">{{ convertToCommaAmount(e.bet, true) }}</div>
          </div>
        </q-card-section>

        <q-card-section class="bot-wrapper last">
          <div class="origin">
            <div class="bet">{{ $t("records.beforeBalance") }}</div>
            <div class="game-platform">{{ $t("records.afterBalance") }}</div>
          </div>
          <div class="origin-val">
            <div class="bet-val win-amt">{{ convertToCommaAmount(e.beforeBalance, true) }}</div>
            <div class="game-platform-val win-amt">{{ convertToCommaAmount(e.afterBalance, true) }}</div>
          </div>
        </q-card-section>
        <BetRefereceWithCopy :betId="e.betId" />
      </q-card>

      <q-card class="pagination-container">
        <q-btn class="pagination-btn" @click="onPrevPageClick()">&lt;</q-btn>
        <!-- <div>{{ pagination.current }} / {{ pagination.pages }}</div> -->
        <q-btn class="pagination-btn" :disable="isNextBtnDisable" @click="onNextPageClick()">></q-btn>
      </q-card>
    </template>
  </q-page>
</template>

<script setup>
import { onActivated, onMounted, reactive, ref, computed } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { updateDate, normalDateTime, convertToGMT55 } from "src/boot/utils";
import LoadingComponent from "../../components/LoadingComponent.vue";
import NoInfoComponent from "../../components/NoInfoComponent.vue";
import { convertToCommaAmount } from "src/boot/utils";
import { useQuasar } from "quasar";
import { t } from "src/boot/lang";
import BetRefereceWithCopy from "../../components/account/BetReferenceWithCopy.vue";

const router = useRouter();
const store = userStore();

const qs = require("qs");
const $q = useQuasar();

let slideList = ref(["Record", "Order", "Bank", "Message", "Personal Center", "Discount"]);
let slideListPath = ref([
  "/account/record",
  "/account/order",
  "/account/bank",
  "/account/message",
  "/account",
  "/account/discount"
]);
let currentSlide = ref(slideList.value[0]);

const isActiveSlide = (e) => {
  if (e === currentSlide.value) return true;
  return false;
};

const selectedRange = ref("1");

const updateDateRange = (range) => {
  searchRecord();
  const days = parseInt(range);
  searchForm.startDate = updateDate(days);
  searchForm.endDate = updateDate(0);
};

const isLoading = ref(true);
const isNoInfo = ref(true);
const isNoInfoAtEnd = ref(false);

const searchForm = reactive({ startDate: "", endDate: "", platform: "", memberId: store.id });
const setTime = () => {
  searchForm.startDate = updateDate(1);
  searchForm.endDate = updateDate(0);
};

const isNextBtnDisable = ref(false);

const gameBetRecordData = ref([]);
const pagination = reactive({
  pageSize: 20,
  total: 0,
  pages: 1,
  current: 1,
  pagingState: null
});

const onPrevPageClick = () => {
  if (pagination.current === 1) return;
  pagination.current--;
  searchRecord();
};

const onNextPageClick = () => {
  if (!isNextBtnDisable.value) {
    if (pagination.current === pagination.pages) return;
    pagination.current++;
    searchRecord();
  } else {
    $q.notify({
      color: "negative",
      position: "top",
      message: "You have reached end of the page",
      icon: "report_problem"
    });
  }
};

// api.post("/memberAccessLog", qs.stringify(obj))

const searchRecord = (isNewSearch) => {
  if (!searchForm.startDate || !searchForm.endDate) {
    return;
  }
  if (isNewSearch) {
    pagination.current = 1;
    pagination.pagingState = null;
  }

  isLoading.value = true;
  gameBetRecordData.value = [];

  const { startDate, endDate, platform } = searchForm;

  api
    .get("/session/member/cassandraBetRecord", {
      params: {
        startDate,
        endDate,
        platform,
        memberId: store.id,
        current: pagination.current,
        size: pagination.pageSize,
        pagingState: pagination.pagingState
      }
    })
    .then((response) => {
      const { code, data } = response;
      if (code === 0) {
        const records = data.records;
        // const records =
        //  [
        //     {
        //         "memberId": "1892775770378010626",
        //         "betId": "CFQBE65150406J4304200MGJXEISC6DEA",
        //         "transactionId": "CFQBE65150406J4304200MGJXEISC6DEA_20250414094313",
        //         "loginName": "03987654444",
        //         "vipName": null,
        //         "gameAccountName": null,
        //         "platform": "TFGaming",
        //         "bet": 16.000000,
        //         "validBet": 16.000000,
        //         "payout": 0.000000,
        //         "companyProfit": null,
        //         "beforeBalance": 1884.000000,
        //         "afterBalance": 1884.000000,
        //         "betStatus": "SETTLE",
        //         "gameType": "CASUAL",
        //         "gameName": "Aviator",
        //         "affiliateName": null,
        //         "betTime": "2025-04-14 14:43:12",
        //         "settleTime": "2025-04-14 14:43:12",
        //         "result": "LOSS",
        //         "sportBetResult": null,
        //         "currency": "PKR",
        //         "content": null,
        //         "competitionName": null,
        //         "fetchTime": null,
        //         "remark": null
        //     },
        //     {
        //         "memberId": "1892775770378010626",
        //         "betId": "CFQBE65150406J4304200MGJXEISC6DEA",
        //         "transactionId": "CFQBE65150406J4304200MGJXEISC6DEA",
        //         "loginName": "03987654444",
        //         "vipName": null,
        //         "gameAccountName": null,
        //         "platform": "TFGaming",
        //         "bet": 16.000000,
        //         "validBet": 0.000000,
        //         "payout": null,
        //         "companyProfit": null,
        //         "beforeBalance": 1900.000000,
        //         "afterBalance": 1884.000000,
        //         "betStatus": "BET",
        //         "gameType": "CASUAL",
        //         "gameName": "Aviator",
        //         "affiliateName": null,
        //         "betTime": "2025-04-14 14:43:04",
        //         "settleTime": null,
        //         "result": "LOSS",
        //         "sportBetResult": null,
        //         "currency": "PKR",
        //         "content": null,
        //         "competitionName": null,
        //         "fetchTime": null,
        //         "remark": null
        //     }
        // ];
        pagination.total = data.length;
        pagination.pages = data.pages;
        pagination.pagingState = data.pagingState;

        gameBetRecordData.value.push(...records);
        isNextBtnDisable.value = false;
        isNoInfoAtEnd.value = false;

        if (records.length === 0 && pagination.current === 1) {
          isNoInfo.value = true;
        } else if (records.length === 0 && pagination.current > 1) {
          isNoInfo.value = false;
          isNextBtnDisable.value = true;
          isNoInfoAtEnd.value = true;
        } else if (records.length < 20) {
          isNoInfo.value = false;
          isNextBtnDisable.value = true;
        } else {
          isNoInfo.value = false;
        }
      }
    })
    .catch((error) => {})
    .then(() => {
      isLoading.value = false;
    });
};

const platformList = ref([]);
const getPlatformList = () => {
  api.get("/platform").then((res) => {
    if (res.code === 0) platformList.value = res.data;
  });
};

const totalBetRecord = reactive({
  totalBet: 0,
  totalPayout: 0
});

const getRecordStatus = (recordStatus) => {
  if (recordStatus === "SETTLE") {
    return t("records.settle"); // Settle
  } else if (recordStatus === "SETTLED") {
    return t("records.settled"); // Settled
  } else if (recordStatus === "BET_N_SETTLE") {
    return t("records.betAndSettle"); // Bet and Settle
  } else if (recordStatus === "CANCEL") {
    return t("records.cancel"); // Cancel
  } else if (recordStatus === "ROLLBACK") {
    return t("records.rollback"); // Rollback
  } else if (recordStatus === "PATCH") {
    return t("records.patch"); // Patch
  } else if (recordStatus === "BET") {
    return t("records.bet"); // Bet
  } else if (recordStatus === "UNSETTLED") {
    return t("records.unsettled"); // Unsettled
  } else if (recordStatus === "JACKPOT") {
    return t("records.jackpot"); // Jackpot
  } else if (recordStatus === "BONUS") {
    return t("records.bonus"); // Bonus
  } else {
    return recordStatus;
  }
};

onActivated(() => {
  setTime();
  getPlatformList();

  searchRecord(true);
});
</script>

<style lang="scss">
.search-container {
  border-radius: 0.5rem;
  background: transparent;
  padding: 1rem 0;
  // margin-top: 0;

  .date-field {
    display: flex;
    align-items: center;

    span {
      color: #ffffff99;
      padding: 0px 12px;
    }

    .q-field {
      padding: 8px 0px;
      background: linear-gradient(90deg, #1c273d 0%, #12192b 100%);
      border-radius: 12px;
    }

    .q-field__native {
      padding: 0;
      color: #b0b0b0;
    }
  }

  .platform-field {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;

    .platform {
      width: 50%;
    }

    .search-btn {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.825rem;
      font-weight: 700;
      text-transform: capitalize;
      border-radius: 12.5rem;
      background: rgba(21, 0, 37, 0.5);
      padding: 0 1rem;
      min-height: unset;
      width: 50%;
      height: 2rem;
    }
  }
}
.record-container {
  // border-radius: 0;
  // // background: rgba(21, 0, 37, 0.2);
  // box-shadow: none;
  // border-bottom: 1px solid #ffffff33;
  // background: transparent;
  // padding: 1rem;
  // margin-top: 0;

  // background: #292D2E;
  background: linear-gradient(90deg, #1c273d 0%, #12192b 100%);

  border-radius: 6px;
  box-shadow: none;
  .top-wrapper {
    display: grid;
    padding: 1rem;
    // grid-template-columns: 50% 50%;
    align-items: center;

    .date-status-wrapper {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }

    .date {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.825rem;
      font-weight: 700;
    }
    .amt {
      span {
        color: #fff;
      }

      .win-amt {
        color: $positive;
      }

      .loss-amt {
        color: $negative;
      }
    }
  }

  .mid-wrapper {
    font-size: 1rem;
    font-weight: 700;
    line-height: 2.25rem;
    // background: rgba(21, 0, 37, 0.5);
    margin: 0 -1rem;

    padding: 1rem 1rem 0.5rem;
    display: flex;
    margin: 0px;
    width: 100%;
    justify-content: space-between;

    .bet-btn {
      color: #5bf25c;
      font-size: 0.825rem;
      font-weight: 700;
      text-transform: capitalize;
      padding: 4px 10px;
      border-radius: 4px;
      background: rgba(250, 229, 118, 0.2);
      min-height: unset;
    }

    .loss-btn {
      color: #b81212;
      font-size: 0.825rem;
      font-weight: 700;
      text-transform: capitalize;
      padding: 4px 10px;
      border-radius: 4px;
      background: rgba(184, 18, 18, 0.2);
      min-height: unset;
    }

    .btn--yellow {
      color: #ffe500;
      font-size: 0.825rem;
      font-weight: 700;
      text-transform: capitalize;
      padding: 4px 10px;
      border-radius: 4px;
      background: rgba(255, 229, 0, 0.2);
      min-height: unset;
    }

    .btn--blue {
      color: #00f0ff;
      font-size: 0.825rem;
      font-weight: 700;
      text-transform: capitalize;
      padding: 4px 10px;
      border-radius: 4px;
      background: rgba(0, 240, 255, 0.2);
      min-height: unset;
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
    }

    .game-platform-val {
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 700;
      font-size: 16px;
      img {
        height: 20px;
      }
    }
  }

  .bot-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 10px;
    &.last {
      margin-bottom: 10px;
    }

    .win-amt {
      color: $positive;
    }

    .origin {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: rgba(255, 255, 255, 0.5);
      gap: 6px;

      .bet {
        font-size: 0.825rem;
        font-weight: 700;
      }

      .game-platform {
        font-size: 0.825rem;
        font-weight: 700;
      }
    }

    .origin-val {
      gap: 6px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
      .bet-val {
        font-size: 0.825rem;
        color: #b2bdbf;
      }

      .game-platform-val {
        font-size: 0.825rem;
        font-weight: 700;
      }
    }
  }
  .order {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-size: 12px;
    gap: 10px;
    .bet-id {
      font-size: smaller;
      word-wrap: break-word;
      color: #ffffff;
      font-size: 13px;
    }
  }
  .bet-id-wrapper {
    display: flex;
    background: #ffffff0f;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border-bottom: 0;

  .pagination-btn {
    // background: #58b475;
    background: linear-gradient(90deg, #1c273d 0%, #12192b 100%);
    font-size: 20px;
    width: 40px;
    height: 40px;
  }
}
</style>
