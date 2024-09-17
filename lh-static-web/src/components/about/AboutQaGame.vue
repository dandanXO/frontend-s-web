<template>
  <div class="top-container">
    <h3 class="title">赛事没有完成怎么办？</h3>
    <div class="content">
      如果比赛没有完成（例如：队员退赛、取消资格或游戏服务器的问题），所有该赛事的投注将被视为无效。
    </div>

    <h3 class="title">队伍/选手名字出现错误怎么办？</h3>
    <div class="content">如果填写运动队/选手名字时出现拼写错误，所有投注仍会有效。</div>

    <h3 class="title">并非使用本队人员进行比赛怎么办？</h3>
    <div class="content">如一个队伍或者两个队伍有较少队员进行比赛，所有的投注视为有效。</div>

    <h3 class="title">赛事提前开赛怎么办？</h3>
    <div class="content">如赛事在原定比赛前提前开始，在赛事开始后的所有注单视为无效。</div>

    <h3 class="title">投注类型</h3>
    <div class="content">1. 独赢盘： 预测谁将会赢得这场比赛，任何形式的加时或补时将予以计算在内。</div>
    <div class="content">2. 让分盘： 电子竞技比赛的让分可以是轮/赛局或根据比赛不同选择其他的计量方式。</div>
    <div class="content">例如：</div>
    <div class="content">选手A -1.5 2.00</div>
    <div class="content">选手B +1.5 1.85</div>
    <div class="content">
      如果选手A赢比赛两赛局或以上，则投注选手A的玩家胜出，投注选手B的玩家落败。如果选手A只多赢了一局或选手B获胜，则投注选手B的玩家胜出，投注选手A的玩家落败。
    </div>

    <h3 class="title">大/小盘：</h3>
    <div class="content">
      1. 预测在比赛中的总地图数/回合数是否大于或小于盘口数，任何形式的额外时间或加时赛均计算在内。
    </div>

    <h3 class="title">特别投注类型</h3>
  </div>
</template>

<style scoped lang="scss">
.top-container {
  font-family: Microsoft YaHei;
  font-size: 18px;
  font-weight: 400;
  line-height: 40px;
  letter-spacing: 0em;
  text-align: left;
}

.title {
  color: #424f72;
  margin: 20px 0 0px;
  font-weight: 600;
  font-size: 1.125rem;
}

.content {
  color: #a4aabb;
  font-size: 1.125rem;
}
</style>
