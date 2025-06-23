<template>
  <q-page class="account-table-page">
    <q-card flat class="search-container">
      <q-form layout="inline" :model="searchForm">
        <div class="date-field">
          <q-input filled v-model="searchForm.startDate" readonly>
            <template v-slot:append>
              <img src="../../assets/images/index/icon-calendar.svg" />
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
              <img src="../../assets/images/index/icon-calendar.svg" />
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

    <LoadingComponent v-if="isLoading"></LoadingComponent>
    <NoInfoComponent v-else-if="isNoInfo" :noInfoTitle="$t('records.noRecord')"></NoInfoComponent>

    <template v-else>
      <NoInfoComponent
        v-if="isNoInfoAtEnd"
        shortenContainer="true"
        :noInfoTitle="$t('records.reachTheEnd')"
      ></NoInfoComponent>
      <q-card v-for="(e, i) in gameBetRecordData" :key="`${e}-${i}`" class="record-container">
        <q-card-section class="top-wrapper">
          <div class="date">{{ convertToGMTMinus5(e.betTime) }}</div>
          <q-btn
            class="bet-btn"
            :class="`${e.payout > 0 ? 'bet-btn' : 'loss-btn'}`"
            :label="`${e.payout > 0 ? $t('btn.profit') : $t('btn.loss')}`"
          ></q-btn>
        </q-card-section>

        <q-card-section class="mid-wrapper">
          {{ store.currency.label }}
          <span :class="`${e.payout > 0 ? 'win-amt' : 'loss-amt'}`">{{ convertToCommaAmount(e.payout, true) }}</span>
        </q-card-section>

        <q-card-section class="mid-wrapper-2">
          <div class="bet">Bet</div>
          <div class="bet-val">{{ convertToCommaAmount(e.bet, true) }}</div>
        </q-card-section>

        <q-card-section class="bot-wrapper">
          <div class="origin">
            <div class="game-platform">{{ $t("records.gamePlatform") }}</div>
          </div>
          <div class="origin-val">
            <div class="game-platform-val">{{ displayPlatform(e.platform) }}</div>
          </div>
        </q-card-section>
      </q-card>

      <div class="pagination-container-wrapper">
        <q-btn-group class="pagination-container">
          <q-btn class="pagination-btn" :disable="pagination.current === 1" @click="onPrevPageClick()">&lt;</q-btn>
          <q-btn
            v-for="(page, index) in displayPaginationButtons"
            :key="index"
            class="pagination-btn"
            :class="{ active: pagination.current === page }"
            @click="onPageClick(page)"
          >
            {{ page }}
          </q-btn>

          <q-btn class="pagination-btn" :disable="isNextBtnDisable" @click="onNextPageClick()">></q-btn>
        </q-btn-group>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { computed, onActivated, onMounted, reactive, ref } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { updateDate, convertToGMT8, convertToGMTMinus3, convertToGMTMinus5 } from "src/boot/utils";
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

const MAX_PAGINATION_BUTTONS = 5;

const displayPaginationButtons = computed(() => {
  const delta = Math.floor(MAX_PAGINATION_BUTTONS / 2);
  const start = Math.max(1, pagination.current - delta);
  const end = Math.min(pagination.pages, pagination.current + delta);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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

const onPageClick = (index) => {
  if (index < pagination.total && index > 0) {
    pagination.current = index;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.5rem;
  background: rgba(21, 0, 37, 0.2);
  padding: 30px 0 0;
  margin-top: 0;

  .date-field {
    display: flex;
    align-items: center;

    span {
      color: #4b4943;
      padding: 0px 12px;
    }

    .q-field__control,
    .q-field__marginal {
      //border: 1px solid #b478ff4d;
      height: unset;
    }

    .q-field {
      border: 1px solid #4b4943;
      background: transparent;
      padding: 4px 3px;
      border-radius: 8px;
    }

    .q-field__native {
      padding: 0;
      color: #4b4943;
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
  // background: rgba(21, 0, 37, 0.2);
  background: #1f241f;
  box-shadow: none;
  padding: 1rem;
  margin-top: 0;
  margin-bottom: 1rem;
  .top-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 14px 0;
    .date {
      color: #ffffff4d;
      font-size: 12px;
    }

    .q-btn {
      border: 1px solid transparent;
      border-radius: 4px;
      padding: 6px 8px;
      background: url("../../assets/images/index/btn-bg.png") no-repeat center;
      background-size: 100% 100%;
      color: #fff;
      font-size: 12px;
      font-weight: 500;
    }

    // .bet-btn {
    //   color: #ffffff;
    //   font-size: 0.825rem;
    //   font-weight: 700;
    //   text-transform: capitalize;
    //   border-radius: 4px;
    //   background: rgba(250, 229, 118, 0.2);
    //   padding: 0 1rem;
    //   min-height: unset;
    // }

    // .loss-btn {
    //   color: #ffffff;
    //   font-size: 0.825rem;
    //   font-weight: 700;
    //   text-transform: capitalize;
    //   border-radius: 4px;
    //   background: rgba(0, 177, 167, 0.2);
    //   padding: 0 1rem;
    //   min-height: unset;
    // }
  }

  .win-amt {
    color: $positive;
  }

  .loss-amt {
    color: $negative;
  }

  .mid-wrapper {
    font-weight: 700;
    margin-bottom: 14px;

    span {
      color: #ffc107;
    }
  }

  .mid-wrapper-2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;

    .bet {
      color: #ffffffb2;
    }

    .bet-val {
      font-weight: 700;
    }
  }

  .bot-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.5rem -1rem -1rem -1rem;
    background: #ffffff1a;
    padding: 0.5rem 1rem;
    width: calc(100% + 2rem);
    border-left: 0;
    border-right: 0;

    .origin {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #ffffffb2;

      .bet {
        font-size: 0.825rem;
        font-weight: 700;
      }

      .game-platform {
        font-size: 0.825rem;
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

.pagination-container-wrapper {
  display: flex;
  justify-content: center;
  margin: 24px 0;

  .pagination-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1f241f;
    border: 1px solid #35383f;

    .pagination-btn {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;

      &.active {
        background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
        color: #2d2d2d;
      }

      &:not(:last-child) {
        border-right: 1px solid #35383f;
      }

      &:disabled {
        color: #ffffff6b;
      }
    }
  }
}
</style>
