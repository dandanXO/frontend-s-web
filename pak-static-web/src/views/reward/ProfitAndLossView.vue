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
          <tr v-for="(row, rowIndex) in tableData" :key="`row-${rowIndex}`">
            <td v-for="(header, colIndex) in tableHeaders" :key="`row-${rowIndex}-${colIndex}`">
              <span
                v-if="['deposit', 'withdraw', 'bonus', 'validBet', 'balance', 'depositFee'].includes(header.key)"
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
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import moment from "moment";
import { DATE_FORMAT } from "@/constant/format";
import { useI18n } from "vue-i18n";
import { useSingleCheckbox } from "@/hooks/singleCheckbox";
import { addThousandsComma, updateDate } from "@/utils/utils";

const { t } = useI18n();
const { selectedValue, handleCheckedChange } = useSingleCheckbox("today", (value) => handleDateSelect(value));

const tableData = ref(
  Array(10).fill({
    username: "666666",
    deposit: 6300,
    withdraw: 6300,
    bonus: 86,
    validBet: 43312,
    type: "loss",
    balance: 17,
    rebate: "2023-09-17 21:03",
    referral: 27,
    profitAndLoss: 41,
    depositFee: 189
  })
);
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
  { label: t("rewardView.profitAndLoss.table.username"), key: "username" },
  { label: t("rewardView.profitAndLoss.table.deposit"), key: "deposit" },
  { label: t("rewardView.profitAndLoss.table.withdraw"), key: "withdraw" },
  { label: t("rewardView.profitAndLoss.table.bonus"), key: "bonus" },
  { label: t("rewardView.profitAndLoss.table.validBet"), key: "validBet" },
  { label: t("rewardView.profitAndLoss.table.balance"), key: "balance" },
  { label: t("rewardView.profitAndLoss.table.rebate"), key: "rebate" },
  { label: t("rewardView.profitAndLoss.table.referral"), key: "referral" },
  { label: t("rewardView.profitAndLoss.table.profitAndLoss"), key: "profitAndLoss" },
  { label: t("rewardView.profitAndLoss.table.depositFee"), key: "depositFee" }
]);

const handleDateSelect = (value) => {
  switch (value) {
    case "today":
      form.value.startDate = updateDate(0);
      form.value.endDate = updateDate(0);
      break;
    case "yesterday":
      form.value.startDate = updateDate(1);
      form.value.endDate = updateDate(1);
      break;
    case "7days":
      form.value.startDate = updateDate(7);
      form.value.endDate = updateDate(0);
      break;
  }
};

const handleSubmit = () => {};

onMounted(handleSubmit);
</script>
<style scoped lang="scss" src="@/assets/css/pages/reward.scss" />
