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
      <div class="search-field__input-with-btn" style="justify-content: space-between; align-items: center">
        <!--        <q-input-->
        <!--          v-model="form.username"-->
        <!--          borderless-->
        <!--          :placeholder="$t('earnMoney.profitAndLoss.searchField.username.placeholder')"-->
        <!--        />-->
        <div>
          &nbsp;
          <span v-if="referralName">
            Referral:
            <span class="span-username">{{ referralName }}</span>
            &nbsp;
            <q-btn size="xs" style="min-height: 24px; height:24px;" round color="red" icon="close" @click="closeReferral()" />
          </span>
        </div>

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
        :loading="loading"
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
              <span v-if="col.field === 'loginName'">
                <span class="span-username" @click="searchByReferral(props)">{{ col.value }}</span>
              </span>
              <span
                v-else-if="
                  [
                    'downlineFtdAmount',
                    'downlineDepositAmount',
                    'downlineWithdrawAmount',
                    'downlineBetAmount',
                    'downlinePayoutAmount'
                  ].includes(col.field)
                "
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

    <div class="sum-wrapper">
      <div class="loading-board" v-if="loading">
        <q-spinner class="loading-spinner" color="primary" size="4em" :thickness="3" />
      </div>

      <div class="sum-item">
        <div class="item-amount">
          Rs
          <span>{{ convertToCommaAmount(sumsData.downlineBetAmount, true) }}</span>
        </div>
        <div class="item-title">{{ $t("earnMoney.profitAndLoss.sums.betamount") }}</div>
      </div>

      <div class="sum-item">
        <div class="item-amount">
          Rs
          <span>{{ convertToCommaAmount(sumsData.downlineDepositAmount, true) }}</span>
        </div>
        <div class="item-title">{{ $t("earnMoney.profitAndLoss.sums.deposit") }}</div>
      </div>

      <div class="sum-item">
        <div class="item-amount">
          <span>{{ sumsData.downlineDepositCount }}</span>
        </div>
        <div class="item-title">{{ $t("earnMoney.profitAndLoss.sums.depositcount") }}</div>
      </div>

      <div class="sum-item">
        <div class="item-amount">
          Rs
          <span>{{ convertToCommaAmount(sumsData.downlinePayoutAmount, true) }}</span>
        </div>
        <div class="item-title">{{ $t("earnMoney.profitAndLoss.sums.payout") }}</div>
      </div>

      <!--      <div class="sum-item">-->
      <!--        <div class="item-amount">-->
      <!--          Rs-->
      <!--          <span>{{ convertToCommaAmount(sumsData.downlineDepositAmount, true) }}</span>-->
      <!--        </div>-->
      <!--        <div class="item-title">{{ $t("earnMoney.profitAndLoss.sums.deposit") }}</div>-->
      <!--      </div>-->

      <div class="sum-item">
        <div class="item-amount">
          Rs
          <span>{{ convertToCommaAmount(sumsData.downlineWithdrawAmount, true) }}</span>
        </div>
        <div class="item-title">{{ $t("earnMoney.profitAndLoss.sums.withdraw") }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import moment from "moment";
import { DATE_FORMAT } from "../../constant/format";
import { useI18n } from "vue-i18n";
import { convertToCommaAmount, updateDate } from "src/boot/utils";
import { api } from "boot/axios";

const { t } = useI18n();

const selectedDownLine = ref("today");
const tableData = ref([]);
const sumsData = ref({
  downlineBetAmount: 0.0,
  downlineDepositCount: 0,
  downlinePayoutAmount: 0.0,
  downlineDepositAmount: 0.0,
  downlineWithdrawAmount: 0.0
});
const form = ref({
  startDate: moment().format(DATE_FORMAT),
  endDate: moment().format(DATE_FORMAT),
  username: "",
  referrerId: ""
});
const loading = ref(false);
const referralName = ref("");

const displayStartDate = computed(() => moment(form.value.startDate).format("MM/DD"));
const displayEndDate = computed(() => moment(form.value.endDate).format("MM/DD"));
const downLineOptions = computed(() => [
  { label: t("earnMoney.profitAndLoss.searchField.date.today"), value: "today" },
  { label: t("earnMoney.profitAndLoss.searchField.date.yesterday"), value: "yesterday" },
  { label: t("earnMoney.profitAndLoss.searchField.date.7day"), value: "7days" }
]);

const tableHeaders = computed(() => [
  { label: t("earnMoney.profitAndLoss.table.username"), name: "username", field: "loginName", align: "center" },
  {
    label: t("earnMoney.profitAndLoss.table.deposit"),
    name: "deposit",
    field: "downlineDepositAmount",
    align: "center"
  },
  {
    label: t("earnMoney.profitAndLoss.table.depositcount"),
    name: "deposit_count",
    field: "downlineDepositCount",
    align: "center"
  },

  { label: t("earnMoney.profitAndLoss.table.ftdamount"), name: "ftd", field: "downlineFtdAmount", align: "center" },
  { label: t("earnMoney.profitAndLoss.table.ftdcount"), name: "ftd_count", field: "downlineFtdCount", align: "center" },

  {
    label: t("earnMoney.profitAndLoss.table.withdraw"),
    name: "withdraw",
    field: "downlineWithdrawAmount",
    align: "center"
  },
  { label: t("earnMoney.profitAndLoss.table.bet"), name: "bet", field: "downlineBetAmount", align: "center" },
  // { label: t("earnMoney.profitAndLoss.table.validBet"), name: "validBet", field: "validBet", align: "center" },
  // { label: t("earnMoney.profitAndLoss.table.bonus"), name: "bonus", field: "bonus", align: "center" },
  { label: t("earnMoney.profitAndLoss.table.payout"), name: "payout", field: "downlinePayoutAmount", align: "center" }
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

const searchByReferral = (props) => {
  form.value.username = "";
  form.value.referrerId = props.row.id;
  referralName.value = props.row.loginName;
  getDownlineProfitSummary();
};

const getDownlineProfitSummary = () => {
  const { username, startDate, endDate, referrerId } = form.value;
  loading.value = true;

  let url = `/session/downline-profit-summary?siteId=11&recordTime=${startDate}&recordTime=${endDate}`;

  if (username) {
    url = `/session/downline-profit-summary?siteId=11&loginName=${username}&recordTime=${startDate}&recordTime=${endDate}`;
  }
  if (referrerId) {
    url = `/session/downline-profit-summary?siteId=11&referrerId=${referrerId}&recordTime=${startDate}&recordTime=${endDate}`;
  }

  tableData.value = [];
  api
    .get(url)
    .then((response) => {
      loading.value = false;
      if (response.code === 0) {
        tableData.value = response.data.records;
        sumsData.value = response.data.sums;
      }
    })
    .catch((e) => {
      loading.value = false;
      console.log(e);
    });
};

const closeReferral = () => {
  referralName.value = "";
  form.value.referrerId = "";
  getDownlineProfitSummary();
};

const handleSubmit = () => {
  form.value.referrerId = "";
  referralName.value = "";
  getDownlineProfitSummary();
};

onMounted(() => {
  getDownlineProfitSummary();
});
</script>
<style scoped lang="scss" src="../../css/page/earnMoney.scss"></style>
