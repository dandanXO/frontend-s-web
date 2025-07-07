<template>
  <NewMemberGuide :openAppMenu="() => (selectedMenu = 'App')" :closeAppMenu="() => (selectedMenu = '')" />

  <header class="header-container" :class="scroll > 40 ? 'on-scrolled' : ''">
    <div class="top-nav-wrapper" @mouseleave="selectedMenu = ''">
      <div class="top-nav-inner" :class="store.token && 'logged-in-nav'">
        <router-link class="logospon" to="/home">
          <img class="logo" src="../../assets/lucky-6-logo.svg" />
        </router-link>

        <div class="navigations">
          <template v-for="nav in navigations" :key="nav.name">
            <template v-if="!nav.hasicon && !nav.isTest">
              <div
                class="header-menu-item"
                :class="{ active: route.name === nav.code || route.name === nav.enName.toLowerCase() }"
              >
                <!-- <img
                  v-if="nav.code === 'sports'"
                  class="hot-label"
                  :src="require(`../../assets/images/home/menu/hot-game-label.png`)"
                /> -->
                <a
                  v-if="nav.code === 'minigame'"
                  @click="openMiniGame"
                  @mouseup="selectedMenu = ''"
                  @mouseover="showSubMenu(nav)"
                >
                  <h2 class="nav-title cn">{{ nav.name }}</h2>
                  <h2 class="nav-title">{{ nav.enName }}</h2>
                </a>
                <a v-else @mouseover="showSubMenu(nav)" @mouseup="selectedMenu = ''" @click="goPath(nav.path, $event)">
                  <template v-if="route.name === nav.code || route.name === nav.enName.toLowerCase()">
                    <!-- <img
                      class="menu-icon"
                      :src="require(`../../assets/images/home/menu/${nav.code}-icon-active.png`)"
                    /> -->
                    <h2 class="nav-title cn active">{{ nav.name }}</h2>
                    <h2 class="nav-title active">{{ nav.enName }}</h2>
                  </template>
                  <template v-else>
                    <!-- <img
                      class="menu-icon"
                      :src="require(`../../assets/images/home/menu/${nav.code}-icon${isDark ? '-dark' : ''}.png`)"
                    /> -->
                    <h2 class="nav-title cn">{{ nav.name }}</h2>
                    <h2 class="nav-title">{{ nav.enName }}</h2>
                  </template>
                </a>
              </div>
            </template>
          </template>
        </div>

        <div class="navigations second-nav">
          <template v-for="nav in navigations" :key="nav.name">
            <template v-if="nav.hasicon">
              <div class="header-menu-item">
                <router-link @mouseover="showSubMenu(nav)" @mouseup="selectedMenu = ''" :to="nav.path">
                  <span>
                    <div class="promotion-icon" v-if="nav.code === 'Promotion'" />
                    <!-- <img
                      class="hover-icon promotion"
                      :src="require(`../../assets/images/home/header-promo-icon${isDark ? '-dark' : ''}.svg`)"
                      v-if="nav.code === 'Promotion'"
                    /> -->
                    <!-- <img
                      class="hover-icon"
                      :src="require(`../../assets/images/home/header-affiliate-icon${isDark ? '-dark' : ''}.svg`)"
                      v-if="nav.code === 'Agent'"
                    /> -->
                    <div class="app-icon" v-if="nav.code === 'App'" />
                    <!-- <img
                      class="hover-icon"
                      :src="require(`../../assets/images/home/header-download-icon${isDark ? '-dark' : ''}.svg`)"
                      v-if="nav.code === 'App'"
                    /> -->
                    <div class="app-icon" v-if="nav.code === 'CS'" />
                    <!-- <img
                      class="hover-icon"
                      :src="require(`../../assets/images/home/header-vip-icon${isDark ? '-dark' : ''}.svg`)"
                      v-if="nav.code === 'VIP'"
                    /> -->
                  </span>
                  <span>{{ nav.name }}</span>
                </router-link>
              </div>
            </template>
          </template>

          <div @mousetouch="selectedMenu = ''" class="sub-menu" :style="'height:' + height + 'px;'">
            <GameMenu ref="el" v-if="selectedMenu === 'slot'" @load-modal="openGame" />
            <LiveCasinoMenu ref="el" v-if="selectedMenu === 'live'" @load-modal="openGame" />
            <EsportsMenu ref="el" v-if="selectedMenu === 'esports'" @load-modal="openGame" />
            <SportsMenu ref="el" v-if="selectedMenu === 'sports'" @load-modal="openGame" />
            <LotteryMenu ref="el" v-if="selectedMenu === 'lottery'" @load-modal="openGame" />
            <PokerMenu ref="el" v-if="selectedMenu === 'poker'" @load-modal="openGame" />
            <FishingMenu ref="el" v-if="selectedMenu === 'fish'" @load-modal="openGame" />
            <PromotionMenu ref="el" v-if="selectedMenu === 'Promotion'" />
            <AppMenu ref="el" v-if="selectedMenu === 'App'" />
          </div>
        </div>

        <div v-if="!store.token" class="right-contents">
          <LocaleChanger />
          <!-- <router-link to="/login" class="action-btn">
            <a class="header-btn btn-color-blue">登录</a>
          </router-link>
          <router-link to="/register" class="action-btn">
            <a class="header-btn btn-color-white">注册</a>
          </router-link> -->
          <a class="standard-button btn-color-blue" @click="loginDialogVisible = true">{{ $t('btn.login') }}</a>
          <a class="standard-button btn-color-white" @click="registerDialogVisible = true">{{ $t('btn.register') }}</a>
        </div>

        <div v-if="store.token" class="profile-actions">
          <router-link to="/center/deposit" class="action-btn">
            <div class="icon-rounded">
              <img src="../../assets/images/home/profile-action-deposit.png" />
            </div>
            存款
          </router-link>
          <router-link to="/center/withdraw" class="action-btn">
            <div class="icon-rounded">
              <img src="../../assets/images/home/profile-action-withdraw.png" />
            </div>
            取款
          </router-link>
          <router-link to="/center/transfer" class="action-btn">
            <div class="icon-rounded">
              <img src="../../assets/images/home/profile-action-transfer.png" />
            </div>
            转账
          </router-link>
        </div>

        <div class="profile-info" v-if="store.token">
          <el-dropdown trigger="click" class="profile-info-dropdown" @command="handleCommand">
            <span class="el-dropdown-link">
              <div class="profile-img-wrapper">
                <img v-if="!store.profilePhoto" class="profile-img" src="../../assets/images/home/profile-pic.png" />
                <img
                  v-if="store.profilePhoto && store.profilePhoto.includes('default')"
                  class="profile-img"
                  :src="require(`../../assets/images/profile/${store.profilePhoto}.png`)"
                />
                <img
                  v-if="store.profilePhoto && !store.profilePhoto.includes('default')"
                  class="profile-img"
                  :src="imageDir + store.profilePhoto + '?v=' + timestamp"
                />
                <img class="dropdown-icon" src="../../assets/images/home/header-dropdown-arrow-icon.png" />
                <el-badge class="unread-count" v-if="store.unreadTotal" :value="store.unreadTotal" color="red" />
              </div>
            </span>
            <template #dropdown>
              <el-dropdown-menu class="profile-info-dropdown-content">
                <el-dropdown-item command="personal">
                  <div class="profile-info-dropdown-content-item">
                    <img :src="loadIcon('personal')" />
                    <span>个人信息</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="deposit">
                  <div class="profile-info-dropdown-content-item">
                    <img :src="loadIcon('deposit')" />
                    <span>充值中心</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="transfer">
                  <div class="profile-info-dropdown-content-item">
                    <img :src="loadIcon('transfer')" />
                    <span>快速转账</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="promotion">
                  <div class="profile-info-dropdown-content-item">
                    <img :src="loadIcon('promo')" />
                    <span>优惠领取</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <button class="standard-button profile-info-dropdown-content-item btn-color-white">退出登录</button>
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
                <span class="assets-text">总资产：</span>
                <span class="amount">
                  <span v-if="isLoadingBalance">加载中...</span>
                  <span v-if="!isLoadingBalance">{{ store.currency.value }}{{ floor(store.balance, 2) }}</span>
                </span>
              </div>
              <el-icon class="reload-btn">
                <img class="fill-468cff" src="../../assets/home/refresh-line.svg" />
              </el-icon>
            </a>
          </div>
        </div>

        <!-- <div v-if="store.token" class="profile-actions">
          <router-link to="/center/mailbox" class="action-btn-full">
            <div class="icon-full">
              <img src="../../assets/images/home/nav-icon-mail.png" />
              <span class="mail-notify"></span>
            </div>
            消息
          </router-link>
          <div class="action-btn-full" @click="logoutDialogVisible = true">
            <div class="icon-full">
              <img src="../../assets/images/home/nav-icon-logout.png" />
            </div>
            退出
          </div>
        </div> -->
      </div>
    </div>

    <!-- <el-dialog
      v-model="loginDialogVisible"
      title="会员登录"
      width="50%"
      align-center
      style="max-width: 800px"
      @close="store.loginPageVisible = false"
    >
      <span>
        <el-tabs>
          <el-tab-pane label="账户登录">
            <el-form
              ref="loginRef"
              :rules="loginRules"
              :model="loginForm"
              label-width="100"
              label-suffix=":"
              style="width: 100%; max-width: 400px; margin: 50px auto"
            >
              <el-form-item tabindex="1" label="用户名" prop="loginName">
                <el-input v-model="loginForm.loginName" placeholder="输入用户名" />
              </el-form-item>
              <el-form-item tabindex="2" label="密码" prop="password">
                <el-input v-model="loginForm.password" placeholder="输入密码" type="password" show-password />
              </el-form-item>
              <el-form-item tabindex="3" label="验证码" prop="captchaCode">
                <el-row :gutter="10" style="justify-content: center; align-items: center">
                  <el-col :span="12">
                    <el-input
                      v-model="loginForm.captchaCode"
                      label="验证码"
                      placeholder="验证码"
                      @keyup.enter="submitLogin"
                    />
                  </el-col>
                  <el-col :span="12">
                    <img style="width: 50%; margin-top: 6px" :src="verificationImg" @click="getCode" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-button
                :loading="loadingBtn"
                size="large"
                color="#3bafda"
                class="common-btn"
                style="margin-left: 100px"
                @click="submitLogin"
              >
                登录
              </el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="手机登录">
            <el-form
              ref="mobileLoginRef"
              :rules="mobileLoginRules"
              :model="loginForm"
              label-width="100"
              label-suffix=":"
              style="width: 100%; max-width: 400px; margin: 50px auto"
            >
              <el-form-item tabindex="1" label="手机号" prop="phoneNumber">
                <el-input v-model="loginForm.phoneNumber" placeholder="输入手机号" />
              </el-form-item>
              <el-form-item tabindex="2" label="验证码" prop="code">
                <el-row :gutter="10" style="justify-content: center; align-items: center">
                  <el-col :span="12">
                    <el-input v-model="loginForm.code" label="验证码" placeholder="验证码" @keyup.enter="phoneLogin" />
                  </el-col>
                  <el-col :span="12">
                    <el-button
                      v-if="loginCountdown === 0"
                      @click="openCaptchaForm('LOGIN')"
                      size="small"
                      color="#3bafda"
                    >
                      发送验证码
                    </el-button>
                    <el-button v-else disabled size="small" class="common-btn">
                      已发送（倒数{{ loginCountdown }}秒）
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-button
                :loading="loadingBtn"
                size="large"
                color="#3bafda"
                class="common-btn"
                style="margin-left: 100px"
                @click="phoneLogin"
              >
                登录
              </el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </span>
    </el-dialog> -->

    <el-dialog
      class="acc-dialog"
      v-model="loginDialogVisible"
      align-center
      style="max-width: 1088px"
      @close="store.loginPageVisible = false"
    >
      <div class="acc-dialog-container">
        <div class="acc-dialog-left">
          <div class="acc-dialog-img">
            <img v-if="accDialogImg" :src="accDialogImg" />
            <img v-else src="../../assets/home/auth/login-banner.jpg" />
          </div>
        </div>
        <div class="acc-dialog-right">
          <div class="acc-dialog-homelogo">
            <img src="../../assets/home/auth/login-logo-left.png" height="60px" />
            <img src="../../assets/home/auth/login-logo-right.svg" height="60px" />
          </div>
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
      width="1200px"
      align-center
      style="max-width: 1200px"
      @close="store.regPageVisible = false"
    >
      <div class="acc-dialog-container">
        <div class="acc-dialog-left">
          <div class="acc-dialog-img">
            <img :src="accDialogImg" />
          </div>
        </div>
        <div class="acc-dialog-right register">
          <div class="acc-dialog-homelogo">
            <img src="../../assets/lucky-6-logo.svg" width="150" />
          </div>
          <RegisterAccount @close-dialog="registerDialogVisible = false" @open-login-dialog="openLoginDialog" />
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="captchaDialogVisible"
      title="验证码"
      width="50%"
      align-center
      style="max-width: 500px"
      :close-on-click-modal="false"
      @keydown.enter.prevent
    >
      <el-form ref="captchaRef" :rules="captchaRules" :model="captchaForm" label-width="100" label-suffix=":">
        <el-form-item tabindex="3" label="验证码" prop="captchaCode">
          <el-row :gutter="10" style="justify-content: center; align-items: center">
            <el-col :span="12">
              <el-input v-model="captchaForm.captchaCode" label="验证码" placeholder="验证码" @keyup.enter="sendOtp" />
            </el-col>
            <el-col :span="12">
              <img style="width: 50%; margin-top: 6px" :src="verificationImg" @click="getCode" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-button size="large" color="#3bafda" class="common-btn" style="margin-left: 100px" @click="sendOtp">
          发送
        </el-button>
      </el-form>
    </el-dialog>

    <el-dialog
      class="acc-dialog"
      v-model="forgetPassDialogVisible"
      width="1088px"
      align-center
      style="max-width: 1088px"
      @close="store.forgetPassDialogVisible = false"
    >
      <div class="acc-dialog-container">
        <div class="acc-dialog-left">
          <div class="acc-dialog-img">
            <img :src="accDialogImg" />
          </div>
        </div>
        <div class="acc-dialog-right">
          <div class="acc-dialog-homelogo">
            <img src="../../assets/lucky-6-logo.svg" width="150" />
          </div>
          <div class="acc-dialog-content">
            <ForgotPwdDialog @close-dialog="forgetPassDialogVisible = false" @open-login-dialog="openLoginDialog" />
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog class="noPadding" v-model="noticeDialogVisible" width="1280px" align-center style="max-width: 600px">
      <div class="noticedialog">
        <div class="title">系统提示</div>
        <div class="contents">
          尊敬的雷火会员：
          为了给您带来更好的游戏体验，请您保管好个人账户的全部信息【账户，密码，邮箱，手机】以及个人账户的隐私信息等，不要告知或泄露给其它人，我们为您提供安全的个人信息保护机制，也请您也要保护好个人的账户信息，并建议您不定期修改账户密码，以保障您的账户信息安全和资金安全，若账户信息遇到任何问题，请您立即与在线客服进行联系，给您带来的不便敬请谅解，感谢您的支持与关注！雷火娱乐
          2022/10/13
          尊敬的雷火会员：为了给您带来更好的游戏体验，请您保管好个人账户的全部信息【账户，密码，邮箱，手机】以及个人账户的隐私信息等，不要告知或泄露给其它人，我们为您提供安全的个人信息保护机制，也请您也要保护好个人的账户信息，并建议您不定期修改账户密码，以保障您的账户信息安全和资金安全，若账户信息遇到任何问题，请您立即与在线客服进行联系，给您带来的不便敬请谅解，感谢您的支持与关注！雷火娱乐
          2022/10/13
        </div>
        <el-button class="common-btn" @click="noticeDialogVisible = false">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog class="" v-model="logoutDialogVisible" width="600px" align-center>
      <div class="noticedialog">
        <div class="title">您确定要退出吗？</div>
        <div class="standard-button-container">
          <button class="standard-button btn-color-white" @click="logoutDialogVisible = false">取消</button>
          <button class="standard-button btn-color-blue" @click="onLogout()">确认</button>
        </div>
      </div>
    </el-dialog>

    <GameModal ref="modalGame"></GameModal>
  </header>
</template>

<script lang="js">
import NewMemberGuide from '@/components/home/NewMemberGuide.vue'
import "vue3-carousel/dist/carousel.css";
import { defineComponent, onMounted, ref, reactive, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "@/store";
import { getVerificationCode, register } from "@/api/index/login";
import { findAccount } from "@/api/index/forgotPwd";
import { sendSms } from "@/api/personal/personal";
import { useNotify } from "@/hooks/notify";
import GameMenu from "@/components/menu/GameMenu.vue";
import EsportsMenu from "@/components/menu/EsportsMenu.vue";
import SportsMenu from "@/components/menu/SportsMenu.vue";
import LiveCasinoMenu from "@/components/menu/LiveCasinoMenu.vue";
import LotteryMenu from "@/components/menu/LotteryMenu.vue";
import PokerMenu from "@/components/menu/PokerMenu.vue";
import FishingMenu from "@/components/menu/FishingMenu.vue";
import PromotionMenu from "@/components/menu/PromotionMenu.vue";
import AppMenu from "@/components/menu/AppMenu.vue";
import "vue3-marquee/dist/style.css";
import { useDark, useElementSize, useLocalStorage } from "@vueuse/core";
import { storeToRefs } from "pinia";
import GameModal from "@/components/modal/GameModal.vue";
import moment from "moment";
import { lsGet, lsStore, lsRemove, getTimeout } from "@/utils/utils";
import { getUnreadTotal } from "@/api/personal/mailbox";
// import LoginDialog from "@/views/logindialog/index.vue";
//TODO:Revert.
import LoginDialog from "@/views/LoginDialog.vue";
import RegisterAccount from "@/components/auth/register/index.vue";
import ForgotPwdDialog from "@/views/ForgotPwdDialog.vue";
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import floor from "lodash/floor";
import { loadPromoBanner } from "@/api/index/promo";
import LocaleChanger from '../LocaleChanger.vue';

export default defineComponent({
  name: "CommonHeader",
  components: {
    GameMenu,
    EsportsMenu,
    SportsMenu,
    LiveCasinoMenu,
    LotteryMenu,
    PokerMenu,
    FishingMenu,
    PromotionMenu,
    AppMenu,
    GameModal,
    LoginDialog,
    ForgotPwdDialog,
    RegisterAccount,
    NewMemberGuide,
    LocaleChanger
  },
  setup() {
    const notify = useNotify();

    const registerTelephoneKey = `registerTelephoneKey`;
    const registerSendOtpDisabledKey = `registeredSendOtpDisabled`;
    const imageDir = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/profile/";

    const registerSendOtpDisabledTimeout = 60;
    const registerSendOtpDisabledTimeoutLeft = getTimeout(registerSendOtpDisabledKey);

    const timestamp = moment().unix();

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

    const navigations = reactive([
      { code: "home", name: "首页", enName: "Home", path: "/home" },
      { code: "esports", name: "电竞", enName: "Esports", path: "/esports", submenu: true, isTest: false },
      { code: "sports", name: "体育", enName: "Sports", path: "/sports", submenu: true, isTest: false },
      { code: "live", name: "真人", enName: "Live", path: "/live-casino", submenu: true, isTest: false },
      { code: "poker", name: "棋牌", enName: "Poker", path: "/poker", submenu: true, isTest: false },
      { code: "slot", name: "电子", enName: "Slots", path: "/slot", submenu: true, isTest: false },
      { code: "minigame", name: "小游戏", enName: "MiniGame", path: "", submenu: false, isTest: false },
      { code: "lottery", name: "彩票", enName: "Lottery", path: "/lottery", submenu: true, isTest: false },
      { code: "fish", name: "捕鱼", enName: "Fishing", path: "/fishing", submenu: true, isTest: false },
      {
        code: "Promotion",
        name: "优惠",
        enName: "Promotion",
        path: "/promotion",
        submenu: false,
        hasicon: true,
        isTest: false
      },
      // { code: "Agent", name: "加盟", enName: "Agent", path: "/affiliate", hasicon: true, isTest: false },
      { code: "App", name: "APP", enName: "App", path: "/app", submenu: true, hasicon: true, isTest: false },
      // { code: "VIP", name: "VIP", enName: "VIP", path: "/vip", hasicon: true, isTest: false },
      { code: "CS", name: "客服", enName: "CS", path: "/cs", hasicon: true, isTest: false }
    ]);
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
    const selectedMenu = ref("");
    const { height } = useElementSize(el);
    const isDark = useDark();

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
      if (command === "logout") {
        onLogout();
      }
    };

    const showSubMenu = (nav) => {
      if (nav.submenu === true) {
        selectedMenu.value = nav.code;
      } else {
        selectedMenu.value = "";
      }
    };
    let validatePass = async (r, v) => {
      if (v === "") {
        return Promise.reject("请输入密码");
      } else {
        return validatePassStrength(r, v);
      }
    };

    let validatePassStrength = (r, v) => {
      // var strength = "";
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

      // console.log(level);

      if (pwd.length >= 6) {
        // switch (level) {
        //   case 1:
        //     strength = "weak";
        //     break;
        //   case 2:
        //     strength = "normal";
        //     break;
        //   case 3:
        //   case 4:
        //     strength = "strong";
        //     break;
        // }
        // } else {
        // strength = "weak";
        // }
        // if (strength === "weak") {
        // return Promise.reject("密码至少应该是好的");
      } else {
        return Promise.resolve();
      }
    };

    let validateName = async (r, v) => {
      if (v === "") {
        return Promise.reject("请输入登录名");
      } else if (!checkName(v)) {
        return Promise.reject("不允许使用特殊字符");
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
    const checkName = (v) => {
      const alphanumeric = /^[\p{L}\p{N}]*$/u;
      return v.match(alphanumeric);
    };
    const checkRealName = (v) => {
      const chineseCharOnly = /^[\u4e00-\u9fa5·]+$/;
      return v.match(chineseCharOnly);
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
    const loginForm = reactive({
      name: ""
    });
    const loginRef = ref([]);
    const mobileLoginRef = ref([]);
    const captchaRef = ref([]);
    const hasAffiliate = ref(false);
    const regCountdown = ref(registerSendOtpDisabledTimeoutLeft);
    const loginCountdown = ref(0);
    const loginRules = {
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
    const mobileLoginRules = {
      telephone: [
        {
          required: true,
          message: "请输入手机号码",
          trigger: "blur"
        }
      ],
      code: [
        {
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        },
        {
          min: 6,
          max: 6,
          message: "长度为 6",
          trigger: "blur"
        }
      ]
    };

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

    const regRules = {
      realName: [
        {
          required: false,
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
          min: 6,
          max: 12,
          message: "长度应为 6 至 12",
          trigger: "blur"
        },
        {
          validator: validateName,
          trigger: "change"
        }
      ],
      password: [
        {
          validator: validatePass,
          trigger: "change"
        }
        // {
        //   required: true,
        //   message: "Password is required",
        //   trigger: "blur",
        // },
        // {
        //   validator: validatePass,
        //   trigger: "change",
        // },
        // {
        //   validator: validatePassStrength,
        //   trigger: "change",
        // },
        // {
        //   min: 6,
        //   max: 12,
        //   message: "Length should be 6 to 12",
        //   trigger: "blur",
        // },
      ],
      confirmPwd: [
        // {
        //   required: true,
        //   message: "Confirm password is required",
        //   trigger: "blur",
        // },
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
      // birthday: [
      //   {
      //     required: true,
      //     message: "Birthday is required",
      //     trigger: "blur",
      //   },
      // ],
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
          message: "需要验证码",
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
    const registerRef = ref([]);
    const resetRegForm = (formEl) => {
      if (!formEl) return;
      formEl.resetFields();
    };

    const sendOtp = async () => {
      if (captchaForm.type === "REGISTER") {
        const smsDetail = {
          telephone: regForm.telephone,
          captchaCode: captchaForm.captchaCode,
          codeId: captchaForm.codeId
        };
        sendSms(smsDetail).then((response) => {
          if (response.code == 0) {
            disableSendVerificationButton.value = true;

            regForm.smsCodeId = response.data.codeId;

            notify({
              type: "success",
              message: "发送手机验证码成功"
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
        sendSms(smsDetail).then((response) => {
          if (response.code == 0) {
            loginForm.smsCodeId = response.data.codeId;
            notify({
              type: "success",
              message: "发送手机验证码成功"
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

    const submitRegisterForm = async (elForm) => {
      if (!elForm) return;
      await elForm.validate((valid) => {
        if (valid) {
          const sidParam = store.visitorId;
          (async () => {
            regForm.sid = sidParam;
            register(regForm).then((response) => {
              const regResult = response.code;
              if (regResult === 0) {
                notify({
                  type: "success",
                  message: "注册成功"
                });
                store.autoLogin(response.data);
                registerDialogVisible.value = false;
                store.regPageVisible = false;
                // loginDialogVisible.value = true;

                sessionStorage.removeItem("REFERRAL_CODE");
                // getCode();
              } else {
                getCode();
                // message.error(response.message);
              }
            });
          })();
        } else {
          getCode();
        }
      });
    };

    const modalGame = ref(null);
    const openGame = (gameName, code, gameCode) => {
      modalGame.value.open(gameName, code, gameCode);
    };

    const getPlatformListAndGoImSport = () => {
      selectedMenu.value = "";

      const fetchFunction = store.token ? getLoggedInPlatformList : getPlatformListDisplay;

      fetchFunction().then((res) => {
        const imSport = res.filter((item) => item.code === "IM");
        openGame(imSport[0].name, imSport[0].code, imSport[0].gameType);
      });
    };

    const accDialogImg = ref('')

    const loadBanners = () => {
      loadPromoBanner("LOGIN").then((res) => {
        if (res.code === 0 && res.data.length > 0) {
          const promoImageDir = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value + "/promo/";
          accDialogImg.value = promoImageDir + res.data[0].desktopImageUrl
        }
      })
    }

    onMounted(() => {
      if (regCountdown.value > 0) countdownTimer("REGISTER");
      getAffiliateCode();
      getCode();
      getReferalCode();
      loadBanners();

      if (store.token) {
        store.getBalance();
        store.getMemberInfo();

        getUnreadMail();
      }

      // if(store.loginPageVisible) {
      //   router.push('/login');
      //   return;
      // }

      if (store.loginPageVisible) {
        loginDialogVisible.value = true;
      } else {
        loginDialogVisible.value = false;
      }

      // console.log(route);
      // alert(route.name)
    });

    watch(
      () => store.loginPageVisible,
      () => {
        if (store.loginPageVisible) {
          loginDialogVisible.value = true;
          // router.push('/login');
          return;
        } else {
          loginDialogVisible.value = false;
        }
        // Optionally you can set immediate: true config for the watcher to run on init
        // }, { immediate: true });
      }
    );
    watch(
      () => store.regPageVisible,
      () => {
        if (store.regPageVisible) {
          // registerDialogVisible.value = true
          router.push("/register");
          return;
        } else {
          registerDialogVisible.value = false;
        }
        // Optionally you can set immediate: true config for the watcher to run on init
        // }, { immediate: true });
      }
    );


    watch(() => registerDialogVisible.value, () => {
      if (registerDialogVisible.value) {
        getAffiliateCode();
      }
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
    const submitForgetPass = () => {
      passRef.value.validate().then(() => {
        findAccount(passForm).then((res) => {
          if (res.code === 0) {
            notify.success("您的帐号已经发送到注册邮箱");
          }
        });
      });
    };
    const submitLogin = () => {
      loadingBtn.value = true;
      (async () => {
        const sidParam = store.visitorId;

        loginRef.value.validate().then(() => {
          store
            .memberLogin({
              loginName: loginForm.loginName,
              password: loginForm.password,
              sid: sidParam,
              captchaCode: loginForm.captchaCode,
              codeId: loginForm.codeId
            })
            .then(() => {
              // const jumpUrl = route.query.redirect ? route.query.redirect.toString() : "/home";
              if (store.token) {
                // router.push(jumpUrl);
                loginDialogVisible.value = false;
                store.loginPageVisible = false;

                sessionStorage.removeItem("REFERRAL_CODE");
                loginForm.loginName = null;
                loginForm.password = null;
                loginForm.captchaCode = null;
              } else {
                // loginForm.loginName = null
                // loginForm.password = null
                // loginForm.captchaCode = null
                getCode();
              }
            })
            .catch((error) => {
              // message.error(error.message);
              console.log(error.message);
              getCode();
            });
        });
        loadingBtn.value = false;
      })();
    };

    const phoneLogin = () => {
      loadingBtn.value = true;
      const sidParam = store.visitorId;
      (async () => {
        mobileLoginRef.value.validate().then(() => {
          store
            .telephoneLogin({
              phoneNumber: loginForm.phoneNumber,
              sid: sidParam,
              code: loginForm.code,
              smsCodeId: loginForm.smsCodeId
            })
            .then(() => {
              // const jumpUrl = route.query.redirect ? route.query.redirect.toString() : "/home";
              if (store.token) {
                // router.push(jumpUrl);
                loginDialogVisible.value = false;
                store.loginPageVisible = false;

                sessionStorage.removeItem("REFERRAL_CODE");
              } else {
                loginForm.phoneNumber = null;
                loginForm.code = null;
              }
            })
            .catch((error) => {
              // message.error(error.message);
              console.log(error.message);
            });
        });
      })();
      loadingBtn.value = false;
    };
    // const submitRegisterForm = () => {
    //   registerRef.value
    //     .validate()
    //     .then(() => {
    //     alert('!')
    //     // if (!valid) {
    //     //   notify({
    //     //     message: h('p', null, [
    //     //       h('span', null, 'Message can be ',
    //     //       h('i', { style: 'color: teal' }, 'VNode',
    //     //     ]),
    //     //   })
    //     // }
    //   })
    // }
    const pwdStrength = ref();
    const openMiniGame = () => {
      openGame("TFGaming", "TFGaming", 0);
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

    watch(
      () => regForm.password
      // () => {
      //   pwdStrength.value = "";

      //   var pwd = regForm.password;
      //   var result = 0;
      //   for (var i = 0, len = pwd.length; i < len; ++i) {
      //     result |= charType(pwd.charCodeAt(i));
      //   }

      //   var level = 0;
      //   for (i = 0; i <= 4; i++) {
      //     if (result & 1) {
      //       level++;
      //     }
      //     result = result >>> 1;
      //   }

      //   // console.log(level);

      //   if (pwd.length >= 6) {
      //     switch (level) {
      //       case 1:
      //         pwdStrength.value = "weak";
      //         break;
      //       case 2:
      //         pwdStrength.value = "normal";
      //         break;
      //       case 3:
      //       case 4:
      //         pwdStrength.value = "strong";
      //         break;
      //     }
      //   } else {
      //     pwdStrength.value = "weak";
      //   }

      //   // console.log(pwdStrength.value);
      // },
    );
    const todayDate = () => {
      return (
        "GTM+8 " +
        moment().utcOffset("+08:00").format("M/D/YYYY, h:mm:ss A ") +
        moment(new Date()).locale("zh-cn").format("dddd")
      );
    };

    const getUnreadMail = () => {
      getUnreadTotal()
        .then((response) => {
          if (response.code === 0) {
            store.unreadTotal = response.data;
          }
        })
        .catch((error) => {
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

    const loadIcon = (name) => {
      if (isDark.value) {
        try {
          return require(`@/assets/images/home/header-dropdown-${name}-icon-dark.png`);
        } catch (error) {
          return require(`@/assets/images/home/header-dropdown-${name}-icon.png`);
        }
      } else {
        return require(`@/assets/images/home/header-dropdown-${name}-icon.png`);
      }
    };

    return {
      floor,
      token,
      el,
      height,
      showSubMenu,
      goPath,
      scroll,
      selectedMenu,
      noticesList: [
        "尊敬的雷火会员：为了给您带来更好的游戏体验，请您保管好个人账户的全部信息【账户，密码，邮箱，手机】以及个人账户的隐私信息等，不要告知或泄露给其它人，我们为您提供安全的个人信息保护机制，也请您也要保护好个人的账户信息，并建议您不定期修改账户密码，以保障您的账户信息安全和资金安全，若账户信息遇到任何问题，请您立即与在线客服进行联系，给您带来的不便敬请谅解，感谢您的支持与关注！雷火娱乐 2022/10/13",
        "こんにちは",
        "bonjour",
        "안녕하세요"
      ],
      getPlatformListAndGoImSport,
      loginForm,
      loginDialogVisible,
      forgetPassDialogVisible,
      noticeDialogVisible,
      logoutDialogVisible,
      captchaDialogVisible,
      loginRef,
      mobileLoginRef,
      captchaRef,
      submitLogin,
      regForm,
      registerDialogVisible,
      submitRegisterForm,
      registerRef,
      loginRules,
      mobileLoginRules,
      imageDir,
      captchaRules,
      regRules,
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
      submitForgetPass,
      pwdStrength,
      resetRegForm,
      openGame,
      modalGame,
      todayDate,
      sendOtp,
      phoneLogin,
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
      isDark,
      timestamp,
      openMiniGame,
      navigations,
      loadIcon,
      accDialogImg
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

  // .el-dropdown {
  //   cursor: pointer;
  // }

  // .el-popper__arrow::before {
  //   display: none;
  // }

  // .el-dropdown-menu {
  //   background: #3d4145;
  //   border: 0;
  // }

  // .el-dropdown-menu__item {
  //   min-width: 130px;
  //   color: #a8b5c3;
  //   gap: 8px;
  // }

  // .el-dropdown-menu__item:not(.is-disabled):focus {
  //   background: #3a4550;
  //   color: #e1e9ee;
  // }
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
      border-radius: 50%;
      aspect-ratio: 1/1;
    }

    .dropdown-icon {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      opacity: 0;
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
        margin-right: 0.5rem;
        white-space: nowrap;
      }

      .reload-btn {
        cursor: pointer;
        fill: #468cff;
      }
    }
  }
}

.profile-info-dropdown-content {
  .profile-info-dropdown-content-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #a8b5c3;
    margin: auto;

    img {
      max-width: 33px;
    }

    &.standard-button {
      color: #468cff;
    }
  }
}

.profile-actions {
  display: flex;
  gap: 1rem;

  .action-btn {
    // height: 30px;
    gap: 2px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 0.75rem;
    color: $font-1;
    cursor: pointer;

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
      width: 16px;
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
  z-index: 999;
  transition: all 0.3s ease;

  .top-nav-wrapper {
    padding: 10px;
    background: linear-gradient(180deg, #EEF9FC 0%, #FBFFFF, 50%, #F8FDFE, 95%, #D6E8F9, 97%, #BED4E9 100%);
    position: relative;

    .top-nav-inner {
      max-width: 1300px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;

      &.logged-in-nav {
        max-width: 1400px;
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
        aspect-ratio: 97 / 38;
        height: 60px;

        img {
          width: 100%;
          display: block;
        }
      }
      .navigations {
        display: flex;
        justify-content: center;
        align-items: center;
        // width: 750px;
        // padding: 0px 16px;
        gap: 20px;
        text-align: center;
        padding: 0px 12px;

        &.second-nav {
          margin-left: auto;
          margin-right: auto;
          gap: 9px;
          padding-left: 5px;
          padding-right: 5px;
        }
        a {
          // padding-top: 10px;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          gap: 5px;
          font-family: 'PingFang SC';
          font-weight: 400;
          font-size: 12.38px;
          line-height: 100%;
          letter-spacing: 0px;
          text-align: center;
          color: #35648F;


          &.icon {
            gap: 0;
          }

          &:hover {
            //filter: brightness(0.85);

            .nav-title {
              color: #333;
              font-weight: bold;
            }
          }
          .menu-icon {
            width: 50px;
          }

          &:hover,
          &.router-link-active {
            span:first-child {
              color: $link-active;
            }

            span:last-child {
              color: $link-active;
            }

            img.hover-icon {
              filter: brightness(0) invert(41%) sepia(53%) saturate(2002%) hue-rotate(205deg) brightness(107%)
                contrast(102%);
            }
          }
        }

        .sub-menu {
          transition: $page-trans;
          background: rgba(239, 242, 245, 0.95);
          box-shadow: 0px -8px 8px 0px #c3d4e6 inset, 0px 4px 0px 0px #a7c2dd;
          backdrop-filter: blur(24.5px);
          overflow: hidden;
          height: 0px;
          position: absolute;
          left: 0;
          top: 100%;
          width: 100%;

          > div {
            max-width: 1450px;
            margin: 0 auto;
          }
        }
      }
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
    font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
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
</style>

<!-- Menu Styles -->
<style lang="scss">
.platform-menu {
  display: flex;
  margin: 0 auto;
  // max-width: 1280px;
  justify-content: space-evenly;
  align-items: center;

  a {
    text-decoration: none;
  }

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

    // &.slot-ag {
    //   background-image: url("../../../assets/game/header_slot_ag.png");
    // }

    // &.slot-pt {
    //   background-image: url("../../../assets/game/header_slot_pt.png");
    // }

    // &.slot-sw {
    //   background-image: url("../../../assets/game/header_slot_sw.png");
    // }

    // &.slot-bbin {
    //   background-image: url("../../../assets/game/header_slot_bbin.png");
    // }

    // &.slot-pg {
    //   background-image: url("../../../assets/game/header_slot_pg.png");
    // }

    // &.slot-mg {
    //   background-image: url("../../../assets/game/header_slot_mg.png");
    // }

    // &.slot-cq {
    //   background-image: url("../../../assets/game/header_slot_cq.png");
    // }

    // &.fish-ag {
    //   background-image: url("../../../assets/fishing/ag_fish_king.png");
    // }

    // &.fish-sg {
    //   background-image: url("../../../assets/fishing/sg_fish_king.png");
    // }

    // &.fish-at {
    //   background-image: url("../../../assets/fishing/at_fish_king.png");
    // }

    // &.fish-gps {
    //   background-image: url("../../../assets/fishing/gps_fish_king.png");
    // }

    // &.live-ag {
    //   background-image: url("../../../assets/live/live_ag.png");
    // }

    // &.live-allbet {
    //   background-image: url("../../../assets/live/live_allbet.png");
    // }

    // &.live-bbin {
    //   background-image: url("../../../assets/live/live_bbin.png");
    // }

    // &.live-pm {
    //   background-image: url("../../../assets/live/live_pm.png");
    // }

    // &.live-bg {
    //   background-image: url("../../../assets/live/live_bg.png");
    // }

    // &.live-sexy {
    //   background-image: url("../../../assets/live/live_sexy.png");
    // }

    // &.lottery-tcg {
    //   background-image: url("../../../assets/lottery/lottery_tcg.webp");
    // }

    // &.lottery-bbin {
    //   background-image: url("../../../assets/lottery/lottery_bbin.webp");
    // }

    // &.lottery-sgwin {
    //   background-image: url("../../../assets/lottery/lottery_sgwin.webp");
    // }
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
  font-family: "PingFang SC";

  &.el-dialog {
    box-shadow: none;
    border-radius: 20px;
    // overflow: hidden;

    .el-dialog__body {
      padding: 0;

      .acc-dialog-container {
        display: flex;
      }

      .acc-dialog-left {
        width: calc(100% - 450px);
        background-size: 100% 100%;
        background-position: center center;
        background-color: transparent;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        overflow: hidden;

        .acc-dialog-img {
          max-width: 963px;
          max-height: 896px;
          border-radius: 20px;
          height: 100%;

          img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }

      .acc-dialog-right {
        width: 460px;
        padding: 24px 24px 24px 24px;

        &.register {
          padding: 12px 24px 0;
          .primary-btn {
            margin-top: 10px;
          }
        }

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

// .register-dialog {
//   .el-dialog__header .el-dialog__headerbtn {
//     .el-dialog {
//       &__close {
//         color: #000000;
//         opacity: 0.5;

//         &:hover {
//           opacity: 1;
//           color: #000000;
//         }
//       }
//     }
//   }
// }

.mailbox-notify {
  position: relative;
  margin-right: 20px;
}

.header-btn {
  display: flex;
  min-width: 70px;
  height: 32px;
  padding: 6px 26px;
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
    color: $font-1;
  }
}

.right-contents {
  // margin-left: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.header-menu-item {
  min-width: 40px;
  position: relative;

  .promotion-icon {
    background: url('../../assets/images/home/header-icon-set.svg');
    background-position: 5% 0%;
    background-size: auto 100%;
    background-repeat: no-repeat;
    width: 38px;
    height: 38px;
  }

  .app-icon {
    background: url('../../assets/images/home/header-icon-set.svg');
    background-position: 51% 0%;
    background-size: auto 100%;
    background-repeat: no-repeat;
    width: 38px;
    height: 38px;
  }

  .cs-icon {
    background: url('../../assets/images/home/header-icon-set.svg');
    background-position: 51% 0%;
    background-size: auto 100%;
    background-repeat: no-repeat;
    width: 38px;
    height: 38px;
  }

  &.active {
    &:after {
      content: "";
      background: #468cff;
      width: 80%;
      height: 5px;
      bottom: -24px;
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      border-radius: 4px;
    }
  }
  // display: flex;
  a {
    position: relative;
  }
  .hot-label {
    width: 12px;
    height: 12px;
    position: absolute;
    right: -10px;
    top: -7px;
  }
  .nav-title {
    // position: absolute;
    // margin: 0px;
    // bottom: 12px;
    width: 100%;
    z-index: 2;
    text-align: center;
    font-family: PingFang SC;
    //color: #7A80A1;
    color: #52597d;
    font-weight: 600;
    font-size: 12px;
    margin: 0;
    display: none;
    
    &.cn {
      display: block;
      font-family: 'PingFang SC';
      font-weight: 600;
      font-size: 19px;
      line-height: 100%;
      letter-spacing: 1.68px;
      text-align: center;
    }

    &.active {
      color: #468cff;
    }
  }
}

.grid-container {
  margin: 20px auto;
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  transition: transform 0.5s;
  img {
    width: 100px;
    cursor: pointer;
    border-radius: 50%;
  }
}

.grid-item .el-image:hover {
  cursor: pointer;
}

.grid-item.selected {
  position: relative;
  color: #ffffff;
  img {
    border: 3px solid #33bc03;
  }
  &:after {
    content: "✓";
    position: absolute;
    background: #33bc03;
    font-size: 15px;
    width: 25px;
    height: 25px;
    right: 0px;
    bottom: 5px;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
}

.profile-dialog {
  max-width: 660px;
}

.profile-dialog .header {
  font-size: 20px;
}

.profile-dialog .standard-button {
  width: 400px;
  display: block;
  margin: 10px auto;
  height: unset;
  border-radius: 40px;
}
.profile-dialog .el-dialog__header .el-dialog__headerbtn .el-dialog__close {
  background: #7a8eb966;
  border-radius: 25px;
  top: 8px;
}
</style>
