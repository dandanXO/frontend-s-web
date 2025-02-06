<template>
  <q-dialog width="100%" v-model="localBindEmailDialog" persistent @hide="closeDialog">
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.bindEmail") }}</div>
        <div class="pc-form">
          <InputRowGrid>
            <template #fields>
              <InputField :label="$t('form.email')">
                <template #input>
                  <q-input
                    outlined
                    clearable
                    :placeholder="$t('form.email_placeholder')"
                    v-model="updateEmailInfo.email"
                    ref="updateEmailRef"
                    hide-bottom-space
                    type="text"
                    :rules="[(val) => /.+@.+\..+/.test(val) || $t('form.email_rules_02')]"
                  >
                    <template v-slot:append>
                      <div class="pc-form-side-btn">
                        <q-btn
                          no-caps
                          dense
                          class="text-green"
                          :label="!startCountdownResendOTP && $t('form.send')"
                          :disable="startCountdownResendOTP"
                          @click="openVerificationCodeDialog"
                        />
                      </div>
                    </template>
                  </q-input>
                </template>
              </InputField>

              <InputField :label="$t('form.code')">
                <template #input>
                  <q-input
                    outlined
                    clearable
                    :placeholder="$t('form.code_placeholder')"
                    v-model="updateEmailInfo.code"
                    ref="updateEmailCodeRef"
                    hide-bottom-space
                    type="text"
                    :rules="[(val) => val.length !== 0 || $t('form.code_rules_01')]"
                  >
                    <template v-slot:append v-if="startCountdownResendOTP">{{ countdownOTP }}s</template>
                  </q-input>
                </template>
              </InputField>
            </template>
          </InputRowGrid>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="submitUpdateEmail">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="verificationCodeDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.captchaCodeCheck") }}</div>

        <div class="pc-form">
          <div class="pc-form-item">
            <div class="pc-form-label">{{ $t("form.captchaCode") }}</div>
            <div class="pc-form-input">
              <q-input
                filled
                hide-bottom-space
                dense
                clearable
                :placeholder="$t('form.captchaCode_placeholder')"
                v-model="captchaRef"
                :rules="[
                  (val) => (val && val.length > 0) || $t('form.captchaCode_rules_01'),
                  (val) => (val && val.length > 3 && val.length < 5) || $t('form.captchaCode_rules_02')
                ]"
              >
                <template v-slot:append>
                  <img :src="verificationImg" @click="getCode" />
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onCaptchaSubmit">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import { t } from "src/boot/lang";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import InputRowGrid from "src/components/auth/InputRowGrid.vue";
import InputField from "src/components/auth/InputField.vue";
import { userStore } from "src/stores";

const $q = useQuasar();
const qs = require("qs");
const props = defineProps(["bindEmailDialog"]);
const emit = defineEmits(["update:bindEmailDialog"]);
const store = userStore();

let verificationCodeID = "";

const localBindEmailDialog = ref(props.bindEmailDialog);
const startCountdownResendOTP = ref(false);
const captchaRef = ref();
const verificationCodeDialog = ref(false);
const verificationImg = ref("");
const updateEmailRef = ref();
const updateEmailCodeRef = ref();
const countdownOTP = ref();

const updateEmailInfo = reactive({
  email: "",
  code: "",
  codeId: ""
});

const updateSecurityVerified = reactive({
  mobileNumber: "",
  verificationCode: ""
});

const getCode = () => {
  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        verificationImg.value = "data:image/png;base64," + response.data.img;
        updateSecurityVerified.codeId = response.data.id;
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

const openVerificationCodeDialog = () => {
  if(store.email) {
    verificationCodeDialog.value = !verificationCodeDialog.value;
    getCode();
    return;
  }

  api
    .get(`/member/checkEmailRegisterStatus?email=${updateEmailInfo.email}`)
    .then((response) => {
      if (response.code === 0) {
        if (response.data) {
          $q.notify({
            color: "negative",
            position: "top",
            message: t("notify.emailAlreadyUsed"),
            icon: "report_problem"
          });
        } else {
          verificationCodeDialog.value = !verificationCodeDialog.value;
        }
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

  captchaRef.value = "";
  getCode();
};

const onCaptchaSubmit = () => {
  api
    .post(
      `/otp/sendNewEmail`,
      qs.stringify({
        email: updateEmailInfo.email,
        captchaCode: captchaRef.value,
        codeId: updateSecurityVerified.codeId
      })
    )
    .then((res) => {
      let message = res.message,
        color = "positive";

      if (res.code === 0) {
        verificationCodeDialog.value = false;

        updateEmailInfo.codeId = res.data.codeId;
        verificationCodeID = res.data.codeId;
        startCountdownResendOTP.value = true;

        countdownOTP.value = 59;
        let timer = setInterval(() => {
          countdownOTP.value -= 1;
          if (countdownOTP.value === 0) {
            clearInterval(timer);
            startCountdownResendOTP.value = false;
          }
        }, 1000);

        $q.notify({
          color: "positive",
          position: "top",
          message: t("notify.emailVerificationSent"),
          icon: "check_circle_outline"
        });
      } else {
        color = "negative";
        getCode();
      }

      if (message) $q.notify({ message, color });
    });
};

const submitUpdateEmail = () => {
  updateEmailRef.value.validate();
  updateEmailCodeRef.value.validate();

  if (updateEmailRef.value.hasError || updateEmailCodeRef.value.hasError) {
  } else {
    const endpoint = store.email ? "/otp/verifyEmail" : "/session/verifyAndUpdateEmail"

    api
      .post(endpoint,
        qs.stringify({
          email: updateEmailInfo.email,
          code: updateEmailInfo.code,
          codeId: updateEmailInfo.codeId
        })
      )
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t("notify.emailBindedSuccessfully"),
            icon: "check_circle_outline"
          });

          closeDialog();
          store.getMemberInfo();

        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: response.message,
            icon: "report_problem"
          });
        }
      })
      .catch((e) => {});
  }
};

const closeDialog = () => {
  emit("update:bindEmailDialog", false);
};
watch(
  () => props.bindEmailDialog,
  (newValue) => {
    localBindEmailDialog.value = newValue;
  }
);
</script>
<style scoped lang="scss">
.bottom-btn {
  margin-top: 20px;
}
</style>
