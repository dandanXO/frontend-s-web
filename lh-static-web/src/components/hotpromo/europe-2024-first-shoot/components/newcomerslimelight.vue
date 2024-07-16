<template>
  <div class="newcomers-intro">
    活动期间，会员此前从未投注过选择的场馆，选择完成后，当日场馆有效投注额满足<span>≥500</span>即可获得体验彩金。
  </div>
  <div class="newcomers-grid">
    <div class="item" v-for="item in items" :key="item.bonusType" @click="getBonus(item.bonusType)">
      <img :src=" require(`../images/newcomers-${item.bonusType.toLowerCase()}.png`)">
      <div class="button">点击领取</div>
    </div>
  </div>

  <table cellpadding="0" cellspacing="0" border="0">
    <tr>
      <th>激活条件</th>
      <th>当日有效投注额</th>
      <th>新秀金</th>
      <th>流水要求</th>
    </tr>
    <tr>
      <td rowspan="5">首次指定投注场馆</td>
      <td>200</td>
      <td>5</td>
      <td rowspan="5">3倍</td>
    </tr>
    <tr>
      <td>500</td>
      <td>10</td>
    </tr>
    <tr>
      <td>1,000</td>
      <td>20</td>
    </tr>
    <tr>
      <td>5,000</td>
      <td>88</td>
    </tr>
    <tr>
      <td>10,000</td>
      <td>188</td>
    </tr>
  </table>

  <div class="emergency-rules">
    <div class="emergency-rules__rule-title">活动规则</div>
    <ol class="emergency-rules__rule-content">
      <li>此活动不限新老会员，此前若从未投注过电竞场馆/真人场馆/棋牌长杆/电子场馆即可任选一个场馆投注领取；</li>
      <li>会员投注此前从未娱乐的体育场馆、电竞场馆、真人场馆、棋牌场馆、电子场馆、达到有效投注额时，即可点击【点击领取】按钮领取体验彩金；</li>
      <li>本次活动的彩金将实时派发至主账户钱包，彩金仅需三倍流水即可出款；</li>
      <li>有效投注额已结算时间为准，仅计算官方场馆有效投注额，任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；</li>
      <li>同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；</li>
      <li>任何用户或团体以不正常的方式进行套取活动优惠，平台方保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；</li>
      <li>为避免文字理解差异，本站保留本活动最终解释权</li>
    </ol>
  </div>


  <el-dialog align-center centered class="winDialog" v-model="bonusOpened">
    <div class="dialog-congrats">恭喜您，获得奖金</div>
    <div class="hongbao-angbao">{{ winAmount }} 元</div>
    <img src="../images/hongbaobonus.png">
    <div class="confirm" @click="refreshBal"><img src="../images/hongbao-confirm.png"></div>
  </el-dialog>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { firstBet } from '@/api/promotion/eurocup';
import { userStore } from '@/store';
import { useNotify } from "@/hooks/notify";

const store = userStore();
const notify = useNotify();
const bonusOpened = ref(false);
const winAmount = ref(0);
const getBonus = (type) => {
  firstBet(type).then((res) => {
    if (res.code === 0) {
      winAmount.value = res.data;
      bonusOpened.value = true;
    } else {
      notify({
        type: "error",
        message: res.message
      });

      bonusOpened.value = false;
    }
  })
}
const items = ref([
  { bonusType: 'ESPORT' },
  { bonusType: 'SPORT' },
  { bonusType: 'LIVE' },
  { bonusType: 'POKER' },
  { bonusType: 'SLOT' },

])
const refreshBal = () => {
  store.getBalance();
  bonusOpened.value = false;
}
</script>
<style lang="scss">
.newcomers-intro {
  font-family: Microsoft YaHei UI;
  font-size: 24px;
  font-weight: 400;
  line-height: 31.92px;
  letter-spacing: 0.12em;
  text-align: center;
  color: #ffffff;
  margin: 50px auto;
  span {
    font-family: Microsoft YaHei UI;
    font-size: 24px;
    font-weight: 400;
    line-height: 31.92px;
    letter-spacing: 0.12em;
    text-align: center;
    color: #60B3FF;

  }
}
.newcomers-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  .item {
    position:relative;
    cursor: pointer;
    img {
      width: 100%;
    }
    .button {
      border: 1px solid #ffffff;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 28%;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 90px;
      border-radius: 50px;
      margin: auto;
      color: #ffffff;
    }
  }
}
.el-dialog.winDialog {
  background: unset;
  background: #0D317399;
  max-width: 360px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  .dialog-congrats {
    color: #FFFFFFCC;
    font-family: Microsoft YaHei UI;
    font-size: 24px;
    font-weight: 400;
    line-height: 31.92px;
    text-align: center;
  }

  .el-dialog__header {
    .el-dialog__headerbtn {
      .el-dialog__close {
        background: #FFFFFF66;
        border-radius: 50%;
        padding: 3px;
        color: #0D3173;
        font-weight: bold;
      }
    }
    &.show-close {
      display: none;
    }
  }
  .el-dialog__body{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    gap: 40px;
    img {
      width: 200px;
    }
    .hongbao-angbao {
      color: #FAFF00;
      font-family: Microsoft YaHei UI;
      font-size: 24px;
      font-weight: 700;
      line-height: 31.92px;

    }
    .confirm {
      cursor: pointer;
      img {
        width: 180px;
      }
    }
  }
}
</style>