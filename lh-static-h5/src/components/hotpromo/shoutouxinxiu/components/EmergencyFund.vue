<template>
  <div class="emergency-intro">
    活动期间，会员当日场馆有效投注额满足且产生对应负盈利金额，即可获得最高
    <span>388 元</span>
    返还。
  </div>

  <div class="redpacket">
    <div class="hongbao"><img src="../images/hongbao.png" /></div>
    <div class="claim-button" @click="claimPromo">立即领取</div>
  </div>

  <!-- <div class="emergency-intro">
   如果会员领取相应场馆的新秀享头彩，那么领取彩金当日如果有负盈利即可在次日 24 小时内点击领取。
 </div> -->
  <table cellpadding="0" cellspacing="0" border="0">
    <tr>
      <th>负盈利</th>
      <th>救援金</th>
      <th>流水要求</th>
    </tr>
    <tr>
      <td>500</td>
      <td>8</td>
      <td rowspan="5">1 倍</td>
    </tr>
    <tr>
      <td>1,000</td>
      <td>18</td>
    </tr>
    <tr>
      <td>5,000</td>
      <td>58</td>
    </tr>
    <tr>
      <td>10,000</td>
      <td>188</td>
    </tr>
    <tr>
      <td>30,000</td>
      <td>388</td>
    </tr>
  </table>
  <div class="emergency-rules">
    <div class="emergency-rules__rule-title">
      <img :src="require(`../images/title-left.png`)" alt="" style="width: 40px; margin-bottom: 0px" />
      活动规则
      <img :src="require(`../images/title-right.png`)" alt="" style="width: 40px; margin-bottom: 0px" />
    </div>
    <ol class="emergency-rules__rule-content">
      <li>会员需每日通过点击【立即申请】按钮方可报名参与，未点击申请按钮视为自动放弃参与该活动；</li>
      <li>有效投注额已结算时间为准，仅计算官方场馆有效投注额；</li>
      <li>本次活动的彩金将于次日 48 小时内派发至主账户钱包，彩金仅需一倍流水即可出款；</li>
      <li>同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；</li>
      <li>
        任何用户或团体以不正常的方式进行套取活动优惠，平台方保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；
      </li>
      <li>为避免文字理解差异，本站保留本活动最终解释权</li>
      <!-- <li>活动期间，会员领取【新秀享头彩】彩金后，若当日出现负盈利≥500 即可领取对应救援金，每个场馆可分别领取一次；</li>
     <li>有效投注额已结算时间为准，仅计算官方场馆有效投注额，活动仅统计领取对应场馆的【新秀享头彩】当日产生负盈利会员；</li>
     <li>符合条件的会员需点击活动页面的【点击领取】按钮，彩金仅需一倍流水即可出款；</li>
     <li>同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；</li>
     <li>任何用户或团体以不正常的方式进行套取活动优惠，平台方保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；</li>
     <li>为避免文字理解差异，本站保留本活动最终解释权；</li> -->
    </ol>
  </div>
</template>
<script setup>
import { eventapi } from "boot/axios";

const claimPromo = () => {
  eventapi
    .post("/first-bet/refund", {})
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "领取成功！",
          icon: "check_circle_outline"
        });
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: res.message,
          icon: "report_problem"
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
</script>
<style lang="scss" scoped>
.redpacket {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px auto;

  .hongbao {
    width: 180px;

    img {
      width: 100%;
    }
  }
  .claim-button {
    background-repeat: no-repeat;
    background-image: url(../images/claim-btn2.png);
    background-size: 100% 100%;
    width: 160px;
    height: 50px;
    cursor: pointer;
    color: #fff;
    aspect-ratio: 278/86;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
    line-height: 50px;

    &:hover {
      opacity: 0.9;
    }
    &:active {
      filter: brightness(0.85);
      transform: translate(0px, 1px);
    }
  }
}

.emergency-intro {
  font-family: Microsoft YaHei UI;
  font-size: 16px;
  font-weight: 400;
  line-height: 31.92px;
  letter-spacing: 0.12em;
  text-align: left;
  color: #ffffff;
  margin: 10px auto 20px;
  span {
    color: #ff881a;
  }
}
.emergency-rules {
  font-family: Microsoft YaHei UI;
  font-size: 24px;
  font-weight: 400;
  line-height: 42.6px;
  letter-spacing: 0.12em;
  text-align: left;
  color: #ffffff;
  margin: 30px 0 0;
  background-color: #2d517c6b;
  padding: 20px;
  &__rule-title {
    text-align: center;
    background: linear-gradient(180deg, #ffffff 0%, #6cb8ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: flex;
    justify-content: center;
    gap: 8px;
    align-items: center;
  }
  &__rule-content {
    font-family: Microsoft YaHei UI;
    font-size: 16px;
    font-weight: 400;
    line-height: 31.95px;
    letter-spacing: 0.12em;
    text-align: left;
  }
}

.promo-container .selected-promo .selected-promo-wrapper .inner table {
  tr {
    th,
    td {
      padding: 10px;
      text-align: center;
      font-size: 12px;
    }
    th {
      background: #3998dc;
      color: #ffffff;
    }
    &:nth-child(2) {
      td {
        border-top: 0;
      }
    }
    &:last-child {
      td {
        border-bottom: 0;
      }
    }
    td {
      background: #2d517c6b;
      color: #ffffff;
      border: 2px solid #ffffff33;
      &:first-child {
        border-left: 0;
        border-top: 0;
      }
      &:last-child {
        border-right: 0;
        border-bottom: 0;
      }
    }
  }
}
</style>
<script setup></script>
