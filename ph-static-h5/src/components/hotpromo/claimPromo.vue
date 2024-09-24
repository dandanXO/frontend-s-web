<template>
  <div class="common-promo">
    <img :src="require(`../../assets/images/promotion/hotpromo/${promoCode}/icon.png`)" />
    <div class="contents">
      <q-btn class="claim-btn" :loading="loadingClaim" @click="$emit('daily-slot')">Claim Bonus</q-btn>
      <div v-if="promoId === 19" class="orange">
        *The rebate bonus needs 1 times rollover before withdrawing and will be returned if not used within 30 days.
      </div>
      <div v-if="promoId === 27" class="extra-img">
        <img src="../../assets/images/promotion/hotpromo/common/extra.png" />
      </div>
      <div v-if="promoCode === 'p4w-vip-refund'">
        The daily reload bonus will be automatically created to the member's main wallet once the deposit is successful.
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
    },
    promoCode: {
      type: String,
      default: ""
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
    gap: 15px;
    padding: 0px;

    .claim-btn {
      color: #ffffff;
      background: $primary;
      border: 0;
    }
  }

  img {
    margin: 0 auto;
    max-width: 180px;
  }
}
</style>
