<template>
  <div class="page-container">
    <div class="panel-item">
      <div>
        <el-form @submit.prevent>
          <el-row :gutter="20">
            <el-col :span="4">
              <el-form-item :label="t('fields.gameType') + ' :'">
                <el-select clearable v-model="request.gameTypes" size="small" :placeholder="t('fields.gameType')"
                  class="filter-item">
                  <el-option :label="t('fields.all')" value="" />
                  <el-option :label="t('gameType.SLOT')" value="SLOT" />
                  <el-option :label="t('gameType.LIVE')" value="LIVE" />
                  <el-option :label="t('gameType.MINIGAME')" value="FISH" />
                  <el-option :label="t('gameType.SPORT')" value="SPORT" />
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
              <th scope="col" class="textCenter">{{ t('fields.gameType') }}</th>
              <th scope="col" class="textCenter">{{ t('fields.loginName') }}</th>
              <th scope="col" class="textCenter">{{ t('fields.validBet') }}</th>
              <th scope="col" class="textCenter">{{ t('fields.rebatePercentage') }}</th>
              <th scope="col" class="textCenter">{{ t('fields.pointAmount') }}</th>
              <th scope="col" class="textCenter">{{ t('fields.recordTime') }}</th>
            </tr>
          </thead>
          <tbody v-if="page.loading || page.records.length === 0">
            <tr>
              <td colspan="11">
                <Loading v-if="page.loading" />
                <emptyComp v-else-if="page.records.length === 0" />
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="page.records.length > 0">
            <tr v-for="item in page.records" :key="item.id">
              <td v-formatter="{ data: item.gameType, type: 'gameType' }">
              </td>
              <td class="textCenter">
                <strong>{{ item.memberName }}</strong>
              </td>
              <td class="textRight">
                {{ formatMoney(item.betAmount) }}
              </td>
              <td class="textRight">
                {{ (item.rebatePercentage * 100).toFixed(2) }} %
              </td>
              <td class="textRight">
                {{ formatMoney(item.rebateAmount) }}
              </td>
              <td v-formatter="{ data: item.recordTime, type: 'date', formatter: 'LL' }">
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
import { formatMoney } from '@/utils/format-money'
import moment from 'moment'
import { getCommissionRecord } from '@/api/affiliate-report'
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
  gameTypes: '',
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

async function loadRecords() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.gameTypes === 'SPORT') {
    query.gameTypes = "SPORT,ESPORT"
  }
  query.recordTime = query.recordTime.join(',')
  const { data: ret } = await getCommissionRecord(query)
  page.records = ret.records
  page.pages = ret.pages
  page.total = ret.total
  page.loading = false
}

onMounted(() => {
  loadRecords();
})
</script>

<style lang="scss" scoped></style>
