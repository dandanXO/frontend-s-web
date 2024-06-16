<template>
  <transition name="fade" mode="out">
    <tab-view
      scrollable
      :tab-list="groupByDateTabList"
      v-model="activeDayTab"
      class="group-by-date-tab"
      :tab-per-page="tabPerPage"
    >
      <template #tab="{ tab }">
        <span class="group-by-date-tab__tab-label">
          {{ moment(tab).locale("zh-cn").format("MMMDo[\n]dddd") }}
        </span>
      </template>

      <div class="group-by-date-tab__date">
        {{ currentGroupedMatches.date ? moment(currentGroupedMatches.date).locale("zh-cn").format("MMMDo dddd") : "" }}
      </div>
      <template v-if="currentGroupedMatches.matchList">
        <div class="group-by-date-tab__match-title">{{ currentGroupedMatches.title }}</div>
        <div class="group-by-date-tab__matches-wrapper">
          <div
            v-for="match in currentGroupedMatches.matchList"
            :key="`match-${match.id}`"
            class="group-by-date-tab__match-item"
          >
            <div class="group-by-date-tab__match-team-wrapper">
              <div class="group-by-date-tab__match-team">
                <img :src="imgUrl + match.teamOneIcon" />
                <span>{{ match.teamOneName }}</span>
              </div>
              <div class="group-by-date-tab__match-team">
                <img :src="imgUrl + match.teamTwoIcon" />
                <span>{{ match.teamTwoName }}</span>
              </div>
            </div>
            <div class="group-by-date-tab__match-divider" />
            <div class="group-by-date-tab__match-info">
              <span style="white-space: pre">
                {{ moment(match.matchTime).locale("zh-cn").format("MMMDo[\n]HH:mm") }}
              </span>
              <button class="group-by-dat-tab__match-btn" @click="betNow(match.platformMatchId)">点击投注</button>
            </div>
          </div>
        </div>
      </template>
      <span v-else>暂无赛程</span>
    </tab-view>
  </transition>
  <div class="tab-title">小组赛积分</div>

  <tab-view :tab-list="groupByGroupTabList" class="group-by-group-tab" v-model="activeGroupTab">
    <template #tab="{ tab }">
      {{ tab + "组" }}
    </template>

    <table>
      <tr>
        <th>球队</th>
        <th>场次</th>
        <th>胜/平/负</th>
        <th>得/失/净</th>
        <th>积分</th>
      </tr>
      <tr v-for="(team, index) in currentGroupedTeams.teamList" :key="`team-${team.id}`">
        <td class="group-by-group-tab__team-cell">
          <span>{{ index + 1 }}</span>
          <img :src="imgUrl + team.teamIcon" />
          <span>{{ team.teamName }}</span>
        </td>
        <td>{{ team.total }}</td>
        <td>{{ team.win }}/{{ team.draw }}/{{ team.loss }}</td>
        <td>{{ team.goalScored }}/{{ team.goalAgainst }}/{{ team.goalDifference }}</td>
        <td class="group-by-group-tab__score-cell">{{ team.score }}</td>
      </tr>
    </table>
  </tab-view>

  <GameModal ref="platformGame"></GameModal>
</template>
<script setup>
import { onMounted, computed, ref } from "vue";
import moment from "moment";
import { eventapi } from "boot/axios";
import GameModal from "components/modal/GameModal.vue";
import TabView from "./components/TabView.vue";
import { useWindowSize } from "@vueuse/core";
import {useLocalStorage} from "@vueuse/core"

const imgUrl = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value + "/promo/";

const platformGame = ref(null);
const matches = ref([]);
var startDate= moment().format("YYYY-MM-DD")
const activeDayTab = ref(startDate);

const groupByDateTabList = ref(
  [
    "2024-06-16",
    "2024-06-17",
    "2024-06-18",
    "2024-06-19",
    "2024-06-20",
    "2024-06-21",
    "2024-06-22",
    "2024-06-23",
    "2024-06-24",
    "2024-06-25",
    "2024-06-26",
  ]);
groupByDateTabList.value = groupByDateTabList.value.filter(number => number >= moment().format("YYYY-MM-DD"));


const teams = ref([]);
const activeGroupTab = ref("A");
const groupByGroupTabList = ref(["A", "B", "C", "D", "E", "F"]);

const { width } = useWindowSize();

const tabPerPage = computed(() => {
  if (width.value < 390) return 2;
  if (width.value < 490) return 3;
  return 4;
});

const groupedMatches = computed(() => {
  const groupByDay = {};
  matches.value.forEach((match) => {
    if (match.teamGroup === "2" || match.teamGroup === "4" || match.teamGroup === "8" || match.teamGroup === "16") {
      return;
    }
    const dayKey = moment(match.matchTime).format("YYYY-MM-DD");

    if (!groupByDay[dayKey]) {
      groupByDay[dayKey] = {
        title: match.title,
        matchList: []
      };
    }
    groupByDay[dayKey].matchList.push(match);
  });
  return Object.keys(groupByDay).map((groupKey) => ({
    date: groupKey,
    title: groupByDay[groupKey].title,
    matchList: groupByDay[groupKey].matchList
  }));
});

const currentGroupedMatches = computed(() => {
  return groupedMatches.value.find((group) => group.date === activeDayTab.value) || {};
});

const groupedTeams = computed(() => {
  const groupedObj = teams.value.reduce((result, team) => {
    if (!result[team.teamGroup]) {
      result[team.teamGroup] = [];
    }
    result[team.teamGroup].push(team);
    return result;
  }, {});
  return Object.entries(groupedObj).map(([key, value]) => ({
    group: key,
    teamList: value.sort((a, b) => b.score - a.score)
  }));
});

const currentGroupedTeams = computed(() => {
  return groupedTeams.value.find((group) => group.group === activeGroupTab.value) || {};
});

const betNow = (platformMatchId) => {
  var matchId = platformMatchId ?? "";
  platformGame.value.open("FB体育", "FB", matchId);
};

onMounted(() => {
  eventapi.get("/uefa/match/all").then((res) => {
    if (res.code === 0) {
      matches.value = res.data;
    }
  });

  eventapi.get("/uefa/team").then((res) => {
    if (res.code === 0) {
      teams.value = res.data.teams;
    }
  });
});
</script>
<style scoped lang="scss">
.group-by-date-tab {
  font-family: Microsoft YaHei UI;
  color: #1a396f;

  .group-by-date-tab__tab-label {
    white-space: pre;
  }

  .group-by-date-tab__date {
    margin-bottom: 14px;
    font-size: 1.3rem;
    font-weight: 700;
    line-height: 1.5rem;
  }

  .group-by-date-tab__match-title {
    margin-bottom: 21px;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.2rem;
  }

  .group-by-date-tab__matches-wrapper {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    .group-by-date-tab__match-item {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      border: 2px solid #bfd7ff;
      border-radius: 20px;
      padding: 17px;

      .group-by-date-tab__match-team-wrapper {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: space-evenly;
        gap: 16px;
        flex: 2;

        .group-by-date-tab__match-team {
          display: flex;
          gap: 8px;
          align-items: center;
          font-family: Microsoft YaHei UI;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.1rem;
          letter-spacing: 0.12em;
          color: #333333;

          img {
            margin-right: 12px;
            max-width: 30px;
          }
        }
      }

      .group-by-date-tab__match-divider {
        width: 1px;
        height: 100%;
        background-color: #bfd7ff;
      }

      .group-by-date-tab__match-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        flex: 1;
        font-family: Microsoft YaHei UI;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.1rem;
        text-align: center;

        .group-by-dat-tab__match-btn {
          background: linear-gradient(180deg, #fcf5ff 0%, #8db9ee 100%);
          padding: 4px 16px;
          border: none;
          border-radius: 33px;
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.3rem;
          letter-spacing: 0.12em;
          color: #333333;
          word-break: keep-all;

          &:hover,
          &.active {
            background: linear-gradient(180deg, #008df9 0%, #0051b3 100%);
            color: #ffffff;
          }
        }
      }
    }
  }
}

.group-by-group-tab {
  .group-by-group-tab__team-cell {
    display: flex;
    align-items: center;
    gap: 12px;

    img {
      max-width: 30px;
    }
  }

  .group-by-group-tab__score-cell {
    background-color: #0178e0 !important;
  }
}
</style>
