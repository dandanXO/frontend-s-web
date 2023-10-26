<template>
  <ProfileSummary />

  <SwiperNav :slideList="slideList" :onSlideClick="onSlideClick" :isActiveSlide="isActiveSlide"></SwiperNav>

  <ContentView contentTopStatus="faded">
    <q-form ref="profileFormRef" class="pc-form">
      <div class="pc-form-item" @click="openPersonalCenterDialog">
        <div class="pc-form-label">Full Name</div>
        <div class="pc-form-input">
          <q-input
            v-model="formDetail.realName"
            filled
            dense
            clearable
            borderless
            standout
            hide-bottom-space
            readonly
          ></q-input>
        </div>
      </div>

      <div class="pc-form-item" @click="openPersonalCenterDialog">
        <div class="pc-form-label">Phone</div>
        <div class="pc-form-input">
          <q-input
            v-model="formDetail.phone"
            filled
            dense
            clearable
            borderless
            standout
            hide-bottom-space
            readonly
          ></q-input>
        </div>
      </div>

      <div class="pc-form-item" @click="openPersonalCenterDialog">
        <div class="pc-form-label">Email</div>
        <div class="pc-form-input">
          <q-input
            v-model="formDetail.email"
            filled
            dense
            clearable
            borderless
            standout
            hide-bottom-space
            readonly
          ></q-input>
        </div>
      </div>

      <div class="pc-tip">
        <a class="pc-tip-chg-pwd" @click="openChangePasswordDialog">Change Password</a>
        <div class="pc-ver" v-if="appVersionNo">
          Version:
          <span>{{ appVersionNo }}</span>
        </div>
        <div>
          <q-btn
            class="btn-refresh"
            no-caps
            text-color="white"
            icon="refresh"
            label="Updated"
            :loading="progress.loading"
            :percentage="progress.percentage"
            @click="startRefresh"
          >
            <template v-slot:loading>
              <q-spinner class="on-left" style="color: #fed87d" />
              Updating...
            </template>
          </q-btn>
        </div>
      </div>

      <div class="q-mt-md q-pl-lg q-pr-lg">
        <q-btn rounded flat no-caps class="btn-purple-pattern" @click="openConfirmSignOutDialog">Sign Out</q-btn>
      </div>

      <!-- <div class="text-center q-mt-md" v-if="canEdit">
        <q-btn size="md" color="brightbtn" @click="updateState" label="保存信息" />
      </div> -->
    </q-form>
  </ContentView>

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

  <q-dialog width="100%" v-model="personalCenterDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">KYC Info</div>

        <div class="pc-form">
          <div class="pc-form-item">
            <div class="pc-form-label">Full Name</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                placeholder="Enter Your Full Name"
                v-model="formDetail.realName"
                :rules="[(_) => isValidName()]"
              />
            </div>
          </div>
          <div class="pc-form-item">
            <div class="pc-form-label">Phone</div>
            <div class="pc-form-input">
              <q-input
                class="phone-input"
                type="number"
                filled
                dense
                clearable
                placeholder="Enter Your Phone"
                v-model="formDetail.phone"
                :rules="[(_) => isValidPhone()]"
              >
                <template v-slot:append>
                  <div class="pc-form-side-btn">
                    <q-btn
                      no-caps
                      dense
                      class="bg-yellow text-black"
                      label="Get Code"
                      :disable="!formDetail.phone"
                      @click="openVerificationCodeDialog"
                    />
                  </div>
                </template>
              </q-input>
            </div>
          </div>
          <div v-if="showVerificationTokenInput" class="pc-form-item">
            <div class="pc-form-label">Verification Code</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                placeholder="Enter Verification Code"
                v-model="formDetail.phoneOtpRef"
                :rules="[(_) => isValidOTP()]"
              />
            </div>
          </div>
          <div class="pc-form-item">
            <div class="pc-form-label">Verification Code</div>
            <div class="pc-form-input">
              <q-input filled dense clearable placeholder="Enter Verification Code" v-model="formDetail.phoneOtpRef" />
            </div>
          </div>

          <div class="pc-form-item">
            <div class="pc-form-label">Email</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                placeholder="Enter Your Email"
                v-model="formDetail.email"
                :rules="[(_) => isValidEmail()]"
              ></q-input>
            </div>
          </div>
        </div>

        <div class="q-mt-md q-pl-lg q-pr-lg">
          <q-btn
            rounded
            flat
            no-caps
            class="btn-purple-pattern"
            :disable="
              !(isValidName() === true && isValidPhone() === true && isValidOTP() === true && isValidEmail() === true)
            "
            @click="updateState"
          >
            Submit
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="changePasswordDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">Change Password</div>

        <div class="pc-form">
          <div class="pc-form-item">
            <div class="pc-form-label">Password</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                placeholder="Enter Current Password"
                v-model="updatePwdInfo.oldPassword"
                ref="oldPasswordRef"
                hide-bottom-space
                :type="isPwd ? 'password' : 'text'"
                :rules="[(val) => (val && val.length > 0) || 'Please insert old password']"
              >
                <template v-slot:append>
                  <q-icon
                    color="yellow-7"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
          </div>
          <div class="pc-form-item">
            <div class="pc-form-label">New Password</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                placeholder="Enter New Password"
                v-model="updatePwdInfo.password"
                ref="passwordRef"
                hide-bottom-space
                :type="isPwd ? 'password' : 'text'"
                :rules="[(val) => (val && val.length > 0) || 'Please insert new password']"
              >
                <template v-slot:append>
                  <q-icon
                    color="yellow-7"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
          </div>
          <div class="pc-form-item">
            <div class="pc-form-label">New Password Again</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                placeholder="Enter New Password Again"
                v-model="updatePwdInfo.confirmNewPwd"
                ref="confirmPasswordRef"
                hide-bottom-space
                :type="isPwd ? 'password' : 'text'"
                :rules="[
                  (val) => (val && val.length > 0) || 'Please insert new password again',
                  (val) => val === updatePwdInfo.password || 'Confimed password does not match with new password'
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    color="yellow-7"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <div class="q-mt-md q-pl-lg q-pr-lg">
          <q-btn rounded flat no-caps class="btn-purple-pattern" @click="submitUpdatePwd">Confirm</q-btn>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="verificationCodeDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">Captcha Code Check</div>

        <div class="pc-form">
          <div class="pc-form-item">
            <div class="pc-form-label">Captcha Code</div>
            <div class="pc-form-input">
              <q-input
                filled
                hide-bottom-space
                dense
                clearable
                placeholder="Enter Captcha Code"
                v-model="captchaRef"
                :rules="[
                  (val) => (val && val.length > 0) || 'Please insert captcha code',
                  (val) => (val && val.length > 3 && val.length < 5) || 'Captcha code length is 4 characters'
                ]"
              >
                <template v-slot:append>
                  <img :src="verificationImg" @click="getCode" />
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <div class="q-mt-md q-pl-lg q-pr-lg">
          <q-btn rounded flat no-caps class="btn-purple-pattern" v-close-popup @click="onCaptchaSubmit">Confirm</q-btn>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="confirmSignOutDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">Sign Out</div>

        <div class="txt-content q-mt-md text-center">Are you sure you want to sign out?</div>

        <div class="q-mt-lg q-pl-lg q-pr-lg y-n-container">
          <q-btn label="Cancel" no-caps class="btn-cancel" v-close-popup />
          <q-btn label="Confirm" no-caps class="btn-confirm" @click="logout" />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import SwiperNav from "../components/SwiperNav.vue";
import ContentView from "../components/ContentView.vue";
import ProfileSummary from "../components/ProfileSummary.vue";
import { defineComponent, reactive, ref, onMounted, computed } from "vue";
import moment from "moment";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "src/stores";
import { useRouter } from "vue-router";

let slideList = ref(["Personal Center", "Discount", "Record", "Order", "Bank", "Message"]);
let slideListPath = ref([
  "/account",
  "/account/discount",
  "/account/record",
  "/account/order",
  "/account/bank",
  "/account/message"
]);
let currentSlide = ref(slideList.value[0]);

const isActiveSlide = (e) => {
  if (e === currentSlide.value) return true;
  return false;
};

const logout = () => {
  store.memberLogout().then(() => {
    router.push("/");
  });
};

const progress = ref([{ loading: false, percentage: 0 }]);

const intervals = ref(null);

const startRefresh = () => {
  progress.value.loading = true;
  progress.value.percentage = 0;

  intervals.value = setInterval(() => {
    progress.value.percentage += 50;
    if (progress.value.percentage >= 100) {
      clearInterval(intervals);
      intervals.value = null;
      progress.value.loading = false;
    }
  }, 700);

  store.getMemberInfo();
};

const personalCenterDialog = ref(false);
const openPersonalCenterDialog = () => {
  (!personalState.memberInfo.realName || !personalState.memberInfo.phone || !personalState.memberInfo.email) &&
    (personalCenterDialog.value = true);
};

const changePasswordDialog = ref(false);
const openChangePasswordDialog = () => {
  changePasswordDialog.value = !changePasswordDialog.value;
};

const verificationCodeDialog = ref(false);
const openVerificationCodeDialog = () => {
  verificationCodeDialog.value = !verificationCodeDialog.value;
  getCode();
};

const confirmSignOutDialog = ref(false);
const openConfirmSignOutDialog = () => {
  confirmSignOutDialog.value = !confirmSignOutDialog.value;
};

const onSlideClick = (e, i) => {
  if (e === currentSlide.value) return;
  router.push(slideListPath.value[i]);
  currentSlide.value = e;
};

const myMemberList = ref([]);

let isNoInfoRef = ref(true);
if (myMemberList.value.length) isNoInfoRef.value = true;

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
  personalState.memberInfo.realName === null && openPersonalCenterDialog();
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

  isEditEmail.value = formDetail.emailVerified === false ? true : false;
  isEditBirthday.value = formDetail.birthday == "" ? true : false;
  isEditPhone.value = formDetail.phoneVerified === false ? true : false;
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

const appVersionNo = ref(null);
const getVersionNo = async () => {
  if (store.getDeviceType() == "ANDROID") {
    const info = await App.getInfo();
    var current_version = info.version + "." + info.build;
    appVersionNo.value = current_version;
  } else if (store.getDeviceType() == "IOS") {
    appVersionNo.value = "iOS v0.3";
  } else {
  }
};

onMounted(() => {
  loadInfo();
  getCode();
  getVersionNo();

  window.location.search.includes("personal") && openPersonalCenterDialog();
});

const verificationImg = ref("");
const getCode = () => {
  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        verificationImg.value = "data:image/png;base64," + response.data.img;
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
  api
    .post("/otp/sendEmail", qs.stringify(emailDetails))
    .then((ret) => {
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
    api
      .post("/otp/verifyEmail", qs.stringify(verificationDetails.memberInfo))
      .then((res) => {
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
      })
      .catch((e) => {
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
const phoneOtpRef = ref();

const captchaRef = ref();
const showCaptchaDialog = ref(false);
const showVerificationTokenInput = ref(false);

const updateState = () => {
  const updateInfo = {};
  console.log(updateInfo);

  updateInfo.realName = formDetail.realName;
  updateInfo.phone = formDetail.phone;
  updateInfo.phoneOtpRef = formDetail.phoneOtpRef;
  updateInfo.email = formDetail.email;

  api.post("/session/account", qs.stringify(updateInfo)).then((r) => {
    if (r.code === 0) {
      profileFormRef.value.reset();

      $q.notify({
        color: "positive",
        position: "top",
        message: "Updated successfully",
        icon: "check_circle_outline"
      });

      store.getMemberInfo().then(() => {
        loadInfo();
        personalCenterDialog.value = false;
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
  const { realName } = formDetail;
  const namePattern = /^[a-zA-Z]+$/;

  const result = !realName
    ? "Please Enter Your Full Name"
    : !namePattern.test(realName)
    ? "Please Enter A Valid Full Name"
    : true;
  return result;
};

const isValidPhone = () => {
  const { phone } = formDetail;

  const result = "" === phone ? "Please Enter Phone Number" : true;
  return result;
};

const isValidOTP = () => {
  const { phoneOtpRef } = formDetail;

  const result = !phoneOtpRef ? "Please Enter Verification Code" : true;
  return result;
};

const isValidEmail = () => {
  const { email } = formDetail;
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;

  const result = !email
    ? "Please Enter Your Email Address"
    : !emailPattern.test(email)
    ? "Please Enter A Valid Email Address"
    : true;
  return result;
};

const openVerificationDialog = () => {
  getCode();

  showCaptchaDialog.value = true;
};

const goToPage = (page) => {
  router.push(page);
};

const onCaptchaSubmit = () => {
  api
    .post(
      `/otp/sendSms`,
      qs.stringify({
        telephone: formDetail.phone,
        captchaCode: captchaRef.value,
        codeId: updateSecurityVerified.codeId
      })
    )
    .then((res) => {
      let message = res.message,
        color = "positive";

      if (res.code === 0) {
        showCaptchaDialog.value = false;
        showVerificationTokenInput.value = true;
      } else color = "negative";

      if (message) $q.notify({ message, color });

      console.log("onCaptchaSubmit", res);
    });
};

const isPwd = ref(true);
const oldPasswordRef = ref();
const passwordRef = ref();
const confirmPasswordRef = ref();
const updatePwdInfo = reactive({
  oldPassword: "",
  password: "",
  confirmNewPwd: ""
});
const submitUpdatePwd = () => {
  oldPasswordRef.value.validate();
  passwordRef.value.validate();
  confirmPasswordRef.value.validate();

  if (oldPasswordRef.value.hasError || passwordRef.value.hasError) {
  } else {
    api
      .post(
        "/session/password",
        qs.stringify({
          oldPassword: updatePwdInfo.oldPassword,
          password: updatePwdInfo.password
        })
      )
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "New password updated successfully",
            icon: "check_circle_outline"
          });
          // router.go("/account");
          changePasswordDialog.value = false;
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: response.message,
            icon: "report_problem"
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};
</script>

<style lang="scss" scoped>
.infoboard-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .infoboard-wrapper {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    width: 22rem;
    margin: 0;

    .left-container {
      width: 100%;

      .infoboard {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        margin: 1rem 0;

        font-family: Helvetica;
        font-size: 1rem;
        font-style: normal;
        font-weight: 700;
        text-transform: capitalize;
      }
    }

    .right-container {
      img {
        width: 1.75rem;
      }
    }
  }

  img {
    width: 30rem;
  }
}

.profile-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 20px;
  padding-bottom: 20px;

  .profile-details-container {
    display: flex;
    flex-direction: column;
    font-size: 18px;
  }
  .profile-name {
    display: flex;
    align-items: center;
    line-height: 1;
    gap: 10px;

    .vip-details {
      position: relative;
      margin-left: 25px;
      margin-bottom: 10px;
      img {
        display: block;
        width: 40px;
        position: absolute;
        top: -6px;
        left: -26px;
      }

      .vip-level {
        background: linear-gradient(93.61deg, #ffd84d 11.24%, #d97d00 91.82%),
          linear-gradient(217.27deg, rgba(255, 255, 255, 0.55) -9.02%, rgba(255, 255, 255, 0) 53.03%);
        border-radius: 0px 2px 5px 0px;
        width: 45px;
        height: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        line-height: 1;
        padding-bottom: 1px;
      }
    }
  }
  .profile-agency {
    display: flex;
    gap: 0.75rem;

    .profile-agency-lbl {
      color: rgba(255, 255, 255, 0.5);
    }
  }
  .profile-rating {
    display: flex;
    gap: 6px;
    img {
      display: block;
      width: 20px;
    }
  }
  .profile-balance {
    position: relative;
    background: rgba(255, 255, 255, 0.24);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    padding-top: 3px;
    padding-bottom: 3px;
    width: 130px;
    font-size: 14px;

    &:before {
      content: "";
      position: absolute;
      top: -9px;
      left: -3px;
      background-image: url(../assets/images/index/icon-balance.png);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 40px 40px;
      display: block;
      width: 40px;
      height: 40px;
    }

    .balance-amount {
      margin-left: 15px;
    }
  }
  .profile-msg {
    margin-left: auto;
    margin-top: 30px;
  }
}

.bank-card-add {
  position: absolute;
  padding: 0 2rem;
  height: 37rem;
  overflow: auto;
  top: 15rem;
}

.pc-form {
  margin-top: 20px;
  .pc-form-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 12px;
  }
  .pc-form-label {
    color: rgba(255, 255, 255, 0.5);
  }
  .pc-form-input {
    border-radius: 5px;
    position: relative;

    :deep(.q-field__control) {
      background-color: rgba(21, 0, 37, 0.7) !important;
    }

    :deep(.q-field__native) {
      color: #ffffff;
    }
  }

  .pc-form-side-btn {
    position: relative;
    right: -12px;

    :deep(.q-btn-item) {
      height: 38px;
    }
  }
}

.btn-purple-pattern {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  line-height: 1;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  font-weight: 700;
  width: 100%;
  height: 48px;
  transition: 0.3s all;
  background-image: url(../assets/images/account/btn-purple-pattern.png);
  color: #ffffff;
  margin: auto;
}

.pc-tip-chg-pwd {
  color: #fae576;
}

.pc-tip {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.pc-ver {
  color: rgba(255, 255, 255, 0.5);

  span {
    color: #fae576;
  }
}

.btn-refresh {
  background: rgba(21, 0, 37, 0.7);
  border-radius: 8px;
  font-weight: 700;

  :deep(.q-icon) {
    color: #fed87d;
  }
}

.popout-dialog {
  width: 90%;

  max-width: 500px;
  position: relative;
  padding-top: 90px;
  padding-right: 10px;

  .popout-close {
    position: absolute;
    right: 0px;
    top: 80px;
  }

  .txt-title {
    font-size: 28px;
    text-align: center;
    font-weight: 700;
  }

  .popout-dialog-container {
    background-image: url(../assets/images/account/kyc-bg.png);
    background-position: top center;
    background-size: cover;
    background-repeat: no-repeat;
    padding: 30px 20px 20px;
    border-radius: 30px !important;
  }
}

.y-n-container {
  display: flex;
  gap: 24px;
  justify-content: center;
}
.btn-cancel {
  background: rgba(21, 0, 37, 0.5);
  font-weight: 700;
  color: #ffffff;
  border-radius: 8px;
}
.btn-confirm {
  background: linear-gradient(180deg, #ffcd5c 0%, #fea800 100%);
  font-weight: 700;
  color: #150025;
  border-radius: 8px;
}
</style>
