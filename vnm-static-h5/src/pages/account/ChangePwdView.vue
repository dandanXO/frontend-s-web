<template>
  <q-page>
    <div class="chgpwd-tabs-div">
      <div class="chgpwd-item" @click="goToTab('tabPassword')" :class="chgpwdTab === 'tabPassword' ? 'is-active' : ''">
        <span>{{ $t("lang.chgpwd_password") }}</span>
      </div>

      <div
        class="chgpwd-item"
        @click="goToTab('tabWithdrawPassword')"
        :class="chgpwdTab === 'tabWithdrawPassword' ? 'is-active' : ''"
      >
        <span>{{ $t("lang.chgpwd_withdraw_password") }}</span>
      </div>
    </div>

    <template v-if="chgpwdTab === 'tabPassword'">
      <q-form @submit="submitUpdatePwd">
        <div class="change-pwd">
          <q-label>
            {{ $t("lang.chgpwd_please_enter_old_password") }}
            <em>*</em>
          </q-label>
          <q-input
            ref="oldPasswordRef"
            standout
            v-model="formChgAccountPwd.oldPassword"
            class="q-pb-xs"
            hide-bottom-space
            :type="isPwd ? 'password' : 'text'"
            :label="$t('lang.chgpwd_old_password')"
            lazy-rules
            clearable
            :rules="[(val) => (val && val.length > 0) || $t('lang.chgpwd_please_enter_old_password')]"
          >
            <template v-slot:append>
              <q-icon
                color="dark"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-label>
            {{ $t("lang.chgpwd_please_enter_new_password") }}
            <em>*</em>
          </q-label>
          <q-input
            ref="passwordRef"
            standout
            v-model="formChgAccountPwd.password"
            class="q-pb-xs"
            hide-bottom-space
            :type="isPwd ? 'password' : 'text'"
            :label="$t('lang.chgpwd_new_password')"
            lazy-rules
            clearable
            :rules="[(val) => (val && val.length > 0) || $t('lang.chgpwd_please_enter_new_password')]"
          >
            <template v-slot:append>
              <q-icon
                color="dark"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-label>
            {{ $t("lang.chgpwd_please_enter_confirm_password") }}
            <em>*</em>
          </q-label>
          <q-input
            ref="confirmPasswordRef"
            standout
            v-model="formChgAccountPwd.confirmNewPwd"
            class="q-pb-xs"
            hide-bottom-space
            :type="isPwd ? 'password' : 'text'"
            :label="$t('lang.chgpwd_confirm_password')"
            lazy-rules
            clearable
            :rules="[
              (val) => (val && val.length > 0) || $t('lang.chgpwd_please_enter_confirm_password'),
              (val) => val === formChgAccountPwd.password || $t('lang.chgpwd_confirm_password_not_match')
            ]"
          >
            <template v-slot:append>
              <q-icon
                color="dark"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>
        <div class="box-width">
          <q-btn
            type="submit"
            class="common-large-btn"
            no-caps
            :label="$t('lang.chgpwd_confirm')"
            width="100%"
            style="width: 100%"
          />
        </div>
      </q-form>
    </template>

    <template v-if="chgpwdTab === 'tabWithdrawPassword'">
      <q-form @submit="submitUpdateWithdrawPwd">
        <div class="change-pwd">
          <template v-if="store.registeredWithdrawPassword && secondCodeId == null && !isForgotWithdrawPassword">
            <q-label>
              {{ $t("lang.chgpwd_please_enter_old_withdraw_password") }}
              <em>*</em>
            </q-label>
            <q-input
              ref="oldWithdrawPasswordRef"
              standout
              v-model="formChgWithdrawPwd.oldPassword"
              class="q-pb-xs"
              hide-bottom-space
              :type="isPwd ? 'password' : 'text'"
              :label="$t('lang.chgpwd_old_withdraw_password')"
              lazy-rules
              clearable
              :rules="[
                (val) => (val && val.length > 0) || $t('lang.chgpwd_please_enter_old_withdraw_password'),
                (val) => (val && val.length >= 6 && val.length <= 11) || $t('lang.length_between_6_11')
              ]"
            >
              <template v-slot:append>
                <q-icon
                  color="dark"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </template>

          <template v-if="isForgotWithdrawPassword">
            <q-label>
              {{ $t("lang.chgpwd_please_enter_login_password") }}
              <em>*</em>
            </q-label>
            <q-input
              ref="loginPasswordRef"
              standout
              v-model="formChgWithdrawPwd.loginPassword"
              class="q-pb-xs"
              hide-bottom-space
              :type="isPwd ? 'password' : 'text'"
              :label="$t('lang.chgpwd_login_password')"
              lazy-rules
              clearable
              :rules="[(val) => (val && val.length > 0) || $t('lang.chgpwd_please_enter_login_password')]"
            >
              <template v-slot:append>
                <q-icon
                  color="dark"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <q-label>
              {{ $t("lang.chgpwd_please_enter_telephone") }}
              <em>*</em>
            </q-label>
            <q-input
              ref="telephoneRef"
              standout
              v-model="formChgWithdrawPwd.telephone"
              class="q-pb-xs"
              hide-bottom-space
              type="text"
              :label="$t('lang.chgpwd_telephone')"
              lazy-rules
              clearable
              :rules="[(val) => (val && val.length > 0) || $t('lang.chgpwd_please_enter_telephone')]"
            ></q-input>
          </template>

          <q-label>
            {{ $t("lang.chgpwd_please_enter_new_withdraw_password") }}
            <em>*</em>
          </q-label>
          <q-input
            ref="withdrawPasswordRef"
            standout
            v-model="formChgWithdrawPwd.password"
            class="q-pb-xs"
            hide-bottom-space
            :type="isPwd ? 'password' : 'text'"
            :label="$t('lang.chgpwd_new_withdraw_password')"
            lazy-rules
            clearable
            :rules="[
              (val) => (val && val.length > 0) || $t('lang.chgpwd_please_enter_new_withdraw_password'),
              (val) => (val && val.length >= 6 && val.length <= 11) || $t('lang.length_between_6_11')
            ]"
          >
            <template v-slot:append>
              <q-icon
                color="dark"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <template v-if="!isForgotWithdrawPassword">
            <q-label>
              {{ $t("lang.chgpwd_please_enter_confirm_withdraw_password") }}
              <em>*</em>
            </q-label>
            <q-input
              ref="confirmWithdrawPasswordRef"
              standout
              v-model="formChgWithdrawPwd.confirmNewPwd"
              class="q-pb-xs"
              hide-bottom-space
              :type="isPwd ? 'password' : 'text'"
              :label="$t('lang.chgpwd_confirm_withdraw_password')"
              lazy-rules
              clearable
              :rules="[
                (val) => (val && val.length > 0) || $t('lang.chgpwd_please_enter_confirm_withdraw_password'),
                (val) => (val && val.length >= 6 && val.length <= 11) || $t('lang.length_between_6_11'),
                (val) => val === formChgWithdrawPwd.password || $t('lang.chgpwd_confirm_withdraw_password_not_match')
              ]"
            >
              <template v-slot:append>
                <q-icon
                  color="dark"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </template>

          <template v-if="secondCodeId !== null">
            <q-label>
              {{ $t("lang.chgpwd_please_insert_otp_code") }}
              <em>*</em>
            </q-label>
            <q-input
              ref="otpCodeRef"
              standout
              v-model="formChgWithdrawPwd.otpCode"
              class="q-pb-xs"
              hide-bottom-space
              :type="isPwd ? 'password' : 'text'"
              :label="$t('lang.chgpwd_otp_code')"
              lazy-rules
              clearable
              :rules="[(val) => (val && val.length > 0) || $t('lang.chgpwd_please_insert_otp_code')]"
            >
              <template v-slot:append>
                <q-icon
                  color="dark"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </template>

          <!-- <div class="forget-pwd-tip" @click="openCaptchaDialog()" v-if="memberEmail !== null && secondCodeId == null">
            {{ $t("lang.chgpwd_forgot_withdraw_password") }}
          </div> -->
          <div
            class="forget-pwd-tip"
            @click="isForgotWithdrawPassword = true"
            v-if="memberEmail !== null && secondCodeId == null && !isForgotWithdrawPassword"
          >
            {{ $t("lang.chgpwd_forgot_withdraw_password") }}
          </div>
        </div>
        <div class="box-width">
          <q-btn
            type="submit"
            class="common-large-btn"
            no-caps
            :label="$t('lang.chgpwd_confirm')"
            width="100%"
            style="width: 100%"
          />
        </div>
      </q-form>
    </template>
  </q-page>

  <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss>
    <q-card width="100%">
      <q-card-section class="q-pa-md bg-brightbtn text-white">
        <q-toolbar>
          <q-toolbar-title>{{ $t("lang.personal_verification") }}</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-card-section>
      <div class="q-px-lg q-pt-sm q-pb-lg">
        <q-card-section class="q-mb-md q-pa-md">
          <q-input v-model="innerCaptchaRef" :placeholder="$t('lang.personal_verification')">
            <template v-slot:append>
              <img
                :src="verificationImg"
                :title="$t('lang.personal_verification_refresh')"
                style="margin-top: 6px; cursor: pointer"
                @click="getCode"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-btn @click="onCaptchaSubmit" :label="$t('lang.personal_sendotp')" color="brightbtn" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="js">
import {defineComponent, reactive, ref, onMounted} from "vue";
import moment from "moment";
import {api} from "boot/axios"
import {useQuasar} from "quasar"
import {userStore} from "src/stores";
import {useRoute, useRouter} from "vue-router";
import { useI18n } from "vue-i18n";
import { watch } from "vue";

export default defineComponent({
  name: "ChangePwdView",
  setup() {
    // const isCardActive = ref();
    const isPwd = ref(true);
    const $q = useQuasar();
    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const { t } = useI18n();
    const qs = require("qs");
    const personalState = reactive({
      memberInfo: {}
    });
    const verificationDetails = reactive({
      memberInfo: {}
    });

    const formChgAccountPwd = reactive({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    const formChgWithdrawPwd = reactive({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    const resetChgAccountPwd = () => {
      formChgAccountPwd.oldPassword = "";
      formChgAccountPwd.newPassword = "";
      formChgAccountPwd.confirmPassword = "";
    }

    const resetChgWithdrawPwd = () => {
      formChgWithdrawPwd.oldPassword = "";
      formChgWithdrawPwd.newPassword = "";
      formChgWithdrawPwd.confirmPassword = "";
    }

    const chgpwdTab = ref("tabPassword");
    // const chgpwdTab = ref("tabWithdrawPassword");

    const goToTab = (tabVal) => {
      formChgAccountPwd.oldPassword = "";
      formChgAccountPwd.newPassword = "";
      formChgAccountPwd.confirmPassword = "";
      formChgWithdrawPwd.oldPassword = "";
      formChgWithdrawPwd.newPassword = "";
      formChgWithdrawPwd.confirmPassword = "";
      chgpwdTab.value = tabVal;
    };

    const memberEmail = ref(null)
    const openCaptchaDialog = () => {
      getCode();
      showCaptchaDialog.value = true;
    }
    const showCaptchaDialog = ref(false);
    const verificationImg = ref("");
    const getCode = () => {
      api
        .get("/member/verificationEasyCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value =
              "data:image/png;base64," + response.data.img;
            // updateSecurityVerified.codeId = response.data.id;
            // innerCaptchaRef.value = "";
            innerCaptchaCodeId.value = response.data.id;
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

    const onCaptchaSubmit = () => {
      api.post(`/session/sendNewEmail`, qs.stringify({
        captchaCode: innerCaptchaRef.value,
        codeId: innerCaptchaCodeId.value
      }))
        .then(res => {
          getCode();
          let message = res.message || t('lang.personal_emailotp_sent'),
            color = 'positive'

          if (res.code === 0) {
            showCaptchaDialog.value = false
            secondCodeId.value = res.data.codeId;
          } else
            getCode();

          if (message)
            $q.notify({message, color});
          getCode();
          console.log('onCaptchaSubmit', res)
        })
    }

    const innerCaptchaRef = ref();
    const innerCaptchaCodeId = ref();
    const secondCodeId = ref(null);
    const isForgotWithdrawPassword = ref(false);

    const verifyOtpAndChangePassword = () => {
      api.post(`/session/withdrawPassword`, qs.stringify({
        password: formChgWithdrawPwd.password,
        code: formChgWithdrawPwd.otpCode,
        codeId: secondCodeId.value,
      }))
        .then((response) => {
          if (response.code === 0) {
            formChgWithdrawPwd.password = "";
            formChgWithdrawPwd.confirmNewPwd = "";
            formChgWithdrawPwd.otpCode= "";
            store.registeredWithdrawPassword = true;

            $q.notify({
              color: "positive",
              position: "top",
              message: t('lang.success'),
              icon: "report_problem"
            });

          }
        })
        .catch((e) => {

        });
    }

    onMounted(() => {
      console.log(store);
      memberEmail.value = store.email;
      secondCodeId.value = null;
      getCode();
    });

    watch(
      () => route.query,
      (newQuery) => {
        if (newQuery.name === 'withdraw') {
          goToTab('tabWithdrawPassword');
        }
      },
      { immediate: true, deep: true }
    );
    //update pwd
    const updatePwdModalVisible = ref(false);
    const oldPasswordRef = ref();
    const passwordRef = ref();
    const confirmPasswordRef = ref();

    const updatePwdInfo = reactive({
      oldPassword: "",
      password: "",
      confirmNewPwd: ""
    });
    const updatePwdModal = () => {
      updatePwdInfo.oldPassword = "";
      updatePwdInfo.password = "";
      updatePwdInfo.confirmNewPwd = "";
      updatePwdModalVisible.value = true;
    };

    const submitUpdatePwd = () => {
      oldPasswordRef.value.validate()
      passwordRef.value.validate()
      confirmPasswordRef.value.validate();

      if (oldPasswordRef.value.hasError || passwordRef.value.hasError) {
      } else {
        api.post("/session/password", qs.stringify({
          oldPassword: formChgAccountPwd.oldPassword,
          password: formChgAccountPwd.password
        })).then((response) => {
          if (response.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: t('lang.chgpwd_password_updated_successfully'),
              icon: "check_circle_outline"
            });
            router.go(-1);
          } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: response.message,
              icon: "report_problem"
            });
          }
        }).catch((error) => {
          console.log("error", error);
        });
      }
    };

    const oldWithdrawPasswordRef = ref();
    const withdrawPasswordRef = ref();
    const confirmWithdrawPasswordRef = ref();
    const otpCodeRef = ref();
    const loginPasswordRef = ref();
    const telephoneRef = ref();

    const submitUpdateWithdrawPwd = () => {
      // withdrawPasswordRef.value.validate()
      // confirmWithdrawPasswordRef.value.validate();

      if(store.registeredWithdrawPassword && !isForgotWithdrawPassword.value) {
        oldWithdrawPasswordRef.value.validate();
        if (oldWithdrawPasswordRef.value.hasError || withdrawPasswordRef.value.hasError) {
        } else {
          api.post("/session/withdrawPassword", qs.stringify({
            oldPassword: formChgWithdrawPwd.oldPassword,
            password: formChgWithdrawPwd.password
          })).then((response) => {
            if (response.code === 0) {
              $q.notify({
                color: "positive",
                position: "top",
                message: t('lang.chgpwd_withdraw_password_updated_successfully'),
                icon: "check_circle_outline"
              });
              router.go(-1);
            } else {
              $q.notify({
                color: "negative",
                position: "top",
                message: response.message,
                icon: "report_problem"
              });
            }
          }).catch((error) => {
            console.log("error", error);
          });
        }
      } else {
        if (withdrawPasswordRef.value.hasError) {
        } else {
          if (!isForgotWithdrawPassword.value) {
            verifyOtpAndChangePassword();
          } else {
            api.post("/session/withdrawPasswordWithPassNTel", qs.stringify({
              password: formChgWithdrawPwd.loginPassword,
              telephone: formChgWithdrawPwd.telephone,
              withdrawPassword: formChgWithdrawPwd.password
            })).then((response) => {
              if (response.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: t('lang.chgpwd_withdraw_password_updated_successfully'),
                  icon: "check_circle_outline"
                });
                isForgotWithdrawPassword.value = false;
                formChgWithdrawPwd.loginPassword = "";
                formChgWithdrawPwd.telephone = "";
                formChgWithdrawPwd.password = "";
              } else {
                $q.notify({
                  color: "negative",
                  position: "top",
                  message: response.message,
                  icon: "report_problem"
                });
              }
            }).catch((error) => {
              console.log("error", error);
            });
          }
        }
      }
    };

    return {
      personalState,
      updatePwdInfo,
      submitUpdatePwd,
      oldPasswordRef,
      passwordRef,
      confirmPasswordRef,
      isPwd,
      store,
      formChgAccountPwd,
      formChgWithdrawPwd,
      chgpwdTab,
      goToTab,
      submitUpdateWithdrawPwd,
      oldWithdrawPasswordRef,
      withdrawPasswordRef,
      confirmWithdrawPasswordRef,
      resetChgAccountPwd,
      resetChgWithdrawPwd,
      showCaptchaDialog,
      getCode,
      openCaptchaDialog,
      verificationImg,
      onCaptchaSubmit,
      memberEmail,
      innerCaptchaRef,
      innerCaptchaCodeId,
      verifyOtpAndChangePassword,
      secondCodeId,
      otpCodeRef,
      isForgotWithdrawPassword,
      loginPasswordRef,
      telephoneRef
    };
  }
});
</script>
<style lang="scss">
.change-pwd {
  padding: 20px 15px 24px;
  background: $white;
  width: $box-width;
  margin: 15px auto 20px;
  border-radius: 10px;
  box-shadow: $shadow-bg;

  q-label {
    margin-top: 8px;
    display: inline-block;
    margin-bottom: 4px;

    em {
      color: $negative;
    }
  }
}
</style>

<style lang="scss" scoped>
.chgpwd-tabs-div {
  cursor: pointer;
  gap: 14px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: $box-width;
  padding: 1rem 0.9rem 1rem;
  margin: 10px auto;
  background: $white;
  box-shadow: $shadow-bg;
  border-radius: 10px;

  .chgpwd-item {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../../assets/images/download/inactive-tab-bg.png");
    background-size: 100% 100%;
    background-color: $secondary;
    padding: 10px;
    text-align: center;
    border-radius: 10px;

    span {
      color: $font-1;
      font-size: 1rem;
    }

    &:active {
      filter: brightness(0.9);
      transform: translate(0px, 1px);
    }

    &.is-active {
      background-image: url("../../assets/images/download/active-tab-bg.png");
      background-size: 100% 100%;
      background-color: $primary;

      span {
        color: #ffffff;
        font-weight: bold;
      }
    }
  }
}

.forget-pwd-tip {
  color: $font-1;
  font-size: 1rem;
  text-decoration: none;
  display: flex;
  justify-content: flex-end;
}
</style>
