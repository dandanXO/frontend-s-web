<template>
  <el-form ref="registerRef" :rules="regRules" :model="regForm" label-width="200" size="large">
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/username-icon.png" />
      <el-form-item :label="$t('login.username')" prop="loginName">
        <el-input class="wTip" v-model="regForm.loginName" :placeholder="$t('login.username')" clearable>
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/password-icon.png" />
      <el-form-item :label="$t('login.password')" prop="password">
        <el-input
          class="wTip"
          v-model="regForm.password"
          :placeholder="$t('login.password')"
          type="password"
          show-password
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>
<!-- 
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/password-icon.png" />
      <el-form-item :label="$t('login.confirmPwd')" prop="confirmPwd">
        <el-input
          class="half wTip"
          v-model="regForm.confirmPwd"
          :placeholder="$t('login.confirmPwd')"
          type="password"
          show-password
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div> -->
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/username-icon.png" />
      <el-form-item :label="$t('login.realName')" prop="realName">
        <el-input
          class="wTip"
          v-model="regForm.realName"
          :placeholder="$t('login.realName')"
          :rules="[{ required: true, message: t('placeholder.realName') }]"
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>
    <!-- <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/email-icon.png" />
      <el-form-item :label="$t('login.email')" prop="email">
        <el-input
          class="wTip"
          v-model="regForm.email"
          :placeholder="$t('login.email')"
          :rules="[{ required: true, message: t('placeholder.email') }]"
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div> -->
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/phone-icon.png" />
      <el-form-item :label="$t('login.mobileNo')" prop="telephone">
        <el-input
          class="wTip"
          v-model="regForm.telephone"
          :placeholder="$t('login.mobileNo')"
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/referral-icon.png" />
      <el-form-item :label="t('login.codeAffiliate')" prop="codeAffiliate">
        <el-input
          v-if="!hasAffiliate"
          class="half"
          v-model="regForm.codeAffiliate"
          :placeholder="t('login.codeAffiliate')"
          clearable
        />
        <el-input
          v-else
          class="half"
          v-model="regForm.codeAffiliate"
          :placeholder="t('login.codeAffiliate')"
          readonly
          disabled
          clearable
        />
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/verification-icon.png" />
      <el-form-item :label="$t('login.captcha')" prop="captchaCode">
        <div style="display: flex; width: 100%">
          <el-input
            @keyup.enter="submitRegisterForm(registerRef)"
            v-model="regForm.captchaCode"
            :placeholder="$t('login.captcha')"
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
    <button class="primary-btn login-btn" size="large" @click="submitRegisterForm(registerRef)">
      {{ $t("login.register") }}
    </button>
  </div>

  <div style="width: 100%; margin-top: 5px">
    <!-- <div style="visibility:hidden">
      <a @click="closeRegDialog">先去逛逛</a>
    </div> -->

    <!--    <div style="text-align: center" class="font-gray">-->
    <!--      {{ $t('login.alreadyAccount') }}?-->
    <!--      <a @click="openLoginDialog">{{ $t('login.login') }}</a>-->
    <!--    </div>-->
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, defineEmits } from "vue";
import { userStore } from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import { lsGet } from "@/utils/utils";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { ElMessage } from "element-plus";
import { getVerificationCode, register } from "@/api/index/login";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = userStore();
const registerTelephoneKey = `registerTelephoneKey`;
let cachedTelephone = lsGet(registerTelephoneKey);
const router = useRouter();
const route = useRoute();
const hasAffiliate = ref(false);

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

const checkRealName = (v) => {
  // const alphanumeric = /^[\p{L}\p{N}]*$/u;
  const chineseCharOnly = /^([\u4e00-\u9fa5]*)$/u;
  return v.match(chineseCharOnly);
};

let validateName = async (r, v) => {
  if (v === "") {
    return Promise.reject(t("placeholder.username"));
  } else {
    return Promise.resolve();
  }
};
let validatePhoneNumber = async (r, v) => {
  if (v === "") {
    return Promise.reject(t("placeholder.verifyPhone"));
  } else if (!/^\d+$/.test(v)) {
    return Promise.reject(t("placeholder.onlyNumber"));
  } else if (v.length !== 10) {
    return Promise.reject(t("placeholder.invalidPhoneLength"));
  } else if (v.charAt(0) !== '0') {
    return Promise.reject(t("placeholder.invalidPhoneStartsWith0"));
  } else {
    return Promise.resolve();
  }
};
let validateRealName = async (r, v) => {
  if (v === "") {
    return Promise.reject(t("placeholder.realName"));
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
    return Promise.reject(t("placeholder.confirmPwd"));
  } else if (v !== regForm.password) {
    return Promise.reject(t("placeholder.noMatch"));
  } else {
    return Promise.resolve();
  }
};

let validatePass = async (r, v) => {
  if (v === "") {
    return Promise.reject(t("placeholder.password"));
  } else {
    return validatePassStrength(r, v);
  }
};

const regRules = {
  realName: [
    // {
    //   required: false,
    //   min: 2,
    //   max: 12,
    //   message: "长度应为 2 至 12",
    //   trigger: "blur"
    // },
    {
      required: true,
      trigger: "change",
      message: t("placeholder.realName")
    },
    {
      validator: validateRealName,
      trigger: "change"
    }
  ],
  loginName: [
    {
      min: 6,
      max: 11,
      message: t("placeholder.between612"),
      trigger: "blur"
    },
    {
      required: true,
      validator: validateName,
      trigger: "change"
    }
  ],
  password: [
    {
      min: 6,
      max: 11,
      message: t("placeholder.between612"),
      trigger: "blur"
    },
    {
      required: true,
      validator: validatePass,
      trigger: "change"
    }
  ],
  confirmPwd: [
    {
      min: 6,
      max: 11,
      message: t("placeholder.between612"),
      trigger: "blur"
    },
    {
      required: true,
      validator: validatePass2,
      trigger: "change"
    }
  ],
  telephone: [
    {
      required: true,
      validator: validatePhoneNumber,
      trigger: "change"
    }
  ],
  smsCode: [
    {
      required: true,
      message: t("placeholder.phoneVerification"),
      trigger: "blur"
    },
    {
      min: 6,
      max: 6,
      message: t("placeholder.min6"),
      trigger: "blur"
    }
  ],
  email: [
    {
      type: "email",
      message: t("placeholder.emailFormat"),
      trigger: "blur"
    },
    {
      max: 50,
      message: t("placeholder.lessthan50"),
      trigger: "blur"
    }
  ],
  captchaCode: [
    {
      required: true,
      message: t("placeholder.captchareq"),
      trigger: "blur"
    },
    {
      min: 4,
      max: 4,
      message: t("placeholder.captcha"),
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
      ElMessage.error({
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

  if (referCode && route.query && route.query.refer) {
    regForm.referrer = referCode;
  }
};

const verificationImg = ref("");

const welcomeHome = ref(false);

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
                ElMessage({
                  type: "success",
                  message: t("login.registerSuccess")
                });

                // FB tracking :: signup-success
                if (store.isAffiliateA) {
                  fbq("track", "signup-success");
                }
                if (window.location.href.indexOf("5svn88.com") > -1 || window.location.href.indexOf("tfpromo88.com") > -1 || window.location.href.indexOf("tf88bof.com") > -1) {
                  otag("event", "registration");
                }

                store.autoLogin(response.data);
                emits("close-dialog");
                emits("open-welcome-dialog")

                sessionStorage.removeItem("REFERRAL_CODE");
                sessionStorage.removeItem("AFFILIATE_CODE");

                if (store.token) {
                  router.push("/");
                  sessionStorage.setItem("IS_GET_WELCOME", "1");
                }
              } else {
                ElMessage.error(response.message);
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
  emits("open-login-dialog");
};

onMounted(() => {
  getCode();
  getAffiliateCode();
  getReferalCode();
});
</script>

<style scoped lang="scss">
.light-bg {
  font-size: 14px;
  background-color: #f7f8fb;
  border-radius: 15px;
  box-shadow: 0px 0px 8px 0px #a9c9ea inset;
  margin-bottom: 30px;
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

  margin: 15px 0px;
  margin-top: 50px !important;
  padding: 5px;

  position: relative;
  width: 100%;
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
  border-radius: 8px;
}

.primary-btn {
  margin-top: 20px;
  width: 100%;
}

.login-btn {
  color: #fff;
  font-size: 14px;
  border-radius: 8px;
  background: url(../../assets/images/common/loginbtn.png) no-repeat center center;
  background-size: cover;
  padding: 10px 0;
}
.flex-div {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

<style lang="scss">
.form-field {
  .el-form-item {
    margin-bottom: 0px;
  }

  .el-form-item__label {
    justify-content: flex-start;
    position: absolute;
    top: -40px;
    left: 0;
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
