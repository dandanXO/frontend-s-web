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
            <el-select
              v-model="request.gameType"
              size="normal"
              :placeholder="t('fields.gameType')"
              class="filter-item"
              style="width: 100%"
            >
              <el-option
                v-for="item in list.gameType"
                :key="item.key"
                :label="item.displayName"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :xl="3" :lg="6" :md="12">
            <el-select
              v-model="request.platform"
              size="normal"
              :placeholder="t('fields.platform')"
              class="filter-item"
              style="width: 100%"
              @focus="loadPlatform"
              @change="populateGameType"
            >
              <el-option
                v-for="item in list.platform"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-col>
          <el-col :xl="3" :lg="8" :md="12">
            <div class="btn-grp">
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="loadPlatformSummary()"
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
            <th scope="col">{{ t('fields.platform') }}</th>
            <th scope="col">{{ t('fields.gameType') }}</th>
            <th scope="col">{{ t('fields.bet') }}</th>
            <th scope="col">{{ t('fields.payout') }}</th>
            <th scope="col">{{ t('fields.validBet') }}</th>
            <th scope="col">{{ t('fields.winLoss') }}</th>
            <th scope="col">{{ t('fields.betCount') }}</th>
          </tr>
        </thead>
        <tbody v-if="page.loading || page.records.length === 0">
          <tr>
            <td colspan="7">
              <Loading v-if="page.loading" />
              <emptyComp v-else-if="page.records.length === 0" />
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="page.records.length > 0">
          <tr v-for="item in page.records" :key="item.id">
            <td :data-label="t('fields.platform')">
              <span v-if="item.gamePlatform === null">-</span>
              <span v-else>{{ item.gamePlatform }}</span>
            </td>
            <td :data-label="t('fields.gameType')">
              <span v-if="item.gameType === null">-</span>
              <span v-else>{{ item.gameType }}</span>
            </td>
            <td :data-label="t('fields.bet')">
              <div v-formatter="{ data: item.bet, type: 'money' }" />
            </td>
            <td :data-label="t('fields.validBet')">
              <div v-formatter="{ data: item.validBet, type: 'money' }" />
            </td>
            <td :data-label="t('fields.payout')">
              <div v-formatter="{ data: item.payout, type: 'money' }" />
            </td>
            <td :data-label="t('fields.winLoss')">
              <div v-formatter="{ data: item.bet - item.payout, type: 'money' }" />
            </td>
            <td :data-label="t('fields.betCount')">
              <span v-if="item.betCount === null">-</span>
              <span v-if="item.betCount !== null">{{ item.betCount }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="table-footer">
        <span class="table-footer-item">
          {{ t('fields.totalBet') }}:
          <span v-formatter="{ data: page.totalBet, type: 'money' }" />
        </span>
        <span class="table-footer-item">
          {{ t('fields.totalPayout') }}:
          <span v-formatter="{ data: page.totalPayout, type: 'money' }" />
        </span>
        <span class="table-footer-item">
          {{ t('fields.totalValidBet') }}:
          <span v-formatter="{ data: page.totalValidBet, type: 'money' }" />
        </span>
        <span class="table-footer-item">
          {{ t('fields.totalCompanyProfit') }}:
          <span
            v-formatter="{
              data: page.totalBet - page.totalPayout,
              type: 'money',
            }"
          />
        </span>
      </div>
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
import { onMounted, reactive, watch } from 'vue'
import { useStore } from '@/store'
import moment from 'moment'
import { getPlatformsBySite } from '../../../api/affiliate-bet-record'
import { useI18n } from 'vue-i18n'
import emptyComp from '@/components/empty'
import Loading from '@/components/loading/Loading.vue'
import { getDownlineMembers } from '../../../api/affiliate'
import { getPlatformSummary } from '../../../api/platform-summary'

const store = useStore()
const { t } = useI18n()
const list = reactive({
  platform: [],
  gameType: [],
})
const details = reactive({
  loginName: null,
  vipName: null,
  transactionId: null,
  betTime: null,
  platform: null,
  gameType: null,
  gameName: null,
  bet: 0,
  payout: 0,
  companyProfit: 0,
  betStatus: null,
  settleTime: null,
})

let downlineAffiliateList = []
let downlineMemberList = reactive({
  list: [],
})

const uiControl = reactive({
  dialogVisible: false,
  gameType: [
    { key: 1, displayName: t('gameType.SLOT'), value: 'SLOT' },
    { key: 2, displayName: t('gameType.LIVE'), value: 'LIVE' },
    { key: 3, displayName: t('gameType.FISH'), value: 'FISH' },
    { key: 4, displayName: t('gameType.SPORT'), value: 'SPORT' },
    { key: 5, displayName: t('gameType.ESPORT'), value: 'ESPORT' },
    { key: 6, displayName: t('gameType.POKER'), value: 'POKER' },
    { key: 7, displayName: t('gameType.LOTTERY'), value: 'LOTTERY' },
  ],
  status: [
    { key: 2, displayName: t('betStatus.SETTLED'), value: 'SETTLED' },
    { key: 3, displayName: t('betStatus.CANCEL'), value: 'CANCEL' },
  ],
})

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
]
const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('day')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'days')
          .startOf('day')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'days')
          .endOf('day')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisWeek'),
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
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'weeks')
          .startOf('isoWeek')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'weeks')
          .endOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisMonth'),
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
    text: t('fields.lastMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
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
      return [start, end]
    },
  },
]

const request = reactive({
  size: 20,
  current: 1,
  recordTime: [convertStartDate(new Date()), convertDate(new Date())],
  loginName: null,
  platform: null,
  gameType: [],
  siteId: store.state.user.siteId,
  affiliateId: store.state.user.id,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  totalBet: 0,
  totalValidBet: 0,
  totalPayout: 0,
  totalBetCount: 0,
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function convertStartDate(date) {
  return moment(date)
    .startOf('day')
    .format('YYYY-MM-DD')
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime()
}

function resetQuery() {
  request.recordTime = [convertStartDate(new Date()), convertDate(new Date())]
  request.loginName = null
  request.platform = null
  request.gameType = null
  loadMemberList()
  populateGameType()
}

async function loadPlatform() {
  const { data: ret } = await getPlatformsBySite(store.state.user.siteId)
  if (request.gameType) {
    console.log(request.gameType)
    list.platform = ret.filter(p => p.gameType.includes(request.gameType))
  } else {
    list.platform = ret
  }
}

async function loadMemberList() {
  request.loginName = null
  if (request.affiliateId) {
    const { data: ret } = await getDownlineMembers(request.affiliateId)
    downlineMemberList.list = ret
  } else {
    const { data: ret } = await getDownlineMembers(store.state.user.id)
    downlineMemberList.list = ret
  }
}

function populateGameType() {
  if (request.platform) {
    list.gameType = uiControl.gameType.filter(g => {
      const platform = list.platform.filter(p => p.code === request.platform)[0]
      return platform.gameType.includes(g.value)
    })
  } else {
    list.gameType = uiControl.gameType
  }
}

async function loadPlatformSummary() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
  }
  query.siteId = store.state.user.siteId
  const { data: ret } = await getPlatformSummary(query)
  page.pages = ret.pages
  page.records = ret.records;
  page.total = ret.total;
  if (ret.sums !== null && ret.sums !== undefined) {
    page.totalBet = ret.sums.bet
    page.totalValidBet = ret.sums.validBet
    page.totalPayout = ret.sums.payout
    page.totalBetCount = ret.sums.betCount
  }
  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadPlatformSummary()
  }
}

onMounted(() => {
  loadPlatform()
  populateGameType()
  loadPlatformSummary()
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
