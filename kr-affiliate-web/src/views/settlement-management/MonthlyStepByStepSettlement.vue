<template>
  <div class="page-container">
    <div class="panel-item">
      <div>
        <el-form @submit.prevent>
          <el-row :gutter="20">
            <el-col :xl="8" :lg="8" :md="6" :sm="6">
              <el-form-item :label="t('fields.loginName') + ' :'">
                <el-input v-model="request.loginName" style="width: 350px;" maxlength="11" />
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
              <th scope="col">{{ t('fields.recordTime') }}</th>
              <th scope="col">{{ t('fields.deposit') }}</th>
              <th scope="col">{{ t('fields.withdraw') }}</th>
              <th scope="col">{{ t('fields.profit') }}</th>
              <th scope="col">{{ t('fields.totalBet') }}</th>
              <th scope="col">{{ t('fields.totalPayout') }}</th>
              <th scope="col">{{ t('fields.totalRolling') }}</th>
              <th scope="col">{{ t('statsHeader.totalProfitLoss') }}</th>
              <th scope="col">{{ t('statsHeader.casinoBetAmount') }}</th>
              <th scope="col">{{ t('statsHeader.casinoProfit') }}</th>
              <th scope="col">{{ t('statsHeader.casinoRollingAmount') }}</th>
              <th scope="col">{{ t('statsHeader.casinoProfitLoss') }}</th>
              <th scope="col">{{ t('statsHeader.slotBetAmount') }}</th>
              <th scope="col">{{ t('statsHeader.slotProfit') }}</th>
              <th scope="col">{{ t('statsHeader.slotRollingAmount') }}</th>
              <th scope="col">{{ t('statsHeader.slotProfitLoss') }}</th>
              <th scope="col">{{ t('statsHeader.sportBetAmount') }}</th>
              <th scope="col">{{ t('statsHeader.sportProfit') }}</th>
              <th scope="col">{{ t('statsHeader.sportRollingAmount') }}</th>
              <th scope="col">{{ t('statsHeader.sportProfitLoss') }}</th>
              <th scope="col">{{ t('statsHeader.miniGameBetAmount') }}</th>
              <th scope="col">{{ t('statsHeader.miniGameProfit') }}</th>
              <th scope="col">{{ t('statsHeader.miniGameRollingAmount') }}</th>
              <th scope="col">{{ t('statsHeader.miniGameProfitLoss') }}</th>
            </tr>
          </thead>
          <tbody v-if="page.loading || page.records.length === 0">
            <tr>
              <td colspan="24">
                <Loading v-if="page.loading" />
                <emptyComp v-else-if="page.records.length === 0" />
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="page.records.length > 0">
            <tr v-for="item in page.records" :key="item.id">
              <td :data-label="t('fields.recordTime')">
                {{ item.recordTime }}
              </td>
              <td :class="item.todayDepositAmount - item.withdrawApplication > 0 ? 'bgGreen' : 'bgRed'"
                v-formatter="{ data: item.todayDepositAmount, type: 'p&l' }">
              </td>
              <td :class="item.todayDepositAmount - item.withdrawApplication > 0 ? 'bgGreen' : 'bgRed'"
                v-formatter="{ data: item.withdrawApplication, type: 'p&l' }">
              </td>
              <td :class="item.todayDepositAmount - item.withdrawApplication > 0 ? 'bgGreen' : 'bgRed'"
                v-formatter="{ data: item.todayDepositAmount - item.withdrawApplication, type: 'p&l' }">
              </td>
              <td class="bgYellow"
                v-formatter="{ data: item.casinoBetAmount + item.slotBetAmount + item.sportBetAmount + item.miniGameBetAmount, type: 'p&l' }">
              </td>
              <td class="bgYellow" v-formatter="{
                data: item.casinoProfit + item.slotProfit + item.sportProfit + item.miniGameProfit, type: 'p&l'
              }">
              </td>
              <td class="bgYellow" v-formatter="{
                data: item.casinoRollingAmount + item.slotRollingAmount + item.sportRollingAmount +
                  item.miniGameRollingAmount, type: 'p&l'
              }">
              </td>
              <td
                :class="item.casinoBetAmount + item.slotBetAmount + item.sportBetAmount + item.miniGameBetAmount
                  - item.casinoProfit - item.slotProfit - item.sportProfit - item.miniGameProfit
                  - item.casinoRollingAmount - item.slotRollingAmount - item.sportRollingAmount - item.miniGameRollingAmount > 0 ? 'bgGreen' : 'bgRed'"
                v-formatter="{
                  data: item.casinoBetAmount + item.slotBetAmount + item.sportBetAmount + item.miniGameBetAmount
                  - item.casinoProfit - item.slotProfit - item.sportProfit - item.miniGameProfit
                  - item.casinoRollingAmount - item.slotRollingAmount - item.sportRollingAmount - item.miniGameRollingAmount, type: 'p&l'
                }">
              </td>
              <td class="bgYellow" v-formatter="{
                data: item.casinoBetAmount, type: 'p&l'
              }">
              </td>
              <td class="bgYellow" v-formatter="{
                data: item.casinoProfit, type: 'p&l'
              }">
              </td>
              <td class="bgYellow" v-formatter="{
                data: item.casinoRollingAmount, type: 'p&l'
              }">
              </td>
              <td :class="item.casinoProfit > 0 ? 'bgGreen' : 'bgRed'" v-formatter="{
                data: item.casinoBetAmount - item.casinoProfit - item.casinoRollingAmount, type: 'p&l'
              }">
              </td>
              <td class="bgYellow" v-formatter="{
                data: item.slotBetAmount, type: 'p&l'
              }">
              </td>
              <td class="bgYellow" v-formatter="{
                data: item.slotProfit, type: 'p&l'
              }">
              </td>
              <td class="bgYellow" v-formatter="{
                data: item.slotRollingAmount, type: 'p&l'
              }">
              </td>
              <td :class="item.slotProfit > 0 ? 'bgGreen' : 'bgRed'" v-formatter="{
                data: item.slotBetAmount - item.slotProfit - item.slotRollingAmount, type: 'p&l'
              }">
              </td>
              <td class="bgYellow" v-formatter="{
                data: item.sportBetAmount, type: 'p&l'
              }">
              </td>
              <td class="bgYellow" v-formatter="{
                data: item.sportProfit, type: 'p&l'
              }">
              </td>
              <td class="bgYellow" v-formatter="{
                data: item.sportRollingAmount, type: 'p&l'
              }">
              </td>
              <td :class="item.sportProfit > 0 ? 'bgGreen' : 'bgRed'" v-formatter="{
                data: item.sportBetAmount - item.sportProfit - item.sportRollingAmount, type: 'p&l'
              }">
              </td>
              <td class="bgYellow" v-formatter="{
                data: item.miniGameBetAmount, type: 'p&l'
              }">
              </td>
              <td class="bgYellow" v-formatter="{
                data: item.miniGameProfit, type: 'p&l'
              }">
              </td>
              <td class="bgYellow" v-formatter="{
                data: item.miniGameRollingAmount, type: 'p&l'
              }">
              </td>
              <td :class="item.miniGameProfit > 0 ? 'bgGreen' : 'bgRed'" v-formatter="{
                data: item.miniGameBetAmount - item.miniGameProfit - item.miniGameRollingAmount, type: 'p&l'
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
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import Loading from '@/components/loading/Loading.vue'
import { formatMoney } from '@/utils/format-money'
import moment from 'moment'
import { getMonthlySettlement } from '@/api/affiliate-report'
import emptyComp from '@/components/empty';

const { t } = useI18n()

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
  type: '',
})

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
  const { data: ret } = await getMonthlySettlement(query)
  page.records = ret.records
  page.pages = ret.pages
  page.total = ret.total
  page.loading = false
}
</script>

<style lang="scss" scoped>
.custom-table {

  tr {

    th:nth-child(1),
    td:nth-child(1),
    th:nth-child(4),
    td:nth-child(4),
    th:nth-child(8),
    td:nth-child(8) {
      border-right: 2px solid #ccc;
    }

    // td:nth-child(2) {
    //   background-color: #f4fff8;
    // }

    // td:nth-child(3) {
    //   background-color: #fff5f5;
    // }

    // td:nth-child(4) {
    //   background-color: #fffef7;
    // }
  }

  tbody tr {
    &:last-child {
      border-top-style: double;
      border-color: #cfd8dc;
    }
  }
}
</style>
