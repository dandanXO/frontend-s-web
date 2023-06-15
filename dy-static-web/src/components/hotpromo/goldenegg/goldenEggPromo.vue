<template>
  <div>
    <div class="goldenegg-container">
      <div class="goldeneggs">
        <img @click="hitEgg" v-for="v in totalNo" :key="v" src="../../../assets/images/promotion/hotpromo/goldenegg/web.png">
      </div>
      <div class="noEggs">
        剩余砸蛋次数 {{ info.leftCount }}</div>
      </div>
      <el-dialog align-center class="wonBox" :modal="false" v-model="isPrizeWon" :show-close="false">
        <div class="wincontents">
        <div class="message">
          恭喜您！获得奖金！
        </div>
        <div class="amount">
          {{ info.amount }} <span>元</span>
        </div>
        <el-button size="large" round color="#fcd469" @click="claimPrize">立即领取</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script setup>
import {onMounted, reactive, ref} from "vue";
import { userStore } from "@/store";
import { goldenEggInit, goldenEggSubmit } from "@/api/promotion/goldenEgg";
import { ElMessage } from "element-plus";
const store = userStore();

const info = reactive({
  leftCount: 0,
  amount: 0
})
const totalNo = ref(8);
const isPrizeWon = ref(false);
const hitEgg = () => {
  goldenEggSubmit({promoCode: "xf-gold-egg"}).then((res) => {
    if(res.code === 0) {
      info.leftCount = res.data.leftCount;
      info.amount = res.data.amount;
      isPrizeWon.value = true
    } else {
      ElMessage.error({
        type: "error",
        message: res.message
      })
    }
  })
}
const claimPrize = () => {
  isPrizeWon.value = false
  store.getBalance();
}
onMounted(() => {
  goldenEggInit({params:{promoCode: "xf-gold-egg"}}).then((res) => {
    if(res.code === 0) {
      info.leftCount = res.data.leftCount;
    } else {
      ElMessage.error({
        type: "error",
        message: res.message
      })
    }
  })
})
</script>
<style scoped lang="scss">
.goldenegg-container {
  width: 100%;
  margin: 0 auto;
  max-width: 1000px;
  .goldeneggs {
    width: 100%;
    height: 230px;
    background: url(../../../assets/images/promotion/hotpromo/goldenegg/bg.png)no-repeat center 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 15px;
    img {
      cursor: pointer;
    }
  }
  .noEggs {
    text-align: right;
  }
}
</style>
<style lang="scss">
body
  .wonBox {
    width: 500px;
    height: 500px;
    background: url(../../../assets/images/promotion/hotpromo/goldenegg/winbox.png)no-repeat center center;
    background-size: contain;
    box-shadow: none;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
    background: none;
    box-shadow: none;
      height: 100%;
    .wincontents {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      flex-direction: column;
      gap: 60px;
      .message {
        padding: 10px;
        font-size: 24px;
        color: #b9222c;
        font-weight: bold;
      }
      .amount {
        color: #ffae00;
        font-size: 50px;
        font-weight: bold;
        padding-bottom: 10px;
        span {
          font-size: 30px;
        }
      }
      .el-button {
        margin-bottom: 20px;
        padding: 25px 0;
        width: 60%;
        font-size: 20px;
        border: 2px solid #cf8e03;
        border-radius: 30px;
        span {
          color: #3a0001;
        }
      }
    }
    }
  }
</style>
