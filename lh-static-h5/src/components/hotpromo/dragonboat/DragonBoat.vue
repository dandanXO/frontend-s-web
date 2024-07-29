<template>
  <div>
    <!--      <div class="period">-->
    <!--        活动时间: 2024/6/10-2024/6/20 23:59:59-->
    <!--      </div>-->
    <q-tabs v-model="tabPosition" class="dragonboat-tabs">
      <q-tab name="duanwu" label="端午粽情"></q-tab>
      <q-tab name="fangzong" label="放粽不羁"></q-tab>
    </q-tabs>
    <q-tab-panels v-model="tabPosition" class="dragonboat-tabs">
      <q-tab-panel name="duanwu">
        <div class="section">
          <div class="claim" @click="vipupgrade">
            <img :src="require('./images/dragonboat-claim.png')">
          </div>
          <div class="duanwudetails">
            <div class="dragon-title"><div class="gradient">活动内容</div></div>
            <div class="centertxt">自注册日两天后可点击领取豪华晋级体验金，礼金三倍流水即可提款。</div>
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <th>VIP等级</th>
                <th>参与条件</th>
                <th>奖金上限</th>
              </tr>
              <tr>
                <td>VIP0</td>
                <td>注册日两天内晋级VIP1</td>
                <td>18</td>
              </tr>
              <tr>
                <td>VIP0</td>
                <td>注册日两天内晋级≥VIP2</td>
                <td>58</td>
              </tr>
            </table>
            <span class="example">
                        例：用户A在6月11日注册成功，并且在13日成功晋级为VIP1会员，用户A可获得18元晋级体验金。用户B在6月11日注册成功，并且在13日成功晋级为VIP2会员，用户B可获得58元晋级体验金。
                    </span>
            <div class="dragon-title"><div class="gradient">活动规则</div></div>
            <ol>
              <li>1. 本活动仅限在活动期间内注册的VIP0会员参与，在注册日的两天内成功达成晋级条件，可享豪华晋级体验金；</li>
              <li>2. 活动期间，符合条件的会员需在注册日两天后再本活动页面点击【立即领取】即可领取彩金，彩金按对应参与条件符合最高档位派发，彩金仅需3倍流水即可提款；</li>
              <li>3. 任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；</li>
              <li>4. 根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；</li>
              <li>5. 此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及IP地址视为同一账户，若有违规者，将不享受此红利；</li>
              <li>6. 为避免文字理解差异，本站保留此活动最终解释权；</li>
            </ol>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="fangzong"><div class="section">
        <div class="claim" @click="depositBet">
          <img src="./images/dragonboat-claim.png">
        </div>
        <div class="duanwudetails">
          <div class="dragon-title"><div class="gradient">活动内容</div></div>
          <div class="centertxt">活动期间，完成每日存款有效流水倍数，即享端午节日奖金，日最高送288元，一倍流水即可提款</div>
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <th>达成条件</th>
              <th>节日奖金</th>
              <th>奖金上限</th>
            </tr>
            <tr>
              <td>日存款有效流水3倍</td>
              <td>日存款X1.0%</td>
              <td>38</td>
            </tr>
            <tr>
              <td>日存款有效流水5倍</td>
              <td>日存款X2.0%</td>
              <td>88</td>
            </tr>
            <tr>
              <td>日存款有效流水8倍</td>
              <td>日存款X3.0%</td>
              <td>158</td>
            </tr>
            <tr>
              <td>日存款有效流水15倍</td>
              <td>日存款X5.0%</td>
              <td>288</td>
            </tr>
          </table>
          <span class="example">
                        例：用户A在6月11日存款1,000元，当日有效投注5,000元，即可获得1,000X2.0%=20元
                    </span>
          <div class="dragon-title"><div class="gradient">活动规则</div></div>
          <ol>
            <li>1. 活动期间，流水仅统计（全体育场馆+全电竞场馆）有效投注，符合条件的会员点击【立即领取】自动派发至会员钱包，仅需一倍流水即可提款；</li>
            <li>2. 本活动仅计算当日总存款与当日场馆（全体育场馆+全电竞场馆）总有效投注，次日清零系统重新累计;</li>
            <li>3. 任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算有效投注额内；</li>
            <li>4. 本活动根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；</li>
            <li>5. 本活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及P地址视为同一账户，若有违规者，将不享受此红利；</li>
            <li>6. 为避免文字理解差异，雷火电竟保留此活动最终解释权；</li>
          </ol>
        </div>
      </div>
      </q-tab-panel>
    </q-tab-panels>
    <q-dialog align-center centered class="winDragonBoatDialog"  v-model="isBonusDialog">
      <div class="title">恭喜获得</div>
      <div class="center-items">
        <img src="./images/dialog-money.png">
        <div class="amount">
          奖金：{{ store.currency.value }}{{ amount }}
        </div>
      </div>
      <div class="dialog-btn" @click="closeDialog">
        确定
      </div>
    </q-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar'
import { duanwuVipUpgrade, duanwuDepositBet } from "../../../api/index/promo.js";
import { userStore } from "stores/index";
import { useNotify } from 'src/hooks/notify.js';

const notify = useNotify();
const store = userStore();
const $q = useQuasar();
const tabPosition = ref("duanwu");
const amount = ref(0);
const isBonusDialog = ref(false);
const vipupgrade = async () => {
  const res = await duanwuVipUpgrade();
  if (res.code === 0) {
    amount.value = res.data;
    isBonusDialog.value = true
  } else {
    notify({
      type: "error",
      message: res.message,
    });
  }
}
const depositBet = async () => {
  const res = await duanwuDepositBet();
  if (res.code === 0) {
    amount.value = res.data
    isBonusDialog.value = true
  } else {
    notify({
      type: "error",
      message: res.message,
    });
  }
}
const closeDialog = () => {
  store.getBalance();
  isBonusDialog.value = false;
}
</script>
<style scoped lang="scss">
@font-face {
  font-family: hyagi;
  src: url('fonts/hya0gj.ttf');
}

.period {
  background: url("./images/period-bg.png");
  background-size: 100% 100%;
  font-size: 17px;
  font-weight: 700;
  line-height: 30px;
  padding: 20px;
  color: #fff;
  width: 400px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px auto 10px;
  text-align: center;
  font-family: 'Microsoft YaHei UI';
  width: 100%;
  white-space: nowrap;

  @media (max-width: 400px) {
    font-size: 13px;
  }

  @media (max-width: 300px) {
    font-size: 10px;
  }
}

.dragonboat-tabs {
  max-width: 1250px;
  margin: auto;
  .section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #4B7850;
    font-size: 16px;
    font-weight: 400;
    line-height: 31.92px;


    img {
      max-width: 180px;
    }
  }
  .dragon-title {
    background: url(images/dragonboat-title.png) no-repeat center center;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 25px auto;
    .gradient {
      font-family: hyagi;
      font-size: 30px;
      font-weight: 400;
      line-height: 39.96px;
      background: linear-gradient(180deg, #0EB478 0%, #005D3B 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .centertxt {
    text-align: center;
  }
  table {
    width: 100%;
    margin: 20px auto;
    tr {
      th, td {
        text-align: center;
        padding: 8px 20px;
      }
      th {
        background: #C9DEAB !important;
        border: 1px solid #80C2A3 !important;
      }
      td {
        background: #FFFFE8 !important;
        border: 1px solid #80C2A3 !important;
      }
    }
  }
  ol {
    list-style: none !important;
    padding: 15px 12px !important;
    li {
      margin: 0 0 10px;
    }
  }

}

.q-tabs.dragonboat-tabs {
  height: auto !important;
  background-color: transparent;
  margin-top: 10px;
}

.q-tabs.dragonboat-tabs .q-tab {
  background: url(components/hotpromo/dragonboat/images/tab-button.png) no-repeat center center;
  background-size: contain;
  color: #808080;
  font-family: Microsoft YaHei UI;
  font-size: 24px;
  font-weight: 700;
  line-height: 31.92px;
  text-align: center;
  width:40%;
  aspect-ratio: 363/90;
  min-height: 40px;

  :deep(.q-tab__label) {
    font-size: 20px !important;
  }

  &--active {
    background: url(components/hotpromo/dragonboat/images/tab-button-active.png) no-repeat center center;
    background-size: contain;
    color: #18532D;
    :deep(.q-tab__label) {
      color: #18532D !important;
    }
    :deep(.q-tab__indicator) {
      display: none !important;
    }
  }
  .q-ripple {
    display: none;
  }
}

.q-tab-panel {
  overflow: hidden;
}

</style>
<style lang="scss">

.winDragonBoatDialog {
  .q-dialog__inner {
    background: url(components/hotpromo/dragonboat/images/dialog-bg.png)no-repeat center center;
    background-size: contain;
    width: 95%;
    max-width: 360px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
  }
  img {
    max-width: 80px;
  }
  .title {
    color: #533418;
    font-size: 24px;
    font-weight: 700;
  }
  .center-items {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .amount {
    color: #8B3A00;
    font-size: 32px;
    font-weight: 700;
    text-align: center;

  }

  .dialog-btn {
    background: url(components/hotpromo/dragonboat/images/dialog-btn.png)no-repeat center center;
    background-size: cover;
    margin-bottom: 15px;
    padding: 8px 60px;
    color: #5E3900;
    font-weight: 700;
    font-size: 20px;
  }
}
</style>
