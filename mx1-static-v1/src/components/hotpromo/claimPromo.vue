<template>
  <div class="common-promo">
    <div class="contents">
      <q-btn class="claim-btn" :loading="loadingClaim" @click="$emit('daily-slot')">Claim</q-btn>
      <div v-if="promoId === 19" class="orange"></div>
      <div v-if="promoId === 27" class="extra-img"></div>
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
    onMounted(() => {});
    return {};
  }
});
</script>
<style scoped lang="scss">
.common-promo {
  .contents {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 10px;
    .orange {
      color: #33bcd4;
    }
    .claim-btn {
      color: #ffffff;
      background: #33bcd4;
      border: 0;
    }
  }
}
</style>
