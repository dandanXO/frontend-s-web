<template>
  <div class="bracket-wrapper">
    <div
      class="bracket-team"
      v-for="(team, index) in bracketTeamList"
      :key="`team-${index}`"
      :style="{ top: team.top + 'px', left: team.left + 'px' }"
    >
      <img :src="FlagImg" />
      <span class="bracket-team__name">德国</span>
    </div>
    <div
      class="bracket-date"
      v-for="(date, index) in bracketDateList"
      :key="`date-${index}`"
      :style="{ top: date.top + 'px', left: date.left + 'px' }"
    >
      4月30日
      <br />
      23:00
    </div>
    <div class="bracket-final">
      <span class="bracket-final__title">决赛</span>
      <div class="bracket-final__date">4月30日 23:00</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import FlagImg from "@/components/hotpromo/europe-2024/images/flag.png";

const bracketTeamList = ref([
  // left side round of 16
  { top: -2, left: -4 },
  { top: 249, left: -4 },
  { top: 452, left: -4 },
  { top: 702, left: -4 },
  { top: 902, left: -4 },
  { top: 1152, left: -4 },
  { top: 1355, left: -4 },
  { top: 1605, left: -4 },
  // left side quarterfinal
  { top: 129, left: 260 },
  { top: 582, left: 260 },
  { top: 1032, left: 260 },
  { top: 1485, left: 260 },
  // left side semifinal
  { top: 357, left: 517 },
  { top: 1261, left: 517 },
  // left side final
  { top: 781, left: 648 },
  // right side final
  { top: 781, left: 780 },
  // right side semifinal
  { top: 357, left: 911 },
  { top: 1261, left: 911 },
  // right side quarterfinal
  { top: 129, left: 1168 },
  { top: 582, left: 1168 },
  { top: 1032, left: 1168 },
  { top: 1485, left: 1168 },
  // right side round of 16
  { top: -2, left: 1432 },
  { top: 249, left: 1432 },
  { top: 452, left: 1432 },
  { top: 702, left: 1432 },
  { top: 902, left: 1432 },
  { top: 1152, left: 1432 },
  { top: 1355, left: 1432 },
  { top: 1605, left: 1432 }
]);

const bracketDateList = ref([
  // left side round of 16
  { top: 138, left: 84 },
  { top: 590, left: 84 },
  { top: 1040, left: 84 },
  { top: 1492, left: 84 },
  // left side quarterfinal
  { top: 365, left: 340 },
  { top: 1270, left: 340 },
  // left side semifinal
  { top: 802, left: 498 },
  // right side semifinal
  { top: 802, left: 900 },
  // right side quarterfinal
  { top: 365, left: 1050 },
  { top: 1270, left: 1050 },
  // right side round of 16
  { top: 138, left: 1317 },
  { top: 590, left: 1317 },
  { top: 1040, left: 1317 },
  { top: 1492, left: 1317 }
]);
</script>
<style scoped lang="scss">
.bracket-wrapper {
  position: relative;
  width: 100%;
  height: 1715px;
  background: url(@/components/hotpromo/europe-2024/images/knockout-stage-background.png) no-repeat;
  background-size: 1500px auto;
  color: #ffffff;

  .bracket-team {
    position: absolute;
    width: 72px;
    height: 123px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    .bracket-team__name {
      font-family: Microsoft YaHei UI;
      font-size: 32px;
      line-height: 42.56px;
      letter-spacing: 0.12em;
    }
  }
  .bracket-date {
    position: absolute;
    width: 108px;
    font-family: Microsoft YaHei UI;
    font-size: 24px;
    line-height: 31.92px;
    letter-spacing: 0.12em;
    text-align: center;
  }
  .bracket-final {
    position: absolute;
    top: 936px;
    left: 648px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-items: center;
    .bracket-final__title {
      font-family: FZHanZhenGuangBiaoS-GB;
      font-size: 34px;
      font-weight: 400;
      line-height: 40.38px;
      letter-spacing: 0.12em;
      text-align: center;
    }
    .bracket-final__date {
      font-family: Microsoft YaHei UI;
      font-size: 24px;
      font-weight: 700;
      line-height: 31.92px;
      letter-spacing: 0.12em;
      text-align: center;
      background: url(@/components/hotpromo/europe-2024/images/knockout-stage-final-date-background.png) no-repeat;
      white-space: pre-wrap;
      width: 190px;
      height: 96px;
      padding: 16px 40px;
    }
  }
}
</style>
