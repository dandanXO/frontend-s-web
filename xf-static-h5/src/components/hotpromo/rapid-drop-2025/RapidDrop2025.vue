<template>
  <div class="match-box">
    <div class="match-container">
      <div class="match-game-info">
        <div class="title"></div>
        <div class="subtitle">
          <span class="subtitle-1">活动时间</span>
          <span class="subtitle-2">2025年7月15日 00:00 - 2025年7月27日 23:59</span>
        </div>
        <div class="subtitle">
          <span class="subtitle-1">活动内容</span>
          <span class="subtitle-2">投注乘数与免费旋转，奖池每日16,000份奖励高达 ¥696,500</span>
        </div>
        <table class="match-game-info-table">
          <thead>
            <tr>
              <th>奖励数量</th>
              <th>奖励</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>50</td>
              <td>x50 投注乘数</td>
            </tr>
            <tr>
              <td>250</td>
              <td>x20 投注乘数</td>
            </tr>
            <tr>
              <td>700</td>
              <td>x10 投注乘数</td>
            </tr>
            <tr>
              <td>≥6,500</td>
              <td>x5 投注乘数</td>
            </tr>
            <tr>
              <td>2000</td>
              <td>10次免费旋转</td>
            </tr>
            <tr>
              <td>6,500</td>
              <td>5次免费旋转</td>
            </tr>
          </tbody>
        </table>
        <img class="info-btm-img" src="../../../assets/promo/rapid-drop-2025/rapid-games.png" />
      </div>
      <div class="match-game-bottom-rule">
        <div class="title"></div>
        <div class="content">
          <div class="item">
            <span></span>
            <span>
              合格游戏：奥林匹斯之胜，星光闪耀，福虎生财1000，777疾速，福虎生财，福气鼠，金牛来福，果冻糖，毛怪赢翻天，旺福狗，灵猴招福，胜利表情，招财蛙，凤凰迎福，财猪农场，阿兹特克之宝与大师宝石。
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">1</span>
            <span>
              自2025年7月15日00:00至2025年7月27日23:59(GMT+7)，总共有208,000个奖项，价值¥ 9,054,500
              的天降奖金将送给幸运玩家。
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">2</span>
            <span>
              促销活动期间，天降奖金每天自00:00至23:59(GMT+7)期间进行，每日共有16,000个奖项与总价值¥ 695,500 的奖金。
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">3</span>
            <span>
              玩家可在天降奖金活动赢得投注金额倍数或免费旋转奖励。​​在促销期间，您每日可赢得高达投注额的50倍奖金。
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">4</span>
            <span>
              奖金乘数将用于确定最终中奖金额（投注额 x
              中奖倍数），最高投注限额为¥7。投注越大就有越高的机会在单次旋转中赢得高达¥350的奖金！如果投注超过¥7，则超过限额的任何金额将不计入奖金计算。
              <br />
              举例:
              <br />
              投注金额: ¥8
              <br />
              有效中奖金额：¥7
              <br />
              中奖倍数: X 50
              <br />
              中奖奖金: ¥7 x 50 = ¥350
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">5</span>
            <span>
              免费旋转奖励的投注金额将与玩家中奖时的投注金额相同，最高限额为¥7元。例如，若玩家以¥8元投注获胜，每次免费旋转的奖励金额为¥7元。
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">6</span>
            <span>玩家可以选择立即使用或稍后使用免费旋转奖励。免费旋转自发放日起有效期为5天，逾期将失效。</span>
          </div>
          <div class="item">
            <span class="rounded-number">7</span>
            <span>
              所有免费旋转仅适用于中奖的同一款游戏
              。玩家一旦开始在某款合资格游戏中使用免费旋转，必须在该游戏中使用所有剩余的免费旋转。
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">8</span>
            <span>本次活动不设最低投注额。</span>
          </div>
          <div class="item">
            <span class="rounded-number">9</span>
            <span>每位玩家于每次天降奖金最多可赢得2个奖项。</span>
          </div>
          <div class="item">
            <span class="rounded-number">10</span>
            <span>福润熊猫保留随时修改，取消，停止 活动而不做另行通知的权利。</span>
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
import { getMatchAndPrizeInfo, getPrizeMoney } from "../../../api/promotion/slotsbonus";
import { userStore } from "../../../stores/index";
import { useQuasar } from "quasar";

const $q = useQuasar();
const store = userStore();
const bonus = ref(0);
const totalValidBet = ref(0);
const tableRecordDialog = ref(false);
const rewardMoney = ref(0);
const props = defineProps(["promoCode"]);
const promoCode = ref(props.promoCode);

const getMatchData = async () => {
  const res = await getMatchAndPrizeInfo("profit");
  if (res.code === 0) {
    bonus.value = res.data.expectedBonus;
    totalValidBet.value = res.data.profitAmount;
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
  const res = await getPrizeMoney(promoCode.value);
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
  // border-radius: 12px;
  // border: 1px solid #def0ff;
  background-image: url("../../../assets/promo/slots-bonus/bg.png");
  background-position: center center;
  background-repeat: no-repeat;
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
      font-size: 16px;
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
    border: 1px solid #00bfd733;
    border-radius: 12px;
    padding: 10px 15px;
    height: auto;
    gap: 20px;
  }

  .match-game-status {
    font-size: 12px;
    font-weight: 500;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #ffffff;
    gap: 10px;
    text-align: left;
  }

  .match-game-detail {
    font-size: 12px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #00bfd7;
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
  // margin-top: 40px;
  background: #1f2132;
  border-radius: 12px;
  padding: 20px;
  // border: 1px solid #def0ff;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    background-image: url("../../../assets/promo/slots-bonus/info-title-2.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    width: 100%;
    aspect-ratio: 240 / 20;
    margin-bottom: 20px;
  }

  .subtitle {
    display: flex;
    // flex-direction: column;
    gap: 12px;
    width: 100%;
    margin-bottom: 10px;

    .subtitle-1 {
      background-image: url("../../../assets/promo/slots-bonus/promo-content-ribbon.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 95px;
      padding: 5px 15px;
      padding-left: 10px;
      color: #fff;
      text-align: center;
      font-size: 12px;
      font-weight: 700;
      min-width: 95px;
      max-height: 30px;
      font-family: Inter;
    }

    .subtitle-2 {
      color: #ffffff;
      font-size: 12px;
    }
  }

  .little-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .left {
      background-image: url("../../../assets/promo/slots-bonus/info-little-title-bg.png");
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
    font-size: 12px;
    font-weight: 400;
    line-height: 28px;
    color: #fff;
    // background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    background: linear-gradient(180deg, #00c7c0 0%, #0996c7 100%) !important;

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
    font-size: 12px;
    font-weight: 400;
    line-height: 28px;
    color: #ffffff;
    background: #1f2132 !important;
  }
}

.info-btm-img {
  width: 100%;
  margin-top: 20px;
}

.content-sub-title {
  font-size: 12px;
  font-weight: 500;
  line-height: 22.4px;
  color: #fcc939;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.match-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #1f2132;
  border-radius: 12px;
  padding: 20px;
  // border: 1px solid #def0ff;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    background-image: url("../../../assets/promo/slots-bonus/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    width: 100%;
    margin-bottom: 20px;
    aspect-ratio: 240 / 20;
  }

  .content {
    font-size: 13px;
    font-weight: 400;
    line-height: 28px;
    color: rgba(255, 255, 255, 0.6);

    .item {
      display: grid;
      grid-template-columns: 28px 1fr;
      font-family: "PingFang";

      .rounded-number {
        text-align: center;
        border-radius: 100px;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        background: linear-gradient(180deg, #00c7c0 0%, #0996c7 100%);
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
    background: url(../../../assets/promo/slots-bonus/close-btn.png);
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
    background-image: url("../../../assets/promo/slots-bonus/info-title.png");
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
      font-size: 12px;
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
      font-size: 12px;
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
    background: url(../../../assets/promo/slots-bonus/close-btn.png);
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
    background-image: url("../../../assets/promo/slots-bonus/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 244px;
    height: 44px;
    font-size: 18px;
    color: #fff;
    font-family: FZHanZhenGuangBiaoS-GB;
    font-weight: 400;
    line-height: 44px;
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
