<template>
  <div class="team-management-wrapper">
    <div class="search-field" style="margin-bottom: 0.5rem">
      <!--      <div class="search-field__date-range">-->
      <!--        <q-input v-model="displayStartDate" filled readonly>-->
      <!--          <template #append>-->
      <!--            <img src="../../assets/images/earn-money/calendar-icon.svg" />-->
      <!--            <q-popup-proxy cover transition-show="scale" transition-hide="scale">-->
      <!--              <q-date v-model="form.startDate" mask="YYYY-MM-DD">-->
      <!--                <div class="row items-center justify-end">-->
      <!--                  <q-btn v-close-popup label="Close" color="white" flat @click="handleSubmit()" />-->
      <!--                </div>-->
      <!--              </q-date>-->
      <!--            </q-popup-proxy>-->
      <!--          </template>-->
      <!--        </q-input>-->
      <!--        <span>-</span>-->
      <!--        <q-input v-model="displayEndDate" filled readonly>-->
      <!--          <template #append>-->
      <!--            <img src="../../assets/images/earn-money/calendar-icon.svg" />-->
      <!--            <q-popup-proxy cover transition-show="scale" transition-hide="scale">-->
      <!--              <q-date v-model="form.endDate" mask="YYYY-MM-DD">-->
      <!--                <div class="row items-center justify-end">-->
      <!--                  <q-btn v-close-popup label="Close" color="white" flat @click="handleSubmit()" />-->
      <!--                </div>-->
      <!--              </q-date>-->
      <!--            </q-popup-proxy>-->
      <!--          </template>-->
      <!--        </q-input>-->
      <!--      </div>-->

      <div class="search-field__input-with-btn">
        <q-input
          v-model="form.username"
          :placeholder="$t('earnMoney.teamManagement.searchField.username.placeholder')"
          borderless
        />
        <q-btn @click="handleSubmit" class="btn-primary btn-primary__full" no-caps unelevated>
          {{ $t("earnMoney.teamManagement.searchField.searchButton") }}
        </q-btn>
      </div>
    </div>

    <div class="result-table">
      <span v-if="referralName">
        Referral:
        <span class="span-username">{{ referralName }}</span>
        &nbsp;
        <q-btn size="xs" round color="red" icon="close" @click="closeReferral()" />
      </span>
      <q-table
        :columns="tableHeaders"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
        :rows="tableData"
        :loading="loading"
        class="monthly-deposit-table q-mt-md"
        row-key="name"
        style="overflow-x: scroll"
        flat
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

          <!--          <q-tr v-show="props.expand" :props="props" :key="`e_${props.row.index}`" class="q-virtual-scroll&#45;&#45;with-prev">-->
          <!--            <q-td colspan="100%">-->
          <!--              <div class="text-left">This is expand slot for row above: {{ props.row.name }} (Index: {{ props.row.index }}).</div>-->
          <!--            </q-td>-->
          <!--          </q-tr>-->
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
  username: "",
  referrerId: ""
});
const referralName = ref("");

const loading = ref(false);

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
  {
    label: t("earnMoney.teamManagement.table.downlineMember"),
    name: "totalDownlineCount",
    field: "totalDownlineCount",
    align: "center"
  },
  {
    label: t("earnMoney.teamManagement.table.todayRegCount"),
    name: "todayRegCount",
    field: "todayRegCount",
    align: "center"
  },
  {
    label: t("earnMoney.teamManagement.table.ytdRegCount"),
    name: "yesterdayRegCount",
    field: "yesterdayRegCount",
    align: "center"
  }

  // { label: t("earnMoney.teamManagement.table.downlineDepositMember"), name: "downlineDepositMember", field: "downlineDepositMember", align: "center" },
  // { label: t("earnMoney.teamManagement.table.vip"), name: "vip", field: "vip", align: "center" },
  // { label: t("earnMoney.teamManagement.table.balance"), name: "balance", field: "balance", align: "center" },
  // { label: t("earnMoney.teamManagement.table.lastLogin"), name: "lastLogin", field: "lastLogin", align: "center" },
  // { label: t("earnMoney.teamManagement.table.lastDeposit"), name: "lastDeposit", field: "lastDeposit", align: "center" },
  // { label: t("earnMoney.teamManagement.table.uplineLoginName"), name: "uplineLoginName", field: "uplineLoginName", align: "center" }
]);

const searchByReferral = (props) => {
  form.value.username = "";
  form.value.referrerId = props.row.id;
  referralName.value = props.row.loginName;
  getDownlines();
};

const getDownlines = () => {
  const { username, startDate, endDate, referrerId } = form.value;
  loading.value = true;

  let url = `/session/downlines`;

  if (username) {
    url = `/session/downlines?loginName=${username}`;
  }
  if (referrerId) {
    url = `/session/downlines?referrerId=${referrerId}`;
  }

  tableData.value = [];
  api
    .get(url)
    // .get(`/session/downlines?loginName=${form.value.username}&regTime=${form.value.startDate}&regTime=${form.value.endDate}`)
    .then((response) => {
      loading.value = false;
      if (response.code === 0) {
        tableData.value = response.data.records;
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
  getDownlines();
};

const handleSubmit = () => {
  form.value.referrerId = "";
  referralName.value = "";
  getDownlines();
};

onMounted(() => {
  getDownlines();
});
</script>
<style scoped lang="scss" src="../../css/page/earnMoney.scss"></style>
