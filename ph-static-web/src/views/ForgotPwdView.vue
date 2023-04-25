<template>
  <div class="login-container">
    <div class="margin-center login-form-wrapper">
      <div class="game-title">
        <span class="menu-title">FORGOT ACCOUNT &amp; PASSWORD</span>
      </div>
      <h2 style="color: #ffffff">Retrieve account using email</h2>
      <a-form
        v-if="!isEmailSent"
        ref="formRef"
        :model="passwordForm"
        :rules="passwordRules"
      >
        <a-form-item :disabled="!isEmailSending" name="loginName">
          <a-input
            v-model:value="passwordForm.loginName"
            placeholder="Login name"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item ref="email" required name="email">
          <a-input v-model:value="passwordForm.email" placeholder="Email">
            <template #prefix>
              <MailOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item ref="captchaCode" required name="captchaCode">
          <a-input
            v-model:value="passwordForm.captchaCode"
            :maxlength="4"
            placeholder="Captcha"
          >
            <template #prefix>
              <SafetyCertificateOutlined />
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
            @click="onSubmitForgotPwd"
            :disabled="isEmailSending"
            :style="isEmailSending ? 'opacity: .6' : ''"
          >
            {{ isEmailSending ? "Submitting" : "Submit" }}
          </button>
        </a-form-item>
      </a-form>
      <a-form
        v-if="isEmailSent"
        ref="verifyFormRef"
        :model="verificationForm"
        :rules="verificationRules"
      >
        <p style="color: #ffffff">
          An OTP has been sent to your email, please enter OTP and new password.
        </p>
        <a-form-item ref="code" required name="code">
          <a-input
            v-model:value="verificationForm.code"
            placeholder="Enter OTP"
          >
            <template #prefix>
              <QrcodeOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item ref="newPassword" required name="newPassword">
          <a-input
            type="password"
            v-model:value="verificationForm.newPassword"
            placeholder="New Password"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item ref="captchaCode" required name="captchaCode">
          <a-input
            v-model:value="verificationForm.captchaCode"
            :maxlength="4"
            placeholder="Captcha code"
          >
            <template #prefix>
              <SafetyCertificateOutlined />
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
            @click="onVerifyForgotPassword"
          >
            ส่ง
          </button>
        </a-form-item>
      </a-form>
    </div>
    <div class="txt-center">
      <router-link class="forget-pwd-tip" to="/login"
        >Back to Login
      </router-link>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, reactive, ref, toRaw } from "vue";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  MailOutlined,
  QrcodeOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import "@/assets/css/login.scss";
import { getVerificationCode } from "@/api/index/login";
import { useRouter } from "vue-router";
import { sendForgetPasswordEmail, verifyForgetPasswordEmail } from "@/api/index/login";
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    SafetyCertificateOutlined,
    MailOutlined,
    QrcodeOutlined,
  },
  setup() {
    const router = useRouter()
    const isEmailSent = ref(false)
    const isEmailSending = ref(false)
    const forgotActive = ref("phonePwd");
    const formRef = ref();
    const passwordForm = reactive({
      email: "",
      captchaCode: ""
    });
    const verificationForm = reactive({
      email: "",
      code: "",
      codeId: sessionStorage.getItem('emailCodeId'),
      newPassword: "",
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
      formRef.value
        .validate()
        .then(() => {
          isEmailSending.value = true
          sendForgetPasswordEmail(toRaw(passwordForm)).then((res) => {
            if (res.code === 0) {
              isEmailSent.value = true
              sessionStorage.setItem('emailCodeId', res.data.codeId)
            }
          })
        .catch((error) => {
          isEmailSending.value = false
          getCode()
          console.log(error.message);
        });
        }).catch((error) => {
          console.log("error", error);
          getCode()
        });
    };
    const verifyFormRef = ref();
    const onVerifyForgotPassword = () => {
      verifyFormRef.value
        .validate()
        .then(() => {
          verificationForm.codeId = sessionStorage.getItem('emailCodeId')
          verificationForm.email = passwordForm.email
          verifyForgetPasswordEmail(toRaw(verificationForm)).then((res) => {
            if (res.code === 0) {
              message.success("Success");
              router.push("/login")
            }
          }).catch((error) => {
          console.log(error.message);
            getCode()
          });
        })
        .catch((error) => {
            console.log("error", error);
            getCode()
        });
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
      isEmailSent,
      verificationImg,
      getCode,
      verifyFormRef,
      isEmailSending
    };
  },
});
</script>
<style scoped lang="scss">
.forget-pwd-tip {
  color: #db7842;
  padding: 10px 0;
  display: inline-block;
}

.verification {
  position: absolute;
  right: 20px;
  bottom: 5px;
}

@media (max-width: 768px) {
  .login-container
    .login-form-wrapper
    .login-title-container
    .login-title::after {
    display: none;
  }
}
</style>
