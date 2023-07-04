<template>
  <div class="common-promo">
    <img :src="require(`../../assets/images/promotion/hotpromo/common/icon.png`)" />
    <div class="contents">
      The daily reload bonus will be automatically created to the member's
        main wallet once the deposit is successful.
      <q-btn
        class="claim-btn"
        :loading="loadingClaim"
        @click="$emit('daily-slot')"
        >领取</q-btn
      >
    <div v-if="promoId === 19" class="orange">
     *The rebate bonus needs 1 times rollover before withdrawing and will
          be returned if not used within 30 days.
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
        background: #db7e42;
        border: 0;
      }
    }
}
</style>
