<template>
  <div class="ftd-promo-content-frame">
    <div class="row">
      <img width="25px" src="../../../assets/images/promotion/hotpromo/ftd/diamond-bullet.png" />
      <span>活动期间新会员首次存款时可申请一次电竞首存优惠</span>
    </div>

    <div class="stats-table-wrapper">
      <table class="stats-table">
        <tr>
          <th>首存金额</th>
          <th>红利比例</th>
          <th>红利上限</th>
          <th>流水倍数</th>
        </tr>
        <tr>
          <td>≥500元</td>
          <td>55%</td>
          <td rowspan="3">688元</td>
          <td rowspan="3">15倍</td>
        </tr>
        <tr>
          <td>≥300元</td>
          <td>28%</td>
          <td style="visibility: hidden"></td>
          <td style="visibility: hidden"></td>
        </tr>
        <tr>
          <td>≥100元</td>
          <td>12%</td>
          <td style="visibility: hidden"></td>
          <td style="visibility: hidden"></td>
        </tr>
      </table>
    </div>

    <div class="hint">注：首存金额以第一笔存款金额为准</div>

    <div class="notes">
      <p>
        &#x2022;&nbsp;每位新用户自注册日起30天内可选择参与1次首存返利，在本活动页面选择好首存场馆后，点击【点击首存】按钮跳转至存款页面后，核实优惠一栏是否是您申请的优惠按钮，确认无误后进行存款即可；
      </p>
      <p>
        &#x2022;&nbsp;申请奖金后需在指定电竞游戏中完成相对应的流水要求，当用户对应电竞钱包余额＜最低投注额且无未结算注单时，系统将自动判定已完成活动规定的有效流水；
      </p>
      <p>
        &#x2022;&nbsp;此活动不与任何存款活动共享，所有存款活动存款金额与本活动存款金额无关，每个账户仅限申请一次。活动奖金比例以第一笔存款金额为准；
      </p>
      <p>
        &#x2022;&nbsp;有效流水仅计算产生输赢结果的注单，电竞赔率≥1.7、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；
      </p>
      <p>
        &#x2022;&nbsp;每位有效玩家、每个手机号码、电子邮箱、银行卡、IP地址、设备只能使用一个账号享受优惠，如发现有违规者我们将保留无限期审核扣回红利以及所产生的利润权利；
      </p>
      <p>&#x2022;&nbsp;此活动最终解释权归雷火所有；</p>
    </div>
  </div>
</template>
<script setup>
import "./styles.scss";

const props = defineProps(["tab", "type"]);
</script>
