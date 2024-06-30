<template>
  <div class="common-promo">
    <img :src="require(`../../assets/images/promo/hotpromo/${promoId}/icon.png`)" />
    <div class="contents">
      <!--      存款成功后，每日充值奖金将自动创建到会员的主钱包中。-->
      <q-btn color="brightbtn" :loading="loadingClaim" @click="$emit('daily-slot')" no-caps>{{ $t("lang.vip_claim") }}</q-btn>
      <div v-if="promoId === 19" class="orange">
        <!--      *返利红利需要1倍流水后才能提现，30天内未使用将退回。-->
      </div>
      <div v-if="promoId === 27" class="extra-img">
        <img src="../../assets/images/promo/hotpromo/common/extra.png" />
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
    onMounted(() => {});
    return {};
  }
});
</script>
<style scoped lang="scss">
.common-promo {
  background: url("../../assets/images/promo/hotpromo/common/bg.png") no-repeat center center;
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
