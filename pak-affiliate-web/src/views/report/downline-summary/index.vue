<template>
  <div class="page-container">
    <div class="panel-item">
      <div class="inputs-wrap">
        <el-row :gutter="10">
          <el-col :xl="6" :lg="10" :md="12">
            <el-date-picker
              v-model="request.recordTime"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              size="normal"
              type="datetimerange"
              range-separator=":"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
              :shortcuts="shortcuts"
              :disabled-date="disabledDate"
              :editable="false"
              :clearable="false"
              :default-time="defaultTime"
              style="width: 100%;"
            />
          </el-col>
          <el-col :xl="3" :lg="6" :md="12">
            <el-input
              v-model="request.loginName"
              maxlength="50"
              :placeholder="t('fields.loginName')"
            />
          </el-col>
          <el-col :xl="3" :lg="6" :md="12">
            <el-input
              v-model="request.affiliateCode"
              maxlength="50"
              :placeholder="t('fields.affiliateCode')"
            />
          </el-col>
          <el-col :xl="3" :lg="8" :md="12">
            <div class="btn-grp">
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="loadRecord()"
                size="normal"
              >
                {{ $t('fields.search') }}
              </el-button>
              <el-button
                size="normal"
                type="primary"
                plain
                @click="resetQuery()"
              >
                {{ $t('fields.reset') }}
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <table cellpadding="0" cellspacing="0" border class="custom-table">
        <thead>
          <tr>
            <th scope="col">{{ t('fields.loginName') }}</th>
            <th scope="col">{{ t('fields.depositAmount') }}</th>
            <th scope="col">{{ t('fields.withdrawAmount') }}</th>
            <th scope="col">{{ t('fields.bonus') }}</th>
            <th scope="col">{{ t('fields.adjustment') }}</th>
            <th scope="col">{{ t('fields.rebateAmount') }}</th>
            <th scope="col">{{ t('fields.totalBet') }}</th>
            <th scope="col">{{ t('fields.totalPayout') }}</th>
          </tr>
        </thead>
        <tbody v-if="page.loading || page.records.length === 0">
          <tr>
            <td colspan="8">
              <Loading v-if="page.loading" />
              <emptyComp v-else-if="page.records.length === 0" />
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="page.records.length > 0">
          <tr v-for="item in page.records" :key="item.id">
            <td :data-label="t('fields.loginName')">
              <span v-if="item.loginName === null">-</span>
              <span v-else>{{ item.loginName }}</span>
            </td>
            <td :data-label="t('fields.depositAmount')">
              <div v-formatter="{ data: item.depositAmount, type: 'money' }" />
            </td>
            <td :data-label="t('fields.withdrawAmount')">
              <div v-formatter="{ data: item.withdrawAmount, type: 'money' }" />
            </td>
            <td :data-label="t('fields.bonus')">
              <div v-formatter="{ data: item.bonus, type: 'money' }" />
            </td>
            <td :data-label="t('fields.adjustment')">
              <div
                v-formatter="{ data: item.adjustment, type: 'money' }"
              />
            </td>
            <td :data-label="t('fields.rebateAmount')">
              <div v-formatter="{ data: item.rebate, type: 'money' }" />
            </td>
            <td :data-label="t('fields.totalBet')">
              <div
                v-formatter="{ data: item.bet, type: 'money' }"
              />
            </td>
            <td :data-label="t('fields.totalPayout')">
              <div
                v-formatter="{ data: item.payout, type: 'money' }"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <el-pagination
        class="pagination"
        @current-change="changePage"
        layout="total, prev, pager, next"
        style="margin:0;padding:0;"
        :total="page.total"
        :page-size="request.size"
        :page-count="page.pages"
        :current-page="request.current"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import {
  getAffiliateSummary,
  getTotalSummary,
} from '../../../api/affiliate-record'
// import { getSiteListSimple } from '../../../api/site'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'
import { useStore } from '@/store'
import emptyComp from '@/components/empty'
import Loading from '@/components/loading/Loading.vue'

const { t } = useI18n()
const store = useStore()
const siteList = reactive({
  list: [],
})

let currentPageType = ref('main')
let currentAffiliateId = ref(null)

const shortcuts = getShortcuts(t)
const uiControl = reactive({
  dialogVisible: false,
  progressBarVisible: false,
  dialogTitle: '',
  dialogType: 'MEMBER',
  memberType: [
    {
      key: 'NORMAL',
      displayName: 'NORMAL',
      value: 'NORMAL',
    },
    {
      key: 'AFFILIATE',
      displayName: 'AFFILIATE',
      value: 'AFFILIATE',
    },
  ],
})
const site = ref(null)
const startDate = new Date()
startDate.setTime(
  moment(startDate)
    .startOf('month')
    .format('x')
)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  recordTime: [defaultStartDate, defaultEndDate],
  loginName: null,
  affiliateCode: null,
  // activeMember: 0,
})

const popUpRequest = reactive({
  loginName: null,
  recordTime: null,
  regTime: null,
  memberType: null,
})

const memberRequest = reactive({
  size: 15,
  current: 1,
  siteId: null,
})

const allMemberRequest = reactive({
  size: 15,
  current: 1,
  siteId: null,
})

const affiliateSummary = reactive({
  totalRebate: 0,
  totalAffiliateRebate: 0,
  totalBet: 0,
  totalPayout: 0,
  todayDeposit: 0,
  todayWithdrawal: 0,
  gameTypeBetSummaryVOList: [],
})

// async function loadSites() {
//   const { data: site } = await getSiteListSimple()
//   siteList.list = site
// }

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(13, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function gameTypeFilter(type) {
  if (
    affiliateSummary.gameTypeBetSummaryVOList === null ||
    affiliateSummary.gameTypeBetSummaryVOList === undefined ||
    affiliateSummary.gameTypeBetSummaryVOList.length === 0
  ) {
    return null
  }
  const gameTypeSummary = affiliateSummary.gameTypeBetSummaryVOList.filter(
    rec => rec.gameType === type
  )
  return gameTypeSummary.length === 0 ? null : gameTypeSummary
}

function resetQuery() {
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.loginName = null
  request.affiliateCode = null
  // request.activeMember = 0
  request.siteId = site.value ? site.value.id : siteList.list[0].id
}

function resetPopupQuery() {
  popUpRequest.loginName = null
  popUpRequest.recordTime = null
  popUpRequest.regTime = null
  popUpRequest.memberType = null
}

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
})

const memberPage = reactive({
  pages: 0,
  records: [],
  loading: false,
  affiliateId: null,
})

const allMemberPage = reactive({
  pages: 0,
  records: [],
  loading: false,
  affiliateId: null,
})

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = query.recordTime.join(',')
    }
  }
  return query
}

async function loadRecord() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await getAffiliateSummary(query)
  if (parseInt(store.state.user.siteId) === 10) {
    const { data: total } = await getTotalSummary(query)
    Object.entries(total).forEach(([key, value]) => {
      if (value) {
        affiliateSummary[key] = value
      }
    })
  }
  currentPageType = 'main'
  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  page.loading = false
}

async function loadChildren(tree, treeNode, resolve) {
  const query = {}

  query.parentAffiliateId = tree.affiliateId
  query.siteId = request.siteId
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
  }
  // const { data: children } = await getAffiliateChildSummary(query)
  // resolve(children)
}

function showDialog(type, affiliateId) {
  if (type === 'MEMBER') {
    // newMembers.list = members
    currentPageType = 'newRegister'
    loadNewMember(affiliateId)
    currentAffiliateId = affiliateId
    uiControl.dialogTitle = t('fields.newMember')
  } else if (type === 'ALLMEMBER') {
    currentPageType = 'allMembers'
    loadAllMember(affiliateId)
    currentAffiliateId = affiliateId
    uiControl.dialogTitle = t('fields.allmembers')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

async function loadNewMember(affiliateId) {
  memberPage.loading = true
  memberRequest.siteId = request.siteId
  const requestCopy = { ...memberRequest }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  popUpRequest.regTime = request.recordTime

  if (popUpRequest.regTime !== null) {
    if (popUpRequest.regTime.length === 2) {
      query.regTime = JSON.parse(JSON.stringify(popUpRequest.regTime))

      query.regTime[0] = moment(query.regTime[0]).format('YYYY-MM-DD 00:00:00')
      query.regTime[1] = moment(query.regTime[1]).format('YYYY-MM-DD 23:59:59')

      query.regTime = query.regTime.join(',')
    } else {
      query.regTime = moment(popUpRequest.regTime[0]).format(
        'YYYY-MM-DD 00:00:00'
      )
    }
  }

  // if (members !== null) {
  //   if (members.length > 1) {
  //     query.memberId = members.join(',')
  //   } else {
  //     query.memberId = members[0]
  //   }
  // }
  // query.affiliateId = affiliateId
  // query.loginName = popUpRequest.loginName
  // query.memberType = popUpRequest.memberType

  // const { data: ret } = await getAffiliateSummaryNewMember(query)
  // currentPageType = 'newRegister'
  // memberPage.pages = ret.pages
  // memberPage.records = ret.records
  // memberPage.loading = false
  // memberPage.affiliateId = affiliateId
}

async function loadAllMember(affiliateId) {
  allMemberPage.loading = true
  allMemberRequest.siteId = request.siteId
  const requestCopy = { ...allMemberRequest }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  query.affiliateId = affiliateId
  query.loginName = popUpRequest.loginName
  query.memberType = popUpRequest.memberType

  popUpRequest.recordTime = request.recordTime

  if (popUpRequest.regTime !== null) {
    if (popUpRequest.regTime.length === 2) {
      query.regTime = JSON.parse(JSON.stringify(popUpRequest.regTime))

      query.regTime[0] = moment(query.regTime[0]).format('YYYY-MM-DD 00:00:00')
      query.regTime[1] = moment(query.regTime[1]).format('YYYY-MM-DD 23:59:59')

      query.regTime = query.regTime.join(',')
    } else {
      query.regTime = moment(popUpRequest.regTime[0]).format(
        'YYYY-MM-DD 00:00:00'
      )
    }
  }

  if (popUpRequest.recordTime !== null) {
    if (popUpRequest.recordTime.length === 2) {
      query.recordTime = JSON.parse(JSON.stringify(popUpRequest.recordTime))

      query.recordTime[0] = moment(query.recordTime[0]).format(
        'YYYY-MM-DD 00:00:00'
      )
      query.recordTime[1] = moment(query.recordTime[1]).format(
        'YYYY-MM-DD 23:59:59'
      )

      query.recordTime = query.recordTime.join(',')
    } else {
      query.recordTime = moment(popUpRequest.recordTime[0]).format(
        'YYYY-MM-DD 00:00:00'
      )
    }
  }

  // const { data: ret } = await getAffiliateSummaryNewMember(query)
  // currentPageType = 'allMembers'

  // allMemberPage.pages = ret.pages
  // allMemberPage.records = ret.records
  // allMemberPage.loading = false
  // allMemberPage.affiliateId = affiliateId
}

function changePage(page, pageType) {
  if (pageType === 'main') {
    request.current = page
  } else if (pageType === 'newRegister') {
    memberRequest.current = page
    loadNewMember(memberPage.affiliateId)
  } else if (pageType === 'allMembers') {
    allMemberRequest.current = page
    loadAllMember(allMemberPage.affiliateId)
  }
  // memberRequest.current = page
  // loadNewMember(newMembers.list)
}

onMounted(async () => {
  // await loadSites()
  request.siteId = store.state.user.siteId
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}

.inputs-wrap {
  display: flex;
  align-items: center;
  gap: 10px;

  .input-small {
    width: 100%;

    // max-width: 200px;
    &.el-range-editor--small.el-input__inner {
      height: 40px;
      max-width: 300px;
    }
  }

  .btn-grp {
    display: flex;
  }
}

.el-pagination {
  display: inline-block;
}

@media (max-width: 768px) {
  // .inputs-wrap {
  //   flex-direction: column;
  //   gap: 10px;
  //   .el-input--small {
  //     width: 100% !important;
  //     max-width: unset !important;
  //     margin: 0 !important;
  //     .el-button {
  //       margin: 0 !important;
  //     }
  //   }
  //   .input-small {
  //     max-width: unset;
  //     width: 100%;
  //   &.el-range-editor--small.el-input__inner {
  //     max-width: unset;
  //   }
  //   }
  // }
}
</style>
<style>
.el-col {
  margin-bottom: 10px;
}
</style>
