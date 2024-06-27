<template>
  <div class="team-management-wrapper">
    <div class="search-field">
      <div class="search-field__date-range">
        <a-date-picker
          v-model:value="form.startDate"
          value-format="YYYY-MM-DD"
          format="MM/DD"
          :allow-clear="false"
          :show-today="false"
          #suffixIcon
        >
          <img src="@/assets/images/reward/calendar-icon.svg" />
        </a-date-picker>
        <span>-</span>
        <a-date-picker
          v-model:value="form.endDate"
          value-format="YYYY-MM-DD"
          format="MM/DD"
          :allow-clear="false"
          :show-today="false"
          #suffixIcon
        >
          <img src="@/assets/images/reward/calendar-icon.svg" />
        </a-date-picker>
      </div>

      <a-checkbox-group v-model:value="selectedValue" name="downLine" @change="handleCheckedChange">
        <a-checkbox v-for="(option, index) in dateOptions" :key="index" :value="option.value">
          {{ option.label }}
        </a-checkbox>
      </a-checkbox-group>

      <div class="search-field__spacer" />
      <a-input
        v-model:value="form.username"
        :placeholder="$t('rewardView.profitAndLoss.searchField.username.placeholder')"
      />
      <a-button @click="handleSubmit">{{ $t("rewardView.profitAndLoss.searchField.searchButton") }}</a-button>
    </div>

    <div class="result-table">
      <table>
        <thead>
          <tr>
            <td v-for="(header, index) in tableHeaders" :key="index">{{ header.label }}</td>
          </tr>
        </thead>
        <tbody>
          <template v-if="tableData.length > 0">
            <tr v-for="(row, rowIndex) in tableData" :key="`row-${rowIndex}`">
              <td v-for="(header, colIndex) in tableHeaders" :key="`row-${rowIndex}-${colIndex}`">
                <span
                  v-if="
                    ['deposit', 'withdraw', 'bonus', 'validBet', 'balance', 'depositFee', 'bet', 'payout'].includes(
                      header.key
                    )
                  "
                  :class="header.key === 'balance' ? row.type : ''"
                >
                  {{ addThousandsComma(row[header.key], true) }}
                </span>
                <span v-else-if="header.key === 'rebate'">
                  {{ moment(row[header.key]).format("YY-MM-DD HH:mm") }}
                </span>
                <span v-else>
                  {{ row[header.key] }}
                </span>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="7">No data</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="sum-wrapper">
      <div class="sum-item">
        <div class="item-amount">
          Rs
          <span>{{ addThousandsComma(sumsData.bet, true) }}</span>
        </div>
        <div class="item-title">{{ $t("rewardView.profitAndLoss.sums.bet") }}</div>
      </div>

      <div class="sum-item">
        <div class="item-amount">
          Rs
          <span>{{ addThousandsComma(sumsData.valid_bet, true) }}</span>
        </div>
        <div class="item-title">{{ $t("rewardView.profitAndLoss.sums.validBet") }}</div>
      </div>

      <div class="sum-item">
        <div class="item-amount">
          Rs
          <span>{{ addThousandsComma(sumsData.bonus, true) }}</span>
        </div>
        <div class="item-title">{{ $t("rewardView.profitAndLoss.sums.bonus") }}</div>
      </div>

      <div class="sum-item">
        <div class="item-amount">
          Rs
          <span>{{ addThousandsComma(sumsData.payout, true) }}</span>
        </div>
        <div class="item-title">{{ $t("rewardView.profitAndLoss.sums.payout") }}</div>
      </div>

      <div class="sum-item">
        <div class="item-amount">
          Rs
          <span>{{ addThousandsComma(sumsData.deposit, true) }}</span>
        </div>
        <div class="item-title">{{ $t("rewardView.profitAndLoss.sums.deposit") }}</div>
      </div>

      <div class="sum-item">
        <div class="item-amount">
          Rs
          <span>{{ addThousandsComma(sumsData.withdraw, true) }}</span>
        </div>
        <div class="item-title">{{ $t("rewardView.profitAndLoss.sums.withdraw") }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import moment from "moment";
import { DATE_FORMAT } from "@/constant/format";
import { useI18n } from "vue-i18n";
import { useSingleCheckbox } from "@/hooks/singleCheckbox";
import { addThousandsComma, updateDate } from "@/utils/utils";
import { getDownlineProfitSummaryAPI } from "@/api/personal/reward";

const { t } = useI18n();
const { selectedValue, handleCheckedChange } = useSingleCheckbox("today", (value) => handleDateSelect(value));

const tableData = ref([]);
const sumsData = reactive({
  bet: 0.0,
  valid_bet: 0.0,
  bonus: 0.0,
  payout: 0.0,
  deposit: 0.0,
  withdraw: 0.0
});
const form = ref({
  startDate: moment().format(DATE_FORMAT),
  endDate: moment().format(DATE_FORMAT),
  username: ""
});

const dateOptions = computed(() => [
  { label: t("rewardView.profitAndLoss.searchField.date.today"), value: "today" },
  { label: t("rewardView.profitAndLoss.searchField.date.yesterday"), value: "yesterday" },
  { label: t("rewardView.profitAndLoss.searchField.date.7day"), value: "7days" }
]);

const tableHeaders = computed(() => [
  { label: t("rewardView.profitAndLoss.table.username"), key: "loginName" },
  { label: t("rewardView.profitAndLoss.table.deposit"), key: "deposit" },
  { label: t("rewardView.profitAndLoss.table.withdraw"), key: "withdraw" },
  { label: t("rewardView.profitAndLoss.table.bet"), key: "bet" },
  { label: t("rewardView.profitAndLoss.table.validBet"), key: "validBet" },
  { label: t("rewardView.profitAndLoss.table.bonus"), key: "bonus" },
  { label: t("rewardView.profitAndLoss.table.payout"), key: "payout" }
]);

const handleDateSelect = (value) => {
  switch (value) {
    case "today":
      form.value.startDate = updateDate(0);
      form.value.endDate = updateDate(0);
      getDownlineProfitSummary();
      break;
    case "yesterday":
      form.value.startDate = updateDate(1);
      form.value.endDate = updateDate(1);
      getDownlineProfitSummary();
      break;
    case "7days":
      form.value.startDate = updateDate(7);
      form.value.endDate = updateDate(0);
      getDownlineProfitSummary();
      break;
  }
};

const getDownlineProfitSummary = () => {
  const { username, startDate, endDate } = form.value;

  const params = new URLSearchParams();

  if (username) {
    params.append("loginName", username);
  }

  params.append("regTime", startDate);
  params.append("regTime", endDate);

  const queryString = params.toString();
  const paramString = `${queryString}`;

  getDownlineProfitSummaryAPI(paramString)
    .then((response) => {
      if (response.code === 0) {
        tableData.value = response.data.records;
        sumsData = response.data.sums;
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const handleSubmit = () => {
  getDownlineProfitSummary();
};

onMounted(() => {
  getDownlineProfitSummary();
});
</script>
<style scoped lang="scss" src="@/assets/css/pages/reward.scss" />
