<template>
  <div class="top-container">
    <h3 class="title">百家乐介绍</h3>
    <div class="content">
      百家乐是一种简单的纸牌游戏，庄闲各首发两张手牌。双方最多三张牌，玩家可押注于【庄】或【闲】，点数最接近9点的一方即获胜，也可押注【和】局（即庄家和闲家的牌总点数相同）。
    </div>

    <h3 class="title">百家乐牌面</h3>
    <div class="content">
      公仔牌（J、Q、K）和10计算为0点，A是1点，其他牌按面值计算点数，每手牌的点值按照牌面总和的最后一位数字计算，比如，一手牌为K、3、5，点值为8（0+3+5=8）。
    </div>

    <h3 class="title">投注类型及赔付</h3>
    <div class="content">1. 庄家赢: 1赔0.95</div>
    <div class="content">2. 闲家赢: 1赔1</div>
    <div class="content">3. 和局: 1赔8</div>
    <div class="content">4. 百家乐第三张牌规则：</div>

    <h3 class="title">闲家 庄家</h3>
    <div class="content">起手牌点数总和 补牌规则 起手牌点数总和 补牌规则</div>
    <div class="content">0 须补牌 0 须补牌</div>
    <div class="content">1 须补牌 1 须补牌</div>
    <div class="content">2 须补牌 2 须补牌</div>
    <div class="content">3 须补牌 3 当闲家补得第三张牌是8，不须补牌；其余则须补牌</div>
    <div class="content">4 须补牌 4 当闲家补得第三张牌是0.1.8.9，不须补牌；其余则须补牌</div>
    <div class="content">5 须补牌 5 当闲家补得第三张牌是0.1.2.3.8.9，不须补牌；其余则须补牌</div>
    <div class="content">6 不须补牌 6 当闲家补得第三张牌是0.1.2.3.4.5.8.9，不须补牌；其余则须补牌</div>
    <div class="content">7 不须补牌 7 不须补牌</div>
    <div class="content">8 天生赢家 8 天生赢家</div>
    <div class="content">9 天生赢家 9 天生赢家</div>
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
