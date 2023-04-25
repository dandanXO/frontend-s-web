<template>
  <div class="login-container">
    <div class="margin-center login-form-wrapper">
      <div class="game-title">
        <span class="menu-title">LOGIN</span>
      </div>
      <a-form ref="formRef" :model="loginForm" :rules="rules">
        <a-form-item ref="loginName" required name="loginName">
          <a-input v-model:value="loginForm.loginName" placeholder="Login name">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item ref="password" required name="password">
          <a-input
            type="password"
            v-model:value="loginForm.password"
            placeholder="Password"
            @keypress.enter="onSubmit"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item ref="captchaCode" required name="captchaCode">
          <a-input
            v-model:value="loginForm.captchaCode"
            :maxlength="4"
            placeholder="Verification Code"
            @keypress.enter="onSubmit"
          >
            <template #prefix>
              <SafetyCertificateOutlined />
            </template>
          </a-input>
          <div class="verification" @click="getCode()">
            <img :src="verificationImg" />
          </div>
        </a-form-item>
        <div class="bottomrow">
          <div class="txt-left">
            <router-link class="pwd-tip" to="/forgot-password">
              Forgot password ?
            </router-link>
          </div>
          <a-button class="common-btn" :loading="loadingLogin" @click="onSubmit"
            >Login Now</a-button
          >

          <!-- <button class="common-btn">
            
          </button> -->
        </div>
      </a-form>
      <div class="txt-center">
        <router-link class="forget-pwd-tip" to="/register">
          Not on Jolly88 yet? Register Now
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "@/store/index";
import { getVerificationCode } from "@/api/index/login";
// import { message } from "ant-design-vue";
import { LockOutlined, SafetyCertificateOutlined, UserOutlined } from "@ant-design/icons-vue";
import "@/assets/css/login.scss";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    SafetyCertificateOutlined
  },
  setup() {
    const store = userStore();
    const router = useRouter();
    const route = useRoute();
    const formRef = ref();
    const loginForm = reactive({
      loginName: "",
      password: "",
      captchaCode: "",
      codeId: ""
    });
    const verificationImg = ref("");
    onMounted(() => {
      getCode();
    });
    const getCode = () => {
      loginForm.captchaCode = ''
      getVerificationCode().then((res) => {
        if (res.code === 0) {
          verificationImg.value = "data:image/png;base64," + res.data.img;
          loginForm.codeId = res.data.id;
        }
      }).catch((e) => {
        console.log(e.message);
      });
    };
    const rules = {
      loginName: [
        {
          required: true,
          message: "User name is required",
          trigger: "blur"
        },
        {
          min: 6,
          max: 12,
          message: "Length should be 6 to 12",
          trigger: "blur"
        }
      ],
      password: [
        {
          required: true,
          message: "Password is required",
          trigger: "blur"
        }
      ],
      captchaCode: [
        {
          required: true,
          message: "Verification code is required",
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
    const loadingLogin = ref(false)
    const onSubmit = () => {
      const fpPromise = FingerprintJS.load();
      (async () => {
        const fp = await fpPromise;
        const result = await fp.get();
        const excludes = { value: ["timezone", "timeZoneOffset"] };
        const allComponents = { ...result.components };
        excludes.value.forEach((element) => {
          delete allComponents[element];
        });
        const sidParam = FingerprintJS.hashComponents(allComponents);

        formRef.value.validate().then(() => {
          loadingLogin.value = true
          store.memberLogin({
            loginName: loginForm.loginName,
            password: loginForm.password,
            sid: sidParam,
            captchaCode: loginForm.captchaCode,
            codeId: loginForm.codeId
          }).then(() => {
            const jumpUrl = route.query.redirect ? route.query.redirect.toString() : "/home";
          router.push(jumpUrl);
          loadingLogin.value = false
          }).catch((error) => {
            console.log(error.message);
            loadingLogin.value = false
            getCode();
          });
        });
      })();
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };
    return {
      formRef,
      loginForm,
      rules,
      onSubmit,
      resetForm,
      verificationImg,
      getCode,
      loadingLogin
    };
  }
});
</script>
<style scoped lang="scss">
.login-btn {
  color: #ffffff;
  background-image: linear-gradient(to right, #de4545, #db7e42);
  border: 0;
  margin: 0;
}
.verification {
  position: absolute;
  right: 20px;
  bottom: 5px;
}
.bottomrow {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pwd-tip {
  color: #db7e42;
}
</style>
