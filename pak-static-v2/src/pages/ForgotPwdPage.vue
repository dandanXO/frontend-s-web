<template>
  <div class="forgot-password-container">
    <div class="forgot-password-form-logo-img">
      <img src="../assets/images/auth/b9-logo.png" />
    </div>

    <q-form v-if="!isRequestSent" class="q-gutter-y-md rounded-borders">
      <!-- <q-input
        hide-bottom-space
        ref="loginNameRef"
        v-model="loginForm.loginName"
        label="Login Name"
        :rules="[(val) => (val && val.length > 0) || 'Please insert login name']"
        label-color="brand"
        autocomplete="username"
        rounded
        outlined
        color="white"
        class="landing-input"
      ></q-input> -->

      <!-- <q-input
        ref="loginNameRef"
        hide-bottom-space
        v-model="passwordForm.loginName"
        label="Username"
        :rules="[(val) => (val && val.length > 0) || 'Please Enter Username']"
        rounded
        outlined
        label-color="brand"
        color="white"
        class="landing-input"
      ></q-input> -->

      <div class="forgot-password-form-grid">
        <span class="forgot-password-form-title">{{ $t("form.forgotPassword") }}</span>
        <span class="forgot-password-form-desc">
          {{ $t("form.forgotPassword_desc") }}
        </span>

        <InputRowGrid>
          <template #fields>
            <InputField :label="$t('form.phone')">
              <template #input>
                <q-input
                  type="tel"
                  pattern="\d*"
                  maxlength="11"
                  ref="loginNameRef"
                  hide-bottom-space
                  v-model="passwordForm.loginName"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
                    (val) => (val && val.length === 11) || $t('form.phone_rules_02')
                  ]"
                  outlined
                  label-color="brand"
                  :placeholder="$t('form.phone_placeholder')"
                >
                  <template v-slot:prepend>
                    <q-icon name="smartphone" />
                    <div class="prepend-number">+92</div>
                  </template>
                </q-input>
              </template>
            </InputField>

            <!-- <InputField :label="'Email'">
              <template #input>
                <q-input v-model="formDetail.email" outlined clearable hide-bottom-space readonly>
                  <template v-slot:append>
                    <q-icon name="chevron_right" />
                  </template>
                </q-input>
              </template>
            </InputField> -->

            <InputField :label="$t('form.email')">
              <template #input>
                <q-input
                  type="email"
                  ref="emailRef"
                  hide-bottom-space
                  v-model="passwordForm.email"
                  :rules="[(val) => (val && val.length > 0) || $t('form.email_rules_01')]"
                  outlined
                  label-color="brand"
                  :placeholder="$t('form.email_placeholder')"
                ></q-input>
              </template>
            </InputField>

            <InputField :label="$t('form.verificationCode')">
              <template #input>
                <q-input
                  ref="ftCaptchaRef"
                  hide-bottom-space
                  type="text"
                  v-model="passwordForm.captchaCode"
                  :rules="[(val) => (val && val.length > 3) || $t('form.verificationCode_rules_01')]"
                  outlined
                  label-color="brand"
                  :placeholder="$t('form.verificationCode_placeholder')"
                >
                  <template v-slot:append>
                    <img :src="verificationImg" @click="getCode()" />
                  </template>
                </q-input>
              </template>
            </InputField>

            <!-- <div style="margin-top: 30px">
              <PrimaryButton :onClick="onSubmitForgotPwd" :label="'Submit'" />
            </div> -->
          </template>
        </InputRowGrid>
      </div>

      <div class="bottom-btn">
        <q-btn no-caps unelevated class="btn-primary btn-primary__full" :loading="isLoading" @click="onSubmitForgotPwd">
          {{ $t("btn.confirm") }}
        </q-btn>
      </div>
    </q-form>

    <q-form v-else class="q-gutter-y-md rounded-borders">
      <p>{{ $t("form.otp_sent_title") }}</p>
      <InputRowGrid>
        <template #fields>
          <InputField :label="$t('form.otp')">
            <template #input>
              <q-input
                ref="codeRef"
                hide-bottom-space
                v-model="verificationForm.code"
                :rules="[(val) => (val && val.length > 0) || $t('form.otp_rules_01')]"
                rounded
                outlined
                label-color="brand"
                color="white"
                :placeholder="$t('form.otp_placeholder')"
              ></q-input>
            </template>
          </InputField>

          <InputField :label="$t('form.newPassword')">
            <template #input>
              <q-input
                ref="newPwdRef"
                :type="isPwd ? 'password' : 'text'"
                hide-bottom-space
                v-model="verificationForm.newPassword"
                :rules="[
                  (val) => (val && val.length > 0) || $t('form.newPassword_rules_01'),
                  (val) => val.length > 6 || $t('form.newPassword_rules_02')
                ]"
                rounded
                outlined
                label-color="brand"
                color="white"
                :placeholder="$t('form.newPassword_placeholder')"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </template>
          </InputField>

          <InputField :label="$t('form.confirmNewPassword')">
            <template #input>
              <q-input
                ref="newConfirmPwdRef"
                :type="isConfirmPwd ? 'password' : 'text'"
                hide-bottom-space
                v-model="newConfirmPwdVModel"
                :rules="[
                  (val) => (val && val.length > 0) || 'Please insert password',
                  (val) => (val && val === verificationForm.newPassword) || $t('form.confirmNewPassword_rules_02')
                ]"
                rounded
                outlined
                label-color="brand"
                color="white"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isConfirmPwd = !isConfirmPwd"
                  />
                </template>
              </q-input>

              <!-- <div v-if="verificationForm.newPassword" class="password-str-div">
                <span
                  :class="{
                    'weak-pwd': pwdStrength == 'weak',
                    'normal-pwd': pwdStrength == 'normal',
                    'strong-pwd': pwdStrength == 'strong'
                  }"
                >
                  Weak
                </span>
                <span
                  :class="{
                    'normal-pwd': pwdStrength == 'normal',
                    'strong-pwd': pwdStrength == 'strong'
                  }"
                >
                  Normal
                </span>
                <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">Strong</span>
              </div> -->
            </template>
          </InputField>

          <InputField :label="$t('form.verificationCode')">
            <template #input>
              <q-input
                ref="captchaRef"
                hide-bottom-space
                type="text"
                v-model="verificationForm.captchaCode"
                :rules="[(val) => (val && val.length > 3) || $t('form.verificationCode_rules_01')]"
                rounded
                outlined
                label-color="brand"
                color="white"
                :placeholder="$t('form.verificationCode_placeholder')"
              >
                <template v-slot:append>
                  <img :src="verificationImg" @click="getCode()" />
                </template>
              </q-input>
            </template>
          </InputField>

          <div class="bottom-btn">
            <q-btn
              no-caps
              unelevated
              class="btn-primary btn-primary__full"
              :loading="isLoading"
              @click="onVerifyForgotPassword"
            >
              {{ $t("btn.confirm") }}
            </q-btn>
          </div>
        </template>
      </InputRowGrid>
    </q-form>

    <div class="bottom-img">
      <img src="../assets/images/auth/login-img3.png" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { SessionStorage } from "quasar";
import ConfirmButton from "src/atoms/ConfirmButton.vue";
import PrimaryButton from "../components/auth/PrimaryButton.vue";
import InputField from "../components/auth/InputField.vue";
import InputRowGrid from "../components/auth/InputRowGrid.vue";

const qs = require("qs");
const $q = useQuasar();
const router = useRouter();

const verificationImg = ref("");
const passwordForm = reactive({
  loginName: "",
  // phone: "",
  email: "",
  captchaCode: "",
  codeId: ""
});
const getCode = () => {
  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        verificationImg.value = "data:image/png;base64," + response.data.img;

        passwordForm.codeId = response.data.id;
        passwordForm.captchaCode = "";

        ftCaptchaRef.value.resetValidation();
      }
    })
    .catch((e) => {});
};

const loginNameRef = ref();
const phoneRef = ref();
const emailRef = ref();
const ftCaptchaRef = ref();

const codeRef = ref();
const newPwdRef = ref();
const newConfirmPwdRef = ref();
const captchaRef = ref();

// NOTE: not using for API param
const newConfirmPwdVModel = ref();

// const isValidEmail = () => {
//   const emailPattern =
//     /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
//   return emailPattern.test(passwordForm.email) || "Please Enter A Valid Email Address";
// };

const isRequestSent = ref(false);

const onSubmitForgotPwd = () => {
  loginNameRef.value.validate();
  emailRef.value.validate();
  ftCaptchaRef.value.validate();

  $q.loading.show({
    message: "Sending verification code..."
  });

  if (loginNameRef.value.hasError || emailRef.value.hasError || ftCaptchaRef.value.hasError) {
    $q.loading.hide();
  } else {
    api
      .post("/otp/sendForgetPasswordEmail", qs.stringify(passwordForm))
      .then((response) => {
        if (response.code === 0) {
          isRequestSent.value = true;
          SessionStorage.set("emailCodeId", response.data.codeId);
        }
      })
      .catch((error) => {})
      .then(() => {
        $q.loading.hide();
      });

    getCode();
  }
};

// const onSubmitForgotPwd = () => {
//   // loginNameRef.value.validate();
//   phoneRef.value.validate();
//   ftCaptchaRef.value.validate();

//   $q.loading.show({
//     message: "Sending verification code..."
//   });

//   passwordForm.loginName = passwordForm.phone;

//   if (
//     // loginNameRef.value.hasError ||
//     phoneRef.value.hasError ||
//     ftCaptchaRef.value.hasError
//   ) {
//     $q.loading.hide();
//   } else {
//     api
//       .post("/otp/sendForgetPasswordPhone", qs.stringify(passwordForm))
//       .then((response) => {
//         if (response.code === 0) {
//           isRequestSent.value = true;
//           SessionStorage.set("emailCodeId", response.data.codeId);
//         }
//       })
//       .catch((error) => {})
//       .then(() => {
//         $q.loading.hide();
//       });

//     getCode();
//   }
// };

// const verificationForm = reactive({
//   email: "",
//   code: "",
//   codeId: SessionStorage.getItem("emailCodeId"),
//   newPassword: ""
// });

const onVerifyForgotPassword = () => {
  codeRef.value.validate();
  newPwdRef.value.validate();
  captchaRef.value.validate();

  $q.loading.show({
    message: "Submitting..."
  });

  if (codeRef.value.hasError || newPwdRef.value.hasError || captchaRef.value.hasError) {
    $q.loading.hide();
  } else {
    verificationForm.codeId = SessionStorage.getItem("emailCodeId");
    verificationForm.email = passwordForm.email;

    api
      .post("/otp/verifyForgetPasswordEmail", qs.stringify(verificationForm))
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "Password Reset Completed",
            icon: "check_circle_outline"
          });
          isRequestSent.value = false;
          router.push("/login");
        }
      })
      .catch((error) => {})
      .then(() => {
        $q.loading.hide();
      });

    getCode();
  }
};

const verificationForm = reactive({
  // phone: "",
  code: "",
  captchaCode: "",
  codeId: SessionStorage.getItem("emailCodeId"),
  newPassword: ""
});
// const onVerifyForgotPassword = () => {
//   codeRef.value.validate();
//   newPwdRef.value.validate();
//   newConfirmPwdRef.value.validate();
//   captchaRef.value.validate();

//   $q.loading.show({
//     message: "Submitting..."
//   });

//   if (
//     codeRef.value.hasError ||
//     newPwdRef.value.hasError ||
//     newConfirmPwdRef.value.hasError ||
//     captchaRef.value.hasError
//   ) {
//     $q.loading.hide();
//   } else {
//     verificationForm.codeId = SessionStorage.getItem("emailCodeId");
//     // verificationForm.phone = passwordForm.phone;

//     api
//       .post("/otp/verifyForgetPasswordPhone", qs.stringify(verificationForm))
//       .then((response) => {
//         if (response.code === 0) {
//           $q.notify({
//             color: "positive",
//             position: "top",
//             message: "Password Reset Completed",
//             icon: "report_problem"
//           });

//           router.push("/login");
//         }
//       })
//       .catch((error) => {})
//       .then(() => {
//         $q.loading.hide();
//       });

//     getCode();
//   }
// };

const charType = (num) => {
  if (num >= 48 && num <= 57) return 1;
  if (num >= 97 && num <= 122) return 2;
  if (num >= 65 && num <= 90) return 4;
  return 8;
};

const isPwd = ref(true);
const isConfirmPwd = ref(true);
const pwdStrength = ref("");
watch(
  () => verificationForm.newPassword,
  () => {
    const pwd = verificationForm.newPassword;

    let result = 0;
    for (let i = 0, len = pwd.length; i < len; ++i) {
      result |= charType(pwd.charCodeAt(i));
    }

    let level = 0;
    for (var i = 0; i <= 4; i++) {
      if (result & 1) level++;
      result = result >>> 1;
    }

    pwdStrength.value = "";
    if (pwd.length >= 6) {
      switch (level) {
        case 1:
          pwdStrength.value = "weak";
          break;
        case 2:
          pwdStrength.value = "normal";
          break;
        case 3:
        case 4:
          pwdStrength.value = "strong";
          break;
      }
    } else {
      pwdStrength.value = "weak";
    }
  }
);

onMounted(() => {
  getCode();
});
</script>

<style scoped lang="scss">
.forgot-password-container {
  min-height: 100dvh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  background-color: #e9f2fd;
}

.back-left {
  position: fixed;
  top: 16px;
  left: 16px;
}

.forgot-password-form-logo-img {
  padding: 0 16px;
  display: flex;
  justify-content: center;
  img {
    display: block;
    width: 100%;
    max-width: 100px;
    margin-bottom: 10px;
    max-height: 30px;
  }
}

// .forgot-password-form-logo-img {
//   padding: 0 16px;
//   display: flex;
//   justify-content: center;
//   img {
//     display: block;
//     width: 100%;
//     max-width: 300px;
//   }
// }
.forgot-password-form-grid {
  display: grid;
  grid-auto-flow: row;
  gap: 7px;
  margin-top: 20px;

  .forgot-password-form-title {
    font-size: 22px;
    font-weight: 600;
    line-height: 30px;
    color: #3f8cf7;
  }

  .forgot-password-form-desc {
    font-size: 16px;
    font-weight: 400;
    line-height: 25px;
    color: #8c968f;
    width: 80%;
  }
}

.password-str-div {
  display: flex;
  align-items: center;
  margin-top: 3px;
  margin-bottom: 5px;
  justify-content: space-evenly;
  gap: 5px;
  height: 50px;

  span {
    padding: 8px 3px;
    border-radius: 5px;
    background: #434343;
    width: 33%;
    text-align: center;
  }

  span.weak-pwd {
    background: var(--q-negative);
  }

  span.normal-pwd {
    background: var(--q-warning);
    color: var(--q-primary);
  }

  span.strong-pwd {
    background: var(--q-positive);
    font-weight: 600;
  }
}

.bottom-btn {
  // margin-top: 20px;
  padding: 12px 0px 20px;
}

.bottom-img {
  text-align: center;
  margin-top: 10px;
}
</style>
