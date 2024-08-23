<template>
  <div class="common-promo">
    <img
      :src="
        require(`../../assets/images/promotion/hotpromo/${promoId}/icon.png`)
      "
    />
    <div class="contents">
      <el-button
        class="common-btn"
        size="large"
        :loading="loadingClaim"
        @click="$emit('daily-slot')"
        >领取</el-button
      >
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  props: {
    loadingClaim: {
      type: Boolean,
      default: false,
    },
    promoId: {
      type: Number,
      default: null,
    },
  },
  emits: ["daily-slot"],
  setup() {
    onMounted(() => {});
    return {};
  },
});
</script>
<style scoped lang="scss">
.common-promo {
  // background: url("../../assets/images/promotion/hotpromo/common/bg.png")
  //   no-repeat center center;
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
