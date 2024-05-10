<template>
  <div class="tab-title">
    {{ tabtitle }}
  </div>
  <div class="note">注：用户选定每组的参与队伍后不予更改；</div>
  <div class="fund-wrapper">
    <img src="../images/daily-fund-logo.png" class="fund-logo" />
    <div class="fund-inner-wrapper">
      <div class="fund-status">
        <div style="display: flex; gap: 10px">
          <span class="fund-status__point-title">总积分</span>
          <div class="fund-status__point">{{ matchPoints.currentPoints }}</div>
        </div>
        <div class="fund-contest-time-left">
          <img src="../images/daily-fund-icon-time.svg" />
          <span class="fund-contest-time-left__title">比赛剩余</span>
          <span class="fund-contest-time-left__content" v-if="remainingTime">
            {{ `${remainingTime.days} 天 ${remainingTime.hours} 小时` }}
          </span>
        </div>
      </div>
      <div class="fund-divider" />
      <div class="fund-progress-wrapper">
        <div class="fund-progress-ranking-wrapper firstrow">
          <div v-for="(num, i) in rankPoints" :key="`ranking-text-${i}`" :class="`ranking-${i}`">
            <div v-if="i === 0"></div>
            <div v-if="i !== 0">
              {{ num.amt }} 元
              <img :src="require(`../images/daily-fund-ranking-${i + 1}.png`)" />
            </div>
          </div>
        </div>
        <q-linear-progress :value="getPercentage(matchPoints.currentPoints)" class="fund-progress-bar" />
        <div class="fund-progress-ranking-wrapper">
          <div v-for="(num, i) in rankPoints" :key="`ranking-text-${i + 1}`" :class="`ranking-text-${i + 1}`">
            {{ num.points }}
            <div v-if="i !== 0">
              <div class="claim">
                <img
                  @click="claimPoint(num.points)"
                  v-if="
                    matchPoints.currentPoints >= num.points &&
                    matchPoints.pointsClaimed &&
                    !matchPoints.pointsClaimed.includes(num.points)
                  "
                  src="../images/daily-fund-claim.png"
                />
                <img v-else src="../images/daily-fund-claimed.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bracket-list-wrapper">
    <div class="bracket-wrapper" v-for="(match, index) in ongoingMatches" :key="index">
      <div class="bracket-team-select">
        <bracket-team :img-url="imgUrl + match.teamOneIcon" :country="match.teamOneName" />
        <button
          @click="matchSubmit(match, match.teamOneId, match.teamOneName)"
          v-if="!match.selectedTeamId"
          class="bracket-team-select__button"
        >
          选择
        </button>
        <button v-if="match.selectedTeamId === match.teamOneId" class="bracket-team-select__button active">已选</button>
      </div>
      <div class="bracket-info">
        <div class="bracket-info__status">{{ match.status === "ONGOING" ? "进行中" : "已结束" }}</div>
        <div class="bracket-info__info-wrapper">
          <div class="bracket-info__info-wrapper-date">{{ moment(match.matchTime).format("DD/MM hh:mm") }}</div>
          <div class="bracket-info__info-wrapper-contest">{{ match.title }}</div>
        </div>
      </div>
      <div class="bracket-team-select">
        <bracket-team :img-url="imgUrl + match.teamTwoIcon" :country="match.teamTwoName" />
        <button
          @click="matchSubmit(match, match.teamTwoId, match.teamTwoName)"
          v-if="!match.selectedTeamId"
          class="bracket-team-select__button"
        >
          选择
        </button>
        <button v-if="match.selectedTeamId === match.teamTwoId" class="bracket-team-select__button active">已选</button>
      </div>
    </div>
  </div>
  <table>
    <tr>
      <th>有效投注</th>
      <th>投注彩金</th>
      <th>专属队伍彩金</th>
      <th>彩金倍数</th>
    </tr>
    <tr>
      <td>≥3,000</td>
      <td>8</td>
      <td>18</td>
      <td rowspan="4">3倍</td>
    </tr>
    <tr>
      <td>≥6,000</td>
      <td>28</td>
      <td>58</td>
    </tr>
    <tr>
      <td>≥10,000</td>
      <td>68</td>
      <td>88</td>
    </tr>
    <tr>
      <td>≥100,000</td>
      <td>158</td>
      <td>188</td>
    </tr>
  </table>
  <q-dialog width="300" :title="selectedMatch.title" v-model="confirmDialog">
    <q-card class="bg-white text-black vote-card">
      <q-card-section class="q-mb-md">
        <p>
          您确定要选择
          <span style="font-weight: bold; color: #0051b3">{{ selectedItem.name }}</span>
          吗？请注意，一旦选择后将无法更改。
        </p>
      </q-card-section>
      <q-btn @click="confirmDialog = false" label="取消" color="warning" class="q-mr-md" />
      <q-btn @click="confirmMatchSelect(selectedMatch.id, selectedItem.id)" label="确定" color="brightbtn" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps, ref } from "vue";
import BracketTeam from "./components/BracketTeam.vue";
import { onMounted } from "vue";
import { eventapi } from "boot/axios";
// import { euroMatchOngoing, euroMatchPoints, euroClaimMatchPoints, euroMatchSubmit } from "@/api/promotion/eurocup";
import { useQuasar } from "quasar";
import { userStore } from "src/stores";
import moment from "moment";

const $q = useQuasar();
const store = userStore();
var qs = require("qs");
const props = defineProps({
  tabtitle: String
});
const rankPoints = [
  {
    amt: "",
    points: 0
  },
  {
    amt: 8,
    points: 1000
  },
  {
    amt: 8,
    points: 2000
  },
  {
    amt: 18,
    points: 3000
  },
  {
    amt: 58,
    points: 4000
  },
  {
    amt: 88,
    points: 5000
  },
  {
    amt: 188,
    points: 6000
  }
];
const imgUrl = process.env.IMAGE_CDN + "/promo/";
const confirmDialog = ref(false);
const selectedMatch = ref("");
const selectedItem = ref({
  id: null,
  name: null
});
const matchPoints = ref([]);
const getPercentage = (points) => {
  return (points / 6000) * 100;
};
const isClaimed = ref(false);
const ongoingMatches = ref();
const remainingTime = ref();
const getMatchPoints = () => {
  eventapi.get("/uefa/matchPoints").then((res) => {
    if (res.code === 0) {
      matchPoints.value = res.data;
      remainingTime.value = calculateRemainingTime(res.data.endDate);
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message,
        icon: "report_problem"
      });
    }
  });
};
const claimPoint = (points) => {
  eventapi.post("/uefa/matchPoints/claim", qs.stringify({ point: points })).then((res) => {
    if (res.code === 0) {
      $q.notify({
        color: "positive",
        position: "top",
        message: "领取成功",
        icon: "report_problem"
      });
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message,
        icon: "report_problem"
      });
    }
  });
};
const getMatches = () => {
  eventapi.get("/uefa/match/ongoing").then((res) => {
    if (res.code === 0) {
      ongoingMatches.value = res.data;
    }
  });
};
const matchSubmit = (match, id, name) => {
  confirmDialog.value = true;
  selectedMatch.value = match;
  selectedItem.value = {
    id: id,
    name: name
  };
};
const confirmMatchSelect = () => {
  eventapi
    .post("/uefa/match/submit", {
      matchId: selectedMatch.value.id,
      selectedTeamId: selectedItem.value.id,
      headers: {
        token: `${store.token}`,
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "领取成功",
          icon: "report_problem"
        });
        confirmDialog.value = false;
        getMatches();
      }
    });
};
function calculateRemainingTime(endDate) {
  // Parse the end date string into a Date object
  const endDateTime = new Date(endDate);

  // Get the current date and time
  const now = new Date();

  // Calculate the difference in milliseconds between now and the end date
  const difference = endDateTime - now;

  // Convert milliseconds to days and hours
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  // Return the remaining time as an object
  return {
    days,
    hours
  };
}

onMounted(() => {
  getMatches();
  getMatchPoints();
});
</script>
<style scoped lang="scss">
$ranking-list: 0.68rem, 0.96rem, 1rem, 1.15rem, 1.65rem, 2.5rem;

@for $i from 1 through length($ranking-list) {
  .ranking-#{$i} {
    width: nth($ranking-list, $i) !important;
    text-align: center;
  }
}

.ranking-0 {
  width: 0;
}

.note {
  font-family: Microsoft YaHei UI;
  font-size: 1rem;
  font-weight: 400;
  line-height: 2.6rem;
  letter-spacing: 0.12em;
  text-align: center;
  color: #faff00;
  margin-bottom: 37px;
}

.fund-wrapper {
  padding: 10px 0;
  position: relative;
  font-family: Microsoft YaHei UI;
  margin-left: 17px;

  .fund-logo {
    position: absolute;
    top: 7px;
    left: -17px;
    max-width: 15.6%;
    margin-bottom: 0 !important;
  }

  .fund-inner-wrapper {
    background-color: #143cda66;
    padding: 10px 14px 10px 61px;
    display: flex;
    gap: 22px;
    border-radius: 17px;
    margin-bottom: 43px;
    color: #ffffff;
    flex-direction: column;

    .fund-status {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;
      gap: 11px;

      .fund-status__point-wrapper {
        display: flex;
        gap: 0.75rem;
        align-items: center;

        .fund-status__point-title {
          font-size: 0.875rem;
          line-height: 1.125rem;
          color: #ffffff66;
        }

        .fund-status__point {
          background-color: #002977;
          font-size: 1.1rem;
          font-weight: 700;
          padding: 0 10px;
          border-radius: 5.69px;
        }
      }

      .fund-contest-time-left {
        display: flex;
        gap: 4px;
        font-size: 0.875rem;
        line-height: 1.15rem;

        img {
          max-width: 1rem;
        }

        .fund-contest-time-left__title {
          color: #ffffff66;
        }
      }
    }

    .fund-divider {
      border: 1px solid #ffffff33;
    }

    .fund-progress-wrapper {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-left: -30px;
      .fund-progress-ranking-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: end;
        width: 100%;

        &:last-child {
          font-size: 0.625rem;
          line-height: 0.8rem;
          text-align: center;
          align-items: flex-start;
        }
      }

      .fund-progress-bar {
        width: 100%;
        font-size: 6px;
        border-radius: 6.32px;
        margin-bottom: 12px;

        &:deep(.q-linear-progress__model) {
          background: linear-gradient(180deg, #00d1ff 0%, #0d70d6 100%);
        }
      }
    }
  }
}

.bracket-wrapper {
  display: flex;
  justify-content: space-between;
  color: #ffffff;
  background: #051d4766;
  border: 1px solid #ffffff66;
  border-radius: 8px;
  margin-bottom: 15px;
  padding-bottom: 22px;
  font-family: Microsoft YaHei UI;

  .bracket-team-select {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    padding-top: 25px;
    gap: 18px;
    .bracket-team-select__button {
      background: linear-gradient(180deg, #fcf5ff 0%, #8db9ee 100%);
      padding: 6px 23px;
      border-radius: 33px;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.3rem;
      letter-spacing: 0.12em;
      color: #333333;

      &:hover,
      &.active {
        background: linear-gradient(180deg, #008df9 0%, #0051b3 100%);
        color: #ffffff;
      }
    }
  }

  .bracket-info {
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    gap: 20px;
    flex-shrink: 0;

    .bracket-info__status {
      background: linear-gradient(180deg, #00d1ff 0%, #0d70d6 100%);
      padding: 10px 25px;
      border-radius: 0px 0px 20px 20px;
      font-family: FZHanZhenGuangBiaoS-GB;
      font-size: 1rem;
      line-height: 1.18rem;
      letter-spacing: 0.12em;
      text-align: center;

      &.finished {
        background: linear-gradient(180deg, #f99500 0%, #b34b00 100%);
      }
    }

    .bracket-info__info-wrapper {
      display: flex;
      flex-direction: column;
      gap: 22px;
      align-items: center;

      .bracket-info__info-wrapper-date {
        background-color: #458bff1a;
        padding: 3.5px 19px 7px 19px;
        border-radius: 100px;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.3rem;
        letter-spacing: 0.12em;
        text-align: center;
      }

      .bracket-info__info-wrapper-contest {
        font-size: 1rem;
        line-height: 1.3rem;
        letter-spacing: 0.12em;
        color: #ffffff99;
      }
    }
  }
}

.vote-card {
  width: 100%;
  padding: 20px;
  text-align: center;
  max-width: 400px;
}

@media (max-width: 410px) {
  .fund-wrapper {
    .fund-logo {
      max-width: 18.6%;
    }

    .fund-inner-wrapper {
      .fund-status {
        .fund-contest-time-left {
          font-size: 0.8rem;
        }
      }
    }
  }
}
</style>
