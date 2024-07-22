<template>
  <div class="team-management-wrapper">
    <div class="search-field">
      <!-- <div class="search-field__date-range">
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
      </div> -->

      <!-- <a-checkbox-group v-model:value="selectedValue" name="downLine" @change="handleCheckedChange">
        <a-checkbox v-for="(option, index) in downLineOptions" :key="index" :value="option.value">
          {{ option.label }}
        </a-checkbox>
      </a-checkbox-group> -->

      <div class="search-field__spacer" />
      <div class="referral-name-search" v-if="referralName">
        Referral:
        <span class="span-username">{{ referralName }}</span>
        &nbsp;

        <a-button class="referral-close-btn" shape="circle" size="xs" @click="closeReferral()">
          <CloseOutlined size="xs" />
        </a-button>
      </div>
      <a-input
        v-else
        style="max-width: 400px; margin-right: 20px"
        v-model:value="form.username"
        :placeholder="$t('rewardView.teamManagement.searchField.username.placeholder')"
        allowClear
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
          <template v-if="isLoading">
            <tr>
              <td colspan="9" height="60"><a-spin /></td>
            </tr>
          </template>
          <template v-else>
            <template v-if="tableData.length > 0">
              <tr v-for="(row, rowIndex) in tableData" :key="`row-${rowIndex}`">
                <td v-for="(header, colIndex) in tableHeaders" :key="`row-${rowIndex}-${colIndex}`">
                  <span v-if="header.key === 'loginName'">
                    <span class="span-username" @click="searchByReferral(row)">{{ row[header.key] }}</span>
                  </span>

                  <span v-else-if="header.key === 'balance'">
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
            </template>
            <template v-else>
              <tr>
                <td colspan="9">No data</td>
              </tr>
            </template>
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
import { addThousandsComma } from "@/utils/utils";
import { getDownlinesAPI } from "@/api/personal/reward";
import { CloseOutlined } from "@ant-design/icons-vue";

const { t } = useI18n();
const { selectedValue, handleCheckedChange } = useSingleCheckbox("ALL");

const tableData = ref([]);
const form = ref({
  startDate: moment().format(DATE_FORMAT),
  endDate: moment().format(DATE_FORMAT),
  username: "",
  referrerId: "",
  siteId: ""
});

const isLoading = ref(false);
const referralName = ref();

const downLineOptions = computed(() => [
  { label: t("rewardView.teamManagement.searchField.downLine.all"), value: "ALL" },
  { label: t("rewardView.teamManagement.searchField.downLine.direct"), value: "DIRECT" }
]);

const tableHeaders = computed(() => [
  { label: t("rewardView.teamManagement.table.username"), key: "loginName" },
  { label: t("rewardView.teamManagement.table.registrationDate"), key: "regTime" },
  { label: t("rewardView.teamManagement.table.downlineMember"), key: "totalDownlineCount" },
  { label: t("rewardView.teamManagement.table.todayRegistercount"), key: "todayRegCount" },
  { label: t("rewardView.teamManagement.table.yesterdayRegisterCount"), key: "yesterdayRegCount" }
]);

const getDownlines = () => {
  const { username, startDate, endDate, referrerId, siteId } = form.value;
  isLoading.value = true;

  let paramString = `siteId=${siteId}`;

  if (username) {
    paramString = `siteId=${siteId}&loginName=${username}`;
  }
  if (referrerId) {
    paramString = `siteId=${siteId}&referrerId=${referrerId}`;
  }

  tableData.value = [];

  getDownlinesAPI(paramString)
    .then((response) => {
      if (response.code === 0) {
        tableData.value = response.data.records;
        isLoading.value = false;
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const searchByReferral = (props) => {
  form.value.username = "";
  form.value.referrerId = props.id;
  referralName.value = props.loginName;
  getDownlines();
};

const handleSubmit = () => {
  form.value.referrerId = "";
  referralName.value = "";
  getDownlines();
};

const closeReferral = () => {
  referralName.value = "";
  form.value.referrerId = "";
  getDownlines();
};

onMounted(() => {
  getDownlines();
});
</script>
<style scoped lang="scss" src="@/assets/css/pages/reward.scss" />
