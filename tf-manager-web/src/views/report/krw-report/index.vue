<template>
  <el-descriptions
    direction="vertical"
    :column="9"
    :size="size"
    border
  >
    <el-descriptions-item
      :label="t('fields.memberMoney')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.memberMoney }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.memberPoint')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.memberPoint }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.eggs')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.eggs }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.memberInquiry')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.memberInquiry }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.depositApplication')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.depositApplication }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.withdrawApplication')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.withdrawApplication }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.affiliateApplication')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.affiliateApplication }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.totalMembers')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.totalMembers }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.currentMembers')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.currentMembers }}
    </el-descriptions-item>
  </el-descriptions>
  <el-descriptions
    style="margin-top: 20px; width: 70%"
    direction="vertical"
    :column="5"
    :size="size"
    border
  >
    <el-descriptions-item
      :label="t('fields.todayDepositAmount')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.todayDepositAmount }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.todayWithdrawAmount')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.todayWithdrawAmount }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.todayWithdrawDepositProfit')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.todayDepositAmount - records.todayWithdrawAmount }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.manualMoney')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.manualMoney }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.manualPoint')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.manualPoint }}
    </el-descriptions-item>
  </el-descriptions>

  <el-descriptions
    style="margin-top: 20px"
    direction="vertical"
    :column="9"
    :size="size"
    border
  >
    <el-descriptions-item
      :label="t('fields.totalGrossProfit')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ (records.casinoProfit - records.casinoBetAmount - records.casinoRollingAmount)
        + (records.slotProfit - records.slotBetAmount - records.slotRollingAmount)
        + (records.sportProfit - records.sportBetAmount - records.sportRollingAmount)
        + (records.miniGameProfit - records.miniGameBetAmount - records.miniGameRollingAmount) }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.casinoBetAmount')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.casinoBetAmount }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.casinoProfit')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.casinoProfit }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.casinoRollingAmount')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.casinoRollingAmount }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.casinoGrossProfit')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.casinoProfit - records.casinoBetAmount - records.casinoRollingAmount }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.slotBetAmount')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.slotBetAmount }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.slotProfit')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.slotProfit }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.slotRollingAmount')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.slotRollingAmount }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.slotGrossProfit')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.slotProfit - records.slotBetAmount - records.slotRollingAmount }}
    </el-descriptions-item>
  </el-descriptions>

  <el-descriptions
    style="margin-top: 20px"
    direction="vertical"
    :column="8"
    :size="size"
    border
  >
    <el-descriptions-item
      :label="t('fields.sportBetAmount')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.sportBetAmount }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.sportProfit')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.sportProfit }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.sportRollingAmount')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.sportRollingAmount }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.sportGrossProfit')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.sportProfit - records.sportBetAmount - records.sportRollingAmount }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.miniGameBetAmount')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.miniGameBetAmount }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.miniGameProfit')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.miniGameProfit }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.miniGameRollingAmount')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.miniGameRollingAmount }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="t('fields.miniGameGrossProfit')"
      label-class-name="desc-label"
      class-name="desc-value"
    >
      {{ records.miniGameProfit - records.miniGameBetAmount - records.miniGameRollingAmount }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { getKoreaStatsReport } from '../../../api/report-centre'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const records = reactive({
  memberMoney: 0,
  memberPoint: 0,
  eggs: 0,
  memberInquiry: 0,
  depositApplication: 0,
  withdrawApplication: 0,
  affiliateApplication: 0,
  totalMembers: 0,
  currentMembers: 0,
  todayDepositAmount: 0,
  todayWithdrawAmount: 0,
  manualMoney: 0,
  manualPoint: 0,
  casinoBetAmount: 0,
  casinoProfit: 0,
  casinoRollingAmount: 0,
  slotBetAmount: 0,
  slotProfit: 0,
  slotRollingAmount: 0,
  sportBetAmount: 0,
  sportProfit: 0,
  sportRollingAmount: 0,
  miniGameBetAmount: 0,
  miniGameProfit: 0,
  miniGameRollingAmount: 0,
})

async function loadReport() {
  const { data: ret } = await getKoreaStatsReport();
  Object.keys({ ...ret }).forEach(field => {
    records[field] = ret[field]
  })
}

onMounted(async () => {
  await loadReport()
})
</script>

<style scoped>
:deep(.el-descriptions__table) {
  border-collapse: separate !important;
  border-spacing: 10px 0px;
  table-layout: fixed;
}
</style>
