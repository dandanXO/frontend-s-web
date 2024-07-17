<template>
  <div class="newcomers-intro">
    活动期间，会员当日场馆有效投注额满足且产生对应负盈利金额，即可获得最高<span>388元</span>返还。
  </div>
  <div class="newcomers-grid">
    <div class="item" v-for="item in items" :key="item.bonusType" @click="getBonus(item.bonusType)">
      <img :src=" require(`../images/newcomers-${item.bonusType.toLowerCase()}.png`)">
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
      <td rowspan="2">投注电竞馆</td>
      <td>18</td>
      <td>18</td>
      <td rowspan="2">1倍</td>
    </tr>
    <tr>
      <td>28</td>
      <td>58</td>
    </tr>
  </table>

  <div class="emergency-hint" style="margin-top: 12px;">
    注：符合条件的会员仅限参与本活动一次，仅限领取一次优惠奖励。
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
import { userStore } from "src/stores";
import { useQuasar } from "quasar";
import { eventapi } from "boot/axios"
var qs = require("qs")
const store = userStore();
const $q = useQuasar();
const bonusOpened = ref(false);
const winAmount = ref(0);
const getBonus = (type) => {
  eventapi.post("/first-bet/claim", qs.stringify({gameType: type})).then((res) => {
    if (res.code === 0) {
      winAmount.value = res.data;
      bonusOpened.value = true;
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message,
        icon: "report_problem"
      });

      bonusOpened.value = false;
    }
  })
}

const items = ref([
  { bonusType: 'ESPORT' },
  { bonusType: 'LIVE' },
  { bonusType: 'POKER' },
  { bonusType: 'SLOT' },
  { bonusType: 'SPORT' },
])
const refreshBal = () => {
  store.getBalance();
  bonusOpened.value = false;
};
</script>
<style lang="scss" scoped>
.newcomers-intro {
  font-family: Microsoft YaHei UI;
  font-size: 32px;
  font-weight: 400;
  line-height: 31.92px;
  letter-spacing: 0.12em;
  text-align: left;
  color: #ffffff;
  margin: 12px auto;
  span {
    line-height: 31.92px;
    letter-spacing: 0.12em;
    text-align: center;
    color: #FF881A;

  }
}
.newcomers-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
.emergency-hint {
  font-size: 24px;
  color: white;
  font-family: Microsoft YaHei UI;
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
table {
    width: 100%;
    tr {
      th,
      td {
        padding: 20px;
        text-align: center;
        font-size: 24px;
      }
      th {
        background: #3998DC;
        color: #ffffff;
      }
      &:nth-child(2) {
        td {
          border-top: 0;
        }
      }
      &:last-child {
        td {
          border-bottom: 0;
        }
      }
      td {
        background: #2D517C6B;
        color: #ffffff;
        border: 2px solid #ffffff33;
        &:first-child {
          border-left: 0;
          border-top: 0;
          border-bottom: 0;
        }
        &:last-child {
          border-right: 0;
          border-bottom: 0;
        }
      }
    }
  }
</style>