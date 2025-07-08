<template>
  <q-dialog width="100%" v-model="isShowRegisterSuccessDialog" presistent>
    <div class="popout-dialog">
      <img class="reg-success-bg-img" src="../../../assets/images/auth/register-success-bg.png" />
      <q-btn dense flat icon="close" class="popout-close" v-close-popup @click="handleConfirmRegSuccess" />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t('content.message')}}</div>

        <img class="reg-success-img" src="../../../assets/images/auth/register-success.png" />
        <div class="txt-content q-mt-md text-center">{{ $t('content.register_succes')}}</div>

        <div class="q-mt-lg q-pl-lg q-pr-lg y-n-container">
          <q-btn class="bg-greenbtn" :label="$t('btn.confirm')" no-caps v-close-popup @click="handleConfirmRegSuccess" />
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { computed } from "vue";
import { useUI } from "stores/ui";

const isShowRegisterSuccessDialog = computed(() => {
  return uiStore.loginView === "regSuccess";
});
const uiStore = useUI();

const handleConfirmRegSuccess = () => {
  location.href = "/";
  uiStore.loginView = "";
};
</script>
<style lang="scss" scoped>
.popout-dialog {
  max-width: 500px;
  padding-top: 38%;

  @media (min-width: 501px) {
    padding-top: 220px;
  }
}

.reg-success-bg-img {
  position: absolute;
  width: 80%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
.reg-success-img {
  margin: 2% 0;
  width: 35%;
}
</style>
