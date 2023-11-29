<template>
  <div class="common-promo">
    <img :src="require(`../../assets/images/promotion/hotpromo/${promoCode}/icon.png`)" />
    <div class="contents">
      <el-button class="promo-common-btn" size="large" :loading="loadingClaim" @click="$emit('daily-slot')">
        点击领取
      </el-button>
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

  .promo-common-btn {
    padding: 3px;
    border-radius: 8px;
    background: linear-gradient(90deg, #19c6ff 0, #0094ff 100%), linear-gradient(#0094ff, #0094ff);
    height: 57px;
    font-size: 25px;
    line-height: 57px;
    width: 225px;

    &:hover {
      opacity: 0.9;
    }
    &:active {
      filter: brightness(0.85);
      transform: translate(0px, 1px);
    }
  }
}
</style>
