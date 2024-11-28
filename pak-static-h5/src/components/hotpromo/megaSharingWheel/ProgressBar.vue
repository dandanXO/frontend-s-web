<template>
  <div class="progress-bar-wrapper">
    <div v-show="progress" class="progress-bar-inner" :style="{ width: progress + '%' }" />
    <span class="progress-text">
      <slot name="text">{{ progress }}%</slot>
    </span>
  </div>
</template>
<script setup>
import { toRefs } from "vue";

const props = defineProps({
  progress: {
    type: [Number, String],
    default: 0
  }
});

const { progress } = toRefs(props);
</script>
<style lang="scss" scoped>
.progress-bar-wrapper {
  height: 20px;
  background-color: #262626;
  background-clip: border-box;
  border-radius: 31px;
  border: 1px solid #ffffffcc;
  position: relative;
  .progress-bar-inner {
    height: 100%;
    background: linear-gradient(90deg, #ff9500 41%, #ffc471 100%);
    background-clip: border-box;
    border-radius: 31px;
    border: 1px solid #ffffffcc;
    transition: width 1s;
  }
  .progress-text {
    position: absolute;
    font-size: 12px;
    line-height: 18px;
    font-weight: 700;
    right: 15px;
    top: 0;
  }
}
</style>
