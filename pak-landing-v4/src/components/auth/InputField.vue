<template>
  <span class="form-field-label">{{ props.label }}</span>
  <div class="landing-input">
    <slot name="input"></slot>
  </div>
</template>

<script setup>
const props = defineProps(["label"]);
</script>

<style lang="scss" scoped>
.form-field-label {
  margin-top: 6px;
  color: #98a6b4;
}

.landing-input {
  :deep(.q-field__control) {
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 10px;
    background-color: #0b0e0d;
  }
  :deep(.q-field__control):before {
    border-color: #072a19;
    // background-color: #0b0e0d;
    border-width: 2px;
    border-radius: 10px;
  }
}
</style>
