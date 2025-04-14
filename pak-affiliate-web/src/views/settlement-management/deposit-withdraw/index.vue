<template>
  <div class="page-container">
    <div class="panel-item">
      <div>
        <el-form @submit.prevent>
          <el-row :gutter="20">
            <el-col :span="4">
              <el-form-item :label="t('fields.type') + ' :'">
                <el-select clearable v-model="request.type" size="small" :placeholder="t('fields.type')"
                  class="filter-item">
                  <el-option :label="t('fields.deposit')" value="DEPOSIT" />
                  <el-option :label="t('fields.withdraw')" value="WITHDRAW" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item :label="t('fields.loginName') + ' :'">
                <el-input v-model="request.loginName" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="t('fields.recordTime') + ' :'">
                <el-date-picker v-model="request.recordTime" format="DD/MM/YYYY" value-format="YYYY-MM-DD" size="normal"
                  type="daterange" range-separator=":" :start-placeholder="t('fields.startDate')"
                  :end-placeholder="t('fields.endDate')" :shortcuts="shortcuts" :disabled-date="disabledDate"
                  :editable="false" :clearable="false" :default-time="defaultTime" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button style="margin-left: 20px" icon="el-icon-search" size="normal" type="success"
                @click="loadRecords()">
                {{ t('fields.search') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="custom-table-wrapper">
        <table cellpadding="0" cellspacing="0" border class="custom-table">
          <thead>
            <tr>
              <th scope="col">{{ t('fields.type') }}</th>
              <th scope="col">{{ t('fields.loginName') }}</th>
              <th scope="col">{{ t('fields.beforeBalance') }}</th>
              <th scope="col">{{ t('fields.amount') }}</th>
              <th scope="col">{{ t('fields.applicationDate') }}</th>
              <th scope="col">{{ t('fields.processingDate') }}</th>
              <th scope="col">{{ t('fields.status') }}</th>
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
              <td :data-label="t('fields.date')">
                {{ item.type }}
              </td>
              <td class="bgGreen textGreen">
                {{ item.memberName }}
              </td>
              <td class="bgRed textRed">
                {{ formatMoney(item.memberMoney) }}
              </td>
              <td class="bgYellow textRed">
                {{
                  formatMoney(
                    item.type === 'DEPOSIT'
                      ? item.todayDepositAmount
                      : item.todayWithdrawAmount
                  )
                }}
              </td>
              <td class="bgYellow textGreen">
                {{ formatDate(item.applicationDate) }}
              </td>
              <td class="bgYellow">
                {{ formatDate(item.processingDate) }}
              </td>
              <td class="bgYellow">
                {{ item.status }}
              </td>
            </tr>
          </tbody>
        </table>
        <el-pagination class="pagination" @current-change="changePage" layout="prev, pager, next"
        :page-size="request.size" :page-count="page.pages" :current-page="request.current" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n' 
import Loading from '@/components/loading/Loading.vue'
import { formatMoney } from '@/utils/format-money'
import { getDepositWithdrawRecord } from '@/api/affiliate-report'
import moment from "moment";
import emptyComp from '@/components/empty';

const { t } = useI18n()

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 20,
  current: 1,
  recordTime: [convertStartDate(new Date()), convertDate(new Date())],
  loginName: null,
  type: 'DEPOSIT',
})

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadRecords()
  }
}

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD');
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD');
}

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

function formatDate(date) {
  if (date === null || date.length === 0) {
    return "-"
  } else {
    let formatDate = moment(date[0] + "-" + zeroPad(date[1]) + "-" + zeroPad(date[2]) + " " + zeroPad(date[3]) + ":" + zeroPad(date[4]) + ":" + zeroPad(date[5]))
    return moment(formatDate).add(1, 'hours').locale('ko').format('LLL')
  }
}

function zeroPad(num) {
  return String(num).padStart(2, '0')
}

async function loadRecords() {
  page.loading = true;
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  query.recordTime = query.recordTime.join(',')
  const { data: ret } = await getDepositWithdrawRecord(query)
  page.records = ret.records
  page.pages = ret.pages
  page.total = ret.total
  page.loading = false
}
</script>

<style lang="scss" scoped></style>
