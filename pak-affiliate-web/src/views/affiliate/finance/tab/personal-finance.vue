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
              size="small"
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
              size="mini"
            >
              {{ $t('fields.search') }}
            </el-button>
            <el-button size="mini" type="primary" plain @click="resetQuery()">
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
      <!-- <div class="grid-item">
        <div class="grid-item-label">
          <span>{{ t('fields.paymentFee') }}</span>
        </div>
        <div class="grid-item-value">
          {{ data.paymentFeeAmount }}
        </div>
      </div> -->
      <div class="grid-item">
        <div class="grid-item-label">
          <span>{{ t('fields.netProfit') }}</span>
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
    modal-class="dialog700"
    width="90%"
  >
    <table class="custom-table" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0 auto;">
      <thead>
        <tr>
          <th scope="col">{{ t('fields.paymentMethod') }}</th>
          <th scope="col">{{ t('fields.depositAmount') }}</th>
        </tr>
      </thead>
      <tbody v-if="data.depositData.length > 0">
        <tr v-for="item in data.depositData" :key="item.id">
          <td :data-label="t('fields.paymentMethod')">{{ item.type }}</td>
          <td :data-label="t('fields.depositAmount')">{{ item.amount }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="data.depositData.length === 0">
      <emptyComp />
    </div>
  </el-dialog>
  <el-dialog
    :title="t('fields.bonus')"
    v-model="uiControl.bonusDialogVisible"
    modal-class="dialog700"
    width="90%"
  >
    <table class="custom-table" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0 auto;">
      <thead>
        <tr>
          <th scope="col">{{ t('fields.privilegeType') }}</th>
          <th scope="col">{{ t('fields.bonus') }}</th>
        </tr>
      </thead>
      <tbody v-if="data.bonusData.length > 0">
        <tr v-for="item in data.bonusData" :key="item.id">
          <td :data-label="t('fields.privilegeType')">{{ item.type }}</td>
          <td :data-label="t('fields.bonus')">{{ item.amount }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="data.bonusData.length === 0">
      <emptyComp />
    </div>
  </el-dialog>
  <el-dialog
    :title="t('fields.platformFee')"
    v-model="uiControl.platformDialogVisible"
    modal-class="dialog700"
    width="90%"
  >
    <table class="custom-table" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0 auto;">
      <thead>
        <tr>
          <th scope="col">{{ t('fields.platform') }}</th>
          <th scope="col">{{ t('fields.winLoss') }}</th>
          <th scope="col">{{ t('fields.platformFeePercentage') }}</th>
          <th scope="col">{{ t('fields.platformFee') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data.winLossData" :key="item.id">
          <td :data-label="t('fields.platform')">{{ item.type }}</td>
          <td :data-label="t('fields.winLoss')">{{ item.winLoss }}</td>
          <td :data-label="t('fields.platformFeePercentage')">{{ item.percentage }}</td>
          <td :data-label="t('fields.platformFee')">{{ item.winLoss * item.percentage }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="data.winLossData.length === 0">
      <emptyComp />
    </div>
  </el-dialog>
  <el-dialog
    :title="t('fields.winLoss')"
    v-model="uiControl.winLossDialogVisible"
    modal-class="dialog700"
    width="90%"
  >
    <table class="custom-table" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0 auto;">
      <thead>
        <tr>
          <th scope="col">{{ t('fields.platform') }}</th>
          <th scope="col">{{ t('fields.winLoss') }}</th>
          <th scope="col">{{ t('fields.platformFeePercentage') }}</th>
          <th scope="col">{{ t('fields.platformFee') }}</th>
          <th scope="col">{{ t('fields.rolloverAmount') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data.winLossData" :key="item.id">
          <td :data-label="t('fields.platform')">{{ item.type }}</td>
          <td :data-label="t('fields.winLoss')">{{ item.winLoss }}</td>
          <td :data-label="t('fields.platformFeePercentage')">{{ item.percentage }}</td>
          <td :data-label="t('fields.platformFee')">{{ item.winLoss * item.percentage }}</td>
          <td :data-label="t('fields.rolloverAmount')">{{ item.rollover }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="data.winLossData.length === 0">
      <emptyComp />
    </div>
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
    color: #7D8592;
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
    grid-template-columns: repeat(2, 1fr);
  }
  .grid-item {
    text-align: center;
    padding: 15px
  }
  .grid-item-label {
    margin-bottom: 15px;
    justify-content: center;
  }
  .grid-item-label a {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}

</style>
<style>
.dialog700 .el-dialog {
  max-width: 700px;
}
</style>
