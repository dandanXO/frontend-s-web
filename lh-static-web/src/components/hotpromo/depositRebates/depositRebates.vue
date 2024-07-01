<template>
  <div class="deposit-rebates-container isEuro">
    <div class="cards">
      <div class="deposit-card" v-for="(card, i) in depositCards" :key="i">
        <div class="deposit-card__logo" :class="card.code"><img :src="require(`./images/${card.code}.png`)" /></div>
        <div class="deposit-content">
          <div class="deposit-content__title">{{ card.title }}充值加码</div>
          <div class="deposit-content__details" v-html="card.content"></div>
        </div>
        <div class="deposit-buttons">
          <div class="btn deposit-buttons__go-deposit">
            <router-link to="/center/deposit"><img src="./euroimages/depositnow-btn.png" /></router-link>
          </div>
          <div class="btn deposit-buttons__check-lesson" v-if="card.lesson">
            <a :href="card.lesson" target="_blank"><img src="./euroimages/checklesson-btn.png" /></a>
          </div>
        </div>
      </div>
    </div>
    <div class="similar-title">
      <img src="./euroimages/title-details.png" />
    </div>

    <table cellpadding="0" cellspacing="0" border="0" class="happy-table">
      <thead>
        <tr>
          <th>存款方式</th>
          <th>存款返利</th>
          <th>单笔存款限制</th>
          <th>单日彩金上限</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>USDT</td>
          <td>1.5%</td>
          <td>≥200</td>
          <td>588</td>
        </tr>
        <tr>
          <td>EBPAY</td>
          <td>1.0%</td>
          <td>任意金额</td>
          <td>200</td>
        </tr>
        <tr>
          <td>OKPAY</td>
          <td>1.0%</td>
          <td>任意金额</td>
          <td>200</td>
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
          <td>200</td>
        </tr>
        <tr>
          <td>数字人民币</td>
          <td>1.0%</td>
          <td>≥300</td>
          <td>100</td>
        </tr>
        <tr>
          <td>支付宝转卡</td>
          <td>0.5%</td>
          <td>任意金额</td>
          <td>100</td>
        </tr>
        <tr>
          <td>808钱包</td>
          <td>1.5%</td>
          <td>任意金额</td>
          <td>200</td>
        </tr>
      </tbody>
    </table>
    <div class="similar-title">
      <img src="./euroimages/title-rules.png" />
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
    content:
      "充值即送<em>1.5%</em>彩金 使用USDT充值更安全更便捷，24小时充值不等待。活动期间，每位玩家每笔使用“TRC 20”“ERC20-2”或“ERC20”充值≥200U，即可享受存款金额的<em>1.5%</em>加码彩金，单日优惠最高上限588元",
    lesson: "https://fil2e5sal.vmip991b92n.com/media/deposit_guide.mp4"
  },
  {
    code: "okpay",
    title: "OKpay",
    content:
      '充值即送<em>1.0%</em>彩金 OKpay充值火热上线，速度快，够安全。活动期间，每日用户任何时间在雷火使用“OKpay充值"方式成功存款，即可获得OKpay存款金额的<em>1.0%</em>的彩金返还，单日优惠最高上限200元。',
    lesson: "https://me-qr.com/l/okpayjiaocheng"
  },
  {
    code: "ebpay",
    title: "EBPAY",
    content:
      "充值即送<em>1.0%</em>彩金，活动期间，每位玩家每笔使用EBpay单笔充值成功存款即可享受存款金额的<em>1.0%</em>加码彩金，单日优惠最高上限200元",
    lesson: "https://fil2e5sal.vmip991b92n.com/media/intro.mp4"
  },
  {
    code: "kdou",
    title: "K豆",
    content:
      "充值即送<em>1.0%</em>彩金K豆完全可以满足您不同需求和使用场景。活动期间，每位玩家每笔使用K豆单笔充值成功享受存款金额的<em>1.0%</em>加码彩金，单日优惠最高上限200元",
    lesson: "https://kdxz1848.com/"
  },
  // {
  //     "code": "jdpay",
  //     "title": "JDpay",
  //     "content": "充值即送1.0%彩金JDpay充值火热上线，速度快，够安全。活动期间，每日用户任何时间在雷火使用“JDpay充值\"方式成功存款，即可获得JDpay存款金额的1.0%的彩金返还，单日优惠最高上限200元。",
  //     "lesson": "https://www.jdpay01.com/#/transactionFlow"
  // },
  {
    code: "szrmb",
    title: "数字人民币",
    content:
      "充值即送<em>1.0%</em>彩金数字人民币充值火热上线，速度快，够安全。用户每日任何时间在雷火使用“数字人民币”方式成功存款≥300元，即可享受存款金额的<em>1.0%</em>加码彩金，单日优惠最高上限100元"
  },
  {
    code: "zfb",
    title: "支付宝转卡",
    content:
      "充值即送<em>0.5%</em>彩金活动期间，每日用户任何时间在雷火使用“支付宝转卡”方式成功存款，即可获得支付宝转卡存款金额的<em>0.5%</em>的彩金返还，单日优惠最高上限100元"
  },
  {
    code: "blbpay",
    title: "808钱包",
    content:
      "充值即送<em>1.5%</em>彩金，808钱包方便快捷、快速到账、安全。用户每日任何时间在雷火使用“808钱包”方式成功存款，即可享受存款金额的<em>1.5%</em>加码彩金，单日优惠最高上限200元",
    lesson: "http://808.com/tutorial.html"
  }
]);
</script>
<style lang="scss">
.deposit-rebates-container {
  &.isEuro {
    .cards {
      .deposit-card {
        .deposit-content {
          &__details {
            color: #d1ecff;

            em{
              font-style: normal;
              color: #ff0000;
            }
          }
        }
      }
    }
    .happy-table {
      thead {
        th {
          background: #0047ff;
          color: #cff6ff;
        }
      }
      tbody {
        tr {
          &:nth-child(even) {
            background: #c9dcff33;

            border: 1px solid #c0bcb74d;
          }
        }
        td {
          color: #cff6ff;
        }
      }
    }
    ol.happy-rules {
      li {
        color: #cff6ff;
      }
    }
  }
  width: 95%;
  max-width: 1200px;
  margin: 0 auto;
  .cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    .deposit-card {
      display: flex;
      align-items: flex-end;
      height: 270px;
      position: relative;
      background: url("./euroimages/card-bg.png") no-repeat center center;
      background-size: contain;
      padding: 30px;
      gap: 25px;
      &__logo {
        position: absolute;
        right: 55px;
        top: 33px;
        img {
          height: 65px;
        }
        &.blbpay {
          top: 48px;
          right: 40px;
          img {
            height: 30px;
          }
        }
        &.jdpay {
          top: 40px;
          right: 50px;
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
          color: #ffffff;
        }
        &__details {
          font-family: Microsoft YaHei UI;
          font-size: 18px;
          font-weight: 400;
          line-height: 23.94px;

          color: #c4a8ff;
        }
      }
      .deposit-buttons {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 15px;
        .btn {
          width: 120px;
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
      background: #191643;
      border: 1px solid #dc91ff;
      td,
      th {
        border: 1px solid #c0bcb74d;
        padding: 10px;
        text-align: center;
        color: #ef94fe;
        font-family: Microsoft YaHei UI;
        font-size: 24px;
        font-weight: 700;
        line-height: 31.92px;
      }
    }
    tbody {
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
    }
  }
  ol.happy-rules {
    li {
      font-family: Microsoft YaHei UI;
      color: #f1d4ff;
      font-size: 20px;
      font-weight: 400;
      line-height: 26.6px;
      margin-bottom: 10px;
    }
  }
}
</style>
