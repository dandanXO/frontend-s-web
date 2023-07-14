<template>
  <div class="verify-section">
<!--    <div class="web">专属网址: {{ personalState.memberInfo.evip }}</div>-->
    <q-form ref="profileFormRef">
      <div class="flex items-center no-wrap">
        <q-input
          standout
          bg-color="white"
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.phone"
          type="tel"
          label="手机号码"
          clearable
          lazy-rules
          :rules="[(_) => isValidPhone()]"
          :readonly="showVerifyBtn ? false : true"
          style="width: 100%"
        ></q-input>
        <template v-if="showVerifyBtn">
          <div class="q-ml-md">
            <q-btn
              size="md"
              color="dyblue"
              label="发送验证码"
              @click="openVerificationDialog()"
              style="white-space: nowrap"
            />
          </div>
        </template>
      </div>

      <q-input
        standout
        bg-color="white"
        class="q-pb-xs"
        hide-bottom-space
        ref="phoneOtpRef"
        v-model="formDetail.phoneOtpRef"
        type="tel"
        label="手机验证码"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 5 && val.length < 7) || '请输入验证码'
        ]"
        label-color=""
        color=""
        style="width: 100%"
      ></q-input>

      <div class="text-center q-mt-md" v-if="canEdit">
        <q-btn
          size="md"
          color="dyblue"
          @click="submitUpdateSecurity()"
          label="验证手机号"
        />
      </div>
    </q-form>
  </div>

  <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss>
    <q-card width="100%">
      <q-card-section
        style="padding: 10px 5px"
        class="q-pa-md bg-dyblue text-white"
      >
        <q-toolbar>
          <q-toolbar-title>验证码</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>

      </q-card-section>
      <div style="padding: 20px">
        <q-card-section class="q-mb-md q-pa-md">
          <q-input v-model="innerCaptchaRef" label="验证码">
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
        <q-btn @click="onCaptchaSubmit" label="发送验证码" color="dyblue" />
      </div>
    </q-card>
  </q-dialog>

  <!-- <br />
  phone: {{ formDetail.phone }}
  <br />
  code: {{ formDetail.phoneOtpRef }}
  <br />
  codeId: {{ phoneCodeId }} -->
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "src/stores";

export default defineComponent({
  name: "PersonalView",
  setup() {
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

    const phoneCodeId = ref("")

    const personalState = reactive({
      memberInfo: {}
    });
    const verificationDetails = reactive({

    });

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
            verificationImg.value =
              "data:image/png;base64," + response.data.img;
            updateSecurityVerified.codeId = response.data.id;
            innerCaptchaRef.value= "";
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
      api.post("/otp/sendEmail", qs.stringify(phoneDetails)).then((ret) => {
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
      phoneOtpRef.value.validate()
      if (phoneOtpRef.value.hasError) {
      } else {
        api.post("/session/verifyAndUpdatePhone", qs.stringify({
          phone: formDetail.phone,
          code: formDetail.phoneOtpRef,
          codeId: phoneCodeId.value})).then((res) => {
          if (res.code === 0) {
            store.setPhone(formDetail.phone);
            $q.notify({
              color: "positive",
              position: "top",
              message: "验证成功",
              icon: "check_circle_outline"
            });
            store.phoneVerified = true;
            store.phone = formDetail.phone;
            router.push('/account');
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
    const phoneOtpRef = ref();

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

      const phonePattern =
          /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      return phonePattern.test(formDetail.phone) || "请输入有效的电话号码";

    }

    const openVerificationDialog = () => {
      getCode()
      showCaptchaDialog.value = true
    }

    const onCaptchaSubmit = () => {
      if(!formDetail.phone){
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
        telephone: formDetail.phone,
        captchaCode: innerCaptchaRef.value,
        codeId: updateSecurityVerified.codeId
      }))
      .then(res => {
        getCode();
        let message = res.message || '发送手机验证码成功',
          color = 'positive'

        if (res.code === 0)  {
          canEdit.value= true;
          showCaptchaDialog.value = false
          showVerifyBtn.value = false;
          showVerificationTokenInput.value = true
          phoneCodeId.value = res.data.codeId;
          console.log(res.data.codeId)
        }
        else
          color = 'negative';
          getCode();

        if(message)
          $q.notify({ message, color });

        console.log('onCaptchaSubmit', res)
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
      verifyVerificationCode,
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

      showVerificationTokenInput,
      isValidPhone,
      captchaRef,
      innerCaptchaRef,
      showCaptchaDialog,
      openVerificationDialog,
      onCaptchaSubmit,
      showVerifyBtn,
      phoneCodeId
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
  .q-field{
    border: 1px solid #d7d7d7;
    border-radius:10px;
    margin-bottom: 10px;
  }
}

.q-toolbar{
  background: #0089ED;
}
</style>
