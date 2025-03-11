<template>
  <div class="dashboard">
    <div style="display: grid; grid-template-columns: 1fr; gap: 20px">
      <Card>
        <template #content>
          <StatsComponent />
        </template>
      </Card>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px">
      <Card>
        <template #content>
          <RegisterDepositChart />
        </template>
      </Card>

      <Card>
        <template #content>
          <DepositorChart />
        </template>
      </Card>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px">
      <Card>
        <template #title>财务层次占比</template>
        <template #content>
          <FinancialProportionChart />
        </template>
      </Card>

      <Card>
        <template #content>
          <DepositAmountChart />
        </template>
      </Card>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px">
      <Card>
        <template #title>支付方式充值汇总</template>
        <template #content>
          <RechargeSummary />
        </template>
      </Card>

      <Card>
        <template #title>商务充值汇总</template>
        <template #content>
          <MerchantRechargeSummaryChart />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import StatsComponent from '@/components/Dashboard/StatsComponent.vue'
import RegisterDepositChart from '@/components/Dashboard/RegisterDepositChart.vue'
import FinancialProportionChart from '@/components/Dashboard/FinancialProportionChart.vue'
import DepositAmountChart from '@/components/Dashboard/DepositAmountChart.vue'
import RechargeSummary from '@/components/Dashboard/RechargeSummaryChart.vue'
import MerchantRechargeSummaryChart from '@/components/Dashboard/MerchantRechargeSummaryChart.vue'
import DepositorChart from '@/components/Dashboard/DepositorChart.vue'
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
