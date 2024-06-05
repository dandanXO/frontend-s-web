<template>
  <div v-if="!pageLoading" class="bracket-wrapper">
    <bracket-team
      class="bracket-team"
      v-for="(team, index) in bracketTeamList"
      :key="`team-${index}`"
      :style="{ top: team.top + 'px', left: team.left + 'px' }"
      :img-url="team.teamIcon ? imgUrl + team.teamIcon : null"
      :country="team.teamName"
    ></bracket-team>
    <div
      class="bracket-date"
      v-for="(date, index) in bracketDateList"
      :key="`date-${index}`"
      :style="{ top: date.top + 'px', left: date.left + 'px' }"
    >
      <!-- <span v-html="formatDate(date.matchTime)" />   -->
      <span v-if="date.matchTime" v-html="formatDate(date.matchTime)"></span>
      <span v-else>待定中</span>
    </div>
    <div class="bracket-final">
      <span class="bracket-final__title">决赛</span>
      <div class="bracket-final__date" v-if="finalDate" v-html="formatDate(finalDate)"></div>
      <div class="bracket-final__date" v-else style="line-height: 56px;">待定中</div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import FlagImg from "@/components/hotpromo/europe-2024/images/flag.png";
import BracketTeam from "./components/BracketTeam.vue";
import { euroMatchAll } from '@/api/promotion/eurocup';
import { useLocalStorage } from "@vueuse/core";
const imgUrl = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value + '/promo/';
const pageLoading = ref(true);
const finalDate = ref(null);
const bracketTeamList = ref([
  // left side round of 16
  { top: -9,   left:-2, seg: 1, group: '16', team: 'A' },
  { top: 144,  left:-2, seg: 1, group: '16', team: 'B' },
  { top: 292,  left:-2, seg: 2, group: '16', team: 'A' },
  { top: 445,  left:-2, seg: 2, group: '16', team: 'B' },
  { top: 568,  left:-2, seg: 3, group: '16', team: 'A' },
  { top: 721, left: -2, seg: 3, group: '16', team: 'B' },
  { top: 869, left: -2, seg: 4, group: '16', team: 'A' },
  { top: 1022, left:-2, seg: 4, group: '16', team: 'B' },
  // left side quarterfinal
  { top: 69,   left: 178, seg: 1, group: '8', team: 'A' },
  { top: 370,  left: 178, seg: 1, group: '8', team: 'B' },
  { top: 646,  left: 178, seg: 2, group: '8', team: 'A' },
  { top: 947,  left: 178, seg: 2, group: '8', team: 'B' },
  // left side semifinal
  { top: 219,  left: 376, seg: 1, group: '4', team: 'A' },
  { top: 796,  left: 376, seg: 1, group: '4', team: 'B' },
  // left side final
  { top: 501,  left: 543, seg: 1, group: '2', team: 'A' },
  // right side final
  { top: 501,  left: 743, seg: 1, group: '2', team: 'B' },
  // right side semifinal
  { top: 219,  left: 913, seg: 2, group: '4', team: 'A' },
  { top: 796,  left: 913, seg: 2, group: '4', team: 'B' },
  // right side quarterfinal
  { top: 69,   left: 1110, seg: 3, group: '8', team: 'A' },
  { top: 370,  left: 1110, seg: 3, group: '8', team: 'B' },
  { top: 646,  left: 1110, seg: 4, group: '8', team: 'A' },
  { top: 947,  left: 1110, seg: 4, group: '8', team: 'B' },
  // right side round of 16
  { top: -9,   left: 1290, seg: 5, group: '16', team: 'A' },
  { top: 144,  left: 1290, seg: 5, group: '16', team: 'B' },
  { top: 292,  left: 1290, seg: 6, group: '16', team: 'A' },
  { top: 445,  left: 1290, seg: 6, group: '16', team: 'B' },
  { top: 568,  left: 1290, seg: 7, group: '16', team: 'A' },
  { top: 721,  left: 1290, seg: 7, group: '16', team: 'B' },
  { top: 869,  left: 1290, seg: 8, group: '16', team: 'A' },
  { top: 1022, left: 1290, seg: 8, group: '16', team: 'B' }
]);

const bracketDateList = ref([
  // left side round of 16
  { top: 100,  left: 45, seg: 1, group: '16' },
  { top: 390,  left: 45, seg: 2, group: '16' },
  { top: 670,  left: 45, seg: 3, group: '16' },
  { top: 975,  left: 45, seg: 4, group: '16' },
  // left side quarterfinal
  { top: 240,  left: 212, seg: 1, group: '8' },
  { top: 815,  left: 212, seg: 2, group: '8' },
  // left side semifinal
  { top: 520,  left: 406, seg: 1, group: '4' },
  // right side semifinal
  { top: 520,  left: 833, seg: 2, group: '4' },
  // right side quarterfinal
  { top: 240,  left: 1028, seg: 3, group: '8' },
  { top: 815,  left: 1028, seg: 4, group: '8' },
  // right side round of 16
  { top: 100,  left: 1192, seg: 5, group: '16' },
  { top: 390,  left: 1192, seg: 6, group: '16' },
  { top: 670,  left: 1192, seg: 7, group: '16' },
  { top: 975,  left: 1192, seg: 8, group: '16' }
]);
const teams = ref([
])
const populateTeams = () => {
  pageLoading.value = true

  euroMatchAll().then((res) => {
    if (res.code === 0) {
      teams.value = res.data
      teams.value.forEach(team => {
        const teamEntry = {
          teamIcon: null,
          teamName: null
        };

        const indexA = bracketTeamList.value.findIndex(entry => entry.seg === team.sequence && entry.group === team.teamGroup && entry.team === 'A');
        const indexB = bracketTeamList.value.findIndex(entry => entry.seg === team.sequence && entry.group === team.teamGroup && entry.team === 'B');
        const date = bracketDateList.value.findIndex(entry => entry.seg === team.sequence && entry.group === team.teamGroup);
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
        if (date !== -1) {
          bracketDateList.value[date].matchTime = team.matchTime
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

onMounted(() => {
  populateTeams()
})
</script>
<style scoped lang="scss">
.bracket-wrapper {
  position: relative;
  width: 1360px;
  height: 1215px;
  background: url(@/components/hotpromo/europe-2024/images/knockout-stage-background.png) no-repeat;
  background-position: center top;
  color: #ffffff;
  margin: auto;

  .bracket-team {
    position: absolute;
    width: 72px;
    height: 123px;
  }
  .bracket-date {
    position: absolute;
    width: 122px;
    font-family: Microsoft YaHei UI;
    font-size: 16px;
    line-height: 18px;
    letter-spacing: 0.12em;
    text-align: center;
  }
  .bracket-final {
    position: absolute;
    top: 610px;
    left: 590px;
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
      padding: 16px 16px;
    }
  }
}
</style>
