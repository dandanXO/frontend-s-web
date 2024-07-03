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
        <a-checkbox v-for="(option, index) in dateOptions" :key="index" :value="option.value">
          {{ option.label }}
        </a-checkbox>
      </a-checkbox-group>

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
        allowClear
        v-model:value="form.username"
        :placeholder="$t('rewardView.profitAndLoss.searchField.username.placeholder')"
      />

      <a-button @click="handleSubmit">{{ $t("rewardView.profitAndLoss.searchField.searchButton") }}</a-button>
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
              <td colspan="8" height="60"><a-spin /></td>
            </tr>
          </template>
          <template v-else>
            <template v-if="tableData.length > 0">
              <tr v-for="(row, rowIndex) in tableData" :key="`row-${rowIndex}`">
                <td v-for="(header, colIndex) in tableHeaders" :key="`row-${rowIndex}-${colIndex}`">
                  <span v-if="header.key === 'loginName'">
                    <span class="span-username" @click="searchByReferral(row)">{{ row[header.key] }}</span>
                  </span>

                  <span
                    v-else-if="
                      [
                        'downlineDepositAmount',
                        'downlineFtdAmount',
                        'downlineWithdrawAmount',
                        'downlineBetAmount',
                        'downlinePayoutAmount'
                      ].includes(header.key)
                    "
                    :class="header.key === 'balance' ? row.type : ''"
                  >
                    {{ addThousandsComma(row[header.key], true) }}
                  </span>
                  <span v-else-if="header.key === 'rebate'">
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
                <td colspan="8">No data</td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>

    <div class="sum-wrapper">
      <div class="sum-item">
        <div class="item-amount">
          Rs
          <span>{{ addThousandsComma(sumsData.downlineBetAmount, true) }}</span>
        </div>
        <div class="item-title">{{ $t("rewardView.profitAndLoss.sums.betAmount") }}</div>
      </div>

      <div class="sum-item">
        <div class="item-amount">
          Rs
          <span>{{ addThousandsComma(sumsData.downlineDepositCount, true) }}</span>
        </div>
        <div class="item-title">{{ $t("rewardView.profitAndLoss.sums.deposit") }}</div>
      </div>

      <div class="sum-item">
        <div class="item-amount">
          <span>{{ sumsData.downlinePayoutAmount }}</span>
        </div>
        <div class="item-title">{{ $t("rewardView.profitAndLoss.sums.depositCount") }}</div>
      </div>

      <div class="sum-item">
        <div class="item-amount">
          Rs
          <span>{{ addThousandsComma(sumsData.downlineDepositAmount, true) }}</span>
        </div>
        <div class="item-title">{{ $t("rewardView.profitAndLoss.sums.payout") }}</div>
      </div>

      <div class="sum-item">
        <div class="item-amount">
          Rs
          <span>{{ addThousandsComma(sumsData.downlineWithdrawAmount, true) }}</span>
        </div>
        <div class="item-title">{{ $t("rewardView.profitAndLoss.sums.withdraw") }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import moment from "moment";
import { DATE_FORMAT } from "@/constant/format";
import { useI18n } from "vue-i18n";
import { useSingleCheckbox } from "@/hooks/singleCheckbox";
import { addThousandsComma, updateDate } from "@/utils/utils";
import { getDownlineProfitSummaryAPI } from "@/api/personal/reward";
import { CloseOutlined } from "@ant-design/icons-vue";

const { t } = useI18n();
const { selectedValue, handleCheckedChange } = useSingleCheckbox("today", (value) => handleDateSelect(value));

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
  referrerId: "",
  siteId: ""
});

const isLoading = ref(false);
const referralName = ref("");

const dateOptions = computed(() => [
  { label: t("rewardView.profitAndLoss.searchField.date.today"), value: "today" },
  { label: t("rewardView.profitAndLoss.searchField.date.yesterday"), value: "yesterday" },
  { label: t("rewardView.profitAndLoss.searchField.date.7day"), value: "7days" }
]);

const tableHeaders = computed(() => [
  { label: t("rewardView.profitAndLoss.table.username"), key: "loginName" },
  { label: t("rewardView.profitAndLoss.table.deposit"), key: "downlineDepositAmount" },
  { label: t("rewardView.profitAndLoss.table.depositCount"), key: "downlineDepositCount" },
  { label: t("rewardView.profitAndLoss.table.ftdAmount"), key: "downlineFtdAmount" },
  { label: t("rewardView.profitAndLoss.table.ftdCount"), key: "downlineFtdCount" },
  { label: t("rewardView.profitAndLoss.table.withdraw"), key: "downlineWithdrawAmount" },
  { label: t("rewardView.profitAndLoss.table.bet"), key: "downlineBetAmount" },
  { label: t("rewardView.profitAndLoss.table.payout"), key: "downlinePayoutAmount" }
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
  form.value.referrerId = props.id;
  referralName.value = props.loginName;
  getDownlineProfitSummary();
};

const closeReferral = () => {
  referralName.value = "";
  form.value.referrerId = "";
  getDownlineProfitSummary();
};

const getDownlineProfitSummary = () => {
  const { username, startDate, endDate, referrerId, siteId } = form.value;
  isLoading.value = true;

  let paramString = `siteId=${siteId}&recordTime=${startDate}&recordTime=${endDate}`;

  if (username) {
    paramString = `siteId=${siteId}&loginName=${username}&recordTime=${startDate}&recordTime=${endDate}`;
  }
  if (referrerId) {
    paramString = `siteId=${siteId}&referrerId=${referrerId}&recordTime=${startDate}&recordTime=${endDate}`;
  }

  tableData.value = [];

  getDownlineProfitSummaryAPI(paramString)
    .then((response) => {
      if (response.code === 0) {
        tableData.value = response.data.records;
        sumsData.value = response.data.sums;
        isLoading.value = false;
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const handleSubmit = () => {
  getDownlineProfitSummary();
};

onMounted(() => {
  getDownlineProfitSummary();
});
</script>
<style scoped lang="scss" src="@/assets/css/pages/reward.scss" />
