<template>
  <div class="vip-badge-wrapper" :class="`bg-${level + 1}`">
    <h3 class="vip-badge-title">VIP{{ level }}</h3>
    <span class="vip-badge-qualification-info">Accumulate Deposit: {{ addThousandsComma(qualification) }}</span>
    <div class="vip-badge-percentage-bar">
      <div class="vip-badge-percentage-bar__inner" :style="{ width: qualificationPercentage + '%' }" />
    </div>
    <div class="vip-badge-percentage-info">
      <span>vip{{ level }}</span>
      <span>vip{{ level + 1 }}</span>
    </div>
    <img class="vip-badge-crown" :src="require(`@/assets/images/vip/badge/badge-crown-${level}.png`)" />
  </div>
</template>
<script setup>
import { addThousandsComma } from "@/utils/utils";
import { computed, ref, toRefs } from "vue";

const props = defineProps({
  level: Number,
  currentDeposit: Number,
  qualification: Number
});

const { level, currentDeposit, qualification } = toRefs(props);

const qualificationPercentage = computed(() => {
  if (currentDeposit.value === 0) return 0;
  return currentDeposit.value / qualification.value;
});
</script>
<style scoped lang="scss">
$base-bg: url(@/assets/images/vip/badge/badge-bg.png);
$bg-list: linear-gradient(103.8deg, #f4e457 0.82%, #c4ba5d 61.53%, #f4e457 98.77%),
  linear-gradient(103.8deg, #566943 0.82%, #97a676 61.53%, #566943 98.77%),
  linear-gradient(103.8deg, #6eb4ff 0.82%, #3494fa 61.53%, #0069d9 98.77%),
  linear-gradient(103.8deg, #6e8eff 0.82%, #346cfa 61.53%, #0069d9 98.77%),
  linear-gradient(103.8deg, #8eb6fb 0.82%, #5a4fec 61.53%, #2d38d2 98.77%),
  linear-gradient(103.8deg, #e052b0 0.82%, #631b4a 61.53%, #3a0859 98.77%),
  linear-gradient(103.8deg, #b252e0 0.82%, #631b4a 61.53%, #6d00c2 98.77%),
  linear-gradient(103.8deg, #e3deb0 0.82%, #f7ad3e 61.53%, #ff8514 98.77%),
  linear-gradient(103.8deg, #e3bcb0 0.82%, #f76a3e 61.53%, #ff9314 98.77%),
  linear-gradient(103.8deg, #5dd300 0.82%, #02932b 61.53%, #5dd300 98.77%),
  linear-gradient(103.8deg, #00963c 0.82%, #3ef766 61.53%, #00963c 98.77%),
  linear-gradient(103.8deg, #b0e3e0 0.82%, #8577de 40%, #0a92af 61.53%, #ff14f6 98.77%),
  linear-gradient(103.8deg, #f150d7 0.82%, #c5b311 61.53%, #004793 98.77%);

.vip-badge-wrapper {
  background: $base-bg;
  padding: 16px 19px;
  position: relative;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  line-height: 14px;
  letter-spacing: -0.004em;
  color: #ffffff;

  &::after {
    position: absolute;
    content: "";
    inset: 0;
    padding: 1px;
    background: linear-gradient(to bottom, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
    border-radius: 10px;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }

  @for $i from 1 through length($bg-list) {
    &.bg-#{$i} {
      background: $base-bg, nth($bg-list, $i);
      background-size: cover;
    }
  }

  .vip-badge-title {
    margin-bottom: 13px;
    font-size: 24px;
    font-weight: 400;
    line-height: 27.43px;
    color: #ffffff;
  }

  .vip-badge-crown {
    position: absolute;
    top: -34px;
    right: 0;
    z-index: 1;
  }

  .vip-badge-qualification-info {
    margin-bottom: 4px;
  }

  .vip-badge-percentage-bar {
    width: 100%;
    height: 6px;
    border-radius: 4px;
    background-color: #ffffff4d;
    margin-bottom: 8px;

    .vip-badge-percentage-bar__inner {
      height: 100%;
      border-radius: 4px;
      background-color: #ffffff;
    }
  }

  .vip-badge-percentage-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
}
</style>
