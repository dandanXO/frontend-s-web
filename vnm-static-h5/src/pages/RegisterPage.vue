<template>
  <div class="login-container">
    <q-form class="rounded-borders" @submit="onSubmit">
      <div class="login-form-container">
        <q-input ref="loginNameRef" rounded standout clearable dense v-model="regForm.loginName"
          :placeholder="$t('lang.username')" :rules="[
            (val) => (val && val.length > 0) || $t('lang.please_enter_username'),
            (val) => (val && val.length >= 6 && val.length <= 11) || $t('lang.length_between_6_11'),
            (val) => /^[a-zA-Z0-9]*$/.test(val) || $t('lang.no_special_characters')
          ]" color="white">
          <template v-slot:prepend>
            <div class="user-icon" />
          </template>
        </q-input>

        <q-input ref="pwdRef" rounded standout dense v-model="regForm.password" :placeholder="$t('lang.password')"
          :type="isPwd ? 'password' : 'text'" :rules="[
            (val) => (val && val.length > 0) || $t('lang.please_type_the_password'),
            (val) => (val.length >= 6 && val.length <= 11) || $t('lang.length_between_6_11')
          ]" color="white">
          <template v-slot:prepend>
            <div class="password-icon" />
          </template>
          <template v-slot:append>
            <q-icon color="dark" :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="isPwd = !isPwd" />
          </template>
        </q-input>
        <div v-if="regForm.password" class="password-str-div">
          <span :class="{
            'weak-pwd': pwdStrength == 'weak',
            'normal-pwd': pwdStrength == 'normal',
            'strong-pwd': pwdStrength == 'strong'
          }">
            {{ $t("lang.password_weak") }}
          </span>
          <span :class="{
            'normal-pwd': pwdStrength == 'normal',
            'strong-pwd': pwdStrength == 'strong'
          }">
            {{ $t("lang.password_good") }}
          </span>
          <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">
            {{ $t("lang.password_strong") }}
          </span>
        </div>


        <q-input ref="realNameRef" rounded standout dense clearable v-model="regForm.realName"
          :placeholder="$t('lang.real_name')" :rules="[
            (val) => (val && val.length > 0) || $t('lang.please_enter_your_real_name'),
            (val) => (val && val.length >= 2) || $t('lang.real_name_validation'),
            (val) => isValidRealName(val)
          ]" color="white">
          <template v-slot:prepend>
            <div class="user-icon" />
          </template>
          <template v-slot:hint>
            <div class="q-mb-xs" style="font-size: 11px; color: #cccccc; ">{{ $t("lang.real_name_hints") }}</div>
          </template>
        </q-input>

        <!--
        <q-label>
          {{ $t("lang.mobile_number") }}
          <em>*</em>
        </q-label> -->
        <q-input ref="telRef" standout dense rounded v-model="regForm.telephone" :placeholder="$t('lang.mobile_number')"
          maxlength="11" clearable type="number" :rules="[
            val => !!val || $t('lang.mobile_number_required'),
            val => val.length === 10 || $t('lang.mobile_number_length'),
            val => /^0\d{9}$/.test(val) || $t('lang.mobile_number_starts_with_0'),
            val => (val && val.length > 7) || $t('lang.mobile_number_valid')
          ]" color="white">
          <template v-slot:prepend>
            <div style="width: 26px; display: flex; align-items: center">
              <div class="phone-icon" />
            </div>
          </template>
        </q-input>

        <q-input ref="verificationRef" rounded standout dense clearable type="text" v-model="regForm.captchaCode"
          :placeholder="$t('lang.verification_code')" color="white" :rules="[
            (val) => (val && val.length > 0) || $t('lang.please_enter_verification_code'),
            (val) => (val && val.length > 3 && val.length < 5) || $t('lang.length_is_4')
          ]">
          <template v-slot:append>
            <img class="veri-img" :src="verificationImg" @click="getCode()" />
          </template>
          <template v-slot:prepend>
            <div class="veri-icon" />
          </template>
        </q-input>

        <q-input v-if="!hasAffiliate" ref="affiliateCodeRef" rounded standout dense clearable v-model="regForm.referrer"
          :hint="$t('lang.referral_hints')" :placeholder="$t('lang.referral_code')">
          <template v-slot:prepend>
            <div class="veri-icon" />
          </template>
        </q-input>

        <div class="row justify-between items-center">
          <q-btn @click.prevent="onSubmit" type="submit" class="q-mt-lg common-large-btn"
            :label="$t('lang.register_btn')" no-caps width="100%" color="brightbtn" style="width: 100%" rounded />
        </div>

        <div class="text-center q-mt-md q-pb-xs">
          {{ $t("lang.registration_hints") }}
          <span @click="openDialog('betrules')" style="white-space: nowrap; color: #0071ed;">
            {{ $t("lang.user_registration_protocol") }}
          </span>

        </div>
        <div class="text-center q-mt-md q-pb-sm">
          {{ $t("lang.already_have_acc") }}
          <router-link to="/login">
            {{ $t("lang.login_here") }}
          </router-link>
        </div>
      </div>
    </q-form>


    <div class="login-bottom-div" @click="openDialog('hundred')">
      <img src="../assets/images/login/register-banner.jpg" />
    </div>
  </div>
  <q-dialog v-model="showHundredDialog" width="100%" show-close>

    <q-card width="100%" class="q-pa-md">
      <q-card-section class="row items-end justify-end q-pb-none">
        <div class="text-h6"></div>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <div>
        <p style="
    width: 85%;
    margin-top: -25px;"><b style="font-size: 14px; color: #0071ed;">THƯỞNG CHÀO MỪNG 100% LÊN ĐẾN 2,000 VNDP</b>

        </p>
        Thành Viên có thể tham gia khuyến mãi này tại trang nạp tiền, sau khi nhập <strong>"Số tiền nạp"</strong> ấn
        chọn
        khuyến mãi <strong>100% Chào Mừng</strong>, sau đó nhấn <strong>"Xác nhận"</strong>.


        <table
          style="font-size: 13px; margin: 10px auto; min-width: 80%; text-align: center; border-collapse: collapse;">
          <colgroup>
            <col>
            <col>
            <col>
            <col>
            <col>
          </colgroup>
          <thead>
            <tr>
              <th style="background: #e7f3ff; padding: 10px; border-top-left-radius: 20px;">Sản Phẩm</th>
              <th style="background: #e7f3ff; padding: 10px;">Nạp tối thiểu</th>
              <th style="background: #e7f3ff; padding: 10px;">Thưởng</th>
              <th style="background: #e7f3ff; padding: 10px;">Thưởng tối đa</th>
              <th style="background: #e7f3ff; padding: 10px; border-top-right-radius: 20px;">Vòng cược</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #dcdce8; padding: 10px; color: #444;">Thể thao</td>
              <td style="border: 1px solid #dcdce8; padding: 10px; color: #444;">200 VNDP</td>
              <td style="border: 1px solid #dcdce8; padding: 10px; color: #444;">100%</td>
              <td style="border: 1px solid #dcdce8; padding: 10px; color: #444;">2,000 VNDP</td>
              <td style="border: 1px solid #dcdce8; padding: 10px; color: #444;">15</td>
            </tr>
            <tr>
              <td style="border: 1px solid #dcdce8; padding: 10px; color: #444;">E-sports, Live Casino, Nổ hũ, Poker,
                Hashgame</td>
              <td style="border: 1px solid #dcdce8; padding: 10px; color: #444;">200 VNDP</td>
              <td style="border: 1px solid #dcdce8; padding: 10px; color: #444;">100%</td>
              <td style="border: 1px solid #dcdce8; padding: 10px; color: #444;">2,000 VNDP</td>
              <td style="border: 1px solid #dcdce8; padding: 10px; color: #444;">25</td>
            </tr>
          </tbody>
        </table>

        <p>Để biết thêm chi tiết về khuyến mãi vui lòng liên hệ Chăm Sóc Khách Hàng trực tuyến 24/7 để được hỗ trợ
        </p>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showBetRulesDialog" width="100%" show-close>
    <q-card width="100%" class="q-pa-md">
      <q-card-section class="row items-end justify-end q-pb-none">
        <div class="text-h6"></div>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <p style="width: 85%; margin-top: -25px;"><b style="font-size: 16px; color: #0071ed;">{{
        $t("lang.about.bettingRules") }}</b></p>
      <ul>
        <li>{{ $t("lang.about.familyRestriction") }}</li>
        <li>{{ $t("lang.about.entertainmentPurpose2") }}</li>
        <li>{{ $t("lang.about.modifyPromotion") }}</li>
        <li>{{ $t("lang.about.singleDeposit") }}</li>
        <li>
          {{ $t("lang.about.refundBasedOnBetTurnover") }}
          <ul class="sub-ul">
            <li>{{ $t("lang.about.refundOptions.loseAll") }}</li>
            <li>{{ $t("lang.about.refundOptions.loseLessThanStake") }}</li>
            <li>{{ $t("lang.about.refundOptions.winGreaterThanOrEqualTo75") }}</li>
            <li>{{ $t("lang.about.refundOptions.winLessThan75") }}</li>
          </ul>
        </li>
        <li>{{ $t("lang.about.requiredRounds") }}</li>
        <li>
          {{ $t("lang.about.abuseDiscretion") }}
          <ul class="sub-ul">
            <li>{{ $t("lang.about.abuseExamples.excludedGames") }}</li>
            <li>{{ $t("lang.about.abuseExamples.multipleAccounts") }}</li>
            <li>{{ $t("lang.about.abuseExamples.crossAccountBets") }}</li>
            <li>{{ $t("lang.about.abuseExamples.oddsDifference") }}</li>
            <li>{{ $t("lang.about.abuseExamples.doubleBetAmount") }}</li>
            <li>{{ $t("lang.about.abuseExamples.betOnBothSides") }}</li>
            <li>{{ $t("lang.about.abuseExamples.doubleBet") }}</li>
            <li>{{ $t("lang.about.abuseExamples.allin") }}</li>
            <li>{{ $t("lang.about.abuseExamples.affiliateAbuse") }}</li>
          </ul>
        </li>
        <li>{{ $t("lang.about.excludedBets") }}</li>
        <li>{{ $t("lang.about.transactionRecordsCheck") }}</li>
        <li>{{ $t("lang.about.falsifiedContentDisqualification") }}</li>
        <li>{{ $t("lang.about.amendTermsAndConditions") }}</li>
        <li>{{ $t("lang.about.withdrawalVerification") }}</li>
      </ul>
    </q-card>
  </q-dialog>

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
              <img :src="phoneVerificationImg" title="点击刷新验证码" style="margin-top: 6px; cursor: pointer"
                @click="getInnerCode" />
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
import { isAndroid, isOperaPixelUrl } from "boot/utils";

export default defineComponent({
  name: "RegisterPage",
  setup() {
    onMounted(() => {
      getReferralCode();
      getAffiliateCode();
    });
    onActivated(() => {
      getCode();
    });
    const showHundredDialog = ref(false);
    const showBetRulesDialog = ref(false);
    const openDialog = (currentDialog) => {
      if (currentDialog === 'hundred') {
        showHundredDialog.value = true
      } else {
        showBetRulesDialog.value = true
      }
    }
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

    const regForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      telephone: "",
      email: "",
      captchaCode: "",
      regHost: location.hostname,
      codeId: "",
      codeAffiliate: "",
      referrer: "",
      smsCodeId: "",
      smsCode: ""
    });
    const getCode = () => {
      api
        .get("/member/verificationEasyCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value = "data:image/png;base64," + response.data.img;
            regForm.codeId = response.data.id;
            regForm.captchaCode = "";
            verificationRef.value.resetValidation();
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
    const realNameRef = ref();
    const telRef = ref();
    const emailRef = ref();
    const verificationRef = ref();
    const affiliateCodeRef = ref();
    const phoneVerificationRef = ref();
    const $q = useQuasar();
    const route = useRoute();

    const pwdStrength = ref("");
    const isValidEmail = () => {
      if (!regForm.email) {
        return
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
      const phonePattern = /^[a-zA-Z\s]+$/;
      return phonePattern.test(regForm.realName) || t("lang.personal_realname_valid");
    };

    const router = useRouter();
    const ui = useUI();

    const trackRegisterSuccessEvent = () => {
      if (ui.adjust_register_event && isAndroid()) {
        var adjustEvent = new AdjustEvent(ui.adjust_register_event);
        Adjust.trackEvent(adjustEvent);
      }
    }

    const trackRegisterFailedEvent = () => {
      if (ui.adjust_register_fail_event && isAndroid()) {
        var adjustEvent = new AdjustEvent(ui.adjust_register_fail_event);
        Adjust.trackEvent(adjustEvent);
      }
    }

    const onSubmit = () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();
      // confirmPwdRef.value.validate();
      telRef.value.validate();
      realNameRef.value.validate();
      // phoneVerificationRef.value.validate();
      // emailRef.value.validate();
      verificationRef.value.validate();
      $q.loading.show({
        message: t("lang.register_in_progress")
      });
      if (
        loginNameRef.value.hasError ||
        pwdRef.value.hasError ||
        // confirmPwdRef.value.hasError ||
        telRef.value.hasError ||
        // phoneVerificationRef.value.hasError ||
        // emailRef.value.hasError ||
        realNameRef.value.hasError ||
        verificationRef.value.hasError
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
            .post("/member/fbRegister", qs.stringify(regForm))
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
                if (store.isAffiliateA) {
                  fbq("track", "signup-success");
                }
                if (isOperaPixelUrl()) {
                  otag("event", "registration");
                }

                store.autoLogin(res.data);
                sessionStorage.removeItem("REFERRAL_CODE");
                if (store.hasToken()) {
                  router.push({ path: "/", query: { name: "welcome" } });
                }
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
      realNameRef,
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
      openDialog,
      showHundredDialog,
      showBetRulesDialog
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
  background: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwkHBgoJCAkLCwoMDxkQDw4ODx4WFxIZJCAmJSMgIyIoLTkwKCo2KyIjMkQyNjs9QEBAJjBGS0U+Sjk/QD3/2wBDAQsLCw8NDx0QEB09KSMpPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT3/wgARCAHxAOUDAREAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAECAwf/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAA9e3kAUKEklkqJKAAAAAAAAL25gBFWkhLM2QUAAAAAAAATvyARSqhKzUslAAAAAAAAAz34woBVRc1nSVBQAAAAAAABj0cAALKGdXNualKAAAAAAAAMejgAAEqVm3F1NAoAAAAAAAGPRwAACEszq5upbKCgAAAAAADHo4AAAM2ZtlstzapQAAAAAABj0cAAAGbM0tzdS2UoAAAAAAAx6OAAACWZqLLZdZ0CgAAAAAAY9HAAABDOpFlsus0pQAAAAAAMejgAAAGbM1LqXUqUoAAAAAAGPRwAAACWZqXWbqVKUAAAAAADHo4AAABCWZus6stlKAAAAAABj0cAAAAErNudXNspQAAAAAAMejgAAAAlstzq4qUoAAAAAAJj0cQAAALLZbnVzUokoAAAABLQ59+IAAAstLLZq5qIqBIKAACWgqpy7cgAAC2NS1bKgqECSgAAC2BSuXTkAALKLLpbLVASRUBAAAUFVFvHfIAWUUstWy0KAAkgCgAgotA5a5gCqilWy0KAAAAAAAABi4hQFpYLVAAAAAAAAAAyyAKooUAAAAAAAAAAEABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/8QAGxAAAwADAQEAAAAAAAAAAAAAARFAABBQMKD/2gAIAQEAAT8Ax2PHY9Pb07H3HeO2LR2haMFgwWC0dcaFQ9ViiHRW1aqV8RH/xAAZEQADAAMAAAAAAAAAAAAAAAABEWBQgKD/2gAIAQIBAT8AvDpKb1YFccn/xAAWEQADAAAAAAAAAAAAAAAAAAABgKD/2gAIAQMBAT8AWgTd/wD/2Q==') no-repeat center center;
  background-size: cover;
  height: 100%;
  padding: 12px 0px;

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
  // width: 100%;
  margin: 15px 15px 5px;
  overflow: hidden;
  border-radius: 10px;

  img {
    width: 100%;
    margin: -20px 0;
  }
}
</style>
