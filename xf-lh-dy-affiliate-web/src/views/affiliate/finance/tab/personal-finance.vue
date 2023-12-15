<template>
  <div class="inputs-wrap">
    <el-form @submit.prevent>
      <el-row :gutter="20">
        <el-col :xl="6" :lg="8" :md="10" :sm="12">
          <el-form-item :label="t('fields.recordTime') + ' :'">
            <el-date-picker
              v-model="request.recordTime"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              size="normal"
              class="input-small"
              type="daterange"
              range-separator=":"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
              :shortcuts="shortcuts"
              :disabled-date="disabledDate"
              :editable="false"
              :clearable="false"
              style="width:100%"
            />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="8" :sm="12">
          <div>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="loadFinanceReport()"
              size="normal"
            >
              {{ $t('fields.search') }}
            </el-button>
            <el-button size="normal" type="primary" plain @click="resetQuery()">
              {{ $t('fields.reset') }}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="grid-container">
      <div class="grid-item">
        <div class="grid-item-label">
          <span>{{ t('fields.deposit') }}</span>
          <el-link type="primary" :underline="false" @click="uiControl.depositDialogVisible = true">
            {{ t('fields.viewDetails') }}
          </el-link>
        </div>
        <div class="grid-item-value">
          {{ data.depositAmount }}
        </div>
      </div>
      <div class="grid-item">
        <div class="grid-item-label">
          <span>{{ t('fields.withdraw') }}</span>
        </div>
        <div class="grid-item-value">
          {{ data.withdrawAmount }}
        </div>
      </div>
      <div class="grid-item">
        <div class="grid-item-label">
          <span>{{ t('fields.bonus') }}</span>
          <el-link type="primary" :underline="false" @click="uiControl.bonusDialogVisible = true">
            {{ t('fields.viewDetails') }}
          </el-link>
        </div>
        <div class="grid-item-value">
          {{ data.bonusAmount }}
        </div>
      </div>
      <div class="grid-item">
        <div class="grid-item-label">
          <span>{{ t('fields.rebate') }}</span>
        </div>
        <div class="grid-item-value">
          {{ data.rebateAmount }}
        </div>
      </div>
      <div class="grid-item">
        <div class="grid-item-label">
          <span>{{ t('fields.platformFee') }}</span>
          <el-link type="primary" :underline="false" @click="uiControl.platformDialogVisible = true">
            {{ t('fields.viewDetails') }}
          </el-link>
        </div>
        <div class="grid-item-value">
          {{ data.platformFeeAmount }}
        </div>
      </div>
      <div class="grid-item">
        <div class="grid-item-label">
          <span>{{ t('fields.winLoss') }}</span>
          <el-link type="primary" :underline="false" @click="uiControl.winLossDialogVisible = true">
            {{ t('fields.viewDetails') }}
          </el-link>
        </div>
        <div class="grid-item-value">
          {{ data.totalWinLoss }}
        </div>
      </div>
      <div class="grid-item">
        <div class="grid-item-label">
          <span>{{ t('fields.paymentFee') }}</span>
        </div>
        <div class="grid-item-value">
          {{ data.paymentFeeAmount }}
        </div>
      </div>
      <div class="grid-item">
        <div class="grid-item-label">
          <span>{{ t('fields.winLoss') }}</span>
        </div>
        <div class="grid-item-value">
          {{ data.netWinLoss }}
        </div>
      </div>
      <div class="grid-item">
        <div class="grid-item-label">
          <span>{{ t('fields.adjustment') }}</span>
        </div>
        <div class="grid-item-value">
          {{ data.adjustmentAmount }}
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    :title="t('fields.depositRecord')"
    v-model="uiControl.depositDialogVisible"
    width="900px"
    append-to-body
  >
    <el-table
      :data="data.depositData"
      height="380"
    >
      <template #empty>
        <emptyComp />
      </template>
      <el-table-column
        prop="type"
        :label="t('fields.paymentMethod')"
        align="left"
      />
      <el-table-column
        prop="amount"
        :label="t('fields.depositAmount')"
        align="left"
      />
    </el-table>
  </el-dialog>
  <el-dialog
    :title="t('fields.bonus')"
    v-model="uiControl.bonusDialogVisible"
    width="900px"
    append-to-body
  >
    <el-table
      :data="data.bonusData"
      height="380"
    >
      <template #empty>
        <emptyComp />
      </template>
      <el-table-column
        prop="type"
        :label="t('fields.privilegeType')"
        align="left"
      />
      <el-table-column
        prop="amount"
        :label="t('fields.bonus')"
        align="left"
      />
    </el-table>
  </el-dialog>
  <el-dialog
    :title="t('fields.platformFee')"
    v-model="uiControl.platformDialogVisible"
    width="900px"
    append-to-body
  >
    <el-table
      :data="data.winLossData"
      height="380"
    >
      <template #empty>
        <emptyComp />
      </template>
      <el-table-column
        prop="type"
        :label="t('fields.platform')"
        align="left"
      />
      <el-table-column
        prop="winLoss"
        :label="t('fields.winLoss')"
        align="left"
      />
      <el-table-column
        prop="percentage"
        :label="t('fields.platformFeePercentage')"
        align="left"
      />
      <el-table-column
        :label="t('fields.platformFee')"
        align="left"
      >
        <template #default="scope">
          {{ scope.row.winLoss * scope.row.percentage }}
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <el-dialog
    :title="t('fields.winLoss')"
    v-model="uiControl.winLossDialogVisible"
    width="900px"
    append-to-body
  >
    <el-table
      :data="data.winLossData"
      height="380"
    >
      <template #empty>
        <emptyComp />
      </template>
      <el-table-column
        prop="type"
        :label="t('fields.platform')"
        align="left"
      />
      <el-table-column
        prop="winLoss"
        :label="t('fields.winLoss')"
        align="left"
      />
      <el-table-column
        prop="percentage"
        :label="t('fields.platformFeePercentage')"
        align="left"
      />
      <el-table-column
        :label="t('fields.platformFee')"
        align="left"
      >
        <template #default="scope">
          {{ scope.row.winLoss * scope.row.percentage }}
        </template>
      </el-table-column>
      <el-table-column
        prop="rollover"
        :label="t('fields.rolloverAmount')"
        align="left"
      />
    </el-table>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import { getFinanceReport } from '../../../../api/affiliate-finance-record'
import { useStore } from '@/store'
import emptyComp from "@/components/empty"

const store = useStore()
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

const uiControl = reactive({
  depositDialogVisible: false,
  bonusDialogVisible: false,
  platformDialogVisible: false,
  winLossDialogVisible: false,
})

const request = reactive({
  recordTime: [defaultStartDate, defaultEndDate],
})

const data = reactive({
  depositAmount: 0,
  withdrawAmount: 0,
  bonusAmount: 0,
  rebateAmount: 0,
  platformFeeAmount: 0,
  totalWinLoss: 0,
  paymentFeeAmount: 0,
  netWinLoss: 0,
  adjustmentAmount: 0,
  depositData: [],
  bonusData: [],
  winLossData: []
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime()
}

function resetQuery() {
  request.recordTime = [defaultStartDate, defaultEndDate]
}

async function loadFinanceReport() {
  const { data: ret } = await getFinanceReport(
    store.state.user.id,
    request.recordTime
  )
  Object.entries(ret).forEach(([key, value]) => {
    if (value) {
      data[key] = value
    } else {
      data[key] = 0
    }
  })
}

onMounted(() => {
  loadFinanceReport()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 20px auto;
}

.grid-item {
  height: 110px;
  position: relative;
  border: 1px solid #f2f2f6;
  border-radius: 8px;
  padding: 20px;
  background: #F4F9FD;
}

.grid-item-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;

  span {
    font-size: 16px;
    font-weight: 600;
    color: #afb3c8;
  }
}

.grid-item-value {
  font-size: 16px;
  font-weight: 700;
}
.el-form-item {
  align-items: center;
}
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(1, 1fr);
  }
}

</style>
