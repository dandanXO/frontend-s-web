<template>
  <div class="section-wrapper">
    <div class="section-header">
      <span class="section-header__title">{{ title }}</span>
      <router-link class="section-header__link" :to="to">View All</router-link>
    </div>
    <div class="section-content-wrapper">
      <slot />
    </div>
  </div>
</template>
<script setup>
defineProps({
  title: String,
  to: String
});
</script>
<style scoped lang="scss">
.section-wrapper {
  display: flex;
  flex-direction: column;
  gap: 25px;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: sans-serif;
    font-size: 20px;
    font-weight: 700;
    line-height: 24.2px;

    .section-header__title {
      color: #ffffff;
    }

    .section-header__link {
      color: #9f9f9f;
    }
  }
}
</style>
