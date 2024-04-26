<template>
  <el-form ref="forgotPwdFormRef" :rules="loginRules" :model="forgotPwdForm" label-width="200" size="large">
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/username-icon.png" />
      <el-form-item :label="$t('login.email')" prop="email">
        <el-input v-model="forgotPwdForm.email" :placeholder="$t('placeholder.email')" />
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/verification-icon.png" />
      <el-form-item :label="$t('login.captcha')" prop="captchaCode">
        <div style="display: flex; width: 100%">
          <el-input
            v-model="forgotPwdForm.captchaCode"
            :placeholder="$t('login.captcha')"
            @keyup.enter="submitForm"
          ></el-input>
          <img style="width: 90px" :src="verificationImg" @click="getCode" />
        </div>
      </el-form-item>
    </div>

    <el-button :loading="loadingBtn" size="large" class="blue-bg primary-btn" @click="submitForm">{{ $t('common.submit') }}</el-button>
  </el-form>

  <div style="text-align: center; margin-top: 20px"><a @click="openLoginDialog">{{ $t('login.backtoLogin') }}</a></div>
</template>

<script setup>
import { ref, onMounted, reactive, defineEmits } from "vue";
import { getVerificationCode } from "@/api/index/login";
import { findAccount } from "@/api/index/forgotPwd";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

const emits = defineEmits(["open-login-dialog, close-dialog"]);
const { t } = useI18n()
const openLoginDialog = () => {
  emits("open-login-dialog");
};

const loginRules = {
  email: [
    {
      required: true,
      message: t('placeholder.email'),
      trigger: "blur"
    },
    {
      type: "email",
      message: t('placeholder.emailFormat'),
      trigger: "blur"
    },
    {
      max: 50,
      message: t('placeholder.lessthan50'),
      trigger: "blur"
    }
  ],
  captchaCode: [
    {
      required: true,
      message: t('placeholder.captchareq'),
      trigger: "blur"
    },
    {
      min: 4,
      max: 4,
      message: t('placeholder.captcha'),
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
          ElMessage.success(t('account.you_account_has_been_sent_email'));
          emits("close-dialog")
        } else {
          ElMessage.error({
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
      ElMessage.error({
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

<style scoped lang="scss">
.light-bg {
  font-size: 14px;
  background-color: #f7f8fb;
  border-radius: 15px;
  box-shadow: 0px 0px 8px 0px #a9c9ea inset;
  //margin-bottom: 30px;
}

.form-field {
  display: grid;
  grid-template-columns: 40px 1fr;
  padding: 8px 15px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: relative;
  width: 100%;
  margin-top: 40px;

  .form-field-icon {
    margin: auto;
    height: 30px;
  }
}

.blue-bg {
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
  color: #fff;
  font-size: 14px;
  border-radius: 30px;
}

.primary-btn {
  margin-top: 20px;
  width: 100%;
}
</style>

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
