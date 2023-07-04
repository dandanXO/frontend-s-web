<template>
  <q-form
      class="q-gutter-y-md rounded-borders"
      @submit="onSubmit"
  >
    <q-input
        ref="realNameRef"
        hide-bottom-space
        v-model="regForm.realName"
        label="姓名"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '请输入姓名', isValidName]"
        color="white"
    >
      <template v-slot:prepend>
        <q-icon color="bright" name="person_outline"/>
      </template>
    </q-input>


    <q-input
        ref="loginNameRef"
        hide-bottom-space
        v-model="regForm.loginName"
        label="用户名"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '请输入用户名']"
        color="white"
    >
      <template v-slot:prepend>
        <q-icon color="bright" name="person_outline"/>
      </template>
    </q-input>

    <q-input
        ref="pwdRef"
        hide-bottom-space
        v-model="regForm.password"
        label="密码"
        lazy-rules
        :type="isPwd ? 'password' : 'text'"
        :rules="[
              (val) => (val && val.length > 0) || '请输入密码',
              (val) =>
                (val.length > 5 && val.length <= 12) ||
                '密码长度为 6 到 12'
            ]"
        color="white"
    >
      <template v-slot:prepend>
        <q-icon color="bright" name="lock_open"/>
      </template>
      <template v-slot:append>
        <q-icon color="bright"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <div v-if="regForm.password" class="password-str-div">
            <span
                :class="{
                'weak-pwd': pwdStrength == 'weak',
                'normal-pwd': pwdStrength == 'normal',
                'strong-pwd': pwdStrength == 'strong'
              }"
            >弱</span
            >
      <span
          :class="{
                'normal-pwd': pwdStrength == 'normal',
                'strong-pwd': pwdStrength == 'strong'
              }"
      >好</span
      >
      <span :class="{ 'strong-pwd': pwdStrength == 'strong' }"
      >强</span
      >
    </div>

    <q-input
        ref="confirmPwdRef"
        hide-bottom-space
        :type="isCfmPwd ? 'password' : 'text'"
        v-model="regForm.confirmPwd"
        label="确认密码"
        lazy-rules
        :rules="[
              (val) => (val && val.length > 0) || '请输入确认密码',
              (val) => val === regForm.password || '密码不一样',
              (val) =>
                (val.length > 5 && val.length <= 12) ||
                '密码长度为 6 到 12'
            ]"
        color="white"
    >
      <template v-slot:prepend>
        <q-icon color="bright" name="lock_open"/>
      </template>
      <template v-slot:append>
        <q-icon color="bright"
                :name="isCfmPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isCfmPwd = !isCfmPwd"
        />
      </template>
    </q-input>


    <q-input
        ref="telRef"
        hide-bottom-space
        v-model="regForm.telephone"
        label="电话号码"
        lazy-rules
        clearable
        :rules="[
            (val) => (val && val.length > 7) || '请输入有效的电话号码',
            isValidCnPhone
          ]"
        color="white"
    >
      <template v-slot:prepend>
        <q-icon color="bright" name="smartphone"/>
      </template>
      <template v-slot:append>
        <q-btn label="获取验证码" color="brightbtn" @click="openPhoneVeriDialog()"/>
      </template>
    </q-input>

    <q-input
        v-show="regForm.smsCodeId"
        ref="phoneVerificationRef"
        hide-bottom-space
        type="text"
        v-model="regForm.smsCode"
        label="手机验证码"
        lazy-rules
        color="white"
        maxlength="6"
        :rules="[
        (val) => (val && val.length > 3) || '请输入手机验证码'
      ]"
    >
      <template v-slot:prepend>
        <q-icon color="bright" name="shield"/>
      </template>
    </q-input>


    <!--    <q-input-->
    <!--      ref="emailRef"-->
    <!--      type="email"-->
    <!--      hide-bottom-space-->
    <!--      v-model="regForm.email"-->
    <!--      label="电子邮件"-->
    <!--      lazy-rules-->
    <!--      :rules="[-->
    <!--        (val) => (val && val.length > 0) || '请输入电子邮件',-->
    <!--        isValidEmail-->
    <!--      ]"-->
    <!--      color="white"-->
    <!--    >-->
    <!--      <template v-slot:prepend>-->
    <!--        <q-icon color="bright" name="mail_outline"/>-->
    <!--      </template>-->
    <!--    </q-input>-->
    <q-input
        ref="verificationRef"
        hide-bottom-space
        type="text"
        v-model="regForm.captchaCode"
        label="验证码"
        lazy-rules
        color="white"
        :rules="[
        (val) => (val && val.length > 3) || '请输入验证码'
      ]"
    >
      <template v-slot:append>
        <img :src="verificationImg" @click="getCode()"/>
      </template>
      <template v-slot:prepend>
        <q-icon color="bright" name="security"/>
      </template>
    </q-input>

    <q-input
        ref="affiliateCodeRef"
        hide-bottom-space
        v-model="regForm.affiliateCode"
        label="推荐码"
        hint="若不是合营下会员无需填写"
    >
      <template v-slot:prepend>
        <img src="../assets/images/login/login_name.png" width="20"/>
      </template>
    </q-input>

    <div class="row justify-between items-center">
      <q-btn @click.prevent="onSubmit" type="submit" class="q-mt-lg" label="注册" width="100%" color="brightbtn"
             style="width: 100%;" rounded/>

    </div>
  </q-form>

  <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss no-esc-dismiss>
    <q-card width="100%">
      <q-card-section
          style="padding: 10px 5px"
          class="q-pa-md bg-brightbtn text-white"
      >
        <q-toolbar>
          <q-toolbar-title>验证码</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close"/>
        </q-toolbar>

      </q-card-section>
      <div style="padding: 20px">
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
        <q-btn @click="onCaptchaSubmit" label="发送验证码" color="brightbtn"/>
      </div>
    </q-card>
  </q-dialog>

</template>

<script>
import {defineComponent, ref, reactive, onMounted, watch} from "vue";
import {api} from "boot/axios";
import {useQuasar, Platform} from "quasar";
import {useRoute, useRouter} from "vue-router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {userStore} from "stores/index";
import qs from "qs";

export default defineComponent({
  name: "RegisterPage",
  setup() {
    onMounted(() => {
      getCode();
      getReferralCode();
    });
    const store = userStore();
    const verificationImg = ref("");
    const isValidName = () => {
      const namePattern = /^([\u4e00-\u9fa5]*)$/;
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
      // email: "",
      captchaCode: "",
      regHost: location.hostname,
      codeId: "",
      affiliateCode: "",
      smsCodeId: "",
      smsCode: ""
    });
    const getCode = () => {
      api
          .get("/member/verificationCode")
          .then((response) => {
            if (response.code === 0) {
              verificationImg.value =
                  "data:image/png;base64," + response.data.img;
              regForm.codeId = response.data.id;
              regForm.captchaCode = "";
            }
          })
          .catch((e) => {
            console.log(e)
          });
    };

    const getInnerCode = () => {
      api
          .get("/member/verificationCode")
          .then((response) => {
            if (response.code === 0) {
              phoneVerificationImg.value =
                  "data:image/png;base64," + response.data.img;
              innerCodeId.value = response.data.id;
              innerCaptchaRef.value = "";
            }
          })
          .catch((e) => {
            console.log(e)
          });
    }

    const getReferralCode = () => {
      const refCode = sessionStorage.getItem("REFERRAL_CODE");
      if (refCode) {
        regForm.referrer = refCode;
      }
    }
    const loginNameRef = ref();
    const pwdRef = ref();
    const confirmPwdRef = ref();
    const telRef = ref();
    const emailRef = ref();
    const verificationRef = ref();
    const phoneVerificationRef = ref();
    const $q = useQuasar();
    const route = useRoute();

    const pwdStrength = ref("");
    const isValidEmail = () => {
      const emailPattern =
          /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(regForm.email) || "请输入有效电子邮件";
    };

    const isValidCnPhone = () => {
      const phonePattern =
          /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      return phonePattern.test(regForm.telephone) || "请输入有效的电话号码";

    }

    const router = useRouter();
    const onSubmit = () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();
      confirmPwdRef.value.validate();
      telRef.value.validate();
      phoneVerificationRef.value.validate();
      // emailRef.value.validate();
      verificationRef.value.validate();
      $q.loading.show({
        message: "注册中"
      });
      if (
          loginNameRef.value.hasError ||
          pwdRef.value.hasError ||
          confirmPwdRef.value.hasError ||
          telRef.value.hasError ||
          phoneVerificationRef.value.hasError ||
          // emailRef.value.hasError ||
          verificationRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
        var qs = require("qs")
        const fpPromise = FingerprintJS.load();
        (async () => {
          const fp = await fpPromise;
          const result = await fp.get();
          const excludes = {value: ["timezone", "timeZoneOffset"]};
          const allComponents = {...result.components};
          excludes.value.forEach((element) => {
            delete allComponents[element];
          });
          const sidParam = FingerprintJS.hashComponents(allComponents);
          regForm.sid = sidParam;
          regForm.regDevice = $q.platform.is.mobile ? "H5" : "WEB";
          if ($q.platform.is.capacitor) {
            if ($q.platform.is.android) {
              regForm.regDevice = "ANDROID";
            } else if ($q.platform.is.ios) {
              regForm.regDevice = "IOS";
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
                  $q.notify({
                    color: "positive",
                    position: "top",
                    message: "注册成功",
                    icon: "check_circle_outline"
                  });
                  store.autoLogin(res.data);
                  sessionStorage.removeItem("REFERRAL_CODE");
                  if (store.hasToken()) {
                    const jumpUrl = route.query.redirect
                        ? route.query.redirect
                        : "/";
                    router.go(jumpUrl);
                    if (Platform.is.capacitor && Platform.is.ios) {
                      location.reload();
                    }
                  }

                  sessionStorage.removeItem("REFERRAL_CODE");
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
    }

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
      api.post(`/otp/sendSms`, qs.stringify({
        telephone: regForm.telephone,
        captchaCode: innerCaptchaRef.value,
        codeId: innerCodeId.value
      }))
          .then(res => {
            let message = res.message || '发送手机验证码成功',
                color = 'positive'

            if (res.code === 0) {
              showCaptchaDialog.value = false;
              regForm.smsCode = "";
              regForm.smsCodeId = res.data.codeId;
              console.log(res.data.codeId)
            } else {
              color = 'negative';
              getInnerCode();
            }

            if (message) {
              $q.notify({message, color});
            }

            console.log('onCaptchaSubmit', res)
          }).catch(() => {
        getInnerCode();
      })
    }


    return {
      header: "注册账号",
      regForm,
      verificationImg,
      loginNameRef,
      pwdRef,
      confirmPwdRef,
      telRef,
      emailRef,
      verificationRef,
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
      phoneVerificationImg,
      openPhoneVeriDialog,
      phoneVerificationRef,
      isValidCnPhone
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
.page-header {
  background-image: linear-gradient(to right, #de4545, #db7e42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 28px;
  text-align: center;
  font-family: Wave;
  padding: 10px;
  display: flex;
  gap: 20px;
  align-content: center;
  justify-content: center;
}

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
    font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial,
    sans-serif;
  }

  span.weak-pwd {
    background: var(--q-negative);
  }

  span.normal-pwd {
    background: var(--q-warning);
    color: var(--q-primary);
  }

  span.strong-pwd {
    //background: linear-gradient(to right, #de4545, #db7e42) !important;
    background: var(--q-positive);
    font-weight: 600;
  }
}

.q-toolbar {
  background: #33bcd4;
}

</style>
