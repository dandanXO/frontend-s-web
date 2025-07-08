<template>
  <div class="verify-section">
    <!--    <div class="web">专属网址: {{ personalState.memberInfo.evip }}</div>-->
    <q-form ref="profileFormRef">
      <div class="flex items-center no-wrap">
        <q-input
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.email"
          clearable
          lazy-rules
          ref="emailRef"
          :rules="[(val) => (val && val.length > 0) || '请输入邮箱', isValidEmail]"
          :readonly="showVerifyBtn ? false : true"
          style="width: 100%"
          placeholder="请输入Email"
        >
          <template v-slot:prepend>
            <!-- <q-icon name="person_outline" /> -->
            <label class="header-label">邮箱地址</label>
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

      <q-input
        class="q-pb-xs"
        hide-bottom-space
        ref="emailOtpRef"
        v-model="formDetail.emailOtpRef"
        type="tel"
        lazy-rules
        :rules="[(val) => (val && val.length > 5 && val.length < 7) || '请输入邮箱验证码']"
        label-color=""
        color=""
        style="width: 100%"
        placeholder="请输入Email验证码"
      >
        <template v-slot:prepend>
          <!-- <q-icon name="person_outline" /> -->
          <label class="header-label">验证码&#12288;</label>
        </template>
      </q-input>

      <div class="text-center q-mt-md" v-if="canEdit">
        <q-btn size="md" class="submit-btn" @click="submitUpdateSecurity" label="提交" />
      </div>
    </q-form>
  </div>

  <CommonModal
    v-model="showCaptchaDialog"
    no-backdrop-dismiss
    header="验证码"
    confirm-btn-text="提交"
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

<script lang="js">
import {defineComponent, reactive, ref, onMounted, computed, onUnmounted} from "vue";
import moment from "moment";
import {api} from "boot/axios";
import {useRoute, useRouter} from "vue-router";
import {useQuasar} from "quasar";
import {userStore} from "src/stores";
import CommonModal from "src/components/CommonModal.vue";

export default defineComponent({
  name: "PersonalView",
  components: {
    CommonModal
  },
  setup() {
    // const isCardActive = ref();
    const qs = require("qs");
    const router = useRouter();
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
      formDetail.email = personalState.memberInfo.email;
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
            $q.notify({
              color: "negative",
              position: "top",
              message: e.message,
              icon: "report_problem"
            });
          });
    };
    //update security
    const isValidEmail = () => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(formDetail.email) || "请输入正确的邮箱";
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
      api.post("/otp/sendEmail", qs.stringify(emailDetails)).then((ret) => {
        if (ret.code === 0) {
          canEdit.value = true;
          $q.notify({
            color: "positive",
            position: "top",
            message: "验证码已发送至您的邮箱。",
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
      emailOtpRef.value.validate();
      if (emailOtpRef.value.hasError) {
      } else {
        api.post("/session/verifyAndUpdateEmail", qs.stringify({
          email: formDetail.email,
          code: formDetail.emailOtpRef,
          codeId: emailCodeId.value
        })).then((res) => {
          if (res.code === 0) {
            // $q.notify({
            //   color: "positive",
            //   position: "top",
            //   message: "验证成功",
            //   icon: "check_circle_outline"
            // });
            showUpdateSecuritySuccessDialog.value = true;
            store.emailVerified = true;
            store.email = formDetail.email;

          }
        }).catch((e) => {
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
    const emailOtpRef = ref();
    const refInnerCaptchaCode = ref();

    const captchaRef = ref();
    const innerCaptchaRef = ref();
    const showCaptchaDialog = ref(false);
    const showVerifyBtn = ref(true);
    const showVerificationTokenInput = ref(false);


    const isValidName = () => {
      const namePattern =
          /^([\u4e00-\u9fa5·]*)$/;
      return namePattern.test(formDetail.realName) || "请输入中文字符";
    };

    const isValidPhone = () => {

      const reg = /^\d+$/;
      const {phone} = formDetail;

      const result = "" === phone ? "请验证您的电话号码" : !reg.test(phone) ? "电话号码只允许使用数字" : true;

      return result;
    };

    const openVerificationDialog = () => {
      emailRef.value.validate();
      if(!emailRef.value.hasError){
        getCode();
        showCaptchaDialog.value = true;
      }

    };

    const onCaptchaSubmit = () => {
      if (!formDetail.email) {
        $q.notify({
          color: "negative",
          position: "top",
          message: "邮箱不能为空",
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

      api.post(`/otp/sendNewEmail`, qs.stringify({
        email: formDetail.email,
        captchaCode: innerCaptchaRef.value,
        codeId: updateSecurityVerified.codeId
      }))
          .then(res => {
            let message = res.message || "发送邮箱验证码成功",
                color = "positive";

            if (res.code === 0) {
              canEdit.value = true;
              showCaptchaDialog.value = false;
              showVerifyBtn.value = false;
              showVerificationTokenInput.value = true;
              countdownOtp();
              emailCodeId.value = res.data.codeId;
            } else {
              color = "negative";
              getCode();
            }

            if (message) {
              $q.notify({message, color});
            }

            getCode();

            console.log("onCaptchaSubmit", res);
          }).catch((err) => {
        getCode();
      })
    };

    const showUpdateSecuritySuccessDialog = ref(false);

    const handleUpdateSecuritySuccessDialogHide = () => {
      router.push("/account");
    }

    onUnmounted(() => {
      clearInterval(otpCountdownSchedule);
    });

    return {
      router,
      searchForm,
      personalState,
      updateSecurityFormRef,
      updateSecurityVerified,
      updateSecurityModal,
      updateSecurityModalVisible,
      submitUpdateSecurity,
      refInnerCaptchaCode,
      isEditRealName,
      isEditEmail,
      isEditPhone,
      isEditBirthday,
      formDetail,
      profileFormRef,
      verificationModalVisible,
      openVerificationModal,
      isEmailSending,
      otpCountdownCount,
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
      isValidName,
      isValidEmail,
      showVerificationTokenInput,
      isValidPhone,
      captchaRef,
      innerCaptchaRef,
      showCaptchaDialog,
      openVerificationDialog,
      onCaptchaSubmit,
      showVerifyBtn,
      showUpdateSecuritySuccessDialog,
      handleUpdateSecuritySuccessDialogHide
    };
  }
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

  // .q-field {
  //   //border: 1px solid #d7d7d7;

  //   margin-bottom: 10px;

  //   .q-field__control {
  //     border: 1px solid #d7d7d7;
  //     border-radius: 10px;
  //   }

  //   .q-field__inner {
  //     border: 0px;
  //     border-radius: 10px;
  //   }
  // }

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
