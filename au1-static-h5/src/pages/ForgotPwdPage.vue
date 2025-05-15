<template>
  <div class="forgot-password-container">
    <div class="back-left">
      <!-- <router-link :to="'/login'">
        <q-btn dense rounded icon="arrow_back_ios_new" class="text-white q-mt-sm" />
      </router-link> -->
    </div>
    <!--
      <div class="text-blue-grey">
      Please Provide Your Username And Phone Number, We Will Send OTP To Your Registered Phone Number.
    </div>
  -->

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
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please Enter Username']"
        rounded
        outlined
        label-color="brand"
        color="white"
        class="landing-input"
      ></q-input> -->

      <div class="forgot-password-form-grid">
        <!-- <span class="forgot-password-form-title">Forgot Password</span> -->

        <span class="forgot-password-form-field-label">Phone Number</span>
        <q-input
          type="tel"
          pattern="\d*"
          maxlength="10"
          ref="phoneRef"
          hide-bottom-space
          v-model="passwordForm.phone"
          :rules="[(val) => (val && val.length > 0) || 'Please insert Phone number']"
          outlined
          label-color="brand"
          color="white"
          class="landing-input"
        >
          <template v-slot:prepend>
            <img class="white-svg" src="../assets/images/auth/phone.svg" />
            <span class="prepend-number">+61</span>
          </template>
        </q-input>

        <span class="forgot-password-form-field-label">Verification Code</span>
        <q-input
          ref="ftCaptchaRef"
          hide-bottom-space
          type="text"
          v-model="passwordForm.captchaCode"
          lazy-rules
          :rules="[(val) => (val && val.length > 3) || 'Please Enter Verification Code']"
          outlined
          label-color="brand"
          color="white"
          class="landing-input"
        >
          <template v-slot:append>
            <img :src="verificationImg" @click="getCode()" />
          </template>
        </q-input>

        <div>
          <q-btn @click.prevent="onSubmitForgotPwd" type="submit" class="submit-btn" label="Submit" rounded no-caps />
        </div>

        <div class="forgot-password-form-logo-img" style="margin-top: 50px">
          <img src="../assets/55-ace-logo.png" />
        </div>
        <span class="forgot-password-form-desc">
          Please Provide Your Username, We Will Send OTP To Your Registered Phone Number.
        </span>
      </div>
    </q-form>
    <q-form v-else class="q-gutter-y-md rounded-borders">
      <p>OTP Has Been Sent To Your Phone Number, Please Enter The OTP And New Password.</p>
      <q-input
        ref="codeRef"
        hide-bottom-space
        v-model="verificationForm.code"
        label="OTP"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please Enter OTP']"
        rounded
        outlined
        label-color="brand"
        color="white"
        class="landing-input"
        name="otp"
      ></q-input>

      <q-input
        ref="newPwdRef"
        :type="isPwd ? 'password' : 'text'"
        hide-bottom-space
        v-model="verificationForm.newPassword"
        label="New Password"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please Enter New Password',
          (val) => (val.length > 5 && val.length <= 12) || 'Password Must Be 6 To 12 Character',
          (val) => (val && (pwdStrength == 'normal' || pwdStrength == 'strong')) || 'Stronger Password Is Recommended'
        ]"
        rounded
        outlined
        label-color="brand"
        color="white"
        class="landing-input"
      >
        <template v-slot:append>
          <q-icon
            color="bright"
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <q-input
        ref="newConfirmPwdRef"
        :type="isConfirmPwd ? 'password' : 'text'"
        hide-bottom-space
        v-model="newConfirmPwdVModel"
        label="Confirm New Password"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please Enter Confirm Password',
          (val) => (val.length > 5 && val.length <= 12) || 'Confirm Password Must Be 6 To 12 Character',
          (val) => (val && val === verificationForm.newPassword) || 'Confirm Password Does Not Match'
        ]"
        rounded
        outlined
        label-color="brand"
        color="white"
        class="landing-input"
      >
        <template v-slot:append>
          <q-icon
            color="bright"
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
      </div>

      <q-input
        ref="captchaRef"
        hide-bottom-space
        type="text"
        v-model="verificationForm.captchaCode"
        label="Verification Code"
        lazy-rules
        :rules="[(val) => (val && val.length > 3) || 'Please Enter Verification Code']"
        rounded
        outlined
        label-color="brand"
        color="white"
        class="landing-input"
      >
        <template v-slot:append>
          <img :src="verificationImg" @click="getCode()" />
        </template>
      </q-input> -->

      <ConfirmButton label="Submit" :confirmFunc="onVerifyForgotPassword"></ConfirmButton>
    </q-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { SessionStorage } from "quasar";
import ConfirmButton from "src/atoms/ConfirmButton.vue";

const qs = require("qs");
const $q = useQuasar();
const router = useRouter();

const verificationImg = ref("");
const passwordForm = reactive({
  loginName: "",
  phone: "",
  // email: "",
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
// const emailRef = ref();
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
// const onSubmitForgotPwd = () => {
//   loginNameRef.value.validate();
//   emailRef.value.validate();
//   ftCaptchaRef.value.validate();

//   $q.loading.show({
//     message: "Sending verification code..."
//   });

//   if (loginNameRef.value.hasError || emailRef.value.hasError || ftCaptchaRef.value.hasError) {
//     $q.loading.hide();
//   } else {
//     api
//       .post("/otp/sendForgetPasswordEmail", qs.stringify(passwordForm))
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

const onSubmitForgotPwd = () => {
  // loginNameRef.value.validate();
  phoneRef.value.validate();
  ftCaptchaRef.value.validate();

  $q.loading.show({
    message: "Sending verification code..."
  });

  passwordForm.loginName = passwordForm.phone;

  if (
    // loginNameRef.value.hasError ||
    phoneRef.value.hasError ||
    ftCaptchaRef.value.hasError
  ) {
    $q.loading.hide();
  } else {
    api
      .post("/otp/sendForgetPasswordPhone", qs.stringify(passwordForm))
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

// const verificationForm = reactive({
//   email: "",
//   code: "",
//   codeId: SessionStorage.getItem("emailCodeId"),
//   newPassword: ""
// });
// const onVerifyForgotPassword = () => {
//   codeRef.value.validate();
//   newPwdRef.value.validate();
//   captchaRef.value.validate();

//   $q.loading.show({
//     message: "Submitting..."
//   });

//   if (codeRef.value.hasError || newPwdRef.value.hasError || captchaRef.value.hasError) {
//     $q.loading.hide();
//   } else {
//     verificationForm.codeId = SessionStorage.getItem("emailCodeId");
//     verificationForm.email = passwordForm.email;

//     api
//       .post("/otp/verifyForgetPasswordEmail", qs.stringify(verificationForm))
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

const verificationForm = reactive({
  phone: "",
  code: "",
  captchaCode: "",
  codeId: SessionStorage.getItem("emailCodeId"),
  newPassword: ""
});
const onVerifyForgotPassword = () => {
  codeRef.value.validate();
  newPwdRef.value.validate();
  newConfirmPwdRef.value.validate();

  $q.loading.show({
    message: "Submitting..."
  });

  if (codeRef.value.hasError || newPwdRef.value.hasError || newConfirmPwdRef.value.hasError) {
    $q.loading.hide();
  } else {
    verificationForm.codeId = SessionStorage.getItem("emailCodeId");
    verificationForm.phone = passwordForm.phone;

    api
      .post("/otp/verifyForgetPasswordPhone", qs.stringify(verificationForm))
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "Password Reset Completed",
            icon: "report_problem"
          });

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
  // min-height: 100vh;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: url("../assets/images/index/auth-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.back-left {
  position: fixed;
  top: 16px;
  left: 16px;
}

.forgot-password-form-logo-img {
  img {
    display: block;
    width: 95%;
    margin: 20px auto;
    max-width: 200px;
  }
}
.forgot-password-form-grid {
  display: grid;
  grid-auto-flow: row;
  gap: 7px;

  .forgot-password-form-title {
    font-size: 22px;
    font-weight: 600;
    line-height: 30px;
  }

  .forgot-password-form-desc {
    font-size: 16px;
    font-weight: 400;
    line-height: 25px;
    color: #ffffff67;
    width: 80%;
  }

  .forgot-password-form-field-label {
    margin-top: 15px;
  }
}

.submit-btn {
  background-color: #8b00ff;
  width: 100%;
  height: 56px;
  border-radius: 4px;
  margin-top: 35px;
}

.landing-input {
  :deep(.q-field__control) {
    padding-left: 20px;
    padding-right: 20px;
  }
  :deep(.q-field__control):before {
    border-color: #1e1f24;
    background-color: #1e1f24;
    border-width: 2px;
  }
  img {
    z-index: 3;
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

.prepend-number {
  z-index: 2;
  margin-left: 6px;
}
</style>
