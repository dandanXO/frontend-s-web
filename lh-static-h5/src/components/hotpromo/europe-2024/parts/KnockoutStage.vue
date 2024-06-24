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
      <img v-if="team.teamIcon" :src="team.teamIcon ? imgUrl + team.teamIcon :null" :style="`max-width:${flagWidth}px`" />
      <span v-else style="color: #000000; display: flex;
    justify-content: center;
    align-items: center;
    width: 22px;
    padding-bottom: 0px;">
        <img src="../../../../assets/promo/daiding.jpg" />
      </span>
      <span v-if="team.teamIcon" class="bracket-team__name">{{team.teamName}}</span>
      <span v-else class="bracket-team__name">待定</span>
    </div>
    <div class="bracket-final">
      <span class="bracket-final__title">决赛</span>
      <div class="bracket-final__date" v-html="formatDate(finalDate)"></div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { eventapi } from "boot/axios";
import {useLocalStorage} from "@vueuse/core"

const pageLoading = ref(false);
const refBracketWrapper = ref(null);
const flagWidth = ref(34);
const domHeight = ref(770);
const finalDate = ref('');
const imgUrl = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value + '/promo/';
const bracketTeamList = ref([
  // top side round of 16
  { bottom: 95.6, left: 3.3, seg: 1, group: '16', team: 'A' },
  { bottom: 95.6, left: 17, seg: 1, group: '16', team: 'B' },
  { bottom: 95.6, left: 30.5, seg: 2, group: '16', team: 'A' },
  { bottom: 95.6, left: 44.2, seg: 2, group: '16', team: 'B' },
  { bottom: 95.6, left: 55.8, seg: 3, group: '16', team: 'A' },
  { bottom: 95.6, left: 69.5, seg: 3, group: '16', team: 'B' },
  { bottom: 95.6, left: 82.9, seg: 4, group: '16', team: 'A' },
  { bottom: 95.6, left: 96.6, seg: 4, group: '16', team: 'B' },
  // top side quarterfinal
  { bottom: 78.3, left: 10.2 , seg: 1, group: '8', team: 'A'},
  { bottom: 78.3, left: 37.2, seg: 1, group: '8', team: 'B' },
  { bottom: 78.3, left: 62.7, seg: 2, group: '8', team: 'A' },
  { bottom: 78.3, left: 90.1, seg: 2, group: '8', team: 'B'},
  // top side semifinal
  { bottom: 65.9, left: 23.6, seg: 1, group: '4', team: 'A' },
  { bottom: 65.9, left: 76.2, seg: 1, group: '4', team: 'B' },
  // top side final
  { bottom: 60.9, left: 49.9, seg: 1, group: '2', team: 'A' },
  // bottom side final
  { top: 57.4, left: 50, seg: 1, group: '2', team: 'B' },
  // bottom side semifinal
  { top: 62.4, left: 23.8, seg: 2, group: '4', team: 'A' },
  { top: 62.4, left: 76.4, seg: 2, group: '4', team: 'B' },
  // bottom side quarterfinal
  { top: 74.8, left: 10, seg: 3, group: '8', team: 'A' },
  { top: 74.8, left: 37.3, seg: 3, group: '8', team: 'B' },
  { top: 74.8, left: 62.7, seg: 4, group: '8', team: 'A' },
  { top: 74.8, left: 89.9 , seg: 4, group: '8', team: 'B'},
  // bottom side round of 16
  { top: 92.1, left: 3.3, seg: 5, group: '16', team: 'A' },
  { top: 92.1, left: 17, seg: 5, group: '16', team: 'B' },
  { top: 92.1, left: 30.5, seg: 6, group: '16', team: 'A' },
  { top: 92.1, left: 44.2, seg: 6, group: '16', team: 'B' },
  { top: 92.1, left: 55.8, seg: 7, group: '16', team: 'A' },
  { top: 92.1, left: 69.5, seg: 7, group: '16', team: 'B' },
  { top: 92.1, left: 82.9, seg: 8, group: '16', team: 'A' },
  { top: 92.1, left: 96.6, seg: 8, group: '16', team: 'B' }
]);
const teams = ref([
])
const populateTeams = () => {
  pageLoading.value = true
  eventapi.get("/uefa/match/all").then((res) => {
    if (res.code === 0) {
      teams.value = res.data
      teams.value.forEach(team => {
        const teamEntry = {
          teamIcon: null,
          teamName: null
        };

        const indexA = bracketTeamList.value.findIndex(entry => entry.seg === team.sequence && entry.group === team.teamGroup && entry.team === 'A');
        const indexB = bracketTeamList.value.findIndex(entry => entry.seg === team.sequence && entry.group === team.teamGroup && entry.team === 'B');
        // Update Team A entry
        if (indexA !== -1) {
          bracketTeamList.value[indexA].teamIcon = team.teamOneIcon;
          bracketTeamList.value[indexA].teamName = team.teamOneName;
        } else {
          console.error(`Unable to find suitable entry for Team A of team: ${team.teamOneName}`);
        }

        // Update Team B entry
        if (indexB !== -1) {
          bracketTeamList.value[indexB].teamIcon = team.teamTwoIcon;
          bracketTeamList.value[indexB].teamName = team.teamTwoName;
        } else {
          console.error(`Unable to find suitable entry for Team B of team: ${team.teamTwoName}`);
        }

        if (team.teamGroup === '2' || team.teamGroup === 2) {
          finalDate.value = team.matchTime
        }
      });

      pageLoading.value = false
    }
  })
};
const formatDate = (matchTime) => {
      if (!matchTime) return ''; // Return empty string if matchTime is not available

      const dateObj = new Date(matchTime);
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      const hour = dateObj.getHours().toString().padStart(2, '0');
      const minute = dateObj.getMinutes().toString().padStart(2, '0');

      return `${month}月${day}日<br>${hour}:${minute}`;
    }

populateTeams();
onMounted(() => {
  resizeDom();
  window.addEventListener("resize", resizeDom, true);

  populateTeams()
});

const resizeDom = () => {
  if (!refBracketWrapper.value) return;
  const currentWidth = window.innerWidth;
  if (currentWidth < 550) {
    const scaleRatio = currentWidth / 550;
    flagWidth.value = currentWidth * 0.062;
    domHeight.value = 770 * scaleRatio;
  }
};
</script>
<style scoped lang="scss">
.bracket-wrapper {
  position: relative;
  width: 100%;
  height: 770px;
  background: url(components/hotpromo/europe-2024/images/knockout-stage-bg.png) no-repeat;
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
    width: 24px;
    transform: translateX(-50%);

    &.top {
      flex-direction: column-reverse;
    }

    img {
      border-radius: 7px;
      max-width: 34px;
      width: unset !important;
      margin-bottom: 0 !important;
    }

    .bracket-team__name {
      font-size: 0.7rem;
      line-height: 1.1rem;
      letter-spacing: 0.12rem;
      word-break: keep-all;
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
