<template>
  <div class="personal-account">
    <div class="web">专属网址：{{ personalState.memberInfo.evip }}</div>
    <q-form ref="profileFormRef">
      <div class="flex items-center no-wrap">
        <q-input
          standout
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.email"
          label="邮箱"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || '请输入邮箱']"
          :readonly="showVerifyBtn ? false : true"
          style="width: 100%"
          dark
        />
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
        ref="emailOtpRef"
        v-model="formDetail.emailOtpRef"
        type="tel"
        label="邮箱验证码"
        lazy-rules
        :rules="[(val) => (val && val.length > 5 && val.length < 7) || '请输入邮箱验证码']"
        style="width: 100%"
      ></q-input>

      <div class="text-center q-mt-md" v-if="canEdit">
        <q-btn size="md" color="brightbtn" @click="submitUpdateSecurity()" label="验证邮箱" />
      </div>
    </q-form>
  </div>

  <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss>
    <q-card width="100%" class="modalcontent">
      <!-- <q-card-section class="q-pa-md bg-brightbtn text-white">
        <q-toolbar>
          <q-toolbar-title>验证码</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-card-section> -->
      <div class="q-px-lg q-pt-sm q-pb-lg">
        <div class="headers">
          <div class="titles">验证码</div>
          <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
        </div>
        <q-card-section class="q-mb-md q-pa-md">
          <q-input v-model="innerCaptchaRef" placeholder="验证码">
            <template v-slot:append>
              <img
                :src="verificationImg"
                title="点击刷新验证码"
                v-show="showImagecode"
                @load="imgOnLoad"
                @error="imgOnError"
                style="margin-top: 6px; cursor: pointer"
                @click="getCode"
              />
            </template>
          </q-input>
        </q-card-section>
        <div class="send-otp-btn">
          <q-btn @click="onCaptchaSubmit" label="发送验证码" color="brightbtn" />
        </div>
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
import { useNotify } from "src/hooks/notify";

export default defineComponent({
  name: "PersonalView",
  setup() {
    const notify = useNotify();
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
    const showImagecode = ref(true)

    const personalState = reactive({
      memberInfo: {}
    });
    const verificationDetails = reactive({});

    onMounted(() => {
      loadInfo();
      // getCode();
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
            notify({
              type: "error",
              message: e.message,
            });
          });
    };
    //update security
    const imgOnLoad = (event)=>{
      showImagecode.value = true
    }
    const imgOnError = ()=>{
      showImagecode.value = false
    }
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
          notify({
            type: "success",
            message: "OTP 验证码已发送至您的邮箱",
          });
          canEdit.value = true;
          verificationDetails.memberInfo.codeId = ret.data.codeId;
          verificationModalVisible.value = false;
          isEmailSending.value = false;
        } else {
          // notify({
          //   type: "error",
          //          //   message: ret.message,
          //          // });
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
        api.post("/session/verifyAndUpdateEmail", qs.stringify({
          email: formDetail.email,
          code: formDetail.emailOtpRef,
          codeId: emailCodeId.value
        })).then((res) => {
          if (res.code === 0) {
            notify({
              type: "success",
              message: "验证成功",
            });
            store.emailVerified = true;
            store.email= formDetail.email;
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


    const isValidName = () => {
      const namePattern =
          /^([\u4e00-\u9fa5]*)$/;
      return namePattern.test(formDetail.realName) || "请输入中文字符";
    };

    const isValidPhone = () => {

      const reg = /^\d+$/;
      const {phone} = formDetail;

      const result = '' === phone ? '请验证您的电话号码' : !reg.test(phone) ? '电话号码只允许使用数字' : true;

      return result
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
      getCode()
      showCaptchaDialog.value = true
    }

    const onCaptchaSubmit = () => {
      if (!formDetail.email) {
        notify({
          type: "error",
          message: "邮箱不能为空",
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

            let message = res.message || '发送邮箱验证码成功',
                type = 'success'

            if (res.code === 0) {
              canEdit.value = true;
              showCaptchaDialog.value = false
              showVerifyBtn.value = false;
              showVerificationTokenInput.value = true
              countdownOtp();
              emailCodeId.value = res.data.codeId;
            } else{
              type = 'error';
              getCode();
            }

            if (message){
              notify({message, type});
            }


            // console.log('onCaptchaSubmit', res)
          }).catch((err) => {
            getCode()
      })
    }

    return {
      showImagecode,
      imgOnLoad,
      imgOnError,
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
      isValidName,
      otpCountdownCount,
      showVerificationTokenInput,
      isValidPhone,
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
.modalcontent {
  box-shadow: none;
  .headers {
    display: flex;
    width: 100%;
  }
  .titles {
    width: 100%;
    align-self: center;
    text-align: center;
  }
  .send-otp-btn {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
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
.body--dark {
  .modalcontent {
    background: linear-gradient(180deg, #384e79 2.08%, #2c3d61 47.5%, #212e4c 100%);
  }
}
</style>
