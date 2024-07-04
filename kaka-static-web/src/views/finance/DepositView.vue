<template>
  <div class="deposit-container">
    <div class="menu-title-container">
      <span class="menu-title">{{ $t('deposit.deposit') }}</span>
      <!-- <span class="additional-title">支持虚拟币USDT小额存提，24小时安全，便捷，秒存秒提!</span> -->
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
    DepositComponent,
  },
  setup() {},
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

.menu-title-container{

  .additional-title{
    padding-left: 16px;
  }
}

.deposit-container{
  background: url(../../assets/images/account/bg.png)no-repeat center center;
  background-color: #ffffff;
  border-radius: 20px;
  // background-color: #fff;
  box-shadow: 0 5px 8px 0 rgba(206, 223, 227, 0.25);
  border-radius: 15px;
  padding: 20px 40px;
}

</style>
