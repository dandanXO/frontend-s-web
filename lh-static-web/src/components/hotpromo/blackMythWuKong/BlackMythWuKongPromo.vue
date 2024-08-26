<template>
  <div class="black-myth-wrapper">
    <div class="black-myth-content-wrapper">
      <img class="black-myth-content-title" src="./img/event-content-title.png" />
      <div class="black-myth-content-block event-content">
        <span>活动期间，每位会员当日首充达5,000元或以上，即可领取对应档位奖品。</span>
        <div class="reward-table">
          <div class="reward-table__header">
            <span>单笔充值</span>
            <span>奖品</span>
          </div>
          <div class="reward-table__row">
            <span>≥5,000</span>
            <span>【黑神话·悟空】标准版游戏激活码</span>
          </div>
          <div class="reward-table__row">
            <span>≥10,000</span>
            <span>【黑神话·悟空】豪华版游戏激活码</span>
          </div>
          <div class="reward-table__row">
            <span>≥100,000</span>
            <span>1,888元+【黑神话·悟空】豪华版</span>
          </div>
        </div>

        <span>注：符合标准的会员若不想兑换奖品可联系在线客服，官网以奖品金额的8折以彩金的形式派发；</span>
        <router-link class="deposit-btn" to="/center/deposit">
          <button></button>
        </router-link>
      </div>
    </div>

    <div class="black-myth-content-wrapper">
      <img class="black-myth-content-title" src="./img/event-rule-title.png" />
      <div class="black-myth-content-block event-rule">
        <ul>
          <li>1.活动期间，单日单笔充值≥5,000元的会员可前往客服中心领取对应奖品；</li>
          <li>2.活动期间，满足领取条件的会员若当日23:59:59未前往客服页面领取则视为预期自动放弃奖品；</li>
          <li>3.活动期间，每位会员每日最多可兑换一次奖品，当日已兑换完成的会员无法再领取其他档位奖品；</li>
          <li>4.活动期间，每位会员仅限兑换一次游戏激活码，次日单笔充值达到指定金额，可兑换相应折算彩金。</li>
          <li>
            5.根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
          </li>
          <li>
            6.此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及IP地址视为同一账户，若有违规者，将不享受此红利；
          </li>
          <li>7.本活动不与官网其他活动共享；</li>
          <li>8.为避免文字理解差异，雷火电竞保留此活动最终解释权；</li>
        </ul>
        <!--        <router-link class="deposit-btn" to="/center/deposit">-->
        <!--          <button></button>-->
        <!--        </router-link>-->
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.black-myth-wrapper {
  margin: 94px auto 0;
  max-width: 1468px;

  .black-myth-content-wrapper {
    &:first-child {
      margin-bottom: 94px;
    }

    .black-myth-content-title {
      margin-bottom: 80px;
    }
    .black-myth-content-block {
      display: flex;
      flex-direction: column;
      gap: 38px;
      max-width: 1200px;
      margin: 0 auto;
      background: #8a766329;
      border: 1px solid #e8d5b9;
      border-radius: 6px;
      color: #e8d5b9;

      .deposit-btn {
        margin: 30px auto 0;
        background: url(./img/deposit-btn.png) no-repeat;
        aspect-ratio: 300 / 64;
        width: 300px;
      }

      &.event-content {
        padding: 66px 50px;
        font-size: 24px;
        font-weight: 400;
        line-height: 31.92px;
      }

      &.event-rule {
        padding: 50px 25px 62px 50px;
        ul {
          font-size: 24px;
          line-height: 48px;
          padding-left: 0;
          li {
            display: flex;
            align-items: baseline;
            counter-increment: list-counter;
            list-style-type: none;
            &::before {
              flex-shrink: 0;
              content: "";
              width: 24px;
              height: 24px;
              margin-right: 8px;
              background: url(./img/ul-icon.svg);
            }
          }
        }
      }
    }
  }
}

.reward-table {
  width: 100%;
  background-color: #4b3e3a;
  text-align: center;
  font-size: 20px;
  line-height: 49.6px;

  .reward-table__header,
  .reward-table__row {
    display: flex;
    max-width: 100%;
    span {
      flex: 1;
    }
  }
  .reward-table__header {
    background-color: #443429;
    padding: 0 20px;
  }
  .reward-table__row {
    margin: 0 20px;
    &:not(:last-child) {
      border-bottom: 1px solid #6a5954;
    }
  }
}
</style>
