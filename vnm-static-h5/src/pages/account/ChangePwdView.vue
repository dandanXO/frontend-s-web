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
          <template v-if="store.registeredWithdrawPassword">
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
              :rules="[(val) => (val && val.length > 0) || $t('lang.chgpwd_please_enter_old_withdraw_password')]"
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
            :rules="[(val) => (val && val.length > 0) || $t('lang.chgpwd_please_enter_new_withdraw_password')]"
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
</template>

<script lang="js">
import {defineComponent, reactive, ref, onMounted} from "vue";
import moment from "moment";
import {api} from "boot/axios"
import {useQuasar} from "quasar"
import {userStore} from "src/stores";
import {useRouter} from "vue-router";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "ChangePwdView",
  setup() {
    // const isCardActive = ref();
    const isPwd = ref(true);
    const $q = useQuasar();
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

    const goToTab = (tabVal) => {
      formChgAccountPwd.oldPassword = "";
      formChgAccountPwd.newPassword = "";
      formChgAccountPwd.confirmPassword = "";
      formChgWithdrawPwd.oldPassword = "";
      formChgWithdrawPwd.newPassword = "";
      formChgWithdrawPwd.confirmPassword = "";
      chgpwdTab.value = tabVal;
    };

    onMounted(() => {
      console.log(store);
    });

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

    const submitUpdateWithdrawPwd = () => {
      withdrawPasswordRef.value.validate()
      confirmWithdrawPasswordRef.value.validate();

      if(store.registeredWithdrawPassword) {
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
          api.post("/session/withdrawPassword", qs.stringify({
            oldPassword: '',
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
      resetChgWithdrawPwd
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
</style>
