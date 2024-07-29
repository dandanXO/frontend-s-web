<template>
  <div class="login-container">
    <q-form class="rounded-borders" @submit="onSubmit">
      <div class="login-form-container">
        <!-- <q-label>
          {{ $t("lang.username") }}
          <em>*</em>
        </q-label> -->
        <q-input
          v-if="!hasAffiliate"
          ref="affiliateCodeRef"
          rounded
          standout
          dense
          clearable
          v-model="regForm.referrer"
          :hint="$t('lang.referral_hints')"
          :placeholder="$t('lang.referral_code')"
        >
          <template v-slot:prepend>
            <img src="../assets/images/login/recommend-icon.png" width="24" />
          </template>
        </q-input>

        <!-- <q-label>
          {{ $t("lang.real_name") }}
          <em>*</em>
        </q-label> -->
        <q-input
          ref="name2Ref"
          rounded
          standout
          dense
          clearable
          v-model="regForm.name2"
          :placeholder="$t('lang.nickname')"
          color="white"
          hint=""
        >
          <template v-slot:prepend>
            <img src="../assets/images/login/nickname-icon.png" width="24" />
          </template>
          <template v-slot:hint>
            <div class="q-mb-xs" style="font-size: 11px; color: #cccccc">{{ $t("lang.real_name_hints") }}</div>
          </template>
        </q-input>

        <q-input
          ref="loginNameRef"
          rounded
          standout
          clearable
          dense
          v-model="regForm.loginName"
          :placeholder="$t('lang.username')"
          :rules="[
            (val) => (val && val.length > 0) || $t('lang.please_enter_username'),
            (val) => (val && val.length >= 6 && val.length <= 11) || $t('lang.length_between_6_11'),
            (val) => /^[a-zA-Z0-9]*$/.test(val) || $t('lang.no_special_characters')
          ]"
          color="white"
        >
          <template v-slot:prepend>
            <img src="../assets/images/login/user-icon.png" width="24" />
          </template>
        </q-input>

        <!-- <q-label>
          {{ $t("lang.password") }}
          <em>*</em>
        </q-label> -->
        <q-input
          ref="pwdRef"
          rounded
          standout
          dense
          v-model="regForm.password"
          :placeholder="$t('lang.password')"
          :type="isPwd ? 'password' : 'text'"
          :rules="[
            (val) => (val && val.length > 0) || $t('lang.please_type_the_password'),
            (val) => (val.length >= 6 && val.length <= 11) || $t('lang.length_between_6_11')
          ]"
          color="white"
        >
          <template v-slot:prepend>
            <img src="../assets/images/login/password-icon.png" width="24" />
          </template>
          <template v-slot:append>
            <q-icon
              color="dark"
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <!-- <q-label>
          {{ $t("lang.confirm_password") }}
          <em>*</em>
        </q-label> -->
        <q-input
          ref="confirmPwdRef"
          rounded
          standout
          :type="isCfmPwd ? 'password' : 'text'"
          v-model="regForm.confirmPwd"
          :placeholder="$t('lang.confirm_password')"
          :rules="[
            (val) => (val && val.length > 0) || $t('lang.please_type_the_confirm_password'),
            (val) => val === regForm.password || $t('lang.password_not_same'),
            (val) => (val.length >= 6 && val.length <= 11) || $t('lang.length_between_6_11')
          ]"
          color="white"
        >
          <template v-slot:prepend>
            <img src="../assets/images/login/password-icon.png" width="24" />
          </template>
          <template v-slot:append>
            <q-icon
              color="dark"
              :name="isCfmPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isCfmPwd = !isCfmPwd"
            />
          </template>
        </q-input>

        <!--
        <q-label>
          {{ $t("lang.mobile_number") }}
          <em>*</em>
        </q-label> -->
        <q-input
          ref="telRef"
          standout
          dense
          rounded
          v-model="regForm.telephone"
          :placeholder="$t('lang.mobile_number')"
          maxlength="11"
          clearable
          type="number"
          :rules="[
            (val) => !!val || $t('lang.mobile_number_required'),
            (val) => (val && val.length >= 10) || $t('lang.mobile_number_valid'),
            (val) => (val && val.length <= 11) || $t('lang.mobile_number_valid')
          ]"
          color="white"
        >
          <template v-slot:prepend>
            <div style="width: 24px; display: flex; align-items: center">
              <img src="../assets/images/login/phone-icon.png" width="24" />
            </div>
          </template>
        </q-input>

        <q-select
          dense
          standout
          rounded
          :label="$t('lang.reg_bank_placeholder')"
          ref="bankCardRef"
          v-model="regForm.bankId"
          :options="banks"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          lazy-rules
          :rules="[(val) => !!val || $t('lang.please_select_a_bank_account')]"
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          @update:model-value="onUpdateBankCard"
        >
          <template v-slot:prepend>
            <div style="width: 24px; display: flex; align-items: center">
              <img src="../assets/images/login/bank-icon.png" width="24" />
            </div>
          </template>
          <template v-slot:no-option></template>
          <template v-slot:option="scope">
            <div v-bind="scope.itemProps" dense class="bank-list-item" style="padding: 0 5px">
              <div avatar v-if="scope.opt.bankIcon">
                <img style="width: 30px" :src="imgURL + '/payment/' + scope.opt.bankIcon" />
              </div>
              <div>
                {{ scope.opt.name }}
              </div>
            </div>
          </template>
          <template v-slot:selected-item="scope">
            <div v-bind="scope.itemProps" dense class="bank-list-item">
              <div avatar v-if="scope.opt.bankIcon">
                <img style="width: 30px" :src="imgURL + '/payment/' + scope.opt.bankIcon" />
              </div>
              <div>
                {{ scope.opt.name }}
              </div>
            </div>
          </template>
        </q-select>

        <q-input
          dense
          type="number"
          :placeholder="$t('lang.reg_bank_acc_num_placeholder')"
          ref="cardNumRef"
          standout
          rounded
          v-model="regForm.cardNumber"
          lazy-rules
          clearable
          :rules="[(val) => (val && val.length > 0) || $t('lang.please_enter_card_num'), validateBankLength]"
        >
          <template v-slot:prepend>
            <div style="width: 24px; display: flex; align-items: center">
              <img src="../assets/images/login/bank-number-icon.png" width="24" />
            </div>
          </template>
        </q-input>

        <q-input
          dense
          :placeholder="$t('lang.reg_bank_acc_holder_placeholder')"
          ref="cardAccRef"
          standout
          rounded
          v-model="regForm.cardAccount"
          lazy-rules
          clearable
          :rules="[(val) => (val && val.length > 0) || $t('lang.card_account_cannot_empty')]"
        >
          <template v-slot:prepend>
            <div style="width: 24px; display: flex; align-items: center">
              <img src="../assets/images/login/bank-holder-icon.png" width="24" />
            </div>
          </template>
        </q-input>

        <q-input
          dense
          :placeholder="$t('lang.reg_withdraw_password_placeholder')"
          ref="withdrawPasswordRef"
          standout
          rounded
          v-model="regForm.withdrawPassword"
          clearable
          lazy-rules
          :rules="[(val) => val.length === 4 || $t('lang.reg_withdraw_password_4_digits')]"
          mask="#  #  #  #"
          fill-mask
          unmasked-value
        >
          <template v-slot:prepend>
            <div style="width: 24px; display: flex; align-items: center">
              <img src="../assets/images/login/withdraw-pwd-icon.png" width="24" />
            </div>
          </template>
        </q-input>

        <!-- <q-label>
          {{ $t("lang.email") }}
        </q-label>
        <q-input
          ref="emailRef"
          standout
          rounded
          type="email"
          v-model="regForm.email"
          :placeholder="$t('lang.email')"
          :rules="[isValidEmail]"
          color="white"
        >
          <template v-slot:prepend>
            <div style="width: 24px; display: flex; align-items: center">
              <img src="../assets/images/login/mail-icon.png" width="27" />
            </div>
          </template>
        </q-input> -->

        <!-- <q-label>
          {{ $t("lang.verification_code") }}
          <em>*</em>
        </q-label> -->
        <!-- <q-input
          ref="verificationRef"
          rounded
          standout
          dense
          clearable
          type="text"
          v-model="regForm.captchaCode"
          :placeholder="$t('lang.verification_code')"
          color="white"
          :rules="[
            (val) => (val && val.length > 0) || $t('lang.please_enter_verification_code'),
            (val) => (val && val.length > 3 && val.length < 5) || $t('lang.length_is_4')
          ]"
        >
          <template v-slot:append>
            <img class="veri-img" :src="verificationImg" @click="getCode()" />
          </template>
          <template v-slot:prepend>
            <img src="../assets/images/login/veri-icon.png" width="24" />
          </template>
        </q-input> -->

        <!-- <q-label>{{ $t("lang.referral_code") }}</q-label> -->

        <div class="row justify-between items-center">
          <q-btn
            @click.prevent="onSubmit"
            type="submit"
            class="q-mt-lg common-large-btn"
            :label="$t('lang.register_btn')"
            no-caps
            width="100%"
            color="brightbtn"
            style="width: 100%"
            rounded
          />
        </div>

        <div class="text-center q-mt-md q-pb-xs">
          {{ $t("lang.registration_hints") }}
          <!--          <router-link to="/login" style="white-space: nowrap">-->
          <div style="white-space: nowrap">
            {{ $t("lang.user_registration_protocol") }}
          </div>

          <!--          </router-link>-->
        </div>
      </div>
    </q-form>

    <div class="text-center q-mt-md q-pb-lg">
      {{ $t("lang.already_have_acc") }}
      <router-link to="/login">
        {{ $t("lang.login_here") }}
      </router-link>
    </div>

    <!-- <div class="login-bottom-div"> -->
    <!-- <img src="../assets/images/login/register-banner.png" /> -->
    <!-- </div> -->
  </div>

  <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss no-esc-dismiss>
    <q-card width="100%">
      <q-card-section class="q-pa-md bg-brightbtn text-white">
        <q-toolbar>
          <q-toolbar-title>验证码</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-card-section>
      <div class="q-px-lg q-pt-sm q-pb-lg">
        <q-card-section class="q-mb-md q-pa-md">
          <q-input v-model="innerCaptchaRef" placeholder="验证码">
            <template v-slot:append>
              <img
                :src="phoneVerificationImg"
                title="点击刷新验证码"
                style="margin-top: 6px; cursor: pointer"
                @click="getInnerCode"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-btn @click="onCaptchaSubmit" label="发送验证码" color="brightbtn" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch, onActivated } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import qs from "qs";
import { useI18n } from "vue-i18n";
import { useUI } from "stores/ui";
import { isAndroid } from "boot/utils";

export default defineComponent({
  name: "RegisterPage",
  setup() {
    const siteId = process.env.SITEID;
    const imgURL = process.env.IMAGE_CDN;

    onMounted(() => {
      getReferralCode();
      getAffiliateCode();
      getBankList();
    });
    onActivated(() => {
      getCode();
    });
    const { t } = useI18n();
    const store = userStore();
    const verificationImg = ref("");
    const isValidName = () => {
      const namePattern = /^([\u4e00-\u9fa5\.\。]*)$/;
      // const namePattern = /^[\u4e00-\u9fa5]{2,4}$/;
      return namePattern.test(regForm.realName) || "请输入中文字符";
    };

    const captchaRef = ref();
    const innerCodeId = ref("");
    const innerCaptchaRef = ref("");
    const showCaptchaDialog = ref(false);
    const phoneVerificationImg = ref("");
    const banks = ref([]);

    const regForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      telephone: "",
      name2: "",
      // email: "",
      regHost: location.hostname,
      // codeId: "",
      codeAffiliate: "",
      referrer: "",
      // smsCodeId: "",
      // smsCode: "",
      cardNumber: "",
      cardAccount: "",
      withdrawPassword: "",
      bankId: undefined
    });
    const getCode = () => {
      api
        .get("/member/verificationEasyCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value = "data:image/png;base64," + response.data.img;
            // regForm.codeId = response.data.id;
            // regForm.captchaCode = "";
            // verificationRef.value.resetValidation();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const getInnerCode = () => {
      api
        .get("/member/verificationEasyCode")
        .then((response) => {
          if (response.code === 0) {
            phoneVerificationImg.value = "data:image/png;base64," + response.data.img;
            innerCodeId.value = response.data.id;
            innerCaptchaRef.value = "";
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const hasAffiliate = ref(false);

    const getAffiliateCode = () => {
      const affCode = sessionStorage.getItem("AFFILIATE_CODE");
      if (affCode) {
        hasAffiliate.value = true;
        regForm.codeAffiliate = affCode;
      }
    };
    const getReferralCode = () => {
      const refCode = sessionStorage.getItem("REFERRAL_CODE");
      if (refCode) {
        hasAffiliate.value = true;
        regForm.referrer = refCode;
      }
    };

    // const getReferralCode = () => {
    //   const refCode = sessionStorage.getItem("REFERRAL_CODE");
    //   if (refCode) {
    //     regForm.referrer = refCode;
    //   }
    // }
    const loginNameRef = ref();
    const pwdRef = ref();
    const confirmPwdRef = ref();
    const name2Ref = ref();
    const telRef = ref();
    const emailRef = ref();
    const verificationRef = ref();
    const affiliateCodeRef = ref();
    const phoneVerificationRef = ref();
    const cardNumberRef = ref();
    const bankCardRef = ref();
    const withdrawPasswordRef = ref();
    const cardNumRef = ref();
    const cardAccRef = ref();
    const $q = useQuasar();
    const route = useRoute();

    const pwdStrength = ref("");
    const isValidEmail = () => {
      if (!regForm.email) {
        return;
      }
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(regForm.email) || t("lang.email_valid");
    };

    const isValidCnPhone = () => {
      const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      return phonePattern.test(regForm.telephone) || "请输入有效的电话号码";
    };

    const isValidRealName = (val) => {
      const phonePattern = /^[a-zA-Z\uac00-\ud7ff\s]+$/;
      return phonePattern.test(regForm.realName) || t("lang.personal_realname_valid");
    };

    const router = useRouter();
    const ui = useUI();

    const trackRegisterSuccessEvent = () => {
      if (ui.adjust_register_event && isAndroid()) {
        var adjustEvent = new AdjustEvent(ui.adjust_register_event);
        Adjust.trackEvent(adjustEvent);
      }
    };

    const trackRegisterFailedEvent = () => {
      if (ui.adjust_register_fail_event && isAndroid()) {
        var adjustEvent = new AdjustEvent(ui.adjust_register_fail_event);
        Adjust.trackEvent(adjustEvent);
      }
    };

    const onUpdateBankCard = () => {
      if (regForm.cardNumber) {
        cardNumberRef.value.resetValidation();
      }
    };

    const onSubmit = () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();
      confirmPwdRef.value.validate();
      telRef.value.validate();
      // name2Ref.value.validate();
      cardNumRef.value.validate();
      cardAccRef.value.validate();
      bankCardRef.value.validate();
      withdrawPasswordRef.value.validate();
      // phoneVerificationRef.value.validate();
      // emailRef.value.validate();
      // verificationRef.value.validate();
      $q.loading.show({
        message: t("lang.register_in_progress")
      });
      if (
        loginNameRef.value.hasError ||
        pwdRef.value.hasError ||
        confirmPwdRef.value.hasError ||
        telRef.value.hasError ||
        // phoneVerificationRef.value.hasError ||
        // emailRef.value.hasError ||
        // name2Ref.value.hasError ||
        cardNumRef.value.hasError ||
        cardAccRef.value.hasError ||
        bankCardRef.value.hasError ||
        withdrawPasswordRef.value.hasError
        // verificationRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
        var qs = require("qs");
        const sidParam = store.visitorId;

        (async () => {
          if (store.googleadid) {
            regForm.sid = store.googleadid;
          } else if (store.aaid) {
            regForm.sid = store.aaid;
          } else {
            regForm.sid = "fp-" + sidParam;
            regForm.isfinger = "1";
          }
          regForm.regDevice = $q.platform.is.mobile ? "H5" : "WEB";
          if ("standalone" in window.navigator && window.navigator.standalone) {
            regForm.regDevice = "IOS";
          } else {
            regForm.regDevice = Platform.is.mobile ? "H5" : "WEB";
            if (Platform.is.capacitor) {
              if (Platform.is.android) {
                regForm.regDevice = "ANDROID";
              }
            }
          }

          if (regForm.regHost.indexOf("http://localhost") > -1) {
            regForm.regHost = "app://";
          }

          api
            .post("/member/register-with-bank-card", qs.stringify(regForm))
            .then((ret) => {
              const res = ret;
              // console.log("RET");
              // console.log(ret);
              if (res.code === 0) {
                // $q.notify({
                //   color: "positive",
                //   position: "top",
                //   message: t("lang.register_successful"),
                //   icon: "check_circle_outline"
                // });

                //ADJUST TRACKEVENT.
                trackRegisterSuccessEvent();

                // FB tracking :: signup-success

                $q.notify({
                  color: "positive",
                  position: "top",
                  message: t("lang.register_successful"),
                  icon: "check_circle_outline"
                });

                // store.autoLogin(res.data);
                setTimeout(() => router.push("/"), 1000);
                sessionStorage.removeItem("REFERRAL_CODE");
                // if (store.hasToken()) {
                //   router.push({ path: "/", query: { name: "welcome" } });
                // }
              } else {
                $q.notify({
                  color: "negative",
                  position: "top",
                  message: res.message,
                  icon: "report_problem"
                });
              }
              $q.loading.hide();
            })
            .catch((error) => {
              trackRegisterFailedEvent();
              $q.loading.hide();
            });
          getCode();
        })();
      }
    };

    const getBankList = () => {
      api
        .get(`/member/withdraw/banks?siteId=${siteId}`)
        .then((res) => {
          if (res.code === 0) {
            banks.value = res.data;
          }
        })
        .catch((e) => console.log(e));
    };

    watch(
      () => regForm.password,
      () => {
        pwdStrength.value = "";

        var pwd = regForm.password;
        var result = 0;
        for (var i = 0, len = pwd.length; i < len; ++i) {
          result |= charType(pwd.charCodeAt(i));
        }

        var level = 0;
        for (var i = 0; i <= 4; i++) {
          if (result & 1) {
            level++;
          }
          result = result >>> 1;
        }
        if (pwd.length >= 6) {
          switch (level) {
            case 1:
              pwdStrength.value = "weak";
              break;
            case 2:
              pwdStrength.value = "normal";
              break;
            case 3:
            case 4:
              pwdStrength.value = "strong";
              break;
          }
        } else {
          pwdStrength.value = "weak";
        }
      }
    );

    const openPhoneVeriDialog = () => {
      telRef.value.validate();
      if (!telRef.value.hasError) {
        showCaptchaDialog.value = true;
        getInnerCode();
      }
    };

    const onCaptchaSubmit = () => {
      if (!regForm.telephone) {
        $q.notify({
          color: "negative",
          position: "top",
          message: "手机号码不能为空",
          icon: "report_problem"
        });
        getInnerCode();
        return;
      }
      api
        .post(
          `/otp/sendSms`,
          qs.stringify({
            telephone: regForm.telephone,
            captchaCode: innerCaptchaRef.value,
            codeId: innerCodeId.value
          })
        )
        .then((res) => {
          let message = res.message || "发送手机验证码成功",
            color = "positive";

          if (res.code === 0) {
            showCaptchaDialog.value = false;
            regForm.smsCode = "";
            regForm.smsCodeId = res.data.codeId;
            // console.log(res.data.codeId);
          } else {
            color = "negative";
            getInnerCode();
          }

          if (message) {
            $q.notify({ message, color });
          }

          // console.log("onCaptchaSubmit", res);
        })
        .catch(() => {
          getInnerCode();
        });
    };

    return {
      header: "注册账号",
      regForm,
      verificationImg,
      loginNameRef,
      pwdRef,
      confirmPwdRef,
      telRef,
      emailRef,
      name2Ref,
      verificationRef,
      affiliateCodeRef,
      onSubmit,
      isValidEmail,
      isPwd: ref(true),
      isCfmPwd: ref(true),
      getCode,
      getInnerCode,
      pwdStrength,
      isValidName,
      showCaptchaDialog,
      onCaptchaSubmit,
      innerCaptchaRef,
      isValidRealName,
      phoneVerificationImg,
      openPhoneVeriDialog,
      phoneVerificationRef,
      isValidCnPhone,
      hasAffiliate,
      trackRegisterSuccessEvent,
      trackRegisterFailedEvent,
      ui,
      imgURL,
      banks,
      onUpdateBankCard,
      cardNumberRef,
      bankCardRef,
      withdrawPasswordRef,
      cardNumRef,
      cardAccRef
    };
  }
});

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
</script>
<style lang="scss">
.verification {
  display: flex;
  padding: 10px;
}

.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.password-str-div {
  display: flex;
  align-items: center;
  margin-top: 3px;
  margin-bottom: 5px;
  justify-content: space-evenly;
  gap: 5px;
  height: 50px;

  span {
    padding: 8px 3px;
    //border: 1px solid #fff;
    border-radius: 5px;
    background: #434343;
    width: 33%;
    text-align: center;
  }

  span.weak-pwd {
    background: var(--q-negative);
    color: $white;
  }

  span.normal-pwd {
    background: var(--q-warning);
    color: $white;
  }

  span.strong-pwd {
    background: var(--q-positive);
    font-weight: 600;
    color: $white;
  }
}

.q-toolbar {
  background: #33bcd4;
}

.login-container {
  position: relative;
  background: url(../assets/images/login/reg-bg.png) no-repeat center center;
  background-size: cover;
  height: 100%;
  padding: 12px 0px 0px;

  .login-form-container {
    width: $box-width;
    margin: 0px auto 0px;
    background: $white;
    border-radius: 10px;
    box-shadow: 0px -8px 8px 0px #c3d4e6 inset;
    padding: 15px 12px 20px;

    q-label {
      padding-top: 3px;
      padding-left: 8px;
      padding-bottom: 3px;
      color: $font-2;
      font-size: 1rem;

      em {
        color: $negative;
      }
    }

    .q-input {
      margin-bottom: 4px;
    }

    .veri-img {
      height: 80%;
      padding-right: 6px;
      // width: 125px;
    }

    .login-via-phone-div {
      color: $primary;
      font-size: 1rem;
    }
  }
}

.cs-web-id {
  color: $primary;
  font-size: 1rem;
}

.login-bottom-div {
  width: 100%;
  margin-top: 10px;

  img {
    width: 100%;
  }
}

.bank-list-item {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
}
</style>
