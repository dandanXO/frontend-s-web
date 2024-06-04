<template>
  <div class="section-wrapper">
    <div class="match-info">
      <slot />
    </div>
    <event-description class="event-description">
      活动期间，当日MSI比赛BLG与TES战队任意一队取得全场胜利即可根据对应有效投注获得对应彩金！
    </event-description>
    <table class="deposit-table">
      <thead>
        <tr>
          <th>有效投注</th>
          <th>胜利喝彩金</th>
          <th>流水倍数</th>
        </tr>
      </thead>
      <tr>
        <td>≥1,000</td>
        <td>8</td>
        <td rowspan="2">3倍/不限场馆</td>
      </tr>
      <tr>
        <td>≥5,000</td>
        <td>18</td>
      </tr>
    </table>

    <div class="remark">
      注：当日比赛队伍出现BLG或TES任意一队，两队其中一队取得全场胜利后，可根据有效投注获得加赠的胜利喝彩金。
    </div>
    <event-rule>
      <ul class="event-rule">
        <li>
          活动期间，投注当日MSI赛事有效投注≥1,000元且获得全局队伍有BLG或TES，即可根据对应有效投注获得对应的胜利喝彩金 ；
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
  margin-bottom: 31px;
}

table {
  margin-bottom: 31px;
}
</style>
