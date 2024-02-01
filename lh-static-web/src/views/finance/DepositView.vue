<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">充值中心</span>
      <span class="additional-title">支持虚拟币USDT小额存提，24小时安全、便捷、秒存秒提!</span>
    </div>
    <div class="account-content deposit">
      <span class="additional-tips">如果遇到存款问题，请立即联系在线客服解决！</span>
      <DepositComponent />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import DepositComponent from "@/components/depositComponent.vue";
export default defineComponent({
  components: {
    DepositComponent,
  },
  setup() {},
});
</script>
<style lang="scss" scoped>
.additional-tips {
  padding: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ff0000;
}
// .account-content.deposit {
//   min-height: 740px;
//   display: flex;
//   justify-content: center;
// }
// @media (max-width: 768px) {
//   .account-content.deposit {
//     min-height: 90vh;
//   }
// }
</style>
