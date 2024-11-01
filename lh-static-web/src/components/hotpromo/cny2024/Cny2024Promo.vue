<template>
  <div class="cny-body">
    <div class="cny-tabs">
      <div :class="`tab tab-1 ${currentTab === 'tabOne' ? 'active' : ''}`" @click="onTabClick('tabOne')">
        <span class="grad-txt">新年红包雨</span>
      </div>

      <!-- <div :class="`tab tab-2 ${currentTab === 'tabTwo' ? 'active' : ''}`" @click="onTabClick('tabTwo')">
        <span class="grad-txt">新年惊喜翻倍礼包</span>
      </div> -->

      <div :class="`tab tab-3 ${currentTab === 'tabThree' ? 'active' : ''}`" @click="onTabClick('tabThree')">
        <span class="grad-txt">亲朋好友 欢度新年</span>
      </div>
    </div>

    <div :class="`cny-container ${currentTab === 'tabOne' ? 'active' : ''}`">
      <div class="head-title">
        <img src="../../../assets/images/promotion/hotpromo/cny2024/head-title-01.png" />
      </div>

      <div class="join-container">
        <div class="join-btn" @click="goToHongbaoyu()">
          <img src="../../../assets/images/promotion/hotpromo/cny2024/btn-join.png" />
        </div>
      </div>

      <div class="table-container">
        <div class="table-date">2/9/~2/11</div>

        <table border="0">
          <thead>
            <tr>
              <td>新年红包发放时间</td>
              <td>每日次数</td>
              <td>当日红包开启时间</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2024年02月09日</td>
              <td rowspan="3">2次</td>
              <td rowspan="3">18:00、20:00</td>
            </tr>
            <tr>
              <td>2024年02月10日</td>
            </tr>
            <tr>
              <td>2024年02月11日</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="rules-container">
        <div class="rules-title">活动规则</div>
        <ol class="rules-content">
          <li>活动需每日充值≥100元且通过活动页面参与，未点击则视为放弃参与活动；</li>
          <li>红包金额随机不等，单个红包金额最大为1888元，红包奖金完成3倍水即可提现；</li>
          <li>每轮抢红包有效时间为1个小时（抢完为止）每轮开启1个小时后，红包雨自动关闭，等待下一轮抢红包时间；</li>
          <li>领取方式：点击活动页面【点击参与按钮】即可进入抢红包页面。</li>
          <li>
            此优惠活动只适用于拥有一个独立账户的玩家。住址、电子邮箱地址、电话号码、支付方式（相同借记卡/信用卡/银行账户号码）IP地址、同一网络环境等将可以作为判定是否独立玩家的条件；
          </li>
          <li>雷火电竞有权延长、缩短、终止，或者修改此活动！最终解释权归雷火电竞所有；</li>
        </ol>
      </div>
    </div>

    <!-- <div :class="`cny-container ${currentTab === 'tabTwo' ? 'active' : ''}`">
      <div class="head-title">
        <img src="../../../assets/images/promotion/hotpromo/cny2024/head-title-02.png" />
      </div>

      <div class="table-container">
        <div class="table-date">2/9/~2/18</div>

        <table border="0">
          <thead>
            <tr>
              <td>每日存款</td>
              <td>彩金</td>
              <td>流水倍数</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥1,000</td>
              <td>签到彩金*2</td>
              <td rowspan="5">3倍</td>
            </tr>
            <tr>
              <td>≥5,000</td>
              <td>8+签到彩金*2+当日红包彩金*2</td>
            </tr>
            <tr>
              <td>≥10,000</td>
              <td>58元+签到彩金*2+当日红包彩金*2</td>
            </tr>
            <tr>
              <td>≥50,000</td>
              <td>208元+签到彩金*3+当日红包彩金*3</td>
            </tr>
            <tr>
              <td>≥100,000</td>
              <td>588元+签到彩金*5+当日红包彩金*5</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="rules-container">
        <div class="rules-title">活动规则</div>
        <ol class="rules-content">
          <li>活动期间每日存款达到对应条件即可获得对应条件彩金，彩金于次日24小时内派发至会员账号；</li>
          <li>红包彩金仅限2024年2月9日至2024年2月11日，超出红包彩金活动时间则当日红包彩金不计算本活动派发范围内；</li>
          <li>活动期间彩金每日只按符合最高彩金条件派发一次；</li>
          <li>活动仅限VIP1及VIP1以上会员参与，彩金3倍流水即可出款；</li>
          <li>同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；</li>
          <li>为避免文字理解差异，雷火电竞保留此活动最终解释权；</li>
        </ol>
      </div>
    </div> -->

    <div :class="`cny-section-content ${currentTab === 'tabThree' ? 'active' : ''}`">
      <div class="head-title">
        <img src="../../../assets/images/promotion/hotpromo/cny2024/head-title-03.png" />
      </div>

      <div class="join-container">
        <div class="join-btn" @click="router.push('/center/share')">
          <img src="../../../assets/images/promotion/hotpromo/cny2024/btn-join.png" />
        </div>
      </div>

      <div class="table-container">
        <div class="table-date">2/9/~2/11</div>

        <table border="0">
          <thead>
            <tr>
              <td>新用户首存金额</td>
              <td>推荐奖金</td>
              <td>流水要求</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥100</td>
              <td>28</td>
              <td rowspan="6">1倍/不限制场馆</td>
            </tr>
            <tr>
              <td>≥1,000</td>
              <td>108</td>
            </tr>
            <tr>
              <td>≥5,000</td>
              <td>158</td>
            </tr>
            <tr>
              <td>≥10,000</td>
              <td>388</td>
            </tr>
            <tr>
              <td>≥30,000</td>
              <td>1588</td>
            </tr>
            <tr>
              <td>≥50,000</td>
              <td>1888</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="rules-container">
        <div class="rules-title">活动规则</div>
        <ol class="rules-content">
          <li>
            每个通过您推广链接进行注册，并完成相应首存的用户，您将获得对应的邀请奖金；每个受邀请人完成对应存款金额，在单周内
            邀请人能最高可获得4208元。
          </li>
          <li>
            您每邀请一位新会员，从注册的日期开始算起，可享受4次推荐奖金，每个自然周一 00:00
            刷新1次，期间每个对应的档位奖金都 可以领取一次；逾期将会视为自动放弃。
          </li>
          <li>
            例如：会员A邀请一位好友首存100元，则可获取28元奖金；若想获取下一档位128元，则需好友再次存1000元；奖金将会自动派
            发至主钱包。
          </li>
          <li>邀请人等级不得低于青铜Ⅰ（vip2）</li>
          <li>普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放奖金</li>
          <li>
            任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投
            注额内。
          </li>
          <li>
            邀请人与受邀请人必须为不同身份的真实玩家，每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一
            个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
          </li>
          <li>为避免文字理解差异，雷火电竞保留此活动最终解释权。</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { userStore } from "@/store";

import { useRouter } from "vue-router";
const router = useRouter();

const currentTab = ref("tabOne");
const onTabClick = (flag) => {
  currentTab.value = flag;
};

const goToHongbaoyu = async () => {
  // Navigate to the root path
  // await router.push("/");
  router.push("/privilege/hongbaoyu");
};
</script>

<style scoped lang="scss">
.cny-container {
  //   min-height: calc(100vh - 290px);
  width: 100%;
  display: none;

  &.active {
    display: block;
  }
}

.cny-tabs {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 25px auto 20px;
  color: black;
}

.cny-claim-btns {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 10px auto;
}

.cny-tabs .tab {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f4f6;
  border-radius: 0.375rem;
  cursor: pointer;
  font-family: Microsoft Yahei UI;
  font-size: 20px;
  font-weight: 700;
  padding: 40px 70px;
  //   border: 1px solid #2f7cf7;
  background-color: transparent;
  box-shadow: 0;
  background-image: url("../../../assets/images/promotion/hotpromo/cny2024/btn-inactive.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 200px;
}

.cny-tabs .tab:not(.active):hover {
  opacity: 0.9;
}

.cny-tabs .tab.active {
  background-image: url("../../../assets/images/promotion/hotpromo/cny2024/btn-active.png");

  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
}

.grad-txt {
  margin-bottom: 20px;
  color: #c60000;
}

.cny-tabs .tab.active .grad-txt {
  color: #ffed90;
}
.claim-btn-div {
  display: none;

  &.active {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }
}
.claim-img {
  flex: 1;
}
.claim-img img {
  width: 100%;
}
.claim-rgt {
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.claim-rgt .claim-title {
  color: black;
  font-family: "YouSheBiaoTiHei";
  font-weight: bold;
  font-size: 40px;
  font-style: italic;
  line-height: 78px;
}

.claim-btn {
  cursor: pointer;
  border-radius: 6.25rem;
  background: linear-gradient(180deg, #2ca1fe 0%, #c481fe 100%);
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.15);
  padding: 15px 75px;
  color: white;
  font-weight: bold;

  &.disable-pointer {
    pointer-events: none;
  }
}
.claim-btn:hover {
  opacity: 0.9;
}
.claim-btn:active {
  filter: brightness(0.85);
}

.cny-banner {
  width: 100%;
  height: 500px;
}

.cny-ruler {
  width: 1200px;
  margin: 0 auto;
  color: black;
}

.cny-ruler > p {
  margin: 30px 0 20px;
  font-size: 16px;
  color: black;
}

.cny-section-content {
  display: none;

  &.active {
    display: block;
  }
}

.cny-title {
  width: 100%;
  margin: 32px auto;
  text-align: center;
}

.cny-actives {
  margin: 30px auto 60px auto;
  width: 1150px;
  text-align: center;
}

.cny-actives p {
  line-height: 24px;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: black;
}

.cny-table-div {
  margin: 20px auto 10px;
  text-align: center;
  color: white;
  width: 1200px;
  border-collapse: collapse;
}

.cny-actives td:first-child,
.cny-actives th:first-child {
  width: fit-content;
  padding: 16px 30px;
}

.cny-table-div thead {
  background-image: linear-gradient(0deg, #0494fc 0, #15bdfc 100%), linear-gradient(#d0d1d3, #d0d1d3);
  color: white;
}

.cny-table-div tr {
  table-layout: fixed;
}

.cny-table-div td,
.cny-table-div th {
  text-align: center;
  padding: 16px 30px;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  height: 52px;
  border: 1px solid #dcdce8;
}

.cny-table-div td {
  color: black;
  font-size: 18px;
}

.cny-table-div thead th {
  width: 80px;
}

.cny-hint {
  display: flex;
  justify-content: space-between;
  padding: 40px;
  width: 1200px;
  margin: 0 auto;
}

.cny-hint .hint-wrapper {
  text-align: center;
  padding: 5px;
  width: 250px;
  border-radius: 0.375rem;
  background-image: linear-gradient(0deg, #0494fc 0, #15bdfc 100%), linear-gradient(#d0d1d3, #d0d1d3);
  aspect-ratio: 168/54;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cny-hint .hint-wrapper .hint-title {
  font-size: 18px;
  color: white;
}

.cny-hint .hint-wrapper p {
  color: white;
  font-size: 14px;
  width: unset;
  margin: 0 auto;
}

.head-title {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.join-container {
  display: flex;
  justify-content: center;
  background-image: url("../../../assets/images/promotion/hotpromo/cny2024/bg-join.png");
  background-size: 100%;
  background-repeat: no-repeat;

  .join-btn {
    cursor: pointer;

    &:hover {
      filter: brightness(0.8);
    }
    img {
      display: block !important;
      width: 300px !important;
    }
  }
}

.table-container {
  // padding: 0 20px;
  max-width: 1400px;
  margin: auto;
  .table-date {
    color: #ff3f3f;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 700;
  }

  table {
    width: 100%;
    thead {
      tr {
      }
      td {
        color: #c60000;
        font-weight: 800;
        background-color: #ffdada !important;
        border: 0 !important;
        padding: 15px !important;
        font-size: 20px;
        text-align: center;

        &:first-child {
          border-top-left-radius: 20px;
          background-image: url("../../../assets/images/promotion/hotpromo/cny2024/bg-table.png");
          background-position: top left;
          background-repeat: no-repeat;
          background-size: 44px 55px;
          padding-left: 30px !important;
        }

        &:last-child {
          border-top-right-radius: 20px;
          background-image: url("../../../assets/images/promotion/hotpromo/cny2024/bg-table.png");
          background-position: top right;
          background-repeat: no-repeat;
          background-size: 44px 55px;
          padding-right: 30px !important;
        }
      }
    }
    tbody {
      td {
        border: 1px solid #ecedf0 !important;
        color: #b97a7a;
        font-size: 20px;
        font-weight: 700;
        padding: 10px 20px;
        text-align: center;
      }
    }
  }
}

.rules-container {
  max-width: 1400px;
  margin: 40px auto 0;
  // padding: 0 20px;

  .rules-title {
    color: #c60000;
    font-weight: 700;
    font-size: 24px;
  }

  .rules-content {
    color: #b97a7a;
    font-size: 20px;

    li {
      margin-bottom: 10px !important;
    }
  }
}
</style>
