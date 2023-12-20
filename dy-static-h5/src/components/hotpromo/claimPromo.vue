<template>
  <div class="common-promo">
    <img
      :class="promoCode === 'dy2-first-usdt' ? 'img-small' : ''"
      :src="require(`../../assets/images/promotion/hotpromo/${promoCode}/icon.png`)"
    />
    <div class="contents">
      <!-- The daily reload bonus will be automatically created to the member's
        main wallet once the deposit is successful. -->
      <!-- 存款成功后，每日充值奖金将自动创建到会员的主钱包中。 -->
      <q-btn class="claim-btn" :loading="loadingClaim" @click="$emit('daily-slot')">点击领取</q-btn>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  props: {
    loadingClaim: {
      type: Boolean,
      default: false
    },
    promoId: {
      type: Number,
      default: null
    },
    promoCode: {
      type: String,
      default: null
    }
  },
  emits: ["daily-slot"],
  setup() {
    onMounted(() => {});
    return {};
  }
});
</script>
<style scoped lang="scss">
.common-promo {
  background: url("../../assets/images/promotion/hotpromo/common/bg.png") no-repeat center center;
  .contents {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 20px;
    .orange {
      color: #db7e42;
    }
    .claim-btn {
      color: #ffffff;
      background: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%), linear-gradient(#000, #000) !important;
      border: 0;
    }
  }

  .img-small {
    max-width: 50px;
    margin: auto;
  }
}
</style>
