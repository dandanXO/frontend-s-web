<template>
  <div class="deposit-container">
    <div class="menu-title-container">
      <span class="menu-title">充值中心</span>
      <span class="additional-title">支持虚拟币 USDT 小额存提，24 小时安全，便捷，秒存秒提！</span>
    </div>
    <div class="account-content deposit">
      <!-- <span class="additional-tips">如果遇到存款问题，请立即联系在线客服解决！</span> -->
      <DepositComponent />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import DepositComponent from "@/components/depositComponent.vue";
export default defineComponent({
  components: {
    DepositComponent
  },
  setup() {}
});
</script>
<style lang="scss" scoped>
.additional-tips {
  // padding: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ff0000;
}

.menu-title-container {
  .menu-title {
    font-size: 18px;
    color: #424f72;
  }

  .additional-title {
    padding-left: 16px;
  }
}

.deposit-container {
  background-color: #fff;
  box-shadow: 0 5px 8px 0 rgba(206, 223, 227, 0.25);
  border-radius: 15px;
  padding: 20px 40px;
}

.dark {
  .deposit-container {
    @include content-block-dark;
    background-color: #17223e;
  }

  .menu-title-container {
    .menu-title {
      color: $color-white;
    }
  }
}
</style>
