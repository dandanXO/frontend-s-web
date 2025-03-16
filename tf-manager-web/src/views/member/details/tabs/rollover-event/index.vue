<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px"
          @change="checkDateValue"
          :default-time="defaultTime"
          :editable="false"
          :clearable="false"
        />
        <el-select
          multiple
          v-model="request.eventType"
          size="small"
          :placeholder="t('fields.type')"
          class="filter-item"
          style="width: 400px; margin-left: 5px;"
        >
          <el-option
            v-for="item in request.eventType"
            :key="item.value"
            :label="t('rollover.rolloverEventType.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadMemberMoneyChange(true)"
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

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        height="600"
        size="small"
        :resizable="true"
        :data="page.records"
        @sort-change="sort"
        v-loading="page.loading"
        :empty-text="t('fields.noData')"
        :row-style="rowClass"
      >
        <el-table-column
          prop="eventType"
          :label="t('fields.type')"
          align="center"
          width="150"
        >
          <template #default="scope">
            <span>{{ t('rollover.rolloverEventType.' + scope.row.eventType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          :label="t('fields.recordTime')"
          align="center"
          width="200"
          sortable
        >
          <template #default="scope">
            <span v-if="scope.row.createTime === null">-</span>
            <span
              v-if="scope.row.recordTime !== null"
              v-formatter="{
                data: scope.row.createTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.content')" align="left" min-width="150">
          <template #default="scope">
            <span v-if="(scope.row.eventType === 'BALANCE_CHECK') || (scope.row.eventType === 'CREATE')">
              <span v-for="(line, index) in scope.row.content" :key="index">
                {{ line }}  <br>
              </span>
            </span>
            <span v-if="scope.row.eventType === 'UPDATE'">
              <span> platform:{{ scope.row.bet.platform }} </span><br>
              <span>transactionId:{{ scope.row.bet.transactionId }}</span><br>
              <span>ticket:{{ scope.row.bet.ticketNo }}</span><br>
              <span>bet:{{ scope.row.bet.bet }}, payout: {{ scope.row.bet.payout }}, rollover: {{ scope.row.bet.rollover }}</span><br>
              <span>----------------------------------------------------------------------------</span><br>
              <span v-for="(record, index) in scope.row.records" :key="index">
                id:{{ record.id }}, rollover:{{ record.amount }}  <br>
              </span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-sizes="[20, 50, 100, 150]"
        layout="sizes,prev, next"
        style="margin-top: 10px"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @current-change="loadMemberMoneyChange"
        @size-change="loadMemberMoneyChange(true)"
      />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, defineProps, reactive } from 'vue'
import moment from 'moment'
import {
  getRolloverEvents,
} from '../../../../../api/member'
import { useI18n } from 'vue-i18n'
import { formatInputTimeZone } from '@/utils/format-timeZone'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];

const { t } = useI18n()

const props = defineProps({
  mbrId: {
    type: String,
    required: true,
  },
  timeZone: {
    type: String,
    required: true,
  },
})

const startDate = new Date()
startDate.setDate(startDate.getDate())
const defaultStartDate = convertStartDate(startDate);
const defaultEndDate = convertDate(startDate);

const request = reactive({
  size: 20,
  current: 1,
  createTime: [defaultStartDate, defaultEndDate],
  eventType: ['CREATE', 'UPDATE', 'BALANCE_CHECK'],
  orderBy: 'recordTime',
  sortType: 'DESC',
})

const route = useRoute()
const site = reactive({
  id: route.query.site,
})

const checkDateValue = date => {
  const [startCheck, endCheck] = date
  const distract = moment(endCheck).diff(startCheck, 'days')
  if (distract >= 93) {
    ElMessage({
      message: t('message.startenddatemore3months'),
      type: 'error',
    })
    request.createTime = [defaultStartDate, defaultEndDate]
  }
}

function resetQuery() {
  request.createTime = [defaultStartDate, defaultEndDate]
  request.eventType = ['CREATE', 'UPDATE', 'BALANCE_CHECK']
  page.pagingState = null
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  pagingState: '',
})

const sort = column => {
  request.orderBy = column.prop
  if (column.order === 'descending') {
    request.sortType = 'DESC'
  } else {
    request.sortType = 'ASC'
  }
  loadMemberMoneyChange()
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD') + ' 23:59:59';
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

async function loadMemberMoneyChange(frombutton) {
  if (frombutton === true) {
    request.current = 1
    page.pagingState = null
  }

  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.createTime !== null) {
    if (request.createTime.length === 2) {
      query.createTime = JSON.parse(JSON.stringify(request.createTime))
      query.createTime[0] = formatInputTimeZone(
        query.createTime[0],
        props.timeZone
      )
      query.createTime[1] = formatInputTimeZone(
        query.createTime[1],
        props.timeZone
      )
      query.createTime = query.createTime.join(',')
    }
  }
  if (request.eventType !== null) {
    query.eventType = request.eventType.join(',')
  }
  query.siteId = site.id
  query.memberId = props.mbrId
  query.pagingState = page.pagingState
  const { data: ret } = await getRolloverEvents(props.mbrId, query)
  ret.records.forEach((record, index) => {
    console.log(record)
    record.content = record.content.split('|');
    if (record.eventType === 'UPDATE') {
      if (record.content.length === 2) {
        record.bet = JSON.parse(record.content[0])
        record.records = JSON.parse(record.content[1])
      }
    }
  })
  page.pages = ret.pages
  page.records = ret.records
  page.pagingState = ret.pagingState
  page.loading = false
}

function rowClass(row, index) {
  if (row.row.eventType === 'CREATE') {
    return { color: "green" }
  } else if (row.row.eventType === 'UPDATE') {
    return { color: "blue" }
  } else if (row.row.eventType === 'BALANCE_CHECK') {
    return { color: "red" }
  }
}

onMounted(() => {
  loadMemberMoneyChange()
})
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 20px 0;
  display: flex;
}

.search {
  display: flex;
  justify-content: flex-start;
}
</style>
