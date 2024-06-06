<template>
  <a-form ref="formRef" :model="loginForm" :rules="loginFormRules" hide-required-mark>
    <div>
      <a-form-item
        required
        name="loginName"
        :label="$t('layout.header.accountModal.login.form.loginName.label')"
        label-align="left"
      >
        <a-input
          v-model:value="loginForm.loginName"
          :placeholder="$t('layout.header.accountModal.login.form.loginName.placeholder')"
        >
          <template #prefix>
            <RiSmartphoneFill />
            <span style="color: #ffffff">+92</span>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        required
        name="password"
        :label="$t('layout.header.accountModal.login.form.password.label')"
        label-align="left"
      >
        <a-input
          v-model:value="loginForm.password"
          type="password"
          :placeholder="$t('layout.header.accountModal.login.form.password.placeholder')"
          @keypress.enter="onSubmit"
        >
          <template #prefix>
            <RiLock2Fill />
          </template>
        </a-input>
      </a-form-item>
      <div class="forget-password">
        <a @click="onForgetPwd" class="pwd-tip">
          {{ $t("layout.header.accountModal.login.forgetPassword") }}
        </a>
      </div>
    </div>
    <div>
      <a-button class="common-btn" :loading="loadingLogin" @click="onSubmit">
        {{ $t("layout.header.accountModal.login.submitButton") }}
      </a-button>
    </div>
  </a-form>
</template>
<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { userStore } from "@/store/index";
import { RiSmartphoneFill, RiLock2Fill } from "vue-remix-icons";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useRoute, useRouter } from "vue-router";

const emit = defineEmits(["close-modal"]);

const { t } = useI18n();
const store = userStore();
const router = useRouter();
const route = useRoute();

const formRef = ref();
const loadingLogin = ref(false);
const loginForm = ref({
  loginName: "",
  password: ""
});
const loginFormRules = ref({
  loginName: [
    { len: 11, message: t("layout.header.accountModal.login.form.loginName.error.len") },
    { required: true, message: t("layout.header.accountModal.login.form.loginName.error.required") }
  ],
  password: [{ required: true, message: t("layout.header.accountModal.login.form.password.error.required") }]
});

const onSubmit = () => {
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

    formRef.value.validate().then(() => {
      loadingLogin.value = true;
      store
        .memberLogin({
          loginName: loginForm.value.loginName,
          password: loginForm.value.password,
          sid: sidParam
        })
        .then(() => {
          const jumpUrl = route.query.redirect ? route.query.redirect.toString() : "/home";
          router.push(jumpUrl);
          loadingLogin.value = false;
          emit("close-modal");
        })
        .catch((error) => {
          console.log(error.message);
          loadingLogin.value = false;
          // getCode();
        });
    });
  })();
};
const onForgetPwd = () => {
  emit("forget-pwd");
};
</script>
<style scoped lang="scss">
@import "./style/accountModalTab.scss";

.forget-password {
  text-align: right;

  a {
    color: #9f9f9f;
    text-decoration: underline;
    &:hover {
      color: #1baa99;
    }
  }
}
</style>
