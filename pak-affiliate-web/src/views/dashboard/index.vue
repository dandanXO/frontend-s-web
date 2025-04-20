<template>
  <div class="page-container">
    <AffiliateAnnouncement />
    <el-row>
      <el-col>
        <div class="clearfix" style="margin-bottom: 5px;margin-top: 10px;">
          <span class="role-span htitle">
            {{ $t('fields.dashboard_title') }}
          </span>
        </div>

        <el-card>
          <el-row class="dashboard-row" style="margin-top: 10px">
            <el-col :span="6" class="dashboard-col">
              <div class="number-span">
                {{ formatCommaAmt(dashboard.downlineAffiliateCount) }}
              </div>
              <div class="title-span">
                {{ $t('fields.total_downline_count') }}
              </div>
            </el-col>
            <el-col :span="6" class="dashboard-col">
              <div class="number-span">
                {{ formatCommaAmt(dashboard.directDownlineMemberCount) }}
              </div>
              <div class="title-span">
                {{ $t('fields.total_straight_count') }}
              </div>
            </el-col>
            <el-col :span="6" class="dashboard-col">
              <div class="number-span">
                {{ formatCommaAmt(dashboard.totalDownlineMemberCount) }}
              </div>
              <div class="title-span">
                {{ $t('fields.total_member_count') }}
              </div>
            </el-col>

            <el-col :span="6" class="dashboard-col">
              <div class="number-span">
                <el-link
                  type="primary"
                  class="number-span"
                  @click="openDialog('FUNDS')"
                >
                  {{ formatCommaAmt(dashboard.totalBalance) }}
                </el-link>
              </div>
              <div class="title-span">
                {{ $t('fields.total_remaining_amt') }}
              </div>
            </el-col>
          </el-row>

          <div class="search" style="margin-top: 10px;">
            <el-date-picker
              v-model="formData.recordTime"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator=":"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
              style="width: 300px; margin-left: 10px"
              :shortcuts="shortcuts"
              :disabled-date="disabledDate"
              :editable="false"
              :clearable="false"
            />
            <el-button
              style="margin-left: 20px"
              icon="el-icon-search"
              size="mini"
              type="success"
              @click="loadDashboardData()"
            >
              {{ t('fields.search') }}
            </el-button>
          </div>

          <el-row class="dashboard-listing">
            <div class="listing-div">
              <div class="title-span">
                {{ $t('fields.total_deposit_amt') }}
              </div>
              <div class="item-span">
                {{ formatCommaAmt(dashboard.depositAmount) }}
              </div>
            </div>

            <div class="listing-div">
              <div class="title-span">
                {{ $t('fields.total_withdraw_amt') }}
              </div>
              <div class="item-span">
                {{ formatCommaAmt(dashboard.withdrawAmount) }}
              </div>
            </div>
            <div class="listing-div">
              <div class="title-span">{{ $t('fields.total_sum_amt') }}</div>
              <div class="item-span">
                {{
                  formatCommaAmt(
                    dashboard.depositAmount - dashboard.withdrawAmount
                  )
                }}
              </div>
            </div>
            <div class="listing-div">
              <div class="title-span">
                {{ $t('fields.total_privilege_amt') }}
              </div>
              <div class="item-span">
                {{ formatCommaAmt(dashboard.bonusPoint) }}
              </div>
            </div>

            <div class="listing-div">
              <div class="title-span">
                {{ $t('fields.total_validbet_amt') }}
              </div>
              <div class="item-span">
                {{ formatCommaAmt(dashboard.validBet) }}
              </div>
            </div>
            <div class="listing-div">
              <div class="title-span">{{ $t('fields.total_losewin_amt') }}</div>
              <div class="item-span">
                {{ formatCommaAmt(dashboard.totalWin) }}
              </div>
            </div>

            <div class="listing-div">
              <div class="title-span">
                {{ $t('fields.total_deposit_count') }}
              </div>
              <div class="item-span">
                <el-link
                  type="primary"
                  style="font-size:medium"
                  @click="openDialog('DEPOSIT')"
                >
                  {{ formatCommaAmt(recordsDetail.depositRecords.length) }}
                </el-link>
              </div>
            </div>
            <div class="listing-div">
              <div class="title-span">
                {{ $t('fields.total_withdraw_count') }}
              </div>
              <el-link
                type="primary"
                style="font-size:medium"
                @click="openDialog('WITHDRAW')"
              >
                {{ formatCommaAmt(recordsDetail.withdrawalRecords.length) }}
              </el-link>
            </div>
            <div class="listing-div">
              <div class="title-span">{{ $t('fields.total_bet_count') }}</div>
              <div class="item-span">
                <el-link
                  type="primary"
                  style="font-size:medium"
                  @click="openDialog('BET')"
                >
                  {{ formatCommaAmt(recordsDetail.betRecords.length) }}
                </el-link>
              </div>
            </div>
          </el-row>
        </el-card>
        <el-dialog
          :title="uiControl.dialogTitle"
          v-model="uiControl.dialogVisible"
          modal-class="dialog900"
          width="90%"
        >
          <div class="scrollable-container" v-loading="uiControl.dialogLoading">
            <div>
              <table class="custom-table">
                <thead v-if="uiControl.dialogType !== 'FUNDS'">
                  <tr>
                    <th scope="col">{{ t('fields.affiliate') }}</th>
                    <th scope="col">{{ t('fields.affiliateLevel') }}</th>
                    <th scope="col">{{ t('fields.member') }}</th>
                    <th scope="col">{{ uiControl.dialogThirdCol }}</th>
                    <th scope="col">{{ uiControl.dialogLastCol }}</th>
                    <th scope="col" v-if="uiControl.dialogType === 'DEPOSIT'">{{ t('fields.dashboardMemberBalance') }}</th>
                    <th scope="col" v-if="uiControl.dialogType === 'DEPOSIT'">{{ t('fields.totalWithdrawalAmount') }}</th>
                  </tr>
                </thead>
                <tbody v-if="uiControl.dialogType === 'DEPOSIT'">
                  <tr v-if="recordsDetail.depositRecords.length === 0">
                    <td colspan="7">
                      <!-- Display your empty component or message here -->
                      <emptyComp />
                    </td>
                  </tr>
                  <tr
                    v-for="(record, index) in recordsDetail.depositRecords"
                    :key="index"
                  >
                    <td>{{ record.affiliate }}</td>
                    <td>
                      {{ record.affiliateLevel !== '-' ? t(`affiliate.level.${record.affiliateLevel}`) : '-' }}
                    </td>
                    <td>
                      {{ record.member }}
                    </td>
                    <td>
                      {{ formatCommaAmt(record.deposit) }}
                    </td>
                    <td>
                      {{ formatCommaAmt(record.depositCount) }}
                    </td>
                    <td>
                      {{ formatCommaAmt(record.balance) }}
                    </td>
                    <td>
                      {{ formatCommaAmt(record.withdraw) }}
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="uiControl.dialogType === 'WITHDRAW'">
                  <tr v-if="recordsDetail.withdrawalRecords.length === 0">
                    <td colspan="5">
                      <!-- Display your empty component or message here -->
                      <emptyComp />
                    </td>
                  </tr>
                  <tr
                    v-for="(record, index) in recordsDetail.withdrawalRecords"
                    :key="index"
                  >
                    <td>{{ record.affiliate }}</td>
                    <td>
                      {{ record.affiliateLevel !== '-' ? t(`affiliate.level.${record.affiliateLevel}`) : '-' }}
                    </td>
                    <td>
                      {{ record.member }}
                    </td>
                    <td>
                      {{ formatCommaAmt(record.withdraw) }}
                    </td>
                    <td>
                      {{ formatCommaAmt(record.withdrawCount) }}
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="uiControl.dialogType === 'BET'">
                  <tr v-if="recordsDetail.betRecords.length === 0">
                    <td colspan="5">
                      <!-- Display your empty component or message here -->
                      <emptyComp />
                    </td>
                  </tr>
                  <tr
                    v-for="(record, index) in recordsDetail.betRecords"
                    :key="index"
                  >
                    <td>{{ record.affiliate }}</td>
                    <td>
                      {{ record.affiliateLevel !== '-' ? t(`affiliate.level.${record.affiliateLevel}`) : '-' }}
                    </td>
                    <td>
                      {{ record.member }}
                    </td>
                    <td>
                      {{ formatCommaAmt(record.bet) }}
                    </td>
                    <td>
                      {{ formatCommaAmt(record.betCount) }}
                    </td>
                  </tr>
                </tbody>
                <thead v-if="uiControl.dialogType === 'FUNDS'">
                  <tr>
                    <th scope="col">{{ t('fields.member') }}</th>
                    <th scope="col">{{ t('fields.balance') }}</th>
                    <th scope="col">{{ t('fields.depositAmount') }}</th>
                    <th scope="col">{{ t('fields.withdrawAmount') }}</th>
                  </tr>
                </thead>
                <tbody v-if="uiControl.dialogType === 'FUNDS'">
                  <tr v-if="dashboard.memberFunds.length === 0">
                    <td colspan="4">
                      <!-- Display your empty component or message here -->
                      <emptyComp />
                    </td>
                  </tr>
                  <tr
                    v-for="(record, index) in dashboard.memberFunds"
                    :key="index"
                  >
                    <td>{{ record.member }}</td>
                    <td>
                      {{ formatCommaAmt(record.balance) }}
                    </td>
                    <td>
                      {{ formatCommaAmt(record.deposit) }}
                    </td>
                    <td>
                      {{ formatCommaAmt(record.withdraw) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { useStore } from '@/store'
import { onMounted, reactive, ref } from '@vue/runtime-core'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getAffiliateInfo } from '../../api/affiliate'
import { getAffiliateDashboardData, getDashboardDataDetail } from '../../api/affiliate-report'
import emptyComp from '@/components/empty'
import AffiliateAnnouncement from '@/components/affiliate-announcement';

const store = useStore()
const router = useRouter()
// eslint-disable-next-line
const { t } = useI18n()
const uiControl = reactive({
  profitLoading: false,
  commissionLoading: false,
  opsLoading: false,
  dialogVisible: false,
  dialogTitle: '',
  dialogLoading: false,
  dialogThirdCol: '',
  dialogLastCol: '',
})

const defaultStartDate = convertDate(new Date())
const defaultEndDate = convertDate(new Date())
const formData = reactive({
  recordTime: [defaultStartDate, defaultEndDate],
})

const dashboard = reactive({
  downlineAffiliateCount: 0,
  directDownlineMemberCount: 0,
  totalDownlineMemberCount: 0,
  depositMemberCount: 0,
  withdrawMemberCount: 0,
  betMemberCount: 0,
  depositAmount: 0,
  withdrawAmount: 0,
  bonusPoint: 0,
  totalBalance: 0,
  validBet: 0,
  totalWin: 0,
  memberFunds: []
})

const recordsDetail = reactive({
  depositRecords: [],
  withdrawalRecords: [],
  betRecords: [], 
})

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

const shortcuts = [
  {
    text: '오늘',
    value: () => {
      const end = new Date()
      const start = new Date()
      return [start, end]
    },
  },
  {
    text: '이번주',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: '이번달',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: '3개월검색',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(3, 'months')
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
]

function formatCommaAmt(number) {
  return number.toLocaleString()
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

const affInfo = reactive({
  displayAmount: false,
})

async function loadDashboardData() {
  let query = {}
  query.recordTime = formData.recordTime.join(',')
  const { data: ret } = await getAffiliateDashboardData(query)
  Object.keys({ ...ret }).forEach(field => {
    if (ret[field] || ret[field] === 0) {
      dashboard[field] = ret[field]
    }
  })
  const { data: ret2 } = await getDashboardDataDetail(query)
  recordsDetail.depositRecords = ret2.filter(rec => rec.depositCount > 0);
  recordsDetail.withdrawalRecords = ret2.filter(rec => rec.withdrawCount > 0);
  recordsDetail.betRecords = ret2.filter(rec => rec.betCount > 0);
}

async function openDialog(type) {
  uiControl.dialogVisible = true
  uiControl.dialogType = type
  uiControl.dialogLoading = true
  if (type === 'DEPOSIT') {
    uiControl.dialogTitle = t('fields.deposit')
    uiControl.dialogThirdCol = t('fields.depositAmount')
    uiControl.dialogLastCol = t('fields.depositCount')
  } else if (type === 'WITHDRAW') {
    uiControl.dialogTitle = t('fields.withdrawal')
    uiControl.dialogThirdCol = t('fields.withdrawAmount')
    uiControl.dialogLastCol = t('fields.withdrawCount')
  } else if (type === 'BET') {
    uiControl.dialogTitle = t('fields.bet')
    uiControl.dialogThirdCol = t('fields.betAmount')
    uiControl.dialogLastCol = t('fields.numberOfbets')
  } else {

  }
  uiControl.dialogLoading = false
}

onMounted(async () => {
  loadDashboardData()
  const { data: aff } = await getAffiliateInfo(store.state.user.id)
  Object.keys({ ...aff }).forEach(field => {
    affInfo[field] = aff[field]
  })
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
  color: #7d8592;
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 5px;
}

.total-text {
  color: #3f8cff;
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
  overflow: auto;
  justify-content: flex-end;
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
  color: #0a1629;
  font-weight: bold;
}

.el-radio-group {
  background: #f4f9fd;
  padding: 2px;
  border-radius: 20px;
}

.el-radio-button .el-radio-button__inner {
  background: #f4f9fd;
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

.scrollable-container {
  max-height: 600px;
  overflow-y: auto;
}

.dashboard-row {
  gap: 6px;
  display: flex;
  flex-wrap: nowrap;
  width: calc(100% - 30px);
  justify-content: space-between;

  .dashboard-col {
    padding: 15px 20px;
    border-radius: 4px;
    height: auto;

    .number-span {
      font-size: 23px;
      font-weight: bold;
      margin-bottom: 10px;

      @media (max-width: 768px) {
        font-size: 1.3rem;
      }
    }

    .title-span {
      margin-bottom: 8px;
      font-size: 18px;
    }

    &:nth-child(1) {
      background: #fdd7d7;
    }
    &:nth-child(2) {
      background: #f4f1fc;
    }
    &:nth-child(3) {
      background: #fddcfd;
    }
    &:nth-child(4) {
      background: rgba(121, 177, 160, 0.73);
    }
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;

    .dashboard-col {
      width: 48%;
      max-width: 48%;
      flex: 0 0 50%;
      height: auto;
      padding: 15px 16px;
    }
  }

  @media (max-width: 390px) {
    flex-wrap: wrap;

    .dashboard-col {
      width: 100%;
      max-width: 100%;
      flex: 0 0 100%;
      height: auto;
      padding: 10px 15px;
    }
  }
}

.dashboard-listing {
  margin: 16px auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;

  @media (max-width: 768px) {
    display: flex;
    gap: 0px;
  }

  .listing-div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 16px 12px;
    background: rgba(211, 211, 211, 0.6);
    border-radius: 4px;
    width: 100%;

    .title-span {
      font-size: 18px;
    }
    .item-span {
      font-weight: bold;
      color: #000;
    }

    &:nth-child(1) {
    }
    &:nth-child(2) {
    }
    &:nth-child(3) {
      .item-span {
        color: #0e468c;
      }
    }
    &:nth-child(4) {
      .item-span {
        color: #0e468c;
      }
    }
    &:nth-child(5) {
      .item-span {
        color: green;
      }
    }
    &:nth-child(6) {
      .item-span {
        color: green;
      }
    }
    &:nth-child(7) {
      .item-span {
        color: orangered;
      }
    }
  }
}
</style>
