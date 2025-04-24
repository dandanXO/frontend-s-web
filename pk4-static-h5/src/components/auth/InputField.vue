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
  // margin-top: 6px;
  // color: #98a6b4;
  margin: 3px 0;
  color: #b2bdbf;
  font-weight: 700;
}

.landing-input {
  :deep(.q-field__control) {
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 10px;
    // background-color: #0b0e0d;
    background-color: #EAEFF9;
    border: 1px solid #ffffff14;
    background: #EAEFF9;
    font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 700;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0px;
    vertical-align: middle;
    color: #b2bdbf;
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
  :deep(.q-field__native) {
    color: #7F8591;
  }
  // :deep(.q-icon) {

  //   background: #464f50;
  //   padding: 2px;
  //   border-radius: 5px;
  // }
}
</style>
