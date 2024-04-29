<template>
  <div class="bracket-wrapper" ref="refBracketWrapper" :style="{ height: domHeight + 'px' }">
    <div
      v-for="(team, index) in bracketTeamList"
      class="bracket-team"
      :class="{ top: index < 15 }"
      :key="`team-${index}`"
      :style="
        index < 15
          ? { bottom: team.bottom + '%', left: team.left + '%' }
          : { top: team.top + '%', left: team.left + '%' }
      "
    >
      <img :src="FlagImg" :style="`max-width:${flagWidth}px`" />
      <span class="bracket-team__name">德国</span>
    </div>
    <div class="bracket-final">
      <span class="bracket-final__title">决赛</span>
      <div class="bracket-final__date">4月30日 23:00</div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import FlagImg from "components/hotpromo/europe-2024/images/flag.png";

const refBracketWrapper = ref(null);
const flagWidth = ref(36);
const domHeight = ref(770);
const bracketTeamList = ref([
  // top side round of 16
  { bottom: 96, left: -0.7 },
  { bottom: 96, left: 13 },
  { bottom: 96, left: 26.6 },
  { bottom: 96, left: 40.3 },
  { bottom: 96, left: 51.8 },
  { bottom: 96, left: 65.3 },
  { bottom: 96, left: 78.9 },
  { bottom: 96, left: 92.5 },
  // top side quarterfinal
  { bottom: 80, left: 6.3 },
  { bottom: 80, left: 33.3 },
  { bottom: 80, left: 58.7 },
  { bottom: 80, left: 86 },
  // top side semifinal
  { bottom: 69, left: 19.6 },
  { bottom: 69, left: 72.2 },
  // top side final
  { bottom: 64.3, left: 46 },
  // bottom side final
  { top: 51.6, left: 46 },
  // bottom side semifinal
  { top: 56.3, left: 19.6 },
  { top: 56.3, left: 72.2 },
  // bottom side quarterfinal
  { top: 67.6, left: 6.1 },
  { top: 67.6, left: 33.3 },
  { top: 67.6, left: 58.7 },
  { top: 67.6, left: 86 },
  // bottom side round of 16
  { top: 83.3, left: -0.7 },
  { top: 83.3, left: 13 },
  { top: 83.3, left: 26.6 },
  { top: 83.3, left: 40.3 },
  { top: 83.3, left: 51.8 },
  { top: 83.3, left: 65.3 },
  { top: 83.3, left: 78.9 },
  { top: 83.3, left: 92.5 }
]);

onMounted(() => {
  resizeDom();
  window.addEventListener("resize", resizeDom, true);
});

const resizeDom = () => {
  if (!refBracketWrapper.value) return;
  const currentWidth = window.innerWidth;
  if (currentWidth < 500) {
    const scaleRatio = currentWidth / 500;
    flagWidth.value = currentWidth * 0.072;
    domHeight.value = 770 * scaleRatio;
  }
};
</script>
<style scoped lang="scss">
.bracket-wrapper {
  position: relative;
  width: 100%;
  height: 770px;
  background: url(components/hotpromo/europe-2024/images/knockout-stage-background.png) no-repeat;
  background-size: 100% auto;
  background-position: top center;
  color: #ffffff;
  font-family: Microsoft YaHei UI;
  margin-top: 51.5px;

  .bracket-team {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;

    &.top {
      flex-direction: column-reverse;
    }

    img {
      max-width: 36px;
      width: unset !important;
      margin-bottom: 0 !important;
    }

    .bracket-team__name {
      font-size: 0.7rem;
      line-height: 1.1rem;
      letter-spacing: 0.12rem;
    }
  }

  .bracket-final {
    position: absolute;
    top: 40%;
    left: 60%;
    display: flex;
    gap: 12px;
    align-items: center;
    .bracket-final__title {
      font-family: FZHanZhenGuangBiaoS-GB;
      font-size: 1.3rem;
      line-height: 1.5rem;
      letter-spacing: 0.12rem;
      text-align: center;
    }
    .bracket-final__date {
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.3rem;
      letter-spacing: 0.12rem;
      text-align: center;
      background: url(components/hotpromo/europe-2024/images/knockout-stage-final-date-background.png) no-repeat;
      background-size: contain;
      white-space: pre-wrap;
      width: 95px;
      height: 48px;
      padding-top: 2.5px;
    }
  }
}
</style>
