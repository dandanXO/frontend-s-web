<template>
  <div class="inputs-wrap">
    <el-form @submit.prevent>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="t('fields.recordTime') + ' :'">
            <el-date-picker
              v-model="request.recordTime"
              format="YYYY-MM"
              value-format="YYYY-MM"
              size="small"
              class="input-small"
              type="month"
              range-separator=":"
              :start-placeholder="t('fields.startDate')"
              :end-placeholder="t('fields.endDate')"
              :disabled-date="disabledDate"
              :editable="false"
              :clearable="false"
            />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <div>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="loadCommission()"
              size="mini"
            >
              {{ $t('fields.search') }}
            </el-button>
            <el-button size="mini" type="warning" @click="resetQuery()">
              {{ $t('fields.reset') }}
            </el-button>
          </div>
        </el-col>
      </el-row>
      <div class="display-container">
        <el-row>
          <el-col :span="12">
            {{ t('fields.activePlayer') }}
          </el-col>
          <el-col :span="12">
            {{ data.activePlayer }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.winLoss') }}
          </el-col>
          <el-col :span="12">
            {{ data.totalWinLoss }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.platformFee') }}
          </el-col>
          <el-col :span="12">
            {{ data.platformFeeAmount }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.bonus') }}
          </el-col>
          <el-col :span="12">
            {{ data.bonusAmount }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.accountAdjustment') }}
          </el-col>
          <el-col :span="12">
            {{ data.accountAdjustment }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.paymentFee') }}
          </el-col>
          <el-col :span="12">
            {{ data.paymentFeeAmount }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.commission') }}
          </el-col>
          <el-col :span="12">
            {{ data.commissionAmount }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.commissionRate') }}
          </el-col>
          <el-col :span="12">
            {{ data.commissionRate }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.commissionAdjustment') }}
          </el-col>
          <el-col :span="12">
            {{ data.commissionAdjustment }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.finalSum') }}
          </el-col>
          <el-col :span="12">
            {{ data.finalCommission }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.payStatus') }}
          </el-col>
          <el-col :span="12">
            {{ data.status }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            {{ t('fields.payTime') }}
          </el-col>
          <el-col :span="12">
            {{ data.payTime }}
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!-- <el-tag v-if="scope.row.status === 'CHECKING'" type="warning">{{ t('status.settlement.' + scope.row.status) }}</el-tag>
    <el-tag v-if="scope.row.status === 'CLEARED'" type="success">{{ t('status.settlement.' + scope.row.status) }}</el-tag> -->
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import { getMonthlyCommissionReport } from '../../../../api/affiliate-settlement'
import { useStore } from '@/store'

const store = useStore()
const { t } = useI18n()
const startDate = new Date()

const defaultMonth = moment(startDate).format('YYYY-MM')

const request = reactive({
  recordTime: defaultMonth,
})

const data = reactive({
  activePlayer: 0,
  totalWinLoss: 0,
  platformFeeAmount: 0,
  bonusAmount: 0,
  accountAdjustment: 0,
  paymentFeeAmount: 0,
  commissionAmount: 0,
  commissionRate: 0,
  commissionAdjustment: 0,
  finalCommission: 0,
  status: '-',
  payTime: '-',
})

function disabledDate(time) {
  return time.getTime() > new Date().getTime()
}

function resetQuery() {
  request.recordTime = defaultMonth
}

async function loadCommission() {
  const { data: ret } = await getMonthlyCommissionReport(
    store.state.user.id,
    request.recordTime
  )
  if (ret) {
    Object.entries(ret).forEach(([key, value]) => {
      if (value) {
        data[key] = value
      } else {
        data[key] = 0
      }
    })
  } else {
    data.activePlayer = 0
    data.totalWinLoss = 0
    data.platformFeeAmount = 0
    data.bonusAmount = 0
    data.accountAdjustment = 0
    data.paymentFeeAmount = 0
    data.commissionAmount = 0
    data.commissionRate = 0
    data.commissionAdjustment = 0
    data.finalCommission = 0
    data.status = '-'
    data.payTime = '-'
  }
}

onMounted(() => {
  loadCommission()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.info-container {
  border-radius: 5px;
  border: 1px solid #f2f2f6;
  padding: 0 20px;
  margin: 24px 0;
}

.display-container .el-row {
  padding: 15px 10px;
}

.display-container .el-row:nth-child(odd) {
  background-color: #f2f2f6;
}
</style>
