<template>
  <div class="personal-account">
    <!--    <div class="web">专属网址: {{ personalState.memberInfo.evip }}</div>-->
    <q-form ref="profileFormRef">
      <div class="mb-12">
        <q-input
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.nickName"
          placeholder="账号"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || '请输入账号']"
          label-color=""
          :readonly="personalState.memberInfo.nickName ? true : false"
        >
          <template v-slot:prepend>
            <!-- <q-icon name="person_outline" /> -->
            <label class="header-label">账号&#12288;&#12288;</label>
          </template>
        </q-input>
      </div>
      <div class="mb-12">
        <q-input
          ref="realNameRef"
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.realName"
          placeholder="姓名"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || '请输入姓名', isValidName]"
          label-color=""
          :readonly="personalState.memberInfo.realName ? true : false"
        >
          <template v-slot:prepend>
            <!-- <q-icon name="badge" class="material-icons-outlined" /> -->
            <label class="header-label">姓名&#12288;&#12288;</label>
          </template>
        </q-input>
      </div>
      <div class="mb-12">
        <q-input
          ref="birthdayRef"
          label-color=""
          lazy-rules
          hide-bottom-space
          placeholder="DD/MM/YYYY"
          v-model="formDetail.birthday"
          :rules="[(val) => (val && val.length > 0) || '请输入生日', isValidBirth]"
        >
          <template v-slot:prepend>
            <!-- <q-icon name="cake" class="material-icons-outlined" /> -->
            <label class="header-label">生日&#12288;&#12288;</label>
          </template>
          <template v-slot:append>
            <img
              ref="datePickerBtnRef"
              src="../../assets/images/account/date-picker.png"
              width="32px"
              class="date-picker-btn"
            />
            <q-popup-proxy cover transition-show="scale" transition-hide="scale" :target="datePickerBtnRef">
              <q-date v-model="formDetail.birthday" mask="DD/MM/YYYY">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="关闭" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </template>
        </q-input>
      </div>

      <div class="flex items-center no-wrap mb-12">
        <q-input
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.email"
          placeholder="邮箱"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || '请输入邮箱']"
          label-color=""
          color=""
          readonly
          style="width: 100%"
          @click="isEditPhone ? goToVerifyEmail() : ''"
        >
          <template v-slot:append v-if="isEditEmail">
            <router-link to="/account/verifyEmail">
              <q-btn class="verification-btn">验证</q-btn>
            </router-link>
          </template>
          <template v-slot:prepend>
            <!-- <q-icon name="mail" class="material-icons-outlined" /> -->
            <label class="header-label">邮箱地址</label>
          </template>
        </q-input>
      </div>

      <div class="flex items-center no-wrap mb-12">
        <q-input
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.phone"
          type="tel"
          placeholder="电话"
          lazy-rules
          :rules="[(_) => isValidPhone()]"
          label-color=""
          color=""
          readonly
          style="width: 100%"
          @click="isEditPhone ? goToVerifyTelephone() : ''"
        >
          <template v-slot:append v-if="isEditPhone">
            <router-link to="/account/verifyTelephone">
              <q-btn class="verification-btn">验证</q-btn>
            </router-link>
          </template>
          <template v-slot:prepend>
            <!-- <q-icon name="phone_in_talk" class="material-icons-outlined" /> -->
            <label class="header-label">电话&#12288;&#12288;</label>
          </template>
        </q-input>
      </div>

      <!-- <q-input
        v-if="!formDetail.phoneVerified"
        standout

        class="q-pb-xs"
        hide-bottom-space
        v-model="formDetail.phone"
        type="tel"
        label="手机验证码"
        lazy-rules
        :rules="[(_) => isValidPhone()]"
        label-color=""
        color=""
        :readonly="personalState.memberInfo.phone ? true : false"
      >
        <template v-slot:append v-if="!formDetail.phoneVerified">
          <q-btn
            size="sm"
            color="dyblue"
            label="验证"
            :disable="!formDetail.phone"
            @click="openVerificationDialog"
          />
        </template>
      </q-input> -->

      <div class="notification-text">
        信息更新后将无法更改，如需帮助请
        <router-link class="notification-text__link" :to="chatPage">联系客服</router-link>
      </div>

      <div class="text-center q-mt-md" v-if="canEdit">
        <q-btn size="md" class="submit-btn" @click="updateState" label="提交" />
      </div>
    </q-form>
  </div>

  <q-dialog width="100%" v-model="showCaptchaDialog">
    <q-card style="width: 100%; padding: 20px" class="bg-white text-black text-center">
      <q-card-section class="q-mb-md" style="flex-direction: column; display: flex">
        <strong>系统提示</strong>
        <br />
        <br />
        请登录后再操作
      </q-card-section>
      <router-link to="/login?redirect=/promo">
        <q-btn label="确认" color="dyblue" />
      </router-link>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showCaptchaDialog" width="100%">
    <q-card width="100%">
      <q-card-section style="padding: 10px 20px" class="q-pa-md bg-dyblue text-white">验证码</q-card-section>
      <div style="padding: 20px">
        <q-card-section class="q-mb-md q-pa-md">
          <q-input v-model="captchaRef" label="验证码">
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
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted, computed, onActivated } from "vue";
import moment from "moment";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "src/stores";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "PersonalView",
  setup() {
    // const isCardActive = ref();
    const qs = require("qs");
    const $q = useQuasar();
    const searchForm = reactive({
      start: "",
      end: ""
    });
    const router = useRouter();

    const profileFormRef = ref();

    const store = userStore();

    const datePickerBtnRef = ref();

    const chatPage = computed(() => {
      if (store.chatGuid) {
        let url = `/liveChat/chat?uid=${store.chatGuid}`;
        if (store.token) {
          url += `&token=${store.token}`;
        }
        return url;
      }
      return "/liveChat";
    });

    const loadInfo = () => {
      personalState.memberInfo = userStore();
      if (personalState.memberInfo.birthday > 0) {
        personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("DD/MM/YYYY");
      }
      formDetail.nickName = personalState.memberInfo.nickName;
      formDetail.realName = personalState.memberInfo.realName;
      formDetail.birthday = personalState.memberInfo.birthday;
      formDetail.email = personalState.memberInfo.email;
      formDetail.phone = personalState.memberInfo.phone;
      formDetail.phoneVerified = personalState.memberInfo.phoneVerified;
      formDetail.emailVerified = personalState.memberInfo.emailVerified;

      isEditEmail.value = (formDetail.emailVerified === false) ? true : false;
      isEditBirthday.value = (formDetail.birthday == "") ? true : false;
      isEditPhone.value = (formDetail.phoneVerified === false) ? true : false;
    };

    const canEdit = computed(() => {
      if (personalState.memberInfo && (!personalState.memberInfo.realName || !personalState.memberInfo.birthday)) {
        return true;
      }
      return false;
    });

    const personalState = reactive({
      memberInfo: {}
    });
    const verificationDetails = reactive({
      memberInfo: {}
    });

    onActivated(()=>{
      loadInfo()
    })

    onMounted(() => {
      // loadInfo();
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
            message: "OTP验证码已发送至您的邮箱。",
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
      emailAddressRef.value.validate();
      verificationCodeRef.value.validate();
      if (emailAddressRef.value.hasError || verificationCodeRef.value.hasError) {
      } else {
        verificationDetails.memberInfo.code = updateSecurityVerified.verificationCode;
        api.post("/otp/verifyEmail", qs.stringify(verificationDetails.memberInfo)).then((res) => {
          if (res.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: "验证成功",
              icon: "check_circle_outline"
            });
            updateSecurityModalVisible.value = false;
            loadInfo();
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

    const captchaRef = ref();
    const showCaptchaDialog = ref(false);
    const showVerificationTokenInput = ref(false);

    const updateState = () => {
      const updateInfo = {};
      if (!personalState.memberInfo.birthday) {
        birthdayRef.value.validate();
        if (birthdayRef.value.hasError) {
          return;
        }
      }
      if (!personalState.memberInfo.realName) {
        realNameRef.value.validate();
        if (realNameRef.value.hasError) {
          return;
        }
      }
      console.log(formDetail.birthday);
      updateInfo.birthday = moment(formDetail.birthday, "DD/MM/YYYY").format("YYYY-MM-DD");
      updateInfo.realName = formDetail.realName;

      api.post("/session/account", qs.stringify(updateInfo)).then((r) => {
        if (r.code === 0) {
          profileFormRef.value.reset();

          $q.notify({
            color: "positive",
            position: "top",
            message: "更新成功",
            icon: "check_circle_outline"
          });

          store.getMemberInfo().then(() => {
            loadInfo();
          });
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: r.message,
            icon: "report_problem"
          });
        }
      });
    };

    const isValidName = () => {
      const namePattern =
        /^([\u4e00-\u9fa5·]*)$/;
      return namePattern.test(formDetail.realName) || "请输入中文字符";
    };

    const goToVerifyTelephone = () => {
      router.push(`/account/verifyTelephone`);
    }

    const goToVerifyEmail = () => {
      router.push(`/account/verifyEmail`);
    }

    const isValidPhone = () => {

      const reg = /^\d+$/;
      const { phone } = formDetail;

      const result = "" === phone ? "请验证您的电话号码" : !reg.test(phone) ? "电话号码只允许使用数字" : true;

      return result;
    };

    const isValidBirth= () => {
      const reg= /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/ ;

      console.log("Bir");
      console.log(formDetail.birthday);

      const result = !reg.test(formDetail.birthday) ? "请输入正确的日期" : true;

      return result;
    }

    const openVerificationDialog = () => {
      getCode();

      showCaptchaDialog.value = true;
    };

    const onCaptchaSubmit = () => {
      api.post(`/otp/sendSms`, qs.stringify({
        telephone: formDetail.phone,
        captchaCode: captchaRef.value,
        codeId: updateSecurityVerified.codeId
      }))
        .then(res => {
          let message = res.message || "发送手机验证码成功",
            color = "positive";

          if (res.code === 0) {
            showCaptchaDialog.value = false;
            showVerificationTokenInput.value = true;
          } else
            color = "negative";

          if (message)
            $q.notify({ message, color });

          console.log("onCaptchaSubmit", res);
        });
    };

    return {
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
      loadInfo,
      isEditBirthday,
      formDetail,
      profileFormRef,
      updateState,
      isValidBirth,
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
      realNameRef,
      birthdayRef,
      moment,
      canEdit,
      isValidName,
      showVerificationTokenInput,
      isValidPhone,
      captchaRef,
      showCaptchaDialog,
      openVerificationDialog,
      onCaptchaSubmit,
      goToVerifyTelephone,
      goToVerifyEmail,
      chatPage,
      datePickerBtnRef
    };
  }
});
</script>
<style lang="scss">
.personal-account {
  padding: 10px;

  .header-label {
    font-size: 14px;
    font-weight: 600;
    margin-left: 12px;
    color: #7a80a1;
  }

  .web {
    color: #0089ed;
    text-align: center;
    padding: 0 0 10px;
    font-weight: bold;
    font-size: 15px;
  }

  input.q-placeholder {
    color: #424f72 !important;
  }

  .q-input {
    background: #fcfdfe;
    border-radius: 7px;
    .q-field__inner {
      .q-field__control,
      .q-field__marginal {
        height: 44px;
      }
      .q-field__control {
        &::before {
          border-bottom: none;
        }
      }
    }
  }

  .verification-btn {
    background-image: url("../../assets/images/account/account-btn.png");
    background-size: 100% 100%;
    color: #fff;
    width: 60px;
    text-align: center;
    white-space: nowrap;
    font-size: 1rem;
    aspect-ratio: 122/68;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
    box-shadow: 0px -0.5px 2px 0px #ffffff;
    border-radius: 45.9px;
    margin-right: 5px;
  }

  .mb-12 {
    margin-bottom: 12px;
  }

  .notification-text {
    font-size: 12.5px;
    color: #7a80a1;
    text-align: center;
    .notification-text__link {
      text-decoration: underline;
      color: #458bff;
    }
  }
  .date-picker-btn {
    margin-right: 10px;
  }
  .submit-btn {
    width: 100%;
    background: radial-gradient(103.75% 103.75% at 50% -3.75%, #94c3ff 0%, #4b91f5 100%);
    border: 1px solid #ffffff;
    border-radius: 30px;
    color: #fff;
  }
}
</style>
