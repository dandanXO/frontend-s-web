<template>
  <div v-if="uiStore.loginView === 'login'" class="login-container">
    <div class="login-panel">
      <h2 class="title">{{ $t("header.login") }}</h2>
      <div class="subtitle">
        {{ $t("btn.notAMember") }}
        <div class="link" @click="uiStore.loginView = 'register'">{{ $t("btn.createAccount") }}</div>
      </div>

      <q-input
        ref="phoneRef"
        outlined
        v-model="phone"
        :placeholder="$t('form.phone_placeholder')"
        class="input"
        :class="{ 'white-txt': !!phone }"
        :rules="[
          (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
          (val) => (val && val.length >= 8 && val.length <= 12) || $t('form.phone_rules_02'),
          (val) => (val && /^[0-9]*$/.test(val)) || $t('form.phone_rules_04')
        ]"
      >
        <template v-slot:prepend>
          <img v-if="!phone" src="../../../assets/images/auth/acc-icon.png" width="22px" />
          <img v-else src="../../../assets/images/auth/acc-icon-active.png" width="22px" />
        </template>
      </q-input>

      <q-input
        ref="passwordRef"
        outlined
        v-model="password"
        :placeholder="$t('form.password_placeholder')"
        :type="!isShowPassword ? 'password' : 'text'"
        class="input"
        :class="{ 'white-txt': !!password }"
        :rules="[(val) => (val && val.length > 0) || $t('form.password_rules_01')]"
      >
        <template v-slot:prepend>
          <img v-if="!password" src="../../../assets/images/auth/lock-icon.png" width="22px" />
          <img v-else src="../../../assets/images/auth/lock-icon-active.png" width="22px" />
        </template>
        <template v-slot:append>
          <img
            v-if="!isShowPassword"
            class="password-icon"
            src="../../../assets/images/auth/show-pw-icon.png"
            width="20px"
            @click="isShowPassword = !isShowPassword"
          />
          <img
            v-else
            class="password-icon"
            src="../../../assets/images/auth/hide-pw-icon.png"
            width="20px"
            @click="isShowPassword = !isShowPassword"
          />
        </template>
      </q-input>

      <div class="forgot" @click="uiStore.loginView = 'forgetPw'">{{ $t("form.forgotPassword") }}</div>

      <q-btn unelevated class="bg-greenbtn" :label="$t('btn.createAccount')" no-caps padding="12px" @click="login" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUI } from "stores/ui";
import { userStore } from "stores/index";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { Device } from "@capacitor/device";
import { t } from "src/boot/lang";

const uiStore = useUI();
const store = userStore();
const $q = useQuasar();
const router = useRouter();
const route = useRoute();

const phoneRef = ref();
const passwordRef = ref();

const phone = ref("");
const password = ref("");
const isShowPassword = ref(false);

const login = () => {
  phoneRef.value.validate();
  passwordRef.value.validate();

  $q.loading.show({
    message: t("btn.logging_in")
  });
  if (phoneRef.value.hasError || passwordRef.value.hasError) {
    $q.loading.hide();
  } else {
    store
      .memberLogin({
        loginName: phone.value,
        password: password.value,
        sid: store.googleadid ? store.googleadid : store.aaid ? store.aaid : sidParam,
        ...(Platform.is.android && Platform.is.capacitor ? { appVersion: appVersionNo.value } : {})
      })
      .then((res) => {
        sessionStorage.removeItem("REFERRAL_CODE");

        phone.value = "";
        password.value = "";

        if (store.hasToken()) {
          const jumpUrl = route.query.redirect ? route.query.redirect : "/home";
          router.go(jumpUrl);
        }

        uiStore.loginView = "";
      })
      .catch((e) => {})
      .finally(() => {
        $q.loading.hide();
      });
  }
};

const appVersionNo = ref("");
const getVersionNo = async () => {
  if (Platform.is.android && Platform.is.capacitor) {
    const info = await App.getInfo();
    appVersionNo.value = info.version;
  }
};

const guestDeviceInfo = ref("");
const getAppInfo = async () => {
  const info = await Device.getId();
  guestDeviceInfo.value = info.identifier;
};

onMounted(() => {
  getAppInfo();
  getVersionNo();
});
</script>

<style lang="scss" scoped>
.password-icon {
  margin: 0 4px;
}

.forgot {
  font-size: 13px;
  color: #bbb;
  text-align: right;
  margin: 0 0 54px;
}
</style>
