<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.eventTime"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 380px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px; margin-left: 5px;"
          :placeholder="t('fields.loginName')"
        />
        <el-input
          v-model="request.affiliateLoginName"
          size="small"
          style="width: 200px; margin-left: 5px;"
          :placeholder="t('fields.affiliate')"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in statusList.list"
            :key="item.key"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadSmsList()"
        >
          {{ t('fields.search') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <el-table
        :data="page.records"
        ref="table"
        v-loading="page.loading"
        row-key="id"
        size="mini"
        :resizable="true"
        highlight-current-row
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="affiliateLoginName"
          :label="t('fields.affiliate')"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="status"
          :label="t('fields.status')"
          align="center"
          min-width="80"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" type="danger">{{ t('fields.fail') }}</el-tag>
            <el-tag v-if="scope.row.status === 1" type="success">{{ t('fields.success') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.createTime')"
                         align="center" min-width="180" prop="eventTime"
                         sortable
        >
          <template #default="scope">
            <span v-formatter="{data: scope.row.eventTime,timeZone: timeZone,type: 'date'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="event"
          :label="t('fields.event')"
          align="center"
          min-width="50"
        />
        <el-table-column
          prop="platform"
          :label="t('fields.platform')"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="costTime"
          :label="t('fields.costTime')"
          align="center"
          min-width="50"
        />
        <el-table-column
          prop="requestUrl"
          :label="t('fields.requestUrl')"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            <el-tooltip
              raw-content
              effect="dark"
              placement="top"
              :teleported="true"
            >
              <template #content>
                <pre style="white-space: pre-wrap; max-width: 200px;">{{ scope.row.requestUrl }}</pre>
              </template>
              <span>
                {{ scope.row.requestUrl?.slice(0, 20) }}{{ scope.row.requestUrl?.length > 10 ? '…' : '' }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="requestHeader"
          :label="t('fields.requestHeader')"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            <el-tooltip
              raw-content
              effect="dark"
              placement="top"
              :teleported="true"
            >
              <template #content>
                <pre style="white-space: pre-wrap; max-width: 100px;">{{ scope.row.requestHeader }}</pre>
              </template>
              <span>
                {{ scope.row.requestHeader?.slice(0, 20) }}{{ scope.row.requestHeader?.length > 10 ? '…' : '' }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="response"
          :label="t('fields.response')"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            <el-tooltip
              raw-content
              effect="dark"
              placement="top"
              :teleported="true"
            >
              <template #content>
                <pre style="white-space: pre-wrap; max-width: 100px;">{{ scope.row.response }}</pre>
              </template>
              <span>
                {{ scope.row.response?.slice(0, 20) }}{{ scope.row.response?.length > 10 ? '…' : '' }}
              </span>
            </el-tooltip>
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
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { getList } from '../../../api/adjust-event'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from "@/utils/datetime";
import { getSiteListSimple } from "@/api/site";
import { TENANT } from "@/store/modules/user/action-types";
import { useStore } from "@/store";
import { formatInputTimeZone } from "@/utils/format-timeZone";

const { t } = useI18n()
const store = useStore()

const date = new Date()
const defaultStartDate = convertStartDate(date)
const defaultEndDate = convertDate(date)
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const siteList = reactive({
  list: [],
})
const site = ref(null)
const statusList = reactive({
  list: [
    { key: '0', value: 0, name: t('fields.fail') },
    { key: '1', value: 1, name: t('fields.success') },
  ],
})
let timeZone = null;

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = getShortcuts(t);
function convertDate(date) {
  return moment(date).format('YYYY-MM-DD') + ' 23:59:59'
}

function convertStartDate(date) {
  return moment(date)
    .startOf('day')
    .format('YYYY-MM-DD HH:mm:ss')
}

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(2, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  eventTime: [defaultStartDate, defaultEndDate],
  current: 1,
  loginName: null,
  affiliateLoginName: null,
  status: null
})

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    } else {
      if (key === 'status') {
        query[key] = value
      }
    }
  })

  if (request.eventTime !== null) {
    if (request.eventTime.length === 2) {
      query.eventTime = JSON.parse(JSON.stringify(request.eventTime));
      query.eventTime[0] = formatInputTimeZone(query.eventTime[0], timeZone);
      query.eventTime[1] = formatInputTimeZone(query.eventTime[1], timeZone);
      query.eventTime = query.eventTime.join(',')
    }
  }
  return query
}

async function loadSmsList() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await getList(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

onMounted(async () => {
  await loadSites()
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
})

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadSmsList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}
</style>
