<template>
  <div class="nba24-match-box">
    <div class="nba24-match-container">
      <div class="nba24-match-game" v-for="(match, index) in matchList" :key="index">
        <div class="nba24-match-game-status">进行中</div>
        <div class="nba24-match-game-content">
          <div class="nba24-match-game-content-left">
            <div class="nba24-match-game-content-team">
              <img :src="match.homeTeamIcon" alt="" class="nba24-match-game-content-team-img" />
              <div class="nba24-match-game-content-team-name">{{ match.homeTeam }}</div>
              <div
                v-if="match.teamChosen != null && match.teamChosen == match.homeTeam"
                class="nba24-match-game-content-btn"
              >
                已投票
              </div>
              <div
                v-else-if="match.teamChosen == null"
                class="nba24-match-game-content-btn"
                @click="handleVoteClick({ matchId: match.id, team: match.homeTeam })"
              >
                投票
              </div>
              <div v-else class="nba2-match-game-content-btn__pseudo" />
            </div>
          </div>
          <div class="nba24-match-game-content-center">
            <div class="nba24-match-game-content-center-time">{{ match.matchTime }}</div>
            <div class="nba24-match-game-content-center-schedule">季后总决赛</div>
            <div v-if="match.teamChosen != null && match.teamChosen == 'DRAW'" class="nba24-match-game-content-btn">
              已投平局
            </div>
            <div
              v-else-if="match.teamChosen == null"
              class="nba24-match-game-content-btn"
              @click="handleVoteClick({ matchId: match.id, team: 'DRAW' })"
            >
              平局
            </div>
            <div v-else class="nba2-match-game-content-btn__pseudo" />
          </div>
          <div class="nba24-match-game-content-right">
            <div class="nba24-match-game-content-team">
              <img :src="match.awayTeamIcon" alt="" class="nba24-match-game-content-team-img" />
              <div class="nba24-match-game-content-team-name">{{ match.awayTeam }}</div>
              <div
                v-if="match.teamChosen != null && match.teamChosen == match.awayTeam"
                class="nba24-match-game-content-btn"
              >
                已投票
              </div>
              <div
                v-else-if="match.teamChosen == null"
                class="nba24-match-game-content-btn"
                @click="handleVoteClick({ matchId: match.id, team: match.awayTeam })"
              >
                投票
              </div>
              <div v-else class="nba2-match-game-content-btn__pseudo" />
            </div>
          </div>
        </div>
      </div>
      <div class="nba24-match-game-bottom">
        <div class="nba24-match-game-bottom-left-title">
          例：用户当日早盘投注 NBA 季后赛总决赛 30,000 元，且用户参与活动选择队伍胜利，用户则获得 188 元
        </div>
        <div class="nba24-match-game-bottom-left-btn" @click="tableRecordDialog = true">[投票记录]</div>
      </div>
      <div class="nba24-match-game-info">
        <div class="title"></div>
        <div class="little-title">
          <div class="right">
            活动期间，用户投注 NBA 季后赛总决赛当日早盘有效投注≥1,000 元后参与本活动竞猜，根据竞猜结果派发对应彩金。
            每日最高可获 2,888 元。
          </div>
        </div>
        <table class="nba24-match-game-info-table">
          <tr>
            <th>有效投注</th>
            <th>竞猜正确</th>
            <th>竞猜失败</th>
            <th>流水倍数</th>
          </tr>
          <tr>
            <td>≥1,000</td>
            <td>8</td>
            <td>-</td>
            <td rowspan="10">5倍/不限场馆</td>
          </tr>
          <tr>
            <td>≥1,500</td>
            <td>18</td>
            <td>-</td>
          </tr>
          <tr>
            <td>≥3,000</td>
            <td>28</td>
            <td>8</td>
          </tr>
          <tr>
            <td>≥5,000</td>
            <td>38</td>
            <td>18</td>
          </tr>
          <tr>
            <td>≥10,000</td>
            <td>88</td>
            <td>58</td>
          </tr>
          <tr>
            <td>≥30,000</td>
            <td>188</td>
            <td>88</td>
          </tr>
          <tr>
            <td>≥80,000</td>
            <td>388</td>
            <td>188</td>
          </tr>
          <tr>
            <td>≥150,000</td>
            <td>588</td>
            <td>288</td>
          </tr>
          <tr>
            <td>≥500,000</td>
            <td>1,088</td>
            <td>888</td>
          </tr>
          <tr>
            <td>≥1,000,000</td>
            <td>2,888</td>
            <td>1,888</td>
          </tr>
        </table>
      </div>
      <div class="nba24-match-game-bottom-rule">
        <div class="title"></div>
        <div class="content">
          <div class="item">
            1.活动期间，用户投注 NBA 季后赛总决赛当日早盘有效投注≥1,000 元后参与本活动竞猜，根据竞猜结果派发对应彩金；
          </div>
          <div class="item">2.活动期间，每日符合条件的会员彩金于次日 24 小时内派发，彩金 5 倍流水即可提款；</div>
          <div class="item">
            3.本活动有效投注额仅对已结算并产生输赢结果的投注额进行计算，任何滚球、走水、串关、提前结算的投注、取消的赛事将不
            计算在有效投注，任何低于欧洲盘 1.70 或亚洲盘 0.70
            水位的投注以及在同一赛事中同时投注对等盘口，将不计算在投注额内；
          </div>
          <div class="item">
            4.若指定赛事发生因故改期、未开盘或其他不可控原因导致活动不能如期进行，本站保有将根据具体情况取消优惠活动或采取其
            他适当的措施；
          </div>
          <div class="item">
            5.根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不
            通知的情况下冻结或关闭相关账户；
          </div>
          <div class="item">
            6.此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
            地址视为同一 账户，若有违规者，将不享受此红利；
          </div>
          <div class="item">7.为避免文字理解差异，本站保留此活动最终解释权；</div>
        </div>
      </div>

      <!-- <el-dialog
        v-model="tableRecordDialog"
        width="800px"
        align-center
        :close-on-click-modal="false"
        class="nba24-match-table-record-dialog"
      >
        <template #header>
          <div class="title"></div>
        </template>
        <div class="record-dialog-container">
          <table class="record-table">
            <thead>
              <tr>
                <th>投票时间</th>
                <th>参赛队伍</th>
                <th>投票队伍</th>
                <th>投票结果</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-05-11 16:00</td>
                <td>老鷹 vs 火箭</td>
                <td>平局</td>
                <td style="color: #51acff">正确</td>
              </tr>
              <tr>
                <td>2024-05-11 16:00</td>
                <td>老鷹 vs 火箭</td>
                <td>老鹰胜</td>
                <td style="color: #ff5151">错误</td>
              </tr>
              <tr>
                <td>2024-05-11 16:00</td>
                <td>老鷹 vs 火箭</td>
                <td>平局</td>
                <td style="color: #7a8eb9">未出结果</td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-dialog> -->
      <q-dialog v-model="tableRecordDialog" full-width position="bottom" class="nba24-match-table-record-dialog">
        <div class="record-dialog-container">
          <div class="record-header-container">
            <div class="title"></div>
            <div class="record-close-btn" v-close-popup>
              <img src="../../../assets/promo/dy-nba24-match/close-btn.png" />
            </div>
          </div>
          <table class="record-table">
            <thead>
              <tr>
                <th>投票时间</th>
                <th>参赛队伍</th>
                <th>投票队伍</th>
                <th>投票结果</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record, index) in recordList" :key="index">
                <td>{{ moment(record.createTime).format("MM-DD HH:mm") }}</td>
                <td>{{ `${record.homeTeam}VS${record.awayTeam}` }}</td>
                <td>{{ displayTeamVictory(record) }}</td>
                <td :style="{ color: displayGuessResult(record).color }">{{ displayGuessResult(record).text }}</td>
              </tr>
              <!-- <tr>
              <td>2024-05-11 16:00</td>
              <td>老鷹 vs 火箭</td>
              <td>平局</td>
              <td style="color: #51acff">正确</td>
            </tr>
            <tr>
              <td>2024-05-11 16:00</td>
              <td>老鷹 vs 火箭</td>
              <td>老鹰胜</td>
              <td style="color: #ff5151">错误</td>
            </tr>
            <tr>
              <td>2024-05-11 16:00</td>
              <td>老鷹 vs 火箭</td>
              <td>平局</td>
              <td style="color: #7a8eb9">未出结果</td>
            </tr> -->
            </tbody>
          </table>
        </div>
      </q-dialog>
      <q-dialog v-model="confirmVoteDialog" persistent>
        <q-card class="confirm-vote-card">
          <q-card-section class="q-mb-md row justify-center">
            <div class="text-h6" v-if="submitParam.team === 'DRAW'">您确定要投"平局"吗？</div>
            <div class="text-h6" v-else>您确定要把票投给 {{ submitParam.team }} 吗？</div>
          </q-card-section>

          <q-card-actions align="center">
            <div class="flex flex-center">
              <q-btn class="q-mr-md" label="取消" color="warning" v-close-popup />
              <q-btn color="blue" label="确定" @click="handleSubmitVote" />
            </div>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import moment from "moment";
import { getNbaMatch, getNbaRecord, submitNbaMatch } from "../../../api/promotion/nba24";
import { useQuasar } from "quasar";
import { useLocalStorage } from "@vueuse/core";

const $q = useQuasar();

const tableRecordDialog = ref(false);
const confirmVoteDialog = ref(false);

const matchList = ref([]);

const recordList = ref([]);

let submitParam = reactive({ matchId: 0, team: "" });

const handleVoteClick = (selectedData) => {
  submitParam = selectedData;
  confirmVoteDialog.value = true;
};

const handleSubmitVote = () => {
  console.log(submitParam);
  submitNbaMatch(submitParam)
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "投票成功！",
          icon: "check_circle_outline"
        });
        getNbaMatchData();
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: res.message,
          icon: "report_problem"
        });
      }
    })
    .finally(() => {
      confirmVoteDialog.value = false;
    });
};

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
const displayTeamVictory = (record) => {
  if (record.teamChosen === "DRAW") return "平局";
  return record.teamChosen + "胜";
};
const displayGuessResult = (record) => {
  if (record.status !== "SETTLED" && record.status !== "PENDING_SETTLE") {
    return { text: "结果未出", color: "#7a8eb9" };
  } else if (record.teamChosen === "DRAW") {
    if (record.homeTeamResult === record.awayTeamResult) {
      return { text: "正确", color: "#51acff" };
    } else {
      return { text: "错误", color: "#ff5151" };
    }
  } else if (record.homeTeam === record.teamChosen) {
    if (record.homeTeamResult > record.awayTeamResult) {
      return { text: "正确", color: "#51acff" };
    } else {
      return { text: "错误", color: "#ff5151" };
    }
  } else if (record.awayTeam === record.teamChosen) {
    if (record.homeTeamResult < record.awayTeamResult) {
      return { text: "正确", color: "#51acff" };
    } else {
      return { text: "错误", color: "#ff5151" };
    }
  } else {
    return { text: "", color: "#51acff" };
  }
};

const getNbaMatchData = async () => {
  const res = await getNbaMatch();
  matchList.value = res.data.map((res) => ({
    ...res,
    matchTime: moment(res.matchTime).locale("zh-cn").format("MMMDo HH:mm"),
    awayTeamIcon: imgURL + res.awayTeamIcon,
    homeTeamIcon: imgURL + res.homeTeamIcon
  }));
};

onMounted(() => {
  if (!store.token) {
    return;
  }
  getNbaMatchData();
});

watch(tableRecordDialog, async () => {
  if (tableRecordDialog.value) {
    const res = await getNbaRecord();
    recordList.value = res.data.map((res) => ({
      ...res,
      updateTime: moment(res.updateTime).format("M 月 DD 日 HH:mm")
    }));
  }
});
</script>

<style scoped lang="scss">
.nba24-match-box {
  font-family: PingFang TC;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nba24-match-container {
  width: 100%;
  height: 100%;
}

.nba24-match-game {
  width: 100%;
  height: 144px;
  border-radius: 12px;
  border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
  .nba24-match-game-status {
    width: 120px;
    height: 24px;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}

.nba24-match-game-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 16px;

  .nba24-match-game-content-left,
  .nba24-match-game-content-right {
    flex: 1;
    .nba24-match-game-content-team-img {
      width: 44px !important;
      height: 44px;
    }
    .nba24-match-game-content-team {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .nba24-match-game-content-team-name {
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1rem;
        margin-top: 4px;
        margin-bottom: 12px;
      }
    }
  }
  .nba24-match-game-content-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;

    .nba24-match-game-content-center-time {
      font-size: 12px;
      font-weight: 600;
      line-height: 1.1rem;
      color: #479af7;
      border-radius: 30px;
      padding: 4px 10px;
      background: #edf4ff;
      margin-bottom: 15px;
    }
    .nba24-match-game-content-center-schedule {
      font-size: 12px;
      font-weight: 600;
      line-height: 1rem;
      color: #1b1b1b99;
      margin-bottom: 12px;
    }
  }
}

.nba24-match-game-content-btn {
  font-size: 12px;
  font-weight: 500;
  line-height: 16.8px;
  color: #00000066;
  background-image: url("../../../assets/promo/dy-nba24-match/btn.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 72px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.nba2-match-game-content-btn__pseudo {
  height: 24px;
}

.nba24-match-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .nba24-match-game-bottom-left-title {
    font-size: 12px;
    font-weight: 500;
    line-height: 16.8px;
    color: #000000;
    width: calc(100% - 61px);
  }
  .nba24-match-game-bottom-left-btn {
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    color: #479af7;
    cursor: pointer;
    width: 61px;
    margin-left: 24px;
  }
}

.nba24-match-game-info {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 16px 8px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    background-image: url("../../../assets/promo/dy-nba24-match/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 335px;
    height: 20px;
    margin-bottom: 16px;
  }
  .little-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .right {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: #000000;
    }
  }
}

.nba24-match-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate !important;
  border-spacing: 0;
  text-align: center;
  vertical-align: middle;
  th {
    height: 32px;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    &:first-child {
      border-top-left-radius: 12px;
    }
    &:last-child {
      border-top-right-radius: 12px;
    }
  }
  tr {
    &:last-child {
      td {
        &:first-child {
          border-bottom-left-radius: 12px;
        }
      }
    }
    &:nth-child(2) {
      td {
        &:last-child {
          border-bottom-right-radius: 12px;
        }
      }
    }
  }
  td {
    border: 1px solid #acd4f6;
    height: 32px;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: #000000;
  }
}

.nba24-match-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 16px 0px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    background-image: url("../../../assets/promo/dy-nba24-match/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 335px;
    height: 20px;
    margin-bottom: 16px;
  }
  .content {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: #000000;
    .item {
      text-indent: -11px;
      padding-left: 24px;
      padding-right: 8px;
    }
  }
}

.nba24-match-table-record-dialog {
  width: 1000px;
  height: 652px;

  .record-dialog-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;

    width: 100%;
    height: 100%;
  }

  .title {
    background-image: url("../../../assets/promo/dy-nba24-match/record-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 265px;
    height: 20px;
    margin-top: 20px;
  }

  .record-table {
    width: 96%;
    height: 100%;
    margin-top: 12px;
    margin-bottom: 20px;
    border-collapse: collapse !important;
    th {
      height: 32px;
      font-size: 12px;
      font-weight: 600;
      line-height: 18px;
      color: #fff;
      background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      vertical-align: middle;
      text-align: left;

      &:first-child {
        border-top-left-radius: 6px;
      }
      &:last-child {
        border-top-right-radius: 6px;
      }
    }
    tr {
      height: 32px;
      font-size: 12px;
      font-weight: 600;
      line-height: 18px;
      color: #7a8eb9;
      vertical-align: middle;
      text-align: left;
      &:nth-child(odd) {
        background: #f2f8fe;
      }
      &:nth-child(even) {
        background: #fff;
      }
      th {
        &:first-child {
          padding-left: 20px;
        }
        &:last-child {
          text-align: right;
          padding-right: 14px;
        }
      }

      td {
        &:first-child {
          padding-left: 20px;
        }
        &:last-child {
          text-align: right;
          padding-right: 14px;
        }
      }

      &:last-child {
        td {
          &:first-child {
            border-bottom-left-radius: 6px;
          }
        }
      }
      &:last-child {
        td {
          &:last-child {
            border-bottom-right-radius: 6px;
          }
        }
      }
    }
  }
}

.record-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-close-btn {
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 12px;
}

// confirm vote dialog
.confirm-vote-card {
  padding: 20px;
  width: 100%;
  max-width: 400px;

  :deep(.q-form) {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .h6-div {
    background: linear-gradient(0deg, #4fb2ff 0, #6daddf 100%), linear-gradient(#d0d1d3, #d0d1d3);
    width: calc(100%);
    text-align: center;
    line-height: 30px;
    font-size: 16px;
  }
}
</style>
