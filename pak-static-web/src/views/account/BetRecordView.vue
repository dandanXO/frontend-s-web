<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">{{ $t("personalView.record.title") }}</span>
    </div>

    <div class="bet-record-wrapper">
      <div class="bet-record-search-filter">
        <a-date-picker
          v-model:value="form.startDate"
          class="bet-record-search__date-picker"
          value-format="YYYY-MM-DD"
          :allow-clear="false"
          :show-today="false"
          @change="handleSubmit(true)"
        />
        <span>~</span>
        <a-date-picker
          v-model:value="form.endDate"
          class="bet-record-search__date-picker"
          value-format="YYYY-MM-DD"
          :allow-clear="false"
          :show-today="false"
          @change="handleSubmit(true)"
        />
      </div>

      <NoData v-if="isNoInfo" />

      <a-spin v-else-if="isLoading" />

      <template v-else>
        <div class="bet-record-list">
          <div class="bet-record-item" v-for="(record, index) in recordList" :key="record.betId">
            <div class="bet-record-item__content-wrapper">
              <span class="bet-record-item__time">{{ toGMT5(record.betTime) }}</span>
              <span class="bet-record-item__status" :class="record.betStatus">
                {{ getRecordStatus(record.betStatus) }}
              </span>
            </div>
            <div class="bet-record-item__content-wrapper">
              <span class="bet-record-item__payout" :class="record.payout > 0 ? 'win' : 'loss'">
                ₨
                <span class="bet-record-item__payout-amount">{{ addThousandsComma(record.payout, true) }}</span>
              </span>
            </div>
            <div class="bet-record-item__content-wrapper">
              <span class="bet-record-item__content-title">{{ $t("personalView.record.betTitle") }}</span>
              <span class="bet-record-item__content">{{ addThousandsComma(record.bet, true) }}</span>
            </div>
            <div class="bet-record-item__content-wrapper">
              <span class="bet-record-item__content-title">{{ $t("personalView.record.platformTitle") }}</span>
              <span class="bet-record-item__content">{{ record.platform }}</span>
            </div>
          </div>
          <NoData v-if="isNoInfoAtEnd" :title="$t('personalView.record.recordEndTitle')" description="" />
        </div>
        <div class="bet-record-pagination">
          <button
            class="bet-record-pagination__btn"
            :disabled="pagination.current === 1"
            @click="handlePaginationClick('prev')"
          >
            <RiArrowLeftSLine />
          </button>
          <button
            class="bet-record-pagination__btn"
            :disabled="isNextButtonDisable"
            @click="handlePaginationClick('next')"
          >
            <RiArrowRightSLine />
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { userStore } from "@/store";
import { useI18n } from "vue-i18n";
import { getBetRecord } from "@/api/personal/record";
import { BET_STATUS } from "@/constant/status";
import { addThousandsComma, toGMT5, updateDate } from "@/utils/utils";

import NoData from "@/components/common/NoData.vue";
import { RiArrowLeftSLine, RiArrowRightSLine } from "vue-remix-icons";

const store = userStore();
const { id } = storeToRefs(store);
const { t } = useI18n();

const isLoading = ref(false);
const isNoInfo = ref(false);
const isNextButtonDisable = ref(false);
const isNoInfoAtEnd = ref(false);
const recordList = ref([]);
const form = ref({
  startDate: "",
  endDate: ""
});
const pagination = ref({
  pageSize: 20,
  total: 0,
  current: 1
});

const setTime = () => {
  form.value.startDate = updateDate(1);
  form.value.endDate = updateDate(0);
};

const getRecordStatus = (recordStatus) => {
  switch (recordStatus) {
    case BET_STATUS.SETTLE:
      return t("common.status.bet.settle");
    case BET_STATUS.SETTLED:
      return t("common.status.bet.settled");
    case BET_STATUS.BET_N_SETTLE:
      return t("common.status.bet.betAndSettle");
    case BET_STATUS.CANCEL:
      return t("common.status.bet.cancel");
    case BET_STATUS.ROLLBACK:
      return t("common.status.bet.rollback");
    case BET_STATUS.PATCH:
      return t("common.status.bet.patch");
    case BET_STATUS.BET:
      return t("common.status.bet.bet");
    case BET_STATUS.UNSETTLED:
      return t("common.status.bet.unsettled");
    case BET_STATUS.JACKPOT:
      return t("common.status.bet.jackpot");
    case BET_STATUS.BONUS:
      return t("common.status.bet.bonus");
    default:
      return recordStatus;
  }
};

const handlePaginationClick = (mode) => {
  pagination.value.current += mode === "next" ? 1 : -1;
  handleSubmit();
};

const handleSubmit = (isNewSearch) => {
  const { startDate, endDate } = form.value;
  if (!startDate || !endDate) return;

  if (isNewSearch) pagination.value.current = 1;

  isLoading.value = true;
  recordList.value = [];

  const params = {
    startDate,
    endDate,
    memberId: id.value,
    current: pagination.value.current,
    size: pagination.value.pageSize
  };

  getBetRecord(params)
    .then(({ code, data }) => {
      if (code !== 0) return;
      const records = data.records;
      pagination.total = records.length;
      recordList.value = records;
      isNextButtonDisable.value = false;
      isNoInfoAtEnd.value = false;

      if (records.length === 0 && pagination.value.current === 1) {
        isNoInfo.value = true;
      } else if (records.length < pagination.value.pageSize) {
        isNoInfo.value = false;
        isNextButtonDisable.value = true;
        isNoInfoAtEnd.value = true;
      } else {
        isNoInfo.value = false;
      }
    })
    .catch(() => {})
    .finally(() => (isLoading.value = false));
};

onMounted(() => {
  setTime();
  handleSubmit(true);
});
</script>
<style scoped lang="scss">
.bet-record-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .bet-record-search-filter {
    display: flex;
    align-items: center;
    gap: 16px;

    .bet-record-search__date-picker {
      max-width: 150px;
    }
  }

  .bet-record-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 500px;
    overflow: auto;
    margin: 12px;

    .bet-record-item {
      border-bottom: 1px solid #ffffff0d;
      padding-bottom: 16px;
      font-size: 16px;
      line-height: 20px;
      color: #8c968f;

      .bet-record-item__content-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .bet-record-item__status {
          padding: 7px 17px;

          &.SETTLE,
          &.SETTLED,
          &.BET_N_SETTLE {
            color: #00b900;
            background: rgba(0, 185, 0, 0.2);
          }

          &.CANCEL,
          &.ROLLBACK,
          &.PATCH {
            color: #b81212;
            background: rgba(184, 18, 18, 0.2);
          }

          &.BET {
            color: #ff7a00;
            background: rgba(255, 122, 0, 0.2);
          }

          &.UNSETTLED {
            color: #ffe500;
            background: rgba(255, 229, 0, 0.2);
          }

          &.JACKPOT,
          &.BONUS {
            color: #00f0ff;
            background: rgba(0, 240, 255, 0.2);
          }
        }

        .bet-record-item__payout {
          font-size: 20px;
          line-height: 36px;
          color: #fff;

          .bet-record-item__payout-amount {
            background: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }

        .bet-record-item__content {
          color: #fff;
        }
      }
    }
  }

  .bet-record-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .bet-record-pagination__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px 8px;
      background-color: #58b475;
      border: none;
      border-radius: 8px;
      transition: all 0.3s;

      &:not([disabled]) {
        &:hover {
          filter: brightness(1.3);
        }
      }

      &:disabled {
        filter: grayscale(1);
        cursor: not-allowed;
      }

      svg {
        width: 30px;
        fill: currentColor;
      }
    }
  }
}
</style>
