<template>
  <div class="section-wrapper">
    <div class="match-info">
      <slot />
    </div>
    <event-description class="event-description">
      活动期间，当日累计早盘有效投注≥
      <span class="event-description-highlight">1,888元</span>
      且第一场比赛第一局触发特殊事件即可获得彩金。
    </event-description>
    <table class="deposit-table">
      <thead>
        <tr>
          <th rowspan="2">早盘有效投注</th>
          <th colspan="2">特殊事件及返利彩金</th>
          <th rowspan="2">流水倍数</th>
        </tr>
        <tr>
          <th>速战速决</th>
          <th>黄金持久</th>
        </tr>
      </thead>
      <tr>
        <td>≥1888</td>
        <td>18</td>
        <td>38</td>
        <td rowspan="5">1倍流水</td>
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
    </table>
    <table class="remark-table">
      <tr class="divider">
        <th>速战速决</th>
        <td>BO1比赛中游戏比赛时间≤30分钟</td>
      </tr>
      <tr>
        <th>黄金持久</th>
        <td>BO1比赛中游戏比赛时间≥30分钟</td>
      </tr>
    </table>
    <event-rule>
      <ul class="event-rule">
        <li>活动期间，投注MSI季中冠军赛盘口早盘有效投注≥1,888元并完成特殊事件即可获得对应彩金；</li>
        <li>
          活动期间，每场特殊事件判定标准为如下：
          <br />
          &nbsp;&nbsp;&nbsp;速战速决：第一局比赛中比赛时间≤30分钟；
          <br />
          &nbsp;&nbsp;&nbsp;黄金持久：第一局比赛中比赛时间≥30分钟；
          <br />
          &nbsp;&nbsp;&nbsp;特殊事件以当日第一场MSI赛事第一局比赛为准；
        </li>
        <li>活动无需申请，符合条件的会员，彩金于次日24小时内统一派发，彩金3倍流水即可提款；</li>
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
  margin-bottom: 37px;
}

table {
  margin-bottom: 26px;
}

.remark-table {
  align-self: start;

  th,
  td {
    text-align: left;
    border: none;
    padding: 16px;
    font-family: Microsoft YaHei UI;
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .divider {
    border-bottom: 2px solid #ffffff33 !important;
  }

  th {
    background: linear-gradient(180deg, #b42614 0%, #7b0101 100%) !important;
    color: #ffffff !important;
  }

  td {
    color: #ffa800 !important;
    background: #342d2d66 !important;
    border: none !important;
    border-left: 2px solid #ffffff33 !important;
  }
}
</style>
