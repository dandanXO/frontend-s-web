<template>
  <div class="vip-container">
    <div class="vip_clude">
      <VipCarousel />

      <div class="vip_table">
        <table border="0" cellpadding="0" cellspacing="0" id="vip_detail">
          <thead>
            <tr>
              <th>等级</th>
              <th>升级要求/元</th>
              <th>保级要求</th>
              <th style="text-align: center">
                生日礼金
                <br />
                (1倍)
              </th>
              <th style="text-align: center">
                每月红包
                <br />
                (3倍)
              </th>
              <th width="280">每月优惠</th>
              <th>优惠流水要求</th>
              <th>平台限制</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>VIP1</td>
              <td>有一笔存款</td>
              <td>无</td>
              <td>无</td>
              <td>无</td>
              <td>无</td>
              <td>无</td>
              <td>无</td>
            </tr>
            <tr>
              <td>VIP2</td>
              <td>5000≤累积存款</td>
              <td>1888≤一个月内累积存款</td>
              <td>38元</td>
              <td>28元</td>
              <td>存款至少100元可申请每月一次再存20% 最高奖金588元</td>
              <td>12</td>
              <td>电竞/体育</td>
            </tr>
            <tr>
              <td>VIP3</td>
              <td>50000≤累积存款</td>
              <td>10888≤一个月内累积存款</td>
              <td>108元</td>
              <td>88元</td>
              <td>存款至少100元可申请每月一次再存20%最高奖金888元</td>
              <td>12</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP4</td>
              <td>250000≤累积存款</td>
              <td>38888≤一个月内累积存款</td>
              <td>388元</td>
              <td>188元</td>
              <td>存款至少100元可申请每周一次再存25% 最高奖金888元</td>
              <td>12</td>
              <td>电竞/体育</td>
            </tr>
            <tr>
              <td>VIP5</td>
              <td>500000≤累积存款</td>
              <td>58888≤一个月内累积存款</td>
              <td>688元</td>
              <td>388元</td>
              <td>存款至少500元可申请每月一次再存50% 最高奖金1888元</td>
              <td>15</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP6</td>
              <td>2500000≤累积存款</td>
              <td>88888≤一个月内累积存款</td>
              <td>1088元</td>
              <td>888元</td>
              <td>存款至少500元可申请每周一次再存30% 最高奖金2888元</td>
              <td>15</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP7</td>
              <td>5000000≤累积存款</td>
              <td>188888≤一个月内累积存款</td>
              <td>6888元</td>
              <td>2888元</td>
              <td>存款至少500元可申请每周一次再存35% 最高奖金3888元</td>
              <td>15</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP8</td>
              <td>8000000≤累积存款</td>
              <td>288888≤一个月内累积存款</td>
              <td>8888元</td>
              <td>5888元</td>
              <td>存款至少500元可申请每周一次再存40% 最高奖金5888元</td>
              <td>15</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP9</td>
              <td>12000000≤累积存款</td>
              <td>588888≤一个月内累积存款</td>
              <td>10888元</td>
              <td>6888元</td>
              <td>存款至少500元可申请每周一次再存45% 最高奖金8888元</td>
              <td>15</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP10</td>
              <td>20000000≤累积存款</td>
              <td>888888≤一个月内累积存款</td>
              <td>18888元</td>
              <td>8888元</td>
              <td>存款至少500元可申请每周一次再存50% 最高奖金12888元</td>
              <td>15</td>
              <td>所有（彩票除外）</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="vip_table">
        <table border="0" cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <th>等级</th>
              <th>VIP1</th>
              <th>VIP2</th>
              <th>VIP3</th>
              <th>VIP4</th>
              <th>VIP5</th>
              <th>VIP6</th>
              <th>VIP7</th>
              <th>VIP8</th>
              <th>VIP9</th>
              <th>VIP10</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>电竞返水</td>
              <td>0.40%</td>
              <td>0.40%</td>
              <td>0.45%</td>
              <td>0.45%</td>
              <td>0.50%</td>
              <td>0.55%</td>
              <td>0.65%</td>
              <td>0.80%</td>
              <td>0.90%</td>
              <td>1.00%</td>
            </tr>
            <tr>
              <td>体育返水</td>
              <td>0.40%</td>
              <td>0.40%</td>
              <td>0.45%</td>
              <td>0.45%</td>
              <td>0.50%</td>
              <td>0.55%</td>
              <td>0.65%</td>
              <td>0.80%</td>
              <td>0.90%</td>
              <td>1.00%</td>
            </tr>
            <tr>
              <td>真人返水</td>
              <td>0.40%</td>
              <td>0.40%</td>
              <td>0.45%</td>
              <td>0.45%</td>
              <td>0.50%</td>
              <td>0.55%</td>
              <td>0.65%</td>
              <td>0.80%</td>
              <td>0.90%</td>
              <td>1.00%</td>
            </tr>
            <tr>
              <td>电子返水</td>
              <td>0.50%</td>
              <td>0.60%</td>
              <td>0.70%</td>
              <td>0.80%</td>
              <td>0.90%</td>
              <td>1.20%</td>
              <td>1.50%</td>
              <td>1.80%</td>
              <td>1.90%</td>
              <td>2.00%</td>
            </tr>
            <tr>
              <td>棋牌返水</td>
              <td>0.50%</td>
              <td>0.60%</td>
              <td>0.70%</td>
              <td>0.75%</td>
              <td>0.80%</td>
              <td>0.85%</td>
              <td>0.90%</td>
              <td>0.95%</td>
              <td>1.00%</td>
              <td>1.20%</td>
            </tr>
            <tr>
              <td>返水上限</td>
              <td colspan="3" style="text-align: center">18888元</td>
              <td colspan="3" style="text-align: center">38888元</td>
              <td colspan="2" style="text-align: center">58888元</td>
              <td colspan="2" style="text-align: center">88888元</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="vip_ruler">
      <div class="ruler_title">
        <h1>规则与条款</h1>
      </div>
      <ul class="role-list">
        <li style="">
          <span class="role-list-decimal">1</span>
          晋升标准
          <br />
          会员的累计有效存款额达到相应级别的要求，即可在当日24点前晋级相应VIP等级。
        </li>
        <li style="">
          <span class="role-list-decimal">2</span>
          晋升顺序
          <br />
          VIP等级达到相应的要求可每天晋升一级，但VIP等级不可越级晋升。
        </li>
        <li style="">
          <span class="role-list-decimal">3</span>
          降级标准
          <br />
          如果会员在上月（自然月）内没有完成相应的保级要求，系统会在月初自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级。
        </li>
        <li style="">
          <span class="role-list-decimal">4</span>
          生日礼金
          <br />
          VIP2或以上等级会员可享受生日礼金，每年仅可领取一次。（生日彩金1倍流水即可提款）
        </li>
        <li style="">
          <span class="role-list-decimal">5</span>
          每月红包
          <br />
          每月1号会员即可登录账户领取每月红包。（每月红包彩金3倍流水即可提款）
        </li>
        <li style="">
          <span class="role-list-decimal" style="top: 10px">6</span>
          东赢保留对活动的修改，停止及最终解释权。
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import VipCarousel from "@/components/vip/Carousel/main.vue";
</script>

<style scoped lang="scss" src="@/scss/pages/vip.scss"></style>
