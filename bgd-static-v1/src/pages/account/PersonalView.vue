<template>
  <div class="personal-account">
    <div class="web">专属网址: {{ personalState.memberInfo.evip }}</div>
    <q-form ref="profileFormRef">
      <q-input
        standout
        class="q-pb-xs"
        hide-bottom-space
        filled
        v-model="formDetail.nickName"
        label="账号"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '请输入账号']"
        label-color="secondary"
        :readonly="personalState.memberInfo.nickName ? true : false"
      />
      <q-input
        standout
        ref="realNameRef"
        class="q-pb-xs"
        hide-bottom-space
        filled
        v-model="formDetail.realName"
        label="姓名"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '请输入姓名', isValidName]"
        label-color="secondary"
        color="secondary"
        :readonly="personalState.memberInfo.realName ? true : false"
      />
      <q-input
        ref="birthdayRef"
        standout
        label="生日"
        filled
        label-color="secondary"
        color="secondary"
        lazy-rules
        class="q-pb-xs"
        hide-bottom-space
        v-model="formDetail.birthday"
        readonly
        mask="date"
        :rules="[(val) => (val && val.length > 0) || '请输入生日']"
      >
        <template v-slot:append>
          <q-icon name="event" color="white" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="formDetail.birthday" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="关闭" color="white" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <!-- <q-input
        type="date"
        class="q-pb-xs"
        hide-bottom-space
        filled
        v-model="formDetail.birthday"
        label="生日"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '请输入生日']"

        label-color="secondary"
        color="secondary"
        :readonly="personalState.memberInfo.birthday ? true : false"
      /> -->

      <div class="flex items-center no-wrap">
        <q-input
          standout
          filled
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.phone"
          type="tel"
          label="电话"
          lazy-rules
          :rules="[(_) => isValidPhone()]"
          label-color="secondary"
          color="secondary"
          readonly
          style="width: 100%"
        ></q-input>
        <template v-if="isEditPhone">
          <div class="q-ml-md">
            <q-btn
              size="sm"
              color="brightbtn"
              label="验证"
              @click="goToPage('/account/verifyTelephone')"
              style="white-space: nowrap"
            />
          </div>
        </template>
      </div>

      <div class="flex items-center no-wrap">
        <q-input
          standout
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.email"
          label="邮箱"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || '请输入邮箱']"
          label-color="secondary"
          color="secondary"
          readonly
          style="width: 100%"
        />
        <template v-if="isEditEmail">
          <div class="q-ml-md">
            <q-btn
              size="sm"
              color="brightbtn"
              label="验证"
              @click="goToPage('/account/verifyEmail')"
              style="white-space: nowrap"
            />
          </div>
        </template>
      </div>

      <!-- <q-input
        v-if="!formDetail.phoneVerified"
        standout
        bg-color="white"
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
            color="brightbtn"
            label="验证"
            :disable="!formDetail.phone"
            @click="openVerificationDialog"
          />
        </template>
      </q-input> -->

      <div class="text-center q-mt-md" v-if="canEdit">
        <q-btn size="md" color="brightbtn" @click="updateState" label="保存信息" />
      </div>
    </q-form>
  </div>

  <q-dialog width="100%" v-model="showCaptchaDialog">
    <q-card style="width: 100%; padding: 20px" class="bg-dark text-white text-center">
      <q-card-section class="q-mb-md">
        <strong>系统提示</strong>
        <br />
        <br />
        请登录后再操作
      </q-card-section>
      <router-link to="/login?redirect=/account"><q-btn label="确认" color="brightbtn" /></router-link>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showCaptchaDialog" width="100%">
    <q-card width="100%">
      <q-card-section style="padding: 10px 20px" class="q-pa-md bg-dark text-white">验证码</q-card-section>
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
        <q-btn @click="onCaptchaSubmit" label="发送验证码" color="brightbtn" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="js">
import {defineComponent, reactive, ref, onMounted, onActivated, computed} from "vue";
import moment from "moment";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {userStore} from "src/stores";
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

    const profileFormRef = ref();

    const store = userStore();
    const router = useRouter();

    const isEditEmail = ref(false);
    const isEditPhone = ref(false);
    const isEditBirthday = ref(false);
    const loadInfo = () => {
      personalState.memberInfo = userStore();
      console.log(personalState.memberInfo.realName);
      if (personalState.memberInfo.birthday > 0) {
        personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("YYYY-MM-DD");
      }
      formDetail.nickName = personalState.memberInfo.nickName;
      formDetail.realName = personalState.memberInfo.realName;
      formDetail.birthday = personalState.memberInfo.birthday;
      formDetail.email = personalState.memberInfo.email;
      formDetail.phone = personalState.memberInfo.phone;
      formDetail.phoneVerified = personalState.memberInfo.phoneVerified;
      formDetail.emailVerified = personalState.memberInfo.emailVerified;

      isEditEmail.value = (formDetail.emailVerified === false) ? true : false;
      isEditBirthday.value = (formDetail.birthday == '') ? true : false;
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

    onActivated(() => {
      loadInfo();
      getCode();
    })

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
            message: "OTP验证码已发送至您的邮箱",
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

    const isEdit = ref(false);

    const formDetail = reactive([]);
    const realNameRef = ref();
    const birthdayRef = ref();
    const emailRef = ref();

    const captchaRef = ref();
    const showCaptchaDialog = ref(false);
    const showVerificationTokenInput = ref(false)

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
      console.log(updateInfo);
      updateInfo.birthday = moment(formDetail.birthday, "YYYY/MM/DD").format("YYYY-MM-DD");
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
          /^([\u4e00-\u9fa5]*)$/;
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

    const goToPage = (page) => {
      router.push(page);
    }

    const onCaptchaSubmit = () => {
      api.post(`/otp/sendSms`, qs.stringify({
        telephone: formDetail.phone,
        captchaCode: captchaRef.value,
        codeId: updateSecurityVerified.codeId
      }))
          .then(res => {
            let message = res.message || '发送手机验证码成功',
                color = 'positive'

            if (res.code === 0) {
              showCaptchaDialog.value = false
              showVerificationTokenInput.value = true
            } else
              color = 'negative';

            if (message)
              $q.notify({message, color});

            console.log('onCaptchaSubmit', res)
          })
    }

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
      goToPage,
      showVerificationTokenInput,
      isValidPhone,
      captchaRef,
      showCaptchaDialog,
      openVerificationDialog,
      onCaptchaSubmit
    };
  }
});
</script>
<style scoped lang="scss">
.personal-account {
  padding: 10px;

  .web {
    color: #33bcd4;
    text-align: center;
    padding: 0 0 10px;
    font-weight: bold;
  }
}
</style>
