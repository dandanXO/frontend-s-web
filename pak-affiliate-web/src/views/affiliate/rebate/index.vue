<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('menu.Rebate Report') }}</span>
        </div>
      </template>
      <div class="inputs-wrap">
        <el-form @submit.prevent inline="true">
          <el-form-item :label="t('fields.gameType') + ' :'">
            <el-select
              style="width: 100%;"
              size="normal"
              v-model="request.gameType"
            >
              <el-option key="1" value="LIVE" :label="t('gameType.LIVE')" />
              <el-option key="2" value="SPORT" :label="t('gameType.SPORT')" />
              <el-option key="3" value="SLOT" :label="t('gameType.SLOT')" />
              <el-option key="4" value="FISH" :label="t('gameType.MINIGAME')" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.recordTime') + ' :'">
            <el-date-picker
              v-model="request.recordTime"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator=":"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
              style="width: 300px; margin-left: 10px"
              :shortcuts="shortcuts"
              :disabled-date="disabledDate"
              :editable="false"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item>
            <div class="grp-btn">
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="loadBetRebateRecords()"
                size="normal"
              >
                {{ $t('fields.search') }}
              </el-button>
              <el-button
                size="normal"
                type="primary"
                plain
                @click="resetQuery()"
              >
                {{ $t('fields.reset') }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <table
        style="width: 98%; margin: 0 auto;"
        cellpadding="0"
        cellspacing="0"
        border="0"
        class="custom-table"
      >
        <thead>
          <tr>
            <th>{{ t('fields.gameType') }}</th>
            <th>{{ t('fields.betAmount') }}</th>
            <th>{{ t('fields.rebateAmount') }}</th>
            <th>{{ t('fields.status') }}</th>
            <th>{{ t('fields.recordTime') }}</th>
            <th>{{ t('fields.payTime') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in page.records" :key="record.id">
            <td>
              <span v-if="record.gameType === null">-</span>
              <span v-if="record.gameType !== null">
                {{ t(`gameType.${record.gameType}`) }}
              </span>
            </td>
            <td>
              <span v-if="record.betAmount === null">-</span>
              <span v-if="record.betAmount !== null">
                <span v-formatter="{data: record.betAmount,type: 'money'}" />
              </span>
            </td>
            <td>
              <span v-if="record.rebateAmount === null">-</span>
              <span v-if="record.rebateAmount !== null">
                <span v-formatter="{data: record.rebateAmount,type: 'money'}" />
              </span>
            </td>
            <td>
              <span v-if="record.status === null">-</span>
              <span v-if="record.status !== null">
                {{ t(`rebateStatus.${record.status}`) }}
              </span>
            </td>
            <td>
              <span v-if="record.recordTime === null">-</span>
              <span v-if="record.recordTime !== null">
                {{ record.recordTime }}
              </span>
            </td>
            <td>
              <span v-if="record.distributeTime === null">-</span>
              <span v-if="record.distributeTime !== null">
                {{ record.distributeTime }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="page.records.length === 0">
        <emptyComp />
      </div>
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
import { onMounted, reactive } from 'vue'
import { getRebateRecords } from '../../../api/affiliate-bet-rebate-record'
import { useI18n } from 'vue-i18n'
import emptyComp from '@/components/empty'
import moment from 'moment'

const { t } = useI18n()
const startDate = new Date()
const defaultStartDate = convertDate(
  startDate.setTime(
    moment(startDate)
      .startOf('month')
      .format('x')
  )
)
const defaultEndDate = convertDate(new Date())
const request = reactive({
  gameType: null,
  recordTime: [defaultStartDate, defaultEndDate],
  size: 20,
  current: 1,
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

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
]

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

function resetQuery() {
  request.gameType = null
  request.recordTime = [defaultStartDate, defaultEndDate]
}

async function loadBetRebateRecords() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
  }
  const { data: ret } = await getRebateRecords(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadBetRebateRecords()
  }
}

onMounted(async () => {
  loadBetRebateRecords()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

::v-deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}

.btn-group {
  margin-top: 15px;
  margin-left: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}

.inputs-wrap {
  margin: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  .input-small {
    width: 100%;
    max-width: 200px;
    &.el-range-editor--small.el-input__inner {
      max-width: 300px;
    }
  }
  .btn-grp {
    display: flex;
  }
}

@media (max-width: 768px) {
  .inputs-wrap {
    flex-direction: column;
    gap: 10px;
    .el-input--small {
      width: 100% !important;
      max-width: unset !important;
      margin: 0 !important;
      .el-button {
        margin: 0 !important;
      }
    }
    .input-small {
      max-width: unset;
      width: 100%;
      &.el-range-editor--small.el-input__inner {
        max-width: unset;
      }
    }
  }
}
</style>
