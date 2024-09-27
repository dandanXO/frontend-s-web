<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section">
        <div class="livepoker-rebate-section-left">
          <div class="livepoker-rebate-section-title">
            <div><img src="../../../assets/promo/lh-livepoker-rebate/section-title-img.png" /></div>
            每日彩金
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img src="../../../assets/promo/lh-livepoker-rebate/reward-icon1.png" alt="" width="100%" />
            </div>
            <div class="reward-info-content">
              昨日存款金额：
              <span class="amount">{{ depositAmount }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img src="../../../assets/promo/lh-livepoker-rebate/reward-icon2.png" alt="" width="100%" />
            </div>
            <div class="reward-info-content">
              昨日有效流水：
              <span class="amount">{{ validBetAmount }}元</span>
            </div>
          </div>
          <div class="reward-info">
            <div class="reward-info-icon">
              <img src="../../../assets/promo/lh-livepoker-rebate/reward-icon2.png" alt="" width="100%" />
            </div>
            <div class="reward-info-content">
              今日可领彩金：
              <span class="amount">{{ bonusAmount }}元</span>
            </div>
          </div>
        </div>
        <div class="livepoker-rebate-section-right">
          <div class="bonus-image" @click="handleClaimBonus">
            <img src="../../../assets/promo/lh-livepoker-rebate/reward-btn.png" alt="" width="100%" />
          </div>
          <span class="applied-records-btn" @click="onClickAppliedRecordsBtn">申请记录</span>
        </div>
      </div>
      <div class="livepoker-rebate-game-info">
        <div class="title"></div>
        <div class="little-title">
          <div class="left">活动时间</div>
          <div class="right">2024 年 10 月 01 日~2024 年 10 月 07 日</div>
        </div>
        <div class="little-title">
          <div class="left">活动对象</div>
          <div class="right">全体会员</div>
        </div>
        <div class="little-title" style="flex-direction: column; align-items: flex-start">
          <div class="left">活动内容</div>
          <div class="right">
            活动期间，会员当日雷火电竞场馆累计效投注金额达到当日总存款金额的 3
            倍即可获得对应存款反比，满足活动要求的会员可在活动页面点击“立即领取”领取彩金，彩金上限高达 1,888 元，仅需 3
            倍流水即可取款！
          </div>
        </div>
        <table class="livepoker-rebate-game-info-table">
          <tr>
            <th>达成条件 (流水仅限雷火电竞场馆)</th>
            <th>应发彩金</th>
            <th>彩金上限</th>
          </tr>
          <tr>
            <td>当日存款 3 倍流水</td>
            <td>当日存款 1.0%</td>
            <td>188</td>
          </tr>
          <tr>
            <td>当日存款 5 倍流水</td>
            <td>当日存款 2.0%</td>
            <td>588</td>
          </tr>
          <tr>
            <td>当日存款 8 倍流水</td>
            <td>当日存款 3.0%</td>
            <td>888</td>
          </tr>
          <tr>
            <td>当日存款 15 倍流水</td>
            <td>当日存款 5.0%</td>
            <td>1,888</td>
          </tr>
        </table>

        <div class="livepoker-rebate-game-bottom">
          <div class="livepoker-rebate-game-bottom-left-title">
            <div class="livepoker-rebate-game-bottom-left-btn">
              <img src="../../../assets/promo/lh-livepoker-rebate/game-bottom-left-btn.png" alt="" width="22px" />
              <span>示例</span>
            </div>
            会员 A 当日存款 100 元并且在雷火电竞累计有效投注 300 元即可获得 100*1%=1 元彩金。
          </div>
        </div>
      </div>

      <div class="livepoker-rebate-game-bottom-rule">
        <div class="title"></div>
        <div class="content">
          <div class="item">
            <div class="item-num">1</div>
            <div style="display: flex; flex-direction: column">
              <div>活动仅计算雷火电竞场馆有效投注，其他场馆有效投注不参与本次活动；</div>
            </div>
          </div>
          <div class="item">
            <div class="item-num">2</div>
            当日完成对应存款流水后即可点击活动页面“立即领取”领取彩金，彩金仅需 3 倍流水即可出款；
          </div>
          <div class="item">
            <div class="item-num">3</div>
            本活动仅计算活动时间内存款，活动时间为 10 月 01 日 00:00~10 月 07 日
            23:59:59，活动时间外达成条件不予计算此优惠;
          </div>
          <div class="item">
            <div class="item-num">4</div>
            本活动有效投注额以结算时间为准，仅对已结算并产生输赢结果的投注额进行计算，任何走盘、串关、特殊投注、取消的赛事将不计算在有效投注额内；
          </div>
          <div class="item">
            <div class="item-num">5</div>
            任何低于欧洲盘 1.7 或亚洲盘 0.7
            水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
          </div>
          <div class="item">
            <div class="item-num">6</div>
            同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；
          </div>
          <div class="item">
            <div class="item-num">7</div>
            任何用户或团体以不正常的方式进行套取活动优惠，平台方保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；
          </div>
          <div class="item">
            <div class="item-num">8</div>
            为避免文字理解差异，本站保留本活动最终解释权。
          </div>
        </div>
      </div>
    </div>
  </div>

  <AppliedRecordsPopup ref="appliedRecordsPopupRef" />
</template>

<script setup>
import { onMounted, ref, defineProps, computed } from "vue";
import { ElMessageBox } from "element-plus";

import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";
import { claimNationalDayBonus, getNationalDayinit } from "@/api/index/promo";
import AppliedRecordsPopup from "./AppliedRecordsPopup.vue";

const props = defineProps(["promoCode"]);
const notify = useNotify();
const store = userStore();

const depositAmount = ref(0);
const bonusAmount = ref(0);
const turnOverRequirement = ref(0);
const validBetAmount = ref(0);
const appliedRecordsPopupRef = ref();

const handleClaimBonus = () => {
  if (!store.hasToken()) {
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

  claimNationalDayBonus()
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: `成功领取`
        });

        init();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const onClickAppliedRecordsBtn = () => {
  appliedRecordsPopupRef.value.openPopup();
};

const init = () => {
  getNationalDayinit().then((res) => {
    if (res.code === 0) {
      // 昨日存款金额
      depositAmount.value = res.data.depositAmount || 0;
      // 奖金
      bonusAmount.value = res.data.bonusAmount || 0;
      // 流水倍数
      turnOverRequirement.value = res.data.turnOverRequirement || 0;

      validBetAmount.value = res.data.validBetAmount || 0;
    }
  });
};

onMounted(() => {
  if (!store.token) {
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
    return;
  }

  init();
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
  background: url("../../../assets/promo/lh-livepoker-rebate/section-bg.png");
  background-size: 100% 100%;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .livepoker-rebate-section-right {
    position: relative;
    width: 254px;

    .applied-records-btn {
      position: absolute;
      top: -20px;
      right: -20px;
      color: #00a1ff;
      font-size: 16px;
      cursor: pointer;
    }

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
    background-image: url("../../../assets/promo/lh-livepoker-rebate/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin: 0 auto 40px;
  }
  .little-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    .left {
      background-image: url("../../../assets/promo/lh-livepoker-rebate/info-little-title-bg.png");
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
    background-image: url("../../../assets/promo/lh-livepoker-rebate/rule-title.png");
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
</style>
