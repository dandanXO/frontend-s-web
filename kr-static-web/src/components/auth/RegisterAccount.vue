<template>
  <el-form ref="registerRef" :rules="regRules" :model="regForm" label-width="200" size="large">
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/referral-icon.png" />
      <el-form-item :label="t('register.reg_referrer')" prop="codeAffiliate">
        <el-input
          v-if="!hasAffiliate"
          class="half"
          v-model="regForm.codeAffiliate"
          :placeholder="t('register.reg_referrer_placeholder')"
          clearable
        />
        <el-input
          v-else
          class="half"
          v-model="regForm.codeAffiliate"
          :placeholder="t('register.reg_referrer_placeholder')"
          readonly
          disabled
          clearable
        />
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/username-icon.png" />
      <el-form-item :label="$t('register.reg_nickname')" prop="name2">
        <el-input class="wTip" v-model="regForm.name2" clearable>
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/username-icon.png" />
      <el-form-item :label="$t('register.reg_userid')" prop="loginName">
        <el-input class="wTip" v-model="regForm.loginName" clearable>
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/password-icon.png" />
      <el-form-item :label="$t('register.reg_pass')" prop="password">
        <el-input
          class="wTip"
          v-model="regForm.password"
          :placeholder="$t('register.reg_pass_placeholder')"
          type="password"
          show-password
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/password-icon.png" />
      <el-form-item :label="$t('register.reg_confirm_pass')" prop="confirmPwd">
        <el-input
          class="half wTip"
          v-model="regForm.confirmPwd"
          :placeholder="$t('register.reg_confirm_pass_placeholder')"
          type="password"
          show-password
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/phone-icon.png" />
      <el-form-item :label="$t('register.reg_phone_num')" prop="telephone">
        <el-input
          class="wTip"
          v-model="regForm.telephone"
          :placeholder="$t('register.reg_phone_placeholder')"
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/bank-icon.png" />
      <el-form-item :label="$t('register.reg_bank')" prop="bankId">
        <el-select
          v-model="regForm.bankId"
          :placeholder="$t('register.reg_bank_placeholder')"
          size="large"
          class="wTip"
        >
          <el-option
            v-for="item in bankCards"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
            <div style="height:34px;display:flex;gap:5px;">
              <img style="height:100%;width:auto;" :src="imgURL + '/payment/' + item.bankIcon" />
              <div>{{ item.name }}</div>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </div>
    
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/bank-acc-icon.png" />
      <el-form-item :label="$t('register.reg_bank_acc_num')" prop="cardNumber">
        <el-input
          class="wTip"
          v-model="regForm.cardNumber"
          :placeholder="$t('register.reg_bank_acc_num_placeholder')"
          clearable
          type="number"
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/bank-holder-icon.png" />
      <el-form-item :label="$t('register.reg_bank_acc_holder')" prop="cardAccount">
        <el-input
          class="wTip"
          v-model="regForm.cardAccount"
          :placeholder="$t('register.reg_bank_acc_holder_placeholder')"
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/password-icon.png" />
      <el-form-item :label="$t('register.reg_withdraw_password')" prop="withdrawPassword">
        <el-input
          class="wTip"
          v-model="regForm.withdrawPassword"
          :placeholder="$t('register.reg_withdraw_password_placeholder')"
          clearable
          type="number"
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>
  </el-form>
  <div>
    <button class="primary-btn login-btn" size="large" @click="submitRegisterForm(registerRef)">
      {{ $t("login.register") }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, defineEmits } from "vue";
import { userStore } from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import { lsGet } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { getVerificationCode, register, bankCardList } from "@/api/index/login";
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

let validateBankLength = async (r, v) => {
  const paymentType = bankCards.value.find(({ id }) => id === regForm.bankId);
  if (!/^[A-Za-z0-9]+$/.test(v)) {
    return Promise.reject("숫자를 입력하세요");
  }
  
  if(!v) {
    return Promise.reject(t("register.reg_please_enter_card_num"));
  } else if (paymentType.bankType === "BANK" && (v.length > 17)) {
    return Promise.reject(t("register.reg_bank_acc_num_less_than_17_char"));
  } else if (paymentType.code.includes("USDT") && v.length >= 34 && v.length <= 36) {
    return Promise.reject(t("길이는 34에서 36자 여야 합니다"));
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


let validateName = async (r, v) => {
  if (v === "") {
    return Promise.reject(t("placeholder.username"));
  } else if (!/^[A-Za-z0-9]+$/.test(v)) {
    return Promise.reject(t("placeholder.only_letter_number_allowed"));
  } else {
    return Promise.resolve();
  }
};
let validatePhoneNumber = async (r, v) => {
  if (v === "") {
    return Promise.reject(t("placeholder.verifyPhone"));
  } else if (!/^\d+$/.test(v)) {
    return Promise.reject(t("placeholder.onlyNumber"));
  } else if (v.length !== 11) {
    return Promise.reject(t("placeholder.invalidPhoneLength"));
  } 
  // else if (v.charAt(0) !== '0') {
  //   return Promise.reject(t("placeholder.invalidPhoneStartsWith0"));
  // } 
  else {
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
  bankId: [
    {
      required: true,
      message: t("register.reg_please_select_a_bank_account"),
      trigger: 'change',
    },
  ],
  cardNumber: [
    {
      required: true,
      validator: validateBankLength,
      trigger: "change"
    }
  ],
  cardAccount: [
    {
      required: true,
      message: t("register.reg_card_account_cannot_empty"),
      trigger: "change"
    }
  ],
  withdrawPassword: [
    {
      min: 4,
      max: 4,
      message: t("register.reg_withdraw_password_4_digits"),
      trigger: "blur"
    },
    {
      required: true,
      message: t("register.reg_withdraw_password_4_digits"),
      trigger: "change"
    }
  ],
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
                // emits("open-welcome-dialog")

                sessionStorage.removeItem("REFERRAL_CODE");
                sessionStorage.removeItem("AFFILIATE_CODE");

                if (store.token) {
                  router.push("/");
                  sessionStorage.setItem("IS_GET_WELCOME", "1");
                }
              } else {
                ElMessage.error(response.message);
                // getCode();
              }
            })
            .catch((err) => {
              console.log(err.message);
              // getCode();
            });
        })();
      } else {
        // getCode();
      }
    })
    .catch((errr) => {
      console.log(errr);
    });
};

const regForm = reactive({
  name2: "",
  loginName: "",
  password: "",
  confirmPwd: "",
  telephone: cachedTelephone ?? "",
  cardNumber: "",
  cardAccount: "",
  codeAffiliate: "",
  withdrawPassword: "",
  regHost: location.hostname
});

const registerRef = ref([]);
const bankCards = ref([]);

const getBankCards = () => {
  bankCardList().then((res) => {
    const { code, data } = res;

    if(code === 0) {
      bankCards.value = data;
    }
  })
}

const emits = defineEmits(["close-dialog, open-login-dialog"]);

const imgURL = process.env.VUE_APP_IMAGE_CDN;

onMounted(() => {
  // getCode();
  getAffiliateCode();
  getReferalCode();
  getBankCards();
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
