<template>
  <el-form ref="registerRef" :rules="regRules" :model="regForm" label-width="80" size="large">
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/name-icon.png" />
      <el-form-item label="姓名" prop="realName">
        <el-input
          class="wTip"
          v-model="regForm.realName"
          placeholder="输入姓名"
          :rules="[
            { required: true, message: '姓名必须与提款银行卡账号姓名一致' },
            {
              pattern: /^[\u4e00-\u9fa5·]+$/,
              message: '请输入中文字符',
              trigger: 'change'
            }
          ]"
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/username-icon.svg" />
      <el-form-item label="用户名" prop="loginName">
        <el-input class="wTip" v-model="regForm.loginName" placeholder="4~11位包含字母和数字" clearable>
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/password-icon.svg" />
      <el-form-item label="密码" prop="password">
        <el-input
          class="wTip"
          v-model="regForm.password"
          placeholder="请输入6-12位密码"
          type="password"
          show-password
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/password-icon.svg" />
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input
          class="half wTip"
          v-model="regForm.confirmPwd"
          placeholder="请输入确认密码"
          type="password"
          show-password
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field" v-if="!hasReferSummon">
      <img class="form-field-icon" src="@/assets/home/auth/referral-icon.png" />
      <el-form-item label="推荐码" prop="codeAffiliate">
        <el-input
          v-if="!hasAffiliate"
          class="half"
          v-model="regForm.codeAffiliate"
          placeholder="如果没有 无需填写"
          clearable
        />
        <el-input
          v-else
          class="half"
          v-model="regForm.codeAffiliate"
          placeholder="如果没有 无需填写"
          readonly
          disabled
          clearable
        />
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/verification-icon.svg" />
      <el-form-item label="验证码" prop="captchaCode">
        <div style="display: flex; width: 100%">
          <el-input
            @keyup.enter="submitRegisterForm(registerRef)"
            v-model="regForm.captchaCode"
            label="验证码"
            placeholder="请输入验证码"
            clearable
          />
          <img style="width: 90px" :src="verificationImg" @click="getCode" />
        </div>
      </el-form-item>
    </div>
  </el-form>
  <!-- <div>
      <el-button class="blue-bg primary-btn" size="large" @click="resetRegForm(registerRef)">重新填写</el-button>
  </div> -->
  <div>
    <el-button class="blue-bg primary-btn" size="large" @click="submitRegisterForm(registerRef)">注册</el-button>
  </div>

  <div class="flex-div">
    <div style="visibility: hidden">
      <a @click="closeRegDialog">先去逛逛</a>
    </div>

    <div style="text-align: center" class="font-gray">
      已有账号？
      <a @click="openLoginDialog">去登录</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, defineEmits } from "vue";
import { userStore } from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import { lsGet } from "@/utils/utils";
import { getVerificationCode, register } from "@/api/index/login";
import { useNotify } from "@/hooks/notify";

const store = userStore();
const notify = useNotify();
const registerTelephoneKey = `registerTelephoneKey`;
let cachedTelephone = lsGet(registerTelephoneKey);
const router = useRouter();
const route = useRoute();
const hasAffiliate = ref(false);
const hasReferSummon = ref(false);

// Check session storage for summonCode or referCode
const checkReferSummonCode = () => {
  const summonCode = sessionStorage.getItem("SUMMON_CODE");
  const referCode = sessionStorage.getItem("REFERRAL_CODE");
  if (summonCode || referCode) {
    hasReferSummon.value = true;
  }
};

const resetRegForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

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

const checkName = (v) => {
  const alphanumeric = /^[\p{L}\p{N}]*$/u;
  return v.match(alphanumeric);
};
const checkName2 = (v) => {
  const alphaRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
  return v.match(alphaRegex);
};

const checkRealName = (v) => {
  // const alphanumeric = /^[\p{L}\p{N}]*$/u;
  const chineseCharOnly = /^[\u4e00-\u9fa5·]+$/;
  return v.match(chineseCharOnly);
};

let validateName = async (r, v) => {
  const namePattern = /^[a-zA-Z][a-zA-Z0-9]*$/; // Starts with a letter, allows letters & numbers
  const letterCount = (v.match(/[a-zA-Z]/g) || []).length >= 2; // At least 2 letters
  const hasNumber = /\d/.test(v); // At least 1 number

  if (!(namePattern.test(v) && letterCount && hasNumber)) {
    return Promise.reject("须以字母开头，并包含至少2个字母和1个数字");
  }

  return Promise.resolve();
};

let validatePhoneNumber = async (r, v) => {
  var reg = /^\d+$/;
  if (v === "") {
    return Promise.reject("请验证您的电话号码");
  } else if (!reg.test(v)) {
    return Promise.reject("电话号码只允许使用数字");
  } else {
    return Promise.resolve();
  }
};

let validateRealName = async (r, v) => {
  if (v === "") {
    return Promise.reject("请输入登姓名");
  } else if (!checkRealName(v)) {
    return Promise.reject("请输入中文字符");
  } else {
    return Promise.resolve();
  }
};

let validatePassStrength = (r, v) => {
  var strength = "";
  var pwd = v;
  var result = 0;
  for (var i = 0, len = pwd.length; i < len; ++i) {
    result |= charType(pwd.charCodeAt(i));
  }

  var level = 0;
  for (i = 0; i <= 4; i++) {
    if (result & 1) {
      level++;
    }
    result = result >>> 1;
  }

  if (pwd.length >= 6) {
  } else {
    return Promise.resolve();
  }
};

let validatePass2 = async (r, v) => {
  if (v === "") {
    return Promise.reject("请重新输入密码");
  } else if (v !== regForm.password) {
    return Promise.reject("密码不同");
  } else {
    return Promise.resolve();
  }
};

let validatePass = async (r, v) => {
  if (v === "") {
    return Promise.reject("请输入密码");
  } else {
    return validatePassStrength(r, v);
  }
};

const regRules = {
  realName: [
    {
      required: true,
      message: "请输入姓名",
      trigger: "blur"
    },
    {
      min: 2,
      max: 12,
      message: "长度应为 2 至 12",
      trigger: "blur"
    },
    {
      validator: validateRealName,
      trigger: "change"
    }
  ],
  loginName: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur"
    },
    {
      min: 4,
      max: 11,
      message: "长度应为 4 至 11",
      trigger: "blur"
    },
    {
      validator: validateName,
      trigger: "change"
    }
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur"
    },
    {
      min: 6,
      max: 12,
      message: "长度应为 6 至 12",
      trigger: "blur"
    },
    {
      validator: validatePass,
      trigger: "change"
    }
  ],
  confirmPwd: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur"
    },
    {
      min: 6,
      max: 12,
      message: "长度应为 6 至 12",
      trigger: "blur"
    },
    {
      validator: validatePass2,
      trigger: "change"
    }
  ],
  telephone: [
    {
      validator: validatePhoneNumber,
      trigger: "change"
    }
  ],
  smsCode: [
    {
      required: true,
      message: "请输入手机验证码",
      trigger: "blur"
    },
    {
      min: 6,
      max: 6,
      message: "长度应为 6",
      trigger: "blur"
    }
  ],
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
      message: "长度应为 4",
      trigger: "change"
    }
  ]
};

const getCode = () => {
  regForm.captchaCode = "";
  getVerificationCode().then((res) => {
    if (res.code === 0) {
      verificationImg.value = "data:image/png;base64," + res.data.img;
      regForm.codeId = res.data.id;
    } else {
      notify({
        type: "error",
        message: res.message
      });
    }
  });
};

const getAffiliateCode = () => {
  const affCode = sessionStorage.getItem("AFFILIATE_CODE");
  if (affCode) {
    hasAffiliate.value = true;
    regForm.codeAffiliate = affCode;
  }
};

const getReferalCode = () => {
  const referCode = sessionStorage.getItem("REFERRAL_CODE");
  // && route.query && route.query.refer
  if (referCode) {
    regForm.referrer = referCode;
  }
};

const verificationImg = ref("");

const submitRegisterForm = async (elForm) => {
  if (!elForm) return;
  await elForm
    .validate((valid) => {
      if (valid) {
        (async () => {
          const sidParam = store.visitorId;
          regForm.sid = sidParam;
          register(regForm)
            .then((response) => {
              const regResult = response.code;
              if (regResult === 0) {
                notify({
                  type: "success",
                  message: "注册成功"
                });
                store.autoLogin(response.data);
                emits("close-dialog");
                router.push("/");

                sessionStorage.removeItem("REFERRAL_CODE");
                sessionStorage.removeItem("AFFILIATE_CODE");

                if (store.token) {
                  router.push("/");
                }

                store.regSuccessGuideVisible = true;
              } else {
                notify({
                  type: "error",
                  message: response.message
                });
                getCode();
              }
            })
            .catch((err) => {
              console.log(err.message);
              getCode();
            });
        })();
      } else {
        getCode();
      }
    })
    .catch((errr) => {
      console.log(errr);
    });
};

const regForm = reactive({
  realName: "",
  loginName: "",
  password: "",
  confirmPwd: "",
  telephone: cachedTelephone ?? "",
  email: "",
  captchaCode: "",
  regHost: location.hostname,
  codeId: "",
  codeAffiliate: "",
  smsCode: "",
  smsCodeId: ""
});

const registerRef = ref([]);

const emits = defineEmits(["close-dialog, open-login-dialog"]);

const closeRegDialog = () => {
  emits("close-dialog");
};

const openLoginDialog = () => {
  if (route.path === "/register") {
    router.push("/login");
  } else {
    emits("open-login-dialog");
  }
};

onMounted(() => {
  getCode();
  getAffiliateCode();
  getReferalCode();
  checkReferSummonCode();
});
</script>

<style scoped lang="scss" src="@/scss/pages/accountDialog.scss" />

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
