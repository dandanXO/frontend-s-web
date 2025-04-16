<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="tab-wrapper">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab"
          :class="{ active: tabValue === index }"
          @click="tabValue = index"
        >
          {{ tab }}
        </div>
      </div>

      <img class="livepoker-rebate-banner" src="@/assets/images/promotion/hotpromo/yu-e-bao/banner.png" @click="handleBannerClick" />

      <template v-if="tabValue === 0">
        <div>
          <div class="livepoker-rebate-game-info section-bg">
            <div class="title-wrapper">
              <img src="@/assets/images/promotion/hotpromo/yu-e-bao/title-img-left.png" />
              <span>余额宝2.0</span>
              <img src="@/assets/images/promotion/hotpromo/yu-e-bao/title-img-right.png" />
            </div>
            <img src="@/assets/images/promotion/hotpromo/yu-e-bao/stress-content.png" />
            <div class="little-title">
              <div class="ribbon">活动时间</div>
              <div class="right bold">2025.5.1-永久</div>
            </div>
            <div class="little-title">
              <div class="ribbon">活动会员</div>
              <div class="right bold">VIP1及以上且余额≥100元的全网会员</div>
            </div>
            <div class="little-title">
              <div class="ribbon">活动内容</div>
              <div class="right">
                雷火余额宝，“余”热来袭，互“利”全球，雷火余额宝是一种资金增值服务产品，中心钱包余额可获得利息收入，对比传统的理财产品，以支付宝为例，年利率只有1.5-2%，利率浮动较小且部分公司产品赎回还有T+1限制，雷火余额宝可随时随地转入和转出资金，年化利率最高12%，收益天天算，想用随时取～
              </div>
            </div>
          </div>

          <div class="livepoker-rebate-game-bottom-rule section-bg">
            <div class="title-wrapper">
              <img src="@/assets/images/promotion/hotpromo/yu-e-bao/title-img-left.png" />
              <span>余额宝常见问题解析</span>
              <img src="@/assets/images/promotion/hotpromo/yu-e-bao/title-img-right.png" />
            </div>
            <br />
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                <div class="item-desc">
                  <div>我怎么样才算参加了余额宝活动呢?​</div>
                  <div class="hint">您只需要中心钱包有额度，点击余额宝利息页面，就会激活余额宝活动。​</div>
                </div>
              </div>
              <div class="item">
                <div class="item-num">2</div>
                <div class="item-desc">
                  <div>余额宝的利息是怎么计算，什么时候派发呢?​</div>
                  <div class="hint">
                    余额宝利息计算:当前年利率/365*中心钱包额度（例如︰中心钱包额度10000，第三日可领取利息:12%/365*10000=3.28元)利息派发时间:当您将余额宝任务激活后，第二天就会开始统计您的利息，第三天将会派发第一天的利息，以此类推哦。​
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="item-num">3</div>
                <div class="item-desc">
                  <div>余额宝的利率是会变化的吗?</div>
                  <div class="hint">
                    会的，根据您的存款额度和有效投注，利率会增加和降低的。利率增加︰当您的存款或者有效投注达到相应的要求，利率则会提升，而且会跳级增加的哦。利率降低:当您长时间无存款记录和有效投注，您的利率会降低哦。​
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="item-num">4</div>
                <div class="item-desc">
                  <div>余额宝里的钱会冻结吗?</div>
                  <div class="hint">
                    不会冻结的，余额宝里面的资金可以随时转到中心钱包进行游戏或取款，没有任何限制的哦。
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="item-num">5</div>
                <div class="item-desc">
                  <div>余额宝转入额度有最高限额吗?</div>
                  <div class="hint">
                    没有限制，但如果日利息低于0.01元是不计算利息的哦。​
                    <br />
                    注∶日利率收益=当日计息金额结余*(年利率/365)次日结算。例如:(会员5月1日转入10000元至余额宝，5月2日这10000元为计息金额，5月3日则可以领取收益，以此类推。但如果会员在5月2日又转入5000元至余额宝，然后又转出6000元，计息则优先扣除5000元待确认金额，再扣掉计息金额1000元，则5月3日应领取收益=9000*(年利率/365)。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="tabValue === 1">
        <div class="livepoker-rebate-game-info section-bg">
          <div class="title-wrapper">
            <img src="@/assets/images/promotion/hotpromo/yu-e-bao/title-img-left.png" />
            <span>获得利息攻略</span>
            <img src="@/assets/images/promotion/hotpromo/yu-e-bao/title-img-right.png" />
          </div>

          <div class="content-wrapper">
            <div class="content-block">
              <div class="sub-title">一、「余额宝」界面功能说明</div>
              <div class="with-step">
                <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-interest-1.png" />
                <img
                  class="tutorial-img interest-1-step-1"
                  src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-interest-1-step-1.png"
                />
                <img
                  class="tutorial-img interest-1-step-2"
                  src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-interest-1-step-2.png"
                />
                <img
                  class="tutorial-img interest-1-step-3"
                  src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-interest-1-step-3.png"
                />
              </div>
            </div>
            <div class="content-block">
              <div class="sub-title">二、「余额宝钱包」利息激活</div>
              <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-interest-2.png" />
              <div class="tutorial-desc">1.打开首页-登录账号-点击右上角我的头像</div>
              <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-interest-3.png" />
              <div class="tutorial-desc">2.点击余额宝</div>
              <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-interest-4.png" />
              <div class="tutorial-desc">3.进入余额宝利息界面有余额即可激活，利息将自动发放至中心钱包</div>
            </div>
            <div class="content-block">
              <div class="hint">(本活动目前仅支持VIP1及以上且中心钱包余额大于等于100的会员)</div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="tabValue === 2">
        <div class="livepoker-rebate-game-info section-bg">
          <div class="title-wrapper">
            <img src="@/assets/images/promotion/hotpromo/yu-e-bao/title-img-left.png" />
            <span>领取任务教程</span>
            <img src="@/assets/images/promotion/hotpromo/yu-e-bao/title-img-right.png" />
          </div>

          <div class="content-wrapper">
            <div class="content-block">
              <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-mission-1.png" />
              <div class="tutorial-desc">1.打开雷火官网，点击账号头像区域</div>
              <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-mission-2.png" />
              <div class="tutorial-desc">
                2.点击「
                <span class="blue">转账</span>
                」-「
                <span class="blue">一键回收</span>
                」
              </div>
              <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-mission-3.png" />
              <div class="tutorial-desc">
                3.点击「
                <span class="blue">余额宝</span>
                」选择您要参加的余额宝任务，点击「
                <span class="blue">开启</span>
                」
              </div>
              <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-mission-4.png" />
              <div class="tutorial-desc">
                提示：若进入余额宝后，未显示任何余额宝任务则说明您的中心钱包金额低于活动最低档位
              </div>
              <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-mission-5.png" />
              <div class="tutorial-desc">
                4.点击「
                <span class="blue">立即开启</span>
                」，即可开启您的余额宝任务
              </div>
              <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-mission-6.png" />
              <div class="tutorial-desc">5.在此界面可以查看任务的完成情况内容</div>
            </div>
            <div class="content-block">
              <div class="hint">(本活动目前仅支持VIP1及以上且中心钱包余额大于等于100的会员)</div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="tabValue === 3">
        <div class="livepoker-rebate-game-info section-bg">
          <div class="title-wrapper">
            <img src="@/assets/images/promotion/hotpromo/yu-e-bao/title-img-left.png" />
            <span>领取奖金教程</span>
            <img src="@/assets/images/promotion/hotpromo/yu-e-bao/title-img-right.png" />
          </div>

          <div class="content-wrapper">
            <div class="content-block">
              <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-prize-1.png" />
              <div class="tutorial-desc">1.打开雷火官网，点击账号头像区域</div>
              <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-prize-2.png" />
              <div class="tutorial-desc">
                2.点击「
                <span class="blue">余额宝</span>
                」；在「
                <span class="blue">领取记录</span>
                」中选择「
                <span class="blue">待领取</span>
                」
              </div>
              <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-prize-3.png" />
              <div class="tutorial-desc">
                3.找到对应彩金，点击「
                <span class="blue">立即领取</span>
                」
              </div>
              <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-prize-4.png" />
              <div class="tutorial-desc">
                4.点击「
                <span class="blue">立即开启</span>
                」，即可开启您的余额宝任务
              </div>
              <img class="tutorial-img" src="@/assets/images/promotion/hotpromo/yu-e-bao/tutorial-prize-5.png" />
              <div class="tutorial-desc">5.在此界面可以查看任务的完成情况内容</div>
            </div>
            <div class="content-block">
              <div class="hint">(本活动目前仅支持VIP1及以上且中心钱包余额大于等于100的会员)</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const tabs = ref(["余额宝2.0", "获得利息攻略", "领取任务教程", "领取奖金教程"]);
const tabValue = ref(0);

const handleBannerClick = () => {
  router.push("/center/balance-interest-plan");
};
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

.livepoker-rebate-banner {
  max-width: 100%;
  border-radius: 12px;
  margin-top: 40px;
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
    padding: 30px 40px;
  }

  .livepoker-rebate-section-right {
    margin-top: auto;
    margin-bottom: 30px;
    margin-right: 100px;
    width: 200px;

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
    color: #ff3333;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 16px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff3333;
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
    align-items: flex-start;
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

      .item-desc {
        display: flex;
        flex-direction: column;
        color: #ff0000;

        .hint {
          font-size: 18px;
          font-weight: 400;
          line-height: 22.4px;
          color: #000;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 4px;
        }
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

.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  margin-bottom: 20px;

  > * {
    margin-right: 16px;
  }

  :last-child {
    margin-right: 0;
  }

  img {
    max-width: 303px;
  }

  span {
    font-size: 35px;
    color: #4c4c6c;
    font-weight: bold;
    letter-spacing: 3px;
  }
}

.content-wrapper {
  margin: 0 auto;
  max-width: 720px;

  .content-block {
    margin-bottom: 40px;
    .sub-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #468cff;
      text-align: center;
    }
    .tutorial-img {
      display: block;
      max-width: 100%;
      margin-bottom: 8px;
    }
    .tutorial-desc {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
      .blue {
        color: #468cff;
      }
    }
    .hint {
      font-size: 16px;
      font-weight: 600;
      color: #666666;
      text-align: center;
    }
    .with-step {
      position: relative;
      .interest-1-step-1 {
        position: absolute;
        top: 46px;
        left: -184px;
        max-width: 426px;
      }
      .interest-1-step-2 {
        position: absolute;
        top: 86px;
        right: -216px;
        max-width: 342px;
      }
      .interest-1-step-3 {
        position: absolute;
        top: -44px;
        right: -184px;
        max-width: 310px;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.dark {
  .livepoker-rebate-game-bottom-rule {
    .content {
      .item {
        .item-desc {
          .hint {
            color: #fff;
          }
        }
      }
    }
  }
  .title-wrapper {
    span {
      color: #fff;
    }
  }
}
</style>
