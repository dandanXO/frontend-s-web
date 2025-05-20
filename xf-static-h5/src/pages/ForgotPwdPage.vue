<template>
  <div class="forget-pass-section">
    <RoundTab v-model:tab="tab" :items="tabItems" @change="goToTab"></RoundTab>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="phone">
        <div class="text-red" v-if="!isPhoneSent">方式：请输入您需找回登陆密码的用户名和验证手机号码</div>

        <div class="forgetpass-board q-gutter-y-md q-mt-md">
          <q-form v-if="!isPhoneSent" class="rounded-borders q-gutter-y-md" ref="phoneFormRef">
            <q-input
              hide-bottom-space
              ref="userRef"
              type="text"
              v-model="passwordFormPhone.loginName"
              label="用户名"
              :rules="[
                (val) => (val && val.length > 0) || '请输入用户名',
                (val) => (val && val.length >= 4 && val.length <= 12) || '长度要在 4-12 之间'
              ]"
              clearable
              label-color="brand"
              autocomplete="username"
              rounded
              outlined
              color="white"
              bg-color="inputstyle"
            >
              <template v-slot:prepend>
                <q-icon color="bright" name="person_outline" size="24px" />
              </template>
            </q-input>

            <q-input
              hide-bottom-space
              ref="phoneRef"
              type="text"
              v-model="passwordFormPhone.phone"
              label="手机号码"
              :rules="[(val) => (val && val.length > 0) || '请输入手机号码', (val) => isValidPhone(val)]"
              clearable
              label-color="brand"
              rounded
              outlined
              color="white"
              bg-color="inputstyle"
            >
              <template v-slot:prepend>
                <q-icon color="bright" name="phone" size="24px" />
              </template>
            </q-input>

            <q-input
              hide-bottom-space
              ref="verificationRef"
              type="text"
              v-model="passwordFormPhone.captchaCode"
              label="验证码"
              :rules="[(val) => (val && val.length > 3 && val.length < 5) || '验证码应为四个字符串']"
              clearable
              label-color="brand"
              rounded
              outlined
              color="white"
              bg-color="inputstyle"
            >
              <template v-slot:append>
                <img :src="verificationImg" @click="getCode" />
              </template>
              <template v-slot:prepend>
                <q-icon color="bright" name="security" size="24px" />
              </template>
            </q-input>

            <div class="row justify-between items-center q-mt-md">
              <q-btn
                @click.prevent="submitSendOtp('phone')"
                label="提交"
                width="100%"
                size="md"
                color="brightbtn"
                style="width: 100%"
                rounded
              />
            </div>
          </q-form>

          <div v-if="isPhoneSent" class="text-blue q-px-md">OTP短信已发送到您的注册手机, 请输入OTP和新密码。</div>
          <q-form v-if="isPhoneSent" class="q-gutter-y-md rounded-borders form-after-submit">
            <q-input
              hide-bottom-space
              ref="codeRef"
              type="text"
              v-model="verificationPhoneForm.code"
              label="OTP码"
              :rules="[
                (val) => (val && val.length > 0) || '请输入OTP码',
                (val) => (val && val.length >= 4 && val.length <= 6) || 'OTP长度不符'
              ]"
              clearable
              label-color="brand"
              rounded
              outlined
              color="white"
              bg-color="inputstyle"
            >
              <template v-slot:prepend>
                <q-icon color="bright" name="qr_code" size="24px" />
              </template>
            </q-input>

            <q-input
              ref="newPwdRef"
              hide-bottom-space
              v-model="verificationPhoneForm.newPassword"
              label="新密码"
              :type="isPwd ? 'password' : 'text'"
              :rules="[
                (val) => (val && val.length > 0) || '请输入密码',
                (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12'
              ]"
              label-color="brand"
              rounded
              outlined
              color="white"
              bg-color="inputstyle"
            >
              <template v-slot:prepend>
                <q-icon color="bright" name="lock_open" size="24px" />
              </template>
              <template v-slot:append>
                <q-icon
                  color="grey"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <q-input
              ref="confirmPwdRef"
              hide-bottom-space
              v-model="verificationPhoneForm.confirmPwd"
              label="确认新密码"
              :type="isPwd ? 'password' : 'text'"
              :rules="[
                (val) => (val && val.length > 0) || '请输入确认密码',
                (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12',
                validatePassNew
              ]"
              label-color="brand"
              rounded
              outlined
              color="white"
              bg-color="inputstyle"
            >
              <template v-slot:prepend>
                <q-icon color="bright" name="lock_open" size="24px" />
              </template>
              <template v-slot:append>
                <q-icon
                  color="grey"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div class="row justify-between items-center">
              <q-btn
                @click.prevent="onVerifyForgotPassword('phone')"
                label="提交"
                width="100%"
                size="md"
                color="brightbtn"
                style="width: 100%"
                rounded
              />
            </div>
          </q-form>
        </div>
      </q-tab-panel>
      <q-tab-panel name="email">
        <div class="text-red" v-if="!isEmailSent">方式：请输入您需找回登陆密码的用户名和验证邮箱</div>

        <div class="forgetpass-board q-gutter-y-md q-mt-md">
          <q-form v-if="!isEmailSent" class="rounded-borders q-gutter-y-md" ref="phoneFormRef">
            <q-input
              hide-bottom-space
              ref="userRef2"
              v-model="passwordFormEmail.loginName"
              label="用户名"
              :rules="[
                (val) => (val && val.length > 0) || '请输入用户名',
                (val) => (val && val.length >= 4 && val.length <= 12) || '长度要在 4-12 之间'
              ]"
              label-color="brand"
              autocomplete="username"
              clearable
              rounded
              outlined
              color="white"
              bg-color="inputstyle"
            >
              <template v-slot:prepend>
                <q-icon color="bright" name="person_outline" size="24px" />
              </template>
            </q-input>

            <q-input
              hide-bottom-space
              ref="emailRef"
              type="email"
              v-model="passwordFormEmail.email"
              label="验证邮箱"
              :rules="[(val) => (val && val.length > 0) || '请输入验证邮箱', (val) => isValidEmail(val)]"
              label-color="brand"
              clearable
              rounded
              outlined
              color="white"
              bg-color="inputstyle"
            >
              <template v-slot:prepend>
                <q-icon color="bright" name="email" size="24px" />
              </template>
            </q-input>

            <q-input
              hide-bottom-space
              ref="verificationRef"
              type="text"
              v-model="passwordFormEmail.captchaCode"
              label="验证码"
              :rules="[(val) => (val && val.length > 3 && val.length < 5) || '验证码应为四个字符串']"
              clearable
              label-color="brand"
              rounded
              outlined
              color="white"
              bg-color="inputstyle"
            >
              <template v-slot:append>
                <img :src="verificationImg" @click="getCode" />
              </template>
              <template v-slot:prepend>
                <q-icon color="bright" name="security" size="24px" />
              </template>
            </q-input>

            <div class="row justify-between items-center q-mt-md">
              <q-btn
                @click.prevent="submitSendOtp('email')"
                label="提交"
                width="100%"
                size="md"
                color="brightbtn"
                style="width: 100%"
                rounded
              />
            </div>
          </q-form>

          <div v-if="isEmailSent" class="text-blue q-px-md">OTP信息已发送到您的注册邮箱, 请输入OTP和新密码。</div>
          <q-form v-if="isEmailSent" class="q-gutter-y-md rounded-borders form-after-submit">
            <q-input
              hide-bottom-space
              ref="codeRef2"
              type="text"
              v-model="verificationForm.code"
              label="OTP码"
              :rules="[
                (val) => (val && val.length > 0) || '请输入OTP码',
                (val) => (val && val.length >= 4 && val.length <= 6) || 'OTP长度不符'
              ]"
              clearable
              label-color="brand"
              rounded
              outlined
              color="white"
              bg-color="inputstyle"
            >
              <template v-slot:prepend>
                <q-icon color="bright" name="qr_code" size="24px" />
              </template>
            </q-input>

            <q-input
              ref="newPwdRef2"
              hide-bottom-space
              v-model="verificationForm.newPassword"
              label="新密码"
              :type="isPwd ? 'password' : 'text'"
              :rules="[
                (val) => (val && val.length > 0) || '请输入密码',
                (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12'
              ]"
              label-color="brand"
              rounded
              outlined
              color="white"
              bg-color="inputstyle"
            >
              <template v-slot:prepend>
                <q-icon color="bright" name="lock_open" size="24px" />
              </template>
              <template v-slot:append>
                <q-icon
                  color="grey"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <q-input
              ref="confirmPwdRef2"
              hide-bottom-space
              v-model="verificationForm.confirmPwd"
              label="确认新密码"
              :type="isPwd ? 'password' : 'text'"
              :rules="[
                (val) => (val && val.length > 0) || '请输入确认密码',
                (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12',
                validatePassNew2
              ]"
              label-color="brand"
              rounded
              outlined
              color="white"
              bg-color="inputstyle"
            >
              <template v-slot:prepend>
                <q-icon color="bright" name="lock_open" size="24px" />
              </template>
              <template v-slot:append>
                <q-icon
                  color="grey"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div class="row justify-between items-center">
              <q-btn
                @click.prevent="onVerifyForgotPassword('email')"
                label="提交"
                width="100%"
                size="md"
                color="brightbtn"
                style="width: 100%"
                rounded
              />
            </div>
          </q-form>
        </div>
      </q-tab-panel>
      <q-tab-panel name="mail">
        <div class="text-red">方式：请输入您的注册邮箱</div>
        <q-form v-if="!isEmailSent" class="rounded-borders q-gutter-y-md q-mt-md" ref="passRef">
          <q-input
            hide-bottom-space
            ref="emailRef"
            type="email"
            v-model="passwordForm.email"
            label="验证邮箱"
            :rules="[(val) => (val && val.length > 0) || '请输入电子邮件', isValidEmail]"
            label-color="brand"
            clearable
            rounded
            outlined
            color="white"
            bg-color="inputstyle"
          >
            <template v-slot:prepend>
              <q-icon color="bright" name="email" size="24px" />
            </template>
          </q-input>

          <q-input
            hide-bottom-space
            ref="verificationRef"
            type="text"
            v-model="passwordForm.captchaCode"
            label="验证码"
            :rules="[(val) => (val && val.length > 3 && val.length < 5) || '验证码应为四个字符串']"
            clearable
            label-color="brand"
            rounded
            outlined
            color="white"
            bg-color="inputstyle"
          >
            <template v-slot:append>
              <img :src="verificationImg" @click="getCode" />
            </template>
            <template v-slot:prepend>
              <q-icon color="bright" name="security" size="24px" />
            </template>
          </q-input>

          <div class="row justify-between items-center q-mt-md">
            <q-btn
              @click.prevent="submitForgetPass"
              label="提交"
              size="md"
              width="100%"
              color="brightbtn"
              style="width: 100%"
              rounded
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
import RoundTab from "src/components/RoundTab.vue";
import qs from "qs";

export default defineComponent({
  name: "ForgotPwdPage",
  components: {
    RoundTab
  },
  setup() {
    const verificationRef = ref();
    const tab = ref("phone");
    const isPwd = ref(true);
    const tabItems = [
      {
        name: "phone",
        label: "短信修改密码"
      },
      {
        name: "email",
        label: "邮箱修改密码"
      },
      {
        name: "mail",
        label: "邮箱找回账号"
      }
    ];

    onMounted(() => {
      getCode();
    });
    const verificationImg = ref("");
    const passwordForm = reactive({
      email: "",
      captchaCode: ""
    });
    const activeTab = ref("phone");
    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value = "data:image/png;base64," + response.data.img;
            passwordForm.codeId = response.data.id;

            passwordFormPhone.codeId = response.data.id;
            passwordFormEmail.codeId = response.data.id;

            passwordFormPhone.captchaCode = "";
            passwordFormEmail.captchaCode = "";
            passwordForm.captchaCode = "";
          }
        })
        .catch((e) => {});
    };
    const loginNameRef = ref();
    const emailRef = ref();
    const emailRef2 = ref();

    const phoneRef = ref();
    const userRef2 = ref();
    const userRef = ref();
    const ftCaptchaRef = ref();
    const codeRef = ref();
    const newPwdRef = ref();
    const captchaRef = ref();
    const confirmPwdRef = ref();

    const newPwdRef2 = ref();
    const codeRef2 = ref();
    const confirmPwdRef2 = ref();

    const $q = useQuasar();
    const pwdStrength = ref("");

    var qs = require("qs");
    const route = useRoute();
    const router = useRouter();
    const isEmailSent = ref(false);
    const isPhoneSent = ref(false);
    const isEmailSending = ref(false);
    const passRef = ref([]);

    const passwordFormPhone = reactive({
      codeId: "",
      loginName: "",
      phone: "",
      captchaCode: ""
    });
    const passwordFormEmail = reactive({
      codeId: "",
      loginName: "",
      email: "",
      captchaCode: ""
    });
    const verificationForm = reactive({
      email: null,
      phone: null,
      code: "",
      codeId: SessionStorage.getItem("emailCodeId"),
      newPassword: "",
      confirmPwd: ""
    });

    const verificationPhoneForm = reactive({
      email: null,
      phone: null,
      code: "",
      codeId: SessionStorage.getItem("phoneCodeId"),
      newPassword: "",
      confirmPwd: ""
    });

    const submitSendOtp = (method) => {
      if (method === "phone") {
        phoneRef.value.validate();
        userRef.value.validate();

        if (phoneRef.value.hasError || userRef.value.hasError) {
        } else {
          $q.loading.show({
            message: "发送验证码中..."
          });
          api
            .post("/otp/sendForgetPasswordPhone", qs.stringify(passwordFormPhone))
            .then((response) => {
              if (response.code === 0) {
                isPhoneSent.value = true;
                SessionStorage.set("phoneCodeId", response.data.codeId);
              }
              $q.loading.hide();

              $q.notify({
                color: "positive",
                position: "top",
                message: "请输入新密码",
                icon: "check_circle_outline"
              });
              getCode();
            })
            .catch((error) => {
              getCode();
              $q.loading.hide();
            });
        }
      } else if (method === "email") {
        emailRef.value.validate();
        userRef2.value.validate();

        if (emailRef.value.hasError || userRef2.value.hasError) {
        } else {
          $q.loading.show({
            message: "发送验证码中..."
          });
          api
            .post("/otp/sendForgetPasswordEmail", qs.stringify(passwordFormEmail))
            .then((response) => {
              if (response.code === 0) {
                isEmailSent.value = true;
                SessionStorage.set("emailCodeId", response.data.codeId);
              }
              $q.loading.hide();

              $q.notify({
                color: "positive",
                position: "top",
                message: "请输入新密码",
                icon: "check_circle_outline"
              });
              getCode();
            })
            .catch((error) => {
              getCode();
              $q.loading.hide();
            });
        }
      }
    };

    const submitForgetPass = () => {
      emailRef2.value.validate();
      verificationRef.value.validate();

      if (emailRef2.value.hasError || verificationRef.value.hasError) {
      } else {
        api
          .post("/otp/findAccount", qs.stringify(passwordForm))
          .then((res) => {
            if (res.code === 0) {
              getCode();
              $q.notify({
                message: "您的帐号已经发送到注册邮箱",
                color: "positive",
                position: "top"
              });

              passwordForm.email = "";
            }
          })
          .catch((res) => {
            getCode();
          });
      }
    };

    const onVerifyForgotPassword = (method) => {
      if (method == "phone") {
        codeRef.value.validate();
        newPwdRef.value.validate();
        confirmPwdRef.value.validate();
        $q.loading.show({
          message: "提交中.."
        });
        if (codeRef.value.hasError || newPwdRef.value.hasError || confirmPwdRef.value.hasError) {
          $q.loading.hide();
        } else {
          verificationPhoneForm.codeId = SessionStorage.getItem("phoneCodeId");
          verificationPhoneForm.phone = passwordFormPhone.phone;

          api
            .post("/otp/verifyForgetPasswordPhone", qs.stringify(verificationPhoneForm))
            .then((response) => {
              if (response.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: "密码修改成功",
                  icon: "check_circle_outline"
                });
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
      } else if (method == "email") {
        codeRef2.value.validate();
        newPwdRef2.value.validate();
        confirmPwdRef2.value.validate();
        $q.loading.show({
          message: "提交中.."
        });
        if (codeRef2.value.hasError || newPwdRef2.value.hasError || confirmPwdRef2.value.hasError) {
          $q.loading.hide();
        } else {
          verificationForm.codeId = SessionStorage.getItem("emailCodeId");
          verificationForm.email = passwordFormEmail.email;
          api
            .post("/otp/verifyForgetPasswordEmail", qs.stringify(verificationForm))
            .then((response) => {
              if (response.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: "密码修改成功",
                  icon: "check_circle_outline"
                });
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
      }
    };

    const goToTab = (tabVal) => {
      getCode();

      passwordFormPhone.codeId = "";
      passwordFormPhone.loginName = "";
      passwordFormPhone.phone = "";
      passwordFormPhone.captchaCode = "";

      passwordFormEmail.codeId = "";
      passwordFormEmail.loginName = "";
      passwordFormEmail.email = "";
      passwordFormEmail.captchaCode = "";
    };

    const isValidPhone = (val) => {
      const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      return phonePattern.test(val) || "请输入有效的电话号码";
    };

    const isValidEmail = (val) => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "请输入有效电子邮件";
    };

    const validatePassNew = () => {
      if (verificationPhoneForm.confirmPwd !== verificationPhoneForm.newPassword) {
        return "密码不同";
      }
    };

    const validatePassNew2 = () => {
      if (verificationForm.confirmPwd !== verificationForm.newPassword) {
        return "密码不同";
      }
    };

    return {
      header: "Forgot Account & Password",
      passwordForm,
      verificationForm,
      validatePassNew,
      validatePassNew2,
      verificationPhoneForm,
      verificationImg,
      activeTab,
      getCode,
      isValidEmail,
      isEmailSent,
      isPhoneSent,
      submitForgetPass,
      onVerifyForgotPassword,
      submitSendOtp,
      passwordFormPhone,
      passwordFormEmail,
      loginNameRef,
      emailRef,
      emailRef2,
      phoneRef,
      userRef,
      userRef2,
      ftCaptchaRef,
      confirmPwdRef,
      verificationRef,
      codeRef,
      newPwdRef,
      captchaRef,
      newPwdRef2,
      codeRef2,
      confirmPwdRef2,
      pwdStrength,
      tab,
      isPwd,
      isValidPhone,
      goToTab,
      passRef,
      tabItems
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
    //background: linear-gradient(to right, #de4545, #db7e42) !important;
    background: var(--q-positive);
    font-weight: 600;
  }
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

.forget-pass-section {
  .q-tabs {
    width: 90%;
    margin: 0 auto;
    .q-tab {
      min-height: 46px;
      padding: 0;
      margin: 0;
    }
  }
}

.form-after-submit {
  .q-input {
    width: calc(100%);
  }
}

.captcha-textfield {
  .q-field__control {
    background: #000;
  }
}

.captcha-textfield input:active,
.captcha-textfield input:focus,
.captcha-textfield input {
  color: #fff !important;
}

.common-btn {
  flex: 1;
  border: 0;
  background: #33bcd4;
  border-radius: 0;
  font-size: 12px;
  text-align: center;

  &:hover {
    box-shadow: none;
  }

  &.active {
    background: #ffffff;
    color: #000000;
  }
}
</style>
