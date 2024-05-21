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
          <div class="game-team" v-for="team in groupStageTeamsList"
            @click="openPlat(team.platformMatchId)"
          >
            <div class="game-flag-div">
              <img class="game-logo" :src="imgUrl + team.teamOneIcon"></img>
              <span>{{team.teamOneName}}</span>
            </div>
            <div class="game-time">
              <div class="vs">VS</div>
              <div class="time">{{ team.startTime }}</div>
            </div>
            <div class="game-flag-div">
              <img class="game-logo" :src="imgUrl + team.teamTwoIcon"></img>
              <span>{{team.teamTwoName}}</span>
            </div>
          </div>
        </div>
        <div class="schedule-item" v-if="tab === 'roundOf16'">
          <div class="game-team" v-for="team in roundOf16TeamsList"
               @click="openPlat(team.platformMatchId)"
          >
            <div class="game-flag-div">
              <img class="game-logo" :src="imgUrl + team.teamOneIcon"></img>
              <span>{{team.teamOneName}}</span>
            </div>
            <div class="game-time">
              <div class="vs">VS</div>
              <div class="time">{{ team.startTime }}</div>
            </div>
            <div class="game-flag-div">
              <img class="game-logo" :src="imgUrl + team.teamTwoIcon"></img>
              <span>{{team.teamTwoName}}</span>
            </div>
          </div>
        </div>
        <div class="schedule-item" v-if="tab === 'quarterFinal'">
          <div class="game-team" v-for="team in quarterFinalTeamsList"
               @click="openPlat(team.platformMatchId)"
            >
            <div class="game-flag-div">
              <img class="game-logo" :src="imgUrl + team.teamOneIcon"></img>
              <span>{{team.teamOneName}}</span>
            </div>
            <div class="game-time">
              <div class="vs">VS</div>
              <div class="time">{{ team.startTime }}</div>
            </div>
            <div class="game-flag-div">
              <img class="game-logo" :src="imgUrl + team.teamTwoIcon"></img>
              <span>{{team.teamTwoName}}</span>
            </div>
          </div>
        </div>
        <div class="schedule-item" v-if="tab === 'semiFinalAndFinal'">
          <div class="game-team" v-for="team in semiFinalAndFinalTeamsList"
               @click="openPlat(team.platformMatchId)"
          >
            <div class="game-flag-div">
              <img class="game-logo" :src="imgUrl + team.teamOneIcon"></img>
              <span>{{team.teamOneName}}</span>
            </div>
            <div class="game-time">
              <div class="vs">VS</div>
              <div class="time">{{ team.startTime }}</div>
            </div>
            <div class="game-flag-div">
              <img class="game-logo" :src="imgUrl + team.teamTwoIcon"></img>
              <span>{{team.teamTwoName}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="alert-box">
        <div class="alert-line" v-if="tab === 'groupStage'">
          轮赛事期间，投注赛程任意赛事有效投注额≥500，若投注赛事中触发以下事件，即可获得彩金奖励，触发多个事件彩金累积计算。
        </div>
        <div class="alert-line" v-if="tab === 'roundOf16'">
          第二轮赛事期间，投注赛程任意赛事有效投注额≥500，若投注赛事中触发以下事件，即可获得彩金奖励，触发多个事件彩金累积计算。</div>
        <div class="alert-line" v-if="tab === 'quarterFinal'">
          第三轮赛事期间，投注赛程任意赛事有效投注额≥500，若投注赛事中触发以下事件，即可获得彩金奖励，触发多个事件彩金累积计算。</div>
        <div class="alert-line" v-if="tab === 'semiFinalAndFinal'">第四轮赛事期间，投注赛程任意赛事有效投注额≥500，若投注赛事中触发以下事件，即可获得彩金奖励，触发多个事件彩金累积计算。</div>
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

  <GameModal ref="platformGame"></GameModal>
</template>

<script setup>
import { onMounted } from "vue";
import { getEurocupManualSchedule } from "@/api/promotion/eurocupManual";
import { ref } from "vue";
import moment from "moment";
import GameModal from "@/components/modal/GameModal.vue";

const tab = ref("groupStage");

const groupStageTeamsList = ref([]);
const roundOf16TeamsList = ref([]);
const quarterFinalTeamsList = ref([]);
const semiFinalAndFinalTeamsList = ref([]);
const imgUrl = process.env.VUE_APP_IMAGE_CDN + "/promo/";

const platformGame= ref(null);
const openPlat= (platformMatchId) => {
  var matchId= platformMatchId ?? "";
  platformGame.value.open('FB体育', 'FB', matchId);
}

const init = () => {
  getEurocupManualSchedule().then((res) => {
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
  init();
});
</script>
<style lang="scss" scoped>
.eurocup-manual-container {
  background-image: url("../../../assets/promo/lh-eurocup-manual/background.png");
  position: relative;
}
.banner {
  background-image: url("../../../assets/promo/lh-eurocup-manual/banner.png");
  background-size: 100% 100%;
  width: 100%;
  height: 589px;
  position: absolute;
  top: 0px;
  left: 0px;
  pointer-events: none;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.btn-group {
  display: flex;
  width: 1155px;
  justify-content: space-between;
  align-items: center;
  margin-top: 344px;
  z-index: 1;
}
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 260px;
  height: 105px;
  font-size: 28px;
  color: #fff;
  cursor: pointer;
}

.btn-active {
  background-image: url("../../../assets/promo/lh-eurocup-manual/btn-blue.png");
}

.btn-inactive {
  background-image: url("../../../assets/promo/lh-eurocup-manual/btn-gray.png");
}

.schedule {
  width: 1305px;
  background: linear-gradient(180deg, #0b52a0 0%, #00337f 100%);
  border-radius: 20px;
  margin-top: 27px;
  padding: 38px 36px;
}

.alert-line {
  color: #f4ffe1;
  font-size: 20px;
  line-height: 25.4px;
  margin: 26px 0px;
}

.money-table {
  width: 1305px;
  margin-bottom: 53px;
  table {
    width: 100%;
    font-size: 24px;
    line-height: 30.48px;
    text-align: center;
    border-collapse: separate;
    border-spacing: 0 3px;
  }

  tr {
    height: 64px;
    th {
      &:first-child {
        border-top-left-radius: 20px;
      }
      &:last-child {
        border-top-right-radius: 20px;
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
    /* margin-top: 3px; */
    background: #04204a4d;
  }
}

.info {
  width: 1305px;
  font-size: 24px;
  line-height: 30.48px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 43px;
  .info-item {
    width: 373px;
    position: relative;
    .title {
      background-image: url("../../../assets/promo/lh-eurocup-manual/info-back.png");
      width: 207px;
      height: 55px;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      position: absolute;
      top: -28px;
      left: 50%;
      translate: -50%;
    }
    .content {
      width: 373px;
      height: 166px;
      background: linear-gradient(180deg, #aae5ff 0%, #6fbaff 100%);
      border: 2px solid #b0d4ff;
      border-radius: 20px;
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
  gap: 53px;
}

.game-team {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 216px;
  padding: 8px 8px;
  gap: 5px;
  cursor: pointer;

  &:hover{
    background: rgba(255,255,255,0.1);
    border-radius: 8px;
  }

  &:active{
    filter:brightness(0.9);
  }

  .game-flag-div{
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;

    span{
      color: #fff;
      font-size: 16px;
    }
  }

  .game-time {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .vs {
      font-size: 32px;
      line-height: 38px;
      color: #ffffff1a;
      font-family: FZHanZhenGuangBiaoS-GB;
    }
    .time {
      font-size: 12px;
      line-height: 15.24px;
      color: #fff;
      font-family: Microsoft YaHei UI;
    }
  }
  .game-logo {
    width: 54px;
    height: 54px;
    /* background-color: #fff; */
    border-radius: 4px;
  }
}

.notice {
  width: 1305px;
  margin-bottom: 99px;
  ul {
    padding: 0px;
    list-style: none;
    li {
      font-size: 20px;
      line-height: 25.4px;
      color: #E1F2FF;
      font-weight: 400;
      padding: 10px 0;
    }
  }
}
</style>
