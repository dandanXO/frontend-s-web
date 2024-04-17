<template>
  <div class="system-config-wrapper">
    <h5 class="system-config-title">系统设置</h5>
    <div class="system-config-inner-wrapper">
      <span>夜间模式</span>
      <q-toggle v-model="isToggle" />
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
const isToggle = ref(false);
</script>
<style scoped lang="scss">
.system-config-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;
  color: $font-4;
}

.system-config-title {
  font-size: 20px;
  margin: 0;
  line-height: 28px;
}

.system-config-inner-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  :deep(.q-toggle__inner--truthy) {
    color: #4877f6;
  }
}
</style>
