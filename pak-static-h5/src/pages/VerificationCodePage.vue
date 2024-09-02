<template>
  <div class="login-container">
    <div class="login-form-logo-img">
      <img src="../assets/images/auth/auth-logo-text-only.png" />
    </div>

    <div class="verification-code-form-grid">
      <span class="verification-code-form-title">Input your verification code</span>
      <span class="verification-code-form-desc">
        You will receive a verification code with your registered phone number 9099909009
      </span>
    </div>

    <div class="login-form-wrapper">
      <q-form @submit="onSubmit">
        <div class="verification-code-inputs">
          <q-input
            v-for="(code, index) in verificationCode"
            :key="index"
            v-model="verificationCode[index]"
            type="tel"
            maxlength="1"
            outlined
            hide-bottom-space
            class="verification-code-input"
            @keyup="focusNextInput(index)"
            @focus="clearInput(index)"
            ref="inputs"
          />
        </div>
      </q-form>
    </div>

    <span class="verification-code-form-tips">
      Haven't receive?
      <a style="color: #61ff00">Resent</a>
    </span>

    <div class="bottom-btn">
      <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onSubmit">Confirm</q-btn>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar, Platform } from "quasar";

const router = useRouter();
const $q = useQuasar();

const verificationCode = ref(["", "", "", "", ""]);
const inputs = ref([]);

const focusNextInput = (index) => {
  if (verificationCode.value[index].length === 1 && index < verificationCode.value.length - 1) {
    inputs.value[index + 1].focus();
  }
};

const clearInput = (index) => {
  verificationCode.value[index] = "";
};

const onSubmit = () => {
  const code = verificationCode.value.join("");
  if (code.length === 5) {
    // Submit the code
    console.log("Verification code submitted:", code);
    // router.go("/");
    router.push("/home").then(() => {
      $q.notify({
        color: "positive",
        position: "top",
        message: "Registered successfully",
        icon: "check_circle_outline"
      });
      window.location.reload();
    });
  } else {
    // Show an error
    console.log("Please complete the verification code.");
    $q.notify({
      color: "negative",
      position: "top",
      message: "Please complete the verification code",
      icon: "report_problem"
    });
  }
};
</script>

<style scoped lang="scss">
.auth-tab-wrapper {
  width: 90%;
  margin: 0 auto;

  .q-tab {
    min-height: 45px;
    border-radius: 8px;
    color: #5F6061;
    font-weight: 400;
    width: 50%;
  }

  .auth-tab-toggle {
    // background: url(../assets/images/auth/auth-tab-active.png) no-repeat center center;
    // background-size: 100% 100%;
    border-radius: 8px;
    margin-bottom: 4px;
    margin-top: 5px;
    padding: 1px;

    :deep(.q-tab__label) {
      font-weight: 400;
    }

    :deep(.q-tab--active) {
      color: white;
      background: url(../assets/images/auth/auth-tab-active.png) no-repeat center center;
      background-size: 100% 100%;
    }

    :deep(.q-tab--active .q-tab__label) {
      font-weight: 700 !important;
    }
  }
}

.login-container {
  min-height: calc(100dvh - 60px);
  display: flex;
  flex-direction: column;
  // justify-content: center;
  padding-top: 20px;
  // background: url("../assets/images/auth/bg-login.png");
  background: transparent;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.back-left {
  position: fixed;
  top: 16px;
  left: 16px;
}

.login-form-logo-img {
  padding: 0 16px;
  display: flex;
  justify-content: center;
  img {
    display: block;
    width: 100%;
    max-width: 200px;
  }
}

.login-form-wrapper {
  padding: 20px 20px 20px;
}

.forgot-password {
  margin: 8px 0px 0px;
  text-align: right;

  .form-text {
    color: #c1dffc;
  }
}

.end-of-form-separator {
  margin: 35px 0px 0px;
  border-color: #ffffff26;
}

.create-account {
  margin: 20px 0px;
  text-align: center;
}
.form-text {
  color: #b3b0b8;
  text-decoration: none;
}

.prepend-number {
  font-size: 14px;
  color: #ffffff;
  margin-left: 8px;
}

.q-icon {
  color: rgba(255, 255, 255, 0.3);
}

:deep(.q-tab__label) {
  color: #ffffff;
}

.bottom-btn {
  margin-top: auto;
  padding: 20px;
}

.verification-code-form-grid {
  display: grid;
  grid-auto-flow: row;
  gap: 7px;
  margin-top: 20px;
  padding-left: 20px;
  padding-right: 20px;

  .verification-code-form-title {
    font-size: 22px;
    font-weight: 600;
    line-height: 30px;
  }

  .verification-code-form-desc {
    font-size: 16px;
    font-weight: 400;
    line-height: 25px;
    color: #ffffff67;
    width: 80%;
  }
}

.verification-code-form-tips {
  font-size: 16px;
  font-weight: 400;
  line-height: 25px;
  color: #ffffff67;
  padding: 20px;
}

.verification-code-inputs {
  display: flex;
  justify-content: space-around;
  gap: 12px;

  .verification-code-input {
    :deep(.q-field__native) {
      text-align: center;
      font-size: 20px;
    }
  }
}
</style>
