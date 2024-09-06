<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 250px"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
        />

        <el-input
          v-model="request.memberName"
          size="small"
          style="width: 150px; margin-left: 5px"
          :placeholder="t('fields.memberName')"
        />

        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadVipUpgradeRecord()"
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

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        prop="loginName"
        :label="t('fields.memberName')"
        width="200"
      />
      
      <el-table-column
        prop="beforeVip"
        :label="t('fields.dataBefore')"
        width="200"
      />

      <el-table-column
        prop="afterVip"
        :label="t('fields.dataAfter')"
        width="200"
      />

      <el-table-column
        prop="createBy"
        :label="t('fields.updateBy')"
        width="200"
      />

      <el-table-column
        prop="createTime"
        :label="t('fields.recordTime')"
        width="200"
      >
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
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
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import {
  getVipUpgradeRecord
} from '../../../api/member-vip'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from '@/utils/datetime'
import { formatInputTimeZone } from "@/utils/format-timeZone"

const { t } = useI18n()
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())
let timeZone = null

const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const formRef = ref(null);
const siteList = reactive({
  list: [],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  total: 0,
  totalAmount: 0,
})

const request = reactive({
  size: 30,
  current: 1,
  memberName: null,
  privilegeName: null,
  recordTime: [defaultStartDate, defaultEndDate],
  siteId: null,
})

const shortcuts = getShortcuts(t)
function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function resetQuery() {
  request.memberName = null
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.siteId = site.value ? site.value.id : siteList.list[0].id
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = JSON.parse(JSON.stringify(request.recordTime));
      query.recordTime[0] = formatInputTimeZone(query.recordTime[0], timeZone, 'start');
      query.recordTime[1] = formatInputTimeZone(query.recordTime[1], timeZone, 'end');
      query.recordTime = query.recordTime.join(',')
    }
  }
  return query;
}

async function loadVipUpgradeRecord() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await getVipUpgradeRecord(query)

  page.pages = ret.pages
  page.records = ret.records
  page.total = ret.total
  page.loading = false
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}


function changePage(page) {
  request.current = page
  loadVipUpgradeRecord()
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
    importForm.siteId = site.value.id
  } else {
    request.siteId = 1
    importForm.siteId = 1
  }
  await loadVipUpgradeRecord()
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

.el-input-number:deep .el-input__inner {
  text-align: left;
}
</style>
