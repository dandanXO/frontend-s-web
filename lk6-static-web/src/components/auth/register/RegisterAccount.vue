<template>
  <el-form ref="registerRef" :rules="regRules" :model="regForm" :label-width="languageVal === 'en' ? 130 : 80" size="large" style="padding-top:16px;">
    <!-- <div class="light-bg form-field">
      <img class="form-field-icon" src="../../../assets/home/auth/username-icon.png" width="35px" />
      <el-form-item :label="$t('form.realName')" prop="realName">
        <el-input
          class="wTip"
          v-model="regForm.realName"
          :placeholder="$t('form.pleaseEnterField', {field: $t('form.realName')})"
          :rules="[
            { required: true, message: $t('form.realNameRule01') },
            {
              pattern: /^[\u4e00-\u9fa5·]+$/,
              message: $t('form.realNameRule02'),
              trigger: 'change'
            }
          ]"
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div> -->

    <div class="light-bg form-field">
      <img class="form-field-icon" src="../../../assets/home/auth/username-icon.png" width="35px" />
      <el-form-item :label="$t('form.username')" prop="loginName">
        <el-input class="wTip" v-model="regForm.loginName" :placeholder="$t('form.usernameRule01', {min: 4, max: 11})" clearable>
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="../../../assets/home/auth/password-icon.png" width="35px" />
      <el-form-item :label="$t('form.password')" prop="password">
        <el-input
          class="wTip"
          v-model="regForm.password"
          :placeholder="$t('form.passwordRule01', {min: 6, max: 12})"
          type="password"
          show-password
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="../../../assets/home/auth/password-icon.png" width="35px" />
      <el-form-item :label="$t('form.confirmPassword')" prop="confirmPwd">
        <el-input
          class="half wTip"
          v-model="regForm.confirmPwd"
          :placeholder="$t('form.pleaseEnterField', {field: $t('form.confirmPassword')})"
          type="password"
          show-password
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field" v-if="!hasReferSummon">
      <img class="form-field-icon" src="../../../assets/home/auth/referral-icon.svg" />
      <el-form-item :label="$t('form.referralCode')" prop="codeAffiliate">
        <el-input
          v-if="!hasAffiliate"
          class="half"
          v-model="regForm.codeAffiliate"
          :placeholder="$t('form.optionalEntry')"
          clearable
        />
        <el-input
          v-else
          class="half"
          v-model="regForm.codeAffiliate"
          :placeholder="$t('form.optionalEntry')"
          readonly
          disabled
          clearable
        />
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="../../../assets/home/auth/verification-icon.png" width="35px" />
      <el-form-item :label="$t('form.verificationCode')" prop="captchaCode">
        <div style="display: flex; width: 100%">
          <el-input
            @keyup.enter="submitRegisterForm(registerRef)"
            v-model="regForm.captchaCode"
            :label="$t('form.verificationCode')"
            :placeholder="$t('form.pleaseEnterField', {field: $t('form.verificationCode')})"
            clearable
          />
          <img style="width: 90px" :src="verificationImg" @click="getCode" />
        </div>
      </el-form-item>
    </div>
  </el-form>
  <div>
    <el-button class="blue-bg primary-btn" size="large" @click="submitRegisterForm(registerRef)">{{ $t('btn.register') }}</el-button>
  </div>

  <div style="display:flex;justify-content:center;padding:26px 0;">
    <div style="text-align: center" class="font-gray">
      {{$t('form.alreadyHaveAcc')}}？
      <a @click="openLoginDialog">{{ $t('form.goLogin') }}</a>
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
import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const i18nStoreLanguage = i18nStore()
const { languageVal } = storeToRefs(i18nStoreLanguage)
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
    return Promise.reject(t('form.usernameRule02', {letterCount: 2, numberCount: 1}));
  }

  return Promise.resolve();
};

let validatePhoneNumber = async (r, v) => {
  var reg = /^\d+$/;
  if (v === "") {
    return Promise.reject(t('form.verifyYourPhoneNumber'));
  } else if (!reg.test(v)) {
    return Promise.reject(t('form.onlyNumbersAllowed'));
  } else {
    return Promise.resolve();
  }
};

let validateRealName = async (r, v) => {
  if (v === "") {
    return Promise.reject(t('form.pleaseEnterField', {field: t('form.realName')}));
  } else if (!checkRealName(v)) {
    return Promise.reject(t('form.realNameRule02'));
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
    return Promise.reject(t('form.reEnterPassword'));
  } else if (v !== regForm.password) {
    return Promise.reject(t('form.passwordMismatch'));
  } else {
    return Promise.resolve();
  }
};

let validatePass = async (r, v) => {
  if (v === "") {
    return Promise.reject(t('form.pleaseEnterField', {field: t('form.password')}));
  } else {
    return validatePassStrength(r, v);
  }
};

const regRules = {
  // realName: [
  //   {
  //     required: true,
  //     message: t('form.pleaseEnterField', {field: t('form.realName')}),
  //     trigger: "blur"
  //   },
  //   {
  //     min: 2,
  //     max: 12,
  //     message: t('form.lengthMustBeBetween', {min: 2, max: 12}),
  //     trigger: "blur"
  //   },
  //   {
  //     validator: validateRealName,
  //     trigger: "change"
  //   }
  // ],
  loginName: [
    {
      required: true,
      message: t('form.pleaseEnterField', {field: t('form.username')}),
      trigger: "blur"
    },
    {
      min: 4,
      max: 11,
      message: t('form.lengthMustBeBetween', {min: 4, max: 11}),
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
      message: t('form.pleaseEnterField', {field: t('form.password')}),
      trigger: "blur"
    },
    {
      min: 6,
      max: 12,
      message: t('form.lengthMustBeBetween', {min: 6, max: 12}),
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
      message: t('form.pleaseEnterField', {field: t('form.password')}),
      trigger: "blur"
    },
    {
      min: 6,
      max: 12,
      message: t('form.lengthMustBeBetween', {min: 6, max: 12}),
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
      message: t('form.pleaseEnterField', {field: t('form.smsOtp')}),
      trigger: "blur"
    },
    {
      min: 6,
      max: 6,
      message: t('form.lengthMustBe', {num: 6}),
      trigger: "blur"
    }
  ],
  email: [
    {
      required: true,
      message: t('form.pleaseEnterField', {field: t('form.email')}),
      trigger: "blur"
    },
    {
      type: "email",
      message: t('form.emailRule01'),
      trigger: "blur"
    },
    {
      max: 50,
      message: t('form.lengthLessThan', {num: 50}),
      trigger: "blur"
    }
  ],
  captchaCode: [
    {
      required: true,
      message: t('form.pleaseEnterField', {field: t('form.verificationCode')}),
      trigger: "blur"
    },
    {
      min: 4,
      max: 4,
      message: t('form.lengthMustBe', {num: 4}),
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
  // realName: "",
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

  .el-input__wrapper {
    background: none !important;
    box-shadow: none !important;
  }
}
</style>
