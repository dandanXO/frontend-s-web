<template>
  <div class="ftd-promo-content-frame" v-if="props.tab === '复存'">
    <div class="row">
      <img width="25px" src="../../../assets/images/promotion/hotpromo/ftd/diamond-bullet.png" />
      <span>
        活动期间，新会员完成注册后的第二笔存款，即可申请一次捕鱼复存优惠，申请成功的用户可享受单笔存款最高30%的存款优惠。
      </span>
    </div>

    <div class="stats-table-wrapper">
      <table class="stats-table">
        <tr>
          <th>首存金额</th>
          <th>返利</th>
          <th>最高赠送彩金</th>
          <th>流水要求</th>
        </tr>
        <tr>
          <td>≥100</td>
          <td>30%</td>
          <td>388</td>
          <td>（本金+红利）X18捕鱼</td>
        </tr>
      </table>
    </div>

    <div class="notes">
      <p>1.&nbsp;活动期间，新用户注册后第二笔存款可选择参与一次复存返利，完成第二笔存款时可联系在线客服申请活动；</p>
      <p>
        2.&nbsp;申请奖金后需在捕鱼场馆中完成相对应的流水要求，当用户钱包余额＜最低投注额且无未结算注单时，系统将自动判定已完成活动规定的有效流水；
      </p>
      <p>
        3.&nbsp;此活动不与任何存款活动共享，所有存款活动存款金额与本活动存款金额无关，每个账户仅限申请一次。活动奖金比例以第一笔存款金额为准；
      </p>
      <p>
        4.&nbsp;对于发现任何有损害、欺骗、或利用规则和条款进行非法获利的会员，雷火电竞保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利
      </p>
      <p>
        5.&nbsp;.每位有效玩家、每个手机号码、电子邮箱、银行卡、IP地址、设备只能使用一个账号享受优惠，如发现有违规者我们将保留无限期审核扣回红利以及所产生的利润权利。
      </p>
      <p>6.&nbsp;此活动最终解释权归雷火所有；</p>
    </div>
  </div>
  <div class="ftd-promo-content-frame" v-else-if="props.tab === '首存'">
    <div class="row">
      <img width="25px" src="../../../assets/images/promotion/hotpromo/ftd/diamond-bullet.png" />
      <span>活动期间，新会员首次存款时可申请一次捕鱼首存优惠，申请成功的用户可享受单笔存款最高38%的存款优惠。</span>
    </div>

    <div class="stats-table-wrapper">
      <table class="stats-table">
        <tr>
          <th>首存金额</th>
          <th>返利</th>
          <th>最高赠送彩金</th>
          <th>流水要求</th>
        </tr>
        <tr>
          <td>≥100</td>
          <td>38%</td>
          <td>588</td>
          <td>（本金+红利）X15捕鱼</td>
        </tr>
      </table>
    </div>

    <div class="notes">
      <p>
        1.&nbsp;每位新用户自注册日起30天内可选择参与1次首存返利，在本活动页面选择好首存场馆后，点击【点击首存】按钮跳转至存款页面后，核实优惠一栏是否是您申请的优惠按钮，确认无误后进行存款即可；
      </p>
      <p>
        2.&nbsp;申请奖金后需在捕鱼场馆中完成相对应的流水要求，当用户钱包余额＜最低投注额且无未结算注单时，系统将自动判定已完成活动规定的有效流水；
      </p>
      <p>
        3.&nbsp;此活动不与任何存款活动共享，所有存款活动存款金额与本活动存款金额无关，每个账户仅限申请一次。活动奖金比例以第一笔存款金额为准；
      </p>
      <p>
        4.&nbsp;对于发现任何有损害、欺骗、或利用规则和条款进行非法获利的会员，雷火电竞保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利
      </p>
      <p>
        5.&nbsp;.每位有效玩家、每个手机号码、电子邮箱、银行卡、IP地址、设备只能使用一个账号享受优惠，如发现有违规者我们将保留无限期审核扣回红利以及所产生的利润权利。
      </p>
      <p>6.&nbsp;此活动最终解释权归雷火所有；</p>
    </div>
  </div>
</template>
<script setup>
import "./styles.scss";

const props = defineProps(["tab", "type"]);
</script>
