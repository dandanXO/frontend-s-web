<template>
  <div class="verify-section">
    <!--    <div class="web">专属网址: {{ personalState.memberInfo.evip }}</div>-->
    <q-form ref="profileFormRef">
      <div class="flex items-center no-wrap">
        <q-input
          class="q-pb-xs"
          hide-bottom-space
          ref="phoneRef"
          v-model="formDetail.phone"
          type="tel"
          placeholder="请输入电话"
          clearable
          lazy-rules
          :rules="[(_) => isValidPhone()]"
          :readonly="showVerifyBtn ? false : true"
          style="width: 100%"
        >
          <template v-slot:prepend>
            <!-- <q-icon name="person_outline" /> -->
            <label class="header-label">电话&#12288;</label>
          </template>
          <template v-slot:append>
            <q-btn
              class="verification-btn"
              :disable="!showVerifyBtn && otpCountdownCount > 0"
              @click="openVerificationDialog"
            >
              {{ showVerifyBtn && otpCountdownCount <= 0 ? `发送验证码` : `已发送（${otpCountdownCount}秒)` }}
            </q-btn>
          </template>
        </q-input>
      </div>

      <div class="flex items-center no-wrap">
        <q-input
          class="q-pb-xs"
          hide-bottom-space
          ref="phoneOtpRef"
          v-model="formDetail.phoneOtpRef"
          type="tel"
          placeholder="请输入电话验证码"
          lazy-rules
          :rules="[(val) => (val && val.length > 5 && val.length < 7) || '请输入验证码']"
          label-color=""
          color=""
          style="width: 100%"
        >
          <template v-slot:prepend>
            <!-- <q-icon name="person_outline" /> -->
            <label class="header-label">验证码</label>
          </template>
        </q-input>
        <!--        <div v-if="otpCountdownCount" class="q-ml-md">-->
        <!--          <q-btn-->
        <!--            size="md"-->
        <!--            color="grey"-->
        <!--            :label="`已发送（倒数${otpCountdownCount}秒)`"-->
        <!--            @click="openVerificationDialog()"-->
        <!--            style="white-space: nowrap"-->
        <!--            :disable="!showVerifyBtn && otpCountdownCount > 0"-->
        <!--          />-->
        <!--        </div>-->
      </div>

      <div class="text-center q-mt-md" v-if="canEdit">
        <q-btn size="md" color="dyblue" @click="submitUpdateSecurity()" label="验证手机号" />
      </div>
    </q-form>
  </div>

  <CommonModal
    v-model="showCaptchaDialog"
    confirm-btn-text="提交"
    no-backdrop-dismiss
    header="验证码"
    @confirm="onCaptchaSubmit"
  >
    <template #content>
      <q-input
        class="verification-code-input"
        standout
        :rules="[(val) => (val && val.length > 3 && val.length < 5) || '请输入验证码']"
        v-model="innerCaptchaRef"
        placeholder="请输入验证码"
        ref="refInnerCaptchaCode"
      >
        <template v-slot:append>
          <img class="verification-img" :src="verificationImg" title="点击刷新验证码" @click="getCode" />
        </template>
      </q-input>
    </template>
  </CommonModal>

  <CommonModal
    v-model="showUpdateSecuritySuccessDialog"
    no-backdrop-dismiss
    header="验证码"
    message="提交成功"
    @hide="handleUpdateSecuritySuccessDialogHide"
    @confirm="showUpdateSecuritySuccessDialog = false"
  />
</template>

<script setup>
import { defineComponent, reactive, ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "src/stores";
import CommonModal from "src/components/CommonModal.vue";

// const isCardActive = ref();
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
  personalState.memberInfo = userStore();
  if (personalState.memberInfo.birthday > 0) {
    personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("YYYY-MM-DD");
  }
  formDetail.nickName = personalState.memberInfo.nickName;
  formDetail.realName = personalState.memberInfo.realName;
  formDetail.birthday = personalState.memberInfo.birthday;
  formDetail.email = personalState.memberInfo.email;
  formDetail.phone = personalState.memberInfo.phone;
  formDetail.phoneVerified = personalState.memberInfo.phoneVerified;
};

const canEdit = ref(false);

//   computed(() => {
//   if (personalState.memberInfo && (!personalState.memberInfo.realName || !personalState.memberInfo.birthday)) {
//     return true;
//   }
//   return false;
// });

const phoneCodeId = ref("");

const personalState = reactive({
  memberInfo: {}
});
const verificationDetails = reactive({});

onMounted(() => {
  loadInfo();
  getCode();
});

const verificationImg = ref("");
const getCode = () => {
  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        verificationImg.value = "data:image/png;base64," + response.data.img;
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
  const phoneDetails = {
    email: updateSecurityVerified.emailAddress,
    captchaCode: updateSecurityVerified.captchaCode,
    codeId: updateSecurityVerified.codeId
  };
  api
    .post("/otp/sendEmail", qs.stringify(phoneDetails))
    .then((ret) => {
      if (ret.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "验证码已经发送，请查收",
          icon: "check_circle_outline"
        });
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
  phoneOtpRef.value.validate();
  if (phoneOtpRef.value.hasError) {
  } else {
    api
      .post(
        "/session/verifyAndUpdatePhone",
        qs.stringify({
          phone: formDetail.phone,
          code: formDetail.phoneOtpRef,
          codeId: phoneCodeId.value
        })
      )
      .then((res) => {
        if (res.code === 0) {
          store.setPhone(formDetail.phone);
          // $q.notify({
          //   color: "positive",
          //   position: "top",
          //   message: "验证成功",
          //   icon: "check_circle_outline"
          // });
          showUpdateSecuritySuccessDialog.value = true;
          store.phoneVerified = true;
          store.phone = formDetail.phone;
          // router.push("/account");
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
const phoneRef = ref();
const phoneOtpRef = ref();

const captchaRef = ref();
const innerCaptchaRef = ref();
const showCaptchaDialog = ref(false);
const showVerifyBtn = ref(true);
const showVerificationTokenInput = ref(false);
const refInnerCaptchaCode = ref();

const isValidName = () => {
  const namePattern = /^([\u4e00-\u9fa5·]*)$/;
  return namePattern.test(formDetail.realName) || "请输入中文字符";
};

const isValidPhone = () => {
  const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  return phonePattern.test(formDetail.phone) || "请输入有效的电话号码";
};

const openVerificationDialog = () => {
  phoneRef.value.validate();
  if (!phoneRef.value.hasError) {
    getCode();
    showCaptchaDialog.value = true;
  }
};

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
const onCaptchaSubmit = () => {
  if (!formDetail.phone) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "手机号码不能为空",
      icon: "report_problem"
    });
    getCode();
    return;
  }
  if (refInnerCaptchaCode.value.hasError) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "验证码必须为4个字符串",
      icon: "report_problem"
    });
    getCode();
    return;
  }

  api
    .post(
      `/otp/sendSms`,
      qs.stringify({
        telephone: formDetail.phone,
        captchaCode: innerCaptchaRef.value,
        codeId: updateSecurityVerified.codeId
      })
    )
    .then((res) => {
      getCode();
      let message = res.message || "发送手机验证码成功",
        color = "positive";

      if (res.code === 0) {
        canEdit.value = true;
        showCaptchaDialog.value = false;
        showVerifyBtn.value = false;
        countdownOtp();
        showVerificationTokenInput.value = true;
        phoneCodeId.value = res.data.codeId;
        console.log(res.data.codeId);
      } else color = "negative";
      getCode();

      if (message) $q.notify({ message, color });

      console.log("onCaptchaSubmit", res);
    });
};

const showUpdateSecuritySuccessDialog = ref(false);

const handleUpdateSecuritySuccessDialogHide = () => {
  router.push("/account");
};

onUnmounted(() => {
  clearInterval(otpCountdownSchedule);
});
</script>
<style lang="scss">
.verify-section {
  padding: 10px;

  .web {
    color: #3764d6;
    text-align: center;
    padding: 0 0 10px;
    font-weight: bold;
    font-size: 17px;
  }

  input.q-placeholder {
    color: #333333 !important;
  }

  .q-input {
    border-radius: 7px;
    overflow: hidden;
    .q-field__inner {
      .q-field__control,
      .q-field__marginal {
        height: 44px;
      }
      .q-field__control {
        background: #fcfdfe;
        &::before {
          border-bottom: none;
        }
      }
    }
  }

  .header-label {
    font-size: 14px;
    font-weight: 600;
    margin-left: 12px;
    color: #7a80a1;
  }

  .verification-btn {
    background-image: url("../../assets/images/index/primary-btn.png");
    background-size: 100% 100%;
    color: #fff;
    width: 87px;
    text-align: center;
    white-space: nowrap;
    font-size: 12px;
    aspect-ratio: 87/32;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
    box-shadow: 0px -0.87px 3.47px 0px #ffffff;
    border-radius: 45.9px;
    margin-right: 5px;
  }

  .submit-btn {
    width: 100%;
    background: radial-gradient(103.75% 103.75% at 50% -3.75%, #94c3ff 0%, #4b91f5 100%);
    box-shadow: 0px 2px 0px 0px #9ab0ff70;
    border: 1px solid #ffffff;
    border-radius: 30px;
    color: #fff;
  }
}

.q-toolbar {
  background: #0089ed;
}
</style>
