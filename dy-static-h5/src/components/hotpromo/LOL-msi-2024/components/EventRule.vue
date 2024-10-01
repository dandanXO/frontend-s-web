<template>
  <div class="rule-wrapper">
    <section-header label="活動規則" class="section-header" />
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
  font-size: 1rem;
  font-weight: 400;
  line-height: 1rem;
  text-align: left;
  color: #c4d5e9;
  display: flex;
  flex-direction: column;
  gap: 13px;

  > .rule-content-wrapper {
    display: flex;
    align-items: flex-start;
    background-color: #b4dbff1a;
    padding: 5px 3px 20px 3px;
  }

  .description-title {
    padding-left: 0.5rem;
    flex-shrink: 0;
    font-weight: 800;
  }
}
</style>
