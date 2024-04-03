<template>
  <div>
    <div class="receive-container">
      <button v-if="promoNotReady && bonusOpened" class="check-tip">活动未开启</button>
      <div @click="getPromotion" v-if="!promoNotReady && !bonusOpened" class="receive-btn">
        <!-- <img src="../../../assets/images/promotion/hotpromo/hongbaoyu/package_light.png" /> -->
      </div>
      <p v-if="bonusOpened" class="money-account">
        <span>{{ winAmount }}</span>
        元
      </p>
      <div class="red-packet" :class="bonusOpened ? 'open' : ''"></div>
    </div>
  </div>
</template>
<script setup>
import { eventapi } from "src/boot/axios";
import { ref } from "vue";
import { Dialog } from "quasar";

const promoNotReady = ref(false);
const bonusOpened = ref(false);
const winAmount = ref(100);
const getPromotion = () => {
  eventapi
    .put("/bonus/claim/red-packet-rain")
    .then((res) => {
      if (res.code === 0) {
        winAmount.value = res.data;

        bonusOpened.value = true;

        Dialog.create({
          title: "系统提示",
          message: `你已领取 ${res.data}元`,
          ok: { color: "brightbtn" }
        });
      } else {
        // ElMessage.error(res.message)
        bonusOpened.value = false;
      }
    })
    .catch((err) => {
      console.log(err.message);
      // message.error(err.message, 4);
      bonusOpened.value = false;
    });
};
</script>

<style scoped lang="scss">
.receive-container {
  margin: 0.55rem auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;
  height: 140px;
  // background: url(../../../assets/images/promotion/hotpromo/hongbaoyu/hongbaoyu.png) no-repeat center center;
  background-size: contain;
  .red-packet {
    width: 50%;
    height: 140px;
    margin: 0 auto 20px;
    // background: url(../../../assets/images/promotion/hotpromo/hongbaoyu/package_red.png) no-repeat center center;
    background-size: contain;
    &.open {
      // background-image: url(../../../assets/images/promotion/hotpromo/hongbaoyu/img_repacket_open.png);
    }
  }

  .receive-btn {
    width: 140px;
    left: 0;
    right: 0;
    bottom: -20px;
    margin: 0px auto;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
  .check-tip,
  .money-account,
  .receive-btn {
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

.q-dialog__title,
.q-dialog__message,
.q-card__actions--horiz {
  text-align: center;
  justify-content: center;
}
</style>
