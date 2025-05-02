<template>
  <img src="../../../assets/promo/lh-vip/info.png" alt="" />
  <img src="../../../assets/promo/lh-vip/title1.png" alt="" style="width: 56%; margin: 0 auto" />
  <img src="../../../assets/promo/lh-vip/title1-1.png" alt="" style="width: 75%; margin: 0 auto; margin-top: 12px" />
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>VIP 等级</th>
          <th>升级条件 (流水)</th>
          <th>保级条件 (90 天)</th>
          <th>晋级彩金</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="level in vipLevel1s" :key="level.vip">
          <td>{{ level.vip }}</td>
          <td>{{ formatNumber(level.upgrade) }}</td>
          <td>{{ formatNumber(level.maintain) }}</td>
          <td>{{ level.bonus }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <img src="../../../assets/promo/lh-vip/title1-2.png" alt="" style="width: 75%; margin: 0 auto; margin-top: 12px" />
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th style="width: 15%">VIP 等级</th>
          <th style="width: 15%">生日礼金</th>
<!--          <th style="width: 15%">节日彩金</th>-->
          <th>每日额外返水红包</th>
          <th>每月15号红包</th>
          <th>充值赠送20%奖金</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="level in vipLevel2s" :key="level.vip">
          <td>{{ level.vip }}</td>
          <td>{{ formatNumber(level.birthdayGift) }}</td>
<!--          <td>{{ formatNumber(level.holidayBonus) }}</td>-->
          <td>{{ formatNumber(level.dailyTurnoverGift) }}</td>
          <td>{{ formatNumber(level.weeklyDepositBonus) }}</td>
          <td>{{ formatNumber(level.monthlyUpgradeBonus) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <img src="../../../assets/promo/lh-vip/title1-3.png" alt="" style="width: 75%; margin: 0 auto; margin-top: 12px" />
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>VIP 等级</th>
          <th>首次保级彩金</th>
          <th>年度保级彩金</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="level in vipLevel3s" :key="level.name">
          <td>{{ level.name }}</td>
          <td>{{ formatNumber(level.firstBonus) }}</td>
          <td>{{ formatNumber(level.yearlyBonus) }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <img src="../../../assets/promo/lh-vip/title1-4.png" alt="" style="width: 75%; margin: 0 auto; margin-top: 12px" />
  <div class="table-container">
    <table class="table-4">
      <thead>
        <tr>
          <th>VIP 等级</th>
          <th>电竞</th>
          <th>体育</th>
          <th>真人</th>
          <th>棋牌</th>
          <th>电子</th>
          <th>返水上限</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="level in vipLevel4s" :key="level.name">
          <td>{{ level.vip }}</td>
          <td>{{ level.eSport }}</td>
          <td>{{ level.sport }}</td>
          <td>{{ level.real }}</td>
          <td>{{ level.card }}</td>
          <td>{{ level.el }}</td>
          <td>{{ level.waterLimit }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <img src="../../../assets/promo/lh-vip/rule.png" alt="" style="width: 56%; margin: 0 auto; margin-top: 12px" />

  <div class="rules-container">

    <div class="content">
      <p>
        <strong>一。会员晋级/保级/降级规则</strong>
        <ol class="terms got-bullets">
          <li>完成等级要求的累计有效流水后系统于次日北京时间早上10点自动更新，具体完成时间以系统为准，请耐心等待；</li>
          <li>VIP 等级达到相应的要求可每天晋升一级，但 VIP 等级不可越级晋升；</li>
          <li>会员在达到某 VIP 等级后，90 天内投注需要完成保级要求。如果在此期间完成晋升，保级要求重新按照当前等级计算；</li>
          <li>
            假设会员在一个季度（90 天计算）内没有完成相应的保级要求流水，系统会自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级；
          </li>
          <li>每个级别的升级礼金每位会员仅能获得 1 次（升级礼金 1 倍流水即可提款）；</li>
        </ol>
      </p>

      <p>
        <strong>二。生日礼金</strong>
        <ol class="terms non-style">
          <li>
            生日符合资格的会员，每年生日当天及当天后 7 日内到在线客服提供相关资料申请生日礼金，逾期不补，彩金 1 倍流水即可提款；
          </li>
        </ol>
      </p>

      <p>
        <strong>三。首次保级彩金</strong>
        <ol class="terms non-style">
          <li>
            会员在90天保级期内达到保级要求时，第 91 天即可领取首次保级彩金，首次保级彩金1倍流水即可提款。
          </li>
        </ol>
      </p>

      <p>
        <strong>四。年度保级彩金</strong>
        <ol class="terms non-style">
          <li>首次保级成功后计算会员 12 个月内未降级（可晋级），彩金于第 13 个月首日进行派发；彩金 1 倍流水即可提款</li>
        </ol>
      </p>

      <p>
        <strong>每日额外返水红包</strong>
        <ol class="terms non-style">
          <li>
            统计每日返水金额，对应VIP等级返水加赠比例派发。次日可领取每日额外返水红包彩金，返水红包积累至10元即可领取（不足10元则不可领取），彩金1倍流水即可提款。<br/>
            例：VIP12会员当日的返水金额为1000元，则按照VIP12每日额外返水红包赠送比例2.0%计算：1000*2.0%=20元，返水红包为20元，会员可在页面上点击领取。
          </li>
        </ol>

      </p>

      <p>
        <strong>六。每月15号红包</strong>
        <ol class="terms non-style">
          <li>
            会员日为每月15号00:00起：雷火会员在上个月有任意一笔有效存款，即可在会员日15号00:00至21号23:59期间领取对应等级的会员日礼金（以领取时的等级为准）会员礼金仅需三倍流水即可出款，过期未领者则视为主动放弃：
          </li>
        </ol>
      </p>

      <p>
        <strong>七。充值赠送20%奖金</strong>
        <ol class="terms got-bullets">
          <li class="numbered">
            VIP1及以上会员在会员日当天至21号23:59可登录VIP活动页面领取专属充值加码券且加码券需在15日内在充值页面进行勾选优惠使用，成功使用后需要（本金+彩金）x8倍流水即可提款；
          </li>
          <li class="numbered">加码券使用当日不可与其他存款优惠共享。</li>
        </ol>

      </p>

<!--      <p>-->
<!--        <strong>八。节日礼金</strong>-->
<!--        <ol class="terms non-style" >-->
<!--          <li class="numbered">-->
<!--            每年特殊重大节日，等级≥VIP8 的会员可在节日当天通过在线客服申请礼金，逾期不补；礼金 1 倍流水即可提款，具体节日礼金派发时间，请以客服站内信通知为准；-->
<!--          </li>-->
<!--        </ol>-->

<!--      </p>-->

      <p>
        <strong>八。一般规则</strong>
        <ol class="terms got-bullets">
          <li class="numbered">
            有效流水仅计算在游戏中产生输赢结果的注单，香港盘&lt;0.7（中国盘&lt;0.7）、欧洲盘&lt;1.7、美国盘 -143、印尼盘 -1.42、马来盘&lt;0.7 且&gt;0，负赔率&gt;-0.7 且＜0、走水、注单取消、对冲、未结算、连串过关、平半盘、提前结算不计算为有效流水；
          </li>
          <li class="numbered">
            根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
          </li>
          <li class="numbered">
            此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP 地址视为同一账户，若有违规者，将不享受此红利；
          </li>
          <li class="numbered">为避免文字理解差异，雷火电竞保留此活动最终解释权；</li>
        </ol>
      </p>


    </div>

<!--    <ol>-->
<!--      <li v-for="rule in rules" :key="rule">{{ rule }}</li>-->
<!--    </ol>-->
  </div>
</template>
<script setup>
import { ref } from "vue";

const vipLevel1s = ref([
  { vip: "VIP1", upgrade: 3000, maintain: 1500, bonus: 8 },
  { vip: "VIP2", upgrade: 17500, maintain: 7500, bonus: 18 },
  { vip: "VIP3", upgrade: 50000, maintain: 19000, bonus: 28 },
  { vip: "VIP4", upgrade: 150000, maintain: 32500, bonus: 38 },
  { vip: "VIP5", upgrade: 600000, maintain: 75000, bonus: 58 },
  { vip: "VIP6", upgrade: 1200000, maintain: 200000, bonus: 88 },
  { vip: "VIP7", upgrade: 2400000, maintain: 620000, bonus: 188 },
  { vip: "VIP8", upgrade: 6400000, maintain: 1900000, bonus: 288 },
  { vip: "VIP9", upgrade: 24000000, maintain: 6250000, bonus: 388 },
  { vip: "VIP10", upgrade: 64000000, maintain: 12500000, bonus: 588 },
  { vip: "VIP11", upgrade: 150000000, maintain: 21000000, bonus: 888 },
  { vip: "VIP12", upgrade: 250000000, maintain: 50000000, bonus: 1888 }
]);

const vipLevel2s = ref([
  {
    vip: "VIP1",
    birthdayGift: "-",
    holidayBonus: "-",
    dailyTurnoverGift: "0.1%",
    weeklyDepositBonus: 5,
    monthlyUpgradeBonus: 38
  },
  {
    vip: "VIP2",
    birthdayGift: "-",
    holidayBonus: "-",
    dailyTurnoverGift: "0.2%",
    weeklyDepositBonus: 8,
    monthlyUpgradeBonus: 88
  },
  {
    vip: "VIP3",
    birthdayGift: "-",
    holidayBonus: "-",
    dailyTurnoverGift: "0.3%",
    weeklyDepositBonus: 18,
    monthlyUpgradeBonus: 158
  },
  {
    vip: "VIP4",
    birthdayGift: 38,
    holidayBonus: "-",
    dailyTurnoverGift: "0.5%",
    weeklyDepositBonus: 28,
    monthlyUpgradeBonus: 288
  },
  {
    vip: "VIP5",
    birthdayGift: 58,
    holidayBonus: "-",
    dailyTurnoverGift: "0.6%",
    weeklyDepositBonus: 38,
    monthlyUpgradeBonus: 388
  },
  {
    vip: "VIP6",
    birthdayGift: 88,
    holidayBonus: "-",
    dailyTurnoverGift: "0.8%",
    weeklyDepositBonus: 58,
    monthlyUpgradeBonus: 488
  },
  {
    vip: "VIP7",
    birthdayGift: 188,
    holidayBonus: "-",
    dailyTurnoverGift: "1.0%",
    weeklyDepositBonus: 68,
    monthlyUpgradeBonus: 588
  },
  {
    vip: "VIP8",
    birthdayGift: 288,
    holidayBonus: 188,
    dailyTurnoverGift: "1.2%",
    weeklyDepositBonus: 128,
    monthlyUpgradeBonus: 688
  },
  {
    vip: "VIP9",
    birthdayGift: 388,
    holidayBonus: 288,
    dailyTurnoverGift: "1.3%",
    weeklyDepositBonus: 208,
    monthlyUpgradeBonus: 788
  },
  {
    vip: "VIP10",
    birthdayGift: 588,
    holidayBonus: 388,
    dailyTurnoverGift: "1.5%",
    weeklyDepositBonus: 388,
    monthlyUpgradeBonus: 888
  },
  {
    vip: "VIP11",
    birthdayGift: 888,
    holidayBonus: 888,
    dailyTurnoverGift: "1.8%",
    weeklyDepositBonus: 588,
    monthlyUpgradeBonus: 1288
  },
  {
    vip: "VIP12",
    birthdayGift: 1888,
    holidayBonus: 1888,
    dailyTurnoverGift: "2.0%",
    weeklyDepositBonus: 888,
    monthlyUpgradeBonus: 2888
  }
]);

const vipLevel3s = ref([
  { name: "青铜", firstBonus: 18, yearlyBonus: 208 },
  { name: "白银", firstBonus: 58, yearlyBonus: 588 },
  { name: "黄金", firstBonus: 288, yearlyBonus: 1088 },
  { name: "铂金", firstBonus: 588, yearlyBonus: 1888 },
  { name: "钻石", firstBonus: 888, yearlyBonus: 2888 },
  { name: "王者", firstBonus: 1888, yearlyBonus: 8888 }
]);

const vipLevel4s = ref([
  { vip: "VIP0", eSport: "0.45%", sport: "0.40%", real: "0.40%", card: "0.40%", el: "0.60%", waterLimit: "8,888" },
  { vip: "VIP1", eSport: "0.45%", sport: "0.40%", real: "0.45%", card: "0.45%", el: "0.60%", waterLimit: "8,888" },
  { vip: "VIP2", eSport: "0.45%", sport: "0.40%", real: "0.45%", card: "0.45%", el: "0.60%", waterLimit: "8,888" },
  { vip: "VIP3", eSport: "0.48%", sport: "0.45%", real: "0.45%", card: "0.45%", el: "0.60%", waterLimit: "12,888" },
  { vip: "VIP4", eSport: "0.48%", sport: "0.45%", real: "0.45%", card: "0.50%", el: "0.80%", waterLimit: "18,888" },
  { vip: "VIP5", eSport: "0.48%", sport: "0.50%", real: "0.48%", card: "0.55%", el: "0.80%", waterLimit: "18,888" },
  { vip: "VIP6", eSport: "0.50%", sport: "0.50%", real: "0.50%", card: "0.60%", el: "0.80%", waterLimit: "28,888" },
  { vip: "VIP7", eSport: "0.50%", sport: "0.55%", real: "0.55%", card: "0.70%", el: "0.85%", waterLimit: "28,888" },
  { vip: "VIP8", eSport: "0.55%", sport: "0.60%", real: "0.65%", card: "0.80%", el: "0.90%", waterLimit: "38,888" },
  { vip: "VIP9", eSport: "0.55%", sport: "0.65%", real: "0.68%", card: "0.90%", el: "1.00%", waterLimit: "58,888" },
  { vip: "VIP10", eSport: "0.60%", sport: "0.70%", real: "0.70%", card: "1.00%", el: "1.05%", waterLimit: "88,888" },
  { vip: "VIP11", eSport: "0.70%", sport: "0.75%", real: "0.75%", card: "1.10%", el: "1.10%", waterLimit: "88,888" },
  { vip: "VIP12", eSport: "0.80%", sport: "0.80%", real: "0.80%", card: "1.20%", el: "1.20%", waterLimit: "128,888" }
]);

// const rules = ref([
//   "晋升标准：会员累计投注额达到相应级别的要求，即可在次日 24 点前晋级相应 VIP 等级；",
//   "晋升顺序：VIP 等级达到相应的要求可每天晋升一级，但 VIP 等级不可越级晋升；",
//   "保级要求：会员在达到某 VIP 等级后，90 天内投注需要完成保级要求。如果在此期间完成晋升，保级要求重新按照当前等级计算；",
//   "升级礼金：每个级别的升级礼金每位会员仅能获得 1 次（升级礼金 1 倍流水即可提款）；",
//   "生日礼金：会员在注册 90 天内过生日，本年度内将不能领取生日礼金。另注册时间大于 90 天的会员需在生日当天的 VIP 页面进行自助领取，每年可领取一次（生日彩金 1 倍流水即可提款）；",
//   "VIP 首次保级金：当月晋级后未晋级且达到保级要求，次月 1 日可领取保级彩金；",
//   "年度保级彩金：首次保级成功后计算会员 12 个月内未降级（可晋级），彩金与第 13 个月首日进行派发；",
//   "每日返水红包：统计每日返水金额，对应 VIP 等级返水加赠比例派发。次日可领取每日 9、反水加赠礼金，返水加赠礼金达到 10 元即可领取，礼金无流水限制；",
//   "每月会员日：从每月会员日 15 号 00:00:00 起，相应等级的玩家只要在上月有一笔及其以上的存款，即可在活动页面领取一次会员红包（以领取时的等级为准），领取时间截至 24 号 23:59:59，仅需完成一倍流水，过期未领取视为放弃；",
//   "会员加码：1.非 0 级玩家从会员日 18 号 00:00:00 起均可在活动页面领取一张“10% 充值加码券”，领取时间截至 21 号 23:59:59，且领取后需在 7 日内使用充值加码券，成功使用后需在 15 日内完成相应流水要求；",
//   "本加码券单日内不可与其他活动加码券同时使用；",
//   "有效流水仅计算在游戏中产生输赢结果的注单，香港盘<0.75（中国盘<0.75）、欧洲盘<1.75、美洲盘<-133、马来盘<0.75 且>0，负赔率>-0.75 且＜0、走水、注单取消、对冲、未结算、连串过关、平半盘、提前结算不计算为有效流水；",
//   "根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；",
//   "此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP 地址视为同一账户，若有违规者，将不享受此红利；",
//   "为避免文字理解差异，雷火电竞保留此活动最终解释权；"
// ]);

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>

<style scoped>
.table-container {
  font-family: Arial, sans-serif;
  padding: 1px;
  .table-4{

  }
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #f2f5ff !important;
  border-radius: 10px;
  overflow: hidden;
  font-size: 0.95rem;
}

th,
td {
  border: 1px solid #b3d9ff;
  background-color: #f2f5ff !important;
  padding: 8px;
  text-align: center;
}

th {
  background: linear-gradient(#74b3ff 9.12%, #286cde 95.38%);

  color: white;
}

tr:nth-child(even) {
  background-color: #f0f8ff;
}

.top-left {
  border-top-left-radius: 10px;
}

.top-right {
  border-top-right-radius: 10px;
}

.bottom-left {
  border-bottom-left-radius: 10px;
}

.bottom-right {
  border-bottom-right-radius: 10px;
}

.rules-container {
  font-size: 12px;

  p{
    margin-bottom: 10px;
  }

  strong{
    font-size: 14px;
  }

  .content{
    padding: 12px 0px 16px;
  }


  .terms{
    list-style: disc;
    padding: 0px 0px 0px 15px !important;

    &.got-bullets {
      margin-left: 12px;
    }
  }

  .non-style{
    list-style: none;
  }
}

ol {
  padding-left: 20px;
}

li {
  margin-bottom: 10px !important;
  line-height: 1.5;
}
</style>
