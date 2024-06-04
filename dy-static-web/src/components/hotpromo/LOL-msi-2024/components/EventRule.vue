<template>
  <div class="rule-wrapper">
    <section-header label="活动规则" class="section-header" />
    <div class="rule-content-wrapper">
      <slot />
    </div>
  </div>
</template>
<script setup>
import SectionHeader from "./SectionHeader.vue";
</script>
<style scoped lang="scss">
.rule-wrapper {
  font-family: Microsoft YaHei UI;
  font-size: 20px;
  font-weight: 400;
  line-height: 26px;
  color: #c4d5e9;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;

  > .rule-content-wrapper {
    display: flex;
    align-items: start;
    background-color: #b4dbff1a;
    padding: 16px 10px 18px 22px;
    border-radius: 19px;
  }

  .description-title {
    padding-left: 15px;
    flex-shrink: 0;
    font-weight: 800;
  }
}
</style>
