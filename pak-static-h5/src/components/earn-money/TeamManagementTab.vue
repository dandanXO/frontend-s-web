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
        />
      </div>
      <div class="search-field__input-with-btn">
        <q-input
          v-model="form.username"
          borderless
          :placeholder="$t('earnMoney.teamManagement.searchField.username.placeholder')"
        />
        <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="handleSubmit">
          {{ $t("earnMoney.teamManagement.searchField.searchButton") }}
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
              <span v-if="col.field === 'balance'">
                {{ convertToCommaAmount(col.value, true) }}
              </span>
              <span v-else-if="['registrationDate', 'lastLogin', 'lastDeposit'].includes(col.field)">
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
import { convertToCommaAmount } from "src/boot/utils";

const { t } = useI18n();

const selectedDownLine = ref("ALL");
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

const displayStartDate = computed(() => moment(form.value.startDate).format("MM/DD"));
const displayEndDate = computed(() => moment(form.value.endDate).format("MM/DD"));
const downLineOptions = computed(() => [
  { label: t("earnMoney.teamManagement.searchField.downLine.all"), value: "ALL" },
  { label: t("earnMoney.teamManagement.searchField.downLine.direct"), value: "DIRECT" }
]);

const tableHeaders = computed(() => [
  { label: t("earnMoney.teamManagement.table.type"), name: "type", field: "type", align: "center" },
  { label: t("earnMoney.teamManagement.table.username"), name: "username", field: "username", align: "center" },
  { label: t("earnMoney.teamManagement.table.emark"), name: "emark", field: "emark", align: "center" },
  { label: t("earnMoney.teamManagement.table.upLine"), name: "upLine", field: "upLine", align: "center" },
  {
    label: t("earnMoney.teamManagement.table.registrationDate"),
    name: "registrationDate",
    field: "registrationDate",
    align: "center"
  },
  { label: t("earnMoney.teamManagement.table.balance"), name: "balance", field: "balance", align: "center" },
  { label: t("earnMoney.teamManagement.table.lastLogin"), name: "lastLogin", field: "lastLogin", align: "center" },
  { label: t("earnMoney.teamManagement.table.lastDeposit"), name: "lastDeposit", field: "lastDeposit", align: "center" }
]);

const handleSubmit = () => {};

onMounted(handleSubmit);
</script>
<style scoped lang="scss" src="../../css/page/earnMoney.scss"></style>
