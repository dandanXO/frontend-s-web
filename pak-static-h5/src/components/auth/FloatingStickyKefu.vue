<template>
    <q-page-sticky
      v-if="ui.CSAUrl"
      style="z-index: 3000"
      position="bottom-right"
      :offset="csDragPos"
      class="floating-btn scalable"
      :style="{ transform: `scale(${scaleValue})` }"
    >
      <div v-touch-pan.prevent.mouse="moveCsIcon" ref="csTabRef">
        <a :href="ui.CSAUrl" target="_blank">
            <div class="cs-icon-wrapper"></div>
        </a>
      </div>
    </q-page-sticky>
</template>

<script setup>
import { ref } from 'vue';
import { useUI } from "stores/ui";

const scaleValue = ref(1);
const csDragPos = ref([10, 170]);
const isDraggingCsIcon = ref(false);
const ui = useUI();

const moveCsIcon = (ev) => {
  isDraggingCsIcon.value = ev.isFirst !== true && ev.isFinal !== true;

  csDragPos.value = [csDragPos.value[0] - ev.delta.x, csDragPos.value[1] - ev.delta.y];
};
</script>

<style lang="scss" scoped>
.cs-icon-wrapper {
  width: 55px;
  height: 55px;
  background: url("../../assets/images/index/icon-cs-auth.gif") no-repeat center center;
  background-size: contain;
  position: relative;
  aspect-ratio: 500/500;

  .cs-icon {
    position: absolute;
    width: 48px;
    height: 48px;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    pointer-events: none;
  }
}
</style>