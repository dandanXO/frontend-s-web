<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section">
        <div class="livepoker-rebate-section-left">
          <div class="livepoker-rebate-section-title">
            <div><img src="@/assets/promo/lh-livepoker-rebate/section-title-img.png" /></div>
            每日彩金
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img src="@/assets/promo/lh-livepoker-rebate/reward-icon1.png" alt="" width="100%" />
            </div>
            <div class="reward-info-content">
              当日电子负盈利:
              <span class="amount">{{ totalValidBet }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img src="@/assets/promo/lh-livepoker-rebate/reward-icon2.png" alt="" width="100%" />
            </div>
            <div class="reward-info-content">
              可领彩金：
              <span class="amount">{{ bonus }}元</span>
            </div>
          </div>
        </div>
        <div class="livepoker-rebate-section-right">
          <div class="bonus-image" @click="claimHongBao" :class="{ disabled: bonus <= 0 }">
            <img
              v-if="bonus <= 0"
              src="@/assets/promo/lh-livepoker-rebate/reward-btn-disabled.png"
              alt=""
              width="100%"
            />
            <img v-else src="@/assets/promo/lh-livepoker-rebate/reward-btn.png" alt="" width="100%" />
          </div>
        </div>
      </div>
      <div class="livepoker-rebate-game-info">
        <div class="title"></div>
        <div class="little-title">
          <div class="left">活动时间</div>
          <div class="right">永久</div>
        </div>
        <div class="little-title">
          <div class="left">活动对象</div>
          <div class="right">下注电子场馆会员</div>
        </div>
        <table class="livepoker-rebate-game-info-table">
          <tbody>
            <tr>
              <th>当日存款</th>
              <th>当日电子负盈利</th>
              <th>救援金</th>
              <th>流水倍数</th>
            </tr>
            <tr>
              <td rowspan="8">≥100</td>
              <td>≥500</td>
              <td>8元</td>
              <td rowspan="8">8倍</td>
            </tr>
            <tr>
              <td>≥1,500</td>
              <td>18元</td>
            </tr>
            <tr>
              <td>≥5,000</td>
              <td>38元</td>
            </tr>
            <tr>
              <td>≥10,000</td>
              <td>88元</td>
            </tr>
            <tr>
              <td>≥20,000</td>
              <td>108元</td>
            </tr>
            <tr>
              <td>≥50,000</td>
              <td>288元</td>
            </tr>
            <tr>
              <td>≥100,000</td>
              <td>588元</td>
            </tr>
            <tr>
              <td>≥500,000</td>
              <td>888元</td>
            </tr>
          </tbody>
        </table>

        <div class="livepoker-rebate-game-bottom">
          <div class="livepoker-rebate-game-bottom-left-title">
            <div class="livepoker-rebate-game-bottom-left-btn">
              <img src="@/assets/promo/lh-livepoker-rebate/game-bottom-left-btn.png" alt="" style="width: 10px" />
              <span>示例</span>
            </div>
            会员A在电子投注,当日产生负盈利为68,888元,次日即可获得救援金288元。
          </div>
        </div>
      </div>

      <div class="livepoker-rebate-game-bottom-rule">
        <div class="title"></div>
        <div class="content">
          <div class="item">
            <div class="item-num">1</div>
            申请方式：账户余额≤5元，次日在优惠页面点击【领取】按钮进行领取(路径：优惠界面->点击领取)，一键领取秒到账，彩金保留24小时，彩金只需八倍流水即可出款，逾期未领视为主动放弃，不予补发。
          </div>
          <div class="item">
            <div class="item-num">2</div>
            救援礼金仅限投注电子游戏损益，电子桌面类，街机类游戏，街机捕鱼，不参与此活动计算。
          </div>
          <div class="item">
            <div class="item-num">3</div>
            彩金不可购买免费旋转机会，不可投注旋转类游戏、能量累积类游戏、桌面游戏、街机游戏、体育电竞游戏-滚球类型。
          </div>
          <div class="item">
            <div class="item-num">4</div>
            同一手机号、姓名、邮箱地址、银行卡号、IP地址等身份认证信息视为同一账号，仅限一个账号参与、任何团体或个人以非法方式套取优惠（如投注对冲等），平台保留在不提前通知情况下做出处理。
          </div>
          <div class="item">
            <div class="item-num">5</div>
            为避免文字理解差异，如有疑问可联系在线客服，平台保留活动最终解释权。
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
import { getMatchAndPrizeInfo, getPrizeMoney } from "@/api/index/promo";
import { onMounted, ref, defineProps, toRefs } from "vue";
import { userStore } from "@/store";
import { ElMessage, ElMessageBox } from "element-plus";
const props = defineProps(["promoCode"]);
const { promoCode } = toRefs(props);

const store = userStore();
const totalValidBet = ref(0);
const tableRecordDialog = ref(false);
const rewardMoney = ref(0);
const bonus = ref(0);
const isClaiming = ref(false);

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
  const res = await getPrizeMoney(promoCode.value);
  console.log(res);
  if (res.code === 0) {
    tableRecordDialog.value = true;
    rewardMoney.value = res.data;
  } else {
    // notify.error(res.message);
    ElMessage.error(res.message);
  }
};

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
</script>

<style scoped lang="scss">
.livepoker-rebate-wrapper {
  display: flex;
  justify-content: center;
}
.livepoker-rebate-container {
  width: 1200px;
  height: 100%;
}

.livepoker-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 30px 40px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  background: url("@/assets/promo/lh-livepoker-rebate/section-bg.png");
  background-size: 100% 100%;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .livepoker-rebate-section-right {
    margin-top: auto;
    margin-bottom: auto;
    width: 254px;

    .bonus-image {
      cursor: pointer;
      width: 100%;

      &:hover {
        filter: brightness(0.9);
      }
      &:active {
        transform: translate(0px, 1px);
        opacity: 0.9;
      }

      &.disabled {
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }

  .livepoker-rebate-section-title {
    color: #000000;
    font-size: 24px;
    line-height: 1;
    font-weight: 600;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 20px;
  }
}

.livepoker-rebate-game {
  width: 100%;
  height: 302px;
  border-radius: 12px;
  // border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
}

.livepoker-rebate-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .livepoker-rebate-game-bottom-left-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    color: #ff0000;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 16px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff0000;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  }
}

.livepoker-rebate-game-info {
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
    background-image: url("@/assets/promo/lh-livepoker-rebate/info-pullback-title.png");
    background-repeat: no-repeat;
    background-size: contain;
    width: 90%;
    height: 50px;
    margin: 0px auto 20px;
  }
  .little-title {
    display: flex;
    // flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
    .left {
      background-image: url("@/assets/promo/lh-livepoker-rebate/info-little-pullback-bg.png");
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

.livepoker-rebate-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
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

.livepoker-rebate-game-bottom-rule {
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
    background-image: url("@/assets/promo/lh-livepoker-rebate/rule-pullback-title.png");
    background-repeat: no-repeat;
    background-size: contain;
    width: 90%;
    height: 50px;
    margin: 0px auto 20px;
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

      .hint {
        font-size: 18px;
        font-weight: 400;
        line-height: 22.4px;
        color: #ff0000;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

.reward-info {
  border: 1px solid rgba(215, 235, 255, 1);
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.reward-info-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.reward-info-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  color: black;
  gap: 24px;

  .amount {
    color: #00a1ff;
    font-weight: 600;
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
    background: url(@/assets/promo/lh-livepoker-rebate/close-btn.png);
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
    background-image: url("@/assets/promo/lh-livepoker-rebate/info-dialog-title.png");
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
</style>
