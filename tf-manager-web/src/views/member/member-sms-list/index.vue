<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.sendTime"
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
          v-model="request.phone"
          size="small"
          style="width: 200px; margin-left: 5px;"
          :placeholder="t('fields.smsPhone')"
        />
        <el-input
          v-model="request.type"
          size="small"
          style="width: 200px; margin-left: 5px;"
          :placeholder="t('fields.smsType')"
        />
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
          prop="phone"
          :label="t('fields.smsPhone')"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="content"
          :label="t('fields.smsContent')"
          align="center"
          min-width="300"
        />
        <el-table-column
          prop="status"
          :label="t('fields.status')"
          align="center"
          min-width="50"
        >
          <template #default="scope">
            <span v-if="scope.row.status === 0">发送中</span>
            <span v-if="scope.row.status === 1">成功</span>
            <span v-if="scope.row.status === 1">失败</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sendTime"
          :label="t('fields.smsSendTime')"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="type"
          :label="t('fields.smsType')"
          align="center"
          min-width="50"
        />
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
import { reactive } from 'vue'
import moment from 'moment'
import { getSmsList } from '../../../api/member-sms'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const date = new Date()
const defaultStartDate = convertStartDate(date)
const defaultEndDate = convertDate(date)

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
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
  {
    text: t('fields.last3Months'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(2, 'months')
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
]

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
  sendTime: [defaultStartDate, defaultEndDate],
  current: 1,
  type: null,
  telephone: null,
})

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  if (request.sendTime !== null) {
    if (request.sendTime.length === 2) {
      query.sendTime = request.sendTime.join(",");
    }
  }
  return query
}

async function loadSmsList() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await getSmsList(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

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
