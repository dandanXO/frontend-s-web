<template>
  <div class="personal-account">
<!--    <div class="web">{{ $t("lang.personal_exclusiveurl") }}: {{ personalState.memberInfo.evip }}</div>-->
    <q-form ref="profileFormRef">
      <div class="flex items-center no-wrap">
        <q-input
          standout
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.email"
          :label="$t('lang.personal_email')"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || $t('lang.personal_email_val')]"
          :readonly="showVerifyBtn ? false : true"
          style="width: 100%"
        />
        <div class="q-ml-md">
          <q-btn
            size="md"
            color="brightbtn"
            :label="
              showVerifyBtn && otpCountdownCount <= 0
                ? $t('lang.personal_sendotp')
                : `${$t('lang.personal_sentotp_countdown')} ${otpCountdownCount}`
            "
            @click="openVerificationDialog()"
            style="white-space: nowrap"
            :disable="!showVerifyBtn && otpCountdownCount > 0"
          />
        </div>
      </div>

      <q-input
        standout
        class="q-pb-xs"
        hide-bottom-space
        ref="emailOtpRef"
        v-model="formDetail.emailOtpRef"
        type="tel"
        :label="$t('lang.personal_emailotp')"
        lazy-rules
        :rules="[(val) => (val && val.length > 5 && val.length < 7) || $t('lang.personal_emailotp_val')]"
        style="width: 100%"
      ></q-input>

      <div class="text-center q-mt-md" v-if="canEdit">
        <q-btn size="md" color="brightbtn" @click="submitUpdateSecurity()" :label="$t('lang.personal_submit_btn')" />
      </div>
    </q-form>
  </div>

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

  <!-- <br />
  email: {{ formDetail.email }}
  <br />
  code: {{ formDetail.emailOtpRef }}
  <br />
  codeId: {{ emailCodeId }} -->
</template>

<script lang="js">
/* eslint-disable */
import {defineComponent, reactive, ref, onMounted, computed} from "vue";
import moment from "moment";
import {api} from "boot/axios";
import {useRoute, useRouter} from "vue-router";
import {useQuasar} from "quasar";
import {userStore} from "src/stores";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "PersonalView",
  setup() {
    // const isCardActive = ref();
    const qs = require("qs");
    const router = useRouter();
    const { t } = useI18n();
    const $q = useQuasar();
    const searchForm = reactive({
      start: "",
      end: ""
    });

    const profileFormRef = ref();
    const store = userStore();

    const loadInfo = () => {
      personalState.memberInfo = userStore();
      if (personalState.memberInfo.birthday > 0) {
        personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("YYYY-MM-DD");
      }
      formDetail.nickName = personalState.memberInfo.nickName;
      formDetail.realName = personalState.memberInfo.realName;
      formDetail.birthday = personalState.memberInfo.birthday;
      formDetail.email = "";
      formDetail.phone = personalState.memberInfo.phone;
      formDetail.phoneVerified = personalState.memberInfo.phoneVerified;
    };

    const canEdit = ref(false);

    const personalState = reactive({
      memberInfo: {}
    });
    const verificationDetails = reactive({});

    onMounted(() => {
      loadInfo();
      getCode();
    });

    const emailCodeId = ref("");

    const verificationImg = ref("");
    const getCode = () => {
      api
          .get("/member/verificationEasyCode")
          .then((response) => {
            if (response.code === 0) {
              verificationImg.value =
                  "data:image/png;base64," + response.data.img;
              updateSecurityVerified.codeId = response.data.id;
              innerCaptchaRef.value = "";
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
    //update security

    const isEmailSending = ref(false);
    const updateSecurityModalVisible = ref(false);
    const updateSecurityFormRef = ref();
    const updateSecurityVerified = reactive({
      mobileNumber: "",
      verificationCode: ""
    });
    const verificationModalVisible = ref(false);
    const updateSecurityModal = () => {
      updateSecurityVerified.emailAddress = "";
      updateSecurityVerified.verificationCode = "";
      updateSecurityModalVisible.value = true;
    };
    const openVerificationModal = () => {
      getCode();
      verificationModalVisible.value = true;
    };
    const verifyVerificationCode = () => {
      isEmailSending.value = true;
      verificationDetails.memberInfo.email = updateSecurityVerified.emailAddress;
      const emailDetails = {
        email: updateSecurityVerified.emailAddress,
        captchaCode: updateSecurityVerified.captchaCode,
        codeId: updateSecurityVerified.codeId
      };
      api.post("/otp/sendNewEmail", qs.stringify(emailDetails)).then((ret) => {
        if (ret.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t('lang.personal_emailotp_sent'),
            icon: "check_circle_outline"
          });
          canEdit.value = true;
          verificationDetails.memberInfo.codeId = ret.data.codeId;
          verificationModalVisible.value = false;
          isEmailSending.value = false;
        } else {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: ret.message,
          //   icon: "report_problem"
          // });
          isEmailSending.value = false;
          getCode();
        }
      })
          .catch((e) => {
            getCode();
            isEmailSending.value = false;
          });
    };
    const emailAddressRef = ref();
    const verificationCodeRef = ref();
    const submitUpdateSecurity = () => {
      emailOtpRef.value.validate()
      if (emailOtpRef.value.hasError) {
      } else {
        var apiUrl= "session/verifyEmailForVNM";

        api.post(apiUrl, qs.stringify({
          email: formDetail.email,
          code: formDetail.emailOtpRef,
          codeId: emailCodeId.value
        })).then((res) => {
          if (res.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: t('lang.personal_verification_successful'),
              icon: "check_circle_outline"
            });
            store.emailVerified = true;
            store.email= formDetail.email;
            router.go(-1);
          }
        }).catch((e) => {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: e.message,
          //   icon: "report_problem"
          // });
        });
      }
    };

    const isEditRealName = ref(false);
    const isEditEmail = ref(false);
    const isEditPhone = ref(false);
    const isEditBirthday = ref(false);
    const isEdit = ref(false);

    const formDetail = reactive([]);
    const realNameRef = ref();
    const birthdayRef = ref();
    const emailRef = ref();
    const emailOtpRef = ref();

    const captchaRef = ref();
    const innerCaptchaRef = ref();
    const showCaptchaDialog = ref(false);
    const showVerifyBtn = ref(true);
    const showVerificationTokenInput = ref(false)


    const otpCountdownCount = ref(0);
    let otpCountdownSchedule;
    const countdownOtp = () => {
      otpCountdownCount.value = 60;
      otpCountdownSchedule = setInterval(() => {
        if (otpCountdownCount.value <= 0) {
          showVerifyBtn.value = true;
          clearInterval(otpCountdownSchedule);
          return;
        }
        otpCountdownCount.value--;
      }, 1000);
    };

    const openVerificationDialog = () => {
      getCode()
      showCaptchaDialog.value = true
    }

    const onCaptchaSubmit = () => {
      if (!formDetail.email) {
        $q.notify({
          color: "negative",
          position: "top",
          message: t('lang.personal_email_empty'),
          icon: "report_problem"
        });
        getCode();
        return;
      }

      api.post(`/otp/sendNewEmail`, qs.stringify({
        email: formDetail.email,
        captchaCode: innerCaptchaRef.value,
        codeId: updateSecurityVerified.codeId
      }))
          .then(res => {
            getCode();
            let message = res.message || t('lang.personal_emailotp_sent'),
                color = 'positive'

            if (res.code === 0) {
              canEdit.value = true;
              showCaptchaDialog.value = false
              showVerifyBtn.value = false;
              showVerificationTokenInput.value = true
              countdownOtp();
              emailCodeId.value = res.data.codeId;
            } else
              color = 'negative';
            getCode();

            if (message)
              $q.notify({message, color});
            getCode();

            // console.log('onCaptchaSubmit', res)
          })
    }

    return {
      router,
      searchForm,
      personalState,
      updateSecurityFormRef,
      updateSecurityVerified,
      updateSecurityModal,
      updateSecurityModalVisible,
      submitUpdateSecurity,
      isEditRealName,
      isEditEmail,
      isEditPhone,
      isEditBirthday,
      formDetail,
      profileFormRef,
      verificationModalVisible,
      openVerificationModal,
      isEmailSending,
      verificationImg,
      emailCodeId,
      verifyVerificationCode,
      getCode,
      verificationDetails,
      verificationCodeRef,
      emailAddressRef,
      isEdit,
      emailRef,
      emailOtpRef,
      realNameRef,
      birthdayRef,
      moment,
      canEdit,
      otpCountdownCount,
      showVerificationTokenInput,
      captchaRef,
      innerCaptchaRef,
      showCaptchaDialog,
      openVerificationDialog,
      onCaptchaSubmit,
      showVerifyBtn
    };
  }
});
</script>
<style lang="scss">
.personal-account {
  padding: 10px;

  .web {
    color: $primary;
    text-align: center;
    padding: 0 0 10px;
    font-weight: bold;
    font-size: 17px;
  }

  input.q-placeholder {
    //color: #333333 !important;
  }
}

.q-toolbar {
  background: #33bcd4;
}
</style>
