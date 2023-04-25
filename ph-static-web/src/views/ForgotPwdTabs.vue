<template>
  <div class="login-container">
    <div class="margin-center login-form-wrapper">
      <div class="game-title">
        <span class="menu-title">ลืมผู้ใช้งาน &amp; รหัสผ่าน</span>
      </div>
      <a-tabs v-model:activeKey="forgotActive">
        <a-tab-pane key="phonePwd" tab="รีเซ็ตรหัสผ่านด้วยเบอร์โทรศัพท์">
          <a-form ref="formRef" :model="loginForm" :rules="rules">
            <a-form-item ref="loginName" required name="loginName">
              <a-input
                v-model:value="loginForm.loginName"
                placeholder="ชื่อล็อกอิน"
              >
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="phoneNumber" required name="phoneNumber">
              <a-input
                v-model:value="loginForm.phoneNumber"
                placeholder="เบอร์โทรศัพท์"
              >
                <template #prefix>
                  <MobileOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="validCode" required name="validCode">
              <a-input
                v-model:value="loginForm.validCode"
                :maxlength="4"
                placeholder="รหัสยืนยัน"
              >
                <template #prefix>
                  <SafetyCertificateOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="password" required name="password">
              <a-input
                type="password"
                v-model:value="loginForm.password"
                placeholder="รหัสผ่าน"
              >
                <template #prefix>
                  <LockOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="confirmPwd" required name="confirmPwd">
              <a-input
                type="password"
                v-model:value="loginForm.confirmPwd"
                placeholder="ยืนยันรหัสผ่าน"
              >
                <template #prefix>
                  <LockOutlined />
                </template>
              </a-input>
            </a-form-item>
            <button
              class="txt-center login-btn common-btn"
              type="submit"
              @click="onSubmit"
            >
              ส่ง
            </button>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="emailPwd" tab="รีเซ็ตรหัสผ่านด้วยอีเมลล์"
          ><a-form
            ref="formRefPwd"
            :model="passwordForm"
            :rules="passwordRules"
          >
            <a-form-item ref="loginName" required name="loginName">
              <a-input
                v-model:value="passwordForm.loginName"
                placeholder="ชื่อล็อกอิน"
              >
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="email" required name="email">
              <a-input v-model:value="passwordForm.email" placeholder="อีเมลล์">
                <template #prefix>
                  <MailOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="validCode" required name="validCode">
              <a-input
                v-model:value="passwordForm.validCode"
                maxlength="4"
                placeholder="รหัสยืนยัน"
              >
                <template #prefix>
                  <SafetyCertificateOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="password" required name="password">
              <a-input
                type="password"
                v-model:value="passwordForm.password"
                placeholder="รหัสผ่าน"
              >
                <template #prefix>
                  <LockOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="confirmPwd" required name="confirmPwd">
              <a-input
                @pressEnter="onSubmitChangePwd('emailReset')"
                type="password"
                v-model:value="passwordForm.confirmPwd"
                placeholder="ยืนยันรหัสผ่าน"
              >
                <template #prefix>
                  <LockOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item class="txt-center">
              <button
                class="common-btn login-btn"
                type="submit"
                @click="onSubmitChangePwd('emailReset')"
              >
                ส่ง
              </button>
            </a-form-item>
          </a-form></a-tab-pane
        >
        <a-tab-pane key="emailAccount" tab="รับบัญชีทางอีเมลล์"
          ><a-form
            ref="formRefPwd"
            :model="passwordForm"
            :rules="passwordRules"
          >
            <a-form-item ref="email" required name="email">
              <a-input v-model:value="passwordForm.email" placeholder="อีเมลล์">
                <template #prefix>
                  <MailOutlined />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item class="txt-center">
              <button
                class="common-btn login-btn"
                type="submit"
                @click="onSubmitChangePwd('retrieveAcc')"
              >
                ส่ง
              </button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="txt-center">
      <router-link class="forget-pwd-tip" to="/login"
        >กลับสู่เข้าสู่ระบบ
      </router-link>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, toRaw } from "vue";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  MobileOutlined,
  MailOutlined,
} from "@ant-design/icons-vue";
import "@/assets/css/login.scss";
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    SafetyCertificateOutlined,
    MobileOutlined,
    MailOutlined,
  },
  setup() {
    const forgotActive = ref("phonePwd");
    const formRef = ref();
    const passwordForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      validCode: "",
      phoneNumber: "",
    });
    const loginForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      validCode: "",
      phoneNumber: "",
    });
    const rules = {
      loginName: [
        {
          required: true,
          message: "Please enter your login name",
          trigger: "blur",
        },
        {
          min: 6,
          max: 12,
          message: "Login name should have 6-12 characters",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: "Please enter password",
          trigger: "blur",
        },
      ],
      confirmPwd: [
        {
          required: true,
          message: "Please enter confirm password",
          trigger: "blur",
        },
      ],
      phoneNumber: [
        {
          required: true,
          message: "Please enter your phone number",
          trigger: "blur",
        },
      ],
      validCode: [
        {
          required: true,
          message: "Please enter the captcha code",
          trigger: "blur",
        },
        {
          min: 4,
          max: 4,
          message: "Length should be 4",
          trigger: "change",
        },
      ],
    };

    const passwordRules = {
      loginName: [
        {
          required: true,
          message: "Please enter your login name",
          trigger: "blur",
        },
        {
          min: 6,
          max: 12,
          message: "Login name should have 6-12 characters",
          trigger: "blur",
        },
      ],
      email: [
        {
          required: true,
          message: "Please enter your email address",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: "Please enter the password",
          trigger: "blur",
        },
      ],
      confirmPwd: [
        {
          required: true,
          message: "Please enter the confirm password",
          trigger: "blur",
        },
      ],
      phoneNumber: [
        {
          required: true,
          message: "Please enter your phone number",
          trigger: "blur",
        },
      ],
      validCode: [
        {
          required: true,
          message: "Please enter the captcha code",
          trigger: "blur",
        },
        {
          min: 4,
          max: 4,
          message: "Length should be 4",
          trigger: "change",
        },
      ],
    };
    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          // API required
          console.log("values", loginForm, toRaw(loginForm));
        })
        .catch((error) => {
          console.log("error", error);
        });
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };
    return {
      forgotActive,
      formRef,
      loginForm,
      rules,
      passwordRules,
      onSubmit,
      resetForm,
      passwordForm
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

@media (max-width: 768px) {
  .login-container
    .login-form-wrapper
    .login-title-container
    .login-title::after {
    display: none;
  }
}
</style>
