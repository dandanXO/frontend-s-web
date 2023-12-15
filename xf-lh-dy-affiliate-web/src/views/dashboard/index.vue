<template>
  <div class="roles-main">
    <el-row>
      <el-col v-loading="uiControl.profitLoading">
        <div class="clearfix">
          <span class="role-span htitle">
            {{ $t('fields.monthlyMemberCommission') }}
          </span>
        </div>
        <el-row :gutter="20" class="profit-summary">
          <el-card class="box-card">
            <div class="total">
              <el-row>
                <el-col :lg="19" class="total-title">{{ t('fields.commissionRate') }}</el-col>
                <el-col :lg="5" class="total-text">
                  {{ totalCommission.commissionRate * 100 }} %
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="19" class="total-title">{{ t('fields.lastMonthTotal') }}</el-col>
                <el-col :lg="5" class="total-text">
                  $
                  <span
                    v-formatter="{
                      data: totalCommission.lastMonthTotal,
                      type: 'money',
                    }"
                  />
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="19" class="total-title">{{ t('fields.monthBeforeLastTotal') }}</el-col>
                <el-col :lg="5" class="total-text">
                  $
                  <span
                    v-formatter="{
                      data: totalCommission.monthBeforeLastTotal,
                      type: 'money',
                    }"
                  />
                </el-col>
              </el-row>
            </div>
          </el-card>
          <el-card class="box-card" :body-style="{padding: '0px 20px 20px'}">
            <template #header>
              <div class="clearfix">
                <el-icon><img src="../../assets/images/home/profit.svg"></el-icon>
                <span class="sub-title-span">{{ $t('fields.profit') }}</span>
              </div>
            </template>
            <el-row style="margin-bottom: 10px;"
                    :class="'row-data-' + index"
                    v-for="(item, index) in memberSummary"
                    :key="item.id"
            >
              <el-col :lg="16" class="total-title">{{ t('fields.' + item.time) }}</el-col>
              <el-col :lg="8" class="total-text">
                $
                <span v-formatter="{data: item.profit, type: 'money'}" />
              </el-col>
            </el-row>
          </el-card>
          <el-card class="box-card" :body-style="{padding: '0px 20px 20px'}">
            <template #header>
              <div class="clearfix">
                <el-icon><img src="../../assets/images/home/netprofit.svg"></el-icon>
                <span class="sub-title-span">{{ $t('fields.netProfit') }}</span>
              </div>
            </template>
            <el-row style="margin-bottom: 10px;"
                    :class="'row-data-' + index"
                    v-for="(item, index) in memberSummary"
                    :key="item.id"
            >
              <el-col :lg="16" class="total-title">{{ t('fields.' + item.time) }}</el-col>
              <el-col :lg="8" class="total-text">
                $
                <span v-formatter="{data: item.netProfit, type: 'money'}" />
              </el-col>
            </el-row>
          </el-card>
          <el-card class="box-card" :body-style="{padding: '0px 20px 20px'}">
            <template #header>
              <div class="clearfix">
                <el-icon><img src="../../assets/images/home/bonus.svg"></el-icon>
                <span class="sub-title-span">{{ $t('fields.bonus') }}</span>
              </div>
            </template>
            <el-row
              style="margin-bottom: 10px;"
              :class="'row-data-' + index"
              v-for="(item, index) in memberSummary"
              :key="item.id"
            >
              <el-col :lg="16" class="total-title">{{ t('fields.' + item.time) }}</el-col>
              <el-col :lg="8" class="total-text">
                $
                <span v-formatter="{data: item.bonus, type: 'money'}" />
              </el-col>
            </el-row>
          </el-card>
          <el-card class="box-card" :body-style="{padding: '0px 20px 20px'}">
            <template #header>
              <div class="clearfix">
                <el-icon><img src="../../assets/images/home/money.svg"></el-icon>
                <span class="sub-title-span">
                  {{ $t('fields.estimatedMemberCommission') }}
                </span>
              </div>
            </template>
            <el-row
              style="margin-bottom: 10px;"
              :class="'row-data-' + index"
              v-for="(item, index) in memberSummary"
              :key="item.id"
            >
              <el-col :lg="16" class="total-title">{{ t('fields.' + item.time) }}</el-col>
              <el-col :lg="8" class="total-text">
                $
                <span v-formatter="{data: item.commission, type: 'money'}" />
              </el-col>
            </el-row>
          </el-card>
          <el-card class="box-card" :body-style="{padding: '0px 20px 20px'}">
            <template #header>
              <div class="clearfix">
                <el-icon><img src="../../assets/images/home/money.svg"></el-icon>
                <span class="sub-title-span">{{ $t('fields.platformFee') }}</span>
              </div>
            </template>
            <el-row
              style="margin-bottom: 10px;"
              :class="'row-data-' + index"
              v-for="(item, index) in memberSummary"
              :key="item.id"
            >
              <el-col :lg="16" class="total-title">{{ t('fields.' + item.time) }}</el-col>
              <el-col :lg="8" class="total-text">
                $
                <span v-formatter="{data: item.platformFee, type: 'money'}" />
              </el-col>
            </el-row>
          </el-card>
          <el-card class="box-card" :body-style="{padding: '0px 20px 20px'}">
            <template #header>
              <div class="clearfix">
                <el-icon><img src="../../assets/images/home/payment.svg"></el-icon>
                <span class="sub-title-span">{{ $t('fields.paymentFee') }}</span>
              </div>
            </template>
            <el-row
              style="margin-bottom: 10px;"
              :class="'row-data-' + index"
              v-for="(item, index) in memberSummary"
              :key="item.id"
            >
              <el-col :lg="16" class="total-title">{{ t('fields.' + item.time) }}</el-col>
              <el-col :lg="8" class="total-text">
                $
                <span v-formatter="{data: item.paymentFee, type: 'money'}" />
              </el-col>
            </el-row>
          </el-card>
          <el-card class="box-card" :body-style="{padding: '0px 20px 20px'}">
            <template #header>
              <div class="clearfix">
                <el-icon><img src="../../assets/images/home/rebate.svg"></el-icon>
                <span class="sub-title-span">{{ $t('fields.rebate') }}</span>
              </div>
            </template>
            <el-row
              style="margin-bottom: 10px;"
              :class="'row-data-' + index"
              v-for="(item, index) in memberSummary"
              :key="item.id"
            >
              <el-col :lg="16" class="total-title">{{ t('fields.' + item.time) }}</el-col>
              <el-col :lg="8" class="total-text">
                $
                <span v-formatter="{data: item.rebate, type: 'money'}" />
              </el-col>
            </el-row>
          </el-card>
        </el-row>
      </el-col>
    </el-row>

    <el-row style="margin-top: 20px;" v-loading="uiControl.commissionLoading">
      <el-col>
        <div class="clearfix">
          <span class="role-span htitle">
            {{ $t('fields.monthlyAffiliateCommission') }}
          </span>
        </div>
        <el-row class="commission-summary">
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <el-icon><img src="../../assets/images/home/money.svg"></el-icon>
                <span class="sub-title-span">
                  {{ $t('fields.estimatedAffiliateCommission') }}
                </span>
              </div>
            </template>
            <el-row
              style="margin-bottom: 10px;"
              :class="'row-data-' + index"
              v-for="(item, index) in commissionSummary"
              :key="item.id"
            >
              <el-col :lg="16" class="total-title">{{ t('fields.' + item.time) }}</el-col>
              <el-col :lg="8" class="total-text">
                $
                <span
                  v-formatter="{data: item.estimatedCommission, type: 'money'}"
                />
              </el-col>
            </el-row>
          </el-card>
          <el-card
            v-if="
              affiliateLevel === 'MASTER_AFFILIATE' ||
                affiliateLevel === 'SUPER_AFFILIATE'
            "
            class="box-card"
          >
            <template #header>
              <div class="clearfix">
                <el-icon><img src="../../assets/images/home/money.svg"></el-icon>
                <span
                  v-if="affiliateLevel === 'MASTER_AFFILIATE'"
                  class="sub-title-span"
                >
                  {{ $t('fields.secondLevelAffiliateCommission') }}
                </span>
                <span
                  v-else-if="affiliateLevel === 'SUPER_AFFILIATE'"
                  class="sub-title-span"
                >
                  {{ $t('fields.thirdLevelAffiliateCommission') }}
                </span>
              </div>
            </template>
            <el-row
              style="margin-bottom: 10px;"
              :class="'row-data-' + index"
              v-for="(item, index) in commissionSummary"
              :key="item.id"
            >
              <el-col :lg="16" class="total-title">{{ t('fields.' + item.time) }}</el-col>
              <el-col :lg="8" class="total-text">
                $
                <span
                  v-formatter="{
                    data: item.secondLevelCommission,
                    type: 'money',
                  }"
                />
              </el-col>
            </el-row>
          </el-card>
          <el-card v-if="affiliateLevel === 'MASTER_AFFILIATE'" class="box-card">
            <template #header>
              <div class="clearfix">
                <el-icon><img src="../../assets/images/home/money.svg"></el-icon>
                <span class="sub-title-span">
                  {{ $t('fields.thirdLevelAffiliateCommission') }}
                </span>
              </div>
            </template>
            <el-row
              style="margin-bottom: 10px;"
              :class="'row-data-' + index"
              v-for="(item, index) in commissionSummary"
              :key="item.id"
            >
              <el-col :lg="16" class="total-title">{{ t('fields.' + item.time) }}</el-col>
              <el-col :lg="8" class="total-text">
                $
                <span
                  v-formatter="{data: item.thirdLevelCommission, type: 'money'}"
                />
              </el-col>
            </el-row>
          </el-card>
        </el-row></el-col>
    </el-row>

    <el-row style="width: 100%; margin-top: 20px;" v-loading="uiControl.opsLoading">
      <el-col>
        <div class="clearfix" style="margin-bottom: 5px;">
          <span class="role-span htitle">{{ $t('fields.operationalData') }}</span>
        </div>
        <el-card>
          <el-row class="radiorow">
            <el-radio-group
              v-model="request.queryDate"
              size="small"
              @change="loadOpsSummary"
            >
              <el-radio-button label="today">
                {{ t('fields.today') }}
              </el-radio-button>
              <el-radio-button label="thisMonth">
                {{ t('fields.thisMonth') }}
              </el-radio-button>
            </el-radio-group>
          </el-row>
          <span style="overflow: auto; width: 100%; display: block; margin: 10px auto;">
            <el-row class="ops-row-header">
              <el-col :span="4" class="total-title" />
              <el-col :span="4" align="center" class="total-title">{{ t('fields.newUsers') }}</el-col>
              <el-col :span="4" align="center" class="total-title">{{ t('fields.betMembers') }}</el-col>
              <el-col :span="4" align="center" class="total-title">{{ t('fields.firstDepositUsers') }}</el-col>
              <el-col :span="4" align="center" class="total-title">{{ t('fields.depositUsers') }}</el-col>
              <el-col :span="4" align="center" class="total-title">{{ t('fields.transferUsers') }}</el-col>
            </el-row>
            <el-row
              :class="'ops-row-data-' + index"
              v-for="(item, index) in summary"
              :key="item.id"
              style="margin-bottom: 20px;"
            >
              <el-col :span="4" class="total-title">{{ t('fields.' + item.time) }}</el-col>
              <el-col :span="4" align="center">{{ item.registerMemberCount }}</el-col>
              <el-col :span="4" align="center">{{ item.betMemberCount }}</el-col>
              <el-col :span="4" align="center">{{ item.ftdMemberCount }}</el-col>
              <el-col :span="4" align="center">{{ item.depositMemberCount }}</el-col>
              <el-col :span="4" align="center">{{ item.affiliateTransferMemberCount }}</el-col>
            </el-row>
            <el-divider />
            <el-row class="ops-row-header">
              <el-col :span="4" class="total-title" />
              <el-col :span="4" align="center" class="total-title">{{ t('fields.profit') }}</el-col>
              <el-col :span="4" align="center" class="total-title">{{ t('fields.bet') }}</el-col>
              <el-col :span="4" align="center" class="total-title">{{ t('fields.amountOfFirstDeposit') }}</el-col>
              <el-col :span="4" align="center" class="total-title">{{ t('fields.depositAmount') }}</el-col>
              <el-col :span="4" align="center" class="total-title">{{ t('fields.transferAmount') }}</el-col>
            </el-row>
            <el-row
              :class="'ops-row-data-' + index"
              v-for="(item, index) in summary"
              :key="item.id"
              style="margin-bottom: 20px;"
            >
              <el-col :span="4" class="total-title">{{ t('fields.' + item.time) }}</el-col>
              <el-col :span="4" align="center">
                $
                <span v-formatter="{data: item.profit, type: 'money'}" />
              </el-col>
              <el-col :span="4" align="center">
                $
                <span v-formatter="{data: item.bet, type: 'money'}" />
              </el-col>
              <el-col :span="4" align="center">
                $
                <span v-formatter="{data: item.ftdAmount, type: 'money'}" />
              </el-col>
              <el-col :span="4" align="center">
                $
                <span v-formatter="{data: item.depositAmount, type: 'money'}" />
              </el-col>
              <el-col :span="4" align="center">
                $
                <span
                  v-formatter="{data: item.affiliateTransferAmount, type: 'money'}"
                />
              </el-col>
            </el-row>
          </span>
        </el-card>
      </el-col>
    </el-row>
    <el-card style="margin-top: 20px;">
      <el-row>
        <el-col>
          <AnnouncementComponent />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script setup>
import { useStore } from '@/store'
import { onMounted, reactive, ref } from '@vue/runtime-core'
import moment from 'moment'
import {
  dashboardSummary,
  getMonthCommission,
  getLastMonthCommission,
  totalCommissionSummary,
  memberCommissionSummary,
  lastMemberCommissionSummary,
} from '../../api/affiliate-summary'
import { useI18n } from 'vue-i18n'
import AnnouncementComponent from '../../views/personal/announcement/index.vue'

const store = useStore()
// eslint-disable-next-line
const { t } = useI18n()
const uiControl = reactive({
  profitLoading: false,
  commissionLoading: false,
  opsLoading: false,
})
const affiliateLevel = ref(null)

const request = reactive({
  queryDate: 'today',
})

const totalCommission = reactive({
  commissionRate: 0,
  lastMonthTotal: 0,
  monthBeforeLastTotal: 0,
})

const memberSummary = reactive([
  {
    time: 'thisMonth',
    profit: 0,
    netProfit: 0,
    bonus: 0,
    commission: 0,
    platformFee: 0,
    paymentFee: 0,
    rebate: 0,
  },
])

const commissionSummary = reactive([
  {
    time: 'thisMonth',
    estimatedCommission: 0,
    secondLevelCommission: 0,
    thirdLevelCommission: 0,
  },
])

const summary = reactive([
  {
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
    affiliateTransferAmount: 0,
  },
])

async function resetSummary() {
  summary.splice(0)
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

async function loadTotalSummary() {
  const { data: ret } = await totalCommissionSummary(
    store.state.user.id,
    store.state.user.siteId
  )
  Object.keys({ ...ret }).forEach(field => {
    if (ret[field] || ret[field] === 0) {
      totalCommission[field] = ret[field]
    }
  })
}

async function loadMemberSummary() {
  uiControl.profitLoading = true
  memberSummary.splice(0)
  loadTotalSummary()

  const query = checkQuery('thisMonth')
  const { data: ret } = await memberCommissionSummary(
    store.state.user.id,
    query
  )
  const { data: subRet } = await lastMemberCommissionSummary(
    store.state.user.id,
    store.state.user.siteId
  )

  const summaryField = {}
  const subSummaryField = {}
  Object.keys({ ...ret }).forEach(field => {
    if (ret[field] || ret[field] === 0) {
      summaryField[field] = ret[field]
    }
  })
  Object.keys({ ...subRet }).forEach(field => {
    if (subRet[field] || subRet[field] === 0) {
      subSummaryField[field] = subRet[field]
    }
  })
  summaryField.time = 'thisMonth'
  subSummaryField.time = 'lastMonth'
  memberSummary.push(summaryField)
  memberSummary.push(subSummaryField)
  uiControl.profitLoading = false
}

async function loadCommissionSummary() {
  uiControl.commissionLoading = true
  commissionSummary.splice(0)

  const query = checkQuery('thisMonth')
  const { data: ret } = await getMonthCommission(store.state.user.id, query)
  const { data: subRet } = await getLastMonthCommission(
    store.state.user.id,
    store.state.user.siteId
  )

  const summaryField = {}
  const subSummaryField = {}
  Object.keys({ ...ret }).forEach(field => {
    if (ret[field] || ret[field] === 0) {
      summaryField[field] = ret[field]
    }
  })
  Object.keys({ ...subRet }).forEach(field => {
    if (subRet[field] || subRet[field] === 0) {
      subSummaryField[field] = subRet[field]
    }
  })
  summaryField.time = 'thisMonth'
  subSummaryField.time = 'lastMonth'
  commissionSummary.push(summaryField)
  commissionSummary.push(subSummaryField)
  uiControl.commissionLoading = false
}

async function loadOpsSummary() {
  uiControl.opsLoading = true
  let query = {}
  let subQuery = {}
  if (request.queryDate === 'today') {
    query = checkQuery('today')
    subQuery = checkQuery('yesterday')
  } else {
    query = checkQuery('thisMonth')
    subQuery = checkQuery('lastMonth')
  }
  const { data: ret } = await dashboardSummary(store.state.user.id, query)
  const { data: subRet } = await dashboardSummary(store.state.user.id, subQuery)
  await resetSummary()
  const summaryField = {}
  const subSummaryField = {}
  Object.keys({ ...ret }).forEach(field => {
    if (ret[field] || ret[field] === 0) {
      summaryField[field] = ret[field]
    }
  })
  Object.keys({ ...subRet }).forEach(field => {
    if (subRet[field] || subRet[field] === 0) {
      subSummaryField[field] = subRet[field]
    }
  })
  if (request.queryDate === 'today') {
    summaryField.time = 'today'
    subSummaryField.time = 'yesterday'
  } else {
    summaryField.time = 'thisMonth'
    subSummaryField.time = 'lastMonth'
  }
  summary.push(summaryField)
  summary.push(subSummaryField)
  uiControl.opsLoading = false
}

function checkQuery(dateType) {
  const query = {}
  query.siteId = store.state.user.siteId
  const end = new Date()
  const start = new Date()
  if (dateType === 'today') {
    query.recordTime = [convertDate(start), convertDate(end)].join(',')
  } else if (dateType === 'yesterday') {
    start.setTime(
      moment(start)
        .subtract(1, 'days')
        .format('x')
    )
    end.setTime(
      moment(end)
        .subtract(1, 'days')
        .format('x')
    )
    query.recordTime = [convertDate(start), convertDate(end)].join(',')
  } else if (dateType === 'thisMonth') {
    start.setTime(
      moment(start)
        .startOf('month')
        .format('x')
    )
    query.recordTime = [convertDate(start), convertDate(end)].join(',')
  } else if (dateType === 'lastMonth') {
    start.setTime(
      moment(start)
        .subtract(1, 'months')
        .startOf('month')
        .format('x')
    )
    end.setTime(
      moment(end)
        .subtract(1, 'months')
        .endOf('month')
        .format('x')
    )
    query.recordTime = [convertDate(start), convertDate(end)].join(',')
  }
  return query
}

onMounted(() => {
  affiliateLevel.value = store.state.user.affiliateLevel
  loadMemberSummary()
  loadCommissionSummary()
  loadOpsSummary()
})
</script>

<style scoped>
.el-card {
  border: 0;
  box-shadow: none;
}
.htitle {
  font-size: 30px;
  font-weight: bold;
}
.sub-title-span {
  font-weight: bold;
}
.profit-summary {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.profit-summary .box-card {
  flex: 1;
  flex-wrap: wrap;
  box-shadow: none;
  border: 0;
}

.total {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 10px;
  /* border-left: 3px solid #f56c6c; */
  padding-left: 10px;
}

.total-title {
  color: #7D8592;
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 5px;
}
.total-text {
  color: #3F8CFF;
  /* font-weight: bold; */
  font-size: 16px;
  font-weight: normal;
}

.commission-summary {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.commission-summary .box-card {
  flex: 1;
  flex-wrap: wrap;
}

.box-card i {
  display: flex;
  justify-content: center;
  align-items: center;
  /* font-size: 50px;
  border-radius: 5px;
  padding: 10px;
  width: 80px;
  height: 80px; */
}
.box-card .el-card__header .clearfix {
  display: flex;
  align-items: center;
  gap: 10px;
}
.box-card .el-card__header .clearfix .el-icon {
  width: 20px;
  height: 20px;
}
.box-card .el-icon img {
  width: 100%;
  display: block;
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
.radiorow {
  overflow: auto;justify-content: flex-end
}
.ops-row-header {
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  line-height: 20px;
  margin-bottom: 10px;
  min-width: 800px;
}

.ops-row-data-0 {
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  font-weight: bold;
  min-width: 800px;
}

.ops-row-data-1 {
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  font-weight: bold;
  color: var(--el-text-color-regular);
  min-width: 800px;
}

.role-span {
  font-weight: bold;
}

@media (max-width: 1200px) {
  .profit-summary {
    grid-template-columns: repeat(2, 1fr);
  }
  .commission-summary {
    grid-template-columns: repeat(1, 1fr);
  }

  .column {
    margin-top: 20px;
  }
}
@media (max-width: 500px) {
  .profit-summary {
    grid-template-columns: repeat(1, 1fr);
  }
  .role-span {
    font-size: 18px;
  }
}
</style>

<style>
  .role-span {
    font-size: 30px;
    color: #0A1629;
    font-weight: bold;
  }
  .el-radio-group {
    background: #F4F9FD;
    padding: 2px;
    border-radius: 20px;
  }
  .el-radio-button .el-radio-button__inner {
    background: #F4F9FD;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 20px 0 0 20px;
    border: 0;
  }
  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0 20px 20px 0;
    border: 0;
  }
  .el-loading-mask {
    background: rgb(243 248 252 / 90%) !important;
  }
  @media (max-width: 500px) {
    .role-span {
      font-size: 18px;
    }
  }
</style>
