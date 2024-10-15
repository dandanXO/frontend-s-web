<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="tab-wrapper">
        <div class="tab" :class="{ active: tabValue === 1 }" @click="tabValue = 1">活动1</div>
        <div class="tab" :class="{ active: tabValue === 2 }" @click="tabValue = 2">活动2</div>
      </div>

      <template v-if="tabValue === 1">
        <div>
          <div class="livepoker-rebate-section">
            <div class="livepoker-rebate-section-left">
              <div class="livepoker-rebate-section-title">
                <div><img src="../../../assets/promo/lh1-blast-premier/section-title-img.png" /></div>
                每日礼金
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <img src="../../../assets/promo/lh1-blast-premier/reward-icon1.png" alt="" width="100%" />
                </div>
                <div class="reward-info-content">
                  昨日累计有效投注：
                  <span class="amount">{{ totalValidBet }}元</span>
                </div>
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <img src="../../../assets/promo/lh1-blast-premier/reward-icon2.png" alt="" width="100%" />
                </div>
                <div class="reward-info-content">
                  今日可领取彩金：
                  <span class="amount">{{ dailyBonus }}元</span>
                </div>
              </div>
            </div>
            <div class="livepoker-rebate-section-right">
              <div class="bonus-image" @click="handleClaimDailyBonus" :class="{ disabled: bonus <= 0 }">
                <img src="../../../assets/promo/lh-livepoker-rebate/reward-btn.png" alt="" width="100%" />
              </div>
            </div>
          </div>
          <div class="livepoker-rebate-game-info">
            <div class="title"></div>
            <div class="little-title">
              <div class="left">活动对象</div>
              <div class="right">全体会员</div>
            </div>
            <div class="little-title">
              <div class="left">活动内容</div>
              <div class="right">活动期间，统计当日真人视讯场馆游戏总有效投注≥8,000 元或以上，次日 00:00 起，即可在本活动页面点击 [点击领取] 按钮领取彩金</div>
            </div>
            <table class="livepoker-rebate-game-info-table">
              <tbody>
                <tr>
                  <th>当日真人有效投注</th>
                  <th>彩金上限</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td>≥8,000</td>
                  <td>8元</td>
                  <td :rowspan="7">12倍流水</td>
                </tr>
                <tr>
                  <td>≥30,000</td>
                  <td>18元</td>
                </tr>
                <tr>
                  <td>≥60,000</td>
                  <td>32元</td>
                </tr>
                <tr>
                  <td>≥300,000</td>
                  <td>188元</td>
                </tr>
                <tr>
                  <td>≥600,000</td>
                  <td>318元</td>
                </tr>
                <tr>
                  <td>≥3,000,000</td>
                  <td>1688元</td>
                </tr>
                <tr>
                  <td>≥6,000,000</td>
                  <td>2888元</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="livepoker-rebate-game-bottom-rule">
            <div class="title"></div>
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                活动一:活动仅限真人视讯类游戏当日有效投注，彩金只需完成12倍流水即可出款
              </div>
              <div class="item">
                <div class="item-num">2</div>
                活动二:活动仅限真人视讯类游戏指定周期有效投注，彩金只需完成8倍流水即可出款
              </div>
              <div class="item">
                <div class="item-num">3</div>
                真人视讯中产生以下投注不计算，对冲或对打不计，无风险不计；无风险投注包括在百家乐同时投注庄家、闲家；轮盘超过24个号码以上，或者同时投注大小、单双、红黑，任何取消注单注单或局数不计。
              </div>
              <div class="item">
                <div class="item-num">4</div>
                同一手机号、姓名、邮箱地址、银行卡号、IP地址等身份认证信息视为同一账号，仅限一个账号参与、任何团体或个人以非法方式套取优惠（如投注对冲等），平台保留在不提前通知情况下做出处理。
              </div>
              <div class="item">
                <div class="item-num">5</div>为避免文字理解差异，如有疑问可联系在线客服，平台保留活动最终解释权。
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="tabValue === 2">
        <div>
          <div class="livepoker-rebate-section">
            <div class="livepoker-rebate-section-left">
              <div class="livepoker-rebate-section-title">
                <div><img src="../../../assets/promo/lh1-blast-premier/section-title-img.png" /></div>
                每日礼金
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <img src="../../../assets/promo/lh1-blast-premier/reward-icon1.png" alt="" width="100%" />
                </div>
                <div class="reward-info-content">
                  上周期累计有效投注：
                  <span class="amount">{{ totalLoss }}元</span>
                </div>
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <img src="../../../assets/promo/lh1-blast-premier/reward-icon2.png" alt="" width="100%" />
                </div>
                <div class="reward-info-content">
                  可领取周彩金：
                  <span class="amount">{{ weeklyBonus }}元</span>
                </div>
              </div>
            </div>
            <div class="livepoker-rebate-section-right">
              <div class="bonus-image" @click="handleClaimWeeklyBonus" :class="{ disabled: bonus <= 0 }">
                <img src="../../../assets/promo/lh-livepoker-rebate/reward-btn.png" alt="" width="100%" />
              </div>
            </div>
          </div>
          <div class="livepoker-rebate-game-info">
            <div class="title"></div>
            <div class="little-title">
              <div class="left">活动对象</div>
              <div class="right">全体会员</div>
            </div>
            <div class="little-title">
              <div class="left">活动内容</div>
              <div class="right">
                每周五至隔周四，在真人视讯场馆投注，有效投注满足以下门槛，即可在下周期周五23:59:59点前在活动页领取周打码流水彩金
              </div>
            </div>
            <table class="livepoker-rebate-game-info-table">
              <tbody>
                <tr>
                  <th>指定周期真人有效投注</th>
                  <th>周彩金</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td>≥8,800,000元</td>
                  <td>138元</td>
                  <td :rowspan="4">12倍流水</td>
                </tr>
                <tr>
                  <td>≥12,000,000元</td>
                  <td>388元</td>
                </tr>
                <tr>
                  <td>≥28,000,000元</td>
                  <td>988元</td>
                </tr>
                <tr>
                  <td>≥60,000,000元</td>
                  <td>2388元</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="livepoker-rebate-game-bottom-rule">
            <div class="title"></div>
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                活动一:活动仅限真人视讯类游戏当日有效投注，彩金只需完成12倍流水即可出款
              </div>
              <div class="item">
                <div class="item-num">2</div>
                活动二:活动仅限真人视讯类游戏指定周期有效投注，彩金只需完成8倍流水即可出款
              </div>
              <div class="item">
                <div class="item-num">3</div>
                真人视讯中产生以下投注不计算，对冲或对打不计，无风险不计；无风险投注包括在百家乐同时投注庄家、闲家；轮盘超过24个号码以上，或者同时投注大小、单双、红黑，任何取消注单注单或局数不计。
              </div>
              <div class="item">
                <div class="item-num">4</div>
                同一手机号、姓名、邮箱地址、银行卡号、IP地址等身份认证信息视为同一账号，仅限一个账号参与、任何团体或个人以非法方式套取优惠（如投注对冲等），平台保留在不提前通知情况下做出处理。
              </div>
              <div class="item">
                <div class="item-num">5</div>为避免文字理解差异，如有疑问可联系在线客服，平台保留活动最终解释权。
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { getCBAInit, claimCBADailyBonus, getCBAWeeklyInit, claimCBAWeeklyBonus } from "@/api/index/promo";
import { onMounted, ref, defineProps } from "vue";
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";
import { ElMessageBox } from "element-plus";
const props = defineProps(["promoCode"]);
const promoCode = ref(props.promoCode);

const notify = useNotify();

const store = userStore();
const totalValidBet = ref(0);
const dailyBonus = ref(0);
const betCount = ref(0);

const weeklyBonus = ref(0);
const totalLoss = ref(0);
const claimedBonus = ref(0);

const tabValue = ref(1);

const handleClaimDailyBonus = () => {
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

  claimCBADailyBonus()
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: `成功领取${res.data}元`
        });
        fetchData();
      } else {
        // notify({
        //   type: "error",
        //   message: res.message
        // });
      }
    })
    .catch((err) => {
      console.log(err);
      notify({
        type: "error",
        message: err.message
      });
    });
};

const handleClaimWeeklyBonus = () => {
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

  claimCBAWeeklyBonus()
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: `成功领取${res.data}元`
        });
        fetchData();
      } else {
        // notify({
        //   type: "error",
        //   message: res.message
        // });
      }
    })
    .catch((err) => {
      console.log(err);
      notify({
        type: "error",
        message: err.message
      });
    });
};

const fetchData = async () => {
  try {
    const res = await getCBAInit();
    const res1 = await getCBAWeeklyInit();

    totalValidBet.value = res.data.totalValidBet;
    betCount.value = res.data.betCount;
    dailyBonus.value = res.data.bonus;

    totalLoss.value = res1.data.totalLoss;
    weeklyBonus.value = res1.data.bonus;
    claimedBonus.value = res1.data.claimedBonus;
  } catch (error) {
    console.log(error);
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
  fetchData();
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
  background: url("../../../assets/promo/lh1-blast-premier/section-bg.png");
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
        filter: grayscale(100%);
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
    background-image: url("../../../assets/promo/lh1-blast-premier/info-title.png");
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
      background-image: url("../../../assets/promo/lh1-blast-premier/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 120px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      min-width: 120px;
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
    background-image: url("../../../assets/promo/lh1-blast-premier/rule-title.png");
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

.tab-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  .tab {
    width: 300px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 60px;
    background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
    color: #818181;
    font-size: 36px;
    font-weight: bold;
    cursor: pointer;

    &.active {
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      color: white;
    }
  }
}
</style>
