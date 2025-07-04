<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="tab-wrapper">
        <div
          class="tab"
          :class="{ active: tabValue === 'lh1-live-daily-bonus' }"
          @click="tabValue = 'lh1-live-daily-bonus'"
        >
          日投返利
        </div>
        <div
          class="tab"
          :class="{ active: tabValue === 'lh1-live-weekly-bonus' }"
          @click="tabValue = 'lh1-live-weekly-bonus'"
        >
          周投返利
        </div>
      </div>

      <template v-if="tabValue === 'lh1-live-daily-bonus'">
        <div>
          <div class="livepoker-rebate-section section-bg">
            <div class="livepoker-rebate-section-left">
              <div class="livepoker-rebate-section-title">
                <div class="claim-title-icon"></div>
                每日礼金
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <div class="claim-coin-icon"></div>
                </div>
                <div class="reward-info-content">
                  昨日累计有效投注：
                  <span class="amount">{{ totalValidBet }}元</span>
                </div>
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <div class="claim-gift-icon"></div>
                </div>
                <div class="reward-info-content">
                  今日可领取彩金：
                  <span class="amount">{{ bonus }}元</span>
                </div>
              </div>
            </div>
            <div class="livepoker-rebate-section-right">
              <div class="bonus-image" @click="handleClaimBonus" >
                <img src="../../../assets/promo/lh-livepoker-rebate/new-reward-btn-1.png" alt="" width="100%" />
              </div>
              <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: bonus <= 0 }">
                <img src="../../../assets/promo/lh-livepoker-rebate/new-reward-btn-2.png" alt="" width="100%" />
              </div>
            </div>
          </div>
          <div class="livepoker-rebate-game-info section-bg">
            <div class="title-img">活动详情</div>
            <div class="little-title">
              <div class="ribbon">活动对象</div>
              <div class="right">全体会员</div>
            </div>
            <div class="little-title">
              <div class="ribbon">活动内容</div>
              <div class="right">
                活动期间，统计当日真人视讯场馆游戏总有效投注≥8,000 元或以上，次日 01:00 起，即可在本活动页面点击
                [点击领取] 按钮领取彩金
              </div>
            </div>
            <table class="livepoker-rebate-game-info-table section-table">
              <tbody>
                <tr>
                  <th>当日真人有效投注</th>
                  <th>彩金上限</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td>≥8,000</td>
                  <td>8 元</td>
                  <td :rowspan="7">12 倍流水</td>
                </tr>
                <tr>
                  <td>≥30,000</td>
                  <td>18 元</td>
                </tr>
                <tr>
                  <td>≥60,000</td>
                  <td>32 元</td>
                </tr>
                <tr>
                  <td>≥300,000</td>
                  <td>188 元</td>
                </tr>
                <tr>
                  <td>≥600,000</td>
                  <td>318 元</td>
                </tr>
                <tr>
                  <td>≥3,000,000</td>
                  <td>1,688 元</td>
                </tr>
                <tr>
                  <td>≥6,000,000</td>
                  <td>2,888 元</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="livepoker-rebate-game-bottom-rule section-bg">
            <div class="title-img">活动规则</div>
            <br/>
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                活动一：活动仅限真人视讯类游戏当日有效投注，彩金只需完成 12 倍流水即可出款
              </div>
              <div class="item">
                <div class="item-num">2</div>
                活动二：活动仅限真人视讯类游戏指定周期有效投注，彩金只需完成 8 倍流水即可出款
              </div>
              <div class="item">
                <div class="item-num">3</div>
                活动期间，符合条件的会员在次日01:00点起前往本活动页面点击【点击领取】按钮即可获得彩金，彩金只保留在当天23:59点前领取，逾期不补。
              </div>
              <div class="item">
                <div class="item-num">4</div>
                真人视讯中产生以下投注不计算，对冲或对打不计，无风险不计；无风险投注包括在百家乐同时投注庄家、闲家；轮盘超过
                24 个号码以上，或者同时投注大小、单双、红黑，任何取消注单或局数不计。
              </div>
              <div class="item">
                <div class="item-num">5</div>
                同一手机号、姓名、邮箱地址、银行卡号、IP 地址等身份认证信息视为同一账号，仅限一个账号参与。任何团体或个人以非法方式套取优惠（如投注对冲等），平台保留在不提前通知情况下做出处理。
              </div>
              <div class="item">
                <div class="item-num">6</div>
                为避免文字理解差异，如有疑问可联系在线客服，平台保留活动最终解释权。
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="tabValue === 'lh1-live-weekly-bonus'">
        <div>
          <div class="livepoker-rebate-section section-bg">
            <div class="livepoker-rebate-section-left">
              <div class="livepoker-rebate-section-title">
                <div class="claim-title-icon"></div>
                每日礼金
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <div class="claim-coin-icon"></div>
                </div>
                <div class="reward-info-content">
                  上周期累计有效投注：
                  <span class="amount">{{ totalValidBet }}元</span>
                </div>
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <div class="claim-gift-icon"></div>
                </div>
                <div class="reward-info-content">
                  可领取周彩金：
                  <span class="amount">{{ bonus }}元</span>
                </div>
              </div>
            </div>
            <div class="livepoker-rebate-section-right">
              <div class="bonus-image" @click="handleClaimBonus" >
                <img src="../../../assets/promo/lh-livepoker-rebate/new-reward-btn-1.png" alt="" width="100%" />
              </div>
              <div class="bonus-image" @click="handleClaimBonus" :class="{ disabled: bonus <= 0 }">
                <img src="../../../assets/promo/lh-livepoker-rebate/new-reward-btn-2.png" alt="" width="100%" />
              </div>
            </div>
          </div>
          <div class="livepoker-rebate-game-info section-bg">
            <div class="title-img">活动详情</div>
            <div class="little-title">
              <div class="ribbon">活动对象</div>
              <div class="right">全体会员</div>
            </div>
            <div class="little-title">
              <div class="ribbon">活动内容</div>
              <div class="right">
                每周五至隔周四，在真人视讯场馆投注，有效投注满足以下门槛，即可在下周期周五 23:59:59
                点前在活动页领取周打码流水彩金
              </div>
            </div>
            <table class="livepoker-rebate-game-info-table section-table">
              <tbody>
                <tr>
                  <th>指定周期真人有效投注</th>
                  <th>周彩金</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td>≥8,800,000 元</td>
                  <td>138 元</td>
                  <td :rowspan="4">8 倍流水</td>
                </tr>
                <tr>
                  <td>≥12,000,000 元</td>
                  <td>388 元</td>
                </tr>
                <tr>
                  <td>≥28,000,000 元</td>
                  <td>988 元</td>
                </tr>
                <tr>
                  <td>≥60,000,000 元</td>
                  <td>2,388 元</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="livepoker-rebate-game-bottom-rule section-bg">
            <div class="title-img">活动规则</div>
            <br/>
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                活动一：活动仅限真人视讯类游戏当日有效投注，彩金只需完成 12 倍流水即可出款
              </div>
              <div class="item">
                <div class="item-num">2</div>
                活动二：活动仅限真人视讯类游戏指定周期有效投注，彩金只需完成 8 倍流水即可出款
              </div>
              <div class="item">
                <div class="item-num">3</div>
                活动期间，符合条件的会员在次日01:00点起前往本活动页面点击【点击领取】按钮即可获得彩金，彩金只保留在当天23:59点前领取，逾期不补。
              </div>
              <div class="item">
                <div class="item-num">4</div>
                真人视讯中产生以下投注不计算，对冲或对打不计，无风险不计；无风险投注包括在百家乐同时投注庄家、闲家；轮盘超过
                24 个号码以上，或者同时投注大小、单双、红黑，任何取消注单或局数不计。
              </div>
              <div class="item">
                <div class="item-num">5</div>
                同一手机号、姓名、邮箱地址、银行卡号、IP 地址等身份认证信息视为同一账号，仅限一个账号参与。任何团体或个人以非法方式套取优惠（如投注对冲等），平台保留在不提前通知情况下做出处理。
              </div>
              <div class="item">
                <div class="item-num">6</div>
                为避免文字理解差异，如有疑问可联系在线客服，平台保留活动最终解释权。
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { getGameTypeBonusInit, claimGameTypeBonus } from "@/api/index/promo";
import { watch, ref, defineProps } from "vue";
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";
import { ElMessageBox } from "element-plus";
const props = defineProps(["promoCode"]);
const promoCode = ref(props.promoCode);

const notify = useNotify();

const store = userStore();
const totalValidBet = ref(0);
const bonus = ref(0);

const tabValue = ref("lh1-live-daily-bonus");

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

  claimGameTypeBonus(tabValue.value)
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
    totalValidBet.value = 0;
    bonus.value = 0;

    const res = await getGameTypeBonusInit(tabValue.value);

    totalValidBet.value = res.data.totalValidBet;
    bonus.value = res.data.bonus;
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => tabValue.value,
  () => {
    if (!store.token) {
      // notify({
      //   message: "请登录后操作",
      //   type: "error"
      // });
      return;
    }
    fetchData();
  },
  {
    immediate: true
  }
);
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
    width: 200px;

    .bonus-image {
      cursor: pointer;
      width: 100%;
      max-width: 175px;

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
