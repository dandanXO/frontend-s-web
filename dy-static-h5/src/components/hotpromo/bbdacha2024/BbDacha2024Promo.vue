<template>
  <div class="head-title">
    <img src="../../../assets/images/promotion/hotpromo/bbdacha2024/head-title-01.png" />
  </div>

  <div class="competition-container">
    <div class="competition-item">
      <div class="competiton-team team-one">
        <div class="team-logo">
          <img src="../../../assets/images/promotion/hotpromo/bbdacha2024/game-logo-01.png" />
        </div>
        <div class="team-name">EDG电子竞技俱乐部</div>
        <div class="team-vote">
          <q-btn class="vote-btn" @click="handleVoteClick">投票</q-btn>
        </div>
      </div>

      <div class="competition-details">
        <div class="details-date">1月24日 15:30</div>

        <div class="details-match">
          2024BB
          <br />
          别墅冬季杯 常规赛
        </div>

        <div class="details-status"><span>进行中</span></div>
      </div>

      <div class="competiton-team team-two">
        <div class="team-logo">
          <img src="../../../assets/images/promotion/hotpromo/bbdacha2024/game-logo-02.png" />
        </div>
        <div class="team-name">京东电子竞技俱部</div>
        <div class="team-vote">
          <q-btn class="vote-btn" @click="handleVoteClick">投票</q-btn>
        </div>
      </div>
    </div>

    <div class="competition-item competition-item--voted">
      <div class="competiton-team team-one">
        <div class="team-logo team-logo--voted">
          <img src="../../../assets/images/promotion/hotpromo/bbdacha2024/game-logo-01.png" />
        </div>
        <div class="team-name">EDG电子竞技俱</div>
        <div class="team-vote">
          <q-btn class="vote-btn" disable>已投票</q-btn>
        </div>
      </div>

      <div class="competition-details">
        <div class="details-date">1月24日 15:30</div>

        <div class="details-match">
          2024BB
          <br />
          别墅冬季杯 常规赛
        </div>

        <div class="details-status"><span>进行中</span></div>
      </div>

      <div class="competiton-team team-two">
        <div class="team-logo">
          <img src="../../../assets/images/promotion/hotpromo/bbdacha2024/game-logo-02.png" />
        </div>
        <div class="team-name">京东电子竞技部</div>
        <div class="team-vote">
          <q-btn class="vote-btn" style="display: none">投票</q-btn>
        </div>
      </div>
    </div>

    <div class="competition-item competition-item--ended">
      <div class="competiton-team team-one">
        <div class="team-logo">
          <img src="../../../assets/images/promotion/hotpromo/bbdacha2024/game-logo-01.png" />
        </div>
        <div class="team-name">EDG电子竞技俱</div>
        <div class="team-vote">
          <q-btn class="vote-btn">投票</q-btn>
        </div>
      </div>

      <div class="competition-details">
        <div class="details-date">1月24日 15:30</div>

        <div class="details-match">
          2024BB
          <br />
          别墅冬季杯 常规赛
        </div>

        <div class="details-status"><span>已结束</span></div>
      </div>

      <div class="competiton-team team-two">
        <div class="team-logo">
          <img src="../../../assets/images/promotion/hotpromo/bbdacha2024/game-logo-02.png" />
        </div>
        <div class="team-name">京东电子竞技部</div>
        <div class="team-vote">
          <q-btn class="vote-btn">投票</q-btn>
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
          <p class="q-mt-md text-bold">活动期间，每日竞猜正确次数≥2场的会员当日存款可领对应存款反比金额</p>

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
      </q-tab-panel>
    </q-tab-panels>

    <q-tab-panels v-model="activeKey">
      <q-tab-panel name="tabTwo">
        <div class="table-container">
          <p class="q-mt-md text-bold">
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
            <li>活动期间，BB别墅冬季杯竞猜正确次数≥10次且累计BB别墅冬季杯有效投注≥10,000元即可领取对应奖金；</li>
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

      <table class="promo-table" cellspacing="0" cellpading="0">
        <thead>
          <tr>
            <th>比赛时间</th>
            <th>参赛队伍</th>
            <th>投票队伍</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024.1.10 15:30</td>
            <td>EDG | RNG</td>
            <td>RNG</td>
          </tr>
          <tr>
            <td>2024.1.10 15:30</td>
            <td>EDG | RNG</td>
            <td>RNG</td>
          </tr>
          <tr>
            <td>2024.1.10 15:30</td>
            <td>EDG | RNG</td>
            <td>RNG</td>
          </tr>
        </tbody>
      </table>
    </div>
  </q-dialog>

  <q-dialog v-model="confirmVoteDialog" persistent>
    <q-card class="confirm-vote-card">
      <q-card-section class="q-mb-md row justify-center">
        <div class="text-h6">您确定要把票投给 EDG电子竞技俱乐部 吗？</div>
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
import { ref, reactive } from "vue";
import { userStore } from "stores/index";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const store = userStore();
const router = useRouter();

// tabs
const activeKey = ref("tabOne");

// dialogs
const tableRecordDialog = ref(false);
const confirmVoteDialog = ref(false);

const handleVoteClick = () => {
  confirmVoteDialog.value = true;
};

const handleSubmitVote = () => {
  confirmVoteDialog.value = false;

  $q.notify({
    color: "positive",
    position: "top",
    message: "投票成功！",
    icon: "check_circle_outline"
  });
};
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

        :deep(.disabled) {
          background: #dddddd;
          color: #ffffff;
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
