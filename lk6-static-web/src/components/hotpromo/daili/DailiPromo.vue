<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-game-info">
        <div class="title"></div>
        <div class="little-title">
          <div class="left">活动时间</div>
          <div class="right">永久</div>
        </div>
        <div class="little-title">
          <div class="left">活动内容</div>
          <div class="right">全民代理强势上线，创造财富从这里开始，0 费用 0 风险 0 投资，月入百万不是梦，与您携手共进</div>
        </div>

        <div class="daili-promo-block detail-block">
          <div class="detail-block-title">
            <img src="@/components/hotpromo/officialGift/img/gift.svg" />
            <span>聊天软件下载：<span style="color: #0092ff; text-decoration: underline;">Amico</span></span>
          </div>
          <div class="detail-block-content">
            <span class="detail-block-content-description">添加以下雷火官方客服：申请代理、特权奖金</span>
            <div class="detail-block-content-voxis">
              <img src="@/components/hotpromo/officialGift/img/voxis.svg" />
              <span class="detail-block-content-voxis__url">Amico 客服号：{{ paramsObj.voxis_url_1 }}</span>
              <button class="detail-block-content-voxis__btn" @click="() => handleCopyClick(paramsObj.voxis_url_1)">复制</button>
              <span class="detail-block-content-voxis__url">{{ paramsObj.voxis_url_2 }}</span>
              <button class="detail-block-content-voxis__btn" @click="() => handleCopyClick(paramsObj.voxis_url_2)">复制</button>
            </div>
            <div class="detail-block-content-voxis">
              <img src="@/components/hotpromo/officialGift/img/voxis.svg" />
              <span class="detail-block-content-voxis__url">特权奖金联系方式：{{ paramsObj.voxis_id_1 }}</span>
              <button class="detail-block-content-voxis__btn" @click="() => handleCopyClick(paramsObj.voxis_id_1)">复制</button>
            </div>
            <div class="detail-block-content-voxis">
              <img src="@/components/hotpromo/officialGift/img/voxis.svg" />
              <span class="detail-block-content-voxis__url">申请代理联系方式：{{ paramsObj.voxis_id_2 }}</span>
              <button class="detail-block-content-voxis__btn" @click="() => handleCopyClick(paramsObj.voxis_id_2)">复制</button>
            </div>
            <img class="detail-block-content-suffix" src="@/components/hotpromo/officialGift/img/detail-block-suffix.png" />
          </div>
        </div>
        
        <div class="detail-block-title">
          <img src="@/components/hotpromo/officialGift/img/gift.svg" />
          <span>全民代理方案</span>
        </div>
        <table class="livepoker-rebate-game-info-table">
          <thead>
            <tr>
              <th rowspan="2">当日有效会员</th>
              <th rowspan="2">当日有效投注</th>
              <th colspan="3">日结流水返佣比例</th>
              <th rowspan="2">投注时间</th>
            </tr>
            <tr>
              <th>电子/棋牌/捕鱼</th>
              <th>视讯/彩票</th>
              <th>体育/电竞</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="4">≥2</td>
              <td>≥1</td>
              <td>0.05%</td>
              <td rowspan="4">0.01%</td>
              <td>0.10%</td>
              <td rowspan="16">北京时间每日 0 点—23 点 59 分</td>
            </tr>
            <tr>
              <td>≥20,000</td>
              <td>0.10%</td>
              <td>0.15%</td>
            </tr>
            <tr>
              <td>≥30,000</td>
              <td>0.15%</td>
              <td>0.20%</td>
            </tr>
            <tr>
              <td>≥50,000</td>
              <td>0.20%</td>
              <td>0.25%</td>
            </tr>
            <tr>
              <td rowspan="4">≥5</td>
              <td>≥1</td>
              <td>0.10%</td>
              <td rowspan="4">0.05%</td>
              <td>0.15%</td>
            </tr>
            <tr>
              <td>≥20,000</td>
              <td>0.15%</td>
              <td>0.20%</td>
            </tr>
            <tr>
              <td>≥30,000</td>
              <td>0.20%</td>
              <td>0.25%</td>
            </tr>
            <tr>
              <td>≥50,000</td>
              <td>0.25%</td>
              <td>0.30%</td>
            </tr>
            <tr>
              <td rowspan="4">≥10</td>
              <td>≥1</td>
              <td>0.15%</td>
              <td rowspan="4">0.10%</td>
              <td>0.20%</td>
            </tr>
            <tr>
              <td>≥20,000</td>
              <td>0.20%</td>
              <td>0.25%</td>
            </tr>
            <tr>
              <td>≥30,000</td>
              <td>0.25%</td>
              <td>0.30%</td>
            </tr>
            <tr>
              <td>≥50,000</td>
              <td>0.30%</td>
              <td>0.35%</td>
            </tr>
            <tr>
              <td rowspan="4">≥20</td>
              <td>≥1</td>
              <td>0.20%</td>
              <td rowspan="4">0.15%</td>
              <td>0.30%</td>
            </tr>
            <tr>
              <td>≥200,000</td>
              <td>0.30%</td>
              <td>0.35%</td>
            </tr>
            <tr>
              <td>≥300,000</td>
              <td>0.40%</td>
              <td>0.40%</td>
            </tr>
            <tr>
              <td>≥500,000</td>
              <td>0.50%</td>
              <td>0.50%</td>
            </tr>
          </tbody>
        </table>

        <div class="livepoker-rebate-game-bottom">
          <div class="livepoker-rebate-game-bottom-left-title">
            <div class="livepoker-rebate-game-bottom-left-btn">
              <img src="../../../assets/promo/lh-livepoker-rebate/game-bottom-left-btn.png" alt="" width="22px" />
              <span>注意</span>
            </div>
            <span class="livepoker-rebate-game-bottom-left-detail">当日会员满足存款≥10 元后定义有效活跃会员；如线下用户玩的游戏不同但满足活跃要求情况下，按照各款游戏比例进行分红。</span>
          </div>
        </div>

        <div class="detail-block-title">
          <img src="@/components/hotpromo/officialGift/img/gift.svg" />
          <span>全民代理新增人头费</span>
        </div>
        <table class="livepoker-rebate-game-info-table">
          <thead>
            <tr>
              <th>新增人数</th>
              <th>活动要求</th>
              <th>单个奖励彩金</th>
              <th>彩金流水</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1-10 人</td>
              <td rowspan="3">单个客户单月内充值 3 次且存款总额≥1000</td>
              <td>58 元</td>
              <td rowspan="3">1 倍</td>
            </tr>
            <tr>
              <td>11-25 人</td>
              <td>108 元</td>
            </tr>
            <tr>
              <td>26 人以上</td>
              <td>188 元</td>
            </tr>
          </tbody>
        </table>

        <div class="livepoker-rebate-game-bottom">
          <div class="livepoker-rebate-game-bottom-left-title">
            <div class="livepoker-rebate-game-bottom-left-btn">
              <img src="../../../assets/promo/lh-livepoker-rebate/game-bottom-left-btn.png" alt="" width="22px" />
              <span>注意</span>
            </div>
            <span class="livepoker-rebate-game-bottom-left-detail">若满足当日线下会员≥1 且返利金≥10 元，可以联系在线客服申请，每天限定 100 名（领取时间：当日 18:00-次日 18:00），领取时间保留【72 小时】，逾期作废，请多加关注信息通知~</span>
          </div>
        </div>

        <div class="livepoker-rebate-game-bottom">
          <div class="livepoker-rebate-game-bottom-left-title">
            <div class="livepoker-rebate-game-bottom-left-btn">
              <img src="../../../assets/promo/lh-livepoker-rebate/game-bottom-left-btn.png" alt="" width="22px" />
              <span>注意</span>
            </div>
            <span class="livepoker-rebate-game-bottom-left-detail">代理申请咨询：北京时间中午 12:00 至 22:00，其余时间咨询 24 小时在线客服进行咨询。</span>
          </div>
        </div>

        <div class="detail-block-title">
          <img src="@/components/hotpromo/officialGift/img/gift.svg" />
          <span>代理特权</span>
        </div>
        <table class="livepoker-rebate-game-info-table">
          <thead>
            <tr>
              <th>赠送对象</th>
              <th>下级当日累计存款</th>
              <th>特权彩金</th>
              <th>彩金流水</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="4">当天有效活跃会员</td>
              <td>500 元+</td>
              <td>8元/人</td>
              <td rowspan="4">1倍/不限场馆</td>
            </tr>
            <tr>
              <td>1,000 元+</td>
              <td>18元/人</td>
            </tr>
            <tr>
              <td>5,000 元+</td>
              <td>58元/人</td>
            </tr>
            <tr>
              <td>10,000 元+</td>
              <td>88元/人</td>
            </tr>
          </tbody>
        </table>

        <div class="livepoker-rebate-game-bottom">
          <div class="livepoker-rebate-game-bottom-left-title">
            <div class="livepoker-rebate-game-bottom-left-btn">
              <img src="../../../assets/promo/lh-livepoker-rebate/game-bottom-left-btn.png" alt="" width="22px" />
              <span>注意</span>
            </div>
            <span class="livepoker-rebate-game-bottom-left-detail">若满足当日线下会员≥1 且返利金≥10 元，可以联系在线客服申请，每天限定 100 名（领取时间：当日 18:00-次日 18:00），领取时间保留【72 小时】，逾期作废，请多加关注信息通知~</span>
          </div>
        </div>

        <div class="voxis-wrapper" style="display:none;">
          <span>
            聊天软件下载：
            <a :href="paramsObj.voxis_url" target="_blank">Amico</a>
          </span>
          <span>申请代理联系方式：添加专员 Amico：{{ paramsObj.voxis_id_1 }}</span>
          <span>特权奖金联系方式：添加专员 Amico：{{ paramsObj.voxis_id_2 }}</span>
        </div>
      </div>

      <div class="livepoker-rebate-game-bottom-rule">
        <div class="title"></div>
        <div class="content">
          <div class="item">
            <div class="item-num">1</div>
            活动期间内审核合营伙伴线下会员的真实性，如发现虚假会员或恶意套取彩金违规行为，我司有权取消其活动资格并没收彩金金额。
          </div>
          <div class="item">
            <div class="item-num">2</div>
            全民代理满足当日两个有效活跃会员方可生成返利金，同时满足领取条件。
          </div>
          <div class="item">
            <div class="item-num">3</div>
            当日有效会员未达门槛的全民代理，系统则不自动累积计算有效投注，次日重新开始计算。
          </div>
          <div class="item">
            <div class="item-num">4</div>
            每日递增比例，需要相应的有效会员同时达到相同的有效投注门槛，方可获得更高一层返利比例的返利金额。
          </div>
          <div class="item">
            <div class="item-num">5</div>
            有效会员达标，相对应有效投注未完成，按照此门槛，最低返利比例生成返利金额。例如：代理 A 线下会员 b，c，d，当日有有效投注分别是 b：15,000，c：9,999，d：500，那么返利金额则按照总有效投注的 0.1% 计算。
          </div>
          <div class="item">
            <div class="item-num">6</div>
            返利领取时间，北京时间每日 09:30 后领取。
          </div>
          <div class="item">
            <div class="item-num">7</div>
            代理人头费彩金将在当日审核后，24 小时内派发至合营伙伴游戏账号优惠余额中自行领取。
          </div>
          <div class="item">
            <div class="item-num">8</div>
            会员必须是真实有需要玩家，如发现有利用我司平台进行，刷水，套利，洗黑钱等行为，我司有权终止其全民代理合作，并不予发放、返利金。
          </div>
          <div class="item">
            <div class="item-num">9</div>
            如遇不可抗拒或超出控制范围的因素，本站有权在无事先通知的情况下对活动进行修改、停止、取消或禁止的行为，并不承担任何责任。
          </div>
          <div class="item">
            <div class="item-num">10</div>
            活动最终解释权归本站所有。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { writeClipboard } from "@/utils/clipboard";

const props = defineProps({
  params: String
});

const paramsObj = computed(() => {
  try {
    return JSON.parse(props.params);
  } catch (e) {
    return {};
  }
});

const handleCopyClick = (value) => writeClipboard(value);
</script>

<style scoped lang="scss">
.dark {
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
    .livepoker-rebate-game-bottom-left-detail {
      color: white;
    }
  }

  .livepoker-rebate-game-info {
    width: 100%;
    height: 100%;
    margin-top: 40px;
    background: linear-gradient(178.46deg, #2D4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);
    border-radius: 12px;
    padding: 40px;
    border: 1px solid #acd4f6;
    box-shadow: 0px 0px 4px 0px #01497b0f;
    display: flex;
    flex-direction: column;
    // align-items: center;
    gap: 20px;

    .title {
      background-image: url("../../../assets/promo/lh-livepoker-rebate/info-title-dark.png");
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
        background-image: url("../../../assets/promo/lh-livepoker-rebate/info-little-title-bg-dark.png");
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
        color: white;
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
    thead {
      background: linear-gradient(180deg, #597ADF 0%, #3C5EC3 100%);
      box-shadow: 0px 8px 9px 0px #FFFFFF40 inset, 0px 4px 4px 0px #FFFFFF40 inset, 0px -4px 4px 0px #FFFFFF40 inset;

      tr:first-child {
        th {
          &:first-child {
            border-top-left-radius: 12px;
          }
          &:last-child {
            border-top-right-radius: 12px;
          }
        }
      }
    }
    th {
      height: 56px;
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      border: 0.5px solid #acd4f6;
      color: #fff;
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
      color: white;
    }
  }

  .livepoker-rebate-game-bottom-rule {
    width: 100%;
    height: 100%;
    margin-top: 40px;
    background: linear-gradient(178.46deg, #2D4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);
    border-radius: 12px;
    padding: 40px;
    border: 1px solid #acd4f6;
    box-shadow: 0px 0px 4px 0px #01497b0f;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      background-image: url("../../../assets/promo/lh-livepoker-rebate/rule-title-dark.png");
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
      color: #FFFFFF;
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
          background: linear-gradient(180deg, #597ADF 0%, #3C5EC3 100%);
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

  .voxis-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;
  }

  .daili-promo-block {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: transparent;

    .daili-promo-block-title {
      max-width: 966px;
      margin: 0 auto;
      // background: url(@/components/hotpromo/officialGift/img/block-title-bg.png) no-repeat;
      // background-size: contain;
      // aspect-ratio: 966 / 44;
      // margin: 0 auto;
      // font-size: 32px;
      // font-weight: 400;
      // line-height: 44px;
      // text-align: center;
      // color: #4c4c6c;
    }
  }

  .detail-block-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;

    img {
      width: 32px;
    }

    span {
      font-size: 24px;
      font-weight: 600;
      line-height: 33.6px;
    }
  }

  .detail-block {
    .detail-block-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
      padding: 20px;
      background-color: #212B4AE0;
      border-radius: 12px;

      .detail-block-content-description {
        font-size: 16px;
        font-weight: 600;
        line-height: 22.4px;
        color: #FFFFFF99;
      }

      .detail-block-content-voxis {
        display: flex;
        align-items: center;
        padding: 12px;
        border-radius: 12px;
        border: 1px solid #acd4f6;
        max-width: 720px;
        color: #0092ff;
        gap: 10px;

        img {
          width: 32px;
          // margin-right: 12px;
        }

        .detail-block-content-voxis__url {
          flex-grow: 1;
          font-size: 20px;
          font-weight: 600;
          line-height: 28px;
        }

        .detail-block-content-voxis__btn {
          background-color: transparent;
          border: 1px solid #0092ff;
          color: #0092FF;
          border-radius: 100px;
          padding: 3px 24px;
          &:hover {
            filter: brightness(0.7);
          }
        }
      }

      .detail-block-content-suffix {
        position: absolute;
        width: 272px;
        bottom: 20px;
        right: 48px;
      }
    }
  }
}
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
  .livepoker-rebate-game-bottom-left-detail {
    color: black;
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
  thead {
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    tr:first-child {
      th {
        &:first-child {
          border-top-left-radius: 12px;
        }
        &:last-child {
          border-top-right-radius: 12px;
        }
      }
    }
  }
  th {
    height: 56px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    border: 0.5px solid #acd4f6;
    color: #fff;
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

.voxis-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  color: #000000;
}

.daili-promo-block {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #f2f8fe;

  .daili-promo-block-title {
    max-width: 966px;
    margin: 0 auto;
    // background: url(@/components/hotpromo/officialGift/img/block-title-bg.png) no-repeat;
    // background-size: contain;
    // aspect-ratio: 966 / 44;
    // margin: 0 auto;
    // font-size: 32px;
    // font-weight: 400;
    // line-height: 44px;
    // text-align: center;
    // color: #4c4c6c;
  }
}

.detail-block-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;

  img {
    width: 32px;
  }

  span {
    font-size: 24px;
    font-weight: 600;
    line-height: 33.6px;
  }
}

.detail-block {
  .detail-block-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    padding: 20px;
    background-color: $color-white;
    border-radius: 12px;

    .detail-block-content-description {
      font-size: 16px;
      font-weight: 600;
      line-height: 22.4px;
      color: #00000099;
    }

    .detail-block-content-voxis {
      display: flex;
      align-items: center;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid #acd4f6;
      max-width: 720px;
      color: #0092ff;
      gap: 10px;

      img {
        width: 32px;
        // margin-right: 12px;
      }

      .detail-block-content-voxis__url {
        flex-grow: 1;
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
      }

      .detail-block-content-voxis__btn {
        background-color: transparent;
        border: 1px solid #0092ff;
        border-radius: 100px;
        padding: 3px 24px;
        &:hover {
          filter: brightness(0.7);
        }
      }
    }

    .detail-block-content-suffix {
      position: absolute;
      width: 272px;
      bottom: 20px;
      right: 48px;
    }
  }
}
</style>
