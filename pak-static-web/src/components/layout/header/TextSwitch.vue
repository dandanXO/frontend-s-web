<template>
  <div class="switch-wrapper">
    <button
      v-for="(tab, index) in tabs"
      :key="index"
      :class="{ active: activateTab === tab.value }"
      class="switch-item"
      @click="handleClick(tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
<script setup>
defineProps({
  tabs: {
    type: Array,
    default: () => []
  }
});

const activateTab = defineModel();

const handleClick = (tab) => {
  activateTab.value = tab;
};
</script>
<style scoped lang="scss">
.switch-wrapper {
  display: flex;
  gap: 4px;
  padding: 4px;
  background-color: #000a0199;
  border-radius: 10px;

  .switch-item {
    width: 108px;
    padding: 7px 0;
    border-radius: 10px;
    background: unset;
    border: none;
    font-family: Baloo Bhai 2;
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    text-align: center;
    color: #ffffff;

    &.active {
      background: var(--primary-linear-background-color);
    }
  }
}
</style>
