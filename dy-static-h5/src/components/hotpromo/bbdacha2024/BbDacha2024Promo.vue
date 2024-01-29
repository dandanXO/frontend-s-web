<template>
  <div class="head-title">
    <img src="../../../assets/images/promotion/hotpromo/bbdacha2024/head-title-01.png" />
  </div>

  <div class="competition-container">
    <p v-if="isLoaded && upcomingData.length === 0" class="text-center">目前没有赛事。</p>
    <div
      v-for="(data, dataIndex) in upcomingData"
      :key="`upcoming-${dataIndex}`"
      :class="`competition-item ${data.votedTeam ? 'competition-item--voted' : ''}
      ${
        data.status === 'ENDED' ? 'competition-item--ended' : data.status === 'CANCEL' ? 'competition-item--ended' : ''
      }`"
    >
      <div class="competiton-team team-one">
        <div :class="`team-logo ${data.votedTeam === data.homeTeam ? 'team-logo--voted' : ''}`">
          <img :src="imgURL + `promo/` + data.homeTeamIcon" />
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
          <span>
            {{
              data.status === "ONGOING"
                ? "进行中"
                : data.status === "ENDED"
                ? "已结束"
                : data.status === "CANCEL"
                ? "已取消"
                : ""
            }}
          </span>
        </div>
      </div>

      <div class="competiton-team team-two">
        <div :class="`team-logo ${data.votedTeam === data.awayTeam ? 'team-logo--voted' : ''}`">
          <img :src="imgURL + `promo/` + data.awayTeamIcon" />
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
    <q-tabs v-model="activeKey">
      <q-tab name="tabOne" label="活动一" />
      <q-tab name="tabTwo" label="活动二" />
    </q-tabs>

    <q-tab-panels v-model="activeKey">
      <q-tab-panel name="tabOne">
        <div class="table-container">
          <p class="q-mt-md text-bold" style="text-align: center">
            活动期间，用户竞猜当日竞猜正确次数≥3场，彩金按当日存款总额派发对应存款反比彩金金额
          </p>

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

        <div class="head-title">
          <img src="../../../assets/images/promotion/hotpromo/bbdacha2024/head-title-02.png" />
        </div>

        <div class="rules-container">
          <ol class="rules-content">
            <li>
              活动期间，会员每日可免费参与全部竞猜，当日BB别墅冬季杯竞猜正确场次≥3次可获当日总存款对应反比，彩金与次日24小时内派发，彩金仅需3倍流水即可提款；
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
      </q-tab-panel>
    </q-tab-panels>

    <q-tab-panels v-model="activeKey">
      <q-tab-panel name="tabTwo">
        <div class="table-container">
          <p class="q-mt-md text-bold" style="text-align: center">
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

        <div class="head-title">
          <img src="../../../assets/images/promotion/hotpromo/bbdacha2024/head-title-02.png" />
        </div>

        <div class="rules-container">
          <ol class="rules-content">
            <li>BB别墅冬季杯赛事结束后竞猜正确累计次数≥10次且累计BB别墅冬季杯有效投注≥10,000元即可领取对应奖金；</li>
            <li>活动奖金以最低档位为准，若竞猜正确次数≥15次且投注金额≥10，000元，则彩金按88元派发；</li>
            <li>活动奖金以决赛后次日24小时内派发至会员钱包，彩金仅需3倍流水即可提款；</li>
            <li>
              每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将在任何时候保留可以全部停止、取消优惠或索回已支付全部优惠的权利；
            </li>
            <li>为避免文字理解差异，本站保留该活动的最终解释权；</li>
          </ol>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>

  <q-dialog v-model="tableRecordDialog" full-width>
    <div class="record-dialog-container">
      <div class="record-header-container">
        <div class="record-header">投票记录</div>
        <q-btn icon="close" flat round dense v-close-popup color="white"></q-btn>
      </div>

      <div class="promo-records-count">
        <div>竞猜正确次数: {{ recordsCount.wonTimes }}</div>
        <div>累计竞猜正确次数: {{ recordsCount.attendTimes }}</div>
      </div>

      <table class="promo-table" cellspacing="0" cellpading="0">
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
  </q-dialog>

  <q-dialog v-model="confirmVoteDialog" persistent>
    <q-card class="confirm-vote-card">
      <q-card-section class="q-mb-md row justify-center">
        <div class="text-h6">您确定要把票投给 {{ submitParam.answerOne }} 吗？</div>
      </q-card-section>

      <q-card-actions align="center">
        <div class="flex flex-center">
          <q-btn class="q-mr-md" label="取消" color="warning" v-close-popup />
          <q-btn color="dyblue" label="确定" @click="handleSubmitVote" />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import {
  getBBDachaUpcoming,
  getBBDachaAnsweredRecords,
  submitBBDacha,
  getBBDachaRecordsCount
} from "../../../api/index/promo";
import moment from "moment";

const $q = useQuasar();

// tabs
const activeKey = ref("tabOne");
const imgURL = process.env.IMAGE_CDN + "/";
// dialogs
const tableRecordDialog = ref(false);
const confirmVoteDialog = ref(false);

let submitParam = reactive({ quizId: "", quizTitle: "", answerOne: "" });
const handleVoteClick = (selectedData) => {
  submitParam = selectedData;
  confirmVoteDialog.value = true;
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
              const timeCN = moment(matchTime).locale("zh_cn");
              e.matchTime = timeCN.format("MMM Do HH:mm");

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
  getData();
});
</script>

<style scoped lang="scss">
// table styling
table.promo-table {
  width: 100%;
  th {
    background: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039) !important;
    color: white !important;
    text-align: center;
    padding: 5px;
    font-size: 12px;
    font-weight: 700;
  }
  td {
    padding: 5px;
    text-align: center;
    background-color: #ffffff;
    border: 1px solid #d0d1d3;
    white-space: pre-wrap;
    font-size: 12px;
  }
}

.competition-container {
  margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .competition-item {
    display: flex;
    border: 1px solid #adc7ff;
    background-color: #ffffff;
    border-radius: 12px;
    padding: 16px 12px;
    justify-content: space-between;

    .competiton-team {
      width: 50%;
      flex-shrink: 2;
      display: flex;
      flex-direction: column;
      position: relative;

      .team-logo {
        max-width: 60px;
        margin: 0 auto;
        position: relative;

        &--voted {
          &:before {
            content: "";
            background-image: url("../../../assets/images/promotion/hotpromo/bbdacha2024/red-flag-voted.png");
            display: block;
            position: absolute;
            height: 50px;
            width: 50px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center center;
            top: -10px;
            right: -35px;
          }
        }
      }

      .team-name {
        font-weight: 700;
        font-size: 14px;
        margin-bottom: 12px;
        text-align: center;
        color: #4c4c6c;
      }

      .team-vote {
        margin-top: auto;
        display: flex;
        justify-content: center;
        .vote-btn {
          border-radius: 80px;
          min-width: 80px;
          color: #7a80a1;
          box-shadow: 0px -2px 5px 0px #a2bff4 inset;
          font-size: 13px;
        }

        :deep(.disabled),
        [disable] {
          background: #dddddd;
          color: #ffffff;
          pointer-events: none;
        }
      }
    }

    .competition-details {
      flex-shrink: 1;
      position: relative;
      min-width: 160px;
      .details-date {
        background: #4f94ff1a;
        color: #3981ff;
        font-weight: 700;
        font-size: 14px;
        padding: 8px 8px;
        border-radius: 40px;
        width: 130px;
        text-align: center;
        margin: 0 auto;
      }

      .details-match {
        color: #7a8eb9;
        font-size: 14px;
        text-align: center;
        margin-top: 16px;
        padding-bottom: 24px;
      }

      .details-status {
        color: #ffffff;
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        position: absolute;
        width: 110px;
        text-align: center;
        padding-top: 6px;
        line-height: 1;
        padding-bottom: 6px;
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;
        font-weight: 700;
        bottom: -16px;
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
  margin-bottom: 20px;

  .tips-txt {
    color: #424f72;
  }

  .tips-record {
    color: #3f8cff;
    min-width: 90px;
    margin-left: auto;
    text-align: right;
  }
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

// table record dialog
.record-dialog-container {
  padding: 20px;
  .record-header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .record-header {
      color: #ffffff;
      font-weight: 700;
    }
  }

  .promo-records-count {
    background: #ffffff;
    padding: 8px 16px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
  }
}

// tabs
.tabs-container {
  :deep(.q-tabs) {
    padding: 0;
    box-shadow: none;
  }

  :deep(.q-tabs__content) {
    justify-content: center;
    gap: 20px;
  }

  :deep(.q-tab) {
    background-image: url("../../../assets/images/promotion/hotpromo/bbdacha2024/btn-inactivate.png");
    background-position: center center;
    background-size: 100% 100%;
    max-width: 130px;
    color: #ffffff;
    height: 60px;
    padding: 0;
    margin: 0;
  }

  :deep(.q-tab--active) {
    background-image: url("../../../assets/images/promotion/hotpromo/bbdacha2024/btn-activate.png");
  }
}

.rules-container {
  .rules-content {
    color: #424f72;

    li {
      margin-bottom: 10px !important;
    }
  }
}
</style>
