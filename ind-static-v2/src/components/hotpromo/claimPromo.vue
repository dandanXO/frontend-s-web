<template>
  <div class="common-promo">
    <img :src="require(`../../assets/images/promotion/claim/claim-icon.png`)" />
    <div class="contents">
      <q-btn class="claim-btn" :loading="loadingClaim" @click="$emit('daily-slot')" no-caps size="md">Receive</q-btn>
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
    // gap: 20px;
    // padding: 10px;
    .orange {
      color: #33bcd4;
    }
    .claim-btn {
      color: #ffffff;
      background: linear-gradient(356.25deg, #00430b -0.21%, #00ae00 93.65%);
      border: 0;
    }
  }
}
</style>
