<template>
  <div class="section-wrapper">
    <div class="match-info">
      <slot />
    </div>
    <event-description class="event-description">
      当日投注MSI季中冠军赛滚球盘累计投注≥1,000且最终结算盈利≥500以上即可获得对应的盈利彩金。若MSI季中冠军赛最终结算为负盈利≥1,000也可获得对应负盈利返比。
    </event-description>
    <table class="deposit-table">
      <thead>
        <tr>
          <th rowspan="2">累计盈利</th>
          <th>
            累计投注
            <br />
            ≥1,000
          </th>
          <th>
            累计投注
            <br />
            ≥10,000
          </th>
          <th>
            累计投注
            <br />
            ≥50,000
          </th>
        </tr>
        <tr>
          <th colspan="4">礼金额度</th>
        </tr>
      </thead>
      <tr>
        <td>≥500</td>
        <td>8</td>
        <td>58</td>
        <td>88</td>
      </tr>
      <tr>
        <td>≥1,000</td>
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
    </table>

    <section-header label="特惠返利场" class="special-promo-section-header" />
    <table class="deposit-table special-promo-table">
      <thead>
        <tr>
          <th>累计负盈利</th>
          <th>好运金</th>
          <th>彩金上限</th>
          <th>流水倍数</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>≥1,000</td>
          <td>负盈利金额3%</td>
          <td>888元</td>
          <td>3倍</td>
        </tr>
      </tbody>
    </table>
    <div class="remark">注：当日所有MSI赛事滚球盘口结算金额相加，以总结算金额判定正负盈利。</div>
    <event-rule>
      <ul class="event-rule">
        <li>
          活动期间，投注当日MSI季中冠军赛滚球盘累计投注≥1,000元且最终结算盈利≥500元以上即可获得对应的盈利彩金。若MSI季中赛最终结算为负盈利≥1,000元也可获得对应负盈利返比
          ；
        </li>
        <li>活动无需申请，符合条件的会员彩金于次日24内统一派发，彩金仅需3倍流水即可提款；</li>
        <li>
          任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
        </li>
        <li>
          根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
        </li>
        <li>
          此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及IP地址视为同一账户，若有违规者，将不享受此红利；
        </li>
        <li>为避免文字理解差异，东赢电竞保留此活动最终解释权；</li>
      </ul>
    </event-rule>
  </div>
</template>
<script setup>
import SectionHeader from "./SectionHeader.vue";
import EventDescription from "./EventDescription.vue";
import EventRule from "./EventRule.vue";
</script>
<style scoped lang="scss">
@import "../style/section.scss";

.event-description {
  margin-bottom: 63px;
}

table {
  margin-bottom: 61px;
}

.special-promo-section-header {
  margin-bottom: 31px;
}

.special-promo-table {
  margin-bottom: 41px;
}
</style>
