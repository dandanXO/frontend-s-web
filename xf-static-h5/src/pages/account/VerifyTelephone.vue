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
            手机号码
            <span style="color: #f53434">*</span>
          </div>
          <q-input
            ref="phoneNumberRef"
            hide-bottom-space
            v-model="formDetails.phone"
            type="tel"
            placeholder="请输入手机号码"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || '请输入正确的电话号码', isValidPhone]"
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
            ref="phoneOtpRef"
            v-model="formDetails.phoneOtpRef"
            type="tel"
            label="手机验证码"
            lazy-rules
            :rules="[(val) => (val && val.length > 5 && val.length < 7) || '请输入验证码']"
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
      <q-btn size="md" color="brightbtn" @click="submitUpdateSecurity()" label="验证手机号" style="width: 100%" rounded />
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
import {useRoute, useRouter} from "vue-router";
import moment from "moment";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {userStore} from "src/stores";
import {useClipboard} from '@vueuse/core';

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
        api.post("/session/verifyAndUpdatePhone", qs.stringify({
          phone: formDetails.phone,
          code: formDetails.phoneOtpRef,
          codeId: phoneCodeId.value
        })).then((res) => {
          if (res.code === 0) {
            store.setPhone(formDetails.phone);
            $q.notify({
              color: "positive",
              position: "top",
              message: "验证成功",
              icon: "check_circle_outline"
            });
            store.phoneVerified = true;
            store.phone = formDetails.phone;
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
      const reg = /^\d+$/;
      const {phone} = formDetails;

      const result = '' === phone ? '请验证您的电话号码' : !reg.test(phone) ? '电话号码只允许使用数字' : true;

      return result;
    }

    const openVerificationDialog = () => {
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
            let message = res.message || '发送手机验证码成功',
                color = 'positive'

            if (res.code === 0) {
              canEdit.value = true;
              showCaptchaDialog.value = false
              showVerifyBtn.value = false;
              showVerificationTokenInput.value = true
              phoneCodeId.value = res.data.codeId;
              console.log(res.data.codeId)
            } else {
              color = 'negative';
              getCode();
            }


            if (message) {
              $q.notify({message, color});
            }

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
          referralLink.value = `https://${store.evip}/refer/${response.data}`;
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

    onMounted(() => {
      loadInfo();
      getCode();
      getReferralLink();
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
      referralLink,
      getReferralLink,
      copyReferralLink
    };
  }
});
</script>
<style lang="scss">
.personal-account {
  padding: 10px;
}

.q-toolbar {
  background: #33bcd4;
}
</style>
