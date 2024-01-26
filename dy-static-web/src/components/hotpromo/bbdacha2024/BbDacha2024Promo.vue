<template>
  <div class="head-title mb-40">
    <img src="../../../assets/images/promotion/hotpromo/bbdacha2024/head-title-01.png" />
  </div>

  <div class="competition-container">
    <p v-if="isLoaded && upcomingData.length === 0" style="text-align: center">目前没有赛事。</p>

    <div
      v-for="(data, dataIndex) in upcomingData"
      :key="`upcoming-${dataIndex}`"
      :class="`competition-item ${
        data.votedTeam ? 'competition-item--voted' : data.status === 'ENDED' ? 'competition-item--ended' : ''
      }`"
    >
      <div class="competiton-team team-one">
        <div :class="`team-logo ${data.votedTeam === data.homeTeam ? 'team-logo--voted' : ''}`">
          <img :src="imgURL + data.homeTeamIcon" />
        </div>
        <div class="team-name">{{ data.homeTeam }}</div>
        <div v-if="(data.votedTeam && data.votedTeam === data.homeTeam) || !data.votedTeam" class="team-vote">
          <button
            class="vote-btn"
            @click="handleVoteClick({ quizId: data.id, quizTitle: data.quizTitle, answerOne: data.homeTeam })"
            :disable="data.votedTeam && data.votedTeam === data.homeTeam"
          >
            {{ data.votedTeam && data.votedTeam === data.homeTeam ? "已投票" : data.votedTeam ? "" : "投票" }}
          </button>
        </div>
      </div>

      <div class="competition-details">
        <div class="details-date">{{ data.matchTime }}</div>

        <div class="details-match">
          2024BB
          <br />
          别墅冬季杯 常规赛
        </div>

        <div class="details-status">
          <span>{{ data.status === "ONGOING" ? "进行中" : data.status === "ENDED" ? "已结束" : "" }}</span>
        </div>
      </div>

      <div class="competiton-team team-two">
        <div :class="`team-logo ${data.votedTeam === data.awayTeam ? 'team-logo--voted' : ''}`">
          <img :src="imgURL + data.awayTeamIcon" />
        </div>
        <div class="team-name">{{ data.awayTeam }}</div>
        <div v-if="(data.votedTeam && data.votedTeam === data.awayTeam) || !data.votedTeam" class="team-vote">
          <button
            class="vote-btn"
            @click="handleVoteClick({ quizId: data.id, quizTitle: data.quizTitle, answerOne: data.awayTeam })"
            :disable="data.votedTeam && data.votedTeam === data.awayTeam"
          >
            {{ data.votedTeam && data.votedTeam === data.awayTeam ? "已投票" : data.votedTeam ? "" : "投票" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="tips-container">
    <div class="tips-txt">注：请于每场指定开赛时间前选择完成竞猜，超出开赛时间则无法参与竞猜。</div>

    <div class="tips-record" @click="tableRecordDialog = true">【投票记录】</div>
  </div>

  <div class="tabs-container">
    <div class="tab-header">
      <div class="tab-title" :class="activeKey === 'tabOne' && 'active'" @click="handleTabClick('tabOne')">活动一</div>
      <div class="tab-title" :class="activeKey === 'tabTwo' && 'active'" @click="handleTabClick('tabTwo')">活动二</div>
    </div>

    <div class="tab-panel" v-if="activeKey === 'tabOne'">
      <div class="table-container">
        <p class="top-liner">活动期间，每日竞猜正确次数≥2场的会员当日存款可领对应存款反比金额</p>

        <table class="promo-table">
          <thead>
            <tr>
              <th>竞猜正确场次</th>
              <th>存款反比</th>
              <th>彩金上限</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥3</td>
              <td>0.05%</td>
              <td>58</td>
            </tr>
            <tr>
              <td>≥5</td>
              <td>0.08%</td>
              <td>128</td>
            </tr>
            <tr>
              <td>≥6</td>
              <td>0.10%</td>
              <td>388</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="head-title my-40">
        <img src="../../../assets/images/promotion/hotpromo/bbdacha2024/head-title-02.png" />
      </div>

      <div class="rules-container">
        <ol class="rules-content">
          <li>
            活动期间，BB别墅冬季杯竞猜正确场次≥3次可获当日存款对应反比，彩金与次日24小时内派发，彩金仅需3倍流水即可提款；
          </li>
          <li>活动期间，请在指定比赛开赛前竞猜，若超出开赛时间则视为放弃竞猜；</li>
          <li>
            活动期间会员竞猜正确场次≥3次且会员当日未存款，次日清零重新计算，若会员彩金金额超出彩金上限金额则按彩金上限派发奖金；
          </li>
          <li>
            每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将在任何时候保留可以全部停止、取消优惠或索回已支付全部优惠的权利；
          </li>
          <li>为避免文字理解差异，本站保留该活动的最终解释权；</li>
        </ol>
      </div>
    </div>

    <div class="tab-panel" v-if="activeKey === 'tabTwo'">
      <div class="table-container">
        <p class="top-liner">
          活动期间，BB别墅冬季杯赛事结束后累计竞猜正确次数≥10次且投注BB别墅杯累计有效投注≥3000元，即可领取对应彩金。
        </p>

        <table class="promo-table">
          <thead>
            <tr>
              <th>累计竞猜正确次数</th>
              <th>BB别墅杯累计投注金额</th>
              <th>彩金</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥10</td>
              <td>≥10,000</td>
              <td>88</td>
            </tr>
            <tr>
              <td>≥15</td>
              <td>≥50,000</td>
              <td>288</td>
            </tr>
            <tr>
              <td>≥20</td>
              <td>≥100,000</td>
              <td>688</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="head-title my-40">
        <img src="../../../assets/images/promotion/hotpromo/bbdacha2024/head-title-02.png" />
      </div>

      <div class="rules-container">
        <ol class="rules-content">
          <li>活动期间，BB别墅冬季杯竞猜正确次数≥10次且累计BB别墅冬季杯有效投注≥10,000元即可领取对应奖金；</li>
          <li>活动奖金以最低档位为准，若竞猜正确次数≥15次且投注金额≥10，000元，则彩金按88元派发；</li>
          <li>活动奖金以决赛后次日24小时内派发至会员钱包，彩金仅需3倍流水即可提款；</li>
          <li>
            每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将在任何时候保留可以全部停止、取消优惠或索回已支付全部优惠的权利；
          </li>
          <li>为避免文字理解差异，本站保留该活动的最终解释权；</li>
        </ol>
      </div>
    </div>
  </div>

  <el-dialog v-model="tableRecordDialog" width="800px" align-center :close-on-click-modal="false" title="投票记录">
    <div class="record-dialog-container">
      <table class="promo-table record-table">
        <thead>
          <tr>
            <th>投票时间</th>
            <th>参赛队伍</th>
            <th>投票队伍</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(record, index) in answeredRecords" :key="index">
            <tr>
              <td>{{ record.createTime }}</td>
              <td>{{ record.quizTitle }}</td>
              <td>{{ record.answerOne }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </el-dialog>

  <el-dialog v-model="confirmVoteDialog" width="500px" align-center persistent title="投票">
    <div class="dialog-header">您确定要把票投给 {{ submitParam.answerOne }} 吗？</div>
    <div class="dialog-footer">
      <el-button color="grey" @click="confirmVoteDialog = false">取消</el-button>
      <el-button type="primary" @click="handleSubmitVote()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getBBDachaUpcoming, getBBDachaAnsweredRecords, submitBBDacha } from "@/api/index/promo";
import moment from "moment";

// tabs
const activeKey = ref("tabOne");
const handleTabClick = (tab) => {
  activeKey.value = tab;
};

// dialogs
const tableRecordDialog = ref(false);
const confirmVoteDialog = ref(false);
const imgURL = process.env.VUE_APP_IMAGE_CDN + "/promo/";

let submitParam = reactive({ quizId: "", quizTitle: "", answerOne: "" });
const handleVoteClick = (selectedData) => {
  submitParam = selectedData;
  confirmVoteDialog.value = true;
};

const handleSubmitVote = () => {
  submitBBDacha(submitParam)
    .then((res) => {
      if (res.code === 0) getData();
    })
    .catch(() => {})
    .then(() => {
      confirmVoteDialog.value = false;
    });
};

const isLoaded = ref(false);
const upcomingData = ref([]);
const answeredRecords = ref([]);
const getData = () => {
  Promise.all([getBBDachaUpcoming(), getBBDachaAnsweredRecords()]).then((values) => {
    const [bbDachaUpcoming, bbDachaAnsweredRecords] = values;
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
              const timeCN = moment(matchTime).locale("zh_cn");
              e.matchTime = timeCN.format("MMM Do HH:mm");

              isFirstTime[id] = true;
            }

            if (currRecord.quizId === id) e.votedTeam = currRecord.answerOne;
          });
        }
      }
    }
  });
};
onMounted(() => {
  getData();
});
</script>

<style scoped lang="scss">
.head-title {
  display: flex;
  justify-content: center;
  &.mb-40 {
    margin-bottom: 40px;
  }
  &.my-40 {
    margin: 40px 0;
  }
}
// table styling
table.promo-table {
  margin: 20px auto 10px;
  text-align: center;
  color: white;
  width: 100%;
  max-width: 1200px;
  border-collapse: collapse;

  thead {
    background-image: linear-gradient(0deg, #0494fc 0, #15bdfc 100%), linear-gradient(#d0d1d3, #d0d1d3);
    color: white;
    font-weight: bold;
  }

  tr {
    table-layout: fixed;
  }

  td,
  th {
    text-align: center;
    padding: 16px 30px;
    font-size: 18px;
    height: 52px;
    border: 1px solid #dcdce8;
  }

  td {
    color: black;
    font-size: 18px;
  }

  thead th {
    width: 80px;
  }
}

table.promo-table.record-table {
  margin: 0;
  td,
  th {
    padding: 8px 16px;
    height: auto;
  }
}

.competition-container {
  margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .competition-item {
    display: flex;
    border: 1px solid #adc7ff;
    background-color: #ffffff;
    border-radius: 12px;
    padding: 24px 20px;
    justify-content: space-between;

    .competiton-team {
      width: 50%;
      flex-shrink: 2;
      display: flex;
      flex-direction: column;
      position: relative;

      .team-logo {
        width: 100px;
        height: 100px;
        max-width: 100px;
        margin: 0 auto;
        position: relative;

        img {
          display: block;
          width: 100%;
        }

        &--voted {
          &:before {
            content: "";
            background-image: url("../../../assets/images/promotion/hotpromo/bbdacha2024/red-flag-voted.png");
            display: block;
            position: absolute;
            height: 80px;
            width: 80px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center center;
            top: -10px;
            right: -70px;
          }
        }
      }

      .team-name {
        font-weight: 700;
        font-size: 20px;
        margin-top: 20px;
        margin-bottom: 24px;
        text-align: center;
        color: #4c4c6c;
      }

      .team-vote {
        margin-top: auto;
        display: flex;
        justify-content: center;
        .vote-btn {
          border-radius: 80px;
          min-width: 180px;
          color: #7a80a1;
          box-shadow: 0px -2px 8px 0px #bbdcff inset;
          font-size: 22px;
          padding: 16px 20px;
          transition: 0.3s all;
          background: #ffffff;

          &:hover {
            filter: brightness(0.8);
          }
        }

        &.disabled,
        [disable] {
          background: #dddddd;
          color: #ffffff;
          pointer-events: none;

          &:hover {
            filter: brightness(1);
          }
        }
      }
    }

    .competition-details {
      flex-shrink: 1;
      position: relative;
      padding-top: 12px;
      //   min-width: 160px;
      .details-date {
        background: #4f94ff1a;
        color: #3981ff;
        font-weight: 700;
        font-size: 24px;
        padding: 8px 8px;
        border-radius: 40px;
        width: 230px;
        text-align: center;
        margin: 0 auto;
      }

      .details-match {
        color: #7a8eb9;
        font-size: 22px;
        text-align: center;
        margin-top: 24px;
        padding-bottom: 40px;
        font-weight: 500;
      }

      .details-status {
        color: #ffffff;
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        position: absolute;
        width: 240px;
        text-align: center;
        padding-top: 14px;
        line-height: 1;
        padding-bottom: 12px;
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;
        font-weight: 700;
        font-size: 20px;
        bottom: -24px;
        left: 50%;
        transform: translate(-50%, 0);

        span {
          display: block;
        }
      }
    }

    // ended
    &--ended {
      .competition-details .details-status {
        color: #ffffff;
        background: linear-gradient(180deg, #e2e2e2 0%, #d5d5d5 100%);
      }

      .competiton-team .team-vote {
        display: none;
      }
    }

    // voted
    &--voted {
      // .competition-details .details-status {
      //   color: #ffffff;
      //   background: linear-gradient(180deg, #e2e2e2 0%, #d5d5d5 100%);
      // }

      // .competiton-team .team-vote {
      //   display: none;
      // }
    }
  }
}

.tips-container {
  display: flex;
  margin-top: 30px;
  margin-bottom: 50px;
  font-size: 18px;

  .tips-txt {
    color: #424f72;
  }

  .tips-record {
    color: #3f8cff;
    min-width: 90px;
    margin-left: auto;
    text-align: right;
    cursor: pointer;
  }
}

// tabs
.tabs-container {
  .tab-header {
    display: flex;
    gap: 20px;
    justify-content: center;
  }

  .tab-title {
    background-image: url("../../../assets/images/promotion/hotpromo/bbdacha2024/btn-inactivate.png");
    background-position: center center;
    background-size: 100% 100%;
    color: #ffffff;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 270px;
    height: 90px;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;

    &.active {
      background-image: url("../../../assets/images/promotion/hotpromo/bbdacha2024/btn-activate.png");
    }
  }
}

.rules-container {
  .rules-content {
    color: #424f72;

    li {
      margin-bottom: 16px !important;
      font-size: 18px;
    }
  }
}

.top-liner {
  margin-top: 40px;
  margin-bottom: 30px;
  color: #4c4c6c;
  font-size: 18px;
  font-weight: bold;
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
</style>
