<template>
  <div class="personal-account">
    <div class="web">专属网址: {{ store.evip }}</div>
    <q-form ref="profileFormRef">
      <div class="flex items-center no-wrap">
        <q-input
          ref="phoneNumberRef"
          standout
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetails.phone"
          type="tel"
          label="手机号码"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || '请输入正确的电话号码', isValidPhone]"
          :readonly="showVerifyBtn ? false : true"
          style="width: 100%"
        ></q-input>
        <div class="q-ml-md">
          <q-btn
            size="md"
            color="brightbtn"
            :label="showVerifyBtn && otpCountdownCount <= 0 ? `发送验证码` : `已发送（倒数${otpCountdownCount}秒)`"
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
        label="手机验证码"
        lazy-rules
        :rules="[(val) => (val && val.length > 5 && val.length < 7) || '请输入验证码']"
        style="width: 100%"
      ></q-input>

      <div class="text-center q-mt-md" v-if="canEdit">
        <q-btn size="md" color="brightbtn" @click="submitUpdateSecurity()" label="验证手机号" />
      </div>
    </q-form>
  </div>

  <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss>
    <q-card width="100%">
      <q-card-section class="q-pa-md bg-brightbtn text-white">
        <q-toolbar>
          <q-toolbar-title>验证码</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-card-section>
      <div class="q-px-lg q-pt-sm q-pb-lg">
        <q-card-section class="q-mb-md q-pa-md">
          <q-input v-model="innerCaptchaRef" placeholder="验证码">
            <template v-slot:append>
              <img
                :src="verificationImg"
                title="点击刷新验证码"
                style="margin-top: 6px; cursor: pointer"
                @click="getCode"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-btn @click="onCaptchaSubmit" label="发送验证码" color="brightbtn" />
      </div>
    </q-card>
  </q-dialog>

  <!-- <br />
  phone: {{ formDetails.phone }}
  <br />
  code: {{ formDetails.phoneOtpRef }}
  <br />
  codeId: {{ phoneCodeId }} -->
</template>

<script lang="js">
/* eslint-disable */
import {defineComponent, reactive, ref, onMounted, computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import moment from "moment";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {userStore} from "src/stores";
import { useNotify } from "src/hooks/notify";

export default defineComponent({
  name: "PersonalView",
  setup() {
    // const isCardActive = ref();
    const notify = useNotify();
    const qs = require("qs");
    const $q = useQuasar();
    const router = useRouter();
    const searchForm = reactive({
      start: "",
      end: ""
    });

    const profileFormRef = ref();

    const store = userStore();

    const loadInfo = () => {
      if (store.birthday > 0) {
        store.birthday = moment(store.birthday).format("YYYY-MM-DD");
      }
      formDetails.nickName = store.nickName;
      formDetails.realName = store.realName;
      formDetails.birthday = store.birthday;
      formDetails.email = store.email;
      formDetails.phone = store.phone;
      formDetails.phoneVerified = store.phoneVerified;
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
          .get("/member/verificationCode")
          .then((response) => {
            if (response.code === 0) {
              verificationImg.value =
                  "data:image/png;base64," + response.data.img;
              updateSecurityVerified.codeId = response.data.id;
              innerCaptchaRef.value = "";
            }
          })
          .catch((e) => {
            notify({
              type: "error",
              message: e.message,
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
        api.post("/session/verifyAndUpdatePhone", qs.stringify({
          phone: formDetails.phone,
          code: formDetails.phoneOtpRef,
          codeId: phoneCodeId.value
        })).then((res) => {
          if (res.code === 0) {
            store.setPhone(formDetails.phone);
            notify({
              type: "success",
              message: "验证成功",
            });
            store.phoneVerified = true;
            store.phone = formDetails.phone;
            router.go(-1);
          }
        }).catch((e) => {
          notify({
            type: "error",
            message: e.message,
          });
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


    const isValidName = () => {
      const namePattern =
          /^([\u4e00-\u9fa5]*)$/;
      return namePattern.test(formDetails.realName) || "请输入中文字符";
    };

    const isValidPhone = () => {
      const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      const {phone} = formDetails;

      const result = '' === phone ? '请验证您的电话号码' : !phonePattern.test(phone) ? '请输入有效的电话号码' : true;

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
        notify({
          type: "error",
          message: "手机号码不能为空",
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
            let message = res.message || '发送手机验证码成功',
                type = 'success'

            if (res.code === 0) {
              canEdit.value = true;
              showCaptchaDialog.value = false
              showVerifyBtn.value = false;
              showVerificationTokenInput.value = true
              phoneCodeId.value = res.data.codeId;
              // console.log(res.data.codeId)
              countdownOtp();
            } else {
              type = 'error';
              getCode();
            }


            if (message) {
              notify({message, type});
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
      isValidName,
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
      otpCountdownCount
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
