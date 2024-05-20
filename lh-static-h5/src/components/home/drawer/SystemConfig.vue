<template>
  <div class="system-config-wrapper" v-if="store.memberType ==='TEST' || store.memberType==='PROMO_TEST'">
    <h5 class="system-config-title">系统设置</h5>
    <div class="system-config-inner-wrapper">
      <span>夜间模式</span>
      <q-toggle :model-value="$q.dark.isActive" @update:model-value="handleDarkModeToggle" />
    </div>
  </div>
</template>
<script setup>
import { useLocalStorage } from "@vueuse/core";
import { useQuasar } from "quasar";
import { userStore } from "src/stores";

const store= userStore();
const isDarkMode = useLocalStorage("DARK_MODE", false);
const $q = useQuasar();

const handleDarkModeToggle = (value) => {
  $q.dark.set(value);
  isDarkMode.value = value;
};
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

.body--dark {
  .system-config-wrapper {
    color: $font-3-dark;
  }
}
</style>
