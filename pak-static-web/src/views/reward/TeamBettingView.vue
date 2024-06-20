<template>
  <div class="team-betting-wrapper">
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

      <span class="search-field__label">{{ $t("rewardView.teamBetting.searchField.gameType.label") }}</span>
      <a-select v-model:value="form.gameType" :options="gameTypeOptions" />

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
          <tr v-for="(row, rowIndex) in tableData" :key="`row-${rowIndex}`">
            <td v-for="(header, colIndex) in tableHeaders" :key="`row-${rowIndex}-${colIndex}`">
              <span
                v-if="['betAmount', 'winning', 'validBet', 'balance'].includes(header.key)"
                :class="header.key === 'balance' ? row.type : ''"
              >
                {{ addThousandsComma(row[header.key], true) }}
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
    vendor: "sabong",
    gameType: "sport",
    betAmount: 120,
    winning: 137,
    validBet: 120,
    type: "win",
    balance: 1235,
    rounds: 5,
    player: 1
  })
);
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
  { label: t("rewardView.teamBetting.table.vendor"), key: "vendor" },
  { label: t("rewardView.teamBetting.table.gameType"), key: "gameType" },
  { label: t("rewardView.teamBetting.table.betAmount"), key: "betAmount" },
  { label: t("rewardView.teamBetting.table.winning"), key: "winning" },
  { label: t("rewardView.teamBetting.table.validBet"), key: "validBet" },
  { label: t("rewardView.teamBetting.table.balance"), key: "balance" },
  { label: t("rewardView.teamBetting.table.rounds"), key: "rounds" },
  { label: t("rewardView.teamBetting.table.player"), key: "player" }
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
      break;
    case "yesterday":
      form.value.startDate = updateDate(1);
      form.value.endDate = updateDate(1);
      break;
  }
};

const handleSubmit = () => {};

onMounted(handleSubmit);
</script>
<style scoped lang="scss" src="@/assets/css/pages/reward.scss" />
