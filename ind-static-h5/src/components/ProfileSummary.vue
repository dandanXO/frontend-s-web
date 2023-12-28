<template>
  <div style="height: 80px"></div>
  <div class="infoboard-container" :class="!homeProfile && 'q-pa-md'">
    <img src="../assets/images/earn-money/infoboard.png" v-if="!homeProfile" />
    <div class="infoboard-wrapper" :class="homeProfile && 'home-profile'">
      <div class="profile-wrapper-extra">
        <div class="logo-img">
          <img src="../assets/logo.png" />
        </div>
      </div>
      <div class="profile-wrapper" v-if="store.hasToken()">
        <div class="profile-details-container">
          <template v-if="!homeProfile">
            <div class="profile-rating">
              <img src="../assets/images/index/profile-rating-off.png" alt="" />
              <img src="../assets/images/index/profile-rating-off.png" alt="" />
              <img src="../assets/images/index/profile-rating-off.png" alt="" />
            </div>
            <div class="profile-agency">
              <div class="profile-agency-lbl">Agency Level:</div>
              <div class="profile-agency-val">1</div>
            </div>
          </template>

          <template v-else>
            <div class="flex-c-start">
              <div :class="`profile-balance ${isLoadingBalance ? 'active' : ''}`" @click="refreshBalance()">
                <span class="balance-amount">
                  <span style="font-family: 'Times New Roman', Times, serif">{{ store.currency.value }}</span>
                  {{ isLoadingBalance ? "Loading..." : store.balance.toFixed(2) }}
                </span>

                <div @click="refreshBalance()" class="btn-refresh">
                  <q-icon name="sync" size="16px" color="white-7"></q-icon>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div>
          <q-btn square class="style-blue-btn" icon="add" dense @click="router.push('/deposit')" />
        </div>
        <!-- <div class="profile-msg btn-effect" v-if="homeProfile">
          <q-icon name="mail" size="40px" color="yellow-7" @click="router.push('/account/message')" />
          <q-chip v-if="store.unreadInboxMail" class="notification" color="red" size="xs"></q-chip>
        </div> -->
        <q-btn-dropdown no-caps :ripple="false">
          <template v-slot:label>
            <div class="profile-pic">
              <q-avatar size="50px">
                <img :src="profileImagePath" />
              </q-avatar>
              <div class="profile-pic-frame" v-if="!homeProfile"></div>

              <div class="vip-details">
                <img src="../assets/images/index/vip-row.png" alt="" />
                <div class="vip-level">
                  {{ store.vip }}
                </div>
              </div>
            </div>
          </template>

          <q-list style="background: #303954" dense>
            <q-item clickable v-close-popup @click="onVipClick">
              <q-item-section avatar>
                <q-avatar icon="diamond" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>VIP</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="router.push('/account/message')">
              <q-item-section avatar>
                <q-avatar icon="mail" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Message</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="router.push('/account/order')">
              <q-item-section avatar>
                <q-avatar icon="receipt" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Order</q-item-label>
              </q-item-section>
            </q-item>

            <hr />

            <q-item clickable v-close-popup @click="router.push('/account/bank')">
              <q-item-section avatar>
                <q-avatar icon="account_balance" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Bank</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="onLogout()">
              <q-item-section avatar>
                <q-avatar icon="logout" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Log out</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <div class="profile-wrapper" v-else>
        <q-btn class="btn-style-purple" no-caps @click="router.push('/register')">Register</q-btn>
        <q-btn no-caps @click="openLoginModal">Login</q-btn>
      </div>
    </div>
  </div>

  <q-dialog width="100%" v-model="isLoginModal">
    <q-card class="login-dialog-card">
      <q-card-section class="login-card-section">
        <div class="section-logo">
          <img src="../assets/ind-win-7-logo.png" />
        </div>

        <div class="section-title">User Log in Page</div>

        <q-form ref="loginFormRef" @submit="onSubmit">
          <div v-if="!loginType" class="login-form-grid">
            <span class="login-form-field-label">Phone Number</span>
            <q-input
              hide-bottom-space
              ref="loginNameRef"
              v-model="loginForm.loginName"
              :rules="[
                (val) => (val && val.length > 0) || 'Please insert Phone number',
                (val) => (val.length >= 7 && val.length <= 12) || 'The phone number must be between 7 and 12'
              ]"
              label-color="brand"
              autocomplete="username"
              outlined
              color="white"
              class="landing-input login-form-field"
            ></q-input>

            <span class="login-form-field-label">Password</span>
            <q-input
              ref="passwordRef"
              hide-bottom-space
              v-model="loginForm.password"
              :type="isPwd ? 'password' : 'text'"
              :rules="[(val) => (val && val.length > 0) || 'Please insert password']"
              label-color="brand"
              autocomplete="current-password"
              outlined
              color="white"
              class="landing-input login-form-field"
            >
              <template v-slot:append>
                <q-icon
                  color="gray-3"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>

          <div class="forgot-password">
            <router-link class="form-text" to="/forgot-password">Forgot Password</router-link>
          </div>

          <div>
            <q-btn @click.prevent="onSubmit" type="submit" class="login-btn" label="Login" rounded no-caps />
          </div>
        </q-form>

        <hr class="end-of-form-separator" />

        <div class="create-account">
          <span class="form-text">Not a member?</span>
          &nbsp;
          <router-link class="form-text" to="/register" style="color: #ffffff">Create account</router-link>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { api } from "boot/axios";

const props = defineProps(["homeProfile"]);
const route = useRoute();
const router = useRouter();
const store = userStore();

const profileImg = [
  {
    imgPath: ["profile-pic"]
  }
];
const randomProfileImg = computed(() => {
  const storedImg = sessionStorage.getItem("PROFILE_IMG");
  if (storedImg) {
    return storedImg;
  } else {
    const randomProfile = profileImg[0];
    const randomIndex = Math.floor(Math.random() * randomProfile.imgPath.length);
    const imgPath = randomProfile.imgPath[randomIndex];
    sessionStorage.setItem("PROFILE_IMG", imgPath);
    return imgPath;
  }
});

const profileImagePath = computed(() => {
  return require(`../assets/images/account/${randomProfileImg.value}.png`);
});

const isLoadingBalance = ref(false);
const refreshBalance = () => {
  if (store.token) {
    isLoadingBalance.value = true;
    store.getBalance().then((res) => {
      isLoadingBalance.value = false;
    });
  }
};

const onVipClick = () => {
  router.push({ path: "/vip", query: { redirect: route.path } });
};

const onLogout = () => {
  store.memberLogout().then(() => {
    // location.reload();
    router.push("/home");
  });
};

// Login
const isLoginModal = ref(false);

const openLoginModal = () => {
  console.log("open login");
  isLoginModal.value = true;
};

const isPwd = ref(true);

const verificationImg = ref("");
const loginForm = reactive({
  loginName: "",
  password: "",
  captchaCode: "0000",
  codeId: ""
});
const phoneLoginForm = reactive({
  phoneNumber: "",
  code: "",
  smsCodeId: ""
});
const $q = useQuasar();
const loginType = ref(false);
const loginFormRef = ref();
const loginNameRef = ref();
const passwordRef = ref();
const verificationRef = ref();
const getCode = () => {
  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        verificationImg.value = "data:image/png;base64," + response.data.img;
        loginForm.codeId = response.data.id;
      }
    })
    .catch((e) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: e.message,
        icon: "report_problem"
      });
    });
};

const isCheckRmb = ref(false);

const phoneVerificationRef = ref();
const telephoneRef = ref();
const phoneVerificationImg = ref("");

const innerCaptchaRef = ref("");
const innerCaptchaCodeId = ref("");
const showCaptchaDialog = ref(false);
const toggleInnerCode = () => {
  telephoneRef.value.validate();
  if (!telephoneRef.value.hasError) {
    showCaptchaDialog.value = true;
    getInnerCode();
  }
};

const isValidCnPhone = () => {
  const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  return phonePattern.test(phoneLoginForm.phoneNumber) || "请输入有效的电话号码";
};

const getInnerCode = () => {
  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        phoneVerificationImg.value = "data:image/png;base64," + response.data.img;
        innerCaptchaCodeId.value = response.data.id;
        innerCaptchaRef.value = "";
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const sendOtpSms = () => {
  if (!phoneLoginForm.phoneNumber) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "手机号码不能为空",
      icon: "report_problem"
    });
    return;
  }
  api
    .post(
      `/otp/sendSms`,
      qs.stringify({
        telephone: phoneLoginForm.phoneNumber,
        captchaCode: innerCaptchaRef.value,
        codeId: innerCaptchaCodeId.value
      })
    )
    .then((res) => {
      getCode();
      let message = res.message || "Phone verification code sent successfully",
        color = "positive";

      if (res.code === 0) {
        showCaptchaDialog.value = false;
        phoneLoginForm.smsCodeId = res.data.codeId;
        phoneLoginForm.code = "";
        console.log(res.data.codeId);
      } else {
        color = "negative";
        getInnerCode();
      }

      if (message) {
        $q.notify({ message, color });
      }

      console.log("onCaptchaSubmit", res);
    })
    .catch(() => {
      console.log("Err");
      getInnerCode();
    });
};

const goRegister = () => {
  router.push("/register");
};

const onSubmit = () => {
  $q.loading.show({
    message: "Logging in"
  });
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

    if (loginType.value === false) {
      loginNameRef.value.validate();
      passwordRef.value.validate();
      // verificationRef.value.validate();
      $q.loading.show({
        message: "Logging in"
      });
      // || verificationRef.value.hasError
      if (loginNameRef.value.hasError || passwordRef.value.hasError) {
        $q.loading.hide();
      } else {
        store
          .memberLogin({
            loginName: loginForm.loginName,
            password: loginForm.password,
            sid: store.aaid ? store.aaid : sidParam,
            captchaCode: loginForm.captchaCode,
            codeId: loginForm.codeId
          })
          .then(() => {
            $q.loading.hide();
            getCode();
            sessionStorage.removeItem("REFERRAL_CODE");

            if (isCheckRmb.value) {
              localStorage.setItem(
                "userpass",
                JSON.stringify({
                  loginName: loginForm.loginName,
                  password: loginForm.password
                })
              );
            } else {
              localStorage.removeItem("userpass");
            }

            loginFormRef.value.reset();

            if (store.hasToken()) {
              const jumpUrl = route.query.redirect ? route.query.redirect : "/home";
              router.go(jumpUrl);
            }
          })
          .catch((error) => {
            loginForm.captchaCode = "0000";
            getCode();
            $q.loading.hide();
          });
      }
    } else {
      telephoneRef.value.validate();
      phoneVerificationRef.value.validate();
      $q.loading.show({
        message: "Logging in"
      });
      if (telephoneRef.value.hasError || phoneVerificationRef.value.hasError) {
        $q.loading.hide();
      } else {
        store
          .memberLoginviaPhone({
            phoneNumber: phoneLoginForm.phoneNumber,
            sid: sidParam,
            code: phoneLoginForm.code,
            smsCodeId: phoneLoginForm.smsCodeId
          })
          .then(() => {
            $q.loading.hide();
            sessionStorage.removeItem("REFERRAL_CODE");
            loginFormRef.value.reset();
            if (store.hasToken()) {
              const jumpUrl = route.query.redirect ? route.query.redirect : "/";
              router.go(jumpUrl);
            }
          })
          .catch((error) => {
            $q.loading.hide();
          });
      }
    }
  })();
};

const checkRememberPwd = () => {
  const d = localStorage.getItem("userpass");
  let rememberJson = JSON.parse(d);
  if (rememberJson) {
    isCheckRmb.value = true;
    loginForm.loginName = rememberJson.loginName;
    loginForm.password = rememberJson.password;
  }
};

const backHome = () => {
  router.push("/");
};

const guestLoginInfo = reactive({
  sid: "",
  way: "ANDROID"
});

const affQuickRegEvent = ref("");

const guestLogin = () => {
  $q.loading.show({
    message: "Playing as guest"
  });

  (async () => {
    // guestLoginInfo.sid = guestDeviceInfo.value;
    guestLoginInfo.sid = store.getAaid();

    api
      .post("/member/quickRegister", qs.stringify(guestLoginInfo))
      .then((ret) => {
        const res = ret;
        console.log("res:", res);

        if (res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "Quick registered successfully",
            icon: "check_circle_outline"
          });

          //ADJUST TRACKEVENT.
          if (Platform.is.android && Platform.is.capacitor) {
            affQuickRegEvent.value = sessionStorage.getItem("AFFILIATE_QUICK_REGISTER_EVENT");
            var adjustEvent = new AdjustEvent(affQuickRegEvent.value);
            // alert(affQuickRegEvent.value);
            Adjust.trackEvent(adjustEvent);
          } else {
            const AdjustWeb = require("@adjustcom/adjust-web-sdk");
            // AdjustWeb.trackEvent({
            //   eventToken: "vm6pjs"
            // });
          }

          store.autoLogin(res.data);
          sessionStorage.removeItem("REFERRAL_CODE");
          if (store.hasToken()) {
            router.push("/home");
          }
        } else if (res.code === 1010) {
          $q.notify({
            color: "warning",
            position: "top",
            message: "Please login with password to continue",
            icon: "report_problem"
          });
          router.push("/login");
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
    // getCode();
  })();
};

const guestDeviceInfo = ref("");

const getAppInfo = async () => {
  const info = await Device.getId();
  guestDeviceInfo.value = info.identifier;
  // guestDeviceInfo.value = store.aaid;
};

onMounted(() => {
  if (!sessionStorage.getItem("PROFILE_IMG")) {
    const randomProfile = profileImg[0];
    const randomIndex = Math.floor(Math.random() * randomProfile.imgPath.length);
    const imgPath = randomProfile.imgPath[randomIndex];
    sessionStorage.setItem("PROFILE_IMG", imgPath);
  }
});
</script>

<style scoped lang="scss">
.infoboard-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(180deg, #2d0f54 0%, #101114 100%);
  box-shadow: 0px -3px 7px 0px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;

  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;

  .infoboard-wrapper {
    position: absolute;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
    // width: 22rem;
    width: 100%;
    margin: 0;

    &.home-profile {
      position: relative;
      width: 100%;
      gap: 0;
      justify-content: space-between;
      padding: 0 12px;

      .profile-pic {
        margin-top: -20px;
        margin-right: 20px;
      }
    }
  }

  .profile-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    width: 100%;

    .profile-pic {
      position: relative;
      margin: 6px 6px 6px 12px;
    }
    .profile-pic-frame {
      background-image: url(../assets/images/common/profile-frame.png);
      width: 70px;
      height: 70px;
      background-size: 100%;
      position: absolute;
      top: -8px;
      left: -4px;
    }

    .profile-details-container {
      display: flex;
      flex-direction: column;
      font-size: 16px;
    }
    .profile-name {
      display: flex;
      align-items: center;
      line-height: 1;
      gap: 10px;
    }
    .profile-agency {
      display: flex;
      gap: 0.75rem;

      .profile-agency-lbl {
        color: rgba(255, 255, 255, 0.5);
      }
    }
    .profile-rating {
      display: flex;
      gap: 6px;
      img {
        display: block;
        width: 20px;
      }
    }
    .profile-balance {
      position: relative;
      // background: rgba(255, 255, 255, 0.24);
      background: rgba(103, 38, 154, 0.9);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      // margin-bottom: 10px;
      padding-top: 2px;
      padding-bottom: 2px;
      width: 130px;

      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      font-weight: bold;
      &:active {
        filter: brightness(0.75);
      }

      .balance-amount {
        padding-right: 18px;
      }
    }
    .profile-msg {
      margin-left: auto;
      position: relative;

      .notification {
        position: absolute;
        top: -0.25rem;
        left: -0.5rem;
      }
    }
  }

  .profile-wrapper-extra {
    display: flex;
    align-items: center;
    padding-top: 16px;
    width: 100%;
  }

  .logo-img {
    width: 100%;
    margin: 0 auto;

    img {
      max-width: 100px;
      width: 100%;
      text-align: center;
    }
  }

  img {
    width: 30rem;
  }
}

.vip-details {
  position: relative;
  margin-left: 20px;
  margin-bottom: 5px;
  margin-top: -10px;
  img {
    display: block;
    width: 100px;
    position: absolute;
    top: -17px;
    left: -45px;
  }

  .vip-level {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    line-height: 1.1;
    padding-top: 2px;
    padding-bottom: 4px;
    z-index: 3;
    color: #334ad6;
    font-weight: bold;
  }
}

.vip-chevron {
  position: absolute;
  top: 25px;
  right: -25px;
}

.btn-refresh {
  position: absolute;
  top: 0;
  right: 10px;
}

.style-blue-btn {
  background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
  border-radius: 5px;
}

.login-dialog-card {
  width: 90%;
  max-width: 500px;
  margin: 0 auto;
  // padding-top: 70px;
  background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
  border-radius: 10px;
  padding: 40px 20px 20px;

  .login-card-section {
  }

  .section-logo {
    justify-content: center;
    display: flex;
    position: fixed;
    width: 100%;
    margin-top: -100px;
    left: 0;
  }
  .section-title {
    font-size: 22px;
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .login-form-logo-img {
    img {
      display: block;
      width: 95%;
      margin: 20px auto;
      max-width: 200px;
    }
  }
  .login-form-grid {
    display: grid;
    grid-auto-flow: row;
    gap: 7px;

    .login-form-field-label {
      margin-top: 15px;
    }
  }
  .login-btn {
    background: linear-gradient(188deg, rgba(255, 255, 255, 0.8) 5.77%, #8eb5ff 93.57%);
    color: #4a38b9;
    width: 100%;
    height: 56px;
    border-radius: 4px;
    margin-top: 30px;
    font-weight: bold;
    font-size: 16px;
  }
  .forgot-password {
    margin: 8px 0px 0px;
    text-align: right;
  }

  .end-of-form-separator {
    margin: 35px 0px 0px;
    border-color: #ffffff26;
  }

  .create-account {
    margin: 20px 0px;
    text-align: center;
  }
  .form-text {
    color: #b3b0b8;
    text-decoration: none;
  }

  .tip-container {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    padding-bottom: 24px;
  }

  .landing-tip {
    color: #fae576;
    text-decoration: none;
    font-weight: 700;
  }

  .landing-input {
    :deep(.q-field__control) {
      padding-left: 20px;
      padding-right: 20px;
    }
    :deep(.q-field__control):before {
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.15);
      border-width: 2px;
    }
  }
}
</style>

<style lang="scss">
.q-btn-dropdown--simple * + .q-btn-dropdown__arrow {
  margin-left: -12px !important;
}

.q-btn-dropdown--simple {
  width: 80px !important;
}
</style>
