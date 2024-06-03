<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">{{ activeName }}</span>
    </div>
    
    <div class="account-content">
    <el-tabs v-model="activeName">
        <el-tab-pane label="Deposit" name="Deposit">
          <DepositComponent />
        </el-tab-pane>
        <el-tab-pane label="Withdraw" name="Withdraw">
          <WithdrawPage />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DepositComponent from "@/components/depositComponent.vue";
import WithdrawPage from "@/views/finance/WithdrawView.vue";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
components: {
    DepositComponent,
    WithdrawPage
}
const route = useRoute();
const router = useRouter()
const activeName = ref('Deposit');
// Function to check the route query parameter and update activeName
const checkRoute = () => {
  if (route.query.tab === 'withdraw') {
    activeName.value = 'Withdraw'
  } else {
    activeName.value = 'Deposit'
  }
}

// Initial check on mounted
onMounted(() => {
  checkRoute()
})

// Watch for changes in the route query parameter
watch(() => route.query.tab, (newTab) => {
  checkRoute()
})
watch(() => activeName.value, () => {
  if(activeName.value === 'Withdraw') {
    router.push({query: { tab: 'withdraw'}})
  }
})
</script>
<style scoped lang="scss">
:deep(.el-tabs__item) {
  color: #8C968F;
}
:deep(.el-tabs__item.is-active), :deep(.el-tabs__item:hover) {
  color: #ffffff;
}
:deep(.el-tabs__item.is-active) {
  
  font-family: 'Poppins Bold';
}
:deep(.el-tabs__active-bar.is-top) {
  background: #70BC62;
}
</style>
