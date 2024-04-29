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
  </div>
</template>
<script setup>
import SectionHeader from "./SectionHeader.vue";
import EventDescription from "./EventDescription.vue";
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
