<template>
  <DataView :value="products" :layout="layout">
    <template #grid="slotProps">
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px">
        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">总首存</div>
              <div class="stats-label">金额 : 23,400.00</div>
              <div class="stats-label">人数 : 26</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">总存款</div>
              <div class="stats-label">金额 : 844,236.58</div>
              <div class="stats-label">人数 : 1112</div>
              <div class="stats-label">笔数 : 2,919</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">总代充</div>
              <div class="stats-label">金额 : 0.00</div>
              <div class="stats-label">人数 : 0</div>
              <div class="stats-label">笔数 : 0</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">总提款</div>
              <div class="stats-label">金额 : 621,040.00</div>
              <div class="stats-label">人数 : 315</div>
              <div class="stats-label">笔数 : 567</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">总公司输赢</div>
              <div class="stats-label">金额 : 246,218.36</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">总有效投注</div>
              <div class="stats-label">金额 : 5,468,690.46</div>
              <div class="stats-label">人数 : 1656</div>
              <div class="stats-label">笔数 : 782,508</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">总彩金</div>
              <div class="stats-label">金额 : 3,057.00</div>
              <div class="stats-label">人数 : 27</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">总活跃会员</div>
              <div class="stats-label">人数 : 0</div>
              <div class="stats-label">新注册会员 : 108</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">总访问量</div>
              <div class="stats-label">人数 : 0</div>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="stats-item">
            <img src="../../assets/stats.svg" class="stats-icon" />

            <div>
              <div class="stats-header">总公司盈利</div>
              <div class="stats-label">金额 : 243,161.36</div>
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

onMounted(() => {
  DashboardService.getProducts().then((data) => (products.value = data.slice(0, 12)))
})

const products = ref()
const layout = ref('grid')
const options = ref(['list', 'grid'])
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
  align-items: center;
  gap: 15px;
}

.stats-header {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 8px;
}

.stats-label {
  font-size: small;
  font-weight: 600;
}
</style>
