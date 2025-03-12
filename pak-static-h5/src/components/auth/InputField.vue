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
  // color: #98a6b4;
    color: #ffffff;
    font-weight: 700;
}

.landing-input {
  :deep(.q-field__control) {
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 10px;
    // background-color: #0b0e0d;
    background-color: #0b0e0d;
    border: 1px solid #FFFFFF14;
    background: #292D2E;
    font-family: Microsoft YaHei UI;
    font-weight: 700;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0px;
    vertical-align: middle;
    color: #B2BDBF;
    height: unset;
  }
  :deep(.q-field__control):before {
    // border-color: #072a19;
    // // background-color: #0b0e0d;
    // border-width: 2px;
    // border-radius: 10px;
    border: 0;
  }
  :deep(.q-field__marginal) {
    height: unset;
  }
  // :deep(.q-icon) {
    
  //   background: #464f50;
  //   padding: 2px;
  //   border-radius: 5px;
  // }
}
</style>
