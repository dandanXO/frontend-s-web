<template>
  <el-tabs>
    
    <el-tab-pane :label="$t('login.findPasswordPhone')">
      <PhoneOrEmailFindPwd type="phone" @close-dialog="closeDialog" @open-login-dialog="openLoginDialog" />
    </el-tab-pane>
    <el-tab-pane :label="$t('login.findPasswordEmail')">
      <PhoneOrEmailFindPwd type="email" @close-dialog="closeDialog" @open-login-dialog="openLoginDialog" />
    </el-tab-pane>
    <el-tab-pane :label="$t('login.findAccountEmail')">
      <EmailFindPwd @close-dialog="closeDialog" @open-login-dialog="openLoginDialog" />              
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { defineEmits } from "vue";
import EmailFindPwd from "@/components/auth/EmailFindPwd.vue";
import PhoneOrEmailFindPwd from "@/components/auth/PhoneOrEmailFindPwd.vue";

const emits = defineEmits(["close-dialog, open-login-dialog"]);

const closeDialog = () => {
  emits("close-dialog");
};

const openLoginDialog = () => {
  emits("open-login-dialog");
};
</script>

<style lang="scss">
.forgot-pwd-page-container {
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: url("@/assets/home/auth/login-page-bg.jpg") no-repeat center center;
  background-size: cover;
  display: flex;

  .el-tabs__active-bar,
  .el-tabs__nav-wrap::after {
    display: none;
  }

  .el-tabs__nav {
    border-radius: 30px;
    box-shadow: 0px -1.7px 6.09px 0px #a2bff4 inset;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 5px;
    width: 100%;
  }

  .el-tabs--top .el-tabs__item.is-top {
    font-size: 14px;
    border-radius: 30px;
    color: #468cff;
    // box-shadow: 0px -1.7px 6.09px 0px #a2bff4 inset;
    display: flex;
    width: 150px;
    padding: 0;
    width: 100%;
    min-width: 100px;

    &.is-active {
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
      color: #fff;
      font-size: 14px;
      border-radius: 30px;
    }
  }
}

.center {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 30px;
  margin: 5% auto;
  width: 100%;
  max-width: 600px;
}

.logo img {
  width: 200px;
}

.card-bg {
  background-color: #f7f9fc;
  box-shadow: 0px 0px 10px 0px #0000001a;
  padding: 50px;
  border-radius: 10px;
}
</style>
