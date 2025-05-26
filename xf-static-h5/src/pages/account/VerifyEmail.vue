<template>
  <div class="personal-account">
    <div class="web">
      <q-icon name="volume_up" size="sm" class="q-mr-sm" />
      推荐链接:
      <span>{{ referralLink }}</span>
      <q-icon
        @click="copyReferralLink"
        name="content_copy"
        rounded
        unelevated
        size="xs"
        class="q-ml-auto"
        color="bright"
      />
    </div>
    <q-form ref="profileFormRef" class="bg-darkbox">
      <div class="q-gutter-y-md">
        <div>
          <div class="input-label q-mb-sm">
            邮箱
            <span style="color: #f53434">*</span>
          </div>
          <q-input
            hide-bottom-space
            v-model="formDetail.email"
            placeholder="请输入邮箱号"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || '请输入邮箱']"
            :readonly="showVerifyBtn ? false : true"
            style="width: 100%"
            outlined
            color="white"
            bg-color="recinputstyle"
            rounded
          >
            <template v-slot:append v-if="showVerifyBtn">
              <q-btn
                size="md"
                color="brightbtn"
                label="发送验证码"
                @click="openVerificationDialog()"
                style="white-space: nowrap"
                rounded
              />
            </template>
          </q-input>
        </div>

        <div>
          <div class="input-label q-mb-sm">
            验证码
            <span style="color: #f53434">*</span>
          </div>
          <q-input
            hide-bottom-space
            ref="emailOtpRef"
            v-model="formDetail.emailOtpRef"
            type="tel"
            placeholder="请输入邮箱验证码"
            lazy-rules
            :rules="[(val) => (val && val.length > 5 && val.length < 7) || '请输入邮箱验证码']"
            style="width: 100%"
            outlined
            color="white"
            bg-color="recinputstyle"
            rounded
          ></q-input>
        </div>
      </div>
    </q-form>

    <div class="text-center q-mt-md" v-if="canEdit">
      <q-btn size="md" color="brightbtn" @click="submitUpdateSecurity()" label="验证邮箱" style="width: 100%" />
    </div>
  </div>

  <q-dialog v-model="showCaptchaDialog" width="100%">
    <q-card width="100%" class="bg-darkbox">
      <q-toolbar-title class="q-mb-md">验证码</q-toolbar-title>

      <q-card-section>
        <q-input v-model="innerCaptchaRef" placeholder="验证码" outlined color="white" bg-color="recinputstyle">
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
      <div class="row q-mt-md">
        <q-btn @click="onCaptchaSubmit" label="发送验证码" color="brightbtn" rounded class="q-ml-auto" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="js">
/* eslint-disable */
import {defineComponent, reactive, ref, onMounted, computed} from "vue";
import moment from "moment";
import {api} from "boot/axios";
import {useRoute, useRouter} from "vue-router";
import {useQuasar} from "quasar";
import {userStore} from "src/stores";
import {useClipboard} from '@vueuse/core';

export default defineComponent({
  name: "PersonalView",
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
      getReferralLink();
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
          $q.notify({
            color: "positive",
            position: "top",
            message: "OTP验证码已发送至您的邮箱",
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
        api.post("/session/verifyAndUpdateEmail", qs.stringify({
          email: formDetail.email,
          code: formDetail.emailOtpRef,
          codeId: emailCodeId.value
        })).then((res) => {
          if (res.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: "验证成功",
              icon: "check_circle_outline"
            });
            store.emailVerified = true;
            store.email= formDetail.email;
            router.go(-1);
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

    const captchaRef = ref();
    const innerCaptchaRef = ref();
    const showCaptchaDialog = ref(false);
    const showVerifyBtn = ref(true);
    const showVerificationTokenInput = ref(false)


    const isValidName = () => {
      const namePattern =
          /^([\u4e00-\u9fa5·]*)$/;
      return namePattern.test(formDetail.realName) || "请输入中文字符";
    };

    const isValidPhone = () => {

      const reg = /^\d+$/;
      const {phone} = formDetail;

      const result = '' === phone ? '请验证您的电话号码' : !reg.test(phone) ? '电话号码只允许使用数字' : true;

      return result
    }

    const openVerificationDialog = () => {
      getCode()
      showCaptchaDialog.value = true
    }

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

      api.post(`/otp/sendNewEmail`, qs.stringify({
        email: formDetail.email,
        captchaCode: innerCaptchaRef.value,
        codeId: updateSecurityVerified.codeId
      }))
          .then(res => {
            getCode();
            let message = res.message || '发送邮箱验证码成功',
                color = 'positive'

            if (res.code === 0) {
              canEdit.value = true;
              showCaptchaDialog.value = false
              showVerifyBtn.value = false;
              showVerificationTokenInput.value = true

              emailCodeId.value = res.data.codeId;
            } else
              color = 'negative';
            getCode();

            if (message)
              $q.notify({message, color});
            getCode();

            console.log('onCaptchaSubmit', res)
          })
    }

    //copy referral link
    const referralLink = ref();
    const getReferralLink = () => {
      api
      .get("/session/member/referralCode")
      .then((response) => {
        if(response.code === 0) {
          referralLink.value = `https://${personalState.memberInfo.evip}/refer/${response.data}`;
        }
      }).catch((err) => {
        console.log(err)
      })
    }
    const copyReferralLink = () => {
      const { copy } = useClipboard();
      copy(referralLink.value);

      $q.notify({
        color: "positive",
        position: "top",
        message: "推荐链接已复制",
        icon: "check_circle_outline"
      });
    };

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
      isValidName,

      showVerificationTokenInput,
      isValidPhone,
      captchaRef,
      innerCaptchaRef,
      showCaptchaDialog,
      openVerificationDialog,
      onCaptchaSubmit,
      showVerifyBtn,
      referralLink,
      getReferralLink,
      copyReferralLink
    };
  }
});
</script>
<style lang="scss">
.personal-account {
  input.q-placeholder {
    //color: #333333 !important;
  }
}

.q-toolbar {
  background: #33bcd4;
}
</style>
