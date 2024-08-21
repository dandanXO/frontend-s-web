<template>
  <div class="personal-account">
    <!--    <div class="web">{{ $t("lang.personal_exclusiveurl") }}: {{ store.evip }}</div>-->
    <q-form ref="profileFormRef">
      <div class="flex items-center no-wrap">
        <q-input
          ref="phoneNumberRef"
          standout
          class="q-pb-xs"
          hide-bottom-space
          v-model="hidedFormDetailsPhoneNumber"
          type="tel"
          :label="$t('lang.personal_mobilenumber')"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || $t('lang.personal_mobilenumber_val'), isValidPhone]"
          :readonly="showVerifyBtn ? false : true"
          style="width: 100%"
          disable
        ></q-input>
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
        ref="phoneOtpRef"
        v-model="formDetails.phoneOtpRef"
        type="tel"
        :label="$t('lang.personal_mobileotp')"
        lazy-rules
        :rules="[(val) => (val && val.length > 5 && val.length < 7) || $t('lang.personal_mobileotp_val')]"
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

  <!--
    <br />phone: {{ formDetails.phone }}
    <br />code: {{ formDetails.phoneOtpRef }}
    <br />codeId: {{ phoneCodeId }}
  -->
</template>

<script lang="js">
/* eslint-disable */
import {defineComponent, reactive, ref, onMounted, computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import moment from "moment";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {userStore} from "src/stores";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "PersonalView",
  setup() {
    // const isCardActive = ref();
    const qs = require("qs");
    const $q = useQuasar();
    const { t } = useI18n();
    const router = useRouter();
    const searchForm = reactive({
      start: "",
      end: ""
    });

    const profileFormRef = ref();

    const store = userStore();

    const hidedFormDetailsPhoneNumber = computed(() => {
      if(!formDetails.phone) return ""
      if(formDetails.phone.length < 6) return formDetails.phone.slice(-4)
      let result = ''
      for(const c in formDetails.phone) {
        result += (c < 2 || c >= formDetails.phone.length - 4) ? formDetails.phone[c] : '*'
      }
      return result
    })

    const loadInfo = () => {
      if (store.birthday > 0) {
        store.birthday = moment(store.birthday).format("YYYY-MM-DD");
      }
      formDetails.nickName = store.nickName;
      formDetails.realName = store.realName;
      formDetails.birthday = store.birthday;
      formDetails.email = store.email;
      formDetails.phoneVerified = store.phoneVerified;
      api.get('/session/member/telephone').then(res => {
        if(res.code === 0) {
          formDetails.phone = res.data
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: res.message,
            icon: "report_problem"
          })
        }
      }).catch(e => {
        $q.notify({
            color: "negative",
            position: "top",
            message: e.message,
            icon: "report_problem"
          })
      })
    };

    const canEdit = ref(false);


    const phoneCodeId = ref("")

    // const personalState = reactive({
    //   memberInfo: {}
    // });
    const verificationDetails = reactive({});


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
    const emailAddressRef = ref();
    const verificationCodeRef = ref();
    const phoneNumberRef= ref();
    const submitUpdateSecurity = () => {
      phoneOtpRef.value.validate();
      phoneNumberRef.value.validate()
      if (phoneNumberRef.value.hasError || phoneOtpRef.value.hasError) {
      } else {
        var apiUrl="session/verifyPhoneForVNM";

        api.post(apiUrl, qs.stringify({
          phone: formDetails.phone,
          code: formDetails.phoneOtpRef,
          codeId: phoneCodeId.value
        })).then((res) => {
          if (res.code === 0) {
            store.setPhone(formDetails.phone);
            $q.notify({
              color: "positive",
              position: "top",
              message: t('lang.personal_verification_successful'),
              icon: "check_circle_outline"
            });
            store.phoneVerified = true;
            store.phone = formDetails.phone;
            router.go(-1);
          }
        }).catch((e) => {
        });
      }
    };

    const isEditRealName = ref(false);
    const isEditEmail = ref(false);
    const isEditPhone = ref(false);
    const isEditBirthday = ref(false);
    const isEdit = ref(false);

    const formDetails = reactive([]);
    const realNameRef = ref();
    const birthdayRef = ref();
    const emailRef = ref();
    const phoneOtpRef = ref();

    const captchaRef = ref();
    const innerCaptchaRef = ref();
    const showCaptchaDialog = ref(false);
    const showVerifyBtn = ref(true);
    const showVerificationTokenInput = ref(false)

    const isValidPhone = () => {
      const phonePattern = /^(0[1-9]|[1-9])(\d{8,9})$/;
      const {phone} = formDetails;

      const result = '' === phone ? t('lang.personal_mobilenumber_verify') : !phonePattern.test(phone) ? t('lang.personal_mobilenumber_val') : true;

      return result;
    }

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
      phoneNumberRef.value.validate();
      if(phoneNumberRef.value.hasError){
        return;
      }
      getCode()
      showCaptchaDialog.value = true
    }

    const onCaptchaSubmit = () => {
      if (!formDetails.phone) {
        $q.notify({
          color: "negative",
          position: "top",
          message: "手机号码不能为空",
          icon: "report_problem"
        });
        getCode();
        return;
      }
      api.post(`/otp/sendSms`, qs.stringify({
        telephone: formDetails.phone,
        captchaCode: innerCaptchaRef.value,
        codeId: updateSecurityVerified.codeId
      }))
        .then(res => {
          getCode();
          let message = res.message || t('lang.personal_verification_successful'),
            color = 'positive'

          if (res.code === 0) {
            canEdit.value = true;
            showCaptchaDialog.value = false
            showVerifyBtn.value = false;
            showVerificationTokenInput.value = true
            phoneCodeId.value = res.data.codeId;
            // console.log(res.data.codeId)
            countdownOtp();
          } else {
            color = 'negative';
            getCode();
          }


          if (message) {
            $q.notify({message, color});
          }

          // console.log('onCaptchaSubmit', res)
        })
    }

    onMounted(() => {
      loadInfo();
      getCode();
    });

    return {
      router,
      store,
      searchForm,
      updateSecurityFormRef,
      updateSecurityVerified,
      updateSecurityModal,
      updateSecurityModalVisible,
      submitUpdateSecurity,
      isEditRealName,
      isEditEmail,
      isEditPhone,
      isEditBirthday,
      formDetails,
      profileFormRef,
      verificationModalVisible,
      openVerificationModal,
      isEmailSending,
      verificationImg,
      getCode,
      verificationDetails,
      verificationCodeRef,
      emailAddressRef,
      isEdit,
      emailRef,
      phoneOtpRef,
      realNameRef,
      birthdayRef,
      moment,
      canEdit,
      phoneNumberRef,
      showVerificationTokenInput,
      isValidPhone,
      captchaRef,
      innerCaptchaRef,
      showCaptchaDialog,
      openVerificationDialog,
      onCaptchaSubmit,
      showVerifyBtn,
      phoneCodeId,
      otpCountdownCount,
      hidedFormDetailsPhoneNumber
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
