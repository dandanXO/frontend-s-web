<template>
  <div class="personal-account">
    <div class="web">专属网址：{{ personalState.memberInfo.evip }}</div>
    <q-form ref="profileFormRef" class="profile-form">
      <q-input
        standout
        class="q-pb-xs"
        hide-bottom-space
        filled
        v-model="formDetail.nickName"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '请输入账号']"
        label-color="secondary"
        :readonly="personalState.memberInfo.nickName ? true : false"
      >
        <template v-slot:prepend>
          <span>账号</span>
        </template>
      </q-input>
      <q-input
        standout
        ref="realNameRef"
        class="q-pb-xs"
        hide-bottom-space
        filled
        v-model="formDetail.realName"
        placeholder="姓名"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '请输入姓名', isValidName]"
        label-color="secondary"
        color="secondary"
        :readonly="personalState.memberInfo.realName ? true : false"
      >
        <template v-slot:prepend>
          <span>姓名</span>
        </template>
      </q-input>

      <q-input
        ref="birthdayRef"
        standout
        placeholder="生日"
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
        @click="toggleShowPopup"
      >
        <template v-slot:prepend>
          <span>生日</span>
        </template>

        <template v-slot:append>
          <q-icon v-if="isEditBirthday" name="event" color="accent" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-model="showDatePopup">
              <q-date v-model="formDetail.birthday">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="确认" flat />
                  <q-btn v-close-popup label="关闭" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <template v-if="$q.dark.isActive">
        <q-input
        standout
        filled
        class="q-pb-xs"
        hide-bottom-space
        v-model="formDetail.phone"
        type="tel"
        placeholder="电话"
        lazy-rules
        :rules="[(_) => isValidPhone()]"
        label-color="secondary"
        color="secondary"
        readonly
        style="width: 100%"
      >
        <template v-slot:prepend>
          <span>电话</span>
        </template>
        <template v-slot:append>
          <template v-if="isEditPhone">
            <div class="q-ml-md">
              <q-btn
                class="common-sm-btn"
                :color="$q.dark.isActive ? '' : 'brightbtn'"
                label="验证"
                @click="goToPage('/account/verifyTelephone')"
                style="white-space: nowrap"
              />
            </div>
          </template>
        </template>
      </q-input>

        <q-input
          standout
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.email"
          placeholder="邮箱"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || '请输入邮箱']"
          label-color="secondary"
          color="secondary"
          readonly
          style="width: 100%"
        >
          <template v-slot:prepend>
            <span>邮箱</span>
          </template>
          <template v-slot:append>
            <template v-if="isEditEmail">
          <div class="q-ml-md">
            <q-btn
              class="common-sm-btn"
              :color="$q.dark.isActive ? '' : 'brightbtn'"
              label="绑定"
              @click="goToPage('/account/verifyEmail')"
              style="white-space: nowrap;height: 30px;min-height: 30px;padding: 0;font-size:1rem;"
            />
          </div>
        </template>
          </template>
        </q-input>
      </template>
      <template v-else>
        <div class="flex items-baseline no-wrap">
        <q-input
          standout
          filled
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.phone"
          type="tel"
          placeholder="电话"
          lazy-rules
          :rules="[(_) => isValidPhone()]"
          label-color="secondary"
          color="secondary"
          readonly
          style="width: 100%"
        >
          <template v-slot:prepend>
            <span>电话</span>
          </template>
        </q-input>
        <template v-if="isEditPhone">
          <div class="q-ml-md">
            <q-btn
              class="common-sm-btn"
              :color="$q.dark.isActive ? '' : 'brightbtn'"
              label="验证"
              @click="goToPage('/account/verifyTelephone')"
              style="white-space: nowrap"
            />
          </div>
        </template>
      </div>

      <div class="flex items-baseline no-wrap">
        <q-input
          standout
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.email"
          placeholder="邮箱"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || '请输入邮箱']"
          label-color="secondary"
          color="secondary"
          readonly
          style="width: 100%"
        >
          <template v-slot:prepend>
            <span>邮箱</span>
          </template>
        </q-input>
        <template v-if="isEditEmail">
          <div class="q-ml-md">
            <q-btn
              class="common-sm-btn"
              :color="$q.dark.isActive ? '' : 'brightbtn'"
              label="验证"
              @click="goToPage('/account/verifyEmail')"
              style="white-space: nowrap"
            />
          </div>
        </template>
      </div>
      </template>

      <!-- <div class="flex items-baseline no-wrap">
        <q-input
          standout
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.gender"
          placeholder="性别"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || '请输入性别']"
          label-color="secondary"
          color="secondary"
          readonly
          style="width: 100%"
        >
          <template v-slot:prepend>
            <span>性别</span>
          </template>
        </q-input>
      </div> -->

      <div class="flex items-baseline no-wrap q-select">
        <q-select
          standout
          class="q-pb-xs"
          hide-bottom-space
          v-model="formDetail.gender"
          placeholder="选择性别"
          lazy-rules
          :options="options"
          label-color="#7a80a1"
          color="#7a80a1"
          :disabled="personalState.memberInfo.gender ? true : false"
          :readonly="personalState.memberInfo.gender ? true : false"
          style="width: 100%"
          :dense="dense"
        >
          <template v-slot:prepend>
            <span>性别</span>
          </template>
        </q-select>
      </div>

      <div class="text-center q-mt-lg" v-if="isEditBirthday || isEditRealName || isEditGender">
        <q-btn class="common-large-btn full-width" color="brightbtn" @click="updateState" label="提交" />
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
      <router-link to="/login?redirect=/account">
        <q-btn label="确认" color="brightbtn" />
      </router-link>
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
import {defineComponent, reactive, ref, onActivated, computed} from "vue";
import moment from "moment";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {userStore} from "src/stores";
import {useRouter} from "vue-router";
import { useNotify } from "src/hooks/notify";

export default defineComponent({
  name: "PersonalView",
  setup() {
    // const isCardActive = ref();
    const notify = useNotify();
    const qs = require("qs");
    const $q = useQuasar();
    const searchForm = reactive({
      start: "",
      end: ""
    });

    const showDatePopup = ref(false)
    const profileFormRef = ref();

    const toggleShowPopup = () => {
      if(isEditBirthday.value=== true){
        showDatePopup.value = true
      }
    }

    const store = userStore();
    const router = useRouter();

    const options = [ { label: '男', value: 'Male' }, { label: '女', value: 'Female' } ]

    const isEditEmail = ref(false);
    const isEditPhone = ref(false);
    const isEditBirthday = ref(false);
    const isEditGender = ref(false);
    const loadInfo = () => {
      personalState.memberInfo = userStore();
      // console.log(personalState.memberInfo.realName);
      if (personalState.memberInfo.birthday > 0) {
        personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("YYYY-MM-DD");
      }
      formDetail.nickName = personalState.memberInfo.nickName;
      formDetail.realName = personalState.memberInfo.realName;
      formDetail.birthday = personalState.memberInfo.birthday;
      formDetail.email = personalState.memberInfo.email;
      formDetail.phone = personalState.memberInfo.phone;
      // formDetail.phone = personalState.memberInfo.phone;
      formDetail.phoneVerified = personalState.memberInfo.phoneVerified;
      formDetail.emailVerified = personalState.memberInfo.emailVerified;
      formDetail.gender = personalState.memberInfo.gender ? options.find((item) => item.value === personalState.memberInfo.gender) : null;

      isEditRealName.value= (formDetail.realName === '' || formDetail.realName === null) ? true : false;
      isEditEmail.value = (formDetail.emailVerified === false) ? true : false;
      isEditBirthday.value = (!personalState.memberInfo.birthday) ? true : false;
      isEditPhone.value = (formDetail.phoneVerified === false) ? true : false;
      isEditGender.value = !formDetail.gender
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
      // getCode();
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
      emailAddressRef.value.validate();
      verificationCodeRef.value.validate();
      if (emailAddressRef.value.hasError || verificationCodeRef.value.hasError) {
      } else {
        verificationDetails.memberInfo.code = updateSecurityVerified.verificationCode;
        api.post("/otp/verifyEmail", qs.stringify(verificationDetails.memberInfo)).then((res) => {
          if (res.code === 0) {
            notify({
              type: "success",
              message: "验证成功",
            });
            updateSecurityModalVisible.value = false;
            loadInfo();
          }
        }).catch((e) => {
          // notify({
          //   type: "error",
          //          //   message: e.message,
          //          // });
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
      // if (!personalState.memberInfo.birthday) {
      //   birthdayRef.value.validate();
      //   if (birthdayRef.value.hasError) {
      //     return;
      //   }
      // }
      if (!personalState.memberInfo.realName) {
        realNameRef.value.validate();
        if (realNameRef.value.hasError) {
          return;
        }
      }
      // console.log(updateInfo);
      if(formDetail.birthday) {
        updateInfo.birthday = moment(formDetail.birthday, "YYYY/MM/DD").format("YYYY-MM-DD");
      }
      if(formDetail.realName){
        updateInfo.realName = formDetail.realName;
      }
      if(formDetail.gender){
        updateInfo.gender = formDetail.gender.value;
      }

      api.post("/session/account", qs.stringify(updateInfo)).then((r) => {
        if (r.code === 0) {
          profileFormRef.value.reset();

          notify({
            type: "success",
            message: "更新成功",
          });

          store.getMemberInfo().then(() => {
            loadInfo();
          });
        } else {
          notify({
            type: "error",
            message: r.message,
          });
        }
      });
    };

    const isValidName = () => {
      const namePattern =
        /^[\u4e00-\u9fa5·]+$/;
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
            type = 'success'

          if (res.code === 0) {
            showCaptchaDialog.value = false
            showVerificationTokenInput.value = true
          } else
            type = 'error';

          if (message)
            notify({message, type});

          // console.log('onCaptchaSubmit', res)
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
      isEditGender,
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
      onCaptchaSubmit,
      showDatePopup,
      toggleShowPopup,
      options
    };
  }
});
</script>
<style lang="scss">
.personal-account {
  padding: 10px;

  q-input {
    .q-field__control {
      box-shadow: $shadow-bg;
      background: $white;
    }
  }

  .q-field__control {
    margin-bottom: 6px;
    padding-bottom: 20px;
    background: $white;
    box-shadow: $shadow-bg;
    border-radius: 10px;

    .q-field__marginal {
      font-size: 1.2rem;
      color: $font-1;
      margin-right: 6px;
    }
  }

  .q-select {
    .q-field__control {
      padding-bottom: 0px;
    }
  }

  .q-field__bottom {
    padding: 0px 8px 10px;
  }

  .web {
    color: $primary;
    text-align: center;
    font-size: 1.1rem;
    padding: 0 0 10px;
    font-weight: bold;
  }
}

.body--dark {
  .personal-account {
    background: url('../../assets/images/profile/personal-bg-dark.jpg') no-repeat center center;
    padding: 0;
    height: calc(100vh - 112px);
    .q-field__control, .q-field--standout.q-field--dark.q-field--readonly .q-field__control:before {
      box-shadow: none;
      border: none;
      background: none;
      border-radius: 0;
    }
    .q-field {
      border-bottom: 1px solid #b1bad31a;
    }
    .web {
      color: #a98f7c;
      padding: 10px;
    }
    .web, .profile-form {
      background: #060d1b5c;
    }
  }
}
</style>
