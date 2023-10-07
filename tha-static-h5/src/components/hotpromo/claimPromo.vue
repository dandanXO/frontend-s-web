<template>
  <div class="common-promo">
    <img :src="require(`../../assets/images/promotion/hotpromo/${promoId}/icon.png`)" />
    <div class="contents">
      {{ $t('lang.bonus_will_be_added_to_u') }}
      <q-btn
        class="claim-btn"
        :loading="loadingClaim"
        @click="$emit('daily-slot')"
        >{{
          promoId === 50 || promoId === 48
            ? $t('lang.claim_bonus')
            : $t('lang.claim')
        }}</q-btn
      >
    <div v-if="promoId === 32" class="orange">
      *{{ $t('lang.cash_must_wagered_1_tme_before_withdrawal') }}
    </div>
    <div v-if="promoId === 27" class="extra-img">
      <img src="../../assets/images/promotion/hotpromo/common/extra.png" />
    </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted } from "vue";
import {useI18n} from "vue-i18n";

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
    const {t}= useI18n()
    onMounted(() => {
    })
    return {
      t
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
        background: $linear-bg-1;
        border: 0;
      }
    }
}
</style>
