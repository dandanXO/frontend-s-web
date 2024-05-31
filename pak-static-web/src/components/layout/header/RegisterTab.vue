<template>
  <a-form ref="formRef" :model="registerForm" :rules="registerFormRules" hide-required-mark>
    <div>
      <a-form-item
        required
        name="loginName"
        :label="$t('layout.header.accountModal.register.form.loginName.label')"
        label-align="left"
      >
        <a-input
          v-model:value="registerForm.loginName"
          :placeholder="$t('layout.header.accountModal.register.form.loginName.placeholder')"
          autocomplete="new-password"
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
        :label="$t('layout.header.accountModal.register.form.password.label')"
        label-align="left"
      >
        <a-input
          v-model:value="registerForm.password"
          type="password"
          placeholder="Password"
          :placeholder="$t('layout.header.accountModal.register.form.password.placeholder')"
          autocomplete="new-password"
          @keypress.enter="onSubmit"
        >
          <template #prefix>
            <RiLock2Fill />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        name="codeAffiliate"
        :label="$t('layout.header.accountModal.register.form.codeAffiliate.label')"
        label-align="left"
      >
        <a-input
          v-model:value="registerForm.codeAffiliate"
          placeholder="codeAffiliate"
          :placeholder="$t('layout.header.accountModal.register.form.codeAffiliate.placeholder')"
          @keypress.enter="onSubmit"
        >
          <template #prefix>
            <img :src="InvitationIcon" />
          </template>
        </a-input>
      </a-form-item>
      <!-- TODO: action? -->
      <div class="privacy-agreement">
        <a-checkbox v-model:checked="agreePrivacy">
          {{ $t("layout.header.accountModal.register.privacyAgreement.label") }}
          <router-link class="pwd-tip" to="/">
            {{ $t("layout.header.accountModal.register.privacyAgreement.link") }}
          </router-link>
        </a-checkbox>
      </div>
    </div>
    <div>
      <a-button class="common-btn" :loading="loadingRegister" :disabled="!agreePrivacy" @click="onSubmit">
        {{ $t("layout.header.accountModal.register.submitButton") }}
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
import { useRouter } from "vue-router";
import InvitationIcon from "@/assets/images/layout/header/invitation-icon.svg";
import { register } from "@/api/index/login";

const emit = defineEmits(["close-modal"]);

const { t } = useI18n();
const store = userStore();
const router = useRouter();

const formRef = ref();
const agreePrivacy = ref(false);
const loadingRegister = ref(false);
const registerForm = ref({
  loginName: "",
  password: "",
  codeAffiliate: ""
});
const registerFormRules = ref({
  loginName: [
    { len: 10, message: t("layout.header.accountModal.register.form.loginName.error.len") },
    { required: true, message: t("layout.header.accountModal.register.form.loginName.error.required") }
  ],
  password: [{ required: true, message: t("layout.header.accountModal.register.form.password.error.required") }]
});

const onSubmit = () => {
  emit("close-modal");
  // formRef.value
  //   .validate()
  //   .then(() => {
  //     const fpPromise = FingerprintJS.load();
  //     (async () => {
  //       const fp = await fpPromise;
  //       const result = await fp.get();
  //       const excludes = { value: ["timezone", "timeZoneOffset"] };
  //       const allComponents = { ...result.components };
  //       excludes.value.forEach((element) => {
  //         delete allComponents[element];
  //       });
  //       const sid = FingerprintJS.hashComponents(allComponents);
  //       loadingRegister.value = true;
  //       const params = {
  //         loginName: registerForm.value.loginName,
  //         password: registerForm.value.password,
  //         // codeAffiliate: registerForm.value.codeAffiliate,
  //         sid
  //       };

  //       register(params)
  //         .then((response) => {
  //           const regResult = response.code;
  //           if (regResult === 0) {
  //             loadingRegister.value = false;
  //             message.success("Successfully Registered");

  //             // debugger;
  //             if (store.isAffiliateA) {
  //               fbq("track", "signup-success");
  //               fbq("track", "CompleteRegistration");
  //             } else if (store.isAffiliate2) {
  //               fbq("track", "signup-success");
  //               fbq("track", "CompleteRegistration");
  //             } else if (store.isAffiliate3) {
  //               fbq("track", "signup-success");
  //               fbq("track", "CompleteRegistration");
  //             }

  //             store.autoLogin(response.data);

  //             //now , reg success return {code: 0} , can not set token ,may be update later
  //             // setMember({
  //             //   nickName: regForm.loginName,
  //             //   token: "123",
  //             // });
  //             router.push({ path: "/", query: { isFromRegister: true } });
  //           }
  //         })
  //         .catch((error) => {
  //           console.log("error", error);
  //           // getCode()
  //           loadingRegister.value = false;
  //         });
  //     })();
  //   })
  //   .catch((error) => {
  //     console.log("error", error);
  //   });
};
</script>
<style scoped lang="scss">
@import "./style/accountModalTab.scss";

.privacy-agreement {
  .ant-checkbox-wrapper {
    color: #8c968f;
    :deep(.ant-checkbox) {
      .ant-checkbox-inner {
        border-radius: 50%;
      }
    }
    :deep(.ant-checkbox-checked) {
      .ant-checkbox-inner {
        background-color: $primary;
        border-color: $primary;
      }
    }
  }

  a,
  a:hover {
    color: #61ff00;
  }
}
</style>
