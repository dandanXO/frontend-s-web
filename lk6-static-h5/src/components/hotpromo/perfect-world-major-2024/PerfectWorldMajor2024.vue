<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="tab-wrapper">
        <div class="tab" :class="{ active: tabValue === 1 }" @click="tabValue = 1">投注好礼</div>
        <div class="tab" :class="{ active: tabValue === 2 }" @click="tabValue = 2">救援好礼</div>
      </div>

      <template v-if="tabValue === 1">
        <div>
          <div class="livepoker-rebate-section">
            <div class="livepoker-rebate-section-left">
              <div class="livepoker-rebate-section-title">
                <div>
                  <img
                    src="../../../assets/images/promotion/hotpromo/dy2-blast-premier/section-title-img.png"
                    style="width: 20px; height: 20px; margin-bottom: 0px"
                  />
                </div>
                投注嘉奖
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <img
                    src="../../../assets/images/promotion/hotpromo/dy2-blast-premier/reward-icon1.png"
                    alt=""
                    width="100%"
                  />
                </div>
                <div class="reward-info-content">
                  昨日累计有效投注：
                  <span class="amount">{{ totalValidBet }}元</span>
                </div>
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <img
                    src="../../../assets/images/promotion/hotpromo/dy2-blast-premier/reward-icon2.png"
                    alt=""
                    width="100%"
                  />
                </div>
                <div class="reward-info-content">
                  可领取彩金：
                  <span class="amount">{{ bonus1 }}元</span>
                </div>
              </div>
            </div>
            <div class="livepoker-rebate-section-right">
              <div class="bonus-image" @click="handleClaimBonus1" :class="{ disabled: bonus1 <= 0 }">
                <img
                  src="../../../assets/images/promotion/hotpromo/dy2-blast-premier/new-claim-btn2.png"
                  alt=""
                  width="100%"
                />
              </div>
            </div>
          </div>
          <div class="livepoker-rebate-game-info">
            <div class="title"></div>
            <div class="little-title" style="justify-content: flex-start; align-items: flex-start">
              <div class="left">活动时间</div>
              <div class="right">2024年11月11日至2024年12月15日</div>
            </div>
            <div
              class="little-title"
              style="flex-direction: column; justify-content: flex-start; align-items: flex-start"
            >
              <div class="left">活动内容</div>
              <div class="right">活动期间，当日完美世界Major 2024有效投注≥1,500 元即可获得 最高1,588元的奖励金</div>
            </div>
            <table class="livepoker-rebate-game-info-table">
              <tbody>
                <tr>
                  <th>有效投注</th>
                  <th>投注金</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td>≥1,500</td>
                  <td>8元</td>
                  <td :rowspan="9">8倍流水</td>
                </tr>
                <tr>
                  <td>≥5,000</td>
                  <td>28元</td>
                </tr>
                <tr>
                  <td>≥10,000</td>
                  <td>58元</td>
                </tr>
                <tr>
                  <td>≥15,000</td>
                  <td>88元</td>
                </tr>
                <tr>
                  <td>≥30,000</td>
                  <td>168元</td>
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
                  <td>≥300,000</td>
                  <td>888元</td>
                </tr>
                <tr>
                  <td>≥500,000</td>
                  <td>1,588元</td>
                </tr>
              </tbody>
            </table>
            <div class="livepoker-rebate-game-bottom">
              <div class="livepoker-rebate-game-bottom-left-title">
                <div class="livepoker-rebate-game-bottom-left-btn">
                  <img
                    src="../../../assets/images/promotion/hotpromo/dy2-blast-premier/game-bottom-left-btn.png"
                    alt=""
                    style="width: 10px"
                  />
                  <span>示例</span>
                </div>
                用户 A 在09月25日投注完美世界Major 2024有效投注 50,000 元，用户 A 在次日 24 小时内可获得彩金：288元
              </div>
            </div>
          </div>

          <div class="livepoker-rebate-game-bottom-rule">
            <div class="title"></div>
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                <div style="display: flex; flex-direction: column">
                  <div>活动期间，活动仅计算电竞场馆中完美世界Major 2024赛事，会员在当日完美世界Major 2024中累计有效投注≥1,500元即可获得对应彩金，有效投注次日清零；</div>
                  <div class="hint">注：奖金不叠加派发，奖金按最高档位每日派发一次。</div>
                </div>
              </div>
              <div class="item">
                <div class="item-num">2</div>
                活动期间，活动仅计算当日 完美世界Major 2024已结算的赛事总有效投注，次日24小时内在活动页面点击【点击领取】按钮领取。逾期未领取则视为放弃，彩金8倍流水即可出款；
              </div>
              <div class="item">
                <div class="item-num">3</div>
                任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
              </div>
              <div class="item">
                <div class="item-num">4</div>
                根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
              </div>
              <div class="item">
                <div class="item-num">5</div>
                此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP 地址视为同一账户，若有违规者，将不享受此红利；
              </div>
              <div class="item">
                <div class="item-num">6</div>
                为避免文字理解差异，东赢电竞保留此活动最终解释权；
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
                <div>
                  <img
                    src="../../../assets/images/promotion/hotpromo/dy2-blast-premier/section-title-img.png"
                    style="width: 20px; height: 20px; margin-bottom: 0px"
                  />
                </div>
                救援礼金
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <img
                    src="../../../assets/images/promotion/hotpromo/dy2-blast-premier/reward-icon1.png"
                    alt=""
                    width="100%"
                  />
                </div>
                <div class="reward-info-content">
                  昨日累计负盈利：
                  <span class="amount">{{ totalLoss }}元</span>
                </div>
              </div>
              <div class="reward-info">
                <div class="reward-info-icon">
                  <img
                    src="../../../assets/images/promotion/hotpromo/dy2-blast-premier/reward-icon2.png"
                    alt=""
                    width="100%"
                  />
                </div>
                <div class="reward-info-content">
                  可领取彩金：
                  <span class="amount">{{ bonus2 }}元</span>
                </div>
              </div>
            </div>
            <div class="livepoker-rebate-section-right">
              <div class="bonus-image" @click="handleClaimBonus2" :class="{ disabled: bonus2 <= 0 }">
                <img
                  src="../../../assets/images/promotion/hotpromo/dy2-blast-premier/new-claim-btn2.png"
                  alt=""
                  width="100%"
                />
              </div>
            </div>
          </div>
          <div class="livepoker-rebate-game-info">
            <div class="title"></div>
            <div
              class="little-title"
              style="justify-content: flex-start; align-items: flex-start"
            >
              <div class="left">活动时间</div>
              <div class="right">2024年11月11日至2024年12月15日</div>
            </div>
            <div
              class="little-title"
              style="justify-content: flex-start; align-items: flex-start"
            >
              <div class="left">活动内容</div>
              <div class="right">
                投注完美世界 Major 2024的会员(电竞)
              </div>
            </div>
            <div
              class="little-title"
              style="flex-direction: column; justify-content: flex-start; align-items: flex-start"
            >
              <div class="left">优惠详情</div>
              <div class="right">
                会员在本站电竞场馆中，北京时间当日负盈利达到1,000元及以上，次日即可领取救援金，最高可达1,288元！
              </div>
            </div>
            <table class="livepoker-rebate-game-info-table">
              <tbody>
                <tr>
                  <th>电竞负盈利</th>
                  <th>救援金</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td>≥1,000</td>
                  <td>8元</td>
                  <td :rowspan="9">5 倍流水</td>
                </tr>
                <tr>
                  <td>≥3,000</td>
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
                  <td>≥30,000</td>
                  <td>188元</td>
                </tr>
                <tr>
                  <td>≥50,000</td>
                  <td>388元</td>
                </tr>
                <tr>
                  <td>≥100,000</td>
                  <td>558元</td>
                </tr>
                <tr>
                  <td>≥300,000</td>
                  <td>888元</td>
                </tr>
                <tr>
                  <td>≥500,000</td>
                  <td>1,288元</td>
                </tr>
              </tbody>
            </table>
            <div class="livepoker-rebate-game-bottom">
              <div class="livepoker-rebate-game-bottom-left-title">
                <div class="livepoker-rebate-game-bottom-left-btn">
                  <img src="../../../assets/images/promotion/hotpromo/lh-livepoker-rebate/game-bottom-left-btn.png" alt="" style="width: 10px" />
                  <span>示例</span>
                </div>
                会员A在电竞场馆投注完美世界Major 2024,当日产生负盈利为6,000元,次日即可获得救援金38元。
              </div>
            </div>
          </div>

          <div class="livepoker-rebate-game-bottom-rule">
            <div class="title"></div>
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                <div style="display: flex; flex-direction: column">
                  <div>活动期间，活动仅计算电竞场馆中完美世界Major 2024赛事，会员在当日完美世界Major 2024中累计负盈利≥1,000元即可获得对应彩金，负盈利次日清零； </div>
                  <div class="hint">注：奖金不叠加派发，奖金按最高档位每日派发一次。</div>
                </div>
              </div>
              <div class="item">
                <div class="item-num">2</div>
                活动期间，活动仅计算完美世界Major 2024已结算的赛事总负盈利，次日24小时内在活动页面点击【点击领取】按钮领取。逾期未领取则视为放弃，彩金5倍流水即可出款；
              </div>
              <div class="item">
                <div class="item-num">3</div>
                任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
              </div>
              <div class="item">
                <div class="item-num">4</div>
                根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
              </div>
              <div class="item">
                <div class="item-num">5</div>
                此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP 地址视为同一账户，若有违规者，将不享受此红利；
              </div>
              <div class="item">
                <div class="item-num">6</div>
                为避免文字理解差异，东赢电竞保留此活动最终解释权；
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
import { getCompetitionLossInit, claimCompetitionLoss, getCompetitionYesterday, claimCompetitionBonus } from "../../../api/index/promo";
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
  claimCompetitionBonus(promoParam.value.betPromoCode)
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
  claimCompetitionLoss(promoParam.value.lossPromoCode)
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
    const res1 = await getCompetitionYesterday(promoParam.value.betPromoCode);
    const res2 = await getCompetitionLossInit(promoParam.value.lossPromoCode);

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
  background: url("../../../assets/images/promotion/hotpromo/dy2-blast-premier/section-bg.png");
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
    color: #ff0000;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 12px;
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
  padding: 20px 12px 12px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .title {
    background-image: url("../../../assets/images/promotion/hotpromo/dy2-blast-premier/info-title.png");
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
      background-image: url("../../../assets/images/promotion/hotpromo/dy2-blast-premier/info-little-title-bg.png");
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
    background: transparent;
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
    background-image: url("../../../assets/images/promotion/hotpromo/dy2-blast-premier/rule-title.png");
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
