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
      <!-- <div class="search-field__radio-row">
        <q-radio v-for="(option, index) in downLineOptions" v-model="selectedDownLine" :key="index" :val="option.value"
          :label="option.label" />
      </div> -->
      <div class="search-field__input-with-btn">
        <q-input v-model="form.username" :placeholder="$t('earnMoney.teamManagement.searchField.username.placeholder')"
          borderless />
        <q-btn @click="handleSubmit" class="btn-primary btn-primary__full" no-caps unelevated>
          {{ $t("earnMoney.teamManagement.searchField.searchButton") }}
        </q-btn>
      </div>
    </div>

    <div class="result-table">
      <q-table :columns="tableHeaders" :hide-pagination="true" :rows-per-page-options="[0]" :rows="tableData"
        class="monthly-deposit-table" row-key="name" style="overflow-x: scroll" flat>
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
                <span class="span-username">{{ col.value }}</span>
              </span>
              <span v-else-if="col.field === 'balance'">
                {{ convertToCommaAmount(col.value, true) }}
              </span>
              <span v-else-if="['regTime', 'lastLogin', 'lastDeposit'].includes(col.field)">
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
import { api } from "boot/axios";
import { userStore } from "src/stores";

const { t } = useI18n();
const store = userStore();
const selectedDownLine = ref("ALL");
const tableData = ref([]);
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
  // { label: t("earnMoney.teamManagement.table.id"), name: "id", field: "id", align: "center" },
  { label: t("earnMoney.teamManagement.table.username"), name: "loginName", field: "loginName", align: "center" },
  { label: t("earnMoney.teamManagement.table.registrationDate"), name: "regTime", field: "regTime", align: "center" },
  { label: t("earnMoney.teamManagement.table.downlineMember"), name: "totalDownlineCount", field: "totalDownlineCount", align: "center" },
  { label: "Today Register Count", name: "todayRegCount", field: "todayRegCount", align: "center" },
  { label: "Yesterday Register Count", name: "yesterdayRegCount", field: "yesterdayRegCount", align: "center" },

  // { label: t("earnMoney.teamManagement.table.downlineDepositMember"), name: "downlineDepositMember", field: "downlineDepositMember", align: "center" },
  // { label: t("earnMoney.teamManagement.table.vip"), name: "vip", field: "vip", align: "center" },
  // { label: t("earnMoney.teamManagement.table.balance"), name: "balance", field: "balance", align: "center" },
  // { label: t("earnMoney.teamManagement.table.lastLogin"), name: "lastLogin", field: "lastLogin", align: "center" },
  // { label: t("earnMoney.teamManagement.table.lastDeposit"), name: "lastDeposit", field: "lastDeposit", align: "center" },
  // { label: t("earnMoney.teamManagement.table.uplineLoginName"), name: "uplineLoginName", field: "uplineLoginName", align: "center" }
]);

const getDownlines = () => {
  const { username, startDate, endDate } = form.value;

  let url = `/session/downlines?regTime=${startDate}&regTime=${endDate}`;

  if (username) {
    url = `/session/downlines?loginName=${username}&regTime=${startDate}&regTime=${endDate}`;
  }

  api
    .get(url)
    // .get(`/session/downlines?loginName=${form.value.username}&regTime=${form.value.startDate}&regTime=${form.value.endDate}`)
    .then((response) => {
      if (response.code === 0) {
        tableData.value = response.data.records
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

const handleSubmit = () => { getDownlines() };

onMounted(() => {
  getDownlines();
});
</script>
<style scoped lang="scss" src="../../css/page/earnMoney.scss"></style>
