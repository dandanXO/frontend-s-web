<template>
  <div class="olympic24-match-box">
    <div class="olympic24-match-container">
      <div class="olympic24-match-game-info">
        <div class="title"></div>
        <div class="little-title">
          <div class="left">活动时间</div>
          <div class="right">2024年7月24日—2024年8月10日</div>
        </div>
        <div class="little-title">
          <div class="left">活动内容</div>
          <div class="right">
            活动期间，每日【巴黎奥运会男/女足】赛事竞猜正确次数≥1场可获每日【巴黎奥运会男/女足】总有效投注的对应投注返比奖金
          </div>
        </div>
        <table class="olympic24-match-game-info-table">
          <tr>
            <th>竞猜正确场次</th>
            <th>投注返比</th>
            <th>彩金上限</th>
          </tr>
          <tr>
            <td>≥1</td>
            <td>0.8%</td>
            <td>88</td>
          </tr>
          <tr>
            <td>≥2</td>
            <td>1.0%</td>
            <td>188</td>
          </tr>
        </table>

        <div class="olympic24-match-game-bottom">
          <div class="olympic24-match-game-bottom-left-title">
            <div class="olympic24-match-game-bottom-left-btn">| 注意事项</div>
            用户A当日投注【巴黎奥运会男/女足】总有效投注30,000元且免费竞猜正确次数2次，用户可获得30,000*1.0%=300元，用户A彩金金额超出彩金上限，用户A最终可获得188元。
          </div>
        </div>
      </div>

      <div class="olympic24-match-section">
        <div class="olympic24-match-section-title">
          <div><img src="../../../assets/promo/lh-olympic-match/section-title-img.png" /></div>
          冠军竞猜
        </div>
        <div class="olympic24-match-game" v-for="(data, index) in upcomingData" :key="index">
          <div class="olympic24-match-game-status olympic24-match-game-status-ended" v-if="data.status === 'ENDED'">
            已结束
          </div>
          <div v-else class="olympic24-match-game-status">
            {{ convertDateTime(data.matchTime) }}
          </div>
          <div class="olympic24-match-game-content">
            <div class="olympic24-match-game-content-left">
              <div
                class="olympic24-match-game-content-team"
                :class="`${
                  data.status === 'ENDED' && data.answerOne === data.homeTeam
                    ? 'olympic24-match-game-content-team--voted'
                    : ''
                }`"
              >
                <img :src="imgURL + data.homeTeamIcon" alt="" class="olympic24-match-game-content-team-img" />
                <div class="olympic24-match-game-content-team-name">{{ data.homeTeam }}</div>
                <div
                  class="olympic24-match-game-content-center-btn"
                  v-if="data.status === 'ENDED' && data.answerOne === data.homeTeam"
                >
                  获胜
                </div>
                <div
                  v-else-if="
                    ((data.votedTeam && data.votedTeam === data.homeTeam) || !data.votedTeam) && data.status !== 'ENDED'
                  "
                  class="team-vote"
                >
                  <button
                    class="olympic24-match-game-content-btn"
                    @click="handleVoteClick({ quizId: data.id, quizTitle: data.quizTitle, answerOne: data.homeTeam })"
                    :disabled="data.votedTeam && data.votedTeam === data.homeTeam"
                  >
                    {{ data.votedTeam && data.votedTeam === data.homeTeam ? "已投票" : data.votedTeam ? "" : "投票" }}
                  </button>
                </div>
                <div v-else class="nba2-match-game-content-btn__pseudo" />
              </div>
            </div>
            <div class="olympic24-match-game-content-center">
              <div class="olympic24-match-game-content-center-venue">巴黎体育馆</div>
              <div class="olympic24-match-game-content-center-title">{{ data.quizTitle }}</div>
              <div
                class="olympic24-match-game-content-center-btn"
                v-if="data.status === 'ENDED' && data.answerOne === 'DRAW'"
              >
                平局
              </div>
              <div
                v-else-if="
                  data.status !== 'ENDED' && ((data.votedTeam && data.votedTeam === 'draw') || !data.votedTeam)
                "
                class="team-vote"
              >
                <button
                  class="olympic24-match-game-content-btn"
                  @click="handleVoteClick({ quizId: data.id, quizTitle: data.quizTitle, answerOne: 'draw' })"
                  :disabled="data.votedTeam && data.votedTeam === 'draw'"
                >
                  {{ data.votedTeam && data.votedTeam === "draw" ? "已投平局" : data.votedTeam ? "" : "平局" }}
                </button>
              </div>

              <div v-else class="nba2-match-game-content-btn__pseudo" />
            </div>
            <div class="olympic24-match-game-content-right">
              <div
                class="olympic24-match-game-content-team"
                :class="`${
                  data.status === 'ENDED' && data.answerOne === data.awayTeam
                    ? 'olympic24-match-game-content-team--voted'
                    : ''
                }`"
              >
                <img :src="imgURL + data.awayTeamIcon" alt="" class="olympic24-match-game-content-team-img" />
                <div class="olympic24-match-game-content-team-name">{{ data.awayTeam }}</div>
                <div
                  class="olympic24-match-game-content-center-btn"
                  v-if="data.status === 'ENDED' && data.answerOne === data.awayTeam"
                >
                  获胜
                </div>
                <div
                  v-else-if="
                    ((data.votedTeam && data.votedTeam === data.awayTeam) || !data.votedTeam) && data.status !== 'ENDED'
                  "
                  class="team-vote"
                >
                  <button
                    class="olympic24-match-game-content-btn"
                    @click="handleVoteClick({ quizId: data.id, quizTitle: data.quizTitle, answerOne: data.awayTeam })"
                    :disabled="data.votedTeam && data.votedTeam === data.awayTeam"
                  >
                    {{ data.votedTeam && data.votedTeam === data.awayTeam ? "已投票" : data.votedTeam ? "" : "投票" }}
                  </button>
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
          <div class="olympic24-match-game-bottom-left-btn" @click="showTableRecordDialog">[投票记录]</div>
        </div>
      </div>
      <div class="olympic24-match-game-bottom-rule">
        <div class="title"></div>
        <div class="content">
          <div class="item">
            <div class="item-num">1</div>
            活动期间，每日【巴黎奥运会男/女足】竞猜正确次数≥1场可获每日【巴黎奥运会男/女足】总有效投注的对应投注反比奖金，彩金于次日24小时内派发，彩金仅需3倍流水即可提款；
          </div>
          <div class="item">
            <div class="item-num">2</div>
            活动期间，请在指定比赛开赛前竞猜，若超出开赛时间则视为放弃竞猜；
          </div>
          <div class="item">
            <div class="item-num">3</div>
            活动期间会员竞猜正确场次≥1次且会员当日未进行【巴黎奥运会男/女足】投注，次日清零重新计算，若会员彩金金额超出彩金上限金额则按彩金上限派发奖金；
          </div>
          <div class="item">
            <div class="item-num">4</div>
            本活动仅计算FB体育、IM体育、熊猫体育场【巴黎奥运会男/女足】总有效投注。沙巴体育与AP体育不在统计范围内；
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

      <!-- <el-dialog
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
      <q-dialog v-model="tableRecordDialog" full-width position="bottom" class="olympic24-match-table-record-dialog">
        <div class="record-dialog-container">
          <div class="record-header-container">
            <div class="title"></div>
            <div class="record-close-btn" v-close-popup>
              <img src="../../../assets/promo/lh-olympic-match/close-btn.png" />
            </div>
          </div>

          <div class="promo-records-count">
            <div>总竞猜次数: {{ recordsCount.attendTimes }}</div>
            <div>总竞猜正确次数: {{ recordsCount.wonTimes }}</div>
            <div>今日正确次数: {{ recordsCount.todayWonTimes }}</div>
          </div>
          <table class="record-table">
            <thead>
              <tr>
                <th>投票时间</th>
                <th>参赛队伍</th>
                <th>投票队伍</th>
                <!--                <th>投票结果</th>-->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record, index) in answeredRecords" :key="index">
                <td>{{ record.createTime }}</td>
                <td>{{ record.quizTitle }}</td>
                <td>{{ record.answerOne === "draw" ? "平局" : record.answerOne }}</td>
                <!--                <td :style="{ color: displayGuessResult(record).color }">{{ displayGuessResult(record).text }}</td>-->
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
            <div class="text-h6" v-if="submitParam.answerOne === 'draw'">您确定要投"平局"吗？</div>
            <div class="text-h6" v-else>您确定要把票投给 {{ submitParam.answerOne }} 吗？</div>
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
import {
  getBBDachaUpcoming,
  getBBDachaAnsweredRecords,
  submitBBDacha,
  getBBDachaRecordsCount
} from "../../../api/index/promo";
// import { getNbaMatch, getNbaRecord, submitNbaMatch } from "../../../api/promotion/nba24";
import { useQuasar } from "quasar";
import { useLocalStorage } from "@vueuse/core";
import { userStore } from "../../../stores/index";
import { useRouter } from "vue-router";
const router = useRouter();

const store = userStore();
const $q = useQuasar();

const tableRecordDialog = ref(false);
const confirmVoteDialog = ref(false);

const matchList = ref([]);

const recordList = ref([]);

let submitParam = reactive({ quizId: "", quizTitle: "", answerOne: "" });
const showTableRecordDialog = () => {
  if (!store.token) {
    $q.dialog({
      class: "q-px-md q-pt-md",
      title: "系统提示",
      message: "请登录后再操作",
      ok: {
        push: true,
        color: "dyblue",
        label: "去登录",
        tabindex: 1
      },
      cancel: {
        push: true,
        color: "warning",
        label: "取消",
        tabindex: 0
      },
      persistent: true
    }).onOk(() => {
      router.push("/login");
    });
    return;
  }
  tableRecordDialog.value = true;
};
const handleVoteClick = (selectedData) => {
  if (!store.token) {
    $q.dialog({
      class: "q-px-md q-pt-md",
      title: "系统提示",
      message: "请登录后再操作",
      ok: {
        push: true,
        color: "dyblue",
        label: "去登录",
        tabindex: 1
      },
      cancel: {
        push: true,
        color: "warning",
        label: "取消",
        tabindex: 0
      },
      persistent: true
    }).onOk(() => {
      router.push("/login");
    });
    return;
  }
  submitParam = selectedData;
  confirmVoteDialog.value = true;
};

const convertDateTime = (datetime) => {
  return moment(datetime, "YYYY-MM-DD HH:mm:ss").format("MM/DD hh:mm A");
};

const handleSubmitVote = () => {
  submitBBDacha(submitParam)
    .then((res) => {
      if (res.code === 0) {
        getData();

        $q.notify({
          color: "positive",
          position: "top",
          message: "投票成功！",
          icon: "check_circle_outline"
        });
      }
    })
    .catch(() => {})
    .then(() => {
      confirmVoteDialog.value = false;
    });
};

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
// const displayTeamVictory = (record) => {
//   if (record.teamChosen === "draw") return "平局";
//   return record.teamChosen + "胜";
// };
// const displayGuessResult = (record) => {
//   if (record.status !== "SETTLED" && record.status !== "PENDING_SETTLE") {
//     return { text: "结果未出", color: "#7a8eb9" };
//   } else if (record.teamChosen === "draw") {
//     if (record.homeTeamResult === record.awayTeamResult) {
//       return { text: "正确", color: "#51acff" };
//     } else {
//       return { text: "错误", color: "#ff5151" };
//     }
//   } else if (record.homeTeam === record.teamChosen) {
//     if (record.homeTeamResult > record.awayTeamResult) {
//       return { text: "正确", color: "#51acff" };
//     } else {
//       return { text: "错误", color: "#ff5151" };
//     }
//   } else if (record.awayTeam === record.teamChosen) {
//     if (record.homeTeamResult < record.awayTeamResult) {
//       return { text: "正确", color: "#51acff" };
//     } else {
//       return { text: "错误", color: "#ff5151" };
//     }
//   } else {
//     return { text: "", color: "#51acff" };
//   }
// };

const isLoaded = ref(false);
const upcomingData = ref([]);
const answeredRecords = ref([]);
const recordsCount = ref();
const getData = () => {
  Promise.all([getBBDachaUpcoming(), getBBDachaAnsweredRecords(), getBBDachaRecordsCount()]).then((values) => {
    const [bbDachaUpcoming, bbDachaAnsweredRecords, bbDachaRecordsCount] = values;
    if (bbDachaAnsweredRecords.code === 0) {
      if (
        bbDachaAnsweredRecords.data &&
        bbDachaAnsweredRecords.data.records &&
        bbDachaAnsweredRecords.data.records.length
      ) {
        answeredRecords.value = bbDachaAnsweredRecords.data.records;
      }
    }

    isLoaded.value = true;
    if (bbDachaUpcoming.code === 0) {
      if (bbDachaUpcoming.data && bbDachaUpcoming.data.length) {
        upcomingData.value = bbDachaUpcoming.data;

        let isFirstTime = {};
        for (let i = 0, l = answeredRecords.value.length; i < l; i++) {
          const currRecord = answeredRecords.value[i];

          upcomingData.value.forEach((e) => {
            const { matchTime, id } = e;

            if (!isFirstTime[id]) {
              // const timeCN = moment(matchTime).locale("zh_cn");
              // e.matchTime = timeCN.format("MMMDo HH:mm");

              isFirstTime[id] = true;
            }

            if (currRecord.quizId === id) e.votedTeam = currRecord.answerOne;
          });
        }
      }
    }

    if (bbDachaRecordsCount.code === 0) {
      recordsCount.value = bbDachaRecordsCount.data;
    }
  });
};
onMounted(() => {
  if (!store.token) {
    return;
  }
  getData();
});
</script>

<style scoped lang="scss">
.olympic24-match-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.olympic24-match-container {
  width: 100%;
  height: 100%;
}

.olympic24-match-section {
  background-color: #f2f8fe;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 20px 8px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  margin-top: 20px;

  .olympic24-match-section-title {
    color: #000000;
    font-size: 18px;
    line-height: 1;
    font-weight: 600;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 10px;

    img {
      width: 20px !important;
    }
  }
}

.olympic24-match-game {
  width: 100%;
  // height: 144px;
  padding-top: 20px;
  border-radius: 12px;
  // border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-top: 20px;
  margin-bottom: 20px;
  .olympic24-match-game-status {
    &-ended {
      filter: grayscale(1);
    }
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
  align-items: flex-end;
  padding-bottom: 16px;

  .olympic24-match-game-content-left,
  .olympic24-match-game-content-right {
    flex: 1;
    .olympic24-match-game-content-team-img {
      width: 44px !important;
      height: 44px;
    }
    .olympic24-match-game-content-team {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      &--voted {
        &:before {
          content: "";
          background-image: url("../../../assets/images/promo/hotpromo/bbdacha2024/red-flag-voted.png");
          display: block;
          position: absolute;
          height: 50px;
          width: 50px;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          top: -10px;
          right: 0px;
        }
      }
      .olympic24-match-game-content-team-name {
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1rem;
        margin-top: 4px;
        margin-bottom: 12px;
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
      font-size: 12px;
      font-weight: 600;
      line-height: 1.1rem;
      color: #479af7;
      border-radius: 30px;
      padding: 4px 10px;
      background: #edf4ff;
      margin-bottom: 15px;
    }
    .olympic24-match-game-content-center-schedule {
      font-size: 12px;
      font-weight: 600;
      line-height: 1rem;
      color: #1b1b1b99;
      margin-bottom: 12px;
    }
    .olympic24-match-game-content-center-venue {
      font-size: 14px;
      font-weight: 600;
      line-height: 28px;
      color: #000000;
      margin-bottom: 5px;
    }
    .olympic24-match-game-content-center-title {
      font-size: 14px;
      font-weight: 400;
      line-height: 17px;
      color: #000000;
      margin-bottom: 12px;
      text-align: center;
    }
  }
}
.olympic24-match-game-content-center-btn {
  font-size: 12px;
  font-weight: 600;
  line-height: 16.8px;
  // color: #000000;
  // background-color: #f2f2f2;
  color: #ff0000;
  transition: 0.3 all;
  // background-image: url("../../../assets/promo/lh-olympic-match/btn.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 72px;
  height: 24px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0px;
}
.olympic24-match-game-content-btn {
  font-size: 12px;
  font-weight: 600;
  line-height: 16.8px;
  color: #000000;
  background-color: #f2f2f2;
  transition: 0.3 all;
  // background-image: url("../../../assets/promo/lh-olympic-match/btn.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 72px;
  height: 24px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover,
  &:focus,
  &.active {
    color: #ffffff;
    background-image: url("../../../assets/promo/lh-olympic-match/active-btn.png");
  }
}

.nba2-match-game-content-btn__pseudo {
  height: 24px;
}

.olympic24-match-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  .olympic24-match-game-bottom-left-title {
    font-size: 12px;
    font-weight: 500;
    line-height: 16.8px;
    color: #000000;
    width: calc(100% - 61px);
    margin-right: 24px;
  }
  .olympic24-match-game-bottom-left-btn {
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    color: #479af7;
    cursor: pointer;
    width: 61px;
    // margin-left: 24px;
  }
}

.olympic24-match-game-info {
  width: 100%;
  height: 100%;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 16px 8px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    background-image: url("../../../assets/promo/lh-olympic-match/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 335px;
    height: 26px;
    margin-bottom: 16px;
  }
  .little-title {
    display: flex;
    justify-content: space-between;
    // align-items: center;
    margin-bottom: 20px;
    flex-direction: column;
    width: 100%;
    gap: 5px;
    .left {
      background-image: url("../../../assets/promo/lh-olympic-match/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 80px;
      height: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
      line-height: 1;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: #000000;
    }
  }
}

.olympic24-match-game-info-table {
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
    height: 32px;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: #000000;
  }
}

.olympic24-match-game-bottom-rule {
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
    background-image: url("../../../assets/promo/lh-olympic-match/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 335px;
    height: 26px;
    margin-bottom: 16px;
  }
  .content {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: #000000;
    .item {
      padding-left: 16px;
      display: flex;
      gap: 6px;
      padding-right: 12px;

      .item-num {
        color: #ffffff;
        font-size: 12px;
        line-height: 1;
        border-radius: 50%;
        height: 16px !important;
        width: 16px !important;
        min-width: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2px;
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      }
    }
  }
}

.promo-records-count {
  background: #afafaf;
  padding: 8px 16px;
  margin-bottom: 0px;
  display: flex;
  justify-content: space-between;
}

.olympic24-match-table-record-dialog {
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
    background-image: url("../../../assets/promo/lh-olympic-match/record-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 300px;
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
