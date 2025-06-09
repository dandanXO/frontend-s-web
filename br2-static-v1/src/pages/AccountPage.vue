<template>
  <q-page>
    <!-- <ProfileSummary /> -->

    <div class="personal-center-container">
      <ProfileProgressBanner />

      <q-form ref="profileFormRef" class="pc-form">
        <div class="pc-form-item" @click="openPersonalCenterDialog">
          <div class="pc-form-label">{{ $t("form.firstName") }}</div>
          <div class="pc-form-input">
            <q-input
              v-model="formDetail.firstName"
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
          <div class="pc-form-label">{{ $t("form.lastName") }}</div>
          <div class="pc-form-input">
            <q-input
              v-model="formDetail.lastName"
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
          <div class="pc-form-label">{{ $t("form.phone") }}</div>
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
        <div class="pc-tip">
          <div>
            <a class="pc-tip-chg-pwd" @click="openChangePasswordDialog">{{ $t("form.changePassword") }}</a>
            <div class="pc-ver" v-if="appVersionNo">
              {{ $t("settings.version") }}:
              <span>{{ appVersionNo }}</span>
            </div>
          </div>

          <div>
            <q-btn
              class="btn-refresh"
              no-caps
              icon="refresh"
              label="Atualizado"
              :loading="loadingUpdated"
              @click="startRefresh"
            >
              <template v-slot:loading>
                <q-spinner class="on-left" style="color: #ae6def" />
                {{ $t("btn.updating") }}
              </template>
            </q-btn>
          </div>
        </div>

        <div class="q-mt-md">
          <q-btn rounded flat no-caps class="btn-purple-pattern" @click="openConfirmSignOutDialog">
            {{ $t("btn.signOut") }}
          </q-btn>
        </div>
      </q-form>
    </div>
  </q-page>
  <q-dialog width="100%" v-model="showCaptchaDialog">
    <q-card style="width: 100%; padding: 20px" class="bg-dark text-white text-center">
      <q-card-section class="q-mb-md">
        <strong>Tips</strong>
        <br />
        <br />
        Please login to proceed
      </q-card-section>
      <router-link to="/login?redirect=/account"><q-btn label="Confirm" color="brightbtn" /></router-link>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showCaptchaDialog" width="100%">
    <q-card width="100%">
      <q-card-section style="padding: 10px 20px" class="q-pa-md bg-dark text-white">OTP</q-card-section>
      <div style="padding: 20px">
        <q-card-section class="q-mb-md q-pa-md">
          <q-input v-model="captchaRef" label="OTP">
            <template v-slot:append>
              <img
                :src="verificationImg"
                title="Click to Refresh OTP"
                style="margin-top: 6px; cursor: pointer"
                @click="getCode"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-btn @click="onCaptchaSubmit" label="Send OTP" color="brightbtn" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="personalCenterDialog" presistent>
    <div class="popout-dialog">
      <q-btn
        dense
        rounded
        icon="close"
        class="bg-yellow text-black popout-close"
        @click="closePersonalCenterDialog()"
      />
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
                type="number"
                filled
                dense
                clearable
                placeholder="Enter Your Phone"
                v-model="formDetail.phone"
                :rules="[(_) => isValidPhone()]"
                :disable="startCountdownResendOTP"
              >
                <template v-slot:append>
                  <div class="pc-form-side-btn">
                    <q-btn
                      no-caps
                      dense
                      class="bg-yellow text-black"
                      :label="!startCountdownResendOTP && 'Get Code'"
                      :disable="!formDetail.phone || startCountdownResendOTP"
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
              >
                <template v-slot:append v-if="startCountdownResendOTP">{{ countdownOTP }}s</template>
              </q-input>
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
            :loading="btnLoading"
            rounded
            flat
            no-caps
            class="btn-purple-pattern"
            :disable="
              !(isValidName() === true && isValidPhone() === true && isValidOTP() === true && isValidEmail() === true)
            "
            @click="submitKYC"
          >
            {{ $t("btn.submit") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="changePasswordDialog" presistent>
    <div class="popout-dialog">
      <q-btn
        dense
        rounded
        icon="close"
        class="bg-yellow text-black popout-close"
        @click="openChangePasswordDialog()"
        v-close-popup
      />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("header.changePassword") }}</div>

        <div class="pc-form">
          <div class="pc-form-item">
            <div class="pc-form-label">{{ $t("form.currentPassword") }}</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                :placeholder="$t('form.currentPassword_placeholder')"
                v-model="updatePwdInfo.oldPassword"
                ref="oldPasswordRef"
                hide-bottom-space
                :type="isPwd ? 'password' : 'text'"
                :rules="[(val) => (val && val.length > 0) || $t('form.currentPassword_rules_01')]"
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
            <div class="pc-form-label">{{ $t("form.newPassword") }}</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                :placeholder="$t('form.newPassword_placeholder')"
                v-model="updatePwdInfo.password"
                ref="passwordRef"
                hide-bottom-space
                :type="isPwd ? 'password' : 'text'"
                :rules="[
                  (val) => (val && val.length > 0) || $t('form.newPassword_rules_01'),
                  (val) => (val.length >= 6 && val.length <= 11) || $t('form.newPassword_rules_02'),
                  () => isAlphanumeric(updatePwdInfo.password, t('form.newPassword'))
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
          <div class="pc-form-item">
            <div class="pc-form-label">{{ $t("form.confirmNewPassword") }}</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                :placeholder="$t('form.confirmNewPassword_placeholder')"
                v-model="updatePwdInfo.confirmNewPwd"
                ref="confirmPasswordRef"
                hide-bottom-space
                :type="isPwd ? 'password' : 'text'"
                :rules="[
                  (val) => (val && val.length > 0) || $t('form.confirmNewPassword_rules_01'),
                  (val) => val === updatePwdInfo.password || $t('form.confirmNewPassword_rules_03')
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
          <q-btn rounded flat no-caps class="btn-purple-pattern" @click="submitUpdatePwd">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="changeNewPasswordDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">Change New Password</div>
        <div class="pc-form">
          <div class="pc-form-item">
            <div class="pc-form-label">Login Name</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                v-model="newLoginName"
                disable
                hint="Please remember the login name"
              ></q-input>
              <div class="pc-form-side-btn copy-btn">
                <q-btn
                  no-caps
                  dense
                  class="bg-yellow text-black"
                  @click="copyLoginName"
                  :label="copyActive ? 'Copied' : 'Copy'"
                />
              </div>
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
                :rules="[
                  (val) => (val && val.length > 0) || 'Please insert new password',
                  (val) =>
                    (val.length >= 6 && val.length <= 11) || 'The characters of new password must be between 6 and 11',
                  () => isAlphanumeric(updatePwdInfo.password, 'New password')
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
          <div class="pc-form-item">
            <div class="pc-form-label">Confirm New Password</div>
            <div class="pc-form-input">
              <q-input
                filled
                dense
                clearable
                placeholder="Enter Confirm New Password"
                v-model="updatePwdInfo.confirmNewPwd"
                ref="confirmPasswordRef"
                hide-bottom-space
                :type="isPwd ? 'password' : 'text'"
                :rules="[
                  (val) => (val && val.length > 0) || 'Please insert confirm new password',
                  (val) => val === updatePwdInfo.password || 'Confirm password does not match with new password'
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
          <q-btn rounded flat no-caps class="btn-purple-pattern" @click="submitUpdateNewPwd">Confirm</q-btn>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="guestKYCDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" @click="closeGuestKYCDialog" />
      <KYCGuestForm @closeGuestKYCDialog="closeGuestKYCDialog" />
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="userKYCDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" @click="closeUserKYCDialog" />
      <KYCUserForm @closeUserKYCDialog="closeUserKYCDialog" />
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="verificationCodeDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" v-close-popup />
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
      <q-btn dense rounded icon="close" class="bg-grey-1 text-black popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">Sair</div>

        <div class="txt-content q-mt-md text-center">Tem certeza de que deseja sair?</div>

        <div class="q-mt-lg q-pl-lg q-pr-lg y-n-container">
          <q-btn label="Cancelar" no-caps class="btn-cancel" v-close-popup />
          <q-btn label="Confirmar" no-caps class="btn-confirm" @click="logout" />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import SwiperNav from "../components/SwiperNav.vue";
import ProfileSummary from "../components/ProfileSummary.vue";
import ProfileProgressBanner from "../components/ProfileProgressBanner.vue";
import { defineComponent, reactive, ref, onMounted, computed, onActivated } from "vue";
import moment from "moment";
import { api } from "boot/axios";
import { useQuasar, copyToClipboard } from "quasar";
import { userStore } from "src/stores";
import { useRouter } from "vue-router";
import { App } from "@capacitor/app";
import KYCGuestForm from "../components/KYCGuestForm.vue";
import KYCUserForm from "../components/KYCUserForm.vue";
import { t } from "src/boot/lang";

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
  loadingLogout.value = true;

  $q.loading.show({
    message: "Logging out..."
  });

  store.memberLogout().then(() => {
    loadingLogout.value = false;
    router.push("/home");
  });
};

const btnLoading = ref(false);

const loadingUpdated = ref(false);

const intervals = ref(null);

const startRefresh = async () => {
  loadingUpdated.value = true;
  loadInfo();

  store.getMemberInfo().then(() => {
    setTimeout(() => {
      loadingUpdated.value = false;
    }, 2000);
  });
};

const personalCenterDialog = ref(false);
const openPersonalCenterDialog = () => {
  if (store.guest && !personalState.memberInfo.realName) {
    // openNewChangePasswordDialog();
    openGuestKYCDialog();
  } else if (!store.guest && !personalState.memberInfo.realName) {
    openUserKYCDialog();
  } else {
    return false;
  }
  // } else if (!personalState.memberInfo.realName || !personalState.memberInfo.phone || !personalState.memberInfo.email) {
  //   personalCenterDialog.value = true;
  // }
};

const closePersonalCenterDialog = () => {
  // loadInfo();
  personalCenterDialog.value = false;
};

const changePasswordDialog = ref(false);
const openChangePasswordDialog = () => {
  resetChangePasswordInfo();
  changePasswordDialog.value = !changePasswordDialog.value;
};

const userKYCDialog = ref(false);
const openUserKYCDialog = () => {
  userKYCDialog.value = true;
};
const closeUserKYCDialog = () => {
  store.getMemberInfo().then(() => {
    loadInfo();
    userKYCDialog.value = false;
  });
};

const guestKYCDialog = ref(false);
const openGuestKYCDialog = () => {
  guestKYCDialog.value = true;
};
const closeGuestKYCDialog = () => {
  store.getMemberInfo().then(() => {
    loadInfo();
    guestKYCDialog.value = false;
  });

  // formDetail.realName = "";
  // formDetail.phone = "";
  // formDetail.password = "";
};

const changeNewPasswordDialog = ref(false);
const openNewChangePasswordDialog = () => {
  changeNewPasswordDialog.value = true;
  newLoginName.value = store.nickName;
};

const copyActive = ref(false);
const copyLoginName = () => {
  const el = document.createElement("textarea");
  el.value = newLoginName.value;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  copyActive.value = true;
  setTimeout(() => {
    copyActive.value = false;
  }, 2000);
};

const verificationCodeDialog = ref(false);
const openVerificationCodeDialog = () => {
  captchaRef.value = "";
  getCode();

  verificationCodeDialog.value = !verificationCodeDialog.value;
  getCode();
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

  if (store.guest && personalState.memberInfo.realName === null) {
    // openNewChangePasswordDialog();
    openGuestKYCDialog();
  }

  if (!store.guest && personalState.memberInfo.realName === null) {
    // openPersonalCenterDialog();
    openUserKYCDialog();
  }

  // console.log(personalState.memberInfo);
  if (personalState.memberInfo.birthday > 0) {
    personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("YYYY-MM-DD");
  }
  formDetail.nickName = personalState.memberInfo.nickName;
  formDetail.realName = personalState.memberInfo.realName;
  formDetail.firstName = personalState.memberInfo.realName
    ? personalState.memberInfo.realName.split(",")[0]?.trim()
    : "";
  formDetail.lastName = personalState.memberInfo.realName
    ? personalState.memberInfo.realName.split(",")[1]?.trim()
    : "";
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
    var current_version = info.version;
    appVersionNo.value = current_version;
  } else if (store.getDeviceType() == "IOS") {
    appVersionNo.value = "iOS v0.3";
  } else {
  }
};

const loadingLogout = ref(false);

onActivated(() => {
  loadInfo();
});

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
  updateInfo.realName = formDetail.realName;
  updateInfo.email = formDetail.email;
  updateInfo.phone = formDetail.phone;
  updateInfo.otpCode = formDetail.phoneOtpRef;
  updateInfo.otpCodeId = verificationCodeID;

  api
    .post("/session/verifyAndUpdateAccount", qs.stringify(updateInfo))
    .then((r) => {
      if (r.code === 0) {
        profileFormRef.value.reset();

        $q.notify({
          color: "positive",
          position: "top",
          message: t("notify.updatedSuccessfully"),
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
    })
    .catch(() => {})
    .then(() => {
      btnLoading.value = false;
    });
};

const updateNewUserState = () => {
  const updateInfo = {};
  updateInfo.realName = formDetail.realName;

  api
    .post("/session/account", qs.stringify(updateInfo))
    .then((r) => {
      if (r.code === 0) {
        profileFormRef.value.reset();

        $q.notify({
          color: "positive",
          position: "top",
          message: t("notify.updatedSuccessfully"),
          icon: "check_circle_outline"
        });

        store.getMemberInfo().then(() => {
          loadInfo();
          userKYCDialog.value = false;
        });
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: r.message,
          icon: "report_problem"
        });
      }
    })
    .catch(() => {})
    .then(() => {
      btnLoading.value = false;
    });
};

const submitKYC = () => {
  btnLoading.value = true;
  updateState();
};

const submitKYCNewUser = () => {
  btnLoading.value = true;
  updateNewUserState();
};

const isValidName = () => {
  const { realName } = formDetail;
  const namePattern = /^[A-Za-z]+[A-Za-z\s]*[A-Za-z]$/;

  const result = !realName
    ? t("form.fullName_rules_01")
    : !namePattern.test(realName)
    ? t("form.fullName_rules_02")
    : true;
  return result;
};

const isValidPhone = () => {
  const { phone } = formDetail;

  if (!phone) {
    return t("form.phone_rules_01");
  }

  const phoneRegex = /^\d{10}$/;
  const isValid = phoneRegex.test(phone);

  return isValid ? true : t("form.phone_rules_02");
};

const isValidOTP = () => {
  const { phoneOtpRef } = formDetail;

  const result = !phoneOtpRef ? t("form.verificationCode_rules_01") : true;
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

let verificationCodeID = "";
const startCountdownResendOTP = ref(false);
const countdownOTP = ref();

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
        verificationCodeID = res.data.codeId;

        startCountdownResendOTP.value = true;

        countdownOTP.value = 59;
        let timer = setInterval(() => {
          countdownOTP.value -= 1;
          if (countdownOTP.value === 0) {
            clearInterval(timer);
            startCountdownResendOTP.value = false;
          }
        }, 1000);
      } else color = "negative";

      if (message) $q.notify({ message, color });

      console.log("onCaptchaSubmit", res);
    });
};

const isPwd = ref(true);
const oldPasswordRef = ref();
const passwordRef = ref();
const confirmPasswordRef = ref();
const newLoginName = ref();
const updatePwdInfo = reactive({
  oldPassword: "",
  password: "",
  confirmNewPwd: ""
});

const isAlphanumeric = (value, translation) => {
  const passwordPattern = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]+$/i;
  return (
    passwordPattern.test(value) ||
    t("form.mustBeAlphaNumeric", {
      field: translation.toLowerCase()
    })
  );
};

const submitUpdatePwd = () => {
  oldPasswordRef.value.validate();
  passwordRef.value.validate();
  confirmPasswordRef.value.validate();

  if (oldPasswordRef.value.hasError || passwordRef.value.hasError || confirmPasswordRef.value.hasError) {
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
            message: t("notify.newPasswordUpdatedSuccessfully"),
            icon: "check_circle_outline"
          });
          // router.go("/account");
          resetChangePasswordInfo();
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

const submitUpdateNewPwd = () => {
  passwordRef.value.validate();
  confirmPasswordRef.value.validate();

  if (passwordRef.value.hasError || confirmPasswordRef.value.hasError) {
  } else {
    api
      .post(
        "/session/guest-password",
        qs.stringify({
          password: updatePwdInfo.password
        })
      )
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t("notify.newPasswordUpdatedSuccessfully"),
            icon: "check_circle_outline"
          });
          // router.go("/account");
          changeNewPasswordDialog.value = false;
          store.getMemberInfo();
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

const resetChangePasswordInfo = () => {
  updatePwdInfo.confirmNewPwd = "";
  updatePwdInfo.oldPassword = "";
  updatePwdInfo.password = "";
};

const confirmSignOutDialog = ref(false);
const openConfirmSignOutDialog = () => {
  confirmSignOutDialog.value = !confirmSignOutDialog.value;
};
</script>

<style lang="scss" scoped>
.personal-center-container {
  padding: 0 20px;
}

.progress-container {
  background: linear-gradient(180deg, #d29e3a 0%, #d65033 100%);
}

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

.bank-card-add {
  position: absolute;
  padding: 0 2rem;
  height: 37rem;
  overflow: auto;
  top: 15rem;
}

.pc-form {
  margin-top: 20px;
  width: 100%;
  .pc-form-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 25px;
  }
  .pc-form-label {
    color: rgba(255, 255, 255, 1);
  }
  .pc-form-input {
    border-radius: 5px;
    position: relative;

    :deep(.q-field__control) {
      background: rgba(255, 255, 255, 0.15) !important;
      border-radius: 4px;
    }

    :deep(.q-field__native) {
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .pc-form-side-btn {
    position: relative;
    right: -12px;

    :deep(.q-btn-item) {
      height: 38px;
    }

    &.copy-btn {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}

.btn-purple-pattern {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  line-height: 1;
  font-weight: 400;
  width: 100%;
  height: 55px;
  text-transform: uppercase;
  transition: 0.3s all;
  color: #ffffff;
  margin: auto;
  border-radius: 6px;
  border: 1px solid #5e388b;
  background: rgba(88, 23, 170, 0.6);

  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }
}

.pc-tip-chg-pwd {
  color: #a73dff;
}

.pc-tip {
  display: flex;
  justify-content: space-between;
  // flex-direction: column;
  // align-items: flex-end;
}
.pc-ver {
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8px;

  span {
    color: #fae576;
  }
}

.btn-refresh {
  background: #48325a;
  border-radius: 8px;
  font-weight: 400;
  margin-top: auto;
  color: #ae6def;
  padding: 10px 20px;

  :deep(.q-icon) {
    color: #ae6def;
  }
}

.btn-cancel {
  background: #ffffff20;
  font-weight: 700;
  color: #dcdcdc;
  border: 1px solid #ffffff80;
  border-radius: 8px;
  width: 140px;
  height: 42px;
}
.btn-confirm {
  background: linear-gradient(180deg, #00B9A1 0%, #0097B9 100%);
  font-weight: 700;
  width: 140px;
  height: 42px;
  color: #ffffff;
  border-radius: 8px;
}
</style>
