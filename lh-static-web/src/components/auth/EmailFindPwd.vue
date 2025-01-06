<template>
  <el-form ref="forgotPwdFormRef" :rules="loginRules" :model="forgotPwdForm" label-width="90" size="large">
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/username-icon.png" />
      <el-form-item label="注册邮箱" prop="email">
        <el-input v-model="forgotPwdForm.email" placeholder="输入注册邮箱" />
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/verification-icon.png" />
      <el-form-item label="验证码" prop="captchaCode">
        <div style="display: flex; width: 100%">
          <el-input
            v-model="forgotPwdForm.captchaCode"
            label="验证码"
            placeholder="验证码"
            @keyup.enter="submitForm"
          ></el-input>
          <img style="width: 90px" :src="verificationImg" @click="getCode" />
        </div>
      </el-form-item>
    </div>

    <el-button :loading="loadingBtn" size="large" class="blue-bg primary-btn" @click="submitForm">提交</el-button>
  </el-form>

  <div style="text-align: center; margin-top: 20px"><a @click="openLoginDialog">返回登入页面</a></div>
</template>

<script setup>
import { ref, onMounted, reactive, defineEmits } from "vue";
import { getVerificationCode } from "@/api/index/login";
import { findAccount } from "@/api/index/forgotPwd";
import { useNotify } from "@/hooks/notify";

const emits = defineEmits(["open-login-dialog, close-dialog"]);

const notify = useNotify();

const openLoginDialog = () => {
  emits("open-login-dialog");
};

const loginRules = {
  email: [
    {
      required: true,
      message: "请输入您的邮箱",
      trigger: "blur"
    },
    {
      type: "email",
      message: "电子邮件地址无效",
      trigger: "blur"
    },
    {
      max: 50,
      message: "长度应小于 50",
      trigger: "blur"
    }
  ],
  captchaCode: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "blur"
    },
    {
      min: 4,
      max: 4,
      message: "长度为 4",
      trigger: "blur"
    }
  ]
};

const forgotPwdForm = reactive({
  email: "",
  captchaCode: ""
});

const forgotPwdFormRef = ref([]);
const loadingBtn = ref(false);

const submitForm = () => {
  loadingBtn.value = true;

  forgotPwdFormRef.value
    .validate()
    .then(() => {
      findAccount(forgotPwdForm).then((res) => {
        if (res.code === 0) {
          notify({
            type: 'success',
            message: "您的帐号已经发送到注册邮箱"
          })
          emits("close-dialog");
        } else {
          notify({
            type: "error",
            message: res.message
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      getCode();
    })
    .finally(() => {
      loadingBtn.value = false;
    });
};

const getCode = () => {
  forgotPwdForm.captchaCode = "";

  getVerificationCode().then((res) => {
    if (res.code === 0) {
      verificationImg.value = "data:image/png;base64," + res.data.img;
      forgotPwdForm.codeId = res.data.id;
    } else {
      notify({
        type: "error",
        message: res.message
      });
    }
  });
};
const verificationImg = ref("");

onMounted(() => {
  getCode();
});
</script>

<style scoped lang="scss" src="@/scss/pages/accountDialog.scss"/>

<style lang="scss">
.form-field {
  margin: 15px 0px;

  .el-form-item {
    margin-bottom: 0px;
  }

  .el-form-item__label {
    justify-content: flex-start;
  }

  .el-input__wrapper {
    box-shadow: none;
    background: none;
  }

  .el-form-item.is-error {
    margin-bottom: 15px;
  }
}
</style>

<style scoped lang="scss">
.dark {
  .blue-bg {
    background-image: none !important;
    background: url("../../assets/images/home/standard-button-bg.svg") no-repeat center center !important;
    background-size: cover !important;
    box-shadow: none;
    border-radius: 6px;
    border: 1px solid #3A93CE;
  }
}
</style>