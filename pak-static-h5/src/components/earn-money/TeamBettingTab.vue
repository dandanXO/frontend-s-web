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
                  <q-btn v-close-popup label="Close" color="white" flat @click="handleSubmit()" />
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
                  <q-btn v-close-popup label="Close" color="white" flat @click="handleSubmit()" />
                </div>
              </q-date>
            </q-popup-proxy>
          </template>
        </q-input>
      </div>
      <div class="search-field__radio-row">
        <q-radio
          v-for="(option, index) in downLineOptions"
          v-model="selectedDateType"
          :key="index"
          :val="option.value"
          :label="option.label"
          @update:model-value="handleDateSelect"
        />
      </div>
      <!-- <div class="search-field__select">
        <InputField :label="$t('earnMoney.teamBetting.searchField.gameType.label')">
          <template #input>
            <q-select v-model="form.gameType" :options="gameTypeOptions" standout />
          </template>
        </InputField>
      </div> -->
      <div>
        <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="handleSubmit">
          {{ $t("earnMoney.teamBetting.searchField.searchButton") }}
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
        style="overflow-x: auto;"
        class="monthly-deposit-table"
        :loading-label="$t('btn.loading')"
        :no-data-label="$t('earnmoney.noDataAvailable')"
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
                v-if="['betAmount', 'winning', 'validBet', 'balance', 'bet', 'payout'].includes(col.field)"
                :class="col.field === 'balance' ? props.row.type : ''"
              >
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
import { convertToCommaAmount, updateDate } from "src/boot/utils";
import InputField from "../auth/InputField.vue";
import { api } from "boot/axios";

const { t } = useI18n();

const selectedDateType = ref("today");
const tableData = ref([]);
const form = ref({
  startDate: moment().format(DATE_FORMAT),
  endDate: moment().format(DATE_FORMAT),
  gameType: ""
});

const displayStartDate = computed(() => moment(form.value.startDate).format("MM/DD"));
const displayEndDate = computed(() => moment(form.value.endDate).format("MM/DD"));
const downLineOptions = computed(() => [
  { label: t("earnMoney.teamBetting.searchField.date.today"), value: "today" },
  { label: t("earnMoney.teamBetting.searchField.date.yesterday"), value: "yesterday" }
]);

const tableHeaders = computed(() => [
  { label: t("earnMoney.teamBetting.table.platform"), name: "platform", field: "platform", align: "center" },
  { label: t("earnMoney.teamBetting.table.players"), name: "players", field: "playerCount", align: "center" },
  { label: t("earnMoney.teamBetting.table.bet"), name: "bet", field: "bet", align: "center" },
  { label: t("earnMoney.teamBetting.table.validBet"), name: "validBet", field: "validBet", align: "center" },
  { label: t("earnMoney.teamBetting.table.payout"), name: "payout", field: "payout", align: "center" },
]);

const gameTypeOptions = computed(() => [
  { label: t("earnMoney.teamBetting.searchField.gameType.options.slot"), value: "slot" },
  { label: t("earnMoney.teamBetting.searchField.gameType.options.live"), value: "live" },
  { label: t("earnMoney.teamBetting.searchField.gameType.options.sport"), value: "sport" },
  { label: t("earnMoney.teamBetting.searchField.gameType.options.fish"), value: "fish" },
  { label: t("earnMoney.teamBetting.searchField.gameType.options.poker"), value: "poker" }
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
  api
    .get(`/session/downline-platform-summary?regTime=${form.value.startDate}&regTime=${form.value.endDate}`)
    .then((response) => {
      if (response.code === 0) {
        tableData.value = response.data;
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

const handleSubmit = () => { getDownlinePlatformSummary() };

onMounted(() => {
  getDownlinePlatformSummary();
});
</script>
<style scoped lang="scss" src="../../css/page/earnMoney.scss"></style>
