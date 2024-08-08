<template>
  <div class="page-container">
    <div class="panel-item">
      <div>
        <el-form @submit.prevent>
          <el-row :gutter="20">
            <el-col :xl="8" :lg="8" :md="6" :sm="6">
              <el-form-item :label="t('fields.loginName') + ' :'">
                <el-input v-model="request.loginName" />
              </el-form-item>
            </el-col>
            <el-col :xl="8" :lg="8" :md="10" :sm="8">
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
              <th scope="col" class="textCenter">{{ t('fields.loginName') }}</th>
              <th scope="col" class="textCenter">{{ t('fields.deposit') }}</th>
              <th scope="col" class="textCenter">{{ t('fields.withdraw') }}</th>
              <th scope="col" class="textCenter">{{ t('fields.bet') }}</th>
              <th scope="col" class="textCenter">{{ t('fields.payout') }}</th>
              <th scope="col" class="textCenter">{{ t('fields.rolling') }}</th>
              <th scope="col" class="textCenter">{{ t('fields.profit') }}</th>
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
            <tr>
              <td class="textCenter">
                Total
              </td>
              <td v-formatter="{ data: totals.todayDepositAmount, type: 'p&l' }"></td>
              <td v-formatter="{ data: totals.todayWithdrawAmount, type: 'p&l' }"></td>
              <td v-formatter="{ data: totals.casinoBetAmount, type: 'p&l' }"></td>
              <td v-formatter="{ data: totals.casinoProfit, type: 'p&l' }"></td>
              <td v-formatter="{ data: totals.casinoRollingAmount, type: 'p&l' }"></td>
              <td v-formatter="{
                data:
                  totals.casinoProfit -
                  totals.casinoBetAmount +
                  totals.casinoRollingAmount,
                type: 'p&l',
              }"></td>
            </tr>
            <tr v-for="item in page.records" :key="item.id">
              <td class="textCenter">
                {{ item.memberName }}
              </td>
              <td v-formatter="{ data: item.todayDepositAmount, type: 'p&l' }">
              </td>
              <td v-formatter="{ data: item.todayWithdrawAmount, type: 'p&l' }">
              </td>
              <td v-formatter="{ data: item.casinoBetAmount, type: 'p&l' }">
              </td>
              <td v-formatter="{ data: item.casinoProfit, type: 'p&l' }">
              </td>
              <td v-formatter="{ data: item.casinoRollingAmount, type: 'p&l' }">
              </td>
              <td v-formatter="{
                data: item.casinoProfit -
                  item.casinoBetAmount +
                  item.casinoRollingAmount, type: 'p&l'
              }">
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
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Loading from '@/components/loading/Loading.vue'
import { getMemberSummary } from '@/api/affiliate-report'
import moment from 'moment'
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
})

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadRecords()
  }
}

function convertStartDate(date) {
  return moment(date)
    .startOf('day')
    .format('YYYY-MM-DD')
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

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

const totals = reactive({
  todayDepositAmount: 0,
  todayWithdrawAmount: 0,
  casinoBetAmount: 0,
  casinoProfit: 0,
  casinoRollingAmount: 0,
})

async function loadRecords() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  query.recordTime = query.recordTime.join(',')
  const { data: ret } = await getMemberSummary(query)
  page.records = ret.records
  page.pages = ret.pages
  page.total = ret.total
  page.loading = false
  totals = page.records.reduce((acc, curr) => {
    acc.todayDepositAmount += curr.todayDepositAmount
    acc.todayWithdrawAmount += curr.todayWithdrawAmount
    acc.casinoBetAmount += curr.casinoBetAmount
    acc.casinoProfit += curr.casinoProfit
    acc.casinoRollingAmount += curr.casinoRollingAmount
    return acc
  })
}

onMounted(() => {
  loadRecords();
})
</script>

<style lang="scss" scoped>
.custom-table {
  tbody tr {
    &:first-child {
      border-bottom-style: double;
      border-color: #cfd8dc;
    }
  }
}
</style>
