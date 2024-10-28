<template>
  <div class="page-container">
    <div class="header-container">
      <div class="search">
        <div>
          <el-input
            v-model="request.loginName"
            style="width: 200px"
            size="small"
            maxlength="50"
            :placeholder="t('fields.loginName')"
          />
          <el-input
            v-model="request.affiliateCode"
            style="width: 200px; margin-left: 10px; margin-bottom: 10px;"
            size="small"
            maxlength="50"
            :placeholder="t('fields.affiliateCode')"
          />
          <!-- <el-select
            v-model="request.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 120px;margin-left: 5px"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select> -->
          <el-date-picker
            v-model="request.recordTime"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            size="small"
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
        </div>
        <div style="margin-bottom: 10px;">
          <!--          <span style="font-size: small">-->
          <!--            {{ t('fields.minActiveMemberCount') }}-->
          <!--          </span>-->
          <!--          <el-input-number-->
          <!--            v-model="request.activeMember"-->
          <!--            style="width: 100px; margin-left: 10px"-->
          <!--            size="small"-->
          <!--            maxlength="5"-->
          <!--            :label="t('fields.activeMember')"-->
          <!--          />-->
          <el-button
            style="margin-left: 20px"
            icon="el-icon-search"
            size="mini"
            type="success"
            @click="loadRecord()"
          >
            {{ t('fields.search') }}
          </el-button>
          <el-button size="mini" @click="resetQuery()">
            {{ t('fields.reset') }}
          </el-button>
        </div>
        <el-row
          class="summary-container"
          v-if="parseInt(store.state.user.siteId) === 10"
        >
          <div class="summary-stat">
            <el-row>
              <el-col>
                {{ t('fields.affiliateTotalRebate') }}
              </el-col>
              <el-col>
                {{ affiliateSummary.totalRebate }}
              </el-col>
            </el-row>
          </div>
          <div class="summary-stat">
            <el-row>
              <el-col>
                {{ t('fields.myRebate') }}
              </el-col>
              <el-col>
                {{ affiliateSummary.totalAffiliateRebate }}
              </el-col>
            </el-row>
          </div>
          <div class="summary-stat">
            <el-row>
              <el-col>
                {{ t('fields.totalBet') }}
              </el-col>
              <el-col>
                {{ affiliateSummary.totalBet }}
              </el-col>
            </el-row>
          </div>
          <div class="summary-stat">
            <el-row>
              <el-col>
                {{ t('fields.totalPayout') }}
              </el-col>
              <el-col>
                {{ affiliateSummary.totalPayout }}
              </el-col>
            </el-row>
          </div>
          <div class="summary-stat">
            <el-row>
              <el-col>
                {{ t('fields.totalWinLoss') }}
              </el-col>
              <el-col>
                {{ affiliateSummary.totalBet - affiliateSummary.totalPayout }}
              </el-col>
            </el-row>
          </div>
          <div class="summary-stat">
            <el-row>
              <el-col>
                {{ t('fields.todayDeposit') }}
              </el-col>
              <el-col>
                {{ affiliateSummary.todayDeposit }}
              </el-col>
            </el-row>
          </div>
          <div class="summary-stat">
            <el-row>
              <el-col>
                {{ t('fields.todayWithdrawal') }}
              </el-col>
              <el-col>
                {{ affiliateSummary.todayWithdrawal }}
              </el-col>
            </el-row>
          </div>
          <div class="summary-stat">
            <el-row>
              <el-col>
                {{ t('fields.depositWithdrawalDiff') }}
              </el-col>
              <el-col>
                {{
                  affiliateSummary.todayDeposit -
                    affiliateSummary.todayWithdrawal
                }}
              </el-col>
            </el-row>
          </div>
        </el-row>
        <table
          class="summary-container"
          v-if="parseInt(store.state.user.siteId) === 10"
        >
          <tbody>
            <tr>
              <th>
                {{ t('fields.gameType') }}
              </th>
              <th>
                {{ t('gameType.LIVE') }}
              </th>
              <th>
                {{ t('gameType.SPORT') }}
              </th>
              <th>
                {{ t('gameType.SLOT') }}
              </th>
              <th>
                {{ t('gameType.MINIGAME') }}
              </th>
            </tr>
            <tr>
              <td>
                {{ t('fields.bet') }}
              </td>
              <td>
                {{
                  gameTypeFilter('LIVE') === null
                    ? 0
                    : gameTypeFilter('LIVE')[0].totalBet
                }}
              </td>
              <td>
                {{
                  (
                    (gameTypeFilter('SPORT') === null
                      ? 0
                      : gameTypeFilter('SPORT')[0].totalBet) +
                    (gameTypeFilter('ESPORT') === null
                      ? 0
                      : gameTypeFilter('ESPORT')[0].totalBet)
                  ).toFixed(0)
                }}
              </td>
              <td>
                {{
                  gameTypeFilter('SLOT') === null
                    ? 0
                    : gameTypeFilter('SLOT')[0].totalBet
                }}
              </td>
              <td>
                {{
                  gameTypeFilter('FISH') === null
                    ? 0
                    : gameTypeFilter('FISH')[0].totalBet
                }}
              </td>
            </tr>
            <tr>
              <td>
                {{ t('fields.payout') }}
              </td>
              <td>
                {{
                  gameTypeFilter('LIVE') === null
                    ? 0
                    : gameTypeFilter('LIVE')[0].totalPayout
                }}
              </td>
              <td>
                {{
                  (
                    (gameTypeFilter('SPORT') === null
                      ? 0
                      : gameTypeFilter('SPORT')[0].totalPayout) +
                    (gameTypeFilter('ESPORT') === null
                      ? 0
                      : gameTypeFilter('ESPORT')[0].totalPayout)
                  ).toFixed(0)
                }}
              </td>
              <td>
                {{
                  gameTypeFilter('SLOT') === null
                    ? 0
                    : gameTypeFilter('SLOT')[0].totalPayout
                }}
              </td>
              <td>
                {{
                  gameTypeFilter('FISH') === null
                    ? 0
                    : gameTypeFilter('FISH')[0].totalPayout
                }}
              </td>
            </tr>
            <tr>
              <td>
                {{ t('fields.winLoss') }}
              </td>
              <td>
                {{
                  gameTypeFilter('LIVE') === null
                    ? 0
                    : gameTypeFilter('LIVE')[0].totalBet -
                      gameTypeFilter('LIVE')[0].totalPayout
                }}
              </td>
              <td>
                {{
                  (
                    (gameTypeFilter('SPORT') === null
                      ? 0
                      : gameTypeFilter('SPORT')[0].totalBet -
                        gameTypeFilter('SPORT')[0].totalPayout) +
                    (gameTypeFilter('ESPORT') === null
                      ? 0
                      : gameTypeFilter('ESPORT')[0].totalBet -
                        gameTypeFilter('ESPORT')[0].totalPayout)
                  ).toFixed(0)
                }}
              </td>
              <td>
                {{
                  gameTypeFilter('SLOT') === null
                    ? 0
                    : gameTypeFilter('SLOT')[0].totalBet -
                      gameTypeFilter('SLOT')[0].totalPayout
                }}
              </td>
              <td>
                {{
                  gameTypeFilter('FISH') === null
                    ? 0
                    : gameTypeFilter('FISH')[0].totalBet -
                      gameTypeFilter('FISH')[0].totalPayout
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        height="600"
        size="small"
        :resizable="true"
        :data="page.records"
        v-loading="page.loading"
        row-key="affiliateId"
        :load="loadChildren"
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :empty-text="t('fields.noData')"
        highlight-current-row
      >
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          align="left"
          width="160"
        >
          <template #default="scope">
            <!--            <router-link-->
            <!--              :to="-->
            <!--                `/affiliate/details/${scope.row.affiliateId}?site=${request.siteId}`-->
            <!--              "-->
            <!--            >-->
            <span type="primary">{{ scope.row.loginName }}</span>
            <!--            </router-link>-->
          </template>
        </el-table-column>
        <el-table-column
          prop="depositAmount"
          :label="t('fields.depositAmount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span
              v-formatter="{ data: scope.row.depositAmount, type: 'money' }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawAmount"
          :label="t('fields.withdrawAmount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span
              v-formatter="{ data: scope.row.withdrawAmount, type: 'money' }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="bonus"
          :label="t('fields.bonus')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span v-formatter="{ data: scope.row.bonus, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="rebate"
          :label="t('fields.rebateAmount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span v-formatter="{ data: scope.row.rebate, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="bet"
          :label="t('fields.totalBet')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span v-formatter="{ data: scope.row.bet, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="adjustment"
          :label="t('fields.adjustment')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span v-formatter="{ data: scope.row.adjustment, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="payout"
          :label="t('fields.totalPayout')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span v-formatter="{ data: scope.row.payout, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="platformFee"
          :label="t('fields.platformFee')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span
              v-formatter="{ data: scope.row.platformFee, type: 'money' }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="paymentFee"
          :label="t('fields.paymentFee')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span v-formatter="{ data: scope.row.paymentFee, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column prop="ngr" label="NGR" align="center" width="120">
          <template #default="scope">
            <span v-formatter="{ data: scope.row.ngr, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="ftdCount"
          :label="t('fields.ftd')"
          align="center"
          min-width="50"
        />
        <el-table-column
          prop="newMemberCount"
          :label="t('fields.newMemberCount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <el-link
              v-if="scope.row.newMemberCount !== 0"
              type="primary"
              @click="showDialog('MEMBER', scope.row.affiliateId)"
            >
              {{ scope.row.newMemberCount }}
            </el-link>
            <span v-else>{{ scope.row.newMemberCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="activeMemberCount"
          :label="t('fields.activeMemberCount')"
          align="center"
          width="120"
        />
        <el-table-column
          prop="totalRegisterMemberCount"
          :label="t('fields.totalRegisterCount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <!--            <el-link-->
            <!--              v-if="scope.row.totalRegisterMemberCount !== 0"-->
            <!--              type="primary"-->
            <!--              @click="showDialog('ALLMEMBER', scope.row.affiliateId)"-->
            <!--            >-->
            <span>{{ scope.row.totalRegisterMemberCount }}</span>
            <!--            </el-link>-->
            <!--            <span v-else>{{ scope.row.totalRegisterMemberCount }}</span>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="page.total"
        :page-sizes="[20, 50, 100, 150]"
        layout="total,sizes,prev, pager, next"
        style="margin-top: 10px"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @current-change="loadRecord"
        @size-change="loadRecord"
      />
    </el-card>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="1200px"
    >
      <div>
        <div class="search">
          <el-input
            v-model="popUpRequest.loginName"
            style="width: 200px"
            size="small"
            maxlength="50"
            :placeholder="t('fields.loginName')"
          />
          <el-date-picker
            v-model="popUpRequest.recordTime"
            v-if="currentPageType === 'allMembers'"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            size="small"
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
          <el-date-picker
            v-model="popUpRequest.regTime"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            size="small"
            type="daterange"
            range-separator=":"
            :start-placeholder="t('fields.regStartDate')"
            :end-placeholder="t('fields.regEndDate')"
            style="width: 300px; margin-left: 10px"
            :shortcuts="shortcuts"
            :disabled-date="disabledDate"
            :editable="false"
            :clearable="false"
          />
          <el-select
            v-model="popUpRequest.memberType"
            size="small"
            :placeholder="t('fields.memberType')"
            class="filter-item"
            style="width: 200px; margin-left: 10px;"
          >
            <el-option
              v-for="item in uiControl.memberType"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
          <el-button
            style="margin-left: 20px"
            icon="el-icon-search"
            size="mini"
            type="success"
            @click="
              currentPageType === 'newRegister'
                ? loadNewMember(currentAffiliateId)
                : loadAllMember(currentAffiliateId)
            "
          >
            {{ t('fields.search') }}
          </el-button>
          <el-button size="mini" @click="resetPopupQuery()">
            {{ t('fields.reset') }}
          </el-button>
        </div>
      </div>
      <el-table
        height="600"
        size="small"
        :resizable="true"
        :data="
          currentPageType === 'newRegister'
            ? memberPage.records
            : allMemberPage.records
        "
        v-loading="
          currentPageType === 'newRegister'
            ? memberPage.loading
            : allMemberPage.loading
        "
        row-key="id"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          align="left"
          min-width="100"
        >
          <template #default="scope">
            <router-link
              :to="
                `/member/details/${scope.row.memberId}?site=${request.siteId}`
              "
            >
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="depositAmount"
          :label="t('fields.depositAmount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span
              v-formatter="{ data: scope.row.depositAmount, type: 'money' }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawAmount"
          :label="t('fields.withdrawAmount')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span
              v-formatter="{ data: scope.row.withdrawAmount, type: 'money' }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="bonus"
          :label="t('fields.bonus')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span v-formatter="{ data: scope.row.bonus, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="bet"
          :label="t('fields.totalBet')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span v-formatter="{ data: scope.row.bet, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="adjustment"
          :label="t('fields.adjustment')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span v-formatter="{ data: scope.row.adjustment, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="payout"
          :label="t('fields.totalPayout')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span v-formatter="{ data: scope.row.payout, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="profit"
          :label="t('fields.totalProfit')"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span v-formatter="{ data: scope.row.profit, type: 'money' }" />
          </template>
        </el-table-column>
        <el-table-column
          prop="regTime"
          :label="t('fields.registerTime')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span
              v-formatter="{
                data: scope.row.regTime,
                formatter: 'YYYY/MM/DD HH:mm:ss',
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="lastLoginTime"
          :label="t('fields.lastLoginTime')"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <span
              v-formatter="{
                data: scope.row.lastLoginTime,
                formatter: 'YYYY/MM/DD HH:mm:ss',
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="changePage($event, currentPageType)"
        layout="prev, pager, next"
        :page-size="
          currentPageType === 'main'
            ? memberRequest.size
            : currentPageType === 'newRegister'
            ? memberRequest.size
            : allMemberRequest.size
        "
        :page-count="
          currentPageType === 'main'
            ? request.pages
            : currentPageType === 'newRegister'
            ? memberPage.pages
            : allMemberPage.pages
        "
        :current-page="
          currentPageType === 'main'
            ? request.current
            : currentPageType === 'newRegister'
            ? memberPage.current
            : allMemberPage.current
        "
      />
    </el-dialog>
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
  margin-bottom: 10px;
}

.search {
  float: left;
  width: 100%;
  display: block;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
  display: inline-flex;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-pagination {
  display: inline-block;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

.summary-container {
  display: table;
  table-layout: fixed;
  width: inherit;
  border-collapse: separate;
  border-spacing: 10px;
}

.summary-stat,
.summary-container td {
  display: table-cell;
  border: 1px solid black;
  border-radius: 0.5rem;
  background: white;
  padding: 5px;

  .el-row {
    display: grid;

    .el-col:nth-child(2) {
      margin-top: 5px;
    }
  }

  .el-col {
    text-align: center;
  }
}
</style>
