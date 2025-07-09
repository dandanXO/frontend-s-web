<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.wheelStartTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-left: 5px; width: 250px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 5px;;"
          :placeholder="t('fields.loginName')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadReferWheelSpins"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="$t('fields.details')"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="700px"
    >
      <el-card class="box-card" shadow="never">
        <template #header>
          <div class="clearfix">
            <span class="role-span">{{ t('fields.records') }}</span>
          </div>
        </template>
        <el-table :data="details.records" max-height="550" :empty-text="t('fields.noData')">
          <el-table-column prop="recordTime" :label="t('fields.recordTime')">
            <template #default="scope">
              <span v-if="scope.row.recordTime === null">-</span>
              <span
                v-if="scope.row.recordTime !== null"
                v-formatter="{data: scope.row.recordTime, timeZone: timeZone, type: 'date'}"
              />
            </template>
          </el-table-column>
          <el-table-column prop="bonus" :label="t('fields.bonus')">
            <template #default="scope">
              $ <span v-formatter="{data: scope.row.bonus, type: 'money'}" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="box-card" shadow="never" style="margin-top: 20px">
        <template #header>
          <div class="clearfix">
            <span class="role-span">{{ t('fields.friends') }}</span>
          </div>
        </template>
        <el-table :data="details.friendList" max-height="550" :empty-text="t('fields.noData')">
          <el-table-column prop="loginName" :label="t('fields.loginName')" width="150">
            <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
              <router-link
                :to="`/member/details/${scope.row.id}?site=${request.siteId}`"
              >
                <el-link type="primary">{{ scope.row.loginName }}</el-link>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="regTime" :label="t('fields.regTime')">
            <template #default="scope">
              <span v-if="scope.row.regTime === null">-</span>
              <span
                v-if="scope.row.regTime !== null"
                v-formatter="{data: scope.row.regTime, timeZone: timeZone, type: 'date'}"
              />
            </template>
          </el-table-column>
          <el-table-column prop="depositTime" :label="t('fields.depositDate')">
            <template #default="scope">
              <span v-if="scope.row.depositTime === null">-</span>
              <span
                v-if="scope.row.depositTime !== null"
                v-formatter="{data: scope.row.depositTime, timeZone: timeZone, type: 'date'}"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="loginName" :label="t('fields.loginName')" min-width="200">
        <template #default="scope" v-if="hasPermission(['sys:member:detail'])">
          <router-link
            :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`"
          >
            <el-link type="primary">{{ scope.row.loginName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="accumulatedBonus" :label="t('fields.accumulatedBonus')" min-width="180">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.accumulatedBonus, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="wheelStartTime" :label="t('fields.wheelStartTime')" min-width="200">
        <template #default="scope">
          <span v-if="scope.row.wheelStartTime === null">-</span>
          <span
            v-if="scope.row.wheelStartTime !== null"
            v-formatter="{data: scope.row.wheelStartTime, timeZone: timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="wheelEndTime" :label="t('fields.wheelEndTime')" min-width="200">
        <template #default="scope">
          <span v-if="scope.row.wheelEndTime === null">-</span>
          <span
            v-if="scope.row.wheelEndTime !== null"
            v-formatter="{data: scope.row.wheelEndTime, timeZone: timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.operate')"
        align="center"
        fixed="right"
        width="200"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-view"
            size="mini"
            type="success"
            @click="showDialog(scope.row)"
          >
            {{ $t('fields.details') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, computed, ref } from 'vue'
import { getSiteListSimple } from '@/api/site'
import { useStore } from '@/store'
import { TENANT } from '@/store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { getReferWheelSpins, getDetails } from '@/api/refer-wheel-spin'
import { convertDateToEnd, convertDateToStart, getShortcuts } from "@/utils/datetime";
import { formatInputTimeZone } from "@/utils/format-timeZone"
import { hasPermission } from '@/utils/util'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})
const details = reactive({
  records: [],
  friendList: []
})

const uiControl = reactive({
  dialogVisible: false,
})

let timeZone = null

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const shortcuts = getShortcuts(t);
const date = new Date()
const defaultStartDate = convertDateToStart(date)
const defaultEndDate = convertDateToEnd(date)

function disabledDate(time) {
  return time.getTime() > new Date().getTime()
}

const request = reactive({
  size: 30,
  current: 1,
  wheelStartTime: [defaultStartDate, defaultEndDate],
  loginName: null,
  siteId: null
})

function resetQuery() {
  request.wheelStartTime = [defaultStartDate, defaultEndDate]
  request.loginName = null
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  if (request.wheelStartTime !== null) {
    if (request.wheelStartTime.length === 2) {
      query.wheelStartTime = JSON.parse(JSON.stringify(request.wheelStartTime))
      query.wheelStartTime[0] = formatInputTimeZone(
        query.wheelStartTime[0],
        timeZone,
        'start'
      )
      query.wheelStartTime[1] = formatInputTimeZone(
        query.wheelStartTime[1],
        timeZone,
        'end'
      )
      query.wheelStartTime = query.wheelStartTime.join(',')
    }
  }

  return query
}

async function loadReferWheelSpins() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await getReferWheelSpins(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function changePage(page) {
  request.current = page
  loadReferWheelSpins()
}

async function showDialog(member) {
  const query = {};
  query.memberId = member.memberId;
  query.siteId = request.siteId;
  query.wheelStartTime = member.wheelStartTime
  query.wheelEndTime = member.wheelEndTime
  const { data: ret } = await getDetails(query)
  details.records = ret.records
  details.friendList = ret.friendList
  uiControl.dialogVisible = true
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  } else {
    request.siteId = siteList.list[0].id;
  }
  await loadReferWheelSpins()
  timeZone = store.state.user.sites[0].timeZone
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enabled-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.el-input-number:deep(.el-input__inner) {
  text-align: left;
}
</style>
