<template>
  <div class="login-container">
    <div class="margin-center login-form-wrapper">
      <div class="game-title">
        <span class="menu-title">FORGOT ACCOUNT &amp; PASSWORD</span>
      </div>
      <!-- <h2 style="color: #ffffff">Retrieve account using email</h2> -->
      <a-tabs type="card" v-model="forgotActive">
        <a-tab-pane key="phonePwd" tab="Retrieve password via phone">
          <a-form v-if="!isOtpSent" ref="forgotPwdFormPhoneRef" :model="passwordForm" :rules="phonePasswordRules">
            <p>Please enter the account and the mobile number associated with your account for password recovery.</p>
            <a-form-item :disabled="!isLoading" name="loginName">
              <a-input v-model:value="passwordForm.loginName" placeholder="Login name">
                <template #prefix>
                  <RiUserFill />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="phone" required name="phone">
              <a-input v-model:value="passwordForm.phone" placeholder="mobile number">
                <template #prefix>
                  <RiPhoneFill />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="captchaCode" required name="captchaCode">
              <a-input v-model:value="passwordForm.captchaCode" :maxlength="4" placeholder="Captcha">
                <template #prefix>
                  <RiShieldCheckFill />
                </template>
              </a-input>
              <div class="verification" @click="getCode()">
                <img :src="verificationImg" />
              </div>
            </a-form-item>

            <a-form-item class="txt-center">
              <button
                class="common-btn login-btn"
                type="submit"
                :disabled="isLoading"
                :style="isLoading ? 'opacity: .6' : ''"
                @click="onSubmitForgotPwd"
              >
                {{ isLoading ? "Submitting" : "Submit" }}
              </button>
            </a-form-item>
          </a-form>
          <a-form
            v-if="isOtpSent"
            ref="forgotPwdPostVerifyFormPhoneRef"
            :model="verificationForm"
            :rules="verificationRules"
          >
            <p style="color: #ffffff">An OTP has been sent to your mobile number, please enter OTP and new password.</p>
            <a-form-item ref="code" required name="code">
              <a-input v-model:value="verificationForm.code" placeholder="Enter OTP">
                <template #prefix>
                  <RiQrCodeFill />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="newPassword" required name="newPassword">
              <a-input
                v-model:value="verificationForm.newPassword"
                type="password"
                placeholder="New Password"
                autocomplete="new-password"
              >
                <template #prefix>
                  <RiLock2Fill />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item class="txt-center">
              <button class="common-btn login-btn" type="submit" @click="onVerifyForgotPassword">Verify</button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <!-- <a-tab-pane key="emailPwd" tab="Retrieve password via email">
          <p>Please enter the account and the email address associated with your account for password recovery.</p>
          <a-form v-if="!isOtpSent" ref="formRef" :model="passwordForm" :rules="passwordRules">
            <a-form-item :disabled="!isLoading" name="loginName">
              <a-input v-model:value="passwordForm.loginName" placeholder="Login name">
                <template #prefix>
                  <RiUserFill />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="email" required name="email">
              <a-input v-model:value="passwordForm.email" placeholder="Email">
                <template #prefix>
                  <RiMailFill />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="captchaCode" required name="captchaCode">
              <a-input v-model:value="passwordForm.captchaCode" :maxlength="4" placeholder="Captcha">
                <template #prefix>
                  <RiShieldCheckFill />
                </template>
              </a-input>
              <div class="verification" @click="getCode()">
                <img :src="verificationImg" />
              </div>
            </a-form-item>

            <a-form-item class="txt-center">
              <button
                class="common-btn login-btn"
                type="submit"
                :disabled="isLoading"
                :style="isLoading ? 'opacity: .6' : ''"
                @click="onSubmitForgotPwd"
              >
                {{ isLoading ? "Submitting" : "Submit" }}
              </button>
            </a-form-item>
          </a-form>
          <a-form v-if="isOtpSent" ref="verifyFormRef" :model="verificationForm" :rules="verificationRules">
            <p style="color: #ffffff">An OTP has been sent to your email, please enter OTP and new password.</p>
            <a-form-item ref="code" required name="code">
              <a-input v-model:value="verificationForm.code" placeholder="Enter OTP">
                <template #prefix>
                  <RiQrCodeFill />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="newPassword" required name="newPassword">
              <a-input v-model:value="verificationForm.newPassword" type="password" placeholder="New Password">
                <template #prefix>
                  <RiLock2Fill />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item class="txt-center">
              <button class="common-btn login-btn" type="submit" @click="onVerifyForgotPassword">Verify</button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="emailAcc" tab="Retrieve account via email">
          <p>
            Please enter your registered email address. We will send your account name to your registered email address.
          </p>
          <a-form ref="formRef" :model="passwordForm" :rules="passwordRules">
            <a-form-item ref="email" required name="email">
              <a-input v-model:value="passwordForm.email" placeholder="Email">
                <template #prefix>
                  <RiMailFill />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item class="txt-center">
              <button
                class="common-btn login-btn"
                type="submit"
                :disabled="isLoading"
                :style="isLoading ? 'opacity: .6' : ''"
                @click="onSubmitForgotPwd"
              >
                {{ isLoading ? "Submitting" : "Submit" }}
              </button>
            </a-form-item>
          </a-form>
        </a-tab-pane> -->
      </a-tabs>
    </div>
    <div class="txt-center">
      Back to
      <router-link class="forget-pwd-tip" to="/login">Login</router-link>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { RiUserFill, RiLock2Fill, RiShieldCheckFill, RiMailFill, RiQrCodeFill, RiPhoneFill } from "vue-remix-icons";

import { message } from "ant-design-vue";
import "@/assets/css/login.scss";
import { getVerificationCode } from "@/api/index/login";
import { useRouter } from "vue-router";
import { sendForgetPasswordEmail, sendForgetPasswordPhone, verifyForgetPasswordEmail, verifyForgetPasswordPhone } from "@/api/index/forgotPwd";
export default defineComponent({
  components: {
    RiUserFill, RiLock2Fill, RiShieldCheckFill, RiMailFill, RiQrCodeFill, RiPhoneFill
  },
  setup() {
    const router = useRouter()
    const isOtpSent = ref(false)
    const isLoading = ref(false)
    const forgotActive = ref("phonePwd");

    const formRef = ref();
    const forgotPwdFormPhoneRef = ref()
    const forgotPwdPostVerifyFormPhoneRef = ref()

    const passwordForm = reactive({
      loginName: "",
      email: "",
      captchaCode: "",
      phone: "",
    });
    const verificationForm = reactive({
      email: "",
      phone: "",
      code: "",
      codeId: sessionStorage.getItem('codeId'),
      newPassword: ""
    });
    const passwordRules = {
      email: [
        {
          required: true,
          message: "Please enter your email address.",
          trigger: "blur",
        },
        {
          type: "email",
          message: "Email address is not valid",
          trigger: "blur",
        },
      ],
      loginName: [
        {
          required: true,
          message: "Please enter your login name.",
          trigger: "blur",
        },
      ],
      captchaCode: [
        {
          required: true,
          message: "Please enter the captcha code",
          trigger: "blur"
        },
        {
          min: 4,
          max: 4,
          message: "Length should be 4",
          trigger: "change"
        }
      ]
    };
    const phonePasswordRules = {
      phone: [
        {
          required: true,
          message: "Please enter your mobile number.",
          trigger: "blur",
        },
        {
          pattern: /^\d+$/,
          message: "mobile number is not valid",
          trigger: "blur",
        },
      ],
      loginName: [
        {
          required: true,
          message: "Please enter your login name.",
          trigger: "blur",
        },
      ],
      captchaCode: [
        {
          required: true,
          message: "Please enter the captcha code",
          trigger: "blur"
        },
        {
          min: 4,
          max: 4,
          message: "Length should be 4",
          trigger: "change"
        }
      ]
    };
    const verificationRules = {
      code: [
        {
          required: true,
          message: "Please enter OTP code",
          trigger: "blur",
        },
      ],
      captchaCode: [
        {
          required: true,
          message: "Please enter captcha code",
          trigger: "blur"
        },
        {
          min: 4,
          max: 4,
          message: "Length should be 4",
          trigger: "change"
        }
      ],
      newPassword: [
        {
          required: true,
          message: "Please enter new password",
          trigger: "blur",
        },
      ],
    };
    const verificationImg = ref("");
    onMounted(() => {
      getCode();
    });
    const getCode = () => {
      passwordForm.captchaCode = ''
      getVerificationCode().then((res) => {
        if (res.code === 0) {
          verificationImg.value = "data:image/png;base64," + res.data.img;
          passwordForm.codeId = res.data.id;
        }
      }).catch((e) => {
          console.log(e.message);
      });
    };
    const onSubmitForgotPwd = () => {
      forgotPwdFormPhoneRef.value
      .validate()
      .then(() => {
        const params = {
          phone: passwordForm.phone,
          loginName: passwordForm.loginName,
          captchaCode: passwordForm.captchaCode,
          codeId: passwordForm.codeId
        }

        isLoading.value = true
        sendForgetPasswordPhone(params).then(res => {
          if(res.code === 0) {
            isOtpSent.value = true
            sessionStorage.setItem('codeId', res.data.codeId)
          }
        })
        .catch(error => {
          console.log(error.message)
        })
        .finally(() => {
          isLoading.value = false
          getCode()
        })
      })
      .catch(error => {
        getCode()
        console.log("error", error)
      })
      // formRef.value
      //   .validate()
      //   .then(() => {
      //     isLoading.value = true
      //     sendForgetPasswordEmail(toRaw(passwordForm)).then((res) => {
      //       if (res.code === 0) {
      //         isOtpSent.value = true
      //         sessionStorage.setItem('codeId', res.data.codeId)
      //       }
      //     })
      //   .catch((error) => {
      //     isLoading.value = false
      //     getCode()
      //     console.log(error.message);
      //   });
      //   }).catch((error) => {
      //     console.log("error", error);
      //     getCode()
      //   });
    };
    const verifyFormRef = ref();
    const onVerifyForgotPassword = () => {
      forgotPwdPostVerifyFormPhoneRef.value
      .validate()
      .then(() => {
        verificationForm.codeId = sessionStorage.getItem('codeId')
        const params = {
          phone: passwordForm.phone,
          code: verificationForm.code,
          codeId: verificationForm.codeId,
          newPassword: verificationForm.newPassword
        }
        verifyForgetPasswordPhone(params).then(res => {
          if (res.code === 0) {
            message.success("Success");
            router.push("/login")
          }
        }).catch(error => {
          console.log("error", error);
          getCode()
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
      // verifyFormRef.value
      //   .validate()
      //   .then(() => {
      //     verificationForm.codeId = sessionStorage.getItem('codeId')
      //     verificationForm.email = passwordForm.email
      //     const params = {
      //       phone: verificationForm.phone,
      //       code: verificationForm.code,
      //       codeId: verificationForm.codeId,
      //       newPassword: verificationForm.newPassword
      //     }
      //     verifyForgetPasswordEmail(params).then((res) => {
      //       if (res.code === 0) {
      //         message.success("Success");
      //         router.push("/login")
      //       }
      //     }).catch((error) => {
      //     console.log(error.message);
      //       getCode()
      //     });
      //   })
      //   .catch((error) => {
      //       console.log("error", error);
      //       getCode()
      //   });
    };

    return {
      forgotActive,
      formRef,
      passwordRules,
      onSubmitForgotPwd,
      onVerifyForgotPassword,
      passwordForm,
      verificationForm,
      verificationRules,
      isOtpSent,
      verificationImg,
      getCode,
      verifyFormRef,
      isLoading,
      phonePasswordRules,
      forgotPwdFormPhoneRef,
      forgotPwdPostVerifyFormPhoneRef
    };
  },
});
</script>
<style scoped lang="scss">
.forget-pwd-tip {
  background-image: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
  background-size: 100%;
  background-repeat: repeat;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
  padding: 5px 0 20px;
  display: inline-block;
}
.verification {
  position: absolute;
  right: 20px;
  bottom: 8px;
}

.login-container {
  .login-form-wrapper {
    max-width: 800px;
    .game-title {
      max-width: 500px;
      margin: 0 auto;
    }
    :deep(.ant-tabs-bar) {
      display: none;
    }
    :deep(.ant-tabs-tabpane) {
      max-width: 500px;
      margin: 0 auto;
    }
    :deep(.ant-tabs-tab) {
      margin-right: 16px;
    }
  }
}

.dark-theme {
  .login-container {
    .login-form-wrapper {
      :deep(.ant-tabs-tab) {
        background: rgba(255, 255, 255, 0.0588235294);
        border: none;
      }
    }
  }
}

@media (max-width: 767px) {
  .login-container .login-form-wrapper .login-title-container .login-title::after {
    display: none;
  }
}
</style>
