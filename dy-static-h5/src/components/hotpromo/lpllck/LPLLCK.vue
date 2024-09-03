<template>
  <div class="match-box">
    <div class="match-container">
      <div class="match-game">
        <div class="match-content-warp">
          <div class="daily-prize-title">
            <img style="width: 25px" :src="require(`../../../assets/promo/lpl-lck/gift-icon.png`)" />
            <span>每日彩金</span>
          </div>
          <div class="match-game-content">
            <div class="match-game-status">
              <img style="width: 25px" :src="require(`../../../assets/promo/lpl-lck/piggy-icon.png`)" />
              昨日赛事有效投注：
            </div>
            <div class="match-game-detail">{{ totalValidBet }} 元</div>
          </div>
          <div class="match-game-content">
            <div class="match-game-status">
              <img style="width: 25px" :src="require(`../../../assets/promo/lpl-lck/money-sack-icon.png`)" />
              可领彩金：
            </div>
            <div class="match-game-detail">{{ bonus }} 元</div>
          </div>
          <img
            @click="claimHongBao"
            class="hongbao-1"
            style="width: 215px; margin: auto"
            :src="require(`../../../assets/promo/lpl-lck/hongbao.png`)"
          />
        </div>
      </div>
      <div class="match-game-info">
        <div class="title"></div>
        <div class="subtitle">
          <span class="subtitle-1">活动时间</span>
          <span class="subtitle-2">2024年8月12日起</span>
        </div>
        <div class="subtitle">
          <span class="subtitle-1">活动内容</span>
          <span class="subtitle-2">
            活动期间，投注LPL与LCK赛事当日累计总有效投注≥1,000元即可符合获取活动彩金条件，最高可获1,288元
          </span>
        </div>
        <table class="match-game-info-table">
          <tr>
            <th>累计有效投注</th>
            <th>彩金</th>
            <th>流水倍数</th>
          </tr>
          <tr>
            <td>≥1,000</td>
            <td>5</td>
            <td rowspan="8">5倍/流水倍数</td>
          </tr>
          <tr>
            <td>≥3,000</td>
            <td>15</td>
          </tr>
          <tr>
            <td>≥8,000</td>
            <td>28</td>
          </tr>
          <tr>
            <td>≥20,000</td>
            <td>58</td>
          </tr>
          <tr>
            <td>≥50,000</td>
            <td>88</td>
          </tr>
          <tr>
            <td>≥100,000</td>
            <td>288</td>
          </tr>
          <tr>
            <td>≥300,000</td>
            <td>588</td>
          </tr>
          <tr>
            <td>≥500,000</td>
            <td>1,288</td>
          </tr>
        </table>
        <div class="content-sub-title">
          <span style="font-weight: bold">⮞ 示例</span>
          <span>用户A当日投注LPL总有效投注共4,000元，LCK总有效投注共4,000,用户次日可在活动页面点击领取到28元；</span>
        </div>
      </div>
      <div class="match-game-bottom-rule">
        <div class="title"></div>
        <div class="content">
          <div class="item">
            <span class="rounded-number">1</span>
            <span>
              活动期间，会员当日LPL夏季赛季后赛与LCK夏季赛季后赛赛事累计有效投注≥1,000元即可符合获得彩金资格，符合条件的会员需在次日前往活动页面点击领取彩金；
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">2</span>
            <span>活动期间，活动仅计算当日LPL夏季赛季后赛与LCK夏季赛季后赛总有效投注，次日清零重新计算；</span>
          </div>
          <div class="item">
            <span class="rounded-number">3</span>
            <span>
              仅统计电竞场馆所产生的有效投注，其他场馆不在统计范围内，彩金需在次日24小时内前往活动页面点击领取按钮进行领取，彩金5倍电竞场馆流水即可提款，超出领取彩金时间则视为放弃；
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">4</span>
            <span>
              本活动有效投注额仅对已结算并产生输赢结果的投注额进行计算，任何滚球、走水、串关、提前结算的投注、取消的赛事将不计算在有效投注;
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">5</span>
            <span>
              任何低于欧洲盘 1.7 或亚洲盘 0.7
              水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">6</span>
            <span>
              根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">7</span>
            <span>
              此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及IP地址视为同一账户，若有违规者，将不享受此红利；
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">8</span>
            <span>为避免文字理解差异，东赢保留此活动最终解释权；</span>
          </div>
        </div>
      </div>

      <q-dialog v-model="tableRecordDialog" persistent class="match-table-record-dialog">
        <q-card class="confirm-vote-card">
          <div class="title">恭喜你抽中</div>
          <div class="close-btn" @click="tableRecordDialog = false"></div>
          <div class="record-dialog-container">
            <div class="record-dialog-content-title">恭喜您获得以下奖金</div>
            <div class="record-dialog-content-detail">
              <span>{{ rewardMoney }}</span>
              元
            </div>
            <div @click="tableRecordDialog = false" class="hongbao-finish-btn">完成</div>
          </div>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getMatchAndPrizeInfo, getPrizeMoney } from "../../../api/promotion/lpllck";
import { userStore } from "../../../stores/index";
import { useQuasar } from "quasar";

const $q = useQuasar();
const store = userStore();
const bonus = ref(0);
const totalValidBet = ref(0);
const tableRecordDialog = ref(false);
const rewardMoney = ref(0);

const getMatchData = async () => {
  const res = await getMatchAndPrizeInfo();
  if (res.code === 0) {
    bonus.value = res.data.bonus;
    totalValidBet.value = res.data.totalValidBet;
  }
};

onMounted(() => {
  if (!store.token) {
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
    return;
  }
  getMatchData();
});
const claimHongBao = async () => {
  if (!store.hasToken()) {
    $q.dialog({
      class: "q-px-md q-pt-md",
      title: "系统提示",
      message: "请登录后再操作",
      ok: {
        push: true,
        color: "primary",
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
  }
  const res = await getPrizeMoney();
  console.log(res);
  if (res.code === 0) {
    tableRecordDialog.value = true;
    rewardMoney.value = res.data;
  }
};
</script>

<style scoped lang="scss">
.match-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "PingFang";
  background-color: #e7f1fd;
  padding: 20px;
}

.match-container {
  width: 100%;
  height: 100%;
}

.content-title {
  font-size: 13px;
  font-weight: 500;
  line-height: 22.4px;
  color: #000000;
}

.match-game {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #def0ff;
  background: url("../../../assets/promo/lpl-lck/bg.png") no-repeat center center;
  background-size: 100% 100%;
  position: relative;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  padding: 30px;

  .match-content-warp {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    gap: 10px;

    .daily-prize-title {
      display: flex;
      align-items: center;
      gap: 5px;
      font-weight: 600;
      font-size: 20px;
    }

    .hongbao-1 {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:hover {
        filter: brightness(0.9);
      }
    }
  }

  .match-game-content {
    position: relative;
    display: grid;
    grid-template-columns: 2fr 1fr;
    border: 1px solid rgba(215, 235, 255, 1);
    border-radius: 12px;
    padding: 10px 15px;
    height: auto;
    gap: 20px;
  }

  .match-game-status {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #000;
    gap: 10px;
    text-align: left;
  }

  .match-game-detail {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #479af7;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    border-top-right-radius: 16px;
  }
}

.match-game-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .match-game-content-left,
  .match-game-content-right {
    flex: 1;

    .match-game-content-team {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .match-game-icon {
        width: 80px;
        height: 80px;
      }

      .match-game-content-team-name {
        font-size: 16px;
        font-weight: 600;
        line-height: 28px;
        margin-top: 12px;
        margin-bottom: 24px;
      }
    }
  }

  .match-game-content-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;

    .match-game-content-center-time {
      font-size: 20px;
      font-weight: 600;
      line-height: 33.6px;
      color: #479af7;
      border-radius: 30px;
      padding: 8px 44px;
      background: #edf4ff;
      margin-bottom: 15px;
    }

    .match-game-content-center-schedule {
      font-size: 16px;
      font-weight: 600;
      line-height: 28px;
      color: #1b1b1b99;
      margin-bottom: 33px;
    }
  }
}

.match-game-info {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #def0ff;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    background-image: url("../../../assets/promo/lpl-lck/info-title-2.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    width: 100%;
    aspect-ratio: 240 / 20;
    margin-bottom: 20px;
  }

  .subtitle {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 10px;

    .subtitle-1 {
      background-image: url("../../../assets/promo/lpl-lck/promo-content-ribbon.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 95px;
      padding: 5px 15px;
      padding-left: 10px;
      color: #fff;
      text-align: center;
      font-size: 13px;
      font-weight: bold;
    }

    .subtitle-2 {
      color: #000;
      font-size: 16px;
    }
  }

  .little-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .left {
      background-image: url("../../../assets/promo/lpl-lck/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 120px;
      height: 46px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 13px;
      font-weight: 600;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }

    .right {
      font-size: 16px;
      font-weight: 400;
      line-height: 28px;
      color: #000000;
    }
  }
}

.match-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
  vertical-align: middle;

  th {
    height: 56px;
    font-size: 16px;
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
          border-bottom-left-radius: 12px;
        }
      }
    }

    &:nth-child(8) {
      td {
        &:last-child {
          border-bottom-right-radius: 12px;
        }
      }
    }
  }

  td {
    border: 1px solid #acd4f6;
    height: 56px;
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;
  }
}

.content-sub-title {
  font-size: 13px;
  font-weight: 500;
  line-height: 22.4px;
  color: red;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.match-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #def0ff;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    background-image: url("../../../assets/promo/lpl-lck/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    width: 100%;
    margin-bottom: 20px;
    aspect-ratio: 240 / 20;
  }

  .content {
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;

    .item {
      display: grid;
      grid-template-columns: 50px 1fr;
      font-family: "PingFang";

      .rounded-number {
        text-align: center;
        border-radius: 100px;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        background: linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
        margin-top: 3px;
      }
    }
  }
}

:deep(.match-table-record-dialog) {
  width: 320px;
  height: 360px;
  background-color: #fff3df;
  font-family: "FZHanZhenGuangBiaoS-GB";

  .img {
    position: absolute;
    top: -110px;
    left: 0;
    right: 0;
    margin: auto;
    width: 100%;
    text-align: center;
  }

  .el-dialog__header {
    background: #fff3df;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-dialog__header .el-dialog__headerbtn {
    background: url(../../../assets/promo/lpl-lck/close-btn.png);
    content-visibility: hidden;
    background-size: contain;
    width: 24px;
    height: 24px;
    top: 20px;
    right: 24px;
  }

  .record-dialog-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 320px;

    .record-dialog-content-title {
      color: #ea5046;
      font-size: 13px;
      font-weight: 400;
      line-height: 16.63px;
      letter-spacing: 0.2em;
      text-align: center;
    }

    .record-dialog-content-detail {
      font-size: 20px;
      font-weight: 400;
      line-height: 28.5px;
      letter-spacing: 0.2em;
      text-align: center;
      color: #ea5046;

      span {
        font-size: 72px;
      }
    }

    .hongbao-finish-btn {
      width: 256px;
      height: 44px;
      top: 634px;
      left: 832px;
      gap: 0px;
      border-radius: 100px 0px 0px 0px;
      background-color: #ea574e;

      color: #fff;
      font-size: 13px;
      font-weight: 400;
      line-height: 19px;
      letter-spacing: 0.2em;
      text-align: center;
      border-radius: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .title {
    margin-left: 24px;
    background-image: url("../../../assets/promo/lpl-lck/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 244px;
    height: 44px;
    margin-top: -5px;
    font-size: 18px;
    color: #fff;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0.2em;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .record-table {
    width: 100%;
    height: 100%;

    th {
      height: 56px;
      font-size: 16px;
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
      font-size: 16px;
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

.match-table-record-dialog {
  position: relative;
  .confirm-vote-card {
    width: 360px;
    height: 320px;
    background-color: #fff3df;
    position: relative;
    border-radius: 20px;
    overflow: unset;
  }
  .close-btn {
    background: url(../../../assets/promo/lh-fish-honbao/close-btn.png);
    content-visibility: hidden;
    background-size: contain;
    width: 24px;
    height: 24px;
    right: 14px;
    position: absolute;
  }

  .record-dialog-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 320px;
    .record-dialog-content-title {
      color: #ea5046;
      font-family: FZHanZhenGuangBiaoS-GB;
      font-size: 18px;
      font-weight: 400;
      line-height: 16.63px;
      letter-spacing: 0.2em;
      text-align: center;
    }
    .record-dialog-content-detail {
      font-family: FZHanZhenGuangBiaoS-GB;
      font-size: 20px;
      font-weight: 400;
      line-height: 28.5px;
      letter-spacing: 0.2em;
      text-align: center;
      color: #ea5046;
      span {
        font-size: 72px;
      }
    }
    .hongbao-finish-btn {
      width: 256px;
      height: 44px;
      top: 634px;
      left: 832px;
      gap: 0px;
      border-radius: 100px 0px 0px 0px;
      background-color: #ea574e;
      font-family: FZHanZhenGuangBiaoS-GB;
      color: #fff;
      font-size: 13px;
      font-weight: 400;
      line-height: 19px;
      letter-spacing: 0.2em;
      text-align: center;
      border-radius: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .title {
    background-image: url("../../../assets/promo/lh-fish-honbao/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 244px;
    height: 44px;
    font-size: 18px;
    color: #fff;
    font-family: FZHanZhenGuangBiaoS-GB;
    font-weight: 400;
    line-height: 32px;
    letter-spacing: 0.2em;
    text-align: center;
    position: absolute;
    top: -1%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 6;
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
    font-size: 13px;
  }
}
</style>
