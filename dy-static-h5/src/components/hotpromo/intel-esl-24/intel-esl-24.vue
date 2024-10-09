<template>
  <div class="intel-els">
    <div class="intel-els-box">
      <div class="intel-els-tab">
        <div class="intel-els-tab-item" :class="{ active: activeTab === 'first' }" @click="activeTab = 'first'">
          <div class="color-box">IEM 科隆</div>
        </div>
        <div class="intel-els-tab-item" :class="{ active: activeTab === 'second' }" @click="activeTab = 'second'">
          <div class="color-box">IEM 里约</div>
        </div>
      </div>
      <div class="intel-els-first-container" v-if="activeTab === 'first'">
        <div class="intel-els-fisrt-title"></div>
        <div class="intel-els-team-box"></div>
        <table class="intel-els-table">
          <thead>
            <tr style="border-top: 2px solid">
              <th>IEM 达拉斯总有效投注</th>
              <th>开赛金</th>
              <th>奖金派发时间</th>
              <th>奖金派发形式</th>
              <th>奖金流水</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥3,000</td>
              <td>8 元</td>
              <td rowspan="2">IEM 科隆开赛日</td>
              <td rowspan="2">自动派发</td>
              <td rowspan="2">3 倍不限场馆</td>
            </tr>
            <tr>
              <td>≥10,000</td>
              <td>58 元</td>
            </tr>
          </tbody>
        </table>
        <table class="intel-els-table">
          <thead>
            <tr style="border-top: 2px solid">
              <th>有效投注</th>
              <th>投注嘉奖</th>
              <th>东赢专属金</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥1,000</td>
              <td>8 元</td>
              <td>10 元</td>
            </tr>
            <tr>
              <td>≥5,000</td>
              <td>18 元</td>
              <td>38 元</td>
            </tr>
            <tr>
              <td>≥10,000</td>
              <td>58 元</td>
              <td>88 元</td>
            </tr>
            <tr>
              <td>≥30,000</td>
              <td>88 元</td>
              <td>108 元</td>
            </tr>
            <tr>
              <td>≥50,000</td>
              <td>188 元</td>
              <td>328 元</td>
            </tr>
            <tr>
              <td>≥100,000</td>
              <td>328 元</td>
              <td>588 元</td>
            </tr>
            <tr>
              <td>≥200,000</td>
              <td>588 元</td>
              <td>888 元</td>
            </tr>
            <tr>
              <td>≥500,000</td>
              <td>1,088 元</td>
              <td>1,588 元</td>
            </tr>
            <tr>
              <td>≥1,000,000</td>
              <td>1,888 元</td>
              <td>2,188 元</td>
            </tr>
          </tbody>
        </table>
        <div class="intel-els-activities">
          例：
          <br />
          1.会员A：今年历史投注IEM达拉斯总有效投注为5,000元，在IEM开赛日可获得8元开赛奖金。
          <br />
          2.会员B：IEM科隆赛事在IM电竞投注5,000元后又在东赢电竞投注IEM赛事投注5,000元，会员B在次日可获东赢专属金38元。
        </div>
        <div class="intel-els-rule-title"></div>
        <div class="intel-els-rule-content">
          <div class="item-content">
            <div class="item-text">
              1.活动开赛当日，会员历史投注IEM达拉斯赛事有效投注≥3000的会员在IEM科隆赛事开赛当日可获得对应开赛奖金，彩金于次日24小时内派发；
            </div>
          </div>
          <div class="item-content">
            <div class="item-text">
              2.活动期间，投注IEM科隆赛事有效≥1,000元或以上可获得对应投注嘉奖，若在东赢电竞场馆进行投注IEM科隆赛事可获更高奖励金额。
              <br />
              注：奖金不叠加派发，奖金按最高档位每日派发一次。
            </div>
          </div>
          <div class="item-content">
            <div class="item-text">
              3.开赛金于IEM科隆开赛次日24小时内派发。投注嘉奖与东赢专属金彩金于次日24小时内派发，彩金3倍流水即可提款；
            </div>
          </div>
          <div class="item-content">
            <div class="item-text">
              4.任何低于欧洲盘 1.7 或亚洲盘 0.7
              水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
            </div>
          </div>
          <div class="item-content">
            <div class="item-text">
              5.根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
            </div>
          </div>
          <div class="item-content">
            <div class="item-text">
              6.此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
              地址视为同一账户，若有违规者，将不享受此红利；
            </div>
          </div>
          <div class="item-content">
            <div class="item-text">7.为避免文字理解差异，本站保留此活动最终解释权；</div>
          </div>
        </div>
      </div>
      <div class="intel-els-second-container" v-if="activeTab === 'second'">
        <div class="intel-els-second-title"></div>
        <table class="intel-els-table">
          <thead>
            <tr style="border-top: 2px solid">
              <th rowspan="2">有效投注</th>
              <th rowspan="2">投注嘉奖</th>
              <th colspan="2">奖上奖</th>
            </tr>
            <tr>
              <th>IEM 达拉斯总有效投注≥5,000</th>
              <th>IEM 科隆总有效投注≥5,000</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥1,000</td>
              <td>5 元</td>
              <td>5 元</td>
              <td>5 元</td>
            </tr>
            <tr>
              <td>≥5,000</td>
              <td>12 元</td>
              <td>8 元</td>
              <td>8 元</td>
            </tr>
            <tr>
              <td>≥10,000</td>
              <td>58 元</td>
              <td>18 元</td>
              <td>18 元</td>
            </tr>
            <tr>
              <td>≥30,000</td>
              <td>88 元</td>
              <td>28 元</td>
              <td>28 元</td>
            </tr>
            <tr>
              <td>≥50,000</td>
              <td>188 元</td>
              <td>58 元</td>
              <td>58 元</td>
            </tr>
            <tr>
              <td>≥100,000</td>
              <td>328 元</td>
              <td>108 元</td>
              <td>108 元</td>
            </tr>
            <tr>
              <td>≥200,000</td>
              <td>588 元</td>
              <td>218 元</td>
              <td>218 元</td>
            </tr>
            <tr>
              <td>≥500,000</td>
              <td>1,088 元</td>
              <td>388 元</td>
              <td>388 元</td>
            </tr>
            <tr>
              <td>≥1,000,000</td>
              <td>1,888 元</td>
              <td>588 元</td>
              <td>588 元</td>
            </tr>
          </tbody>
        </table>

        <div class="intel-els-notice">
          注：会员参与 IEM 达拉斯与 IEM 科隆每个赛事的总有效投注≥3000 元，参与 IEM
          里约赛事每日符合对应有效投注可获得对应的加赠金；
        </div>
        <div class="intel-els-activities">
          例：
          <br />
          1.会员A：今年历史投注IEM达拉斯赛事有效投注6,000元，IEM科隆有效投注10,000元后，IEM里约赛事开赛当日投注≥5,000元，会员在次日可获得12+8+8=28元
          <br />
          2.会员B：今年历史投注IEM科隆30,000元，IEM里约赛事开塞当日投注10,000元，会员B在次日可获得58+18=76元。
        </div>
        <div class="intel-els-rule-title"></div>
        <div class="intel-els-rule-content">
          <div class="item-content">
            <div class="item-text">
              1.活动期间，会员IEM里约赛事有效投注≥1,000元可获对应档位投注嘉奖彩金，若会员今年历史投注IEM科隆赛事与IEM达拉斯赛事有效投注分别都≥5,000元，可分别在活动对应档位奖上奖彩金；
            </div>
          </div>
          <div class="item-content">
            <div class="item-text">2.活动与次日24小时内派发，彩金3倍流水即可提款；</div>
          </div>
          <div class="item-content">
            <div class="item-text">
              3.任何低于欧洲盘 1.7 或亚洲盘 0.7
              水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
            </div>
          </div>
          <div class="item-content">
            <div class="item-text">
              4.根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
            </div>
          </div>
          <div class="item-content">
            <div class="item-text">
              5.此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
              地址视为同一账户，若有违规者，将不享受此红利；
            </div>
          </div>
          <div class="item-content">
            <div class="item-text">6.为避免文字理解差异，本站保留此活动最终解释权；</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { getLplSummer24Match } from "../../../api/index/promo.js";
import moment from "moment";
import { useLocalStorage } from "@vueuse/core";

const activeTab = ref("first");
const matchList = ref([]);
const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
</script>

<style scoped lang="scss">
.intel-els {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-bottom: 8px;
  background-color: #1d1d1e;
  .intel-els-background-img {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1074px;
    background-image: url("../../../assets/promo/intel-esl-24/background-img.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .intel-els-box {
    width: 100%;
    padding: 0px 0px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
.intel-els-tab {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
  max-width: 350px;
}
.intel-els-tab-item {
  font-family: FZHanZhenGuangBiaoS-GB;
  font-size: 22px;
  font-weight: 400;
  line-height: 39.71px;
  margin-top: 10px;
  background-image: url("../../../assets/promo/intel-esl-24/inactive.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  max-width: 200px;
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .color-box {
    height: 48px;
    background: linear-gradient(180deg, #ffdaa6 0%, #ffffff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
/* .color-box {
    height: 48px;
    background: linear-gradient(180deg, #ffdaa6 0%, #ffffff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  } */
.active {
  background-image: url("../../../assets/promo/intel-esl-24/active.png");
  .color-box {
    height: 48px;
    background: linear-gradient(180deg, #fcbf11 0%, #ffdaa6 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.intel-els-first-container {
  width: 100%;
  padding: 0px 16px;
  height: 100%;
  background-color: #1d1d1e;
  .intel-els-fisrt-title {
    width: 50%;
    height: 48px;
    background-image: url("../../../assets/promo/intel-esl-24/title.png");
    background-repeat: no-repeat;
    background-size: contain;
    margin-bottom: 10px;
  }
  .intel-els-rule-title {
    width: 50%;
    height: 48px;
    background-image: url("../../../assets/promo/intel-esl-24/rule.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    margin-bottom: 28px;
  }

  .intel-els-team-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .intel-els-game-team {
      width: 100%;
      height: 110px;
      background-image: url("../../../assets/promo/intel-esl-24/team-back.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 20px;
      .intel-els-game-team-item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .intel-els-game-team-icon {
          width: 50px;
          height: 50px;
        }
        .intel-els-game-team-name {
          font-size: 16px;
          font-weight: 400;
          line-height: 24.82px;
          color: #fff;
        }
      }

      .intel-els-info {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .vs-icon {
          width: 60px;
          height: 60px;
          background-image: url("../../../assets/promo/intel-esl-24/vs.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        .vs-time {
          color: #aeafa2;
          margin-top: 5px;
          font-size: 18px;
          font-weight: 400;
          line-height: 25.4px;
        }
      }
    }
  }

  .intel-els-activities {
    font-size: 16px;
    // font-weight: 400;
    // line-height: 25.4px;
    // color: #fdffe9;
    padding: 10px;
    // border: 3px solid #3d3d3d;
    // margin-bottom: 27px;
    color: #fece94;
  }

  :deep(.intel-els-table) {
    width: 100%;
    height: 100%;
    text-align: center;
    vertical-align: middle;
    font-size: 14px;
    font-weight: 400;
    line-height: 25.4px;
    border-collapse: collapse;
    border: 1px solid #ffdba633;
    margin-bottom: 16px;
    thead {
      color: #f8e1a3;
      background: rgba(51, 56, 64, 1);
      tr {
        height: 41px;
        th {
          border: 1px solid #ffdba633;
          background: #333840 !important;
        }
      }
    }
    tbody {
      color: #c2c2c2 !important;
      background: #202427 !important;
      tr {
        height: 41px;
        td {
          border: 1px solid #ffdba633 !important;
          background: #202427 !important;
        }
      }
    }
  }

  .winning-bonus,
  .reversal-bonus {
    font-size: 18px;
    font-weight: 400;
    line-height: 25.4px;
    color: #fdffe9;
    border: 3px solid #3d3d3d;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    justify-content: flex-start;
    .title {
      width: 25%;
      height: 100%;
      background: linear-gradient(90deg, #ff4d00 0%, #ffc700 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #381800;
      font-family: Microsoft YaHei UI;
      font-weight: 700;
    }
    .content {
      width: 75%;
      padding: 25px;
    }
  }

  .intel-els-example {
    font-size: 16px;
    font-weight: 400;
    line-height: 25.4px;
    color: #fdffe9;
    padding: 16px 24px;
    border: 3px solid #3d3d3d;
    margin-bottom: 28px;
  }

  .intel-els-rule-content {
    border-top: 3px solid #ffe1b7;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    .item-content {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      width: 100%;
      font-size: 16px;
      .item-icon-box {
        display: flex;
        align-items: flex-start;
        height: 100%;
        padding-top: 10px;
      }
      .item-icon {
        width: 12px;
        height: 12px;
        background-image: url("../../../assets/promo/intel-esl-24/rule-icon.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-right: 10px;
      }
      .item-text {
        font-weight: 400;
        line-height: 25.4px;
        color: #c2c2c2;
      }
    }
  }
}

.intel-els-second-container {
  width: 100%;
  height: 100%;
  background-color: #1d1d1e;
  padding: 0 16px;
  .intel-els-second-title {
    width: 50%;
    height: 48px;
    background-image: url("../../../assets/promo/intel-esl-24/title.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    margin-bottom: 29px;
  }
  .intel-els-activities {
    font-size: 16px;
    // font-weight: 400;
    // line-height: 25.4px;
    // color: #fdffe9;
    // padding: 10px;
    // border: 3px solid #3d3d3d;
    // margin-bottom: 27px;
    color: #fece94;
  }
  .intel-els-table {
    width: 100%;
    height: 100%;
    text-align: center;
    vertical-align: middle;
    font-size: 16px;
    font-weight: 400;
    line-height: 25.4px;
    border-collapse: collapse;
    border: 1px solid #ffdba633;
    margin-bottom: 16px;
    thead {
      color: #f8e1a3;
      background-color: rgba(51, 56, 64, 1) !important;

      tr {
        height: 41px;
        background: rgba(32, 36, 39, 1);

        th {
          background: #333840 !important;
          border: 1px solid #ffdba633;
        }
      }
    }
    tbody {
      color: #c2c2c2 !important;
      tr {
        height: 41px;
        td {
          border: 1px solid #ffdba633 !important;
          background: #202427 !important;
        }
      }
    }
  }
  .special-discounts-rebates {
    height: 40px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 25px;
    .line {
      width: 100%;
      height: 1px;
      background: #373737;
    }
    .title {
      width: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
      line-height: 35.56px;
      background-color: #1d1d1e;
      color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .intel-els-notice {
    font-size: 16px;
    font-weight: 400;
    line-height: 25.4px;
    color: #fece94;
    padding: 16px 0px;
    margin-bottom: 17px;
    margin-bottom: 0px;
  }

  .intel-els-rule-title {
    width: 50%;
    height: 48px;
    background-image: url("../../../assets/promo/intel-esl-24/rule.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    margin-bottom: 28px;
  }

  .intel-els-rule-content {
    border-top: 3px solid #ffe1b7;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    .item-content {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      width: 100%;
      font-size: 16px;
      .item-icon-box {
        display: flex;
        align-items: flex-start;
        height: 100%;
        padding-top: 10px;
      }
      .item-icon {
        width: 12px;
        height: 12px;
        background-image: url("../../../assets/promo/intel-esl-24/rule-icon.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-right: 10px;
      }
      .item-text {
        font-weight: 400;
        line-height: 25.4px;
        color: #c2c2c2;
      }
    }
  }
}
</style>
