<template>
  <!--  <q-page-sticky position="bottom-right" :offset="csDragPos" class="floating-btn">-->
  <!--    <div v-touch-pan.prevent.mouse="moveCsIcon" @click="openCSInNewTab(ui.CSAUrl)">-->
  <!--      <div class="cs-icon-wrapper"></div>-->
  <!--    </div>-->
  <!--  </q-page-sticky>-->
  <!--  <q-page-sticky position="bottom-right" :offset="whatDragPos" class="floating-btn">-->
  <!--    <div v-touch-pan.prevent.mouse="moveWhatsIcon" @click="openWhatsApp()">-->
  <!--      <div class="whatsapp-icon-wrapper"></div>-->
  <!--    </div>-->
  <!--  </q-page-sticky>-->

  <div class="register-container" :class="isRestrictedDomain ? 'w-domain' : ''">
    <div class="back-left" v-if="!isRestrictedDomain">
      <router-link :to="'/home'">
        <img src="../assets/images/index/btn-house.png" />
      </router-link>
    </div>
    <!-- <div class="is-domain top-img">
      <img src="../assets/images/index/register-topimg.png" />
    </div>
    <div class="no-domain register-form-logo-img">
      <img src="../assets/images/auth/b9-logo.png" />
    </div> -->
    <div class="back-btn-img" v-if="isRestrictedDomain" @click="router.replace('/')">
      <img src="../assets/images/index/btn-back.png" />
    </div>

    <!-- <div class="no-domain auth-tab-wrapper">
      <q-tabs v-model="regLoginTab" dense no-caps class="auth-tab-toggle" indicator-color="transparent" align="justify">
        <q-tab name="login" :label="$t('header.login')" />
        <q-tab name="register" :label="$t('header.register')" />
      </q-tabs>
    </div> -->
    <div class="reg-pg-title">{{ $t("header.register") }}</div>

    <div class="register-form-wrapper">
      <!-- <FloatingStickyKefu /> -->
      <q-form class="rounded-borders">
        <InputRowGrid>
          <template #fields>
            <InputField>
              <template #input>
                <q-input
                  type="tel"
                  pattern="\d*"
                  maxlength="11"
                  ref="loginNameRef"
                  hide-bottom-space
                  clearable
                  v-model="regForm.loginName"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
                    (val) => (val && val.length === 11) || $t('form.phone_rules_01'),
                    (val) => val.startsWith('03') || $t('form.phone_rules_03')
                  ]"
                  color="green"
                  outlined
                  label-color="brand"
                  :placeholder="$t('form.phone_placeholder')"
                >
                  <template v-slot:prepend>
                    <q-icon name="smartphone" />
                    <div class="prepend-number">+92</div>
                  </template>
                  <template v-if="regForm.referrer && spinRefCode" v-slot:append>
                    <q-btn :disable="otpCountdown > 0" class="get-code-btn" @click="openPhoneVeriDialog">
                      {{ otpCountdown > 0 ? `RESEND (${otpCountdown})` : $t("form.get_code") }}
                    </q-btn>
                  </template>
                </q-input>
              </template>
            </InputField>

            <InputField>
              <template #input>
                <q-input
                  ref="pwdRef"
                  hide-bottom-space
                  v-model="regForm.password"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('form.password_rules_01'),
                    (val) => val.length > 6 || $t('form.password_rules_02')
                  ]"
                  color="green"
                  outlined
                  clearable
                  label-color="brand"
                  :placeholder="$t('form.password_placeholder')"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <!-- <q-icon
                      color="gray-3"
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    /> -->
                    <img style="width: 20px;" class="cursor-pointer" @click="isPwd = !isPwd" :src="require(`../assets/images/common/visibility${isPwd?'_off':''}.png`)">
                  </template>
                </q-input>
                <!-- <div v-if="regForm.password" class="password-str-div">
                  <span
                    :class="{
                      'weak-pwd': pwdStrength == 'weak',
                      'normal-pwd': pwdStrength == 'normal',
                      'strong-pwd': pwdStrength == 'strong'
                    }"
                  >
                    Weak
                  </span>
                  <span
                    :class="{
                      'normal-pwd': pwdStrength == 'normal',
                      'strong-pwd': pwdStrength == 'strong'
                    }"
                  >
                    Good
                  </span>
                  <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">Strong</span>
                </div> -->
              </template>
            </InputField>

            <!--            -->
            <InputField v-if="regForm.referrer && regForm.smsCodeId" :label="$t('form.otp_form')">
              <template #input>
                <q-input
                  pattern="\d*"
                  maxlength="6"
                  ref="verificationRef"
                  hide-bottom-space
                  v-model="regForm.smsCode"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('form.insert_otp_num'),
                    (val) => (val && val.length === 6) || $t('form.otp_must_have_6')
                  ]"
                  color="white"
                  class="landing-input"
                  outlined
                  :placeholder="$t('form.enter_otp_num')"
                  label-color="brand"
                  :disable="isOtpEnable"
                >
                  <template v-slot:prepend>
                    <q-icon name="key" />
                  </template>
                </q-input>
              </template>
            </InputField>

            <!-- <InputField :label="'Confirm Password'">
              <template #input>
                <q-input
                  ref="confirmPwdRef"
                  hide-bottom-space
                  :type="isCfmPwd ? 'password' : 'text'"
                  v-model="regForm.confirmPwd"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please insert password',
                    (val) => val === regForm.password || 'Password does not match'
                  ]"
                  color="green"
                  outlined
                  label-color="brand"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      color="gray-3"
                      :name="isCfmPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isCfmPwd = !isCfmPwd"
                    />
                  </template>
                </q-input>
              </template>
            </InputField> -->

            <div style="visibility: hidden; position: absolute">
              <InputField :label="'Invitation Code (Optional)'">
                <template #input>
                  <q-input
                    v-if="!hasAffiliate"
                    ref="affiliateCodeRef"
                    hide-bottom-space
                    v-model="regForm.referrer"
                    label-color="brand"
                    outlined
                    color="green"
                    placeholder="Enter Invitation Code (Optional)"
                  />
                </template>
              </InputField>
            </div>
          </template>
        </InputRowGrid>

        <!-- <div style="margin-top: 30px">
          <PrimaryButton :onClick="onSubmit" :label="'Register'" :disabled="!isAgreeReg" :loading="isLoading" />
        </div> -->

        <!--
          <div class="tip-container">
          <router-link class="landing-tip" to="/login">Already A Member? Sign In Now</router-link>
        </div>
      --></q-form>
    </div>

    <div class="no-domain mui-row q-mx-md q-mb-lg" :class="isAgreeReg ? 'checked' : ''">
      <q-checkbox rounded v-model="isAgreeReg" size="md" class="rmb-checked-box">
        {{ $t("form.register_agree_01") }}
        <a href="#" style="text-decoration: none; color: #61ff00">{{ $t("form.register_agree_02") }}</a>
      </q-checkbox>
    </div>

    <router-link to="/forgot-password" class="is-domain forget-pwd">Forget password</router-link>

    <div class="no-domain bottom-btn">
      <q-btn
        class="btn-primary btn-primary__full"
        no-caps
        unelevated
        :disabled="!isAgreeReg"
        :loading="isLoading"
        @click="onSubmit"
      >
        {{ $t("btn.confirm") }}
      </q-btn>

      <div class="areyounew">
        {{ $t("btn.alreadyhaveacct") }}
        <a @click="regLoginTab = 'login'" class="green">{{ $t("btn.login") }}</a>
      </div>

      <div v-if="!isSpinReferrer" class="google-login-wrapper">
        <img v-if="languageVal === 'en'" style="width: 100%" src="../assets/images/index/logindirectly-en.svg" />
        <img v-else style="width: 100%" src="../assets/images/index/logindirectly-ur.svg" />
        <template v-if="isAndroid()">
          <q-btn no-caps unelevated class="btn-secondary btn-secondary__full" @click="onCapacitorGoogleSignin">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABd1BMVEUAAADxRznpQzXpRDXqQzXqQzXqQzXqRDbrQzTfQEDpRDbqQzXrQzX/VSvoRjbqQzXqQzXpQzfnQDjqQzTbSSTqQzXqQzXqQjTqQzTqQjTqQzXqQzXpRDT/MzPqQzTrQzb/xgD0khbrSTLqQzXrQzb8vAbqRDT7uwTwbiTtSTf6vAX7vARDhvX7vAX7vAZDhvX7vQZChPT7vARChPTzuwiCsDY3pFtEg/RChPVBhfP8uwY1p1RChfNChfRAivS5tR80qFMyqFRChfVChfRChfQzp1Q0qFM0qFMzmWYAgIA6nYFBh/BChPNAn2A0qFMzqFM0qFQ0p1MzqFMzqVM0qFNChfMA//84p1A0qFNChfRGhPY0qFM0plw9j8Iktkk0p1Q0qFM0qFM0qFIzqlUtpVozqVM0qFM0qFM0qFM0qFMzqFM0qFMzqVI1p0/qQzX7vAX5qgztVy36twdChfTfuRBXq0U0qFM/qU43oXVAieE1pV8+jsj///9xjqGrAAAAbnRSTlMAEmqx4vb022cIgPB9BiHQxhcgtAfP5JJrbOP6dQV6sAns/vtMW4Sx7w7ir2f4hn6Hh7Bw/uQORGhWWoOE/Rju+0wy9cl9+nUFAmXuVQjO5JJraYvbxgEg4eUdz+YyB4Dz+ZgPEWiv4Pb137ZzHX5o7HUAAAABYktHRHzRtiBfAAAAB3RJTUUH6AYXEzsig/8aPAAAAQJJREFUKM9jYCAAGJmYWVjZ2Jk5GFGEObnY8qCAm4cXIc7Hn4cEBARh4kIsyOJ5wiIwc0TBfDFxCUlxKSRxBh6QsLSMLIjNKycPF1dQVMrLU1bBdKhqfkFhnhoWH6jn5xdpaGKR0MrPz9eGMIvhQAfI0wVK6KFL6EMlDNAlDKFGGaFLGAN5Rvn5JqZmYAlzELAASVgCeVb5JaVl1gjH2ADFbe1AHrQvLytzcISJOzkDJVzATNcyIHBz9wCxPb28QSb5gCV8/UAyZf4BgUHBIWUVlcXFoWEQ3eERZUigqjoyCmZueDSyTEwswiVx8Qkw4cSkZJQQS0lNS8/IzMrOySWUbAAwR2hJPoYcuAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNC0wNi0yM1QxOTo1OTozMyswMDowMBiqq7wAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjQtMDYtMjNUMTk6NTk6MzMrMDA6MDBp9xMAAAAAAElFTkSuQmCC"
            />

            &nbsp;
            {{ $t("btn.signinWithGoogle") }}
          </q-btn>
        </template>
        <template v-else>
          <q-btn no-caps unelevated class="btn-secondary btn-secondary__full" @click="onClickGoogleSignin">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABd1BMVEUAAADxRznpQzXpRDXqQzXqQzXqQzXqRDbrQzTfQEDpRDbqQzXrQzX/VSvoRjbqQzXqQzXpQzfnQDjqQzTbSSTqQzXqQzXqQjTqQzTqQjTqQzXqQzXpRDT/MzPqQzTrQzb/xgD0khbrSTLqQzXrQzb8vAbqRDT7uwTwbiTtSTf6vAX7vARDhvX7vAX7vAZDhvX7vQZChPT7vARChPTzuwiCsDY3pFtEg/RChPVBhfP8uwY1p1RChfNChfRAivS5tR80qFMyqFRChfVChfRChfQzp1Q0qFM0qFMzmWYAgIA6nYFBh/BChPNAn2A0qFMzqFM0qFQ0p1MzqFMzqVM0qFNChfMA//84p1A0qFNChfRGhPY0qFM0plw9j8Iktkk0p1Q0qFM0qFM0qFIzqlUtpVozqVM0qFM0qFM0qFM0qFMzqFM0qFMzqVI1p0/qQzX7vAX5qgztVy36twdChfTfuRBXq0U0qFM/qU43oXVAieE1pV8+jsj///9xjqGrAAAAbnRSTlMAEmqx4vb022cIgPB9BiHQxhcgtAfP5JJrbOP6dQV6sAns/vtMW4Sx7w7ir2f4hn6Hh7Bw/uQORGhWWoOE/Rju+0wy9cl9+nUFAmXuVQjO5JJraYvbxgEg4eUdz+YyB4Dz+ZgPEWiv4Pb137ZzHX5o7HUAAAABYktHRHzRtiBfAAAAB3RJTUUH6AYXEzsig/8aPAAAAQJJREFUKM9jYCAAGJmYWVjZ2Jk5GFGEObnY8qCAm4cXIc7Hn4cEBARh4kIsyOJ5wiIwc0TBfDFxCUlxKSRxBh6QsLSMLIjNKycPF1dQVMrLU1bBdKhqfkFhnhoWH6jn5xdpaGKR0MrPz9eGMIvhQAfI0wVK6KFL6EMlDNAlDKFGGaFLGAN5Rvn5JqZmYAlzELAASVgCeVb5JaVl1gjH2ADFbe1AHrQvLytzcISJOzkDJVzATNcyIHBz9wCxPb28QSb5gCV8/UAyZf4BgUHBIWUVlcXFoWEQ3eERZUigqjoyCmZueDSyTEwswiVx8Qkw4cSkZJQQS0lNS8/IzMrOySWUbAAwR2hJPoYcuAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNC0wNi0yM1QxOTo1OTozMyswMDowMBiqq7wAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjQtMDYtMjNUMTk6NTk6MzMrMDA6MDBp9xMAAAAAAElFTkSuQmCC"
            />

            &nbsp;
            {{ $t("btn.signinWithGoogle") }}
          </q-btn>
        </template>
      </div>
    </div>

    <div class="is-domain bottom-btn-primary">
      <q-btn
        class="btn-primary btn-primary__full"
        no-caps
        unelevated
        :disabled="!isAgreeReg"
        :loading="isLoading"
        @click="onSubmit"
      >
        {{ $t("btn.register") }}
      </q-btn>
    </div>

    <div class="is-domain bottom-btn">
      <!-- <router-link to="/login"> -->
      <q-btn unelevated @click="router.replace('/login')">
        {{ $t("btn.login") }}
      </q-btn>
      <!-- </router-link> -->
    </div>

    <!-- <div class="is-domain has-acct">
      Already have an account?
      <router-link to="/login" class="login">Login</router-link>
    </div> -->
    <div class="no-domain btn-lists">
      <ShareIcons />
    </div>
    <div class="is-domain social-container">
      <div class="share">Share</div>
      <!-- <div class="social-items">
        <a @click="openWhatsApp()" id="Whatsapp" class="social-item">
          <img src="../assets/images/auth/social_wa.png" />
        </a>

        <a v-if="!isAndroid() && !ui.hideDownload" @click="downloadApp()" id="Download" class="social-item">
          <img src="../assets/images/auth/social_dl.png" />
        </a>
        <a @click="openYoutube()" id="Youtube" class="social-item">
          <img src="../assets/images/auth/youtube-icc.png" />
        </a>
        <a @click="openTiktok()" id="TikTok" class="social-item" target="_blank">
          <img src="../assets/images/auth/tiktok.png" />
        </a>

        <a @click="openCharity()" id="Instagram" class="social-item" target="_blank">
          <img src="../assets/images/auth/social_charity.png" />
        </a>
      </div> -->
      <div class="btn-lists">
        <div class="list-item" @click="openWhatsApp()">
          <img class="btn-icon" id="whatapp-icon" src="../assets/images/auth/whatsapp-icon.png" />
          <div>WhatsApp</div>
        </div>
        <div class="list-item" @click="openCharity()">
          <img class="btn-icon" id="charity-icon" src="../assets/images/auth/charity-icon.png" />
          <div>Charity</div>
        </div>
        <div class="list-item" @click="openYoutube()">
          <img class="btn-icon" id="youtube-icon" src="../assets/images/auth/youtube-icon.png" />
          <div>Youtube</div>
        </div>
        <div class="list-item" @click="openTiktok()">
          <img class="btn-icon" id="tiktok-icon" src="../assets/images/auth/icon-tiktok.png" />
          <div>TikTok</div>
        </div>
        <div class="list-item" v-if="!isAndroid() && !ui.hideDownload" @click="downloadApp()">
          <img class="btn-icon" id="download-icon" src="../assets/images/auth/app-icon.png" />
          <div>{{ $t("btn.downloadApp") }}</div>
        </div>
      </div>
    </div>

    <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss>
      <q-card class="captcha-form-wrapper" width="100%">
        <q-card-section class="q-pa-md text-white">
          <q-toolbar>
            <q-toolbar-title>{{ $t("form.verificationCode") }}</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-card-section>
        <div class="q-px-lg q-pt-sm q-pb-lg">
          <q-card-section class="q-mb-md q-pa-md">
            <q-input v-model="innerCaptchaRef" :placeholder="$t(`form.captchaCode`)">
              <template v-slot:append>
                <img
                  v-show="showImageCode"
                  :src="phoneVerificationImg"
                  @load="imgOnLoad"
                  @error="imgOnError"
                  :title="$t(`form.refresh_veri_code`)"
                  style="margin-top: 6px; cursor: pointer"
                  @click="getInnerCode"
                />
              </template>
            </q-input>
          </q-card-section>
          <q-btn class="get-code-btn" @click="onCaptchaSubmit" :label="$t(`form.send_otp`)" />
        </div>
      </q-card>
    </q-dialog>
    <!-- <div class="no-domain bottom-img">
      <img src="../assets/images/auth/login-img2.png" />
    </div> -->
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, computed, watch, onActivated, onUnmounted } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import qs from "qs";
import InputField from "../components/auth/InputField.vue";
import InputRowGrid from "../components/auth/InputRowGrid.vue";
import { useUI } from "stores/ui";
import { cached, TIME_EXPIRED } from "boot/cache";
import { isAndroid, isInPwa, generateEventID } from "boot/utils";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useI18n } from "vue-i18n";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { i18nStore } from "src/router/language";
import { storeToRefs } from "pinia";
import ShareIcons from "src/components/LoginAndRegisterShareIcons.vue";
// import FloatingStickyKefu from "../components/auth/FloatingStickyKefu.vue";

export default defineComponent({
  name: "RegisterPage",
  methods: { isAndroid },
  components: {
    InputRowGrid,
    InputField,
    ShareIcons,
    // FloatingStickyKefu
    // PrimaryButton
  },
  setup() {
    const { t } = useI18n();
    const ui = useUI();
    const store = userStore();
    const i18nStoreLanguage = i18nStore();
    const { languageVal } = storeToRefs(i18nStoreLanguage);
    const verificationImg = ref("");

    const captchaRef = ref();
    const innerCodeId = ref("");
    const innerCaptchaRef = ref("");
    const showCaptchaDialog = ref(false);
    const phoneVerificationImg = ref("");
    const isAgreeReg = ref(true);

    const showImageCode = ref(false);

    const otpCountdown = ref();
    const otpCountdownInterval = ref();

    const affCode = ref("");
    const isLoading = ref(false);

    const isOtpEnable = ref(true);

    const spinRefCode = ref("");

    const regForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      telephone: "",
      // nric: "",
      // email: "",
      captchaCode: "0000",
      regHost: location.hostname,
      codeId: "",
      codeAffiliate: "",
      referrer: "",
      smsCodeId: "",
      smsCode: "",
      traceId: ""
    });
    const getCode = () => {
      // api
      //   .get("/member/verificationCode")
      //   .then((response) => {
      //     if (response.code === 0) {
      //       verificationImg.value = "data:image/png;base64," + response.data.img;
      //       regForm.codeId = response.data.id;
      //       regForm.captchaCode = "0000";
      //       // verificationRef.value.resetValidation();
      //     }
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
    };

    const imgOnLoad = () => (showImageCode.value = true);
    const imgOnError = () => (showImageCode.value = false);

    const openPhoneVeriDialog = () => {
      isOtpEnable.value = false;
      loginNameRef.value.validate();
      if (!loginNameRef.value.hasError) {
        showCaptchaDialog.value = true;
        getInnerCode();
      }
    };

    const getInnerCode = () => {
      api
        .get("/member/verificationCode")
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
    const isSpinReferrer = ref(false);
    const getAffiliateCode = () => {
      affCode.value = sessionStorage.getItem("AFFILIATE_CODE");
      // if (affCode.value) {
      // hasAffiliate.value = true;
      // }
      regForm.codeAffiliate = affCode.value;
    };
    const getReferralCode = () => {
      const refCode = sessionStorage.getItem("REFERRAL_CODE");
      if (refCode) {
        // hasAffiliate.value = true;
        regForm.referrer = refCode;
        thirdPartyLoginInfo.referrer = refCode;
      }
      const pwaRefCode = localStorage.getItem("PWA_REFERRAL_CODE");
      if (pwaRefCode) {
        // hasAffiliate.value = true;
        regForm.referrer = pwaRefCode;
      }
      spinRefCode.value = sessionStorage.getItem("REFERRAL_SPIN_CODE");
      if (spinRefCode.value) {
        isSpinReferrer.value = true;
        regForm.referrer = spinRefCode.value;
        thirdPartyLoginInfo.referrer = refCode;
      }
    };

    const loginNameRef = ref();
    const pwdRef = ref();
    const confirmPwdRef = ref();
    // const nricRef = ref();
    // const telRef = ref();
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
      const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      return phonePattern.test(regForm.telephone) || "请输入有效的电话号码";
    };

    const isValidName = (value, translation) => {
      const namePattern = /^[A-Za-z0-9]+$/;
      return namePattern.test(value) || `${translation} must be alphanumeric`;
    };

    const isAlphanumeric = (value, translation) => {
      const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
      // const passwordPattern = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]+$/i;
      return passwordPattern.test(value) || `${translation} must at least contain letters and numbers.`;
    };

    // const phoneNumberRules = [
    //   (val) => (val && val.length > 0) || "Please insert Phone number",
    //   (val) => (val && val.length === 11) || "The phone number must have 11 digits",
    //   (val) => (val && val.startsWith("03")) || 'The phone number must start with "03"'
    // ];

    const router = useRouter();

    const affRegEvent = ref("");

    const thirdPartyLoginInfo = reactive({
      sid: "",
      way: "ANDROID"
    });

    onActivated(() => {
      getCode();
      getReferralCode();
      getAffiliateCode();

      if (isAndroid()) {
        GoogleAuth.initialize();
      }
    });

    const onCapacitorGoogleSignin = async () => {
      try {
        const user = await GoogleAuth.signIn();

        (() => {
          thirdPartyLoginInfo.siteId = process.env.SITEID;
          thirdPartyLoginInfo.thirdParty = "GOOGLE";
          thirdPartyLoginInfo.sid = store.googleadid ? store.googleadid : store.aaid;
          thirdPartyLoginInfo.traceId = store.googleadid ? store.googleadid : store.aaid;
          thirdPartyLoginInfo.accessToken = user.authentication.accessToken;
          thirdPartyLoginInfo.idToken = user.authentication.idToken;

          api
            .post("/member/thirdPartyLogin", qs.stringify(thirdPartyLoginInfo))
            .then((ret) => {
              const res = ret;
              console.log("res:", res);

              if (res.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: t("form.google_login_success"),
                  icon: "check_circle_outline"
                });

                if (res.data?.isFirstTime) {
                  trackRegisterSuccessEvent();
                }

                store.autoLogin(res.data?.token || res.data);
                sessionStorage.removeItem("REFERRAL_CODE");
                if (store.hasToken()) {
                  router.push("/home");
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
              $q.loading.hide();
            });
          // getCode();
        })();
      } catch (error) {
        console.error("Google Sign-In error:", error);
        alert(error);
      }
    };

    const onClickGoogleSignin = async () => {
      const provider = await new GoogleAuthProvider();
      return signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access Google APIs.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...

          (async () => {
            thirdPartyLoginInfo.siteId = process.env.SITEID;
            thirdPartyLoginInfo.thirdParty = "GOOGLE";
            thirdPartyLoginInfo.sid = store.googleadid ? store.googleadid : store.aaid;
            thirdPartyLoginInfo.traceId = store.googleadid ? store.googleadid : store.aaid;
            thirdPartyLoginInfo.accessToken = credential.accessToken;
            thirdPartyLoginInfo.idToken = credential.idToken;

            api
              .post("/member/thirdPartyLogin", qs.stringify(thirdPartyLoginInfo))
              .then((ret) => {
                const res = ret;
                console.log("res:", res);

                if (res.code === 0) {
                  $q.notify({
                    color: "positive",
                    position: "top",
                    message: t("form.google_login_success"),
                    icon: "check_circle_outline"
                  });

                  if (res.data?.isFirstTime) {
                    trackRegisterSuccessEvent();
                  }

                  store.autoLogin(res.data?.token || res.data);
                  sessionStorage.removeItem("REFERRAL_CODE");
                  if (store.hasToken()) {
                    router.push("/home");
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
                $q.loading.hide();
              });
            // getCode();
          })();
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    };

    const isRegisterAdjustSent = ref(false);
    const trackRegisterSuccessEvent = () => {
      if (isRegisterAdjustSent.value || !ui.adjust_register_event) return;
      isRegisterAdjustSent.value = true;

      if (isInPwa()) {
        console.log(ui.adjust_register_event);
        const AdjustWeb = require("@adjustcom/adjust-web-sdk");
        AdjustWeb.trackEvent({
          eventToken: ui.adjust_register_event
        });
      } else if (Platform.is.android && Platform.is.capacitor) {
        var adjustEvent = new AdjustEvent(ui.adjust_register_event);
        // alert(affRegEvent.value);
        Adjust.trackEvent(adjustEvent);
      } else {
        const AdjustWeb = require("@adjustcom/adjust-web-sdk");
        AdjustWeb.trackEvent({
          eventToken: ui.adjust_register_event
        });
      }
    };

    const onSubmit = () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();

      verificationRef.value?.validate();

      $q.loading.show({
        message: t("form.register_in_progress")
      });

      isLoading.value = true;

      if (
        loginNameRef.value.hasError ||
        pwdRef.value.hasError ||
        verificationRef.value?.hasError ||
        isAgreeReg.value === false
      ) {
        $q.loading.hide();
        isLoading.value = false;
      } else if (regForm.referrer && isSpinReferrer.value === true && regForm.smsCodeId && isOtpEnable.value) {
        $q.notify({
          color: "negative",
          position: "top",
          message: t("form.fill_in_otp"),
          icon: "report_problem"
        });
        $q.loading.hide();
        isLoading.value = false;
      } else {
        var qs = require("qs");
        const sidParam = store.googleadid || store.aaid || store.visitorId;

        (async () => {
          if (store.aaid) {
            regForm.traceId = store.aaid;
          }
          regForm.sid = sidParam;

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
            .post("/member/indRegister", qs.stringify(regForm))
            .then((ret) => {
              const res = ret;
              if (res.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: t("form.register_success"),
                  icon: "check_circle_outline"
                });
                localStorage.setItem("newPlayerGuide", 1);
                //FB Tracking.
                if (store.isFbPixel || store.isTkPixel) {
                  if (store.isFbPixel) {
                    fbq("track", "CompleteRegistration");
                  }
                  if (store.isTkPixel) {
                    ttq.track("CompleteRegistration", { content_type: "product" }, { event_id: Date.now() });
                  }

                  localStorage.setItem("newUserFtd", regForm.loginName);
                  localStorage.setItem("REG_REFERRAL_CODE", regForm.referrer);
                }

                trackRegisterSuccessEvent();

                sessionStorage.removeItem("REFERRAL_CODE");
                localStorage.removeItem("PWA_REFERRAL_CODE");

                store.autoLogin(res.data);
                if (store.hasToken()) {
                  const jumpUrl = route.query.redirect ? route.query.redirect : "/";
                  router.push({ path: jumpUrl, query: { register: "true" } });
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
              isLoading.value = false;
            })
            .catch((error) => {
              $q.loading.hide();
              isLoading.value = false;
            });

          // register to check phone exist and sms OTP -- start
          // api
          //   .get(`/member/checkPhoneRegisterStatus?siteId=11&phone=${regForm.loginName}`)
          //   .then((ret) => {
          //     const res = ret;

          //     if (res.code === 0 && !res.data) {
          //       $q.notify({
          //         color: "positive",
          //         position: "top",
          //         message: "Please proceed to OTP",
          //         icon: "check_circle_outline"
          //       });
          //       console.log(res, "-ressss");
          //       sessionStorage.setItem("REG_FORM", qs.stringify(regForm));
          //       sessionStorage.removeItem("REFERRAL_CODE");

          //       api
          //         .post(
          //           `/otp/sendSms`,
          //           qs.stringify({
          //             telephone: regForm.loginName,
          //             captchaCode: '0000',
          //             codeId: '0000'
          //           })
          //         )
          //         .then((res) => {
          //           getCode();
          //           let message = res.message || "Phone verification code sent successfully",
          //             color = "positive";

          //           if (res.code === 0) {
          //             console.log(res.data.codeId);
          //           }
          //           if (message) {
          //             $q.notify({ message, color });
          //           }

          //           console.log("onCaptchaSubmit", res);
          //         })
          //         .catch(() => {
          //           console.log("Err");
          //           getInnerCode();
          //         });

          //       router.push("/verification");
          //     } else {
          //       $q.notify({
          //         color: "negative",
          //         position: "top",
          //         message: res.message,
          //         icon: "report_problem"
          //       });
          //     }
          //     $q.loading.hide();
          //     isLoading.value = false;
          //   })
          //   .catch((error) => {
          //     $q.loading.hide();
          //     isLoading.value = false;
          //   });
          // register to check phone exist and sms OTP -- end

          getCode();
        })();
      }
    };

    // watch(
    //   () => regForm.password,
    //   () => {
    //     pwdStrength.value = "";

    //     var pwd = regForm.password;
    //     var result = 0;
    //     for (var i = 0, len = pwd.length; i < len; ++i) {
    //       result |= charType(pwd.charCodeAt(i));
    //     }

    //     var level = 0;
    //     for (var i = 0; i <= 4; i++) {
    //       if (result & 1) {
    //         level++;
    //       }
    //       result = result >>> 1;
    //     }
    //     if (pwd.length >= 6) {
    //       switch (level) {
    //         case 1:
    //           pwdStrength.value = "weak";
    //           break;
    //         case 2:
    //           pwdStrength.value = "normal";
    //           break;
    //         case 3:
    //         case 4:
    //           pwdStrength.value = "strong";
    //           break;
    //       }
    //     } else {
    //       pwdStrength.value = "weak";
    //     }
    //   }
    // );

    // const openPhoneVeriDialog = () => {
    //   loginNameRef.value.validate();
    //   if (!loginNameRef.value.hasError) {
    //     openVerificationCodeDialog();
    //     getInnerCode();
    //   }
    // };

    const verificationCodeDialog = ref(false);
    const openVerificationCodeDialog = () => {
      verificationCodeDialog.value = !verificationCodeDialog.value;
      captchaRef.value = "";
      getCode();
    };

    const onCaptchaSubmit = () => {
      if (!regForm.loginName) {
        $q.notify({
          color: "negative",
          position: "top",
          message: t("form.phone_cannot_empty"),
          icon: "report_problem"
        });
        getInnerCode();
        return;
      }
      api
        .post(
          `/otp/sendSms`,
          qs.stringify({
            telephone: regForm.loginName,
            captchaCode: innerCaptchaRef.value,
            codeId: innerCodeId.value
          })
        )
        .then((res) => {
          let message = res.message || t("form.otp_sent_phone_success"),
            color = "positive";

          if (res.code === 0) {
            showCaptchaDialog.value = false;
            regForm.smsCode = "";
            regForm.smsCodeId = res.data.codeId;
            console.log(res.data.codeId);

            // start otp countdown
            otpCountdown.value = res.data.second || 60;
            otpCountdownInterval.value = setInterval(() => {
              if (otpCountdown.value > 0) {
                otpCountdown.value = otpCountdown.value - 1;
              }
            }, 1000);
          } else {
            color = "negative";
            if (res.code === 1402) {
              message = t('notify.tryagain', { seconds: res.data.second });

              // start otp countdown
              otpCountdown.value = res.data.second || 60;
              otpCountdownInterval.value = setInterval(() => {
                if (otpCountdown.value > 0) {
                  otpCountdown.value = otpCountdown.value - 1;
                }
              }, 1000);
            }
            getInnerCode();
          }

          if (message) {
            $q.notify({ message, color, position: "top" });
          }

          console.log("onCaptchaSubmit", res);
        })
        .catch(() => {
          getInnerCode();
        });
    };

    const isValidPhone = () => {
      const { phone } = formDetail;

      if (!phone) {
        return "Please Enter Phone Number";
      }

      const phoneRegex = /^\d{11,20}$/;
      const isValid = phoneRegex.test(phone);

      return isValid ? true : "Phone Number must be 11 digits or more";
    };

    const regLoginTab = ref("register");

    // sticky cs
    const csDragPos = ref([10, 30]);
    const whatDragPos = ref([15, 110]);

    const isDraggingCsIcon = ref(false);
    const openCSInNewTab = (url) => {
      const absoluteUrl = url;
      window.open(absoluteUrl, "_blank");
    };
    const moveWhatsIcon = (ev) => {
      isDraggingCsIcon.value = ev.isFirst !== true && ev.isFinal !== true;
      whatDragPos.value = [whatDragPos.value[0] - ev.delta.x, whatDragPos.value[1] - ev.delta.y];
    };
    const openWhatsApp = () => {
      window.open(ui.whatsappUrl, "_blank");
    };

    const openInsta = () => {
      window.open(ui.instagramUrl, "_blank");
    };

    const openTiktok = () => {
      window.open(ui.tiktokUrl, "_blank");
    };

    const openYoutube = () => {
      window.open(ui.youtubeUrl, "_blank");
    };

    const openCharity = () => {
      window.open(ui.charityUrl, "_blank");
    };

    const moveCsIcon = (ev) => {
      isDraggingCsIcon.value = ev.isFirst !== true && ev.isFinal !== true;

      csDragPos.value = [csDragPos.value[0] - ev.delta.x, csDragPos.value[1] - ev.delta.y];
    };

    const downloadApp = () => {
      if (ui.downloadAppUrl) {
        window.open(ui.downloadAppUrl, "_blank");
      } else {
        ui.getTopDownloadUrl().then(() => window.open(ui.downloadAppUrl, "_blank"));
      }
    };

    const loadCustomerAddress = () => {
      cached
        .get("customerAddress", () =>
          api.get("/config/customerAddress/v2").then((res) => {
            return res;
          })
        )
        .then((data) => {
          console.log(data);
          var url = data.liveUrl1;
          ui.CSAUrl = url;
        });
    };

    watch(
      () => regLoginTab.value,
      () => {
        if (regLoginTab.value === "login") {
          router.push("/login");
          regLoginTab.value = "register";
        }
      }
    );

    //Put this when u need to test on localhost.
    // "localhost",
    const restrictedDomains = [];
    const isRestrictedDomain = computed(() => {
      const currentDomain = window.location.hostname;
      return restrictedDomains.includes(currentDomain);
    });

    watch(
      () => otpCountdown.value,
      () => {
        if (otpCountdown.value === 0) {
          clearInterval(otpCountdownInterval.value);
        }
      }
    );

    onUnmounted(() => {
      clearInterval(otpCountdownInterval.value);
    });

    return {
      header: "Register Account",
      regForm,
      verificationImg,
      loginNameRef,
      pwdRef,
      confirmPwdRef,
      // nricRef,
      // telRef,
      emailRef,
      verificationRef,
      onSubmit,
      isValidEmail,
      isPwd: ref(true),
      isCfmPwd: ref(true),
      getCode,
      getInnerCode,
      pwdStrength,
      showCaptchaDialog,
      onCaptchaSubmit,
      innerCaptchaRef,
      phoneVerificationImg,
      // openPhoneVeriDialog,
      phoneVerificationRef,
      isValidCnPhone,
      hasAffiliate,
      isAgreeReg,
      isAlphanumeric,
      isValidName,
      isValidPhone,
      affRegEvent,
      isLoading,
      regLoginTab,
      csDragPos,
      isDraggingCsIcon,
      openCSInNewTab,
      moveCsIcon,
      openInsta,
      loadCustomerAddress,
      ui,
      moveWhatsIcon,
      whatDragPos,
      openWhatsApp,
      openTiktok,
      openYoutube,
      openCharity,
      downloadApp,
      isRestrictedDomain,
      router,
      onClickGoogleSignin,
      onCapacitorGoogleSignin,
      languageVal,
      isSpinReferrer,
      otpCountdown,
      otpCountdownInterval,
      isOtpEnable,
      openPhoneVeriDialog,
      imgOnLoad,
      imgOnError,
      showImageCode,
      spinRefCode
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

<style scoped lang="scss">
.auth-tab-wrapper {
  width: 90%;
  margin: 0 auto;

  .q-tab {
    min-height: 45px;
    border-radius: 8px;
    color: #5f6061;
    font-weight: 400;
    width: 50%;
  }

  .auth-tab-toggle {
    // background: url(../assets/images/auth/auth-tab-active.png) no-repeat center center;
    // background-size: 100% 100%;
    border-radius: 8px;
    margin-bottom: 4px;
    margin-top: 0px;
    padding: 1px;

    :deep(.q-tab__label) {
      font-weight: 400;
    }

    :deep(.q-tab--active) {
      color: white;
      background: url(../assets/images/auth/auth-tab-active.png) no-repeat center center;
      background-size: 100% 100%;
    }

    :deep(.q-tab--active .q-tab__label) {
      font-weight: 700 !important;
    }
  }
}

.get-code-btn {
  background: linear-gradient(90deg, #2ced88 0%, #9ee871 100%);
  color: #000000;
  box-shadow: 0px 2px 0px 0px #1cca6a;
  min-width: 100px;
  max-width: 120px;
  font-weight: bold;
}

.register-container {
  min-height: 100dvh;
  // padding: 16px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  background: url("../assets/images/auth/top-login-bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  // padding-top: 250px;
  padding-top: 265px;
  padding-bottom: 20px;

  @media screen and (max-width: 400px) {
    padding-top: 235px;
  }

  .is-domain {
    display: none;
  }
  .no-domain {
    display: unset;

    @media screen and (max-width: 400px) {
      margin-bottom: 10px;
    }

    &.btn-lists {
      display: flex;
      width: 95%;
      margin: 0 auto;
    }
  }
  &.w-domain {
    background: url("../assets/images/auth/trianglebg.png");
    background-size: 100% 100%;
    padding-top: 0;
    .no-domain {
      display: none;
    }
    .is-domain {
      display: block;
      &.top-img {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        img {
          width: calc(100% - 32px);
          margin-left: -5px;
        }
      }
    }

    .bottom-btn {
      border: 2px solid transparent;
      border-radius: 4px;
      background-image: linear-gradient(#131313, #131313), linear-gradient(180deg, #33b085 0%, #68bd5c 100%);
      background-origin: border-box;
      background-clip: content-box, border-box;
      margin: 3px 20px 8px;
      padding: 0;

      .q-btn {
        height: 44px;
        width: 100%;
        :deep(.q-btn__content) {
          background: linear-gradient(90deg, #29ed89 0%, #97e872 100%);
          -webkit-background-clip: text;
          color: transparent;
          font-weight: bolder;
          font-size: 16px;
        }
      }
    }
    .bottom-btn-primary {
      border: none;
      padding: 3px 20px 8px;
      .btn-primary {
        background: linear-gradient(90deg, #29ed89 0%, #97e872 100%);
        color: #000a01;
      }
      :deep(.q-btn__content) {
        font-weight: bolder;
        font-size: 16px;
      }
    }

    .has-acct {
      width: 90%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 5px;
      margin: 10px auto;
      color: #9f9f9f;
      a {
        color: #83e977;
      }
    }
    .forget-pwd {
      color: #9f9f9f;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin: 0 20px 20px;
    }
    .social-container {
      margin: 10px auto;
      width: 95%;
      position: sticky;
      top: calc(100vh - 70px);
      left: 0;
      right: 0;
      .share {
        display: flex;
        align-items: center;
        padding: 10px;
        gap: 10px;
        color: #ffffff33;
        &:before,
        &:after {
          content: "";
          width: 100%;
          flex: 1;
          height: 1px;
          background-color: #ffffff33;
        }
      }
      .social-items {
        display: flex;
        justify-content: space-between;
        width: 95%;
        margin: 0 auto;
        align-items: center;
        .social-item {
          border: 1px solid #ffffff33;
          padding: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 8px;
          animation: smallbeat 2s infinite;
        }
      }
      .btn-lists {
        margin: 0;
      }
    }
  }
}

.back-left {
  position: fixed;
  top: 15px;
  right: 15px;
  width: 30px;
  img {
    width: 100%;
  }
}

.register-form-logo-img {
  margin-top: -10px;
  padding: 0 16px;
  display: flex;
  justify-content: center;
  text-align: center;
  img {
    display: inline-block;
    width: 100%;
    max-width: 140px;
    margin-bottom: 10px;
  }
}

.back-btn-img {
  cursor: pointer;
  position: absolute;
  top: 14px;
  right: 14px;
  img {
    width: 2.25rem;
  }
}
.reg-pg-title {
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0px;
  vertical-align: middle;
  color: #ffffff;
  padding: 0 20px;
}

.register-form-wrapper {
  padding: 0 20px 5px;

  :deep(.q-field__control) {
    height: 45px;

    .q-field__marginal {
      height: 45px;
    }
  }
}

.page-header {
  background-image: linear-gradient(to right, #de4545, #db7e42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 28px;
  text-align: center;
  font-family: "Manrope", sans-serif;
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
  }

  span.weak-pwd {
    background: var(--q-negative);
  }

  span.normal-pwd {
    background: var(--q-warning);
    color: #000000;
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

.rmb-checked-box {
  font-size: 14px;
  color: #eeeeee;

  @media screen and (max-width: 400px) {
    font-size: 12px;
  }

  :deep(.q-checkbox__bg) {
    border-radius: 4px;
  }
  :deep(.q-checkbox__inner--truthy .q-checkbox__bg) {
    background: #21ef89;

    svg {
      color: #000000;
      padding: 2px;
    }
  }
}

.tip-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-bottom: 24px;
}

.landing-tip {
  color: #fae576;
  text-decoration: none;
  font-weight: 700;
}

.prepend-number {
  font-size: 14px;
  color: #ffffff;
  margin-left: 8px;
}
.verify-btn {
  color: #21ef89;
  font-family: Poppins;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: -0.08%;
  text-align: right;
  text-transform: capitalize;
}

.q-icon {
  color: rgba(255, 255, 255, 0.3);
}

:deep(.q-tab__label) {
  color: #ffffff;
}

.bottom-btn {
  // margin-top: auto;
  padding: 3px 20px 8px;
}

.btn-lists {
  display: flex;
  justify-content: space-evenly;
  gap: 0px;
  width: 100%;
  margin: 10px auto;
  align-items: flex-start;
  text-align: center;
  .list-item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 8px;
    color: #9f9f9f;
    font-size: 11px;
    flex: 1;
  }

  .btn-icon {
    width: 42px;
    height: 42px;

    &:active {
      filter: brightness(0.85);
      transform: translate(0px, 1px);
    }
  }
  #cs-icon {
    width: 70px;
    height: 70px;
  }
  #whatapp-icon {
    margin-top: 10px;
    animation: smallbeat 2s infinite;
  }
  #charity-icon {
    margin-top: 10px;
    animation: smallbeat 2s infinite;
    animation-delay: 0.4s;
  }
  #youtube-icon {
    margin-top: 10px;
    animation: smallbeat 2s infinite;
    animation-delay: 0.8s;
  }
  #tiktok-icon {
    margin-top: 10px;
    animation: smallbeat 2s infinite;
    animation-delay: 1.2s;
  }
  #download-icon {
    margin-top: 10px;
    animation: smallbeat 2s infinite;
    animation-delay: 1.6s;
    //filter: brightness(0) invert(50%) sepia(11%) saturate(3258%) hue-rotate(77deg) brightness(122%) contrast(75%);;
  }
}


.q-btn {
    @media screen and (max-width: 400px) {
      min-height: 35px;
      height: 35px;
    }

  :deep(.q-btn__content) {
    @media screen and (max-width: 400px) {
      font-size: 13px;
    }
  }
}

.bottom-btn-primary {
  .btn-primary {
    @media screen and (max-width: 400px) {
      min-height: 35px;
      height: 35px;
    }
  }
  :deep(.q-btn__content) {
    @media screen and (max-width: 400px) {
      font-size: 13px;
    }
  }
}

.bottom-img {
  text-align: center;
  margin-top: 28px;
}

.cs-icon-wrapper {
  display: flex;
  width: 70px;
  height: 76px;
  background: url("../assets/images/index/icon-cs.gif") no-repeat center center;
  background-size: contain;

  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }
}

.whatsapp-icon-wrapper {
  display: flex;
  width: 60px;
  height: 60px;
  background: url("../assets/images/auth/whatsapp-icon.png") no-repeat center center;
  background-size: contain;
  animation: smallbeat 2s infinite;

  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }
}

@keyframes smallbeat {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  14% {
    -webkit-transform: scale(1.2);
    transform: scale(1.3);
  }

  28% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  42% {
    -webkit-transform: scale(1.2);
    transform: scale(1.3);
  }
  70% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.captcha-form-wrapper {
  background: #0b0e0d;

  :deep(.q-toolbar) {
    background: #232325;
  }
}

.areyounew {
  margin: 15px 0;

  @media screen and (max-width: 400px) {
    margin: 10px 0;
    font-size: 12px;
  }

  .green {
    color: #21ef89;
    font-weight: 700;
    cursor: pointer;
  }
}
.google-login-wrapper {
  display: flex;
  flex-direction: column;
  // gap: 10px;
  margin-top: 25px;
  img {
    margin-bottom: 10px;
  }
}
</style>
