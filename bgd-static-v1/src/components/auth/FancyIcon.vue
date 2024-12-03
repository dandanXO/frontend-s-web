<template>
  <div class="fancy-icon-wrapper">
    <q-icon v-bind="{ ...$props, ...$attrs }" v-on="$props" />
  </div>
</template>
<script setup>
import { QIcon } from "quasar";

defineOptions({ inheritAttrs: false });

defineProps(QIcon.props);
</script>
<style lang="scss" scoped>
.fancy-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(../../assets/images/auth/icon-bg.png) no-repeat center center;
  background-size: cover;
  width: 100%;
  height: 100%;
  padding: 8px;
}
</style>
