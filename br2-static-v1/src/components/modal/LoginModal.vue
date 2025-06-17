<template>
  <q-dialog class="login-dialog" v-model="isShowLoginDialog" no-backdrop-dismiss no-esc-dismiss position="bottom">
    <q-btn icon="close" flat round dense class="close-btn" @click="uiStore.loginView = ''" />
    <div v-if="uiStore.loginView === 'login'" class="login-container">
      <div class="login-panel">
        <h2 class="title">Log in</h2>
        <p class="subtitle">
          Not a member?
          <a href="#" class="link">Create account</a>
        </p>

        <q-input
          outlined
          v-model="email"
          placeholder="Enter your Email"
          class="input"
          :class="{ 'white-txt': !!email }"
          :rules="[(val) => (val && val.length > 0) || $t('form.password_rules_01')]"
        >
          <template v-slot:prepend>
            <img v-if="!email" src="../../assets/images/auth/email-icon.png" width="22px" />
            <img v-else src="../../assets/images/auth/email-icon-active.png" width="22px" />
          </template>
        </q-input>

        <q-input
          outlined
          v-model="password"
          placeholder="Enter your Password"
          :type="!isShowPassword ? 'password' : 'text'"
          class="input"
          :class="{ 'white-txt': !!password }"
          :rules="[(val) => (val && val.length > 0) || $t('form.password_rules_01')]"
        >
          <template v-slot:prepend>
            <img v-if="!password" src="../../assets/images/auth/email-icon.png" width="22px" />
            <img v-else src="../../assets/images/auth/email-icon-active.png" width="22px" />
          </template>
          <template v-slot:append>
            <img
              v-if="!isShowPassword"
              class="password-icon"
              src="../../assets/images/auth/show-pw-icon.png"
              width="20px"
              @click="isShowPassword = !isShowPassword"
            />
            <img
              v-else
              class="password-icon"
              src="../../assets/images/auth/hide-pw-icon.png"
              width="20px"
              @click="isShowPassword = !isShowPassword"
            />
          </template>
        </q-input>

        <div class="forgot">Forgot password</div>

        <q-btn unelevated class="bg-greenbtn" label="Login" no-caps padding="12px" />
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref, reactive, computed, watch, onActivated, onBeforeUnmount } from "vue";
import { useUI } from "stores/ui";

const isShowLoginDialog = computed(() => {
  return !!uiStore.loginView;
});
const uiStore = useUI();

const email = ref("");
const password = ref("");
const isShowPassword = ref(false);
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
  background: rgba(255, 255, 255, 0.08);
  @media (max-width: 500px) {
    right: 20px;
    left: unset;
    transform: unset;
  }
}

.login-panel {
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
    font-size: 14px;
    color: #ffffff80;
    margin-bottom: 40px;

    .link {
      color: #00fd7c;
      text-decoration: none;
    }
  }

  .input {
    border-radius: 6px;
    margin-bottom: 8px;

    :deep(.q-field__inner) {
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

    &.white-txt {
      :deep(.q-placeholder) {
        color: #fff !important;
      }
    }
  }

  .password-icon {
    margin: 0 4px;
  }

  .forgot {
    font-size: 13px;
    color: #bbb;
    text-align: right;
    margin: 0 0 54px;
  }
}
</style>
