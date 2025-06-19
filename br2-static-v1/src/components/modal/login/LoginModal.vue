<template>
  <q-dialog class="login-dialog" v-model="isShowLoginDialog" no-backdrop-dismiss no-esc-dismiss position="bottom">
    <q-card-actions class="close-btn">
      <q-btn icon="close" flat round dense @click="uiStore.loginView = ''" />
    </q-card-actions>
    <LoginForm v-if="uiStore.loginView === 'login'" />
    <ForgetPwForm v-else-if="uiStore.loginView === 'forgetPw'" />
    <RegisterAccForm v-else />
  </q-dialog>
</template>

<script setup>
import { computed } from "vue";
import { useUI } from "stores/ui";
import LoginForm from "./LoginForm.vue";
import ForgetPwForm from "./ForgetPwForm.vue";
import RegisterAccForm from "./RegisterAccForm.vue";

const isShowLoginDialog = computed(() => {
  return !!uiStore.loginView;
});
const uiStore = useUI();
</script>

<style lang="scss" scoped>
:deep(.login-dialog) {
  max-width: 500px !important;
}
.login-container {
  width: 500px;
  max-width: 500px;
  background-color: #1f241f;
  padding: 24px 20px 32px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-top: 4px solid #00fd7c;
  position: relative;
  z-index: 1;
  box-shadow: 0 -30px 20px -10px #00fd7a5e;
}

.close-btn {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(200px);
  color: white;
  z-index: 1;
  width: fit-content !important;
  @media (max-width: 500px) {
    right: 20px;
    left: unset;
    transform: unset;
  }
  .q-btn {
    background: rgba(255, 255, 255, 0.08);
  }
  .q-btn .q-icon {
    width: 20px;
  }
}

:deep(.login-panel) {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  color: #fff;

  .title {
    margin: 0;
    margin-bottom: 14px;
    font-size: 24px;
    font-weight: 700;
    line-height: 2.5rem;
  }

  .subtitle {
    display: flex;
    font-size: 14px;
    color: #ffffff80;
    margin-bottom: 40px;

    .link {
      margin-left: 6px;
      color: #00fd7c;
      text-decoration: none;
    }
  }
}

:deep(.input) {
  border-radius: 6px;
  margin-bottom: 8px;
}

:deep(.input.white-txt .q-placeholder) {
  color: #fff !important;
}

:deep(.q-field__control) {
  background-color: #131313 !important;
}

:deep(.q-placeholder) {
  color: #424242;
}

:deep(.q-field__control::before) {
  border-color: #4b4943;
}

:deep(.q-field__control) {
  color: #00fd7c;
}
</style>
