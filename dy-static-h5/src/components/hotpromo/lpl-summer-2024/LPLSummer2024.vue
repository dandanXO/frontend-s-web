<template>
  <div class="lpl-summer-2024">
    <div class="lpl-summer-2024-background-img"></div>
    <div class="lpl-summer-2024-box">
      <div class="lpl-summer-2024-tab">
        <div class="lpl-summer-2024-tab-item" :class="{ active: activeTab === 'first' }" @click="activeTab = 'first'">
          活动一
        </div>
        <div class="lpl-summer-2024-tab-item" :class="{ active: activeTab === 'second' }" @click="activeTab = 'second'">
          活动二
        </div>
      </div>
      <div class="lpl-summer-2024-first-container" v-if="activeTab === 'first'">
        <div class="lpl-summer-2024-fisrt-title"></div>
        <div class="lpl-summer-2024-team-box">
          <div class="lpl-summer-2024-game-team" v-for="(match, index) in matchList" :key="index">
            <div class="lpl-summer-2024-game-team-item">
              <img class="lpl-summer-2024-game-team-icon" :src="match.teamOneIcon" />
              <div class="lpl-summer-2024-game-team-name">{{ match.teamOne }}</div>
            </div>
            <div class="lpl-summer-2024-info">
              <div class="vs-icon"></div>
              <div class="vs-time">{{ match.matchTime }}</div>
            </div>
            <div class="lpl-summer-2024-game-team-item">
              <img class="lpl-summer-2024-game-team-icon" :src="match.teamTwoIcon" />
              <div class="lpl-summer-2024-game-team-name">{{ match.teamTwo }}</div>
            </div>
          </div>
        </div>
        <div class="lpl-summer-2024-activities">
          活动内容：活动期间，当日LPL夏季赛累计早盘有效投注
          <span>≥1,888元</span>
          且触发特殊事件即可获得彩金。
        </div>
        <table class="lpl-summer-2024-table">
          <thead>
            <tr>
              <th rowspan="2">早盘有效投注</th>
              <th colspan="2">特殊事件及返利彩金</th>
              <th rowspan="2">流水倍数</th>
            </tr>
            <tr>
              <th>完胜奖金</th>
              <th>逆转奖金</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥1,888</td>
              <td>18</td>
              <td>38</td>
              <td rowspan="5">3倍流水</td>
            </tr>
            <tr>
              <td>≥5,888</td>
              <td>58</td>
              <td>88</td>
            </tr>
            <tr>
              <td>≥18,888</td>
              <td>188</td>
              <td>288</td>
            </tr>
            <tr>
              <td>≥58,888</td>
              <td>588</td>
              <td>888</td>
            </tr>
            <tr>
              <td>≥128,888</td>
              <td>1,288</td>
              <td>1,888</td>
            </tr>
          </tbody>
        </table>
        <div class="winning-bonus">
          <div class="title">*完胜奖金</div>
          <div class="content">赛制中胜方零封对手</div>
        </div>
        <div class="reversal-bonus">
          <div class="title">*逆转奖金</div>
          <div class="content">赛事中先输一局，最终逆转取胜</div>
        </div>
        <div class="lpl-summer-2024-example">
          例：档位奖金不累计，若触发多个特殊事件按最高档位派发，指定赛事场数投注额按多场馆有效投注额累计。
        </div>
        <div class="lpl-summer-2024-rule-title"></div>
        <div class="lpl-summer-2024-rule-content">
          <div class="item-content">
            <div class="item-icon-box">
              <div class="item-icon"></div>
            </div>

            <div class="item-text">
              1.活动期间，投注LPL夏季赛赛盘口早盘有效投注≥1,888元并完成特殊事件即可获得对应彩金；
            </div>
          </div>
          <div class="item-content">
            <div class="item-icon-box">
              <div class="item-icon"></div>
            </div>
            <div class="item-text">
              2. 活动期间，每场特殊事件判定标准为如下：完胜奖金:赛制中零封对手；逆转奖金:赛事中先输一局，最终逆转取胜；
            </div>
          </div>
          <div class="item-content">
            <div class="item-icon-box">
              <div class="item-icon"></div>
            </div>

            <div class="item-text">
              3. 活动无需申请，符合条件的会员，彩金于次日24小时内统一派发，彩金3倍流水即可提款；
            </div>
          </div>
          <div class="item-content">
            <div class="item-icon-box">
              <div class="item-icon"></div>
            </div>
            <div class="item-text">
              4.
              任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
            </div>
          </div>
          <div class="item-content">
            <div class="item-icon-box">
              <div class="item-icon"></div>
            </div>
            <div class="item-text">
              5.根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
            </div>
          </div>
          <div class="item-content">
            <div class="item-icon-box">
              <div class="item-icon"></div>
            </div>
            <div class="item-text">
              6.此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及IP地址视为同一账户，若有违规者，将不享受此红利；
            </div>
          </div>
          <div class="item-content">
            <div class="item-icon-box">
              <div class="item-icon"></div>
            </div>
            <div class="item-text">7.为避免文字理解差异，东赢电竞保留此活动最终解释权；</div>
          </div>
        </div>
      </div>
      <div class="lpl-summer-2024-second-container" v-if="activeTab === 'second'">
        <div class="lpl-summer-2024-second-title"></div>
        <div class="lpl-summer-2024-activities">
          活动内容：当日投注LPL夏季赛当日滚球盘累计投注≥1,000且最终结算盈利≥500以上即可获得对应的盈利彩金。若LPL夏季赛最终结算为负盈利≥1,000也可获得对应负盈利返比。
        </div>
        <table class="lpl-summer-2024-table">
          <thead>
            <tr>
              <th rowspan="2" style="width: 25%">累计盈利</th>
              <th style="width: 25%">累计投注≥1,000</th>
              <th style="width: 25%">累计投注≥10,000</th>
              <th style="width: 25%">累计投注≥50,000</th>
            </tr>
            <tr>
              <th colspan="3">礼金额度</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥500</td>
              <td>8</td>
              <td>58</td>
              <td>88</td>
            </tr>
            <tr>
              <td>≥1,000​</td>
              <td>18</td>
              <td>88</td>
              <td>188</td>
            </tr>
            <tr>
              <td>≥5,000</td>
              <td>58</td>
              <td>158</td>
              <td>288</td>
            </tr>
            <tr>
              <td>≥10,000</td>
              <td>88</td>
              <td>188</td>
              <td>328</td>
            </tr>
            <tr>
              <td>≥50,000</td>
              <td>188</td>
              <td>288</td>
              <td>588</td>
            </tr>
          </tbody>
        </table>
        <div class="special-discounts-rebates">
          <div class="title">特惠返利场</div>
          <div class="line"></div>
        </div>
        <table class="lpl-summer-2024-table">
          <thead>
            <tr>
              <th style="width: 25%">累计负盈利</th>
              <th style="width: 25%">好运金</th>
              <th style="width: 25%">彩金上限</th>
              <th style="width: 25%">流水倍数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥1,000</td>
              <td>负盈利金额3%​</td>
              <td>888元</td>
              <td>3倍​</td>
            </tr>
          </tbody>
        </table>
        <div class="lpl-summer-2024-notice">
          注：当日所有LPL夏季赛赛事滚球盘口结算金额相加，以总结算金额判定正负盈利。
        </div>
        <div class="lpl-summer-2024-rule-title"></div>
        <div class="lpl-summer-2024-rule-content">
          <div class="item-content">
            <div class="item-icon-box">
              <div class="item-icon"></div>
            </div>
            <div class="item-text">
              1.活动期间，投注当日LPL夏季赛滚球盘累计投注≥1,000元且最终结算盈利≥500元以上即可获得对应的盈利彩金。若LPL夏季赛最终结算为负盈利≥1,000元也可获得对应负盈利返比
              ；
            </div>
          </div>
          <div class="item-content">
            <div class="item-icon-box">
              <div class="item-icon"></div>
            </div>
            <div class="item-text">
              2. 活动无需申请，符合条件的会员彩金于次日24内统一派发，彩金仅需3倍流水即可提款；
            </div>
          </div>
          <div class="item-content">
            <div class="item-icon-box">
              <div class="item-icon"></div>
            </div>
            <div class="item-text">
              3.
              任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
            </div>
          </div>
          <div class="item-content">
            <div class="item-icon-box">
              <div class="item-icon"></div>
            </div>
            <div class="item-text">
              4.根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
            </div>
          </div>
          <div class="item-content">
            <div class="item-icon-box">
              <div class="item-icon"></div>
            </div>
            <div class="item-text">
              5.此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及IP地址视为同一账户，若有违规者，将不享受此红利；
            </div>
          </div>
          <div class="item-content">
            <div class="item-icon-box">
              <div class="item-icon"></div>
            </div>
            <div class="item-text">6.为避免文字理解差异，东赢电竞保留此活动最终解释权；</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { getLplSummer24Match } from "../../../api/index/promo.js";
import moment from "moment";

import { userStore } from "../../../stores/index";
import { useLocalStorage } from "@vueuse/core";

const store = userStore();
const activeTab = ref("first");
const matchList = ref([]);
const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
onMounted(async () => {
  if (!store.token) {
    return;
  }
  const apiRes = await getLplSummer24Match();
  console.log(apiRes);
  matchList.value = apiRes.data.map((res) => ({
    ...res,
    matchTime: moment(res.matchTime).format("M月DD日 HH:mm"),
    teamOneIcon: imgURL + res.teamOneIcon,
    teamTwoIcon: imgURL + res.teamTwoIcon
  }));
});
</script>

<style scoped lang="scss">
.lpl-summer-2024 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 40px;
  padding-bottom: 80px;
  background-color: #1d1d1e;
  .lpl-summer-2024-background-img {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1074px;
    background-image: url("../../../assets/promo/dy-lpl-summer-24/background-img.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .lpl-summer-2024-box {
    width: 100%;
    padding: 0px 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
.lpl-summer-2024-tab {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  width: 100%;
}
.lpl-summer-2024-tab-item {
  font-family: FZLanTingHeiS-EB-GB;
  font-size: 22px;
  font-weight: 400;
  line-height: 39.71px;
  color: #948b73;
  background-image: url("../../../assets/promo/dy-lpl-summer-24/inactive-btn.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  max-width: 200px;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.active {
  color: #f8e1a3;
  background-image: url("../../../assets/promo/dy-lpl-summer-24/active-btn.png");
}

.lpl-summer-2024-first-container {
  width: 100%;
  height: 100%;
  background-color: #1d1d1e;
  .lpl-summer-2024-fisrt-title {
    width: 100%;
    height: 71px;
    background-image: url("../../../assets/promo/dy-lpl-summer-24/special-gift-title.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    margin-bottom: 10px;
  }
  .lpl-summer-2024-rule-title {
    width: 100%;
    height: 71px;
    background-image: url("../../../assets/promo/dy-lpl-summer-24/rule-title.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    margin-bottom: 28px;
  }

  .lpl-summer-2024-team-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .lpl-summer-2024-game-team {
      width: 100%;
      height: 110px;
      background-image: url("../../../assets/promo/dy-lpl-summer-24/team-back.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 20px;
      .lpl-summer-2024-game-team-item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .lpl-summer-2024-game-team-icon {
          width: 50px;
          height: 50px;
        }
        .lpl-summer-2024-game-team-name {
          font-size: 16px;
          font-weight: 400;
          line-height: 24.82px;
          color: #fff;
        }
      }

      .lpl-summer-2024-info {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .vs-icon {
          width: 60px;
          height: 60px;
          background-image: url("../../../assets/promo/dy-lpl-summer-24/vs.png");
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

  .lpl-summer-2024-activities {
    font-size: 16px;
    font-weight: 400;
    line-height: 25.4px;
    color: #fdffe9;
    padding: 16px 24px;
    border: 3px solid #3d3d3d;
    margin-bottom: 27px;
    span {
      color: #fabf34;
    }
  }

  :deep(.lpl-summer-2024-table) {
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

      tr {
        height: 41px;
        th {
          border: 1px solid #ffdba633;
          background: #ffdba633 !important;
        }
      }
    }
    tbody {
      color: #fdffe9;
      background: #1d1d1e !important;
      tr {
        height: 41px;
        td {
          border: 1px solid #ffdba633 !important;
          background: #1d1d1e !important;
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

  .lpl-summer-2024-example {
    font-size: 16px;
    font-weight: 400;
    line-height: 25.4px;
    color: #fdffe9;
    padding: 16px 24px;
    border: 3px solid #3d3d3d;
    margin-bottom: 28px;
  }

  .lpl-summer-2024-rule-content {
    border: 3px solid #3d3d3d;
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
        background-image: url("../../../assets/promo/dy-lpl-summer-24/rule-icon.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-right: 10px;
      }
      .item-text {
        width: calc(100% - 40px);
        font-weight: 400;
        line-height: 25.4px;
        color: #fdffe9;
      }
    }
  }
}

.lpl-summer-2024-second-container {
  width: 100%;
  height: 100%;
  background-color: #1d1d1e;
  .lpl-summer-2024-second-title {
    width: 100%;
    height: 71px;
    background-image: url("../../../assets/promo/dy-lpl-summer-24/back-money-title.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    margin-bottom: 29px;
  }
  .lpl-summer-2024-activities {
    font-size: 16px;
    font-weight: 400;
    line-height: 25.4px;
    color: #fdffe9;
    padding: 16px 24px;
    border: 3px solid #3d3d3d;
    margin-bottom: 20px;
  }
  .lpl-summer-2024-table {
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
      background: #2c2a27;

      tr {
        height: 41px;
        th {
          border: 1px solid #ffdba633;
          background: #ffdba633 !important;
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 18px;
        }
      }
    }
    tbody {
      color: #fdffe9;
      tr {
        height: 41px;
        td {
          border: 1px solid #ffdba633 !important;
          background: #1d1d1e !important;
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
  .lpl-summer-2024-notice {
    font-size: 16px;
    font-weight: 400;
    line-height: 25.4px;
    color: #fdffe9;
    padding: 16px 24px;
    border: 3px solid #3d3d3d;
    margin-bottom: 17px;
    margin-bottom: 28px;
  }

  .lpl-summer-2024-rule-title {
    width: 100%;
    height: 71px;
    background-image: url("../../../assets/promo/dy-lpl-summer-24/rule-title.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    margin-bottom: 28px;
  }

  .lpl-summer-2024-rule-content {
    border: 3px solid #3d3d3d;
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
        background-image: url("../../../assets/promo/dy-lpl-summer-24/rule-icon.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-right: 10px;
      }
      .item-text {
        width: calc(100% - 40px);
        font-weight: 400;
        line-height: 25.4px;
        color: #fdffe9;
      }
    }
  }
}
</style>
