<template>
  <div class="personal-account">
    <div class="web">专属网址: {{ personalState.memberInfo.evip }}</div>
    <q-form>
      <q-input
        standout
        bg-color="white"
        class="q-pb-xs"
        hide-bottom-space
        v-model="formDetail.nickName"
        label="账号"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '请输入账号']"
        label-color=""
        :readonly="personalState.memberInfo.nickName ? true : false"
      />
      <q-input
        standout
        ref="realNameRef"
        bg-color="white"
        class="q-pb-xs"
        hide-bottom-space
        v-model="formDetail.realName"
        label="姓名"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '请输入姓名']"
        label-color=""
        :readonly="personalState.memberInfo.realName ? true : false"
      />
      <q-input
        ref="birthdayRef"
        standout
        bg-color="white"
        label="生日"
        label-color=""
        lazy-rules
        class="q-pb-xs"
        hide-bottom-space
        v-model="formDetail.birthday"
        mask="date"
        :rules="[(val) => (val && val.length > 0) || '请输入生日']"
      >
        <template v-slot:append>
          <q-icon name="event" color="dark" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="formDetail.birthday" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat/>
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
      <q-input
        standout
        bg-color="white"
        class="q-pb-xs"
        hide-bottom-space
        v-model="formDetail.email"
        label="邮箱"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '请输入邮箱']"
        label-color=""
        color=""
        :readonly="personalState.memberInfo.email ? true : false"
      />
      <q-input
        standout
        bg-color="white"
        class="q-pb-xs"
        hide-bottom-space
        v-model="formDetail.phone"
        label="电话"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '请输入电话']"
        label-color=""
        color=""
        :readonly="personalState.memberInfo.phone ? true : false"
      >
        <template v-slot:append>
          <q-btn size="sm" color="dyblue" label="验证"/>
        </template>
      </q-input>
      <div class="text-center q-mt-md" v-if="canEdit">
        <q-btn size="md" color="dyblue" @click="updateState" label="更新信息"/>
      </div>
    </q-form>
  </div>
</template>

<script lang="js">
import {defineComponent, reactive, ref, onMounted, computed} from "vue";
import moment from "moment";
import {api} from "boot/axios"
import {useQuasar} from "quasar"
import {userStore} from "src/stores"


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

    const store= userStore();

    const loadInfo = () => {
      personalState.memberInfo = userStore()
      if (personalState.memberInfo.birthday > 0) {
        personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("YYYY-MM-DD");
      }
      formDetail.nickName = personalState.memberInfo.nickName
      formDetail.realName = personalState.memberInfo.realName
      formDetail.birthday = personalState.memberInfo.birthday
      formDetail.email = personalState.memberInfo.email
      formDetail.phone = personalState.memberInfo.phone
    }

    const canEdit = computed(() => {
      if (personalState.memberInfo && (!personalState.memberInfo.realName || !personalState.memberInfo.birthday)){
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

    onMounted(() => {
      loadInfo()
      getCode()
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

    const isEmailSending = ref(false)
    const updateSecurityModalVisible = ref(false);
    const updateSecurityFormRef = ref();
    const updateSecurityVerified = reactive({
      mobileNumber: "",
      verificationCode: ""
    });
    const verificationModalVisible = ref(false)
    const updateSecurityModal = () => {
      updateSecurityVerified.emailAddress = "";
      updateSecurityVerified.verificationCode = "";
      updateSecurityModalVisible.value = true;
    };
    const openVerificationModal = () => {
      getCode();
      verificationModalVisible.value = true;
    }
    const verifyVerificationCode = () => {
      isEmailSending.value = true
      verificationDetails.memberInfo.email = updateSecurityVerified.emailAddress
      const emailDetails = {
        email: updateSecurityVerified.emailAddress,
        captchaCode: updateSecurityVerified.captchaCode,
        codeId: updateSecurityVerified.codeId
      }
      api.post("/otp/sendEmail", qs.stringify(emailDetails)).then((ret) => {
        if (ret.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "An OTP code has been sent to your email.",
            icon: "check_circle_outline"
          });
          verificationDetails.memberInfo.codeId = ret.data.codeId
          verificationModalVisible.value = false;
          isEmailSending.value = false
        } else {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: ret.message,
          //   icon: "report_problem"
          // });
          isEmailSending.value = false
          getCode()
        }
      })
        .catch((e) => {
          getCode()
          isEmailSending.value = false
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: e.message,
          //   icon: "report_problem"
          // });
        });
    }
    const emailAddressRef = ref()
    const verificationCodeRef = ref()
    const submitUpdateSecurity = () => {
      emailAddressRef.value.validate()
      verificationCodeRef.value.validate()
      if (emailAddressRef.value.hasError || verificationCodeRef.value.hasError) {
      } else {
        verificationDetails.memberInfo.code = updateSecurityVerified.verificationCode
        api.post("/otp/verifyEmail", qs.stringify(verificationDetails.memberInfo)).then((res) => {
          if (res.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: "Successfully verified",
              icon: "check_circle_outline"
            });
            updateSecurityModalVisible.value = false
            loadInfo()
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
    }

    const isEditRealName = ref(false)
    const isEditEmail = ref(false)
    const isEditPhone = ref(false)
    const isEditBirthday = ref(false)
    const isEdit = ref(false)
    const emailRef = ref()
    const realNameRef = ref()
    const birthdayRef = ref()
    const phoneRef = ref()
    const formDetail = reactive([])
    const updateState = () => {
      const updateInfo = formDetail;
      if (!personalState.memberInfo.birthday) {
        birthdayRef.value.validate()
        if (birthdayRef.value.hasError) {
          return
        }
      }
      if (!personalState.memberInfo.realName) {
        realNameRef.value.validate()
        if (realNameRef.value.hasError) {
          return
        }
      }
      console.log(updateInfo);
      updateInfo.birthday = moment(updateInfo.birthday, "YYYY/MM/DD").format("YYYY-MM-DD");
      api.post("/session/account", qs.stringify(updateInfo)).then((r) => {
        if (r.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "更新成功",
            icon: "check_circle_outline"
          });
          loadInfo();
          store.getMemberInfo();
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: r.message,
            icon: "report_problem"
          });
        }
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
      phoneRef,
      moment,
      canEdit
    };
  }
});
</script>
<style lang="scss">
.personal-account {
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
}
</style>
