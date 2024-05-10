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
      <span v-html="formatDate(date.matchTime)" />
    </div>
    <div class="bracket-final">
      <span class="bracket-final__title">决赛</span>
      <div class="bracket-final__date" v-html="formatDate(finalDate)"></div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import FlagImg from "@/components/hotpromo/europe-2024/images/flag.png";
import BracketTeam from "./components/BracketTeam.vue";
const imgUrl = process.env.VUE_APP_IMAGE_CDN + '/promo/';
const pageLoading = ref(true);
const finalDate = ref(null);
const bracketTeamList = ref([
  // left side round of 16
  { top: -2,   left: 67, seg: 1, group: '16', team: 'A' },
  { top: 151,  left: 67, seg: 1, group: '16', team: 'B' },
  { top: 299,  left: 67, seg: 2, group: '16', team: 'A' },
  { top: 452,  left: 67, seg: 2, group: '16', team: 'B' },
  { top: 575,  left: 67, seg: 3, group: '16', team: 'A' },
  { top: 728, left: 67, seg: 3, group: '16', team: 'B' },
  { top: 876, left: 67, seg: 4, group: '16', team: 'A' },
  { top: 1029, left: 67, seg: 4, group: '16', team: 'B' },
  // left side quarterfinal
  { top: 76,  left: 247, seg: 1, group: '8', team: 'A' },
  { top: 377,  left: 247, seg: 1, group: '8', team: 'B' },
  { top: 653, left: 247, seg: 2, group: '8', team: 'A'},
  { top: 954, left: 247, seg: 2, group: '8', team: 'B'},
  // left side semifinal
  { top: 226,  left: 445, seg: 1, group: '4', team: 'A'},
  { top: 803, left: 445, seg: 1, group: '4', team: 'B'},
  // left side final
  { top: 508,  left: 613, seg: 1, group: '2', team: 'A' },
  // right side final
  { top: 508,  left: 813, seg: 1, group: '2', team: 'B' },
  // right side semifinal
  { top: 226,  left: 983, seg: 2, group: '4', team: 'A'},
  { top: 803, left: 983, seg: 2, group: '4', team: 'B'},
  // right side quarterfinal
  { top: 76,  left: 1180, seg: 3, group: '8', team: 'A' },
  { top: 377,  left: 1180, seg: 3, group: '8', team: 'B' },
  { top: 653, left: 1180, seg: 4, group: '8', team: 'A' },
  { top: 954, left: 1180, seg: 4, group: '8', team: 'B' },
  // right side round of 16
  { top: -2,   left: 1360, seg: 5, group: '16', team: 'A' },
  { top: 151,  left: 1360, seg: 5, group: '16', team: 'B' },
  { top: 299,  left: 1360, seg: 6, group: '16', team: 'A' },
  { top: 452,  left: 1360, seg: 6, group: '16', team: 'B' },
  { top: 575,  left: 1360, seg: 7, group: '16', team: 'A' },
  { top: 728, left: 1360, seg: 7, group: '16', team: 'B' },
  { top: 876, left: 1360, seg: 8, group: '16', team: 'A' },
  { top: 1029, left: 1360, seg: 8, group: '16', team: 'B' }
]);

const bracketDateList = ref([
  // left side round of 16
  { top: 138,  left: 84, seg: 1, group: '16' },
  { top: 590,  left: 84, seg: 2, group: '16' },
  { top: 1040, left: 84, seg: 3, group: '16' },
  { top: 1492, left: 84, seg: 4, group: '16' },
  // left side quarterfinal
  { top: 365,  left: 340, seg: 1, group: '8' },
  { top: 1270, left: 340, seg: 2, group: '8' },
  // left side semifinal
  { top: 802, left: 498, seg: 1, group: '4'},
  // right side semifinal
  { top: 802, left: 900, seg: 2, group: '4' },
  // right side quarterfinal
  { top: 365,  left: 1050, seg: 3, group: '8' },
  { top: 1270, left: 1050, seg: 4, group: '8' },
  // right side round of 16
  { top: 138,  left: 1317, seg: 5, group: '16' },
  { top: 590,  left: 1317, seg: 6, group: '16' },
  { top: 1040, left: 1317, seg: 7, group: '16' },
  { top: 1492, left: 1317, seg: 8, group: '16' }
]);
const teams = ref([
])
const populateTeams = () => {
  pageLoading.value = true
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
  populateTeams()
})
</script>
<style scoped lang="scss">
.bracket-wrapper {
  position: relative;
  width: 100%;
  height: 1715px;
  background: url(@/components/hotpromo/europe-2024/images/knockout-stage-background.png) no-repeat;
  background-position: center top;
  color: #ffffff;

  .bracket-team {
    position: absolute;
    width: 72px;
    height: 123px;
  }
  .bracket-date {
    position: absolute;
    width: 122px;
    font-family: Microsoft YaHei UI;
    font-size: 24px;
    line-height: 31.92px;
    letter-spacing: 0.12em;
    text-align: center;
  }
  .bracket-final {
    position: absolute;
    top: 610px;
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
      padding: 16px 16px;
    }
  }
}
</style>
