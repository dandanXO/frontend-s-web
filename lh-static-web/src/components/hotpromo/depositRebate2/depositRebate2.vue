<template>
  <div class="deposit-rebates-container">
    <div class="cards">
      <div class="deposit-card" v-for="(card, i) in depositCards" :key="i">
        <div class="deposit-card__logo" :class="card.code"><img :src="require(`./images/${card.code}.png`)" /></div>
        <div class="deposit-content">
          <div class="deposit-content__title">{{ card.title }}充值加码</div>
          <div class="deposit-content__details" v-html="card.content"></div>
        </div>
        <div class="deposit-buttons">
          <div class="btn deposit-buttons__go-deposit">
            <router-link to="/center/deposit"><img src="./images/depositnow-btn.png" /></router-link>
          </div>
          <div class="btn deposit-buttons__check-lesson" v-if="card.lesson">
            <a :href="card.lesson" target="_blank"><img src="./images/checklesson-btn.png" /></a>
          </div>
        </div>
      </div>
    </div>
    <div class="similar-title">
      <img src="./images/title-details.png" />
    </div>

    <table cellpadding="0" cellspacing="0" border="0" class="happy-table">
      <thead>
        <tr>
          <th><p>存款方式</p></th>
          <th><p>存款返利</p></th>
          <th><p>单笔存款限制</p></th>
          <th><p>单日彩金上限</p></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>USDT</td>
          <td>1.0%</td>
          <td>≥100</td>
          <td>388</td>
        </tr>
        <tr>
          <td>808钱包</td>
          <td>1.0%</td>
          <td>任意金额</td>
          <td>188</td>
        </tr>
        <tr>
          <td>EBPAY</td>
          <td>1.0%</td>
          <td>任意金额</td>
          <td>188</td>
        </tr>
        <!-- <tr>
                    <td>JDPAY</td>
                    <td>1.0%</td>
                    <td>任意金额</td>
                    <td>200</td>
                </tr> -->
        <tr>
          <td>K豆</td>
          <td>1.0%</td>
          <td>任意金额</td>
          <td>188</td>
        </tr>
        <tr>
          <td>数字人民币</td>
          <td>1.0%</td>
          <td>≥20</td>
          <td>138</td>
        </tr>
        <!-- <tr>
          <td>支付宝转卡</td>
          <td>1.0%</td>
          <td>≥1,000</td>
          <td>100</td>
        </tr> -->
        <tr>
          <td>支付宝</td>
          <td>0.5%</td>
          <td>≥3000</td>
          <td>38</td>
        </tr>
        <tr>
          <td>OKPAY</td>
          <td>1.0%</td>
          <td>≥3000</td>
          <td>188</td>
        </tr>
      </tbody>
    </table>
    <div class="similar-title">
      <img src="./images/title-rules.png" />
    </div>
    <ol class="happy-rules">
      <li>活动期间使用指定存款方式进行存款达到指定要求即可获得彩金；</li>
      <li>存款不限制存款次数，存款到账后会自动派发至主账户；</li>
      <li>此优惠不予任何存送优惠共享；</li>
      <li>存款需存入指定存款通道，如存入非指定通道，将无法享受此存款优惠；</li>
      <li>
        此优惠促销只适用于拥有一个独立账户的玩家。住址、电子邮箱地址、电话号码、支付方式（相同借记卡/信用卡/银行账户号码）IP地址、同一网络环境等将可以作为判定是否独立玩家的条件；
      </li>
      <li>
        对于发现任何有违背、欺骗、或利用规则和条款进行非法获利的会员，雷火电竞保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利；
      </li>
      <li>雷火电竞有权延长、缩短、终止，或者修改此活动！此活动最终解释权归雷火电竞所有；</li>
    </ol>
  </div>
</template>
<script setup>
import { ref } from "vue";

const depositCards = ref([
  {
    code: "usdt",
    title: "USDT",
    content: `充值即送<em class="light-bg">1.0%</em>彩金 使用USDT充值更安全更便捷，24小时充值不等待。活动期间，每位玩家每笔使用“TRC 20”或“ERC20”充值≥100USDT，即可享受存款金额的1.0%加码彩金，单日优惠最高上限 388元。`,
    lesson: "https://fil2e5sal.vmip991b92n.com/media/deposit_guide.mp4"
  },
  {
    code: "blbpay",
    title: "808钱包",
    content: `充值即送<em class="light-bg">1.0%</em>彩金，808钱包方便快捷、快速到账、安全。用户每日任何时间在雷火使用“808钱包”方式成功存款，即可享受存款金额的1.0%加码彩金，单日优惠最高上限188元！`,
    lesson: "http://808.com/tutorial.html"
  },
  {
    code: "ebpay",
    title: "EBPAY",
    content: `充值即送<em class="light-bg">1.0%</em>彩金 只支持银行卡。活动期间，每位玩家每笔使用EBpay单笔充值成功存款即可享受存款金额的1.0%加码彩金，单日优惠最高上限188元！`,
    lesson: "https://fil2e5sal.vmip991b92n.com/media/intro.mp4"
  },
  {
    code: "kdou",
    title: "K豆",
    content:
      "充值即送<em>1.0%</em>彩金K豆完全可以满足您不同需求和使用场景。活动期间，每位玩家每笔使用K豆单笔充值成功享受存款金额的1.0%加码彩金，单日优惠最高上限188元！",
    lesson: "https://kdxz1848.com/"
  },
  

  // {
  //   "code": "jdpay",
  //   "title": "JDpay",
  //   "content": "充值即送1.0%彩金 JDpay充值火热上线，速度快，够安全。活动期间，每日用户任何时间在雷火使用“JDpay充值\"方式成功存款，即可获得JDpay存款金额的1.0%的彩金返还，单日优惠最高上限200元。",
  //   "lesson": "https://www.jdpay01.com/#/transactionFlow"
  // },
  {
    code: "szrmb",
    title: "数字人民币",
    content: `充值即送<em class="light-bg">1.0%</em>彩金 数字人民币充值火热上线，速度快，够安全。用户每日任何时间在雷火使用“数字人民币”方式成功存款≥20元，即可享受存款金额的<em class="light-bg">1.0%</em>加码彩金，单日优惠最高上限138元。`
  },
  {
    code: "zfb",
    title: "支付宝转卡",
    content: `充值即送<em class="light-bg">0.5%</em>彩金 支付宝可以满足您不同需求和使用场景，速度快，够安全。用户每日任何时间在雷火使用“支付宝”方式成功存款≥3000元，即可享受存款金额的<em class="light-bg">0.5%</em>加码彩金，单日优惠最高上限38元。`
  },
  {
    code: "okpay",
    title: "OKPAY",
    content: `充值即送<em class="light-bg">1.0%</em>彩金，OKPAY超快充值 极致体验，支持：银行卡，支付宝，微信！活动期间，每位玩家每笔使用OKPAY单笔充值≥1000元即可享受存款金额的<em class="light-bg">1.0%</em>加码彩金，单日优惠最高上限188元！`,
    lesson: "https://me-qr.com/l/okpayjiaocheng"
  },
]);
</script>
<style lang="scss">
.deposit-rebates-container {
  width: 95%;
  max-width: 1200px;
  margin: 0 auto;
  .cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    .deposit-card {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      height: 330px;
      position: relative;
      background: url("./images/card-bg.png") no-repeat center center;
      background-size: contain;
      padding: 30px;
      gap: 25px;
      &__logo {
        position: absolute;
        right: 50px;
        top: 18px;
        img {
          height: 60px;
        }
        &.blbpay {
          top: 20px;
          right: 45px;
          img {
            height: 60px;
          }
        }
        &.jdpay {
          top: 25px;
          right: 25px;
          img {
            height: 55px;
          }
        }
      }
      .deposit-content {
        flex: 3;
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: space-between;
        height: 100%;
        padding-top: 40px;
        &__title {
          font-family: Microsoft YaHei UI;
          font-size: 32px;
          font-weight: 700;
          line-height: 42.56px;
          color: #422879;
        }
        &__details {
          font-family: Microsoft YaHei UI;
          font-size: 18px;
          font-weight: 400;
          line-height: 23.94px;

          color: #422879;
        }
      }
      .deposit-buttons {
        display: flex;
        flex-direction: row;
        flex: 1;
        gap: 15px;
        .btn {
          width: 180px;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  .similar-title {
    max-width: 1000px;
    width: 95%;
    margin: 30px auto;
    img {
      width: 100%;
    }
  }
  .happy-table {
    width: 100%;
    thead {
      background: #e7f3f9;
      border: 1px solid #dc91ff;
      td,
      th {
        background: #e7f3f9;
        border: 1px solid #c0bcb74d;
        padding: 10px;
        text-align: center;
        color: #ef94fe;
        font-family: Microsoft YaHei UI;
        font-size: 24px;
        font-weight: 700;
        line-height: 31.92px;

        p {
          background: linear-gradient(180deg, #7b2cec 0%, #1dcef3 100%);
          -webkit-background-clip: text;
          color: transparent;
          margin: 0;
        }
      }
    }
    tbody {
      td {
        &:nth-child(odd) {
          color: #dff9ff;
        }
        &:nth-child(even) {
          color: #faff0c;
        }
      }
      td,
      th {
        font-family: Microsoft YaHei UI;
        font-size: 24px;
        font-weight: 400;
        line-height: 31.92px;

        border: 1px solid #c0bcb74d;
        padding: 10px;
        text-align: center;
        color: #f1d4ff;
      }
    }
    tr {
      &:nth-child(odd) {
        border: 1px solid #c0bcb74d;
        background: #9357c166;
      }
      &:nth-child(even) {
        border: 1px solid #c0bcb74d;
        background: #d1adff33;
      }
    }
  }
  ol.happy-rules {
    li {
      font-family: Microsoft YaHei UI;
      color: #dff9ff;
      font-size: 20px;
      font-weight: 400;
      line-height: 26.6px;
      margin-bottom: 10px;
    }
  }
}
</style>
