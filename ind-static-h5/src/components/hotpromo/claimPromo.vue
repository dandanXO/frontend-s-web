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
  img {
    max-width: 250px !important;
  }
  .contents {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .orange {
      color: #33bcd4;
    }
    .claim-btn {
      color: #ffffff;
      background: #5c46e7;
      border: 0;
      padding-left: 20px;
      padding-right: 20px;
    }
  }
}
</style>
