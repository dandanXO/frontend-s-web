<template>
  <div class="common-promo">
    <img :src="require(`../../assets/images/promotion/hotpromo/${promoId}/icon.png`)" />
    <div class="contents">
      โบนัสจะถูกเพิ่มเข้าไปในกระเป๋าเงินของคุณหลังจากทํารายการสําเร็จ
      <q-btn
        class="claim-btn"
        :loading="loadingClaim"
        @click="$emit('daily-slot')"
        >{{
          promoId === 50 || promoId === 48
            ? "เคลมเครดิตฟรี"
            : "เคลมเงินคืนประจำวัน"
        }}</q-btn
      >
    <div v-if="promoId === 32" class="orange">
      *โบนัสเงินคืนต้องทำ 1 เทิร์นก่อนถอนและจะถูกริบคืนหากไม่ได้ใช้ภายใน 30 วัน
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
        background: $linear-bg-1;
        border: 0;
      }
    }
}
</style>
