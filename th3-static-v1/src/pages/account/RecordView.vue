<template>
  <q-page class="account-table-page">
    <q-card flat class="search-container">
      <q-form layout="inline" :model="searchForm">
        <div class="date-field">
          <q-input filled v-model="searchForm.startDate" readonly>
            <template v-slot:prepend>
              <q-icon name="calendar_today" class="cursor-pointer text-purple-7">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="searchForm.startDate" @update:model-value="searchRecord(true)" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="white" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <span>{{ $t("records.to") }}</span>
          <q-input filled v-model="searchForm.endDate" readonly>
            <template v-slot:prepend>
              <q-icon name="calendar_today" class="cursor-pointer text-purple-7">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="searchForm.endDate" @update:model-value="searchRecord(true)" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="white" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <!--        <div class="platform-field">-->
        <!--          <q-btn class="search-btn" label="Search" @click="searchRecord(true)" />-->
        <!--        </div>-->
      </q-form>
    </q-card>

    <LoadingComponent v-if="isLoading"></LoadingComponent>
    <NoInfoComponent v-else-if="isNoInfo" :noInfoTitle="$t('records.noRecord')"></NoInfoComponent>

    <template v-else>
      <NoInfoComponent
        v-if="isNoInfoAtEnd"
        shortenContainer="true"
        noInfoTitle="You have reached the end of the page."
      ></NoInfoComponent>
      <q-card v-for="(e, i) in gameBetRecordData" :key="`${e}-${i}`" class="record-container">
        <q-card-section class="top-wrapper">
          <div class="date">{{ e.betTime }}</div>
          <div :class="`${e.payout > 0 ? 'bet-btn' : 'loss-btn'}`">
            {{ `${e.payout > 0 ? $t("records.profit") : $t("records.loss")}` }}
          </div>
        </q-card-section>

        <q-card-section class="mid-wrapper">
          {{ store.currency.label }}
          <span :class="`${e.payout > 0 ? 'win-amt' : 'loss-amt'}`">{{ convertToCommaAmount(e.payout, false) }}</span>
        </q-card-section>

        <q-card-section class="bot-wrapper">
          <div class="origin">
            <div class="bet">{{ $t("records.bet") }}</div>
            <div class="game-platform">{{ $t("records.gamePlatform") }}</div>
          </div>
          <div class="origin-val">
            <div class="bet-val">{{ convertToCommaAmount(e.bet, false) }}</div>
            <div class="game-platform-val">{{ displayPlatform(e.platform) }}</div>
          </div>
        </q-card-section>
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
import { onActivated, onMounted, reactive, ref } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { updateDate, convertToGMT8 } from "src/boot/utils";
import LoadingComponent from "../../components/LoadingComponent.vue";
import NoInfoComponent from "../../components/NoInfoComponent.vue";
import { convertToCommaAmount, displayPlatform } from "src/boot/utils";
import { useQuasar } from "quasar";

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

const isLoading = ref(true);
const isNoInfo = ref(true);
const isNoInfoAtEnd = ref(false);

const searchForm = reactive({ startDate: "", endDate: "", platform: "", memberId: store.id });
const setTime = () => {
  searchForm.startDate = updateDate(7);
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
const getGameBetRecordTotal = () => {
  const obj = {
    memberId: store.id,
    platform: searchForm.platform,
    startDate: convertToGMT8(searchForm.startDate),
    endDate: convertToGMT8(searchForm.endDate)
  };
  api.get("/session/member/gameBetRecordTotal", { params: obj }).then((res) => {
    if (res.code === 0) {
      const { totalBet, totalPayout } = res.data;
      totalBetRecord.totalBet = totalBet;
      totalBetRecord.totalPayout = totalPayout;
    }
  });
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
  background: rgba(21, 0, 37, 0.2);
  padding: 1rem;
  margin-top: 0;

  .date-field {
    display: flex;
    align-items: center;

    span {
      color: #ffffff99;
      padding: 0px 12px;
    }

    .q-field__control,
    .q-field__marginal {
      //border: 1px solid #b478ff4d;
      height: unset;
    }

    .q-field {
      border: 1px solid #b478ff4d;
      background: #28292b;
      padding: 4px 3px;
      border-radius: 8px;
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
  border-radius: 0.5rem;
  background: rgba(21, 0, 37, 0.2);
  padding: 1rem;
  margin-top: 0;

  .top-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 0.5rem 0;
    .date {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.825rem;
      font-weight: 700;
    }

    .bet-btn {
      color: #fae576;
      font-size: 0.825rem;
      font-weight: 700;
      text-transform: capitalize;
      border-radius: 12.5rem;
      background: rgba(250, 229, 118, 0.2);
      padding: 0.25rem 1rem;
      min-height: unset;
    }

    .loss-btn {
      color: #bc66ff;
      font-size: 0.825rem;
      font-weight: 700;
      text-transform: capitalize;
      border-radius: 12.5rem;
      background: rgba(188, 102, 255, 0.2);
      padding: 0.25rem 1rem;
      min-height: unset;
    }
  }

  .win-amt {
    color: $positive;
  }

  .loss-amt {
    color: $negative;
  }

  .mid-wrapper {
    font-size: 1rem;
    font-weight: 700;
    line-height: 2.25rem;
    background: rgba(21, 0, 37, 0.5);
    margin: 0 -1rem;
    padding: 0 1rem;

    span {
      background: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .bot-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.5rem 0 0 0;

    .origin {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: rgba(255, 255, 255, 0.5);

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
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
      .bet-val {
        font-size: 0.825rem;
        font-weight: 700;
      }

      .game-platform-val {
        font-size: 0.825rem;
        font-weight: 700;
      }
    }
  }
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border-bottom: 0;

  .pagination-btn {
    background: #7c28bd;
    font-size: 20px;
    width: 40px;
    height: 40px;
  }
}
</style>
