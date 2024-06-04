<template>
  <div class="about-info">
    <div class="info-section">
      <div class="title">1、电子竞技规则</div>
      <div class="desc">电子竞技比赛的开始时间日期仅供参考，并不能保证完全正确。</div>
      <div class="desc">如赛事暂停或者推迟，没有在原定开始时间12小时内恢复比赛，所有注单将视为无效。</div>
      <div class="desc">冠军盘口，任何投注在球员获胜/球队赛事获胜的盘口，无论比赛是否暂停或推迟，注单均视为有效。</div>
    </div>
    <div class="info-section">
      <div class="title">2、让分盘</div>
      <div class="desc">预测计算让分结果的胜者。任何形式的加时赛或额外时间均计算在内。</div>
      <div class="desc">在电子竞技赛事中，让分可被视为让回合/地图或其他计算方式，具体取决于相关赛事。</div>
      <div class="desc">让分盘口类型仅会显示让分。</div>
      <div class="desc">如由于队员/队伍退赛或取消资格，而未能完成比赛，所有投注在让分盘口的注单视为无效。</div>
      <div class="desc">如公布的比赛地图数/回合数变更，则所有投注在让分盘口的注单视为无效。。</div>
    </div>
    <div class="info-section">
      <div class="title">3、单双盘</div>
      <div class="desc">预测赛事的总地图数/回合数是单数或双数。</div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.about-info {
  .info-section {
    margin: 20px 0 0 0;
    color: #424f72;
    font-family: Microsoft YaHei;
    font-weight: 700;
    line-height: 193.482%;

    .title {
      font-size: 1rem;
      letter-spacing: 0.1rem;
    }

    .desc {
      font-size: 0.875rem;
      letter-spacing: 0.04375rem;
    }
  }
}

.dark {
  .about-info {
    .info-section {
      color: inherit;
    }
  }
}
</style>
