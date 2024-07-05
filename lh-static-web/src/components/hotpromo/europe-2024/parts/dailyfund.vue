<template>
  <div class="tab-title">
    {{ tabtitle }}
  </div>
  <div class="fund-wrapper">
    <img src="../images/daily-fund-logo.png" class="fund-logo" />
    <div class="fund-inner-wrapper">
      <div class="fund-status">
        <span class="fund-status__point-title">总积分</span>
        <div class="fund-status__point">{{ matchPoints.currentPoints }}</div>
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
        <el-progress
          :percentage="getPercentage(matchPoints.currentPoints)"
          class="fund-progress-bar"
          :show-text="false"
          color=" linear-gradient(180deg, #00D1FF 0%, #0D70D6 100%)"
        />
        <div class="fund-progress-ranking-wrapper">
          <div v-for="(num, i) in rankPoints" :key="`ranking-text-${i + 1}`" :class="`ranking-${i + 1}`">
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
      <div v-for="(team, teamindex) in teams" class="team">
        <div class="team-box">
          <div class="team-num">{{ team.name }} 组</div>
          <div class="chosen-items">
            <div class="selection">
              <span class="selection-prefix">{{ team.selection.length > 0 ? " 已选择：" : "请选队伍" }}</span>
              <div class="selected-items">
                <div v-for="t in team.selection">
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
              v-for="choice in team.choices"
              class="choice"
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

  <el-dialog width="500" :title="selectedMatch.title" v-model="confirmDialog">
    <div class="dialog-header">
      <span>
        您确定要选择
        <span style="font-weight: bold; color: #0051b3">{{ selectedItem.name }}</span>
        吗？请注意，一旦选择后将无法更改。
      </span>
    </div>
    <div class="dialog-footer">
      <el-button color="grey" @click="confirmDialog = false">取消</el-button>
      <el-button type="primary" @click="confirmMatchSelect(selectedMatch.id, selectedItem.id)">确定</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { defineProps, ref } from "vue";
import BracketTeam from "./components/BracketTeam.vue";
import { onMounted } from "vue";
import {
  euroMatchOngoing,
  euroMatchPoints,
  euroClaimMatchPoints,
  euroMatchSubmit,
  getTeams,
  submitTeam
} from "@/api/promotion/eurocup";
import { ElMessage } from "element-plus";
import moment from "moment";
import {  useLocalStorage } from "@vueuse/core";

const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value + "/promo/";

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
const imgUrl = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
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

const matchStartAt = ref("比赛剩余")

const teams = ref([]);
const getMatchPoints = () => {
  euroMatchPoints().then((res) => {
    if (res.code === 0) {
      matchPoints.value = res.data;
      if(moment().format("YYYY-MM-DD HH:mm") <= "2024-06-15 03:00"){
        remainingTime.value = calculateRemainingTime("2024-06-15 02:59:59");
        matchStartAt.value = "比赛倒计时"
      }else{
        remainingTime.value = calculateRemainingTime(res.data.endDate);
      }
    } else {
      ElMessage.error(res.message);
    }
  });
};
const claimPoint = (points) => {
  euroClaimMatchPoints(points).then((res) => {
    if (res.code === 0) {
      ElMessage.success("领取成功");
    } else {
      ElMessage.error(res.message);
    }
  });
};
const getMatches = () => {
  euroMatchOngoing().then((res) => {
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
  euroMatchSubmit(selectedMatch.value.id, selectedItem.value.id).then((res) => {
    if (res.code === 0) {
      ElMessage.success("投票成功");
      confirmDialog.value = false;
      getMatches();
    } else {
      ElMessage.error(res.message)
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
    submitTeam(teamIds).then((res) => {
      if (res.code === 0) {
        team.isSelectionConfirmed = true;
        getTeamsData();
      } else {
        ElMessage.error(res.message)
      }
    });
  }
}

const getTeamsData = () => {
  getTeams().then((res) => {
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
$ranking-list: 36px, 49px, 50px, 59px, 85px, 95px, 90px;

@for $i from 1 through length($ranking-list) {
  .ranking-#{$i} {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 100px;
    div {
      display: flex;
      gap: 5px;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      font-size: 20px;
    }
    img {
      width: 90px;
    }
  }
}

.ranking-0 {
  width: 100px;
}

.note {
  font-family: Microsoft YaHei UI;
  font-size: 24px;
  font-weight: 400;
  line-height: 31.92px;
  letter-spacing: 0.12em;
  text-align: center;
  color: #faff00;
  margin: 40px auto !important;
}

.fund-wrapper {
  padding: 10px 0;
  position: relative;
  font-family: Microsoft YaHei UI;
  margin-bottom: 43px;

  .fund-logo {
    position: absolute;
    top: 0;
    left: -54px;
    bottom: 0;
    margin: auto;
  }

  .fund-inner-wrapper {
    background-color: #143cda66;
    padding: 35px 28px 35px 192px;
    display: flex;
    gap: 35px;
    border-radius: 28px;
    color: #ffffff;

    .fund-status {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .fund-status__point-title {
        font-size: 24px;
        line-height: 31.92px;
        color: #ffffff66;
        margin-bottom: 16px;
      }

      .fund-status__point {
        background-color: #002977;
        font-size: 48px;
        font-weight: 700;
        line-height: 63.84px;
        margin-bottom: 25px;
        padding: 0 33px;
        border-radius: 9px;
      }

      .fund-contest-time-left {
        display: flex;
        gap: 8px;
        font-size: 16px;
        line-height: 21.28px;

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

      .fund-progress-ranking-wrapper {
        display: flex;
        justify-content: flex-start;
        gap: 45px;

        align-items: flex-end;
        width: 100%;
        font-size: 24px;
        .claim {
          width: 100px;
          cursor: pointer;
          img {
            width: 100%;
          }
        }

        &:last-child {
          align-items: flex-start;
          font-size: 24px;
          line-height: 31.92px;
        }
        &:not(:last-child) {
          margin-bottom: 15px;
        }
      }

      .fund-progress-bar {
        width: 100%;
        margin-bottom: 38px;

        &:deep(.el-progress-bar) {
          .el-progress-bar__outer {
            height: 20px !important;
            background-color: #ffffff1a;
            .el-progress-bar__inner {
              background: linear-gradient(180deg, #00d1ff 0%, #0d70d6 100%) !important;
            }
          }
        }
      }
    }
  }
}

.bracket-list-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 60px;
  margin-bottom: 65px;
}

.bracket-wrapper {
  display: flex;
  justify-content: space-evenly;
  align-items: end;
  padding: 20px 0;
  color: #ffffff;
  background: #051d4766;
  border: 1px solid #ffffff66;
  border-radius: 8px;
  font-family: Microsoft YaHei UI;

  .bracket-team-select {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    gap: 35px;
    flex: 1;
  }

  .bracket-team-select__button {
    background: linear-gradient(180deg, #fcf5ff 0%, #8db9ee 100%);
    padding: 12px 52px;
    border-radius: 33px;
    font-size: 26px;
    font-weight: 700;
    line-height: 32px;
    letter-spacing: 0.12em;
    color: #333333;
    word-break: keep-all;

    &:hover,
    &.active {
      background: linear-gradient(180deg, #008df9 0%, #0051b3 100%);
      color: #ffffff;
    }

    &.pseudo {
      background: transparent;
      padding-top: 44px;
    }
  }

  .bracket-info {
    display: flex;
    flex-direction: column;
    flex: 1;

    .bracket-info__info-wrapper {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;

      .bracket-info__info-wrapper-title {
        font-family: Microsoft YaHei UI;
        font-size: 36px;
        font-weight: 700;
        line-height: 47.88px;
        text-align: center;
        color: #ffffff;
      }

      .bracket-info__info-wrapper-date {
        font-family: Microsoft YaHei UI;
        font-size: 20px;
        font-weight: 400;
        line-height: 26.6px;
        text-align: center;
      }

      .bracket-info__info-wrapper-VS {
        font-family: Poppins;
        font-size: 70.71px;
        font-weight: 900;
        line-height: 106.07px;
        text-align: center;
        color: #73b2ff1a;
      }
    }
  }
}

.dialog-header {
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 18px;
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.doubling-gold {
  .teams {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px 60px;
    margin: 20px auto;

    .team {
      .team-box {
        position: relative;
        background-size: contain;
        background: url(../images/teambg.png) no-repeat center center;

        .team-num {
          position: absolute;
          padding: 6px;
          background: linear-gradient(180deg, #f99500 0%, #b34b00 100%);
          width: 19%;
          border-radius: 5px;
          text-align: center;
          color: #ffffff;
          font-family: Microsoft YaHei UI;
          font-size: 24px;
          font-weight: 700;
          line-height: 35.56px;
        }

        .chosen-items {
          margin-left: 23%;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #ffffff;
          font-family: Microsoft YaHei UI;
          font-size: 18px;
          font-weight: 400;
          line-height: 23.94px;
          letter-spacing: 0.12em;
          text-align: left;
          padding: 10px;

          .selection {
            color: #ffffffcc;
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-self: flex-start;

            .selection-prefix {
              font-size: 14px;
              font-weight: 400;
              line-height: 18.62px;
            }

            .selected-items {
              display: flex;
              align-items: center;
              gap: 10px;
              color: #ffffff;
            }
          }

          .unselectedbtn {
            background: linear-gradient(180deg, #fcf5ff 0%, #8db9ee 100%);
            font-family: Microsoft YaHei UI;
            font-size: 20px;
            font-weight: 700;
            line-height: 28px;
            letter-spacing: 0.12em;
            color: #1a396f;
            cursor: disabled;
            border-radius: 24px;
            padding: 5px 20px;
            cursor: pointer;
          }

          .selectedbtn {
            background: linear-gradient(180deg, #008df9 0%, #0051b3 100%);
            font-family: Microsoft YaHei UI;
            font-size: 20px;
            font-weight: 700;
            line-height: 28px;
            letter-spacing: 0.12em;
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
          padding: 25px 0;
          .choice {
            display: flex;
            flex-direction: column;
            color: #ffffff;
            align-items: center;
            justify-content: center;
            padding: 10px 10px;
            cursor: pointer;

            .close-icon {
              display: none;
            }

            .team-flag {
              width: 64px;
              height: auto;
              max-height: 64px;
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
  letter-spacing: 0.12em;
  text-align: left;
  color: #ffffff;
  margin: 10px 0;
}
.rule-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 42.6px;
}
.rule-content {
  font-size: 20px;
  line-height: 24px;
  font-weight: 400;
}
</style>
