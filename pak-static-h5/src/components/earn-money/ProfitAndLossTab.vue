<template>
  <div class="team-management-wrapper">
    <div class="search-field">
      <div class="search-field__date-range">
        <q-input v-model="displayStartDate" filled readonly>
          <template #append>
            <img src="../../assets/images/earn-money/calendar-icon.svg" />
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="form.startDate" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="white" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </template>
        </q-input>
        <span>-</span>
        <q-input v-model="displayEndDate" filled readonly>
          <template #append>
            <img src="../../assets/images/earn-money/calendar-icon.svg" />
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="form.endDate" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="white" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </template>
        </q-input>
      </div>
      <div class="search-field__radio-row">
        <q-radio
          v-for="(option, index) in downLineOptions"
          v-model="selectedDownLine"
          :key="index"
          :val="option.value"
          :label="option.label"
          @update:model-value="handleDateSelect"
        />
      </div>
      <div class="search-field__input-with-btn">
        <q-input
          v-model="form.username"
          borderless
          :placeholder="$t('earnMoney.profitAndLoss.searchField.username.placeholder')"
        />
        <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="handleSubmit">
          {{ $t("earnMoney.profitAndLoss.searchField.searchButton") }}
        </q-btn>
      </div>
    </div>

    <div class="result-table">
      <q-table
        flat
        :hide-pagination="true"
        :columns="tableHeaders"
        :rows="tableData"
        row-key="name"
        :rows-per-page-options="[0]"
        style="overflow-x: scroll"
        class="monthly-deposit-table"
      >
        <template v-slot:header>
          <q-tr class="top-header">
            <q-td v-for="(header, index) in tableHeaders" :key="index">
              {{ header.label }}
            </q-td>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <span
                v-if="['deposit', 'withdraw', 'bonus', 'validBet', 'balance', 'depositFee'].includes(col.field)"
                :class="col.field === 'balance' ? props.row.type : ''"
              >
                {{ convertToCommaAmount(col.value, true) }}
              </span>
              <span v-else-if="col.field === 'rebate'">
                {{ moment(col.value).format("YY-MM-DD HH:mm") }}
              </span>
              <span v-else>
                {{ col.value }}
              </span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import moment from "moment";
import { DATE_FORMAT } from "../../constant/format";
import { useI18n } from "vue-i18n";
import { convertToCommaAmount, updateDate } from "src/boot/utils";

const { t } = useI18n();

const selectedDownLine = ref("today");
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

const displayStartDate = computed(() => moment(form.value.startDate).format("MM/DD"));
const displayEndDate = computed(() => moment(form.value.endDate).format("MM/DD"));
const downLineOptions = computed(() => [
  { label: t("earnMoney.profitAndLoss.searchField.date.today"), value: "today" },
  { label: t("earnMoney.profitAndLoss.searchField.date.yesterday"), value: "yesterday" },
  { label: t("earnMoney.profitAndLoss.searchField.date.7day"), value: "7days" }
]);

const tableHeaders = computed(() => [
  { label: t("earnMoney.profitAndLoss.table.username"), name: "username", field: "username", align: "center" },
  { label: t("earnMoney.profitAndLoss.table.deposit"), name: "deposit", field: "deposit", align: "center" },
  { label: t("earnMoney.profitAndLoss.table.withdraw"), name: "withdraw", field: "withdraw", align: "center" },
  { label: t("earnMoney.profitAndLoss.table.bonus"), name: "bonus", field: "bonus", align: "center" },
  {
    label: t("earnMoney.profitAndLoss.table.validBet"),
    name: "validBet",
    field: "validBet",
    align: "center"
  },
  { label: t("earnMoney.profitAndLoss.table.balance"), name: "balance", field: "balance", align: "center" },
  { label: t("earnMoney.profitAndLoss.table.rebate"), name: "rebate", field: "rebate", align: "center" },
  { label: t("earnMoney.profitAndLoss.table.referral"), name: "referral", field: "referral", align: "center" },
  {
    label: t("earnMoney.profitAndLoss.table.profitAndLoss"),
    name: "profitAndLoss",
    field: "profitAndLoss",
    align: "center"
  },
  { label: t("earnMoney.profitAndLoss.table.depositFee"), name: "depositFee", field: "depositFee", align: "center" }
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
<style scoped lang="scss" src="../../css/page/earnMoney.scss"></style>
