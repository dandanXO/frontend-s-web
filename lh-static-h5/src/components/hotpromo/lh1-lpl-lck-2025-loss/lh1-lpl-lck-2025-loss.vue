<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="tab-wrapper">
        <div class="tab" :class="{ active: tabValue === 1 }" @click="tabValue = 1">投注好礼</div>
        <div class="tab" :class="{ active: tabValue === 2 }" @click="tabValue = 2">救援好礼</div>
      </div>

      <template v-if="tabValue === 1">
        <div>
          <div class="livepoker-rebate-section section-bg">
            <div class="livepoker-rebate-section-left">
              <div class="livepoker-rebate-section-title">
                <div class="claim-title-icon"></div>
                码上有钱
              </div>
              <div class="reward-info">
                <div class="reward-info-icon claim-coin-icon"></div>
                <div class="reward-info-content">
                  昨日累计有效投注：
                  <span class="amount">{{ totalValidBet }}元</span>
                </div>
              </div>
              <div class="reward-info">
                <div class="reward-info-icon claim-gift-icon"></div>
                <div class="reward-info-content">
                  今日可领取彩金：
                  <span class="amount">{{ bonus1 }}元</span>
                </div>
              </div>
            </div>
            <div class="livepoker-rebate-section-right">
              <div class="bonus-image" @click="handleClaimBonus1" :class="{ disabled: bonus1 <= 0 }">
                <img
                  src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/new-claim-btn2.png"
                  alt=""
                  width="100%"
                />
              </div>
            </div>
          </div>
          <div class="livepoker-rebate-game-info section-bg">
            <div class="title-img">活动详情</div>
            <div class="little-title" style="justify-content: flex-start; align-items: flex-start">
              <div class="ribbon">活动时间</div>
              <div class="right">2025年6月28日-7月14日</div>
            </div>
            <div
              class="little-title"
              style="flex-direction: column; justify-content: flex-start; align-items: flex-start"
            >
              <div class="ribbon">活动内容</div>
              <div class="right">活动期间，当日2025季中冠军赛段有效投注≥3,000 元即可获得 最高 1288 元的奖励金</div>
            </div>
            <table class="livepoker-rebate-game-info-table section-table">
              <tbody>
                <tr>
                  <th>有效投注</th>
                  <th>投注金</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td>≥3,000</td>
                  <td>8 元</td>
                  <td :rowspan="9">8 倍流水</td>
                </tr>
                <tr>
                  <td>≥5,000</td>
                  <td>28 元</td>
                </tr>
                <tr>
                  <td>≥10,000</td>
                  <td>58 元</td>
                </tr>
                <tr>
                  <td>≥15,000</td>
                  <td>88 元</td>
                </tr>
                <tr>
                  <td>≥30,000</td>
                  <td>168 元</td>
                </tr>
                <tr>
                  <td>≥50,000</td>
                  <td>288 元</td>
                </tr>
                <tr>
                  <td>≥100,000</td>
                  <td>558 元</td>
                </tr>
                <tr>
                  <td>≥300,000</td>
                  <td>888 元</td>
                </tr>
                <tr>
                  <td>≥500,000</td>
                  <td>1,288 元</td>
                </tr>
              </tbody>
            </table>
            <div class="livepoker-rebate-game-bottom">
              <div class="livepoker-rebate-game-bottom-left-title">
                <div class="livepoker-rebate-game-bottom-left-btn">
                  <img
                    src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/game-bottom-left-btn.png"
                    alt=""
                    style="width: 10px"
                  />
                  <span>示例</span>
                </div>
                用户 A 在 3月 10 日投注2025季中冠军赛段累计有效投注 50,000 元，用户 A 在次日 24 小时内可获得彩金：288 元
              </div>
            </div>
          </div>

          <div class="livepoker-rebate-game-bottom-rule section-bg">
            <div class="title-img">活动规则</div>
            <br />
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                <div style="display: flex; flex-direction: column">
                  <div>
                    活动期间，活动仅计算电竞场馆中2025季中冠军赛段，会员在当日2025季中冠军赛段中累计有效投注≥3,000 元即可获得对应彩金，有效投注次日清零
                  </div>
                  <div class="hint">注：奖金不叠加派发，奖金按最高档位每日派发一次。</div>
                </div>
              </div>
              <div class="item">
                <div class="item-num">2</div>
                活动期间，活动仅计算当日2025季中冠军赛段已结算的赛事总有效投注，次日 24 小时内在活动页面点击【点击领取】按钮领取。逾期未领取则视为放弃，彩金 8 倍流水即可出款；
              </div>
              <div class="item">
                <div class="item-num">3</div>
                任何低于欧洲盘 1.7 或亚洲盘 0.7 水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为累计负盈利内；
              </div>
              <div class="item">
                <div class="item-num">4</div>
                根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
              </div>
              <div class="item">
                <div class="item-num">5</div>
                此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
                地址视为同一账户，若有违规者，将不享受此红利；
              </div>
              <div class="item">
                <div class="item-num">6</div>
                为避免文字理解差异，雷火电竞保留此活动最终解释权；
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="tabValue === 2">
        <div>
          <div class="livepoker-rebate-section section-bg">
            <div class="livepoker-rebate-section-left">
              <div class="livepoker-rebate-section-title">
                <div class="claim-title-icon"></div>
                救援礼金
              </div>
              <div class="reward-info">
                <div class="reward-info-icon claim-coin-icon"></div>
                <div class="reward-info-content">
                  昨日累计负盈利：
                  <span class="amount">{{ totalLoss }}元</span>
                </div>
              </div>
              <div class="reward-info">
                <div class="reward-info-icon claim-gift-icon"></div>
                <div class="reward-info-content">
                  今日可领取救援金：
                  <span class="amount">{{ bonus2 }}元</span>
                </div>
              </div>
            </div>
            <div class="livepoker-rebate-section-right">
              <div class="bonus-image" @click="handleClaimBonus2" :class="{ disabled: bonus2 <= 0 }">
                <img
                  src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/new-claim-btn2.png"
                  alt=""
                  width="100%"
                />
              </div>
            </div>
          </div>
          <div class="livepoker-rebate-game-info section-bg">
            <div class="title-img">活动详情</div>
            <div class="little-title" style="justify-content: flex-start; align-items: flex-start">
              <div class="ribbon">活动时间</div>
              <div class="right">2025 年 3月22日- 6月14日</div>
            </div>
            <div
              class="little-title"
              style="flex-direction: column; justify-content: flex-start; align-items: flex-start"
            >
              <div class="ribbon">活动内容</div>
              <div class="right">
                会员在电竞场馆中投注2025季中冠军赛段，北京时间当日负盈利达到 1500
                元及以上，次日即可领取救援金，最高可达 1,188 元！
              </div>
            </div>
            <table class="livepoker-rebate-game-info-table section-table">
              <tbody>
                <tr>
                  <th>2025季中冠军赛段 负盈利</th>
                  <th>救援金</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td>≥1,500</td>
                  <td>8 元</td>
                  <td :rowspan="9">6 倍流水</td>
                </tr>
                <tr>
                  <td>≥3,000</td>
                  <td>18 元</td>
                </tr>
                <tr>
                  <td>≥5,000</td>
                  <td>38 元</td>
                </tr>
                <tr>
                  <td>≥10,000</td>
                  <td>88 元</td>
                </tr>
                <tr>
                  <td>≥30,000</td>
                  <td>188 元</td>
                </tr>
                <tr>
                  <td>≥50,000</td>
                  <td>388 元</td>
                </tr>
                <tr>
                  <td>≥100,000</td>
                  <td>558 元</td>
                </tr>
                <tr>
                  <td>≥300,000</td>
                  <td>888 元</td>
                </tr>
                <tr>
                  <td>≥500,000</td>
                  <td>1,188 元</td>
                </tr>
              </tbody>
            </table>
            <div class="livepoker-rebate-game-bottom">
              <div class="livepoker-rebate-game-bottom-left-title">
                <div class="livepoker-rebate-game-bottom-left-btn">
                  <img
                    src="../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/game-bottom-left-btn.png"
                    alt=""
                    style="width: 10px"
                  />
                  <span>示例</span>
                </div>
                会员 A 在电竞场馆投注2025季中冠军赛段，当日产生负盈利为 60000 元，次日即可获得救援金 388 元。
              </div>
            </div>
          </div>

          <div class="livepoker-rebate-game-bottom-rule section-bg">
            <div class="title-img">活动规则</div>
            <br />
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                <div style="display: flex; flex-direction: column">
                  <div>
                    活动期间，活动仅计算电竞场馆中2025季中冠军赛段，会员在当日2025季中冠军赛段中累计负盈利≥1,500
                    元即可获得对应彩金，负盈利次日清零；
                  </div>
                  <div class="hint">注：奖金不叠加派发，奖金按最高档位每日派发一次。</div>
                </div>
              </div>
              <div class="item">
                <div class="item-num">2</div>
                活动期间，活动仅计算2025季中冠军赛段已结算的赛事总负盈利，次日 24
                小时内在活动页面点击【点击领取】按钮领取。逾期未领取则视为放弃，彩金 6 倍流水即可出款；
              </div>
              <div class="item">
                <div class="item-num">3</div>
                任何低于欧洲盘 1.7 或亚洲盘 0.7
                水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
              </div>
              <div class="item">
                <div class="item-num">4</div>
                根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
              </div>
              <div class="item">
                <div class="item-num">5</div>
                此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
                地址视为同一账户，若有违规者，将不享受此红利；
              </div>
              <div class="item">
                <div class="item-num">6</div>
                为避免文字理解差异，雷火电竞保留此活动最终解释权；
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from "vue";
import {
  getCompetitionLossInit,
  claimCompetitionLoss,
  getCompetitionYesterday,
  claimCompetitionBonus
} from "../../../api/index/promo";
import { useNotify } from "src/hooks/notify";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const props = defineProps(["promoParam"]);
const { promoParam } = toRefs(props);

const notify = useNotify();
const store = userStore();
const $q = useQuasar();
const router = useRouter();

const totalValidBet = ref(0);
const bonus1 = ref(0);

const bonus2 = ref(0);
const totalLoss = ref(0);

const tabValue = ref(1);

const handleClaimBonus2 = () => {
  if (!store.token) {
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
    return;
  }
  claimCompetitionLoss(promoParam.value.promoCode2)
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: `成功领取${res.data}元`
        });
        fetchData();
      } else {
        notify({
          type: "error",
          message: res.message
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleClaimBonus1 = () => {
  if (!store.token) {
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
    return;
  }
  claimCompetitionBonus(promoParam.value.promoCode1)
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: `成功领取${res.data}元`
        });
        fetchData();
      } else {
        notify({
          type: "error",
          message: res.message
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const fetchData = async () => {
  try {
    const res2 = await getCompetitionLossInit(promoParam.value.promoCode2);
    const res1 = await getCompetitionYesterday(promoParam.value.promoCode1);

    totalValidBet.value = res1.data?.totalValidBet || 0;
    bonus1.value = res1.data?.bonus || 0;

    totalLoss.value = res2.data?.totalLoss || 0;
    bonus2.value = res2.data?.bonus || 0;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  if (!store.token) {
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
  width: 100%;
  height: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.livepoker-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 20px 12px 40px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/section-bg.png");
  background-size: 100% 100%;
  align-items: center;
  width: 100%;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  .livepoker-rebate-section-right {
    width: 180px;
    margin-top: 20px;

    .bonus-image {
      width: 100%;
      cursor: pointer;

      &:active {
        filter: brightness(0.85);
        transform: translate(0px, 1px);
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
    font-size: 16px;
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
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff5757 !important;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff5757 !important;
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
  padding: 20px 12px 12px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .title {
    background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/info-title.png");
    background-repeat: no-repeat;
    background-size: 100%;
    width: 240px;
    height: 26px;
    margin: 0 auto;
  }
  .little-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    .left {
      background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 64px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 12px;
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
  text-align: center;
  vertical-align: middle;
  th {
    height: 36px;
    font-size: 12px;
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
    background: transparent !important;
    border: 1px solid #acd4f6;
    height: 36px;
    font-size: 12px;
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
  padding: 20px 12px 12px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 240px;
    height: 20px;
    margin-bottom: 20px;
  }
  .content {
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    color: #000000;
    padding: 8px;
    .item {
      display: flex;
      gap: 10px;
      align-items: baseline;

      .item-num {
        color: #ffffff;
        font-size: 12px;
        line-height: 1;
        border-radius: 50%;
        height: 16px !important;
        width: 16px !important;
        min-width: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2px;
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      }

      .hint {
        font-size: 12px;
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
  width: 16px;
  height: 16px;
  margin-right: 10px;
}

.reward-info-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: black;

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
  margin-bottom: 20px;

  .tab {
    width: 160px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 60px;
    background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
    color: #818181;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;

    &.active {
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      color: white;
    }
  }
}
</style>
