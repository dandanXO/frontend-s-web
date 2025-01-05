<template>
  <header class="header-container" :class="scroll > 40 ? 'on-scrolled' : ''">
    <template v-if="ui.edition === EDITION.SLOT">
      <img
        class="header-decoration left"
        src="@/assets/images/home/header-decoration-slot-left.png"
        alt="TF88 slot left ribbon"
      />
      <img
        class="header-decoration right"
        src="@/assets/images/home/header-decoration-slot-right.png"
        alt="TF88 slot right ribbon"
      />
    </template>
    <div class="top-nav-wrapper">
      <div class="top-nav-inner" :class="store.token && 'logged-in-nav'">
        <router-link class="logospon" to="/home">
          <img class="logo" src="../../assets/logo.svg" alt="TF88 logo" />
        </router-link>
        <Navigation />

        <LocaleChanger />

        <div v-if="!store.token" class="right-contents">
          <a class="header-btn btn-color-blue" @click="loginDialogVisible = true">{{ $t("common.login") }}</a>
          <a class="header-btn btn-color-white" :class="ui.edition" @click="registerDialogVisible = true">
            {{ $t("common.register") }}
            <img v-if="ui.edition === EDITION.NORMAL" src="../../assets/home/regbtn_side.png" alt="football" />
            <img v-if="ui.edition === EDITION.SLOT" src="@/assets/home/regbtn-side-slot-edition.png" alt="slot" />
          </a>
        </div>

        <div v-if="store.token" class="profile-actions">
          <router-link to="/center/deposit" class="action-btn">
            <div class="icon-rounded">
              <img src="../../assets/images/home/profile-action-deposit.svg" />
            </div>
            {{ $t("menu.deposit") }}
          </router-link>
          <router-link to="/center/withdraw" class="action-btn">
            <div class="icon-rounded">
              <img src="../../assets/images/home/profile-action-withdraw.svg" />
            </div>
            {{ $t("menu.withdraw") }}
          </router-link>
          <div class="action-btn" @click="showRebateValue">
            <div class="icon-rounded">
              <img src="../../assets/images/home/profile-action-rebate.svg" />
            </div>
            {{ $t("menu.rebate") }}
          </div>
        </div>

        <div class="profile-info" v-if="store.token">
          <el-dropdown trigger="click" class="profile-info-dropdown" @command="handleCommand">
            <span class="el-dropdown-link">
              <div class="profile-img-wrapper">
                <img class="profile-img" src="../../assets/images/home/profile-pic.png" />
                <img class="dropdown-icon" src="../../assets/images/home/header-dropdown-arrow-icon.png" />
                <el-badge class="unread-count" v-if="store.unreadTotal" :value="store.unreadTotal" color="red" />
              </div>
            </span>
            <template #dropdown>
              <el-dropdown-menu
                style="min-width: 180px; display: flex; flex-direction: column; align-items: flex-start"
                class="profile-info-dropdown-content"
              >
                <el-dropdown-item command="personal">
                  <div style="display: flex; align-items: center; gap: 10px; color: #a8b5c3; width: 100%">
                    <img src="../../assets/images/home/header-dropdown-personal-icon.png" />
                    <span>{{ $t("menu.personalInfo") }}</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="deposit">
                  <div style="display: flex; align-items: center; gap: 10px; color: #a8b5c3; width: 100%">
                    <img src="../../assets/images/home/header-dropdown-deposit-icon.png" />
                    <span>{{ $t("menu.deposit") }}</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="promotion">
                  <div style="display: flex; align-items: center; gap: 10px; color: #a8b5c3; width: 100%">
                    <img src="../../assets/images/home/header-dropdown-promo-icon.png" />
                    <span>{{ $t("menu.promotion") }}</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="mailbox">
                  <div
                    class="mailbox-dropdown"
                    style="display: flex; align-items: center; gap: 10px; color: #a8b5c3; width: 100%"
                  >
                    <img src="../../assets/images/home/header-dropdown-inbox-icon.png" />
                    <span>{{ $t("menu.mailbox") }}</span>
                    <div v-if="store.unreadTotal > 0" class="unread-total">
                      <span>{{ store.unreadTotal }}</span>
                    </div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <button class="standard-button btn-color-white" style="color: #468cff">
                    {{ $t("menu.logout") }}
                  </button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="profile-details">
            <div class="name-and-vip-wrapper">
              <div class="details-name">
                {{ store.nickName }}
              </div>
              <div class="account-vip-label">
                {{ vip }}
              </div>
            </div>
            <a @click="refreshBalance" class="details-balance">
              <div class="flex-wrap" style="display: flex; align-items: center; flex-wrap: nowrap">
                <span class="assets-text">{{ $t("account.mainWallet") }}:</span>
                <span class="amount">
                  <span v-if="isLoadingBalance">{{ $t("common.loading") }}...</span>
                  <span v-if="!isLoadingBalance">{{ store.currency.value }} {{ displayBalance(store.balance) }}</span>
                </span>
              </div>
              <el-icon>
                <img width="20" height="20" src="../../assets/images/home/header-refresh-icon.svg" />
              </el-icon>
            </a>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      class="acc-dialog"
      v-model="loginDialogVisible"
      width="980px"
      align-center
      style="max-width: 1080px"
      @close="store.loginPageVisible = false"
    >
      <div
        class="acc-dialog-container login-container"
        :class="isLandingClub == 'tf88club' ? 'acc-dialog-landing' : ''"
      >
        <div class="acc-dialog-left">
          <img class="paris" v-if="isLandingClub !== 'tf88club'" :src="getLoginBg()" />
          <img v-else src="../../assets/home/tf88club-img.png" />
        </div>
        <div class="acc-dialog-right">
          <div class="acc-dialog-content">
            <LoginDialog
              @close-dialog="loginDialogVisible = false"
              @open-reg-dialog="openRegDialog"
              @open-forgotpwd-dialog="openForgotpwdDialog"
            />
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      class="acc-dialog"
      v-model="registerDialogVisible"
      width="1300px"
      align-center
      @close="store.regPageVisible = false"
      style="transform: scale(0.9)"
    >
      <div class="acc-dialog-container signup-container">
        <div class="acc-dialog-left">
          <img class="paris" :src="getSignUpBg()" />
        </div>
        <div class="acc-dialog-right">
          <RegisterAccount
            @close-dialog="registerDialogVisible = false"
            @open-login-dialog="openLoginDialog"
            @open-welcome-dialog="welcomeDialogVisible = true"
          />
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="welcomeDialogVisible"
      width="100%"
      align-center
      style="max-width: 1280px"
      @close="store.welcomeDialogVisible = false"
    >
      <HomeWelcome @close-dialog="welcomeDialogVisible = false" />
    </el-dialog>

    <el-dialog
      v-model="captchaDialogVisible"
      :title="$t('personal.captcha')"
      width="50%"
      align-center
      style="max-width: 500px"
      :close-on-click-modal="false"
      @keydown.enter.prevent
    >
      <el-form ref="captchaRef" :rules="captchaRules" :model="captchaForm" label-width="100" label-suffix=":">
        <el-form-item tabindex="3" :label="$t('personal.captcha')" prop="captchaCode">
          <el-row :gutter="10" style="justify-content: center; align-items: center">
            <el-col :span="12">
              <el-input
                v-model="captchaForm.captchaCode"
                :label="$t('personal.captcha')"
                :placeholder="$t('personal.captcha')"
                @keyup.enter="sendOtp"
              />
            </el-col>
            <el-col :span="12">
              <img style="width: 50%; margin-top: 6px" :src="verificationImg" @click="getCode" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-button size="large" color="#3bafda" class="common-btn" style="margin-left: 100px" @click="sendOtp">
          {{ $t("common.send") }}
        </el-button>
      </el-form>
    </el-dialog>

    <el-dialog
      class="acc-dialog"
      v-model="forgetPassDialogVisible"
      width="1280px"
      align-center
      style="max-width: 1080px"
      @close="store.forgetPassDialogVisible = false"
    >
      <div class="acc-dialog-container login-container">
        <div class="acc-dialog-left">
          <!-- <img :src="`${require(`../../assets/home/acc-dialog-bg-login-${languageVal}.png`)}`" width="150" /> -->
          <img class="paris" :src="getLoginBg()" />
        </div>
        <div class="acc-dialog-right">
          <div class="acc-dialog-content">
            <ForgotPwdDialog @close-dialog="forgetPassDialogVisible = false" @open-login-dialog="openLoginDialog" />
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog class="noPadding" v-model="noticeDialogVisible" width="1280px" align-center style="max-width: 600px">
      <div class="noticedialog">
        <div class="title">{{ $t("common.systemError") }}</div>
        <div class="contents"></div>
        <el-button class="common-btn" @click="noticeDialogVisible = false">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog class="" v-model="logoutDialogVisible" width="600px" align-center>
      <div class="noticedialog">
        <div class="title">{{ $t("common.areyousure") }}</div>
        <div class="standard-button-container">
          <button class="standard-button btn-color-white" @click="logoutDialogVisible = false">
            {{ $t("common.cancel") }}
          </button>
          <button class="standard-button btn-color-blue" @click="onLogout()">{{ $t("common.confirm") }}</button>
        </div>
      </div>
    </el-dialog>
    <el-dialog class="" v-model="isRebateDialogVisible" width="600px" align-center>
      <div class="noticedialog">
        <div class="title" style="flex-direction: column; display: flex">
          {{ $t("vip.rebateBonus") }}
          <span style="font-size: 30px; color: #5196ff">{{ rebateAmt ? rebateAmt : 0 }}</span>
        </div>
        <div class="standard-button-container">
          <button class="standard-button btn-color-white" @click="isRebateDialogVisible = false">
            {{ $t("common.cancel") }}
          </button>
          <button class="standard-button btn-color-blue" @click="claimNow()">{{ $t("promo.btn_claim_now") }}</button>
        </div>
      </div>
    </el-dialog>
  </header>
</template>

<script lang="js">

import "vue3-carousel/dist/carousel.css";

import LocaleChanger from "@/components/LocaleChanger.vue";
import { useI18n } from "vue-i18n";
import { defineComponent, onMounted, ref, reactive, watch, computed, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "@/store/index";
import { getVerificationCode } from "@/api/index/login";
import { sendSms, dailyRebateAmt, claimRebate } from "@/api/personal/personal";
import { ElMessage } from "element-plus";
import { displayBalance } from "@/utils/utils";
import { useElementSize } from "@vueuse/core";
import { storeToRefs } from "pinia";
import moment from "moment";
import { lsGet, lsStore, lsRemove, getTimeout } from "@/utils/utils";
import { getUnreadTotal } from "@/api/personal/mailbox";
import { i18nStore } from '@/store/language'
import { uiStore } from "@/store/ui";
import { EDITION } from "@/constant/edition";

const LoginDialog = defineAsyncComponent(() => import('@/views/LoginDialog.vue'));
const RegisterAccount = defineAsyncComponent(() => import('@/components/auth/RegisterAccount.vue'));
const ForgotPwdDialog = defineAsyncComponent(() => import('@/views/ForgotPwdDialog.vue'));
const HomeWelcome = defineAsyncComponent(() => import('@/components/home/HomeWelcome.vue'));
const Navigation = defineAsyncComponent(() => import('@/components/home/navigation/Navigation.vue'));

export default defineComponent({
  name: "CommonHeader",
  components: {
    LoginDialog,
    ForgotPwdDialog,
    RegisterAccount,
    LocaleChanger,
    HomeWelcome,
    Navigation
  },
  setup() {
    const { t } = useI18n();
    const i18nStoreLanguage = i18nStore()
    const ui = uiStore()
    const { languageVal } = storeToRefs(i18nStoreLanguage);

    const registerTelephoneKey = `registerTelephoneKey`;
    const registerSendOtpDisabledKey = `registeredSendOtpDisabled`;

    const registerSendOtpDisabledTimeout = 60;
    const registerSendOtpDisabledTimeoutLeft = getTimeout(registerSendOtpDisabledKey);

    let cachedTelephone = lsGet(registerTelephoneKey);
    let initialRegisterSendOtpDisabledTimeout = false;

    if (registerSendOtpDisabledTimeoutLeft) {
      initialRegisterSendOtpDisabledTimeout = true;
    } else {
      lsRemove(registerSendOtpDisabledKey);
      lsRemove(registerTelephoneKey);

      cachedTelephone = "";
    }

    const disableSendVerificationButton = ref(initialRegisterSendOtpDisabledTimeout);


    const loadingBtn = ref(false);
    const store = userStore();
    const { token } = storeToRefs(store);
    const router = useRouter();
    const route = useRoute();
    const loginDialogVisible = ref(false);
    const registerDialogVisible = ref(false);
    const forgetPassDialogVisible = ref(false);
    const noticeDialogVisible = ref(false);
    const logoutDialogVisible = ref(false);
    const captchaDialogVisible = ref(false);
    const el = ref(null);
    const scroll = ref(0);
    const { height } = useElementSize(el);

    const vipLevel = computed(() => {
      if (store.vip.toUpperCase() === "NORMAL") {
        return 1;
      }
      return store.vip;
    });

    const vip = computed(() => {
      return vipLevel.value;
    });

    const handleCommand = (command) => {
      if (command === "personal") {
        router.push("/center/personal");
      }
      if (command === "deposit") {
        router.push("/center/deposit");
      }
      if (command === "transfer") {
        router.push("/center/transfer");
      }
      if (command === "promotion") {
        router.push("/promotion");
      }
      if (command === "mailbox") {
        router.push("/center/mailbox")
      }
      if (command === "logout") {
        onLogout();
      }
    };

    const loginForm = reactive({
      name: ""
    });
    const loginRef = ref([]);
    const mobileLoginRef = ref([]);
    const captchaRef = ref([]);
    const hasAffiliate = ref(false);
    const regCountdown = ref(registerSendOtpDisabledTimeoutLeft);
    const loginCountdown = ref(0);

    const captchaForm = reactive({
      type: "",
      captchaCode: "",
      codeId: ""
    });
    const captchaRules = {
      captchaCode: [
        {
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        },
        {
          min: 4,
          max: 4,
          message: "长度为 4",
          trigger: "blur"
        }
      ]
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

    const passForm = reactive({
      email: ""
    });

    const passRef = ref([]);
    const forgetPassRules = {

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
      ]

    };
    const passRules = {
      loginName: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur"
        },
        {
          min: 6,
          max: 12,
          message: "长度要在 6-12 之间",
          trigger: "blur"
        }
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
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
          message: "长度为 4",
          trigger: "blur"
        }
      ]
    };

    const getAffiliateCode = () => {
      const affCode = sessionStorage.getItem("AFFILIATE_CODE");
      if (affCode) {
        hasAffiliate.value = true;
        regForm.codeAffiliate = affCode;
      }
    };

    const onLogout = () => {
      store.memberLogout().then(() => {
        location.reload();
      });
    };

    const sendOtp = async () => {

      if (captchaForm.type === "REGISTER") {
        const smsDetail = {
          telephone: regForm.telephone,
          captchaCode: captchaForm.captchaCode,
          codeId: captchaForm.codeId
        };
        sendSms(smsDetail)
          .then((response) => {
            if (response.code == 0) {
              disableSendVerificationButton.value = true;

              regForm.smsCodeId = response.data.codeId;

              ElMessage({
                type: "success",
                message: t('common.sendPhoneVerificationSuccess')
              });

              captchaDialogVisible.value = false;

              regCountdown.value = registerSendOtpDisabledTimeout;

              const now = new Date();

              now.setSeconds(now.getSeconds() + registerSendOtpDisabledTimeout);

              lsStore(registerSendOtpDisabledKey, now.getTime());
              lsStore(registerTelephoneKey, regForm.telephone);

              countdownTimer("REGISTER");
            } else {
              getCode();
            }
          });
      } else if (captchaForm.type === "LOGIN") {
        const smsDetail = {
          telephone: loginForm.phoneNumber,
          captchaCode: captchaForm.captchaCode,
          codeId: captchaForm.codeId
        };
        sendSms(smsDetail)
          .then((response) => {
            if (response.code == 0) {
              loginForm.smsCodeId = response.data.codeId;
              ElMessage({
                type: "success",
                message: t('common.sendPhoneVerificationSuccess')
              });
              captchaDialogVisible.value = false;
              getCode();
              loginCountdown.value = 30;
              countdownTimer("LOGIN");
            } else {
              getCode();
            }
          });
      }
    };

    const countdownTimer = (type) => {
      if (type === "REGISTER") {
        if (regCountdown.value > 0) {
          setTimeout(() => {
            regCountdown.value -= 1;
            countdownTimer("REGISTER");
          }, 1000);
        } else {
          lsRemove(registerSendOtpDisabledKey);
          lsRemove(registerTelephoneKey);

          disableSendVerificationButton.value = false;
        }
      } else if (type === "LOGIN") {
        if (loginCountdown.value > 0) {
          setTimeout(() => {
            loginCountdown.value -= 1;
            countdownTimer("LOGIN");
          }, 1000);
        }
      }
    };

    const openCaptchaForm = (type) => {
      captchaForm.captchaCode = "";
      captchaForm.type = type;
      captchaDialogVisible.value = true;
      getCode();
    };

    const rebateAmt = ref(0);
    const isRebateDialogVisible = ref(false);
    const isLandingClub = ref(route.query.landing);

    const showRebateValue = () => {
      dailyRebateAmt().then((res) => {
        if (res.code === 0) {
          isRebateDialogVisible.value = true
          rebateAmt.value = res.data
        } else {
          ElMessage.error(res.message)
        }
      })
    }
    const claimNow = () => {
      claimRebate().then((res) => {

        if (res.code === 0) {

          isRebateDialogVisible.value = false;
          ElMessage.success($t('common.claimedSuccess'))
        } else {
          ElMessage.error(res.message)
        }
      })
    }
    onMounted(() => {

      const isGetWelcome = sessionStorage.getItem("IS_GET_WELCOME");
      if (isGetWelcome) {
        welcomeDialogVisible.value = true;
        sessionStorage.removeItem("IS_GET_WELCOME");
      }

      if (regCountdown.value > 0) {
        countdownTimer("REGISTER");
      }

      getAffiliateCode();
      getReferalCode();

      if (store.token) {
        store.getBalance();
        store.getMemberInfo();

        getUnreadMail();
      }

      if (store.loginPageVisible) {
        loginDialogVisible.value = true;
      } else {
        loginDialogVisible.value = false;
      }


      // alert(isLanding);
      if (isLandingClub.value === "tf88club") {
        loginDialogVisible.value = true;
      }


    });

    watch(() => store.loginPageVisible, () => {
      if (store.loginPageVisible) {
        loginDialogVisible.value = true;
        // router.push('/login');
        return;
      } else {
        loginDialogVisible.value = false;
      }
      // Optionally you can set immediate: true config for the watcher to run on init
      // }, { immediate: true });
    });
    watch(() => store.regPageVisible, () => {
      if (store.regPageVisible) {
        // registerDialogVisible.value = true
        router.push("/register");
        return;
      } else {
        registerDialogVisible.value = false;
      }
      // Optionally you can set immediate: true config for the watcher to run on init
      // }, { immediate: true });
    });

    const getReferalCode = () => {
      const referCode = sessionStorage.getItem("REFERRAL_CODE");
      // console.log("got Code");
      // console.log(referCode);
      if (referCode && route.query && route.query.refer) {
        registerDialogVisible.value = true;
        regForm.referrer = referCode;
      }
    };


    const isLoadingBalance = ref(false);
    const refreshBalance = () => {
      isLoadingBalance.value = true;
      store.getBalance().then(() => {
        isLoadingBalance.value = false;
      });
    };
    const getCode = () => {
      getVerificationCode().then((res) => {
        if (res.code === 0) {
          verificationImg.value = "data:image/png;base64," + res.data.img;
          loginForm.codeId = res.data.id;
          regForm.codeId = res.data.id;
          captchaForm.codeId = res.data.id;
          passForm.codeId = res.data.id;
        }
      });
    };
    const verificationImg = ref("");

    const pwdStrength = ref();

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

    const todayDate = () => {
      return "GTM+8 " + moment().utcOffset("+08:00").format("M/D/YYYY, h:mm:ss A ") + moment(new Date()).locale("zh-cn").format("dddd");
    };

    const getUnreadMail = () => {
      getUnreadTotal().then((response) => {
        if (response.code === 0) {
          store.unreadTotal = response.data;
        }
      }).catch((error) => {
        // console.log("error===", error)
      });
    };

    const openLoginDialog = () => {
      registerDialogVisible.value = false;
      forgetPassDialogVisible.value = false;
      loginDialogVisible.value = true;
    };

    const openRegDialog = () => {
      loginDialogVisible.value = false;
      registerDialogVisible.value = true;
    };

    const openForgotpwdDialog = () => {
      loginDialogVisible.value = false;
      forgetPassDialogVisible.value = true;
    };

    const goPath = (path, element) => {
      const parentElement = element.target.parentNode;
      setTimeout(() => {
        const mouseUpEvent = new MouseEvent("mouseup", {
          bubbles: true,
          cancelable: true,
          view: window
        });
        parentElement.dispatchEvent(mouseUpEvent);
      }, 50);

      router.push(path);
    };

    const welcomeDialogVisible = ref(false)

    const getLoginBg = () => {
      switch (ui.edition) {
        case EDITION.SLOT:
          return require(`../../assets/home/acc-dialog-img-login-slot.png`)
        case EDITION.NORMAL:
        default:
          return require(`../../assets/home/acc-dialog-img-login.png`)
      }
    }
    const getSignUpBg = () => {
      switch (ui.edition) {
        case EDITION.SLOT:
          return require(`../../assets/home/acc-dialog-img-login-slot.png`)
        case EDITION.NORMAL:
        default:
          return require(`../../assets/home/acc-dialog-img-login.png`)
      }
    }

    return {
      token,
      el,
      height,
      goPath,
      scroll,
      loginForm,
      loginDialogVisible,
      forgetPassDialogVisible,
      noticeDialogVisible,
      logoutDialogVisible,
      captchaDialogVisible,
      loginRef,
      mobileLoginRef,
      captchaRef,
      regForm,
      registerDialogVisible,
      captchaRules,
      getCode,
      verificationImg,
      disableSendVerificationButton,
      onLogout,
      store,
      isLoadingBalance,
      refreshBalance,
      passForm,
      captchaForm,
      passRef,
      passRules,
      forgetPassRules,
      displayBalance,
      pwdStrength,
      todayDate,
      sendOtp,
      openCaptchaForm,
      loadingBtn,
      getAffiliateCode,
      hasAffiliate,
      countdownTimer,
      regCountdown,
      loginCountdown,
      route,
      getUnreadMail,
      vip,
      handleCommand,
      openLoginDialog,
      openRegDialog,
      openForgotpwdDialog,
      languageVal,
      showRebateValue,
      isRebateDialogVisible,
      claimRebate,
      rebateAmt,
      claimNow,
      welcomeDialogVisible,
      isLandingClub,
      ui,
      EDITION,
      getLoginBg,
      getSignUpBg
    };
  }
});
</script>
<style lang="scss">
body {
  .el-button.is-disabled,
  .el-button.is-disabled:hover {
    background-color: #a8b5c3;
  }

  .el-input.wTip .el-input-group__append {
    background: none;
    border: 0;
    padding: 0 8px;
    font-size: 12px;
    box-shadow: none;
  }

  .el-dropdown-menu__item {
    width: 100%;
    justify-content: center;
  }
}
</style>
<style scoped lang="scss">
.el-icon {
  height: 1.5em;
  width: 1.5em;

  svg {
    height: 1.5em;
    width: 1.5em;
  }
}

.profile-info {
  display: flex;
  align-items: center;

  .profile-img-wrapper {
    cursor: pointer;
    width: 65px;
    margin-right: 0.75rem;
    position: relative;

    .profile-img {
      display: block;
      width: 100%;
    }

    .dropdown-icon {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
    }

    .unread-count {
      position: absolute;
      bottom: 2px;
      right: 5px;
      width: 12px;
      height: 12px;
      opacity: 1;
    }
  }

  .profile-details {
    display: flex;
    flex-direction: column;
    width: 160px;
    font-size: 14px;

    .name-and-vip-wrapper {
      display: flex;
      align-items: center;
    }

    .details-name {
      color: $font-1;
      font-weight: bold;
    }

    .account-vip-label {
      background-image: url(../../assets/images/account/vip-label.png);
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 63px 17px;
      width: 100%;
      height: 17px;
      font-size: 0.675rem;
      color: $color-white;
      padding-left: 21px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .details-balance {
      display: flex;
      align-items: center;

      .assets-text {
        white-space: nowrap;
      }

      .amount {
        font-family: "Roboto";
        margin-right: 0.5rem;
        white-space: nowrap;
      }
    }
  }
}

.profile-actions {
  display: flex;
  gap: 1rem;

  .action-btn {
    // height: 30px;
    gap: 2px;
    width: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 0.75rem;
    color: $font-1;
    cursor: pointer;
    text-align: center;

    &:hover {
      color: $link-active;

      .icon-rounded {
        box-shadow: 0px 2px 5px 0px #498bd1 inset;
      }
    }

    .icon-rounded {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      box-shadow: 0px 2px 5px 0px #bbdcff inset;
    }

    img {
      display: block;
      width: 20px;
    }
  }

  .action-btn-full {
    gap: 5px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 0.75rem;
    color: $font-1;
    cursor: pointer;

    &:hover {
      filter: brightness(0) invert(41%) sepia(53%) saturate(2002%) hue-rotate(205deg) brightness(107%) contrast(102%);
    }

    .icon-full {
      position: relative;

      .mail-notify {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        width: 10px;
        height: 10px;
        background-color: $link-active;
        border-radius: 50%;
      }
    }

    img {
      display: block;
      width: 30px;
    }
  }
}

.details {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;

  .balance-amt {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      min-width: 40px;
      text-align: right;
      white-space: nowrap;
    }

    .amount {
      color: #faea81;
      font-weight: bold;
    }

    .el-icon {
      height: 2em;
      width: 2em;
      line-height: 2em;
      cursor: pointer;

      svg {
        width: 1.3em;
        height: 1.3em;
      }
    }
  }

  .top-deposit {
    a {
      text-decoration: none;
    }
  }
}

.el-dropdown-link {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: silver;
}

.hamburger {
  display: none;
}

.header-container {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 99;
  transition: all 0.3s ease;

  padding: 10px;
  background: $color-white;

  position: relative;
  box-shadow: $shadow-header;

  .top-nav-wrapper {
    .side {
      position: absolute;
      top: 0;

      &.left {
        left: 0px;
      }

      &.right {
        right: 0px;
        transform: rotateY(180deg);
      }
    }

    .top-nav-inner {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;

      &.logged-in-nav {
        max-width: 1530px;
      }

      .logospon {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;

        .seperator {
          background: #8f99a3;
          width: 1px;
          height: 60px;
        }
      }

      .logo {
        height: 60px;
        //width: 102px;

        img {
          width: 100%;
          display: block;
        }
      }

      @media (max-width: 1380px) {
        margin: 0;
      }
    }
  }

  .header-decoration {
    position: absolute;
    top: 0;
    z-index: 1;
    max-height: 77px;

    &.left {
      left: 0;
    }

    &.right {
      right: 0;
    }
  }
}

.register-container {
  display: flex;
  min-height: 90vh;

  .registered-left {
    background-image: url(../../assets/home/zc.jpg);
    background-size: cover;
    background-position: 100% 100%;
    background-repeat: no-repeat;
    flex: 1;
    padding: 80px 30px;

    ul {
      text-align: left;
      padding-left: 15px;
      font-size: 14px;
      line-height: 30px;
      color: #ffffff;

      li {
        list-style-type: decimal;
      }
    }

    .title {
      background-image: url(../../assets/home/download.png);
      background-position: 100% 100%;
      width: 143px;
      height: 35px;
    }
  }

  .registered-right {
    flex: 2;
    padding: 73px 44px;
    background: url(../../assets/images/index/reg-bg.jpg) no-repeat center center;
    background-size: cover;

    .el-row {
      width: 100%;
    }

    form .title {
      height: 18px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #5075ad;
      margin: 0 auto 30px;
      width: 100%;
      text-align: left;
      display: block;

      &.account {
        margin-top: 52px;
      }
    }
  }
}

.noticedialog {
  padding: 0 0 5px;

  .title {
    font-size: 20px;
    font-weight: bold;
    padding: 10px 0;
    text-align: center;
  }

  .contents {
    padding: 20px;
  }

  .el-button {
    display: block;
    margin: 15px auto;
  }
}

.password-str-div {
  display: flex;
  align-items: center;
  margin-top: 3px;
  margin-bottom: 5px;
  justify-content: space-evenly;
  gap: 5px;
  height: 50px;
  width: 215px;
  color: #ffffff;

  span {
    padding: 8px 3px;
    //border: 1px solid #fff;
    border-radius: 5px;
    background: #434343;
    width: 33%;
    text-align: center;
    // font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  span.weak-pwd {
    background: #ff3131;
  }

  span.normal-pwd {
    background: #f2c037;
    color: #000000;
  }

  span.strong-pwd {
    //background: linear-gradient(to right, #de4545, #db7e42) !important;
    background: #21ba45;
    font-weight: 600;
  }
}

.mailbox-dropdown {
  > span {
    flex-grow: 1;
  }

  .unread-total {
    min-width: 30px;
    border-radius: 25px;
    text-align: center;
    color: #fff;
    background: red;
    padding: 0 10px;
    width: max-content;
  }
}
</style>

<!-- Menu Styles -->
<style lang="scss">
.platform-menu {
  a {
    text-decoration: none;
  }

  display: flex;
  margin: 0 auto;
  // max-width: 1280px;
  justify-content: space-evenly;
  align-items: center;

  .platform-title {
    font-size: 40px;
    color: #343434;
    font-weight: 500;
    margin: 0;
  }

  .platform-box {
    flex: 1;
    cursor: pointer;
    padding: 25px 10px;

    &:hover {
      background: $primary;

      .platform-img {
        transform: scale(1.05);
      }
    }
  }

  .platform-img {
    transition: $page-trans;
    width: 145px;
    height: 162px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }

  &.games,
  &.live {
    justify-content: center;

    .platform-box {
      max-width: 160px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      display: flex;

      .plat-icon {
        height: 40px;
        width: unset;
      }
    }
  }

  &.games,
  &.live,
  &.lottery {
    justify-content: center;

    .platform-box {
      max-width: 160px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      display: flex;

      .plat-icon {
        height: 40px;
        width: unset;
        margin-bottom: 5px;
      }
    }
  }

  &.games {
    .platform-box {
      .plat-icon {
        width: 75px;
        height: unset;
      }
    }
  }

  .header-fs-box {
    text-align: left;
    margin-left: 10px;
    cursor: pointer;

    .fs-title {
      margin: 0;
      font-size: 30px;
      color: #3370d0;
    }

    .fs-name {
      font-size: 20px;
      color: #343434;
      margin: 0;
    }

    .fs-desc {
      font-size: 18px;
      color: #666;
      margin-top: 3px;
    }

    .fs-percentage {
      background-image: url("../../assets/game/percentage.png");
      background-size: 1008px 71px;
      background-repeat: no-repeat;
      width: 168px;
      height: 71px;
      margin-top: 12px;

      &.p128 {
        background-position-x: -672px;
      }

      &.p120 {
        background-position-x: -840px;
      }

      &.p200 {
        background-position-x: -504px;
      }
    }
  }

  &.live,
  &.games,
  &.fish,
  &.lottery {
    .platform-title {
      font-size: 16px;
      color: #000;
      margin: 9px 0 15px;
    }
  }

  &.sports,
  &.poker,
  &.promo {
    .platform-slogan {
      // font-size: 1em;
      // margin: 15px 0 12px;
      height: 21px;
      font-size: 16px;
      color: #999;
      margin: 15px 0 12px;
    }
  }

  &.esports {
    .platform-box {
      display: flex;
      flex-direction: column-reverse;
      max-width: 340px;
      padding: 30px 40px 0;
      gap: 9px;

      .imgbox {
        width: 310px;
        height: 180px;
        background-image: url(../../assets/home/header_esport_new_01.png);
        background-size: cover;
        overflow: hidden;
        -webkit-transition: all 0.5s ease-out;
        transition: all 0.5s ease-out;
      }

      &:hover {
        .imgbox {
          -webkit-transform: scale(1.03);
          transform: scale(1.03);
        }
      }

      .platform-slogan {
        height: 21px;
        margin: 0 auto;
        font-size: 16px;
        color: #999;
      }
    }
  }

  &.sports,
  &.poker {
    .platform-box {
      padding: 25px 0;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      gap: 15px;

      .imgbox {
        width: 340px;
        height: 300px;
        background-size: cover;
        overflow: hidden;
        -webkit-transition: all 0.5s ease-out;
        transition: all 0.5s ease-out;
      }

      &:hover {
        .imgbox {
          -webkit-transform: scale(1.03);
          transform: scale(1.03);
        }
      }

      .contents {
        padding-right: 0px;
        text-align: left;

        .platform {
          font-size: 24px;
          color: #4080ff;
        }
      }
    }
  }

  &.sports {
    .platform-box {
      padding: 0;

      .imgbox {
        background-image: url(../../assets/home/header_sport_new_2.png);
        background-size: 410%;
        overflow: hidden;
        transition: all 0.5s ease-out;
        background-repeat: no-repeat;
        background-position: center center;

        flex: 6;
      }

      .contents {
        flex: 4;
      }
    }
  }

  &.poker {
    .platform-box {
      max-width: 500px;

      .imgbox {
        width: 225px;
        height: 250px;
        background-image: url(../../assets/home/header_live.webp);
      }
    }
  }

  &.app {
    gap: 30px;

    .platform-box {
      flex: unset;
    }
  }

  &.promo {
    .platform-box {
      flex: unset;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .contents {
        text-align: left;

        .platform {
          color: #333;
          font-size: 2em;
        }

        .platform-slogan {
          width: 150px;
        }
      }
    }

    img {
      width: 300px;
    }
  }

  &.fish {
    justify-content: center;

    .platform-box {
      padding: 25px 10px;
      max-width: 160px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}

.acc-dialog {
  &.el-dialog {
    box-shadow: none;
    border-radius: 20px;
    // overflow: hidden;

    .el-dialog__body {
      padding: 0;

      .acc-dialog-container {
        display: flex;
        background: url(../../assets/home/acc-dialog-bg-full.png) no-repeat left center;
        // min-height: 500px;
        // align-items: center;
        padding-top: 0px;
        padding-bottom: 0px;
      }

      .acc-dialog-left {
        width: 60%;

        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        // background-color: #ffffff;
        // padding: 8px;

        padding: 0;

        img {
          display: block;
          width: 100%;
          margin-right: -60px;
        }

        .acc-dialog-img {
          margin-top: -50px;
          margin-left: -140px;
          margin-right: -70px;

          img {
            display: block;
            width: 100%;
          }
        }
      }

      .login-container {
        .acc-dialog-left {
          display: flex;
          align-items: flex-end;
          // background-image: url(../../assets/home/acc-dialog-bg-login-eurocup.png);
          background-size: 100% 100%;
          background-position: center center;
          min-height: 500px;

          img {
            display: block;
            // width: 100%;
            width: calc(100% + 90px);
            margin: -50px 0px -45px -90px;
            max-width: 100%;

            &.paris {
              margin: 0;
            }
          }
        }

        &.acc-dialog-landing {
          .acc-dialog-left {
            background-image: url(../../assets/home/tf88club.png);
            max-height: 95vh;

            img {
              width: calc(100% + 20px);
              margin: -50px -10px 0px -10px;
            }
          }

          .acc-dialog-right {
            padding-left: 20px;
          }
        }
      }

      .signup-container {
        // padding-top: 10px;
        // padding-bottom: 10px;
        align-items: center;

        .acc-dialog-left {
          width: 69%;
          display: flex;
          align-items: flex-end;
          // background-image: url(../../assets/home/acc-dialog-bg-signup-eurocup.png);
          background-size: 100% 100%;
          background-position: center center;
          // background-color:salmon;
          overflow: hidden;

          img {
            display: block;
            width: calc(80% + 70px);
            margin: -190px 0px -10px -20px;

            &.paris {
              margin: 0;
              width: 100%;
            }
          }
        }

        .acc-dialog-right {
          width: 31%;
        }
      }

      .acc-dialog-right {
        width: 40%;
        padding: 24px 24px 5px 24px;

        .acc-dialog-content {
          padding-top: 26px;
        }
      }
    }
  }

  .el-dialog__header .el-dialog__headerbtn {
    top: 10px;
    right: 10px;

    .el-dialog {
      &__close {
        color: #000000 !important;
        opacity: 0.5;

        &:hover {
          opacity: 1;
          color: #000000 !important;
        }
      }
    }
  }
}

.imptann-modal {
  background: transparent !important;
  box-shadow: none !important;
}

.imptann-modal .el-dialog__headerbtn {
  top: 15px !important;
  right: 15px;
  height: 2em !important;
  width: 2em !important;
  border-radius: 50%;
  background: #666;
  text-align: center;
  line-height: 1.7em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mailbox-notify {
  position: relative;
  margin-right: 20px;
}

.header-btn {
  display: flex;
  min-width: 120px;
  height: 32px;
  padding: 6px;
  justify-content: center;
  align-items: center;
  border-radius: 2rem;
  background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
  box-shadow: 0px 2px 4.58px 0px #bbdcff inset, 0px -1px 3.664px 0px #a2bff4 inset;
  cursor: pointer;
  transition: 0.3s all;

  &:hover {
    filter: brightness(0.9);
  }

  &.btn-color-blue {
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
    color: $color-white;
  }

  &.btn-color-white {
    background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
    box-shadow: 0px 2px 4.58px 0px #bbdcff inset, 0px -1px 3.664px 0px #a2bff4 inset;
    color: #444444;
    position: relative;

    img {
      position: absolute;
      right: -10px;
      top: -20px;
    }
  }

  &.SLOT {
    gap: 7px;

    img {
      position: unset;
    }
  }
}

.right-contents {
  // margin-left: 2rem;
  display: flex;
  gap: 1rem;
}
</style>
