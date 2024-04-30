<template>
  <div class="section-wrapper">
    <section-header label="BO2比赛" class="section-header" />
    <div class="match-info">
      <slot />
    </div>
    <event-description class="event-description">
      活动内容修改为：当日投注MSI季中冠军赛BO2(第二局)累计投注≥1,000元且BO2最终结算盈利≥500元以上即可获得对应的盈利彩金。若MSI季中冠军赛BO2最终结算为负盈利≥1,000元也可获得对应负盈利返比。
    </event-description>
    <table class="deposit-table">
      <thead>
        <tr>
          <th rowspan="2">累计盈利</th>
          <th>累计投注≥1,000</th>
          <th>累计投注≥10,000</th>
          <th>累计投注≥50,000</th>
        </tr>
        <tr>
          <th>速战速决</th>
          <th colspan="3">礼金额度</th>
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
    <div class="remark">注：当日所有MSI赛事BO2局数结算金额相加，以总结算金额判定正负盈利。</div>
  </div>
</template>
<script setup>
import SectionHeader from "./SectionHeader.vue";
import EventDescription from "./EventDescription.vue";
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
