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
        <a-checkbox v-for="(option, index) in downLineOptions" :key="index" :value="option.value">
          {{ option.label }}
        </a-checkbox>
      </a-checkbox-group>

      <div class="search-field__spacer" />
      <a-input
        v-model:value="form.username"
        :placeholder="$t('rewardView.teamManagement.searchField.username.placeholder')"
      />
      <a-button @click="handleSubmit">{{ $t("rewardView.teamManagement.searchField.searchButton") }}</a-button>
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
              <span v-if="header.key === 'balance'">
                {{ addThousandsComma(row[header.key], true) }}
              </span>
              <span v-else-if="['registrationDate', 'lastLogin', 'lastDeposit'].includes(header.key)">
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
import { addThousandsComma } from "@/utils/utils";

const { t } = useI18n();
const { selectedValue, handleCheckedChange } = useSingleCheckbox("ALL");

const tableData = ref(
  Array(10).fill({
    type: "23026",
    username: "666666",
    emark: "666666",
    upLine: "-",
    registrationDate: "2023-09-17 21:03",
    balance: 1235,
    lastLogin: "2023-09-17 21:03",
    lastDeposit: "2023-09-17 21:03"
  })
);
const form = ref({
  startDate: moment().format(DATE_FORMAT),
  endDate: moment().format(DATE_FORMAT),
  username: ""
});

const downLineOptions = computed(() => [
  { label: t("rewardView.teamManagement.searchField.downLine.all"), value: "ALL" },
  { label: t("rewardView.teamManagement.searchField.downLine.direct"), value: "DIRECT" }
]);

const tableHeaders = computed(() => [
  { label: t("rewardView.teamManagement.table.type"), key: "type" },
  { label: t("rewardView.teamManagement.table.username"), key: "username" },
  { label: t("rewardView.teamManagement.table.emark"), key: "emark" },
  { label: t("rewardView.teamManagement.table.upLine"), key: "upLine" },
  { label: t("rewardView.teamManagement.table.registrationDate"), key: "registrationDate" },
  { label: t("rewardView.teamManagement.table.balance"), key: "balance" },
  { label: t("rewardView.teamManagement.table.lastLogin"), key: "lastLogin" },
  { label: t("rewardView.teamManagement.table.lastDeposit"), key: "lastDeposit" }
]);

const handleSubmit = () => {};

onMounted(handleSubmit);
</script>
<style scoped lang="scss" src="@/assets/css/pages/reward.scss" />
