<template>
  <div class="match-box">
    <div class="match-container">
      <div class="match-game">
        <div class="match-content-warp">
          <div class="daily-prize-title">
            <img :src="require(`../../../assets/promo/slots-bonus/gift-icon.png`)" />
            <span>每日彩金</span>
          </div>
          <div class="match-game-content">
            <div class="match-game-status">
              <img :src="require(`../../../assets/promo/slots-bonus/piggy-icon.png`)" />
              当日电子盈利：
            </div>
            <div class="match-game-detail">{{ totalValidBet }} 元</div>
          </div>
          <div class="match-game-content">
            <div class="match-game-status">
              <img :src="require(`../../../assets/promo/slots-bonus/money-sack-icon.png`)" />
              当日可领彩金：
            </div>
            <div class="match-game-detail">{{ bonus }} 元</div>
          </div>
        </div>
        <div class="match-honbao-content">
          <div class="hongbao-1" @click="claimHongBao">
            <img :src="require(`../../../assets/promo/slots-bonus/hongbao.png`)" />
          </div>
        </div>
      </div>
      <div class="match-game-info">
        <div class="title"></div>
        <div class="subtitle">
          <span class="subtitle-1">活动时间</span>
          <span class="subtitle-2">永久</span>
        </div>
        <div class="subtitle">
          <span class="subtitle-1">活动对象</span>
          <span class="subtitle-2">下注电子场馆会员</span>
        </div>
        <table class="match-game-info-table">
          <tr>
            <th>累计有效投注</th>
            <th>彩金</th>
            <th>流水倍数</th>
          </tr>
          <tr>
            <td>≥3,000</td>
            <td>38元</td>
            <td rowspan="8">8倍</td>
          </tr>
          <tr>
            <td>≥8,000</td>
            <td>88元</td>
          </tr>
          <tr>
            <td>≥20,000</td>
            <td>128元</td>
          </tr>
          <tr>
            <td>≥50,000</td>
            <td>158元</td>
          </tr>
          <tr>
            <td>≥200,000</td>
            <td>388元</td>
          </tr>
          <tr>
            <td>≥1,000,000</td>
            <td>888元</td>
          </tr>
        </table>
        <div class="content-sub-title">
          <span style="font-weight: bold">⮞ 示例</span>
          <span>会员A在电子投注,当日有效投注为49000元,次日即可获得128元。</span>
        </div>
      </div>
      <div class="match-game-bottom-rule">
        <div class="title"></div>
        <div class="content">
          <div class="item">
            <span class="rounded-number">1</span>
            <span>
              申请方式:次日在优惠页面点击【领取】按钮进行领取(路径：优惠界面->点击领取)，一键领取秒到账，彩金保留24小时，彩金只需八倍流水即可出款，逾期未领视为主动放弃，不予补发。
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">2</span>
            <span>
              救援礼金仅限投注电子游戏损益，电子桌面类，街机类游戏，街机捕鱼，不参与此活动计算，奖金8倍流水即可提款。
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">3</span>
            <span>
              彩金不可购买免费旋转机会，不可投注旋转类游戏、能量累积类游戏、桌面游戏、街机游戏、体育电竞游戏-滚球类型。
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">4</span>
            <span>
              同一手机号、姓名、邮箱地址、银行卡号、IP地址等身份认证信息视为同一账号，仅限一个账号参与、任何团体或个人以非法方式套取优惠（如投注对冲等），平台保留在不提前通知情况下做出处理。
            </span>
          </div>
          <div class="item">
            <span class="rounded-number">5</span>
            <span>为避免文字理解差异，如有疑问可联系在线客服，平台保留活动最终解释权。</span>
          </div>
        </div>
      </div>

      <el-dialog
        v-model="tableRecordDialog"
        width="800px"
        align-center
        :close-on-click-modal="false"
        class="match-table-record-dialog"
      >
        <template #header>
          <div class="title">恭喜你抽中</div>
        </template>
        <div class="record-dialog-container">
          <div class="record-dialog-content-title">恭喜您获得以下奖金</div>
          <div class="record-dialog-content-detail">
            <span>{{ rewardMoney }}</span>
            元
          </div>
          <div @click="tableRecordDialog = false" class="hongbao-finish-btn">完成</div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getMatchAndPrizeInfo, getPrizeMoney } from "@/api/promotion/slotsbonus";
// import { useNotify } from "@/hooks/notify";
import { userStore } from "../../../store/index.js";
import { ElMessageBox, ElMessage } from "element-plus";

// const notify = useNotify();
const store = userStore();
const bonus = ref(0);
const totalValidBet = ref(0);
const tableRecordDialog = ref(false);
const rewardMoney = ref(0);

const getMatchData = async () => {
  const res = await getMatchAndPrizeInfo();
  if (res.code === 0) {
    bonus.value = res.data.profitAmount;
    totalValidBet.value = res.data.betAmount;
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
  if (!store.token) {
    ElMessageBox.alert("请登录后再操作", "系统提示", {
      autofocus: false,
      center: true,
      confirmButtonText: "确认",
      showClose: false,
      buttonSize: "large",
      closeOnClickModal: true
    }).then(() => {
      store.loginPageVisible = true;
    });
    return;
  }
  const res = await getPrizeMoney();
  console.log(res);
  if (res.code === 0) {
    tableRecordDialog.value = true;
    rewardMoney.value = res.data;
  } else {
    // notify.error(res.message);
    ElMessage.warning(res.message);
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
  font-family: "PingFang SC";
}

.match-container {
  width: 1200px;
  height: 100%;
}

.content-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  color: #000000;
}

.match-game {
  width: 100%;
  height: 250px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  background-image: url("../../../assets/promo/slots-bonus/bg.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 30px;

  .match-content-warp {
    display: flex;
    justify-content: space-around;
    flex-direction: column;

    .daily-prize-title {
      display: flex;
      align-items: center;
      gap: 5px;
      font-weight: 600;
      font-size: 24px;
    }
  }

  .match-game-content {
    position: relative;
    display: grid;
    grid-template-columns: 300px 1fr;
    border: 1px solid rgba(215, 235, 255, 1);
    border-radius: 12px;
    padding: 10px 15px;
    height: auto;
    gap: 80px;
  }

  .match-game-status {
    font-size: 20px;
    font-weight: 500;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #ffffff;
    gap: 10px;
    text-align: left;
  }

  .match-game-detail {
    font-size: 20px;
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
        font-size: 20px;
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
      font-size: 24px;
      font-weight: 600;
      line-height: 33.6px;
      color: #479af7;
      border-radius: 30px;
      padding: 8px 44px;
      background: #edf4ff;
      margin-bottom: 15px;
    }

    .match-game-content-center-schedule {
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      color: #1b1b1b99;
      margin-bottom: 33px;
    }
  }
}

.match-honbao-content {
  max-height: 288px;
  display: flex;
  flex-direction: row;
  position: relative;

  .hongbao-1 {
    margin-left: -85px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      filter: brightness(0.9);
    }
  }
}

.match-game-info {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #161824;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    background-image: url("../../../assets/promo/slots-bonus/info-title-2.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 1060px;
    height: 44px;
    margin-bottom: 40px;
  }

  .subtitle {
    display: flex;
    // flex-direction: column;
    width: 100%;
    margin-bottom: 10px;
    gap: 16px;

    .subtitle-1 {
      background-image: url("../../../assets/promo/slots-bonus/promo-content-ribbon.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 95px;
      padding: 5px 15px;
      padding-left: 10px;
      color: #000000;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }

    .subtitle-2 {
      color: #ffffff;
      font-size: 20px;
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

.match-game-info-table {
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
    color: #000000;
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
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #ffffff;
  }
}

.content-sub-title {
  font-size: 16px;
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
  background: #161824;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    background-image: url("../../../assets/promo/slots-bonus/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 1060px;
    height: 44px;
    margin-bottom: 20px;
  }

  .content {
    font-size: 20px;
    font-weight: 400;
    line-height: 36px;
    color: rgba(255, 255, 255, 0.6);

    .item {
      display: grid;
      grid-template-columns: 50px 1fr;
      font-family: "PingFang SC";

      .rounded-number {
        text-align: center;
        border-radius: 100px;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #000000;
        background: linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
        margin-top: 5px;
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
      font-size: 16px;
      font-weight: 400;
      line-height: 16.63px;
      letter-spacing: 0.2em;
      text-align: center;
    }

    .record-dialog-content-detail {
      font-size: 24px;
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
      font-size: 16px;
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
