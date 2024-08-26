<template>
  <div>
    <div class="goldenegg-container">
      <div class="goldeneggs">
        <!-- <img @click="hitEgg" v-for="v in 4" :key="v" src="../../../assets/images/promotion/hotpromo/goldenegg/web.png"> -->
      </div>

      <div class="goldeneggs">
        <!-- <img @click="hitEgg" v-for="v in 4" :key="v" src="../../../assets/images/promotion/hotpromo/goldenegg/web.png"> -->
      </div>
      <div class="noEggs">
        剩余砸蛋次数 {{ info.leftCount }}</div>
      </div>
      <q-dialog align-center v-model="isPrizeWon">
        <div class="wonBox">
        <div class="wincontents">
        <div class="message">
          {{ winMessage }}
        </div>
        <div class="amount">
          {{ info.amount }} <span>元</span>
        </div>
        <q-btn class="prizeBtn" size="large" @click="claimPrize" label="立即领取" />
        </div>
        </div>
      </q-dialog>
  </div>
</template>
<script setup>
import { eventapi } from "src/boot/axios";
import { onMounted, ref, reactive } from "vue";
import { userStore } from "../../../stores/index";
const store = userStore();
const info = reactive({
  leftCount: 0,
  amount: 0
})
const isPrizeWon = ref(false);
const winMessage = ref('恭喜您! 获得奖金')
var qs = require('qs')
const hitEgg = () => {
  eventapi.post("/goldEgg/submit", qs.stringify({promoCode: "xf-gold-egg"})).then((res) => {
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
  eventapi.get('/goldEgg/init', {params: { promoCode: "xf-gold-egg" }}).then((res) => {
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
    position: relative;
    height: 7.5rem;
    min-height:120px;
    // background: url(../../../assets/images/promotion/hotpromo/goldenegg/bg.png)no-repeat bottom;
    background-size:100% 40%;
    padding-bottom:50px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    max-width: 500px;
    margin: 20px 0px;
    gap: 15px;
    flex-wrap: nowrap;

    img {
      cursor: pointer;
      width: 18% !important;
      &.bg {
        width: 100%;
      }
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
    height: 26.5rem;
    // background: url(../../../assets/images/promotion/hotpromo/goldenegg/winbox.png)no-repeat center center;
    background-size: contain;
    box-shadow: none;
    .wincontents {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      flex-direction: column;
      gap: 1.5rem;
      .message {
        padding: 10px;
        font-size: 1.5rem;
        color: #b9222c;
        font-weight: bold;
      }
      .amount {
        color: #ffae00;
        font-size: 3.5rem;
        font-weight: bold;
        padding-bottom: 10px;
        span {
          font-size: 30px;
        }
      }
    }
    .prizeBtn {
      width: 60%;
      border-radius: 30px;
      background: goldenrod;
      border: 2px solid #cf8e03;
      margin-bottom: 20px;
      color: #61251f;
      font-weight: bold;
    }
  }
</style>
