<template>
  <div class="tab-title">
    {{ tabtitle }}
  </div>

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
          <span class="fund-contest-time-left__title">{{ matchStartAt }}</span>
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
              <img :src="require(`../images/daily-fund-ranking-${i}.png`)" />
            </div>
          </div>
        </div>
        <q-linear-progress :value="getPercentage(matchPoints.currentPoints)" class="fund-progress-bar" />
        <div class="fund-progress-ranking-wrapper">
          <div v-for="(num, i) in rankPoints" :key="`ranking-text-${i + 1}`" :class="`ranking-text-${i + 1}`">
            {{ num.points }}
            <div v-if="i !== 0">
              <div class="claim">
                <template v-if="matchPoints.currentPoints >= num.points && matchPoints.pointsClaimed">
                  <img v-if="matchPoints.pointsClaimed.includes(num.points)" src="../images/daily-fund-claimed.png" />
                  <img v-else @click="claimPoint(num.points)" src="../images/daily-fund-claim.png" />
                </template>
                <img v-else src="../images/daily-fund-wait-for-claim.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="doubling-gold">
    <div class="teams">
      <div v-for="(team, teamindex) in teams" class="team" :key="teamindex">
        <div class="team-box">
          <div class="team-num">{{ team.name }} 组</div>
          <div class="chosen-items">
            <div class="selection">
              {{ team.selection.length > 0 ? " 已选择：" : "请选队伍" }}
              <div class="selected-items">
                <div v-for="t in team.selection" :key="t">
                  {{ t.name }}
                </div>
              </div>
            </div>
            <div
              @click="team.selection.length > 0 ? confirmSelection(team) : null"
              class="unselectedbtn"
              v-if="!team.isSelectionConfirmed"
            >
              {{ team.selection.length > 0 ? "确定" : "未选择" }}
            </div>
            <div class="selectedbtn" v-if="team.isSelectionConfirmed">已选择</div>
          </div>
          <div class="choices" :class="{ isConfirmed: team.isSelectionConfirmed }">
            <div
              @click="team.isSelectionConfirmed ? null : toggleSelection(team, choice)"
              :class="{ selected: team.selection.some((item) => item.id === choice.id) }"
              v-for="(choice, choiceindex) in team.choices"
              class="choice"
              :key="choiceindex"
            >
              <div class="close-icon"></div>
              <img class="team-flag" :src="`${imgURL}${choice.teamIcon}`" />
              {{ choice.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="note">注：用户选定每组的参与队伍后不予更改；</div>

  <div class="bracket-list-wrapper">
    <div class="bracket-wrapper" v-for="(match, index) in ongoingMatches" :key="index">
      <div class="bracket-team-select">
        <bracket-team :img-url="imgUrl + match.teamOneIcon" :country="match.teamOneName" />
        <button
          @click="matchSubmit(match, match.teamOneId, match.teamOneName)"
          v-if="match.selectedTeamId === null"
          class="bracket-team-select__button"
        >
          选择
        </button>
        <button v-else-if="match.selectedTeamId === match.teamOneId" class="bracket-team-select__button active">
          已选
        </button>
        <div v-else class="bracket-team-select__button pseudo" />
      </div>
      <div class="bracket-info">
        <div class="bracket-info__info-wrapper">
          <div class="bracket-info__info-wrapper-title">{{ match.title }}</div>
          <div class="bracket-info__info-wrapper-date">{{ moment(match.matchTime).format("MM/DD HH:mm") }}</div>
          <div class="bracket-info__info-wrapper-VS">VS</div>
          <button
            @click="matchSubmit(match, 0, '平局')"
            v-if="match.selectedTeamId === null"
            class="bracket-team-select__button"
          >
            平局
          </button>
          <button v-else-if="match.selectedTeamId === 0" class="bracket-team-select__button active">已选</button>
          <div v-else class="bracket-team-select__button pseudo" />
        </div>
      </div>
      <div class="bracket-team-select">
        <bracket-team :img-url="imgUrl + match.teamTwoIcon" :country="match.teamTwoName" />
        <button
          @click="matchSubmit(match, match.teamTwoId, match.teamTwoName)"
          v-if="match.selectedTeamId === null"
          class="bracket-team-select__button"
        >
          选择
        </button>
        <button v-else-if="match.selectedTeamId === match.teamTwoId" class="bracket-team-select__button active">
          已选
        </button>
        <div v-else class="bracket-team-select__button pseudo" />
      </div>
    </div>
  </div>
<!--  <table>-->
<!--    <tr>-->
<!--      <th>有效投注</th>-->
<!--      <th>投注彩金</th>-->
<!--      <th>专属队伍彩金</th>-->
<!--      <th>彩金倍数</th>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <td>≥3,000</td>-->
<!--      <td>8</td>-->
<!--      <td>18</td>-->
<!--      <td rowspan="4">3倍</td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <td>≥6,000</td>-->
<!--      <td>28</td>-->
<!--      <td>58</td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <td>≥10,000</td>-->
<!--      <td>68</td>-->
<!--      <td>88</td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <td>≥100,000</td>-->
<!--      <td>158</td>-->
<!--      <td>188</td>-->
<!--    </tr>-->
<!--  </table>-->

  <div class="rule-title">活动规则</div>
  <ol class="rule-content">
    <li>
      活动期间，会员当日任意存款即可获得参与竞猜机会，参与竞猜且竞猜结果正确即可获得100积分；
    </li>
    <li>
      活动期间，会员可在A组~F组各选出一只专属队伍，若当日参与竞猜后专属队伍获胜即可获得100专属加赠积分；
    </li>
    <li>活动期间，积攒够对应积分总数即可兑换相应彩金，可点击领取按钮，彩金3倍流水即可出款；</li>
    <li>
      此活动全体会员均可参与，参与前请完善个人资料，绑定手机号码及银行卡；
    </li>
    <li>
      仅计算已结算并产生输赢结果的注单，任何平局、串关、取消的注单不予计算，任何低于欧洲盘1.7、香港盘0.7赔率以下的注单以及在同一赛事中同时投注对等盘口将不予计算；
    </li>
    <li>每位有效会员、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑以及其他登录设备只能享受一次活动优惠，如有任何违规者或任何团体以不正常的方式进行套取活动优惠，我站保留在不通知的情况下冻结或关闭相关账户的权利，
      并不退还款项，且用户列入黑名单；</li>
    <li>为避免文字理解差异，本站保留最终解释权。</li>
  </ol>

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
import {useLocalStorage} from "@vueuse/core"
import { useNotify } from "src/hooks/notify";

const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value + "/promo/";

const notify = useNotify();
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
const imgUrl = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value + "/promo/";
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
const teams = ref([]);

const matchStartAt = ref("比赛剩余")
const getMatchPoints = () => {
  eventapi.get("/uefa/matchPoints").then((res) => {
    if (res.code === 0) {
      matchPoints.value = res.data;
      if(moment().format("YYYY-MM-DD HH:mm") <= "2024-06-15 03:00"){
        remainingTime.value = calculateRemainingTime("2024-06-15 02:59:59");
        matchStartAt.value = "比赛倒计时"
      }else{
        remainingTime.value = calculateRemainingTime(res.data.endDate);
      }
    } else {
      notify({
        type: "error",
        message: res.message,
      });
    }
  });
};
const claimPoint = (points) => {
  eventapi.post("/uefa/matchPoints/claim", qs.stringify({ point: points })).then((res) => {
    if (res.code === 0) {
      notify({
        type: "success",
        message: "领取成功",
      });
    } else {
      notify({
        type: "error",
        message: res.message,
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
        notify({
          type: "success",
          message: "投票成功",
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

function toggleSelection(team, choice) {
  if (team && Array.isArray(team.selection)) {
    const index = team.selection.findIndex((item) => item.id === choice.id);
    if (index === -1) {
      // Choice is not selected, so add it to the selection
      team.selection = [{ id: choice.id, name: choice.name }];
    } else {
      // Choice is already selected, so remove it from the selection
      team.selection.splice(index, 1);
    }
  } else {
    console.error("Team or selection array is undefined.");
  }
}
function confirmSelection(team, choiceName) {
  if (team && Array.isArray(team.selection)) {
    // team.isSelectionConfirmed = true;
    const teamIds = [];
    team.selection.forEach((element) => {
      teamIds.push(element.id);
    });
    eventapi.post("/uefa/team/submit", teamIds).then((res) => {
      if (res.code === 0) {
        team.isSelectionConfirmed = true;
        getTeamsData();
      }
    });
  }
}

const getTeamsData = () => {
  eventapi.get("/uefa/team").then((res) => {
    if (res.code === 0) {
      teams.value = [];
      const groupedTeams = {}; // Object to store teams grouped by teamGroup
      res.data.teams.forEach((teamData) => {
        const teamGroup = teamData.teamGroup;
        if (!groupedTeams[teamGroup]) {
          // Initialize an array for the teamGroup if not exists
          groupedTeams[teamGroup] = [];
        }
        // Push the teamData to the corresponding teamGroup array
        groupedTeams[teamGroup].push(teamData);
      });

      // Iterate over grouped teams and create team objects
      for (const teamGroup in groupedTeams) {
        if (groupedTeams.hasOwnProperty(teamGroup)) {
          const teamsInGroup = groupedTeams[teamGroup];
          const team = {
            name: teamGroup,
            selection: [],
            isSelectionConfirmed: false,
            choices: []
          };
          // Push choices for the teamGroup into the team's choices array
          teamsInGroup.forEach((teamData) => {
            team.choices.push({ name: teamData.teamName, id: teamData.id, teamIcon: teamData.teamIcon });
          });
          // Push the team object to the teams array
          teams.value.push(team);
        }
      }
      // Update selection for selected teams
      res.data.selected.forEach((selectedTeam) => {
        const team = teams.value.find((team) => team.name === selectedTeam.teamGroup);
        if (team) {
          const selectedTeamName = selectedTeam.teamName;
          const choice = team.choices.find((choice) => choice.name === selectedTeamName);
          if (choice) {
            team.selection.push(choice);
            team.isSelectionConfirmed = true;
          }
        }
      });
    }
  });
};

onMounted(() => {
  getMatches();
  getMatchPoints();
  getTeamsData();
});
</script>
<style scoped lang="scss">
$ranking-list: 0.68rem, 0.96rem, 1rem, 1.15rem, 1.65rem, 2.5rem;

@for $i from 1 through length($ranking-list) {
  .ranking-#{$i} {
    // width: nth($ranking-list, $i) !important;
    width: 2.7rem;
    text-align: center;
    font-size: 12px;
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
        justify-content: flex-end;
        align-items: end;
        padding-right: 10px;
        gap: 20px;
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
  align-items: end;
  justify-content: space-between;
  color: #ffffff;
  background: #051d4766;
  border: 1px solid #ffffff66;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 22px;
  font-family: Microsoft YaHei UI;

  .bracket-team-select {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    gap: 18px;
  }

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

    &.pseudo {
      background: transparent;
      padding-top: calc(1.3rem + 6px);
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
      gap: 8px;
      align-items: center;

      .bracket-info__info-wrapper-title {
        font-family: Microsoft YaHei UI;
        font-size: 1.2rem;
        font-weight: 700;
        line-height: 1.5rem;
        text-align: center;
        color: #ffffff;
      }

      .bracket-info__info-wrapper-date {
        font-size: 0.8rem;
        font-weight: 700;
        line-height: 1rem;
        letter-spacing: 0.12em;
        text-align: center;
      }

      .bracket-info__info-wrapper-VS {
        font-family: Poppins;
        font-size: 3rem;
        font-weight: 900;
        line-height: 4rem;
        text-align: center;
        color: #73b2ff1a;
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

.doubling-gold {
  .teams {
    display: grid;
    gap: 15px;
    margin: 20px 0;

    .team {
      .team-box {
        position: relative;
        background-size: contain;
        background: url(../images/teambg.png) no-repeat center center;

        .team-num {
          position: absolute;
          padding: 6px;
          background: linear-gradient(180deg, #f99500 0%, #b34b00 100%);
          width: 20%;
          border-radius: 5px;
          text-align: center;
          color: #ffffff;
          font-family: Microsoft YaHei UI;
          font-size: 20px;
          font-weight: 700;
          line-height: 25.56px;
        }

        .chosen-items {
          margin-left: 20%;
          height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #ffffff;
          font-family: Microsoft YaHei UI;
          font-size: 12px;
          font-weight: 400;
          padding: 10px;

          .selection {
            color: #ffffffcc;
            display: flex;
            gap: 10px;
            justify-content: center;
            align-items: center;

            .selected-items {
              display: flex;
              gap: 10px;
              justify-content: center;
              align-items: center;
              color: #ffffff;
            }
          }

          .unselectedbtn {
            // background: linear-gradient(180deg, #FCF5FF 0%, #8DB9EE 100%);
            // font-family: Microsoft YaHei UI;
            // font-size: 24px;
            // font-weight: 700;
            // line-height: 31.92px;
            // letter-spacing: 0.12em;
            // color: #1A396F;

            background: linear-gradient(180deg, #fcf5ff 0%, #8db9ee 100%);
            font-family: Microsoft YaHei UI;
            font-size: 15px;
            font-weight: 700;
            color: #1a396f;
            padding: 5px 20px;
            border-radius: 24px;
            cursor: pointer;
          }

          .selectedbtn {
            background: linear-gradient(180deg, #008df9 0%, #0051b3 100%);
            font-family: Microsoft YaHei UI;
            font-size: 15px;
            font-weight: 700;
            color: #ffffff;
            padding: 5px 20px;
            border-radius: 24px;
          }
        }

        .choices {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: space-evenly;
          height: 150px;

          .choice {
            display: flex;
            flex-direction: column;
            color: #ffffff;
            align-items: center;
            justify-content: center;
            padding: 5px;
            cursor: pointer;

            .close-icon {
              display: none;
            }

            .team-flag {
              width: 50px;
              height: auto;
              max-height: 50px;
            }

            &.selected {
              border: 1px solid;
              background: linear-gradient(180deg, #00d1ff 0%, #0d70d6 100%);
              border-radius: 14px;
              position: relative;

              .close-icon {
                display: block;
                background: url(../images/close.png);
                position: absolute;
                top: -15px;
                right: -15px;
                width: 35px;
                height: 35px;
                background-size: contain;
              }
            }
          }
          &.isConfirmed {
            .choice {
              opacity: 0.4;
              &.selected {
                opacity: 1;
              }
              .close-icon {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}

.rule-title,
.rule-content {
  font-family: Microsoft YaHei UI;
  line-height: 31.95px;
  letter-spacing: 0.12em;
  text-align: left;
  color: #ffffff;
  margin: 10px 0;
}
.rule-title {
  font-size: 22px;
  font-weight: 700;
  line-height: 42.6px;
}
.rule-content {
  font-size: 16px;
  font-weight: 400;
  margin: 10px;
}
</style>
