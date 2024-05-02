<template>
  <div class="section-wrapper">
    <section-header label="BO3-5比赛" class="section-header" />
    <div class="match-info">
      <slot />
    </div>
    <event-description class="event-description">
      投注当日MSI季中冠军赛BO3-BO5局总有效投注≥1,000即可获得对应金额，最高可获
      <span class="event-description-highlight">1,888元</span>
      。
    </event-description>
    <table class="deposit-table">
      <thead>
        <tr>
          <th>有效投注</th>
          <th>投注彩金</th>
          <th>雷火专属彩金</th>
          <th>流水倍数</th>
        </tr>
      </thead>
      <tr>
        <td>≥1,000</td>
        <td>5</td>
        <td>8</td>
        <td rowspan="6">3倍/不限场馆</td>
      </tr>
      <tr>
        <td>≥5,000</td>
        <td>30</td>
        <td>50</td>
      </tr>
      <tr>
        <td>≥10,000</td>
        <td>88</td>
        <td>108</td>
      </tr>
      <tr>
        <td>≥50,000</td>
        <td>318</td>
        <td>388</td>
      </tr>
      <tr>
        <td>≥100,000</td>
        <td>588</td>
        <td>888</td>
      </tr>
      <tr>
        <td>≥500,000</td>
        <td>1288</td>
        <td>1888</td>
      </tr>
    </table>

    <div class="remark">
      例：用户在MSI季中总决赛赛中有效投注9000元，其中雷火电竞投注5,000元，其他电竞场馆投注4,000元，累计MSI季中总决赛有效投投注9000元，彩金则按雷火专属礼金派发，用户次日可获50元。
    </div>
    <event-rule>
      <ul class="event-rule">
        <li>
          活动期间，会员当日MSI季中赛BO3(第3局-第5局)累计总有效投注≥1,000元即可获得对应彩金，BO1与BO2有效投注不在统计范围内；
        </li>
        <li>活动期间，活动计算当日MSI季中赛BO3(第3局-第5局)赛事总有效投注，次日清零重新计算。活动无需申请自动派发；</li>
        <li>仅统计电竞场馆所产生的有效投注，其他场馆不在统计范围内，彩金次日24小时内统一派发，彩金3倍流水即可提款；</li>
        <li>活动期间，会员在雷火电竞场馆娱乐并达到对应投注金额可获得雷火专属礼金，彩金以最高档位派发；</li>
        <li>
          任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
        </li>
        <li>
          根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
        </li>
        <li>
          此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及IP地址视为同一账户，若有违规者，将不享受此红利；
        </li>
        <li>为避免文字理解差异，雷火电竞保留此活动最终解释权；</li>
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
  margin-bottom: 31px;
}

table {
  margin-bottom: 31px;
}
</style>
