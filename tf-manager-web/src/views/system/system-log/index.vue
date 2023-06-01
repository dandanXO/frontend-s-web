<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <span style="font-size: small;margin-top: 10px;margin-left:20px">
          {{ t('fields.operator') }}
        </span>

        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px;margin-left:20px"
          :placeholder="t('fields.operator')"
        />

        <span style="font-size: small;margin-top: 10px;margin-left:20px">
          {{ t('fields.operateTime') }}
        </span>

        <el-date-picker
          v-model="request.operateTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px;margin-left:20px"
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
          @click="loadSystemLog"
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
      v-loading="page.loading"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
    >
      <el-table-column
        prop="operatorName"
        :label="t('fields.operator')"
        width="200"
      />
      <el-table-column
        prop="operateTime"
        :label="t('fields.operateTime')"
        width="200"
      />
      <el-table-column
        prop="consumingTime"
        :label="t('fields.consumingTime')"
        width="200"
      />
      <el-table-column
        prop="ip"
        :label="t('fields.ip')"
        width="200"
      />
      <el-table-column
        prop="url"
        :label="t('fields.url')"
        width="200"
      />
      <el-table-column :label="t('fields.viewLog')" width="200">
        <template #default="scope">
          <el-link type="primary" @click="show(scope.row)"> {{ t('fields.view') }} </el-link>
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
  <el-dialog
    :title="t('fields.param')"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="580px"
  >
    <p>{{ t('fields.responseBody') }} : {{ uiControl.responseBody }}</p>
    <p>{{ t('fields.requestParam') }} : {{ uiControl.requestParam }}</p>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { getSystemLog } from '../../../api/system-log'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import { ElMessage } from "element-plus";
const { t } = useI18n()
const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogLoading: false,
  requestParam: "",
  responseBody: ""
})
const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})
const request = reactive({
  size: 30,
  current: 1,
  name: null,
  operateTime: [defaultStartDate, defaultEndDate],
})

const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date()
      const start = new Date()
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
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'days')
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
          .startOf('week')
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
          .startOf('week')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'weeks')
          .endOf('week')
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

function disabledDate(time) {
  return (
    time.getTime() <=
      moment(new Date())
        .subtract(4, 'weeks')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function resetQuery() {
  request.name = null
}

async function loadSystemLog() {
  page.loading = true
  console.log(request.name)
  if (request.name === null || request.name === "") {
    ElMessage.error(t('message.validateLoginNameRequired'));
  } else {
    const requestCopy = { ...request }
    const query = {}
    Object.entries(requestCopy).forEach(([key, value]) => {
      if (value) {
        query[key] = value
      }
    })
    if (request.operateTime !== null) {
      if (request.operateTime.length === 2) {
        query.operateTime = request.operateTime.join(',')
      }
    }
    const { data: ret } = await getSystemLog(query)
    page.pages = ret.pages
    page.records = ret.records
  }
  page.loading = false
}

function changePage(page) {
  request.current = page
  loadSystemLog()
}

function show(log) {
  uiControl.dialogVisible = true
  uiControl.responseBody = log.responseBody
  uiControl.requestParam = log.requestParam
}

onMounted(() => {
  // loadSystemLog()
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
