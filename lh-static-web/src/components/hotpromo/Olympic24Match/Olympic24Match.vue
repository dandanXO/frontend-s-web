<template>
  <div class="olympic24-match-box">
    <div class="olympic24-match-container">
      <div class="olympic24-match-game-info">
        <div class="title"></div>
        <div class="little-title">
          <div class="left">活动时间</div>
          <div class="right">2024年7月26日—2024年8月12日</div>
        </div>
        <div class="little-title">
          <div class="left">活动内容</div>
          <div class="right">
            活动期间，每日【巴黎奥运会男/女足】赛事竞猜正确次数≥3场可获每日【巴黎奥运会男/女足】总有效投注的对应投注反比奖金
          </div>
        </div>
        <table class="olympic24-match-game-info-table">
          <tr>
            <th>竞猜正确场次</th>
            <th>投注反比</th>
            <th>彩金上限</th>
          </tr>
          <tr>
            <td>≥3</td>
            <td>0.8%</td>
            <td>88</td>
          </tr>
          <tr>
            <td>≥5</td>
            <td>1.0%</td>
            <td>188</td>
          </tr>
          <tr>
            <td>≥6</td>
            <td>1.5%</td>
            <td>388</td>
          </tr>
          <tr>
            <td>≥8</td>
            <td>3.0%</td>
            <td>888</td>
          </tr>
        </table>

        <div class="olympic24-match-game-bottom">
          <div class="olympic24-match-game-bottom-left-title">
            <div class="olympic24-match-game-bottom-left-btn">| 注意事项</div>
            用户A当日投注世预赛总有效投注30,000元且免费竞猜正确次数8次，用户可获得30,000*3.0%=900元，用户A彩金金额超出彩金上限，用户A最终可获得888元。
          </div>
        </div>
      </div>
      <div class="olympic24-match-section">
        <div class="olympic24-match-section-title">
          <div><img src="../../../assets/promo/lh-olympic-match/section-title-img.png" /></div>
          冠军竞猜
        </div>
        <div class="olympic24-match-game" v-for="(match, index) in matchList" :key="index">
          <div class="olympic24-match-game-status">{{ match.matchTime }}</div>
          <div class="olympic24-match-game-content">
            <div class="olympic24-match-game-content-left">
              <div class="olympic24-match-game-content-team">
                <img :src="match.homeTeamIcon" alt="" class="olympic24-match-game-icon" />
                <div class="olympic24-match-game-content-team-name">{{ match.homeTeam }}</div>
                <div
                  v-if="match.teamChosen != null && match.teamChosen == match.homeTeam"
                  class="olympic24-match-game-content-btn"
                >
                  已投票
                </div>
                <div
                  v-else-if="match.teamChosen == null"
                  class="olympic24-match-game-content-btn"
                  @click="handleVoteClick({ quizId: match.id, quizTitle: match.quizTitle, answerOne: match.homeTeam })"
                >
                  投票
                </div>
                <div v-else class="nba2-match-game-content-btn__pseudo" />
              </div>
            </div>
            <div class="olympic24-match-game-content-center">
              <div class="olympic24-match-game-content-center-venue">巴黎体育馆</div>
              <div class="olympic24-match-game-content-center-title">{{ match.quizTitle }}</div>
              <div
                v-if="match.teamChosen != null && match.teamChosen == 'DRAW'"
                class="olympic24-match-game-content-btn"
              >
                已投平局
              </div>
              <div
                v-else-if="match.teamChosen == null"
                class="olympic24-match-game-content-btn"
                @click="handleVoteClick({ quizId: match.id, quizTitle: match.quizTitle, answerOne: 'draw' })"
              >
                平局
              </div>
              <div v-else class="nba2-match-game-content-btn__pseudo" />
            </div>
            <div class="olympic24-match-game-content-right">
              <div class="olympic24-match-game-content-team">
                <img :src="match.awayTeamIcon" alt="" class="olympic24-match-game-icon" />
                <div class="olympic24-match-game-content-team-name">{{ match.awayTeam }}</div>
                <div
                  v-if="match.teamChosen != null && match.teamChosen == match.awayTeam"
                  class="olympic24-match-game-content-btn"
                >
                  已投票
                </div>
                <div
                  v-else-if="match.teamChosen == null"
                  class="olympic24-match-game-content-btn"
                  @click="handleVoteClick({ quizId: match.id, quizTitle: match.quizTitle, answerOne: match.awayTeam })"
                >
                  投票
                </div>
                <div v-else class="nba2-match-game-content-btn__pseudo" />
              </div>
            </div>
          </div>
        </div>
        <div class="olympic24-match-game-bottom">
          <div class="olympic24-match-game-bottom-left-title">
            注：请于每场指定开赛时间前选择完成竞猜，超出开赛时间则无法参与竞猜。
          </div>
          <div class="olympic24-match-game-bottom-left-btn" @click="tableRecordDialog = true">[投票记录]</div>
        </div>
      </div>
      <div class="olympic24-match-game-bottom-rule">
        <div class="title"></div>
        <div class="content">
          <div class="item">
            <div class="item-num">1</div>
            活动期间，每日【巴黎奥运会男/女足】竞猜正确次数≥3场可获每日【巴黎奥运会男/女足】总有效投注的对应投注反比奖金，彩金于次日24小时内派发，彩金仅需3倍流水即可提款；
          </div>
          <div class="item">
            <div class="item-num">2</div>
            活动期间，请在指定比赛开赛前竞猜，若超出开赛时间则视为放弃竞猜；
          </div>
          <div class="item">
            <div class="item-num">3</div>
            活动期间会员竞猜正确场次≥3次且会员当日未进行【巴黎奥运会男/女足】投注，次日清零重新计算，若会员彩金金额超出彩金上限金额则按彩金上限派发奖金；
          </div>
          <div class="item">
            <div class="item-num">4</div>
            本活动仅计算FB体育、IM体育、熊猫体育场馆世预赛总有效投注。沙巴体育与AP体育不在统计范围内；
          </div>
          <div class="item">
            <div class="item-num">5</div>
            本活动有效投注额仅对已结算并产生输赢结果的投注额进行计算，任何滚球、走水、串关、提前结算的投注、取消的赛事将不
            计算在有效投注，任何低于欧洲盘 1.70 或亚洲盘 0.70
            水位的投注以及在同一赛事中同时投注对等盘口，将不计算在投注额内；
          </div>
          <div class="item">
            <div class="item-num">6</div>
            每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将在任何时候保留可以全部停止、取消优惠或索回已支付全部优惠的权利；
          </div>
          <div class="item">
            <div class="item-num">7</div>
            为避免文字理解差异，本站保留该活动的最终解释权；
          </div>
        </div>
      </div>

      <el-dialog
        v-model="tableRecordDialog"
        width="800px"
        align-center
        :close-on-click-modal="false"
        class="olympic24-match-table-record-dialog"
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
              <tr v-for="(record, index) in recordList" :key="index">
                <td>{{ moment(record.createTime).format("YYYY-MM-DD HH:mm") }}</td>
                <td>{{ `${record.homeTeam}VS${record.awayTeam}` }}</td>
                <td>{{ displayTeamVictory(record) }}</td>
                <td :style="{ color: displayGuessResult(record).color }">{{ displayGuessResult(record).text }}</td>
              </tr>
              <!-- <tr>
                <td>2024-05-11 16:00</td>
                <td>老鹰 vs 火箭</td>
                <td>老鹰胜</td>
                <td style="color: #ff5151">错误</td>
              </tr>
              <tr>
                <td>2024-05-11 16:00</td>
                <td>老鹰 vs 火箭</td>
                <td>平局</td>
                <td style="color: #7a8eb9">未出结果</td>
              </tr> -->
            </tbody>
          </table>
        </div>
      </el-dialog>
      <el-dialog v-model="confirmVoteDialog" width="500px" align-center persistent title="投票">
        <div class="dialog-header" v-if="submitParam.answerOne === 'draw'">您确定要投"平局"吗？</div>
        <div class="dialog-header" v-else>您确定要把票投给 {{ submitParam.answerOne }} 吗？</div>
        <div class="dialog-footer">
          <el-button color="grey" @click="confirmVoteDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitVote()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import moment from "moment";
// import { getNbaMatch, getNbaRecord, submitNbaMatch } from "@/api/promotion/nba24";
import {
  getBBDachaUpcoming,
  getBBDachaAnsweredRecords,
  submitBBDacha,
  getBBDachaRecordsCount
} from "@/api/index/promo";
import { ElMessage } from "element-plus";
import { useLocalStorage } from "@vueuse/core";

const tableRecordDialog = ref(false);
const confirmVoteDialog = ref(false);

const matchList = ref([]);

const recordList = ref([]);

let submitParam = reactive({ quizId: "", quizTitle: "", answerOne: "" });

const handleVoteClick = (selectedData) => {
  submitParam = selectedData;
  confirmVoteDialog.value = true;
};

const handleSubmitVote = () => {
  console.log(submitParam);
  submitBBDacha(submitParam)
    .then((res) => {
      if (res.code === 0) {
        ElMessage.success({
          type: "success",
          message: "成功投票"
        });
        getNbaMatchData();
      } else {
        ElMessage.error(res.message);
      }
    })
    .catch(() => {
      ElMessage.error(res.message);
    })
    .finally(() => {
      confirmVoteDialog.value = false;
    });
};

const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
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
  const res = await getBBDachaUpcoming();
  matchList.value = res.data.map((res) => ({
    ...res,
    matchTime: moment(res.matchTime).locale("zh-cn").format("YYYY年MMMDo HH:mm"),
    awayTeamIcon: imgURL + res.awayTeamIcon,
    homeTeamIcon: imgURL + res.homeTeamIcon
  }));
};

onMounted(getNbaMatchData);

watch(tableRecordDialog, async () => {
  if (tableRecordDialog.value) {
    const res = await getBBDachaAnsweredRecords();

    recordList.value = res.data.records.map((res) => ({
      ...res,
      updateTime: moment(res.updateTime).format("M 月 DD 日 HH:mm")
    }));
  }
});
</script>

<style scoped lang="scss">
.olympic24-match-box {
  font-family: PingFang TC;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.olympic24-match-container {
  width: 1200px;
  height: 100%;
}

.olympic24-match-section {
  background-color: #f2f8fe;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 30px 40px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  margin-top: 40px;

  .olympic24-match-section-title {
    color: #000000;
    font-size: 24px;
    line-height: 1;
    font-weight: 600;
    display: flex;
    gap: 8px;
    align-items: center;
  }
}

.olympic24-match-game {
  width: 100%;
  height: 302px;
  border-radius: 12px;
  // border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
  .olympic24-match-game-status {
    width: 280px;
    height: 40px;
    // background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);

    background-image: url("../../../assets/promo/lh-olympic-match/date-header.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}

.olympic24-match-game-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: end;
  padding-bottom: 40px;
  margin-top: 40px;

  .olympic24-match-game-content-left,
  .olympic24-match-game-content-right {
    flex: 1;
    .olympic24-match-game-content-team {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .olympic24-match-game-icon {
        width: 80px;
        height: 80px;
      }
      .olympic24-match-game-content-team-name {
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
        margin-top: 12px;
        margin-bottom: 24px;
      }
    }
  }
  .olympic24-match-game-content-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;

    .olympic24-match-game-content-center-time {
      font-size: 24px;
      font-weight: 600;
      line-height: 33.6px;
      color: #479af7;
      border-radius: 30px;
      padding: 8px 44px;
      background: #edf4ff;
      margin-bottom: 15px;
    }
    .olympic24-match-game-content-center-venue {
      font-size: 18px;
      font-weight: 600;
      line-height: 28px;
      color: #000000;
      margin-bottom: 10px;
    }
    .olympic24-match-game-content-center-title {
      font-size: 18px;
      font-weight: 400;
      line-height: 28px;
      color: #000000;
      margin-bottom: 33px;
    }
  }
}

.olympic24-match-game-content-btn {
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
  color: #000000;
  background-color: #f2f2f2;
  // background-image: url("../../../assets/promo/lh-olympic-match/active-btn.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 180px;
  height: 40px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.3 all;

  &:hover,
  &:focus {
    color: #ffffff;
    background-image: url("../../../assets/promo/lh-olympic-match/active-btn.png");
  }
}

.nba2-match-game-content-btn__pseudo {
  height: 58px;
}

.olympic24-match-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .olympic24-match-game-bottom-left-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    color: #00000099;
  }
  .olympic24-match-game-bottom-left-btn {
    font-size: 16px;
    font-weight: 600;
    line-height: 22.4px;
    color: #479af7;
    cursor: pointer;
  }
}

.olympic24-match-game-info {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  // align-items: center;
  gap: 20px;

  .title {
    background-image: url("../../../assets/promo/lh-olympic-match/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    // margin-bottom: 40px;
    margin: 0 auto 40px;
  }
  .little-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    .left {
      background-image: url("../../../assets/promo/lh-olympic-match/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 120px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      color: #000000;
    }
  }
}

.olympic24-match-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
  vertical-align: middle;
  th {
    height: 56px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
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
          // border-bottom-left-radius: 12px;
        }
      }
    }
    &:nth-child(2) {
      td {
        &:last-child {
          // border-bottom-right-radius: 12px;
        }
      }
    }
  }
  td {
    border: 1px solid #acd4f6;
    height: 56px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;
  }
}

.olympic24-match-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    background-image: url("../../../assets/promo/lh-olympic-match/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin-bottom: 20px;
  }
  .content {
    font-size: 20px;
    font-weight: 400;
    line-height: 36px;
    color: #000000;
    .item {
      padding-left: 24px;
      display: flex;
      gap: 10px;

      .item-num {
        color: #ffffff;
        font-size: 20px;
        line-height: 1;
        border-radius: 50%;
        height: 28px !important;
        width: 28px !important;
        min-width: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2px;
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      }
    }
  }
}

:deep(.olympic24-match-table-record-dialog) {
  width: 1000px;
  height: 652px;
  .el-dialog__header {
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-dialog__header .el-dialog__headerbtn {
    background: url(../../../assets/promo/lh-olympic-match/close-btn.png);
    content-visibility: hidden;
    background-size: contain;
    width: 24px;
    height: 24px;
    top: 20px;
    right: 24px;
  }
  .el-dialog__body {
    padding: 20px;
  }

  .record-dialog-container {
    width: 960px;
    height: 100%;
  }

  .title {
    background-image: url("../../../assets/promo/lh-olympic-match/record-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 536px;
    height: 32px;
    margin-top: 20px;
  }

  .record-table {
    width: 100%;
    height: 100%;
    th {
      height: 56px;
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
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
      height: 56px;
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
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

.dialog-header {
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}
</style>
