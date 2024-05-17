<template>
  <div class="eurocup-manual-container">
    <div class="banner"></div>
    <div class="container">
      <div class="btn-group">
        <div class="btn btn-active" :class="{ 'btn-inactive': tab !== 'groupStage' }" @click="tab = 'groupStage'">
          小組賽
        </div>
        <div class="btn btn-active" :class="{ 'btn-inactive': tab !== 'roundOf16' }" @click="tab = 'roundOf16'">
          十六強賽
        </div>
        <div class="btn btn-active" :class="{ 'btn-inactive': tab !== 'quarterFinal' }" @click="tab = 'quarterFinal'">
          4/1決賽
        </div>
        <div
          class="btn btn-active"
          :class="{ 'btn-inactive': tab !== 'semiFinalAndFinal' }"
          @click="tab = 'semiFinalAndFinal'"
        >
          半/总决赛
        </div>
      </div>
      <div class="schedule">
        <div class="schedule-item" v-if="tab === 'groupStage'">
          <div class="game-team" v-for="team in groupStageTeamsList" v-bind:key="team.id">
            <img class="game-logo" :src="imgUrl + team.teamOneIcon" />
            <div class="game-time">
              <div class="vs">VS</div>
              <div class="time">{{ team.startTime }}</div>
            </div>
            <img class="game-logo" :src="imgUrl + team.teamTwoIcon" />
          </div>
        </div>
        <div class="schedule-item" v-if="tab === 'roundOf16'">
          <div class="game-team" v-for="team in roundOf16TeamsList" v-bind:key="team.id">
            <img class="game-logo" :src="imgUrl + team.teamOneIcon" />
            <div class="game-time">
              <div class="vs">VS</div>
              <div class="time">{{ team.startTime }}</div>
            </div>
            <img class="game-logo" :src="imgUrl + team.teamTwoIcon" />
          </div>
        </div>
        <div class="schedule-item" v-if="tab === 'quarterFinal'">
          <div class="game-team" v-for="team in quarterFinalTeamsList" v-bind:key="team.id">
            <img class="game-logo" :src="imgUrl + team.teamOneIcon" />
            <div class="game-time">
              <div class="vs">VS</div>
              <div class="time">{{ team.startTime }}</div>
            </div>
            <img class="game-logo" :src="imgUrl + team.teamTwoIcon" />
          </div>
        </div>
        <div class="schedule-item" v-if="tab === 'semiFinalAndFinal'">
          <div class="game-team" v-for="team in semiFinalAndFinalTeamsList" v-bind:key="team.id">
            <img class="game-logo" :src="imgUrl + team.teamOneIcon" />
            <div class="game-time">
              <div class="vs">VS</div>
              <div class="time">{{ team.startTime }}</div>
            </div>
            <img class="game-logo" :src="imgUrl + team.teamTwoIcon" />
          </div>
        </div>
      </div>
      <div class="alert-box">
        <div class="alert-line" v-if="tab === 'groupStage'">
          轮赛事期间，投注赛程任意赛事有效投注额≥500，若投注赛事中触发以下事件，即可获得彩金奖励，触发多个事件彩金累积计算。
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
      <div class="notice">
        <ul>
          <li>1.活动期间，会员投注赛程任意赛事有效投注额≥500 即可参与活动，若投注赛事触发事件则可以获得对应彩金，若触发多个事件彩金累计计算；</li>
          <li>2.本活动限所有体育场馆的早盘盘口参与，如会员同时在各体育场馆投注同一场比赛，该场比赛的有效投注额将累计计算；</li>
          <li>3.本活动有效投注额仅对已结算并产生输赢结果的早盘盘口投注额进行计算，任何滚球、走水、串关、提前结算的投注、取消的赛事将不计算在有效投注，任何低于欧洲盘1.70或亚洲盘0.70水位的投注以及在同一赛事中同时投注对等盘口，将不计算在投注额内；</li>
          <li>4.达到活动要求的会员，彩金于次日24点前派发至福利中心，彩金仅需一倍流水即可出款；</li>
          <li>5.同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；</li>
          <li>6.任何用户或团体以不正常的方式进行套取活动优惠，亿博体育保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；</li>
          <li>7.为避免文字理解差异，本站保留本活动最终解释权。</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { getEurocupManualSchedule } from "../../../api/index/promo";
import moment from "moment";
const tab = ref("groupStage");

const groupStageTeamsList = ref([]);
const roundOf16TeamsList = ref([]);
const quarterFinalTeamsList = ref([]);
const semiFinalAndFinalTeamsList = ref([]);
const imgUrl = process.env.IMAGE_CDN + "/promo/";

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

onMounted(() => {
  console.log("123456789");
  init();
});
</script>
<style lang="scss" scoped>
.eurocup-manual-container {
  background-image: url("../../../assets/promo/lh-eurocup-manual/background.png");
  background-size: 100% 100%;
  position: relative;
  width: 100%;
}
.banner {
  background-image: url("../../../assets/promo/lh-eurocup-manual/banner.png");
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
  width: 95%;
  justify-content: space-between;
  align-items: center;
  margin-top: 180px;
  z-index: 1;
}
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
}

.btn-active {
  background-image: url("../../../assets/promo/lh-eurocup-manual/btn-blue.png");
  background-size: 100% 100%;
}

.btn-inactive {
  background-image: url("../../../assets/promo/lh-eurocup-manual/btn-gray.png");
  background-size: 100% 100%;
}

.schedule {
  width: 95%;
  background: linear-gradient(180deg, #0b52a0 0%, #00337f 100%);
  border-radius: 20px;
  margin-top: 27px;
  padding: 10px 10px;
  margin: 10px;
}
.alert-box {
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  .alert-line {
    color: #f4ffe1;
    font-size: 12px;
    line-height: 25.4px;
    margin: 14px 0px;
  }
}

.money-table {
  width: 95%;
  margin-bottom: 53px;
  table {
    width: 100%;
    font-size: 10px;
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
    background: #beebff;
    color: #0d1057;
    font-weight: 700;
  }

  td {
    border-spacing: 0 16px;
    color: #fff;
    border: none !important;
    /* margin-top: 3px; */
    background: #04204a4d !important;
  }
}

.info {
  width: 95%;
  font-size: 12px;
  line-height: 30.48px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .info-item {
    position: relative;
    .title {
      background-image: url("../../../assets/promo/lh-eurocup-manual/info-back.png");
      width: 80px;
      height: 28px;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      position: absolute;
      top: -14px;
      left: 50%;
      translate: -50%;
    }
    .content {
      line-height: 16px;
      width: 150px;
      height: 70px;
      background: linear-gradient(180deg, #aae5ff 0%, #6fbaff 100%);
      border: 2px solid #b0d4ff;
      border-radius: 5px;
      color: #0d4b57;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: 400;
    }
  }
}

.schedule-item {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.game-team {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 130px;
  .game-time {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .vs {
      font-size: 24px;
      line-height: 20px;
      color: #ffffff1a;
      font-family: FZHanZhenGuangBiaoS-GB;
    }
    .time {
      font-size: 10px;
      line-height: 15.24px;
      color: #fff;
      font-family: Microsoft YaHei UI;
    }
  }
  .game-logo {
    width: 30px !important;
    height: 30px;
    //background-color: #fff;
    border-radius: 4px;
    margin-bottom: 0px !important;
  }
}

.notice {
  width: 100%;
  margin-bottom: 50px;
  ul {
    padding: 0px;
    list-style: none;
    li {
      font-size: 10px;
      line-height: 12px;
      color: #e1f2ff;
      font-weight: 400;
      margin-bottom: 5px !important;
    }
  }
}
</style>
