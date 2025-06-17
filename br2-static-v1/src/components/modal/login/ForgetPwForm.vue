<template>
  <div class="login-container">
    <div class="login-panel">
      <h2 class="title">Forgot Password</h2>
      <p class="subtitle">
        Please Provide Your Username And Phone Number, We Will Send OTP To Your Registered Phone Number.
      </p>
      <q-input
        type="tel"
        pattern="\d*"
        maxlength="11"
        ref="phoneRef"
        hide-bottom-space
        v-model="phone"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
          (val) => (val && val.length >= 8 && val.length <= 12) || $t('form.phone_rules_02'),
          (val) => (val && /^[0-9]*$/.test(val)) || $t('form.phone_rules_04')
        ]"
        outlined
        class="input"
        :class="{ 'white-txt': !!phone }"
      >
        <template v-slot:prepend>
          <span class="prepend-phone">{{ $t("form.prependNumber") }}</span>
        </template>
      </q-input>
      <q-input
        ref="ftCaptchaRef"
        hide-bottom-space
        type="text"
        v-model="captchaCode"
        lazy-rules
        :rules="[(val) => (val && val.length > 3) || $t('form.verificationCode_rules_01')]"
        outlined
        placeholder="Enter Verification Code"
        label-color="brand"
        class="input"
        :class="{ 'white-txt': !!captchaCode }"
      >
        <template v-slot:append>
          <img class="verification-img" :src="verificationImg" @click="getCode()" />
        </template>
      </q-input>

      <q-btn unelevated class="bg-greenbtn" label="Send" no-caps padding="12px" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed, watch, onActivated, onBeforeUnmount } from "vue";
import { useUI } from "stores/ui";
import { api } from "boot/axios";

const uiStore = useUI();

const phone = ref("");
const captchaCode = ref("");

const ftCaptchaRef = ref();
const codeId = ref("");
const verificationImg = ref("");

const getCode = () => {
  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        verificationImg.value = "data:image/png;base64," + response.data.img;

        codeId.value = response.data.id;
        captchaCode.value = "";

        ftCaptchaRef.value.resetValidation();
      }
    })
    .catch((e) => {});
};

onMounted(() => {
  getCode();
});
</script>
<style lang="scss" scoped>
.bg-greenbtn {
  margin-top: 50px;
}

.prepend-phone {
  color: #fff;
}

.verification-img {
  margin: 0 4px;
}
</style>
