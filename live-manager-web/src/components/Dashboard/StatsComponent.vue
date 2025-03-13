<template>
  <DataView :value="[...Array(10).keys()]" :layout="layout">
    <template #grid="slotProps">
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px">
        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">{{ $t('statsComponent.totalFirstDeposit') }}</div>
              <div class="stats-label">{{ $t('statsComponent.amount') }} : 23,400.00</div>
              <div class="stats-label">{{ $t('statsComponent.pax') }} : 26</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">{{ $t('statsComponent.totalDeposits') }}</div>
              <div class="stats-label">{{ $t('statsComponent.amount') }} : 844,236.58</div>
              <div class="stats-label">{{ $t('statsComponent.pax') }} : 1112</div>
              <div class="stats-label">{{ $t('statsComponent.transactions') }} : 2,919</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">{{ $t('statsComponent.totalAgentRecharge') }}</div>
              <div class="stats-label">{{ $t('statsComponent.amount') }} : 0.00</div>
              <div class="stats-label">{{ $t('statsComponent.pax') }} : 0</div>
              <div class="stats-label">{{ $t('statsComponent.transactions') }} : 0</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">{{ $t('statsComponent.totalWithdrawals') }}</div>
              <div class="stats-label">{{ $t('statsComponent.amount') }} : 621,040.00</div>
              <div class="stats-label">{{ $t('statsComponent.pax') }} : 315</div>
              <div class="stats-label">{{ $t('statsComponent.transactions') }} : 567</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">{{ $t('statsComponent.totalCompanyWinLoss') }}</div>
              <div class="stats-label">{{ $t('statsComponent.amount') }} : 246,218.36</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">{{ $t('statsComponent.totalValidBets') }}</div>
              <div class="stats-label">{{ $t('statsComponent.amount') }} : 5,468,690.46</div>
              <div class="stats-label">{{ $t('statsComponent.pax') }} : 1656</div>
              <div class="stats-label">{{ $t('statsComponent.transactions') }} : 782,508</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">{{ $t('statsComponent.totalBonus') }}</div>
              <div class="stats-label">{{ $t('statsComponent.amount') }} : 3,057.00</div>
              <div class="stats-label">{{ $t('statsComponent.pax') }} : 27</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">{{ $t('statsComponent.totalActiveMembers') }}</div>
              <div class="stats-label">{{ $t('statsComponent.pax') }} : 0</div>
              <div class="stats-label">新注册会员 : 108</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">{{ $t('statsComponent.totalVisits') }}</div>
              <div class="stats-label">{{ $t('statsComponent.pax') }} : 0</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">{{ $t('statsComponent.totalCompanyProfit') }}</div>
              <div class="stats-label">{{ $t('statsComponent.amount') }} : 243,161.36</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DataView>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { DashboardService } from '@/service/DashboardService'

onMounted(() => {})

const layout = ref('grid')
</script>

<style lang="scss" scoped>
.stats-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.12),
    0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  padding: 10px;
  width: 80px;
  height: 80px;
}

.stats-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.stats-header {
  line-height: 18px;
  font-size: 16px;
  margin-bottom: 8px;
}

.stats-label {
  font-size: small;
  font-weight: 600;
}
</style>
