<template>
  <div class="team-betting-wrapper">
    <div class="search-field">
      <div class="search-field__date-range">
        <a-date-picker v-model:value="form.startDate" value-format="YYYY-MM-DD" format="MM/DD" :allow-clear="false"
          :show-today="false" #suffixIcon>
          <img src="@/assets/images/reward/calendar-icon.svg" />
        </a-date-picker>
        <span>-</span>
        <a-date-picker v-model:value="form.endDate" value-format="YYYY-MM-DD" format="MM/DD" :allow-clear="false"
          :show-today="false" #suffixIcon>
          <img src="@/assets/images/reward/calendar-icon.svg" />
        </a-date-picker>
      </div>

      <a-checkbox-group v-model:value="selectedValue" name="downLine" @change="handleCheckedChange">
        <a-checkbox v-for="(option, index) in dateOptions" :key="index" :value="option.value">
          {{ option.label }}
        </a-checkbox>
      </a-checkbox-group>

      <div class="search-field__spacer" />

      <!-- <span class="search-field__label">{{ $t("rewardView.teamBetting.searchField.gameType.label") }}</span>
      <a-select v-model:value="form.gameType" :options="gameTypeOptions" /> -->

      <a-button @click="handleSubmit">{{ $t("rewardView.teamBetting.searchField.searchButton") }}</a-button>
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
                <span v-if="['betAmount', 'winning', 'validBet', 'balance', 'bet', 'payout'].includes(header.key)"
                  :class="header.key === 'balance' ? row.type : ''">
                  {{ addThousandsComma(row[header.key], true) }}
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
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import moment from "moment";
import { DATE_FORMAT } from "@/constant/format";
import { useI18n } from "vue-i18n";
import { useSingleCheckbox } from "@/hooks/singleCheckbox";
import { addThousandsComma, updateDate } from "@/utils/utils";
import { getDownlinePlatformSummaryAPI } from "@/api/personal/reward";

const { t } = useI18n();
const { selectedValue, handleCheckedChange } = useSingleCheckbox("today", (value) => handleDateSelect(value));

const tableData = ref([]);
const form = ref({
  startDate: moment().format(DATE_FORMAT),
  endDate: moment().format(DATE_FORMAT),
  gameType: ""
});

const dateOptions = computed(() => [
  { label: t("rewardView.teamBetting.searchField.date.today"), value: "today" },
  { label: t("rewardView.teamBetting.searchField.date.yesterday"), value: "yesterday" }
]);

const tableHeaders = computed(() => [
  { label: t("rewardView.teamBetting.table.platform"), key: "platform" },
  { label: t("rewardView.teamBetting.table.players"), key: "playerCount" },
  { label: t("rewardView.teamBetting.table.bet"), key: "bet" },
  { label: t("rewardView.teamBetting.table.validBet"), key: "validBet" },
  { label: t("rewardView.teamBetting.table.payout"), key: "payout" },
]);

const gameTypeOptions = computed(() => [
  { label: t("rewardView.teamBetting.searchField.gameType.options.slot"), value: "slot" },
  { label: t("rewardView.teamBetting.searchField.gameType.options.live"), value: "live" },
  { label: t("rewardView.teamBetting.searchField.gameType.options.sport"), value: "sport" },
  { label: t("rewardView.teamBetting.searchField.gameType.options.fish"), value: "fish" },
  { label: t("rewardView.teamBetting.searchField.gameType.options.poker"), value: "poker" }
]);

const handleDateSelect = (value) => {
  switch (value) {
    case "today":
      form.value.startDate = updateDate(0);
      form.value.endDate = updateDate(0);
      getDownlinePlatformSummary();
      break;
    case "yesterday":
      form.value.startDate = updateDate(1);
      form.value.endDate = updateDate(1);
      getDownlinePlatformSummary();
      break;
  }
};

const getDownlinePlatformSummary = () => {
  const { startDate, endDate } = form.value;

  const params = new URLSearchParams();

  params.append("regTime", startDate);
  params.append("regTime", endDate);

  const queryString = params.toString();
  const paramString = `${queryString}`;

  getDownlinePlatformSummaryAPI(paramString)
    .then((response) => {
      if (response.code === 0) {
        tableData.value = response.data;
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const handleSubmit = () => {
  getDownlinePlatformSummary();
};

onMounted(() => {
  getDownlinePlatformSummary();
});
</script>
<style scoped lang="scss" src="@/assets/css/pages/reward.scss" />
