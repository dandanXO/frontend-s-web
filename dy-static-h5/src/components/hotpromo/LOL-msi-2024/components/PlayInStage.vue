<template>
  <div class="section-wrapper">
    <section-header label="BO1比赛" class="section-header" />
    <div class="match-info">
      <slot />
    </div>
    <event-description class="event-description">
      投注指定赛事BO1，每场赛事早盘有效投注≥1,888元且完成特殊事件即可获得对应彩金。最高可获
      <span class="event-description-highlight">1,888元</span>
      。
    </event-description>
    <table class="deposit-table">
      <thead>
        <tr>
          <th rowspan="2">早盘有效投注</th>
          <th colspan="2">特殊时间及返利彩金</th>
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
        <td rowspan="5">1倍/不限场馆</td>
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
    <table></table>
    <table class="remark-table">
      <tr class="divider">
        <th>速战速决</th>
        <td>*BO1比赛中游戏时间≤30分钟</td>
      </tr>
      <tr>
        <th>黄金持久</th>
        <td>*BO1比赛中游戏时间≥40分钟</td>
      </tr>
    </table>
  </div>
</template>
<script setup>
import SectionHeader from "./SectionHeader.vue";
import EventDescription from "./EventDescription.vue";
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
    background: #051d4766 !important;
    border: none !important;
    border-left: 2px solid #ffffff33 !important;
  }
}
</style>
