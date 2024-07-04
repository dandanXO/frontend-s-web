<template>
  <el-form
    label-position="right"
    label-width="280px"
    style="margin-top: 20px;"
    :model="form"
  >
    <el-form-item :label="t('commissionInfo.monthlyTotalEffectiveTurnover')">
      <el-input
        :placeholder="
          t('commissionInfo.pleaseInsertMonthlyTotalEffectiveTurnover')
        "
        v-model="form.totalEffectiveTurnover"
        type="number"
        class="custom-input"
      />
    </el-form-item>
    <el-form-item :label="t('commissionInfo.monthlySettlement')">
      <el-input
        :placeholder="t('commissionInfo.pleaseInsertMonthlySettlement')"
        v-model="form.totalSettlement"
        type="number"
        class="custom-input"
      />
    </el-form-item>
    <el-form-item :label="t('commissionInfo.monthlyDividen')">
      <el-input
        :placeholder="t('commissionInfo.pleaseInsertMonthlyDividen')"
        v-model="form.totalDividen"
        type="number"
        class="custom-input"
      />
    </el-form-item>
    <el-form-item :label="t('commissionInfo.platformFee')">
      <div>{{ calculator.platformFeeByPercentage }} %</div>
    </el-form-item>
    <el-form-item :label="t('commissionInfo.monthlyTotalDeposit')">
      <el-input
        :placeholder="t('commissionInfo.pleaseInsertMonthlyTotalDeposit')"
        v-model="form.totalDeposit"
        type="number"
        class="custom-input"
      />
    </el-form-item>
    <el-form-item :label="t('commissionInfo.monthlyTotalWithdrawal')">
      <el-input
        :placeholder="t('commissionInfo.pleaseInsertMonthlyTotalWithdrawal')"
        v-model="form.totalWithdrawal"
        type="number"
        class="custom-input"
      />
    </el-form-item>
    <el-form-item :label="t('commissionInfo.totalCommissionAbleClaim')">
      <div>{{ calculator.totalCommission }}</div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleCalculator">
        {{ $t('commissionInfo.calculate') }}
      </el-button>
    </el-form-item>
  </el-form>
  <div class="note">
    {{ $t('commissionInfo.commissionCalculatorNote') }}
  </div>
</template>
<script setup>
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { onMounted, reactive } from 'vue'
import { getConfigs } from '../../../../api/system-config'
import { getAffiliateRecord } from '../../../../api/affiliate-record'

const store = useStore()
const { t } = useI18n()
const request = reactive({
  siteId: null,
})

const calculator = reactive({
  platformFee: 0,
  platformFeeByPercentage: 0,
  paymentFee: 0,
  paymentFeeByPercentage: 0,
  commission: 0,
  totalCommission: 0,
})

const form = reactive({
  totalEffectiveTurnover: 0,
  totalSettlement: 0,
  totalDividen: 0,
  totalDeposit: 0,
  totalWithdrawal: 0,
})

async function loadConfigs() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  query.siteId = store.state.user.siteId
  const { data: ret } = await getConfigs(query)

  const paymentFee = ret.find(obj => obj.code === 'payment_fee').value
  const paymentFeeByPercentage = paymentFee * 100

  calculator.paymentFee = paymentFee
  calculator.paymentFeeByPercentage = paymentFeeByPercentage

  const platformFee = ret.find(obj => obj.code === 'platform_fee').value
  const platformFeeByPercentage = platformFee * 100

  calculator.platformFee = platformFee
  calculator.platformFeeByPercentage = platformFeeByPercentage
}

async function loadAffiliateRecord() {
  const data = await getAffiliateRecord(store.state.user.id)

  calculator.commission = data?.data.commission
}

function handleCalculator() {
  const totalEffectiveTurnover = Number(form.totalEffectiveTurnover)
  const totalSettlement = Number(form.totalSettlement)
  const totalDividen = Number(form.totalDividen)
  const totalDeposit = Number(form.totalDeposit)
  const totalWithdrawal = Number(form.totalWithdrawal)
  const platformFee = Number(calculator.platformFee)
  const paymentFee = Number(calculator.paymentFee)
  const commission = Number(calculator.commission)

  const getTotal =
    (totalEffectiveTurnover -
      totalSettlement -
      totalDividen -
      totalEffectiveTurnover * platformFee -
      (totalDeposit + totalWithdrawal) * paymentFee) *
    commission

  calculator.totalCommission = getTotal
}

onMounted(() => {
  loadConfigs()
  loadAffiliateRecord()
})
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.custom-input {
  width: 200px; /* Adjust the width as needed */
}
.note {
  color: #FB560A;
}
/*
((总有效投注 - 总派彩) - 平账 - 红利 - ((总有效投注 - 总派彩） platform_fee) - ((存款 + 提款)  payment_fee)) * commission rate
= (totalEffectiveTurnover - Settlement - Dividen - (totalEffectiveTurnover * Platform Fee) - (totalDeposit + totalWithdrawal) * Payment Fee) * 0.5
*/
</style>
