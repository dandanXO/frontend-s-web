<template>
  <div class="page-header q-mb-md">
    <div class="page">{{ header }}</div>
  </div>
  <q-tabs v-model="tabActive" class="form-wrapped">
    <q-tab name="username" label="Username" />
    <q-tab name="mobile" label="Mobile" />
  </q-tabs>
  <q-separator />
  <q-tab-panels v-model="tabActive" animated>
    <q-tab-panel name="username">
      <div>
        <q-form
          class="q-gutter-y-md rounded-borders q-pa-md bg-primary q-ma-md"
          @submit="onSubmit"
        >
          <q-input
            ref="loginNameRef"
            filled
            v-model="regForm.loginName"
            label="Login name"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter a login name',
              (val) =>
                val.match(/^[A-Za-z0-9]+$/) ||
                'Only alphabets and numbers are allowed'
            ]"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="person_outline" />
            </template>
          </q-input>
      
          <q-input
            ref="pwdRef"
            filled
            v-model="regForm.password"
            label="Password"
            lazy-rules
            :type="isPwd ? 'password' : 'text'"
            :rules="[
              (val) => (val && val.length > 0) || 'Password is required',
              (val) =>
                (val.length > 5 && val.length <= 12) ||
                'The password length should be between 6-12',
              (val) =>
                (val && (pwdStrength == 'normal' || pwdStrength == 'strong')) ||
                'The level of password security must be at least good.'
            ]"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="lock_open" />
            </template>
            <template v-slot:append>
              <q-icon
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
              >Weak</span
            >
            <span
              :class="{
                'normal-pwd': pwdStrength == 'normal',
                'strong-pwd': pwdStrength == 'strong'
              }"
              >Good</span
            >
            <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">Strong</span>
          </div>
      
          <q-input
            ref="confirmPwdRef"
            filled
            :type="isCfmPwd ? 'password' : 'text'"
            v-model="regForm.confirmPwd"
            label="Confirm Password"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please confirm your password.',
              (val) => val === regForm.password || 'Passwords are not the same',
              (val) =>
                (val.length > 5 && val.length <= 12) ||
                'The password length should be between 6-12'
            ]"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="lock_open" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isCfmPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isCfmPwd = !isCfmPwd"
              />
            </template>
          </q-input>
          <q-input
            ref="realNameRef"
            filled
            v-model="regForm.realName"
            label="Real name"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please enter a real name']"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="person_outline" />
            </template>
          </q-input>
          <!-- <q-input ref="birthdayRef" filled v-model="regForm.birthday" placeholder="Birthday"
                        :rules="[
                          (val) => (val && val.length > 0) || 'Please enter your birthday'
                        ]">
                      <template v-slot:prepend>
                        <q-icon name="cake" />
                      </template>
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date v-model="regForm.birthday" mask="YYYY-MM-DD">
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Close"
                                    color="primary"
                                    flat
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input> -->
          <q-input
            ref="telRef"
            filled
            v-model="regForm.telephone"
            label="Mobile Number"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter a phone number',
              (val) => (val && val.length > 7) || 'Please enter a valid phone number',
              isValidPhone
            ]"
            color="white"
          >
            <template v-slot:append>
              <q-btn
                :label="isOtpSending ? 'Sending' : 'Send OTP'"
                :disabled="isOtpSending || regForm.telephone === '' || disable30Sec"
                :style="isOtpSending || regForm.telephone === '' || disable30Sec ? 'opacity: .6; cursor: not-allowed' : ''"
                class="common-btn verification-btn"
                @click="getOtpCode"
              />
            </template>
            <template v-slot:prepend>
              <q-icon name="smartphone" />
              <span style="color: white; font-size: 16px;">&nbsp;+63</span>
            </template>
          </q-input>
          <q-input
            ref="otpCodeRef"
            filled
            v-model="regForm.otpCode"
            label="OTP Code"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter the OTP Code'
            ]"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="security" />
            </template>
          </q-input>
          <q-input
            ref="emailRef"
            type="email"
            filled
            v-model="regForm.email"
            label="Email"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter a valid email',
              isValidEmail
            ]"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="mail_outline" />
            </template>
          </q-input>
          <q-input
            ref="verificationRef"
            filled
            type="text"
            v-model="regForm.captchaCode"
            label="Verification Code"
            lazy-rules
            color="white"
            :rules="[
              (val) => (val && val.length > 3) || 'Please enter the verification code'
            ]"
          >
            <template v-slot:append>
              <img :src="verificationImg" />
            </template>
            <template v-slot:prepend>
              <q-icon name="security" />
            </template>
          </q-input>
      
          <div class="row justify-between items-center">
            <q-btn
              @click.prevent="onSubmit"
              label="Register"
              type="submit"
              color="brand"
            />
          </div>
        </q-form>
      </div>
    </q-tab-panel>
    <q-tab-panel name="mobile">
      <div>
        <q-form
          class="q-gutter-y-md rounded-borders q-pa-md bg-primary q-ma-md"
          @submit="onSubmit"
        >
          <q-input
            ref="telRef"
            filled
            v-model="regForm.telephone"
            label="Mobile Number"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter a phone number',
              (val) => (val && val.length > 7) || 'Please enter a valid phone number',
              isValidPhone
            ]"
            color="white"
          >
            <template v-slot:append>
              <q-btn
                :label="isOtpSending ? 'Sending' : 'Send OTP'"
                :disabled="isOtpSending || regForm.telephone === '' || disable30Sec"
                :style="isOtpSending || regForm.telephone === '' || disable30Sec ? 'opacity: .6; cursor: not-allowed' : ''"
                class="common-btn verification-btn"
                @click="getOtpCode"
              />
            </template>
            <template v-slot:prepend>
              <q-icon name="smartphone" />
              <span style="color: white; font-size: 16px;">&nbsp;+63</span>
            </template>
          </q-input>
          <q-input
            ref="otpCodeRef"
            filled
            v-model="regForm.otpCode"
            label="OTP Code"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter the OTP Code'
            ]"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="security" />
            </template>
          </q-input>
          <q-input
            ref="pwdRef"
            filled
            v-model="regForm.password"
            label="Password"
            lazy-rules
            :type="isPwd ? 'password' : 'text'"
            :rules="[
              (val) => (val && val.length > 0) || 'Password is required',
              (val) =>
                (val.length > 5 && val.length <= 12) ||
                'The password length should be between 6-12',
              (val) =>
                (val && (pwdStrength == 'normal' || pwdStrength == 'strong')) ||
                'The level of password security must be at least good.'
            ]"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="lock_open" />
            </template>
            <template v-slot:append>
              <q-icon
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
              >Weak</span
            >
            <span
              :class="{
                'normal-pwd': pwdStrength == 'normal',
                'strong-pwd': pwdStrength == 'strong'
              }"
              >Good</span
            >
            <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">Strong</span>
          </div>
      
          <q-input
            ref="confirmPwdRef"
            filled
            :type="isCfmPwd ? 'password' : 'text'"
            v-model="regForm.confirmPwd"
            label="Confirm Password"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please confirm your password.',
              (val) => val === regForm.password || 'Passwords are not the same',
              (val) =>
                (val.length > 5 && val.length <= 12) ||
                'The password length should be between 6-12'
            ]"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="lock_open" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isCfmPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isCfmPwd = !isCfmPwd"
              />
            </template>
          </q-input>
          <q-input
            ref="realNameRef"
            filled
            v-model="regForm.realName"
            label="Real name"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please enter a real name']"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="person_outline" />
            </template>
          </q-input>
          <!-- <q-input ref="birthdayRef" filled v-model="regForm.birthday" placeholder="Birthday"
                        :rules="[
                          (val) => (val && val.length > 0) || 'Please enter your birthday'
                        ]">
                      <template v-slot:prepend>
                        <q-icon name="cake" />
                      </template>
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date v-model="regForm.birthday" mask="YYYY-MM-DD">
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Close"
                                    color="primary"
                                    flat
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input> -->
      
          <q-input
            ref="emailRef"
            type="email"
            filled
            v-model="regForm.email"
            label="Email"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter a valid email',
              isValidEmail
            ]"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="mail_outline" />
            </template>
          </q-input>
          <q-input
            ref="verificationRef"
            filled
            type="text"
            v-model="regForm.captchaCode"
            label="Verification Code"
            lazy-rules
            color="white"
            :rules="[
              (val) => (val && val.length > 3) || 'Please enter the verification code'
            ]"
          >
            <template v-slot:append>
              <img :src="verificationImg" />
            </template>
            <template v-slot:prepend>
              <q-icon name="security" />
            </template>
          </q-input>
      
          <div class="row justify-between items-center">
            <q-btn
              @click.prevent="onSubmit"
              label="Register"
              type="submit"
              color="brand"
            />
          </div>
        </q-form>
      </div>
    </q-tab-panel>
  </q-tab-panels>
  
  <div class="text-center q-mb-md">
    <router-link class="forget-pwd-tip" to="/login">
      Already a member ? Login Now
    </router-link>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default defineComponent({
  name: "RegisterPage",
  setup() {
    const store = userStore();
    onMounted(() => {
      getCode();
    });
    const isOtpSending = ref(false)
    const disable30Sec = ref(false)
    const verificationImg = ref("");
    const tabActive = ref("username");
    const regForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      realName: "",
      telephone: "",
      email: "",
      captchaCode: "",
      regHost: location.hostname,
      codeId: "",
      otpCodeId: "",
      otpCode: "",
    });
    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((res) => {
          const response = res.data;
          if (response.code === 0) {
            verificationImg.value =
              "data:image/png;base64," + response.data.img;
            regForm.codeId = response.data.id;
          }
        })
        .catch((e) => {
          message.error(e.message);
        });
    };

    const getOtpCode = () => {
      isOtpSending.value = true
      const telephoneDetails =  {
        telephone: regForm.telephone
      }
      api
        .post("/member/sendOtp", qs.stringify(telephoneDetails))
        .then((res) => {
          const response = res.data;
          if (response.code === 0) {
            regForm.otpCodeId = res.data.codeId;
            disableOtpBtn();
            isOtpSending.value = false
            $q.notify({
              color: "positive",
              position: "top",
              message: "OTP Sent",
              icon: "check_circle_outline"
            });
          }
        })
        .catch((e) => {
          message.error(e.message);
          isOtpSending.value = false
        });
    };
    const loginNameRef = ref();
    const realNameRef = ref();
    const pwdRef = ref();
    const confirmPwdRef = ref();
    const telRef = ref();
    const otpCodeRef = ref();
    // const birthdayRef = ref();
    const emailRef = ref();
    const verificationRef = ref();
    const $q = useQuasar();
    var qs = require("qs");

    const pwdStrength = ref("");
    const isValidEmail = () => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(regForm.email) || "Invalid email";
    };

    const isValidPhone = () => {
      const phonePattern = /^\d+$/;
      return phonePattern.test(regForm.telephone) || "Only numbers are allowed";
    };

    const disableOtpBtn = () => {
      disable30Sec.value = true
      setTimeout(() => disable30Sec.value = false, 30000);
    }
    const resetForm = () => {
      if (regForm.loginName) {
        regForm.loginName = "";
      }
      if (regForm.realName) {
        regForm.realName = "";
      }
      if (regForm.password) {
        regForm.password = "";
      }
      if (regForm.confirmPwd) {
        regForm.confirmPwd = "";
      }
      if (regForm.telephone) {
        regForm.telephone = "";
      }
      if (regForm.otpCode) {
        regForm.otpCode = "";
      }
      if (regForm.email) {
        regForm.email = "";
      }
      if (regForm.captchaCode) {
        regForm.captchaCode = "";
      }
      disable30Sec.value = false;
      isOtpSending.value = false;
    };
    const router = useRouter();
    const onSubmit = () => {
      if (tabActive.value === 'mobile') {
        regForm.loginName = regForm.telephone;
      }
      if (tabActive.value === 'username') {
        loginNameRef.value.validate();
      }
      pwdRef.value.validate();
      confirmPwdRef.value.validate();
      telRef.value.validate();
      otpCodeRef.value.validate();
      // birthdayRef.value.validate();
      emailRef.value.validate();
      verificationRef.value.validate();
      $q.loading.show({
        message: "Registering"
      });
      if (
        (tabActive.value === 'username' && loginNameRef.value.hasError) ||
        realNameRef.value.hasError ||
        pwdRef.value.hasError ||
        confirmPwdRef.value.hasError ||
        telRef.value.hasError ||
        otpCodeRef.value.hasError ||
        // birthdayRef.value.hasError ||
        emailRef.value.hasError ||
        verificationRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
        const fpPromise = FingerprintJS.load();
        (async () => {
          const fp = await fpPromise;
          const result = await fp.get();
          const excludes = { value: ["timezone", "timeZoneOffset"] };
          const allComponents = { ...result.components };
          excludes.value.forEach((element) => {
            delete allComponents[element];
          });
          const sidParam = FingerprintJS.hashComponents(allComponents);
          regForm.sid = sidParam;
          regForm.regDevice = Platform.is.mobile ? "H5" : "WEB";
          if (("standalone" in window.navigator) && window.navigator.standalone) {      
            regForm.regDevice = "IOS"
          } else {
            regForm.regDevice = Platform.is.mobile ? "H5" : "WEB";
            if (Platform.is.capacitor) {
              if (Platform.is.android) {
                regForm.regDevice = "ANDROID"
              }
            }
          }
          api
            .post("/member/register", qs.stringify(regForm))
            .then((ret) => {
              const res = ret.data;
              if (res.code === 0) {
                router.push("/login");
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: "Registration Success",
                  icon: "check_circle_outline"
                });
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
      },
    );
    watch(
      () => tabActive.value,
      () => {
        resetForm();
      }
    );
    return {
      header: "Register Account",
      regForm,
      tabActive,
      verificationImg,
      loginNameRef,
      realNameRef,
      pwdRef,
      confirmPwdRef,
      telRef,
      otpCodeRef,
      // birthdayRef,
      emailRef,
      verificationRef,
      onSubmit,
      isValidEmail,
      isPwd: ref(true),
      isCfmPwd: ref(true),
      getCode,
      pwdStrength,
      isValidPhone,
      isOtpSending,
      getOtpCode,
      disable30Sec,
      disableOtpBtn,
      resetForm
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
.txt-center {
  text-align: center;
  padding: 0 10px;
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
</style>
