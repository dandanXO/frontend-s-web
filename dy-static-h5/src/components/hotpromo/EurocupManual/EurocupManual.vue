<template>
  <div class="eurocup-manual-container">
    <div class="container">
      <div class="btn-group">
        <div class="btn btn-active" :class="{ 'btn-inactive': tab !== 'groupStage' }" @click="tab = 'groupStage'">
          小组赛
        </div>
        <div class="btn btn-active" :class="{ 'btn-inactive': tab !== 'roundOf16' }" @click="tab = 'roundOf16'">
          十六强赛
        </div>
        <div class="btn btn-active" :class="{ 'btn-inactive': tab !== 'quarterFinal' }" @click="tab = 'quarterFinal'">
          4/1决赛
        </div>
        <div
          class="btn btn-active"
          :class="{ 'btn-inactive': tab !== 'semiFinalAndFinal' }"
          @click="tab = 'semiFinalAndFinal'"
        >
          半/总决赛
        </div>
      </div>
      <div class="common-title">欧洲杯{{ matchType }}赛程</div>
      <div class="schedule">
        <div class="schedule-item" v-if="tab === 'groupStage'">
          <div class="game-team" v-for="team in groupStageTeamsList" v-bind:key="team.id">
            <div class="game-item">
              <img class="game-logo" :src="imgUrl + team.teamOneIcon" />
              <div class="game-country" v-html="team.teamOneName" />
            </div>
            <div class="game-time">
              <div class="vs"><img src="../../../assets/promo/dy-eurocup-manual/vs.png" /></div>
              <div class="time">{{ team.startTime }}</div>
              <div class="clickBet" @click="openPlat(team.platformMatchId)">点击投注</div>
            </div>
            <div class="game-item">
              <img class="game-logo" :src="imgUrl + team.teamTwoIcon" />
              <div class="game-country" v-html="team.teamTwoName" />
            </div>
          </div>
        </div>
        <div class="schedule-item" v-if="tab === 'roundOf16'">
          <div class="game-team" v-for="team in roundOf16TeamsList" v-bind:key="team.id">
            <div class="game-item">
              <img class="game-logo" :src="imgUrl + team.teamOneIcon" />
              <div class="game-country" v-html="team.teamOneName" />
            </div>
            <div class="game-time">
              <div class="vs"><img src="../../../assets/promo/dy-eurocup-manual/vs.png" /></div>
              <div class="time">{{ team.startTime }}</div>
              <div class="clickBet" @click="openPlat(team.platformMatchId)">点击投注</div>
            </div>
            <div class="game-item">
              <img class="game-logo" :src="imgUrl + team.teamTwoIcon" />
              <div class="game-country" v-html="team.teamTwoName" />
            </div>
          </div>
        </div>
        <div class="schedule-item" v-if="tab === 'quarterFinal'">
          <div class="game-team" v-for="team in quarterFinalTeamsList" v-bind:key="team.id">
            <div class="game-item">
              <img class="game-logo" :src="imgUrl + team.teamOneIcon" />
              <div class="game-country" v-html="team.teamOneName" />
            </div>
            <div class="game-time">
              <div class="vs"><img src="../../../assets/promo/dy-eurocup-manual/vs.png" /></div>
              <div class="time">{{ team.startTime }}</div>
              <div class="clickBet" @click="openPlat(team.platformMatchId)">点击投注</div>
            </div>
            <div class="game-item">
              <img class="game-logo" :src="imgUrl + team.teamTwoIcon" />
              <div class="game-country" v-html="team.teamTwoName" />
            </div>
          </div>
        </div>
        <div class="schedule-item" v-if="tab === 'semiFinalAndFinal'">
          <div class="game-team" v-for="team in semiFinalAndFinalTeamsList" v-bind:key="team.id">
            <div class="game-item">
              <img class="game-logo" :src="imgUrl + team.teamOneIcon" />
              <div class="game-country" v-html="team.teamOneName" />
            </div>
            <div class="game-time">
              <div class="vs"><img src="../../../assets/promo/dy-eurocup-manual/vs.png" /></div>
              <div class="time">{{ team.startTime }}</div>
              <div class="clickBet" @click="openPlat(team.platformMatchId)">点击投注</div>
            </div>
            <div class="game-item">
              <img class="game-logo" :src="imgUrl + team.teamTwoIcon" />
              <div class="game-country" v-html="team.teamTwoName" />
            </div>
          </div>
        </div>
      </div>

      <div class="shade">
        <div class="common-title">活动详情</div>
        <div class="alert-box">
          <div class="alert-line" v-if="tab === 'groupStage'">
            小组赛赛事期间，投注赛程任意赛事有效投注额≥500，若投注赛事中触发以下事件，即可获得彩金奖励，触发多个事件彩金累积计算。
          </div>
          <div class="alert-line" v-if="tab === 'roundOf16'">
            第二轮赛事期间，投注赛程任意赛事有效投注额≥500，若投注赛事中触发以下事件，即可获得彩金奖励，触发多个事件彩金累积计算。
          </div>
          <div class="alert-line" v-if="tab === 'quarterFinal'">
            第三轮赛事期间，投注赛程任意赛事有效投注额≥500，若投注赛事中触发以下事件，即可获得彩金奖励，触发多个事件彩金累积计算。
          </div>
          <div class="alert-line" v-if="tab === 'semiFinalAndFinal'">
            第四轮赛事期间，投注赛程任意赛事有效投注额≥500，若投注赛事中触发以下事件，即可获得彩金奖励，触发多个事件彩金累积计算。
          </div>
        </div>
        <div class="money-table">
          <table v-if="tab === 'groupStage'">
            <tr>
              <th>任意赛事早盘有效投注</th>
              <th>首当其冲</th>
              <th>梅开二度</th>
              <th>势如破竹</th>
            </tr>
            <tr>
              <td>500</td>
              <td>3</td>
              <td>5</td>
              <td>6</td>
            </tr>
            <tr>
              <td>1,000</td>
              <td>8</td>
              <td>10</td>
              <td>12</td>
            </tr>
            <tr>
              <td>5,000</td>
              <td>18</td>
              <td>36</td>
              <td>38</td>
            </tr>
            <tr>
              <td>10,000</td>
              <td>36</td>
              <td>58</td>
              <td>88</td>
            </tr>
            <tr>
              <td>50,000</td>
              <td>188</td>
              <td>288</td>
              <td>388</td>
            </tr>
          </table>
          <table v-if="tab === 'roundOf16'">
            <tr>
              <th>任意赛事早盘有效投注</th>
              <th>扭转乾坤</th>
              <th>绝处逢生</th>
              <th>帽子戏法</th>
            </tr>
            <tr>
              <td>500</td>
              <td>3</td>
              <td>5</td>
              <td>6</td>
            </tr>
            <tr>
              <td>1,000</td>
              <td>8</td>
              <td>10</td>
              <td>12</td>
            </tr>
            <tr>
              <td>5,000</td>
              <td>18</td>
              <td>36</td>
              <td>38</td>
            </tr>
            <tr>
              <td>10,000</td>
              <td>36</td>
              <td>58</td>
              <td>88</td>
            </tr>
            <tr>
              <td>50,000</td>
              <td>188</td>
              <td>288</td>
              <td>388</td>
            </tr>
          </table>
          <table v-if="tab === 'quarterFinal' || tab === 'semiFinalAndFinal'">
            <tr>
              <th>任意赛事早盘有效投注</th>
              <th>首当其冲</th>
              <th>扭转乾坤</th>
              <th>梅开二度</th>
              <th>绝处逢生</th>
              <th>势如破竹</th>
              <th>帽子戏法</th>
            </tr>
            <tr>
              <td>500</td>
              <td>3</td>
              <td>3</td>
              <td>5</td>
              <td>5</td>
              <td>6</td>
              <td>6</td>
            </tr>
            <tr>
              <td>1,000</td>
              <td>8</td>
              <td>8</td>
              <td>10</td>
              <td>10</td>
              <td>12</td>
              <td>12</td>
            </tr>
            <tr>
              <td>5,000</td>
              <td>18</td>
              <td>18</td>
              <td>36</td>
              <td>36</td>
              <td>38</td>
              <td>38</td>
            </tr>
            <tr>
              <td>10,000</td>
              <td>36</td>
              <td>36</td>
              <td>58</td>
              <td>58</td>
              <td>88</td>
              <td>88</td>
            </tr>
            <tr>
              <td>50,000</td>
              <td>188</td>
              <td>188</td>
              <td>288</td>
              <td>288</td>
              <td>388</td>
              <td>388</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="info" v-if="tab === 'groupStage' || tab === 'quarterFinal' || tab === 'semiFinalAndFinal'">
        <div class="info-item">
          <div class="title">首当其冲</div>
          <div class="content">
            <span>15分钟内（含15分钟）</span>
            <span>有进球</span>
          </div>
        </div>
        <div class="info-item">
          <div class="title">梅开二度</div>
          <div class="content">
            <span>任意方球员</span>
            <span>进两个球</span>
          </div>
        </div>
        <div class="info-item">
          <div class="title">势如破竹</div>
          <div class="content">
            <span>胜方赢球3个</span>
            <span>且零封对手</span>
          </div>
        </div>
      </div>
      <div class="info" v-if="tab === 'roundOf16' || tab === 'quarterFinal' || tab === 'semiFinalAndFinal'">
        <div class="info-item">
          <div class="title">扭转乾坤</div>
          <div class="content">
            <span>任意一方落后</span>
            <span>反超比分取胜</span>
          </div>
        </div>
        <div class="info-item">
          <div class="title">绝处逢生</div>
          <div class="content">
            <span>90分钟后（含90分钟）</span>
            <span>绝杀取胜或绝杀扳平比分</span>
          </div>
        </div>
        <div class="info-item">
          <div class="title">帽子戏法</div>
          <div class="content">
            <span>任意球员</span>
            <span>取得3个进球</span>
          </div>
        </div>
      </div>
      <div class="notice shade">
        <div class="common-title">活动规则</div>
        <ul>
          <li>
            1.活动期间，会员投注赛程任意赛事有效投注额≥500
            即可参与活动，若投注赛事触发事件则可以获得对应彩金，若触发多个事件彩金累计计算；
          </li>
          <li>
            2.本活动仅限FB体育、IM体育、熊猫体育（沙巴体育不予计算）的早盘盘口参与，如会员同时在FB体育、IM体育、熊猫体育场馆投注同一场比赛，该场比赛的有效投注额将累计计算；
          </li>
          <li>
            3.本活动有效投注额仅对已结算并产生输赢结果的早盘盘口投注额进行计算，任何滚球、走水、串关、提前结算的投注、取消的赛事将不计算在有效投注，任何低于欧洲盘1.70或亚洲盘0.70水位的投注以及在同一赛事中同时投注对等盘口，将不计算在投注额内；
          </li>
          <li>4.达到活动要求的会员，彩金于次日24点前派发至福利中心，彩金仅需一倍流水即可出款；</li>
          <li>5.同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；</li>
          <li>
            6.任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；
          </li>
          <li>7.为避免文字理解差异，本站保留本活动最终解释权。</li>
        </ul>
      </div>
    </div>
  </div>
  <GameModal ref="platformGame"></GameModal>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { getEurocupManualSchedule } from "../../../api/index/promo";
import GameModal from "components/modal/GameModal.vue";
import moment from "moment";
import { useLocalStorage } from "@vueuse/core";
const tab = ref("groupStage");

const groupStageTeamsList = ref([]);
const roundOf16TeamsList = ref([]);
const quarterFinalTeamsList = ref([]);
const semiFinalAndFinalTeamsList = ref([]);
const imgUrl = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";

const matchType = computed(() => {
  if (tab.value === "roundOf16") {
    return "十六强赛";
  } else if (tab.value === "quarterFinal") {
    return "4/1决赛";
  } else if (tab.value === "semiFinalAndFinal") {
    return "半/总决赛";
  }
  return "小组赛";
});
const init = () => {
  getEurocupManualSchedule().then((res) => {
    console.log("123456");
    if (res.code === 0) {
      const { groupStageTeams, roundOf16Teams, quarterFinalTeams, semiFinalAndFinalTeams } = filterTeamsByStage(
        res.data
      );
      groupStageTeamsList.value = groupStageTeams;
      roundOf16TeamsList.value = roundOf16Teams;
      quarterFinalTeamsList.value = quarterFinalTeams;
      semiFinalAndFinalTeamsList.value = semiFinalAndFinalTeams;
    }
  });
};

function filterTeamsByStage(teams) {
  console.log(teams);
  const stages = {
    groupStage: ["A", "B", "C", "D", "E", "F"],
    roundOf16: "16",
    quarterFinal: ["8", "4"],
    semiFinalAndFinal: ["2", "1"]
  };

  const teamsMoment = teams.map((team) => {
    return {
      ...team,
      startTime: moment(team.matchTime).format("MM/DD HH:mm")
    };
  });

  return {
    groupStageTeams: teamsMoment.filter((team) => stages.groupStage.includes(team.teamGroup)),
    roundOf16Teams: teamsMoment.filter((team) => team.teamGroup === stages.roundOf16),
    quarterFinalTeams: teamsMoment.filter((team) => stages.quarterFinal.includes(team.teamGroup)),
    semiFinalAndFinalTeams: teamsMoment.filter((team) => stages.semiFinalAndFinal.includes(team.teamGroup))
  };
}

const platformGame = ref(null);
const openPlat = (platformMatchId) => {
  var matchId = platformMatchId ?? "";
  platformGame.value.open("FB体育", "FB", matchId);
};

onMounted(() => {
  if (!store.token) {
    return;
  }
  init();
});
</script>
<style lang="scss" scoped>
.eurocup-manual-container {
  position: relative;
  width: 100%;

  .container {
    width: calc(100% - 20px);
    margin: 0 auto;
  }

  .common-title {
    font-family: Play;
    font-size: 20px;
    font-weight: 700;
    margin: 15px auto 0;
    color: #0099d8;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 10px;
    text-wrap: nowrap;
    white-space: nowrap;

    &:before,
    &:after {
      content: "";
      background: url(../../../assets/promo/dy-eurocup-manual/title-bar.png) no-repeat center center;
      height: 9vw;
      width: 180px;
      background-size: contain;
    }
  }
}
.banner {
  background-image: url("../../../assets/promo/dy-eurocup-manual/banner.png");
  background-size: 100% 100%;
  background-position: top center;
  width: 100%;
  height: 200px;
  position: absolute;
  top: 0px;
  left: 0px;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.btn-group {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 48px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}

.btn-active {
  background-image: url("../../../assets/promo/dy-eurocup-manual/btn-blue.png");
  background-size: 100% 100%;
}

.btn-inactive {
  background-image: url("../../../assets/promo/dy-eurocup-manual/btn-gray.png");
  background-size: 100% 100%;
}

.schedule {
  width: 100%;
  background: linear-gradient(
    243.03deg,
    #1960ac 0%,
    rgba(25, 96, 172, 0.6) 6.15%,
    rgba(25, 96, 172, 0) 12.62%,
    rgba(25, 96, 172, 0) 87.87%,
    rgba(25, 96, 172, 0.6) 93.2%,
    #1960ac 100%
  );
  border: 1px solid #1af4ff;
  margin: 20px auto 10px;
  padding: 10px 10px;
}
.shade {
  background: linear-gradient(
    243.03deg,
    #1960ac 0%,
    rgba(25, 96, 172, 0.6) 6.15%,
    rgba(25, 96, 172, 0) 12.62%,
    rgba(25, 96, 172, 0) 87.87%,
    rgba(25, 96, 172, 0.6) 93.2%,
    #1960ac 100%
  );
  width: 100%;
  border: 1px solid #1af4ff;
  padding: 10px;
  margin: 20px auto;
}
.alert-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  .alert-line {
    color: #f4ffe1;
    font-size: 14px;
    line-height: 25.4px;
    margin: 14px 0px;
  }
}

.money-table {
  width: 100%;
  table {
    width: 100%;
    font-size: 13px;
    line-height: 16px;
    text-align: center;
    border-collapse: separate !important;
    border-spacing: 0 3px !important;
  }

  tr {
    height: 16px;
    th {
      &:first-child {
        border-top-left-radius: 5px;
      }
      &:last-child {
        border-top-right-radius: 5px;
      }
    }
  }

  th {
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    color: #ffffff;
    font-weight: 700;
  }

  td {
    border: 1px solid #acd4f6;
    color: #fff;
    border: none !important;
    /* margin-top: 3px; */
    background: #04204a4d !important;
  }
}

.info {
  width: 100%;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-wrap: nowrap;
  gap: 10px;
  margin: 10px 0;
  .info-item {
    padding: 5px;
    position: relative;
    gap: 10px;
    display: flex;
    flex-direction: column;
    background: url(../../../assets/promo/dy-eurocup-manual/info-bg.png) no-repeat center center;
    background-size: cover;
    width: 32%;
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-family: Play;
      font-size: 16px;
      font-weight: 700;
    }
    .content {
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: Play;
      font-size: 13px;
      font-weight: 400;
      text-align: center;
    }
  }
}

.schedule-item {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;

  @media (max-width: 410px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

.game-team {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 165px;
  padding: 4px;

  @media (max-width: 410px) {
    padding: 0px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }

  .game-time {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex: 2;
    .vs {
      font-size: 24px;
      line-height: 20px;
      color: #ffffff1a;
      font-family: FZHanZhenGuangBiaoS-GB;
      width: 20px;
    }
    .time {
      font-size: 10px;
      line-height: 15.24px;
      color: #ffffff80;
      font-family: Microsoft YaHei UI;
      text-align: center;
    }
    .clickBet {
      background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      color: #ffffff;
      padding: 3px 5px;
      border-radius: 20px;
      margin: 5px 0;
      cursor: pointer;
      font-size: 10px;
    }
  }
  .game-logo {
    width: 30px !important;
    height: 30px;
    //background-color: #fff;
    border-radius: 4px;
    margin-bottom: 0px !important;
  }
  .game-country {
    color: #ffffff;
    font-size: 10px;
  }
  .game-item {
    text-align: center;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 5px;
    flex: 1;
  }
}

.notice {
  width: 100%;
  margin-bottom: 50px;
  ul {
    padding: 0px;
    list-style: none;
    li {
      font-size: 14px;
      line-height: 16px;
      color: #e1f2ff;
      font-weight: 400;
      margin-bottom: 10px !important;
    }
  }
}
</style>
