<template>
  <div class="tab-title">
    {{ tabtitle }}
  </div>

  <div class="remark">
    活动期间，欧洲杯开赛前需满足累积存款≥2000且有效流水≥6,000，开赛日当天24点前派发58元彩金，无需申请，欧洲杯开赛当日存款≥100元即可符合资格，开赛日当天24点前派发8元彩金。
  </div>
  <table>
    <tr>
      <th>达成条件</th>
      <th>开赛祝贺礼</th>
      <th>奖金派发时间</th>
      <th>奖金派发形式</th>
      <th>奖金流水</th>
    </tr>
    <tr>
      <td>6月1日~6月14日欧洲杯开赛前累计存款≥2000且有效流水≥6,000(有效流水不含电子、捕鱼)</td>
      <td>58</td>
      <td>欧洲杯开赛日</td>
      <td>无需申请</td>
      <td>3倍</td>
    </tr>
    <tr>
      <td>欧洲杯开赛当日存款100元</td>
      <td>8</td>
      <td>欧洲杯开赛日次日</td>
      <td>无需申请</td>
      <td>1倍</td>
    </tr>
  </table>
  <div class="rule-title">活动规则</div>
  <ol class="rule-content">
    <li>欧洲杯赛前与开赛日均有祝贺礼，以上述条件及奖金派发为准，符合条件的会员彩金于开赛日次日24小时内派发；</li>
    <li>此活动全体会员均可参与，参与前请完善个人资料，绑定手机号码及银行卡。超出活动规定时间则视为放弃逾期放弃彩金不予补发；</li>
    <li>仅计算已结算并产生输赢结果的注单，任何平局、串关、取消的注单不予计算，任何低于欧洲盘1.7、香港盘0.7赔率以下的注单以及在同一赛事中同时投注对等盘口将不予计算；</li>
    <li>每位有效会员、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑以及其他登录设备只能享受一次活动优惠，如有任何违规者或任何团体以不正常的方式进行套取活动优惠，我站保留在不通知的情况下冻结或关  闭相关账户的权利，并不退还款项，且用户列入黑名单；</li>
    <li>为避免文字理解差异，本站保留最终解释权；</li>
  </ol>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  tabtitle: String
});
</script>
<style scoped lang="scss">
table {
  tr {
    td:first-child {
      width: 35%;
    }
  }
}
</style>
<style lang="scss">
.rule-title,
.rule-content {
  font-family: Microsoft YaHei UI;
  line-height: 31.95px;
  letter-spacing: 0.12em;
  text-align: left;
  color: #ffffff;
  margin: 10px 0;
}
.rule-title {
  font-size: 22px;
  font-weight: 700;
  line-height: 42.6px;
}
.rule-content {
  font-size: 16px;
  font-weight: 400;
  margin: 10px;
}
.remark {
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 16px;
}
</style>
