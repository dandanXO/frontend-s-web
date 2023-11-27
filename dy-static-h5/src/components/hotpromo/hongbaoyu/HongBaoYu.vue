<template>
  <div>
    <div class="">
<!--      <button v-if="promoNotReady && bonusOpened" class="check-tip">活动未开启</button>-->
      <div class="receive-container" v-if="!promoNotReady && !bonusOpened">
        <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/icon.png`)" />
        <div class="contents" v-if="!bonusOpened">
          <q-btn class="claim-btn"  :loading="loadingClaim" @click="getPromotion">
            点击领取
          </q-btn>
        </div>
      </div>
<!--      <p v-if="bonusOpened" class="money-account"><span>{{ winAmount }}</span>元</p>-->
<!--      <div class="red-packet" :class="bonusOpened ? 'open' : ''"></div>-->
    </div>
  </div>

  <q-dialog v-model="isClaimModal" persistent>
    <q-card class="win-rebate-model">
      <q-card-section class="row items-center">
        <div class="bonus-svg-div">
          <span class="bonus-text">恭喜获得奖金</span>
          <span class="claim-amt">{{ winAmount }}</span>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="确定" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>
<script setup>
import {eventapi} from "src/boot/axios";
import {ref} from "vue";
import {userStore} from "src/stores";

const store = userStore();
const promoNotReady = ref(false);
const bonusOpened = ref(false);
const winAmount = ref(0);
const isClaimModal= ref(false);
const loadingClaim = ref(false);

const getPromotion = () => {
  loadingClaim.value= true;
  eventapi.get("/redPacketVip/claim?promoCode=dy-red-packet-rain")
    .then((res) => {
      if (res.code === 0) {
        winAmount.value = res.data.lastDigitAmount + res.data.vipAmount;
        loadingClaim.value= false;

        isClaimModal.value= true;

        bonusOpened.value = true;
        store.getBalance();
      } else {
        // ElMessage.error(res.message)
        bonusOpened.value = false;
      }
    })
    .catch((err) => {
      console.log(err.message);
      // message.error(err.message, 4);
      loadingClaim.value= false;
      // isClaimModal.value= true;
      bonusOpened.value = false;
    });
}
</script>

<style scoped lang="scss">
.receive-container {
  margin: .55rem auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  flex-direction: column;
  width: 100%;
  //background: url(../../../assets/images/promotion/hotpromo/hongbaoyu/hongbaoyu.png) no-repeat center center;

  img{
    width: 65% !important;
    margin: 0 auto;
  }

  .claim-btn {
    color: #ffffff;
    background: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%), linear-gradient(#000, #000) !important;
    border: 0;
  }

  .red-packet {
    width: 50%;
    height: 140px;
    margin: 0 auto 20px;
    //background: url(../../../assets/images/promotion/hotpromo/hongbaoyu/package_red.png) no-repeat center center;
    background-size: contain;

    &.open {
      //background-image: url(../../../assets/images/promotion/hotpromo/hongbaoyu/img_repacket_open.png);
    }
  }

  .receive-btn {
    width: 140px;
    left: 0;
    right: 0;
    bottom: -20px;
    margin: 0px auto;
    cursor: pointer;

    //img {
    //  width: 100%;
    //}
  }

  .check-tip, .money-account, .receive-btn {
    position: absolute;
  }

  .check-tip {
    color: #ccc;
    background-color: grey;
    min-height: 1rem;
    border-radius: 30px;
    border: none;
    white-space: normal;
    padding: 5px 15px;
    text-align: center;
    left: 0;
    right: 0;
    bottom: 0px;
    margin: auto;
    width: 90px;
  }

  .money-account {
    left: 0;
    right: 0;
    top: 0px;
    margin: auto;
    text-align: center;
    font-size: 18px;

    span {
      font-size: 30px;
    }
  }

}

</style>
