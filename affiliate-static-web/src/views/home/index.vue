<template>
  <div class="roles-main">
    <el-card style="margin-top: 20px;" v-loading="uiControl.commissionLoading">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.monthlyAffiliateCommission') }}</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card>
            <template #header>
              <div class="clearfix">
                <span class="role-span">{{ $t('fields.estimatedAffiliateCommission') }}</span>
              </div>
            </template>
            <el-row :class="'row-data-' + index" v-for="(item, index) in commissionSummary" :key="item.id">
              <el-col :span="16">{{ t('fields.' + item.time) }}</el-col>
              <el-col :span="8">$ <span v-formatter="{data: item.estimatedCommission,type: 'money'}" /></el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="8" v-if="affiliateLevel === 'MASTER_AFFILIATE' || affiliateLevel === 'SUPER_AFFILIATE'">
          <el-card>
            <template #header>
              <div class="clearfix">
                <span v-if="affiliateLevel === 'MASTER_AFFILIATE'" class="role-span">{{ $t('fields.secondLevelAffiliateCommission') }}</span>
                <span v-else-if="affiliateLevel === 'SUPER_AFFILIATE'" class="role-span">{{ $t('fields.thirdLevelAffiliateCommission') }}</span>
              </div>
            </template>
            <el-row :class="'row-data-' + index" v-for="(item, index) in commissionSummary" :key="item.id">
              <el-col :span="16">{{ t('fields.' + item.time) }}</el-col>
              <el-col :span="8">$ <span v-formatter="{data: item.secondLevelCommission,type: 'money'}" /></el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="8" v-if="affiliateLevel === 'MASTER_AFFILIATE'">
          <el-card>
            <template #header>
              <div class="clearfix">
                <span class="role-span">{{ $t('fields.thirdLevelAffiliateCommission') }}</span>
              </div>
            </template>
            <el-row :class="'row-data-' + index" v-for="(item, index) in commissionSummary" :key="item.id">
              <el-col :span="16">{{ t('fields.' + item.time) }}</el-col>
              <el-col :span="8">$ <span v-formatter="{data: item.thirdLevelCommission,type: 'money'}" /></el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top: 20px;" v-loading="uiControl.opsLoading">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.operationalData') }}</span>
        </div>
      </template>
      <el-row style="float: right; margin-bottom: 20px;">
        <el-radio-group v-model="request.queryDate" size="small" @change="loadOpsSummary">
          <el-radio-button label="today">{{ t('fields.today') }}</el-radio-button>
          <el-radio-button label="thisMonth">{{ t('fields.thisMonth') }}</el-radio-button>
        </el-radio-group>
      </el-row>
      <el-row class="ops-row-header">
        <el-col :span="4" />
        <el-col :span="4">{{ t('fields.newUsers') }}</el-col>
        <el-col :span="4">{{ t('fields.betMembers') }}</el-col>
        <el-col :span="4">{{ t('fields.firstDepositUsers') }}</el-col>
        <el-col :span="4">{{ t('fields.depositUsers') }}</el-col>
        <el-col :span="4">{{ t('fields.transferUsers') }}</el-col>
      </el-row>
      <el-row :class="'ops-row-data-' + index" v-for="(item, index) in summary" :key="item.id">
        <el-col :span="4">{{ t('fields.' + item.time) }}</el-col>
        <el-col :span="4">{{ item.registerMemberCount }}</el-col>
        <el-col :span="4">{{ item.betMemberCount }}</el-col>
        <el-col :span="4">{{ item.ftdMemberCount }}</el-col>
        <el-col :span="4">{{ item.depositMemberCount }}</el-col>
        <el-col :span="4">{{ item.affiliateTransferMemberCount }}</el-col>
      </el-row>
      <el-divider />
      <el-row class="ops-row-header">
        <el-col :span="4" />
        <el-col :span="4">{{ t('fields.profit') }}</el-col>
        <el-col :span="4">{{ t('fields.bet') }}</el-col>
        <el-col :span="4">{{ t('fields.amountOfFirstDeposit') }}</el-col>
        <el-col :span="4">{{ t('fields.depositAmount') }}</el-col>
        <el-col :span="4">{{ t('fields.transferAmount') }}</el-col>
      </el-row>
      <el-row :class="'ops-row-data-' + index" v-for="(item, index) in summary" :key="item.id">
        <el-col :span="4">{{ t('fields.' + item.time) }}</el-col>
        <el-col :span="4">$ <span v-formatter="{data: item.profit,type: 'money'}" /></el-col>
        <el-col :span="4">$ <span v-formatter="{data: item.bet,type: 'money'}" /></el-col>
        <el-col :span="4">$ <span v-formatter="{data: item.ftdAmount,type: 'money'}" /></el-col>
        <el-col :span="4">$ <span v-formatter="{data: item.depositAmount,type: 'money'}" /></el-col>
        <el-col :span="4">$ <span v-formatter="{data: item.affiliateTransferAmount,type: 'money'}" /></el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import { onMounted, reactive, ref } from '@vue/runtime-core'
import moment from 'moment'
import { dashboardSummary, getMonthCommission, getLastMonthCommission } from '../../api/affiliate-summary'
import { useI18n } from "vue-i18n";
const store = useStore();
// eslint-disable-next-line
const { t } = useI18n();
const uiControl = reactive({
  commissionLoading: false,
  opsLoading: false
});
const affiliateLevel = ref(null);

const request = reactive({
  queryDate: 'today'
});

const commissionSummary = reactive([{
  time: 'thisMonth',
  estimatedCommission: 0,
  secondLevelCommission: 0,
  thirdLevelCommission: 0
}]);

const summary = reactive([{
  time: 'today',
  id: 0,
  registerMemberCount: 0,
  betMemberCount: 0,
  ftdMemberCount: 0,
  depositMemberCount: 0,
  affiliateTransferMemberCount: 0,
  profit: 0,
  bet: 0,
  ftdAmount: 0,
  depositAmount: 0,
  affiliateTransferAmount: 0
}]);

async function resetSummary() {
  summary.splice(0);
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

async function loadCommissionSummary() {
  uiControl.commissionLoading = true;
  commissionSummary.splice(0);

  const query = checkQuery('thisMonth');
  const { data: ret } = await getMonthCommission(store.state.user.id, query);
  const { data: subRet } = await getLastMonthCommission(store.state.user.id, store.state.user.siteId);

  const summaryField = {};
  const subSummaryField = {};
  Object.keys({ ...ret }).forEach(field => {
    if (ret[field] || ret[field] === 0) {
      summaryField[field] = ret[field];
    }
  });
  Object.keys({ ...subRet }).forEach(field => {
    if (subRet[field] || subRet[field] === 0) {
      subSummaryField[field] = subRet[field];
    }
  });
  summaryField.time = 'thisMonth';
  subSummaryField.time = 'lastMonth';
  commissionSummary.push(summaryField);
  commissionSummary.push(subSummaryField);
  uiControl.commissionLoading = false;
}

async function loadOpsSummary() {
  uiControl.opsLoading = true;
  let query = {};
  let subQuery = {};
  if (request.queryDate === 'today') {
    query = checkQuery('today');
    subQuery = checkQuery('yesterday');
  } else {
    query = checkQuery('thisMonth');
    subQuery = checkQuery('lastMonth');
  }
  const { data: ret } = await dashboardSummary(store.state.user.id, query);
  const { data: subRet } = await dashboardSummary(store.state.user.id, subQuery);
  await resetSummary();
  const summaryField = {};
  const subSummaryField = {};
  Object.keys({ ...ret }).forEach(field => {
    if (ret[field] || ret[field] === 0) {
      summaryField[field] = ret[field];
    }
  });
  Object.keys({ ...subRet }).forEach(field => {
    if (subRet[field] || subRet[field] === 0) {
      subSummaryField[field] = subRet[field];
    }
  });
  if (request.queryDate === 'today') {
    summaryField.time = 'today';
    subSummaryField.time = 'yesterday';
  } else {
    summaryField.time = 'thisMonth';
    subSummaryField.time = 'lastMonth';
  }
  summary.push(summaryField);
  summary.push(subSummaryField);
  uiControl.opsLoading = false;
}

function checkQuery(dateType) {
  const query = {};
  query.siteId = store.state.user.siteId;
  const end = new Date();
  const start = new Date();
  if (dateType === 'today') {
    query.recordTime = [convertDate(start), convertDate(end)].join(",");
  } else if (dateType === 'yesterday') {
    start.setTime(moment(start).subtract(1, 'days').format('x'));
    end.setTime(moment(end).subtract(1, 'days').format('x'));
    query.recordTime = [convertDate(start), convertDate(end)].join(",");
  } else if (dateType === 'thisMonth') {
    start.setTime(moment(start).startOf('month').format('x'));
    query.recordTime = [convertDate(start), convertDate(end)].join(",");
  } else if (dateType === 'lastMonth') {
    start.setTime(moment(start).subtract(1, 'months').startOf('month').format('x'));
    end.setTime(moment(end).subtract(1, 'months').endOf('month').format('x'));
    query.recordTime = [convertDate(start), convertDate(end)].join(",");
  }
  return query;
}

onMounted(() => {
  loadCommissionSummary()
  loadOpsSummary();
  affiliateLevel.value = store.state.user.affiliateLevel;
  console.log(store.state.user.affiliateLevel)
})
</script>

<style scoped>
.summary {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.summary .box-card {
  flex: 1;
  flex-wrap: wrap;
}

.box-card i {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  border-radius: 5px;
  padding: 10px;
  width: 80px;
  height: 80px;
}

.card-panel-description {
  font-weight: 700;
  margin-left: 0;
}

.card-panel-description .card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
  text-align: right;
}

.card-panel-description .card-panel-link-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}

.card-panel-description .card-panel-num {
  font-size: 20px;
  float: right;
}

.row-data-0 {
  width: 100%;
  font-weight: bold;
}

.row-data-1 {
  width: 100%;
  font-weight: bold;
  color: var(--el-text-color-regular);
}

.ops-row-header {
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  line-height: 40px;
}

.ops-row-data-0 {
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  font-weight: bold;
}

.ops-row-data-1 {
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  font-weight: bold;
  color: var(--el-text-color-regular);
}

.role-span {
  font-weight: bold;
}

@media (max-width: 1200px) {
  .affiliate-info {
    grid-template-columns: repeat(1, 1fr);
  }

  .column {
    margin-top: 20px;
  }
}
</style>
