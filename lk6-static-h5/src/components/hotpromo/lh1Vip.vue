<template>
  <img src="../../../assets/promo/lh-vip/info.png" alt="">
  <img src="../../../assets/promo/lh-vip/title1.png" alt="" style="width: 56%;margin: 0 auto">
  <img src="../../../assets/promo/lh-vip/title1-1.png" alt="" style="width: 75%;margin: 0 auto;margin-top: 12px;">
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>VIP等级</th>
          <th>升级条件(流水)</th>
          <th>保级条件(90天)</th>
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
  <img src="../../../assets/promo/lh-vip/title1-2.png" alt="" style="width: 75%;margin: 0 auto;margin-top: 12px;">
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th style="width: 15%;">VIP等级</th>
          <th style="width: 15%;">生日礼金</th>
          <th style="width: 15%;">节日彩金</th>
          <th>每日返水红包</th>
          <th>会员日每月15号</th>
          <th>会员加码充值送10%加码券</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="level in vipLevel2s" :key="level.vip">
          <td>{{ level.vip }}</td>
          <td>{{ formatNumber(level.birthdayGift) }}</td>
          <td>{{ formatNumber(level.holidayBonus) }}</td>
          <td>{{ formatNumber(level.dailyTurnoverGift) }}</td>
          <td>{{ formatNumber(level.weeklyDepositBonus) }}</td>
          <td>{{ formatNumber(level.monthlyUpgradeBonus) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <img src="../../../assets/promo/lh-vip/title1-3.png" alt="" style="width: 75%;margin: 0 auto;margin-top: 12px;">
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>VIP等级</th>
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
  <img src="../../../assets/promo/lh-vip/rule.png" alt="" style="width: 56%;margin: 0 auto;margin-top: 12px;">

  <div class="rules-container">
      <ol>
        <li v-for="rule in rules" :key="rule">{{ rule }}</li>
      </ol>
    </div>
</template>
<script setup>
import { ref } from 'vue'

const vipLevel1s = ref([
  { vip: 'VIP1', upgrade: 3000, maintain: 1500, bonus: 8 },
  { vip: 'VIP2', upgrade: 17500, maintain: 7500, bonus: 18 },
  { vip: 'VIP3', upgrade: 50000, maintain: 19000, bonus: 28 },
  { vip: 'VIP4', upgrade: 150000, maintain: 32500, bonus: 38 },
  { vip: 'VIP5', upgrade: 600000, maintain: 75000, bonus: 58 },
  { vip: 'VIP6', upgrade: 1200000, maintain: 200000, bonus: 88 },
  { vip: 'VIP7', upgrade: 2400000, maintain: 620000, bonus: 188 },
  { vip: 'VIP8', upgrade: 6400000, maintain: 1900000, bonus: 288 },
  { vip: 'VIP9', upgrade: 24000000, maintain: 6250000, bonus: 388 },
  { vip: 'VIP10', upgrade: 64000000, maintain: 12500000, bonus: 588 },
  { vip: 'VIP11', upgrade: 150000000, maintain: 21000000, bonus: 888 },
  { vip: 'VIP12', upgrade: 250000000, maintain: 50000000, bonus: 1888 },
])

const vipLevel2s = ref([
  { vip: 'VIP1', birthdayGift: 8, holidayBonus: '-', dailyTurnoverGift: '0.1%', weeklyDepositBonus: 8, monthlyUpgradeBonus: '-' },
  { vip: 'VIP2', birthdayGift: 18, holidayBonus: '-', dailyTurnoverGift: '0.2%', weeklyDepositBonus: 18, monthlyUpgradeBonus: 28 },
  { vip: 'VIP3', birthdayGift: 28, holidayBonus: '-', dailyTurnoverGift: '0.3%', weeklyDepositBonus: 28, monthlyUpgradeBonus: 58 },
  { vip: 'VIP4', birthdayGift: 38, holidayBonus: '-', dailyTurnoverGift: '0.5%', weeklyDepositBonus: 38, monthlyUpgradeBonus: 88 },
  { vip: 'VIP5', birthdayGift: 58, holidayBonus: '-', dailyTurnoverGift: '0.6%', weeklyDepositBonus: 58, monthlyUpgradeBonus: 128 },
  { vip: 'VIP6', birthdayGift: 88, holidayBonus: '-', dailyTurnoverGift: '0.8%', weeklyDepositBonus: 68, monthlyUpgradeBonus: 188 },
  { vip: 'VIP7', birthdayGift: 188, holidayBonus: '-', dailyTurnoverGift: '1.0%', weeklyDepositBonus: 128, monthlyUpgradeBonus: 258 },
  { vip: 'VIP8', birthdayGift: 288, holidayBonus: 188, dailyTurnoverGift: '1.2%', weeklyDepositBonus: 208, monthlyUpgradeBonus: 388 },
  { vip: 'VIP9', birthdayGift: 388, holidayBonus: 288, dailyTurnoverGift: '1.3%', weeklyDepositBonus: 388, monthlyUpgradeBonus: 508 },
  { vip: 'VIP10', birthdayGift: 588, holidayBonus: 388, dailyTurnoverGift: '1.5%', weeklyDepositBonus: 588, monthlyUpgradeBonus: 888 },
  { vip: 'VIP11', birthdayGift: 888, holidayBonus: 888, dailyTurnoverGift: '1.8%', weeklyDepositBonus: 888, monthlyUpgradeBonus: 1288 },
  { vip: 'VIP12', birthdayGift: 1888, holidayBonus: 1888, dailyTurnoverGift: '2.0%', weeklyDepositBonus: 1888, monthlyUpgradeBonus: 2888 },
])

const vipLevel3s = ref([
  { name: '青铜', firstBonus: 18, yearlyBonus: 208 },
  { name: '白银', firstBonus: 58, yearlyBonus: 588 },
  { name: '黄金', firstBonus: 288, yearlyBonus: 1088 },
  { name: '铂金', firstBonus: 588, yearlyBonus: 1888 },
  { name: '钻石', firstBonus: 888, yearlyBonus: 2888 },
  { name: '王者', firstBonus: 1888, yearlyBonus: 8888 },
])

const rules = ref([
  '晋升标准：会员累计投注额达到相应级别的要求，即可在次日24点前晋级相应VIP等级；',
  '晋升顺序：VIP等级达到相应的要求可每天晋升一级，但VIP等级不可越级晋升；',
  '保级要求：会员在达到某VIP等级后，90天内投注需要完成保级要求。如果在此期间完成晋升，保级要求重新按照当前等级计算；',
  '升级礼金：每个级别的升级礼金每位会员仅能获得1次（升级礼金1倍流水即可提款）；',
  '生日礼金：会员在注册90天内过生日，本年度内将不能领取生日礼金。另注册时间大于90天的会员需在生日当天的VIP页面进行自助领取，每年可领取一次（生日彩金1倍流水即可提款）；',
  'VIP首次保级金：当月晋级后未晋级且达到保级要求，次月1日可领取保级彩金；',
  '年度保级彩金：首次保级成功后计算会员12个月内未降级（可晋级），彩金与第13个月首日进行派发；',
  '每日返水红包：统计每日返水金额，对应VIP等级返水加赠比例派发。次日可领取每日9、反水加赠礼金，返水加赠礼金达到10元即可领取，礼金无流水限制；',
  '每月会员日：从每月会员日15号00:00:00起，相应等级的玩家只要在上月有一笔及其以上的存款，即可在活动页面领取一次会员红包（以领取时的等级为准），领取时间截至24号23:59:59，仅需完成一倍流水，过期未领取视为放弃；',
  '会员加码：1.非0级玩家从会员日18号00:00:00起均可在活动页面领取一张“10%充值加码券”，领取时间截至21号 23:59:59，且领取后需在7日内使用充值加码券，成功使用后需在15日内完成相应流水要求；',
  '本加码券单日内不可与其他活动加码券同时使用；',
  '有效流水仅计算在游戏中产生输赢结果的注单，香港盘<0.75（中国盘<0.75）、欧洲盘<1.75、美洲盘<-133、马来盘<0.75且>0，负赔率>-0.75且＜0、走水、注单取消、对冲、未结算、连串过关、平半盘、提前结算不计算为有效流水；',
  '根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；',
  '此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及IP地址视为同一账户，若有违规者，将不享受此红利；',
  '为避免文字理解差异，东赢电竞保留此活动最终解释权；'
])

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
</script>

<style scoped>
.table-container {
  font-family: Arial, sans-serif;
  padding: 1px;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #F2F5FF !important;
  border-radius: 10px;
  overflow: hidden;
  font-size: 14px
}

th, td {
  border: 1px solid #b3d9ff;
  background-color: #F2F5FF !important;
  padding: 8px;
  text-align: center;
}

th {

  background: linear-gradient( #74B3FF 9.12%, #286CDE 95.38%);

  color: white;
}

tr:nth-child(even) {
  background-color: #f0f8ff ;
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
}


ol {
  padding-left: 20px;
}

li {
  margin-bottom: 10px !important;
  line-height: 1.5;
}
</style>
