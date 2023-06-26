<template>
  <div class="forget-pass-section bg-white">
    <q-tabs
      v-model="tab"
      dense
      size="lg"
      class="text-grey"
      active-color="light-blue-9"
      indicator-color="light-blue-9"
      align="justify"
    >
      <q-tab name="mail" label="邮箱找回账号" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="mail">
        <div class="text-blue-grey">方式：请输入您的注册邮箱</div>
        <q-form v-if="!isEmailSent" class="rounded-borders" ref="passRef">
          <q-row class="row items-center justify-start">
            <q-item-label>
              <span class="text-red">*&nbsp;</span>注册邮箱:
            </q-item-label>

            <q-input
              ref="emailRef"
              hide-bottom-space
              type="email"
              borderless
              clearable
              placeholder="请输入注册邮箱"
              v-model="passwordForm.email"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || '请输入电子邮件',
                isValidEmail
              ]"
              color="white"
            >
            </q-input>
          </q-row>

          <q-row class="row items-center justify-start">
            <q-item-label>
              <span class="text-red">*&nbsp;</span>验证码
            </q-item-label>

            <q-input
              standout
              bg-color="white"
              ref="verificationRef"
              hide-bottom-space
              type="text"
              v-model="passwordForm.captchaCode"
              :rules="[(val) => (val && val.length > 3) || '验证码为四个']"
              label-color=""
            >
              <template v-slot:append>
                <img :src="verificationImg" @click="getCode" />
              </template>
            </q-input>
          </q-row>

          <div class="row justify-between items-center q-mt-md">
            <q-btn
              @click.prevent="submitForgetPass"
              label="提交"
              width="100%"
              color="dyblue"
              style="width: 100%"
            />
          </div>
        </q-form>

        <q-form v-if="isEmailSent" class="q-gutter-y-md rounded-borders">
          <p>OTP已发送到您的电子邮件中, 请输入OTP和新密码。</p>
          <q-input
            ref="codeRef"
            filled
            hide-bottom-space
            v-model="verificationForm.code"
            label="OTP码"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || '请输入OTP码']"
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
            label="新密码"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || '请输入密码',
              (val) =>
                (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12',
              (val) =>
                (val && (pwdStrength == 'normal' || pwdStrength == 'strong')) ||
                '密码安全级别必须至少为好'
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
          <div v-if="verificationForm.newPassword" class="password-str-div">
            <span
              :class="{
                'weak-pwd': pwdStrength == 'weak',
                'normal-pwd': pwdStrength == 'normal',
                'strong-pwd': pwdStrength == 'strong'
              }"
              >弱</span
            >
            <span
              :class="{
                'normal-pwd': pwdStrength == 'normal',
                'strong-pwd': pwdStrength == 'strong'
              }"
              >好</span
            >
            <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">强</span>
          </div>
          <q-input
            ref="captchaRef"
            filled
            hide-bottom-space
            type="text"
            v-model="verificationForm.captchaCode"
            label="验证码"
            lazy-rules
            color="white"
            :rules="[(val) => (val && val.length > 3) || '请输入验证码']"
          >
            <template v-slot:append>
              <img :src="verificationImg" @click="getCode()" />
            </template>
            <template v-slot:prepend>
              <q-icon name="security" />
            </template>
          </q-input>

          <div class="row justify-between items-center">
            <q-btn
              @click.prevent="onVerifyForgotPassword"
              label="提交"
              width="100%"
              color="dyblue"
              style="width: 100%"
            />
          </div>
        </q-form>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { SessionStorage } from "quasar";

export default defineComponent({
  name: "ForgotPwdPage",
  setup() {
    const verificationRef = ref();
    const tab = ref("mail");
    const isPwd = ref(true);
    onMounted(() => {
      getCode();
    });
    const verificationImg = ref("");
    const passwordForm = reactive({
      email: "",
      captchaCode: ""
    });
    const verificationForm = reactive({
      email: "",
      code: "",
      codeId: SessionStorage.getItem("emailCodeId"),
      newPassword: ""
    });
    const activeTab = ref("phone");
    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value =
              "data:image/png;base64," + response.data.img;
            passwordForm.codeId = response.data.id;
          }
        })
        .catch((e) => {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: e.message,
          //   icon: "report_problem"
          // });
        });
    };
    const loginNameRef = ref();
    const emailRef = ref();
    const ftCaptchaRef = ref();
    const codeRef = ref();
    const newPwdRef = ref();
    const captchaRef = ref();
    const $q = useQuasar();
    const pwdStrength = ref("");
    const isValidEmail = () => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(passwordForm.email) || "请输入有效电子邮件";
    };
    var qs = require("qs");
    const route = useRoute();
    const router = useRouter();
    const isEmailSent = ref(false);
    const isPhoneSent = ref(false);
    const isEmailSending = ref(false);
    const passRef = ref([]);
    const submitForgetPass = () => {
      passRef.value.validate().then(() => {
        findAccount(passForm).then((res) => {
          if (res.code === 0) {
            ElMessage.success("您的帐号已经发送到注册邮箱");
          }
        })
      });
    }
    const onSubmitForgotPwd = () => {

      emailRef.value.validate();
      ftCaptchaRef.value.validate();
      $q.loading.show({
        message: "Registering"
      });
      if (
        emailRef.value.hasError ||
        ftCaptchaRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
        api
          .post("/otp/sendForgetPasswordEmail", qs.stringify(passwordForm))
          .then((response) => {
            if (response.code === 0) {
              isEmailSent.value = true;
              SessionStorage.set("emailCodeId", response.data.codeId);
            } else {
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: res.message,
              //   icon: "report_problem"
              // });
            }
            $q.loading.hide();
          })
          .catch((error) => {
            $q.loading.hide();
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: error.message,
            //   icon: "report_problem"
            // });
          });
        getCode();
      }
    };
    const onVerifyForgotPassword = () => {
      codeRef.value.validate();
      newPwdRef.value.validate();
      captchaRef.value.validate();
      $q.loading.show({
        message: "กำลังตรวจสอบ"
      });
      if (
        codeRef.value.hasError ||
        newPwdRef.value.hasError ||
        captchaRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
        verificationForm.codeId = SessionStorage.getItem("emailCodeId");
        verificationForm.email = passwordForm.email;
        api
          .post(
            "/otp/verifyForgetPasswordEmail",
            qs.stringify(verificationForm)
          )
          .then((response) => {
            if (response.code === 0) {
              router.push("/login");
            } else {
            }
            $q.loading.hide();
          })
          .catch((error) => {
            $q.loading.hide();
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: error.message,
            //   icon: "report_problem"
            // });
          });
        getCode();
      }
    };

    watch(
      () => verificationForm.newPassword,
      () => {
        pwdStrength.value = "";

        var pwd = verificationForm.newPassword;
        var result = 0;
        for (var i = 0, len = pwd.length; i < len; ++i) {
          result |= charType(pwd.charCodeAt(i));
        }

        var level = 0;
        for (var i = 0; i <= 4; i++) {
          if (result & 1) {
            level++;
          }
          result = result >>> 1;
        }
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
    return {
      header: "Forgot Account & Password",
      passwordForm,
      verificationForm,
      verificationImg,
      activeTab,
      getCode,
      isValidEmail,
      isEmailSent,
      isPhoneSent,
      onSubmitForgotPwd,
      submitForgetPass,
      onVerifyForgotPassword,
      loginNameRef,
      emailRef,
      ftCaptchaRef,
      codeRef,
      newPwdRef,
      captchaRef,
      pwdStrength,
      tab,
      isPwd,
      passRef
    };
  }
});

function charType(num) {
  if (num >= 48 && num <= 57) {
    return 1;
  }
  if (num >= 97 && num <= 122) {
    return 2;
  }
  if (num >= 65 && num <= 90) {
    return 4;
  }
  return 8;
}
</script>

<style lang="scss">
.page-header {
  background-image: linear-gradient(to right, #de4545, #db7e42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 28px;
  text-align: center;
  font-family: Wave;
  padding: 10px;
  display: flex;
  gap: 20px;
  align-content: center;
  justify-content: center;
}

.verification {
  display: flex;
  padding: 10px;
}

.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    //border: 1px solid #fff;
    border-radius: 5px;
    background: #434343;
    width: 33%;
    text-align: center;
    font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial,
      sans-serif;
  }

  span.weak-pwd {
    background: var(--q-negative);
  }

  span.normal-pwd {
    background: var(--q-warning);
    color: var(--q-primary);
  }

  span.strong-pwd {
    //background: linear-gradient(to right, #de4545, #db7e42) !important;
    background: var(--q-positive);
    font-weight: 600;
  }
}

.forget-pass-section {
  .q-item__label {
    width: 95px;
    text-align: left;
  }

  .q-input {
    width: calc(100% - 100px);
  }
}
</style>
