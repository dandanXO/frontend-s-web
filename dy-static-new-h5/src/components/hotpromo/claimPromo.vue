<template>
  <div class="common-promo">
    <img :src="require(`../../assets/images/promotion/hotpromo/${promoId}/icon.png`)" />
    <div class="contents">
      <!-- The daily reload bonus will be automatically created to the member's
        main wallet once the deposit is successful. -->
        <!-- 存款成功后，每日充值奖金将自动创建到会员的主钱包中。 -->
      <q-btn
        class="claim-btn"
        :loading="loadingClaim"
        @click="$emit('daily-slot')"
        >领取</q-btn
      >
    <div v-if="promoId === 19" class="orange">
     <!-- *The rebate bonus needs 1 times rollover before withdrawing and will be returned if not used within 30 days. -->
     <!-- *返利红利需要1倍流水后才能提现，30天内未使用将退回。 -->
    </div>
    <div v-if="promoId === 27" class="extra-img">
      <img src="../../assets/images/promotion/hotpromo/common/extra.png" />
    </div>
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
    }
  },
  emits: ["daily-slot"],
  setup() {
    onMounted(() => {
    })
    return {
    }
  },
})
</script>
<style scoped lang="scss">
.common-promo {
  background: url('../../assets/images/promotion/hotpromo/common/bg.png')no-repeat center center;
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
}
</style>
