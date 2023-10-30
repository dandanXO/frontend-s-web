<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <div class="text-blue-grey">
        Please Provide Your Username And Phone Number, And We Will Send A New Password To Your Registered Phone Number.
      </div>

      <q-form v-if="!isRequestSent" class="q-gutter-y-md rounded-borders">
        <q-input
          ref="loginNameRef"
          filled
          hide-bottom-space
          v-model="passwordForm.loginName"
          label="Username"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please Enter Username']"
          color="white"
        >
          <template v-slot:prepend>
            <q-icon name="person_outline" />
          </template>
        </q-input>

        <!-- <q-input
          ref="emailRef"
          type="email"
          filled
          hide-bottom-space
          v-model="passwordForm.email"
          label="Email Address"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please Enter Email Address', isValidEmail]"
          color="white"
        >
          <template v-slot:prepend>
            <q-icon name="mail_outline" />
          </template>
        </q-input> -->

        <q-input
          ref="phoneRef"
          type="number"
          filled
          hide-bottom-space
          v-model="passwordForm.phone"
          label="Phone Number"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please Enter Phone Number']"
          color="white"
        >
          <template v-slot:prepend>
            <q-icon name="smartphone" />
          </template>
        </q-input>

        <q-input
          ref="ftCaptchaRef"
          filled
          hide-bottom-space
          type="text"
          v-model="passwordForm.captchaCode"
          label="Verification Code"
          lazy-rules
          color="white"
          :rules="[(val) => (val && val.length > 3) || 'Please Enter Verification Code']"
        >
          <template v-slot:append>
            <img :src="verificationImg" @click="getCode()" />
          </template>
          <template v-slot:prepend>
            <q-icon name="security" />
          </template>
        </q-input>

        <ConfirmButton label="Submit" :confirmFunc="onSubmitForgotPwd"></ConfirmButton>
      </q-form>
      <q-form v-else class="q-gutter-y-md rounded-borders">
        <p>OTP Has Been Sent To Your Phone Number, Please Enter The OTP And New Password.</p>
        <q-input
          ref="codeRef"
          filled
          hide-bottom-space
          v-model="verificationForm.code"
          label="OTP"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please Enter OTP']"
          color="white"
        >
          <template v-slot:prepend>
            <q-icon name="qr_code" />
          </template>
        </q-input>

        <q-input
          ref="newPwdRef"
          :type="isPwd ? 'password' : 'text'"
          filled
          hide-bottom-space
          v-model="verificationForm.newPassword"
          label="New Password"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Please Enter New Password',
            (val) => (val.length > 5 && val.length <= 12) || 'Password Must Be 6 To 12 Character',
            (val) => (val && (pwdStrength == 'normal' || pwdStrength == 'strong')) || 'Stronger Password Is Recommended'
          ]"
          color="white"
        >
          <template v-slot:prepend>
            <q-icon name="lock_open" />
          </template>
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
          filled
          hide-bottom-space
          v-model="newConfirmPwdVModel"
          label="Confirm New Password"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Please Enter Confirm Password',
            (val) => (val.length > 5 && val.length <= 12) || 'Confirm Password Must Be 6 To 12 Character',
            (val) => (val && val === verificationForm.newPassword) || 'Confirm Password Does Not Match'
          ]"
          color="white"
        >
          <template v-slot:prepend>
            <q-icon name="lock_open" />
          </template>
          <template v-slot:append>
            <q-icon
              color="bright"
              :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isConfirmPwd = !isConfirmPwd"
            />
          </template>
        </q-input>

        <div v-if="verificationForm.newPassword" class="password-str-div">
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
          filled
          hide-bottom-space
          type="text"
          v-model="verificationForm.captchaCode"
          label="Verification Code"
          lazy-rules
          color="white"
          :rules="[(val) => (val && val.length > 3) || 'Please Enter Verification Code']"
        >
          <template v-slot:append>
            <img :src="verificationImg" @click="getCode()" />
          </template>
          <template v-slot:prepend>
            <q-icon name="security" />
          </template>
        </q-input>

        <ConfirmButton label="Submit" :confirmFunc="onVerifyForgotPassword"></ConfirmButton>
      </q-form>
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
  loginNameRef.value.validate();
  phoneRef.value.validate();
  ftCaptchaRef.value.validate();

  $q.loading.show({
    message: "Sending verification code..."
  });

  if (loginNameRef.value.hasError || phoneRef.value.hasError || ftCaptchaRef.value.hasError) {
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
  captchaRef.value.validate();

  $q.loading.show({
    message: "Submitting..."
  });

  if (
    codeRef.value.hasError ||
    newPwdRef.value.hasError ||
    newConfirmPwdRef.value.hasError ||
    captchaRef.value.hasError
  ) {
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
    font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
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
</style>
