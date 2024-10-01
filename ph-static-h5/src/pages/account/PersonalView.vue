<template>
  <ProfileSummary/>
  <div class="personal-wrapper">
    <div class="personal-information-container">
      <q-form style="display:none">
        <div class="name-email">
          <div class="top-right flex">
            <RiEditLine
              style="width: 20px; fill: #ffffff"
              v-if="
                !isEdit &&
                (!personalState.memberInfo.realName ||
                  !personalState.memberInfo.email ||
                  !personalState.memberInfo.birthday ||
                  !personalState.memberInfo.telephone)
              "
              @click="isEdit = !isEdit"
            />
            <RiCloseLine
              style="width: 20px; fill: #ffffff"
              v-else
              @click="isEdit = !isEdit"
            />
            <RiCheckLine v-if="isEdit"
              @click="updateState"
            />
          </div>
          <div
            v-if="personalState.memberInfo.profilePicture"
            class="info-picture"
          >
            <img :src="personalState.memberInfo.profilePicture"/>
          </div>
          <div class="info-name">
            <span v-if="!personalState.memberInfo.displayName">{{
                personalState.memberInfo.nickName
              }}</span
            ><span v-if="personalState.memberInfo.displayName"
          >{{ personalState.memberInfo.displayName }} ({{
              personalState.memberInfo.nickName
            }})</span
          >
          </div>
          <div class="info-email" v-if="personalState.memberInfo.email">
            {{ personalState.memberInfo.email }}
            <q-icon
              size="xs"
              color="white"
              name="mark_email_read"
              v-if="personalState.memberInfo.emailVerified"
            />
          </div>
          <div v-if="isEdit && !personalState.memberInfo.email">
            <q-input
              class="whiteError"
              ref="emailRef"
              filled
              color="white"
              v-model="formDetail.email"
              placeholder="Email"
              :rules="[(val) => (val && val.length > 0) || 'Email is required']"
            >
              <!-- <template v-slot:append>
              <q-avatar>
                <RiSendPlane2Line @click="updateState('email')" />
              </q-avatar>
            </template> -->
            </q-input>
          </div>
        </div>
      </q-form>
      <q-form class="rounded-borders q-mx-md flex column q-gutter-y-sm personal-info-page-form">
        <div style="display:flex;justify-content:flex-end;gap:15px;">
          <q-icon name="edit" v-if="!isEdit &&
            (!personalState.memberInfo.realName ||
            !personalState.memberInfo.email ||
            !personalState.memberInfo.birthday ||
            !personalState.memberInfo.telephone)"
            @click="isEdit = !isEdit"
            size="md"
          />
          <q-icon name="check_circle" v-if="isEdit" size="lg" color="green"
          @click="updateState"
          />
          <q-icon name="cancel" v-if="isEdit" size="lg" color="red"
            @click="isEdit = !isEdit"
          />
        </div>

        <label class="field-label">Name</label>
        <q-input
          v-if="isEdit && !personalState.memberInfo.realName"
          ref="realNameRef"
          rounded
          outlined
          v-model="formDetail.realName"
          placeholder="Real Name"
          :rules="[
            (val) =>
              (val && val.length > 0) || 'Please enter real name',
            isValidName,
          ]"
        />
        <q-input
          v-if="personalState.memberInfo.realName"
          disable
          rounded
          outlined
          v-model="personalState.memberInfo.realName"
          color="white"
        />

        <label class="field-label">Birthday</label>
        <q-input
          v-if="isEdit && !personalState.memberInfo.birthday"
          ref="birthdayRef"
          rounded
          outlined
          v-model="formDetail.birthday"
          placeholder="Birthday"
          :rules="[
            (val) =>
              (val && val.length > 0) || 'Please enter your birthday',
          ]"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formDetail.birthday" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn
                      v-close-popup
                      label="Close"
                      color="primary"
                      flat
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          v-else
          disable
          rounded
          outlined
          v-model="formattedBirthday"
          color="white"
        />

        <label class="field-label">Phone</label>
        <q-input
          v-if="isEdit && !personalState.memberInfo.telephone"
          ref="phoneRef"
          color="white"
          rounded
          outlined
          v-model="formDetail.phone"
          placeholder="Mobile Number"
          :rules="[
            (val) =>
              (val && val.length > 0) || 'Please enter mobile number',
            isValidPhone,
          ]"
        />
        <q-input
          v-if="personalState.memberInfo.telephone"
          disable
          rounded
          outlined
          v-model="personalState.memberInfo.telephone"
          color="white"
        />

        <div class="account-tip">
          <span style="color: #83A3CA;font-size:16px">If you need to modify your personal information, please contact our </span>
          <router-link to="/liveChat" style="color:#4EB5FF;font-size:16px">online customer service</router-link>
        </div>
        <div class="verifi-text-box" style="color: #FF8D4E;font-size:16px">
          <template v-if="verificationStatus && (verificationStatus=='NOT_EXIST' || verificationStatus=='FAILED')">
            <span>You are required to submit/re-submit your photo for verification.</span>
          </template>
          <template v-else-if="verificationStatus && (verificationStatus=='PENDING')">
            <span>Photo Verification Status: PENDING.</span>
          </template>
          <template v-else-if="verificationStatus && (verificationStatus=='SUCCESS')">
            <span>Photo Verification Success.</span>
          </template>
        </div>

        <div class="q-gutter-y-md q-my-md">
          <q-btn
            class="submit-btn"
            label="Change Password"
            @click="updatePwdModal"
          />

          <q-btn
            v-if="verificationStatus !== 'SUCCESS' "
            class="submit-btn outlined"
            label="Security Verification"
            @click="goToSecurityVerficationPage"
          />
        </div>
      </q-form>
      <div class="other-info" style="display:none">
        <div class="account-content basic-info">
          <div class="basic-info-table" >
            <div class="tbl-row">
              <div class="basic-info-cell title">
                <RiFileUserLine/>
                Name
              </div>
              <div
                class="basic-info-cell content"
                v-if="personalState.memberInfo.realName"
              >
                {{ personalState.memberInfo.realName }}
              </div>
              <div v-if="isEdit && !personalState.memberInfo.realName">
                <q-input
                  ref="realNameRef"
                  color="white"
                  filled
                  v-model="formDetail.realName"
                  placeholder="Real Name"
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Please enter real name',
                    isValidName,
                  ]"
                >
                  <!-- <template v-slot:append>
                    <q-avatar>
                      <RiSendPlane2Line @click="updateState('realName')" />
                    </q-avatar>
                  </template> -->
                </q-input>
              </div>
            </div>

            <div class="tbl-row">
              <div class="basic-info-cell title">
                <RiCake2Line/>
                Birthday
              </div>
              <div
                class="basic-info-cell content"
                v-if="personalState.memberInfo.birthday"
              >
                {{
                  moment(personalState.memberInfo.birthday).format("DD-MM-YYYY")
                }}
              </div>
              <div v-if="isEdit && !personalState.memberInfo.birthday">
                <q-input
                  ref="birthdayRef"
                  filled
                  v-model="formDetail.birthday"
                  placeholder="Birthday"
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Please enter your birthday',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="formDetail.birthday" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <!-- <template v-slot:after>
                    <q-avatar>
                      <RiSendPlane2Line @click="updateState('birthday')" />
                    </q-avatar>
                  </template> -->
                </q-input>
                <!-- <q-input color="white" filled v-model="formDetail.birthday" placeholder="วันเกิด">
                </q-input> -->
              </div>
            </div>
            <div class="tbl-row">
              <div class="basic-info-cell title">
                <RiSmartphoneLine/>
                Phone
              </div>
              <div
                class="basic-info-cell content"
                v-if="personalState.memberInfo.telephone"
              >
                {{ personalState.memberInfo.telephone }}
              </div>
              <div v-if="isEdit && !personalState.memberInfo.telephone">
                <q-input
                  ref="phoneRef"
                  color="white"
                  filled
                  v-model="formDetail.phone"
                  placeholder="Mobile Number"
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Please enter mobile number',
                    isValidPhone,
                  ]"
                >
                  <!-- <template v-slot:append>
                    <q-avatar>
                      <RiSendPlane2Line @click="updateState('phone')" />
                    </q-avatar>
                  </template> -->
                </q-input>
              </div>
            </div>
          </div>
        </div>
        <div class="account-tip danger">
          If you need to modify your personal information, please contact our
          <router-link to="/liveChat">online service</router-link>
        </div>
        <div class="verifi-text-box">
          <template v-if="verificationStatus && (verificationStatus=='NOT_EXIST' || verificationStatus=='FAILED')">
            <span class="text-red">You are required to submit/re-submit your photo for verification.</span>
          </template>
          <template v-else-if="verificationStatus && (verificationStatus=='PENDING')">
            <span class="text-red">Photo Verification Status: PENDING.</span>
          </template>
          <template v-else-if="verificationStatus && (verificationStatus=='SUCCESS')">
            <span class="color: #000;">Photo Verification Success.</span>
          </template>
        </div>
        <div class="buttons column text-subtitle1">
          <q-btn
            class="submit-btn"
            label="Change Password"
            type="submit"
            @click="updatePwdModal"
          />

          <q-btn
            v-if="verificationStatus !== 'SUCCESS' "
            class="full-width text-caption"
            label="Security Verification"
            type="submit"
            color="brand"
            @click="goToSecurityVerficationPage"
          />
        </div>

        <q-dialog
          v-model="updatePwdModalVisible"
          transition-show="slide-up"
          transition-hide="slide-down"
        >
          <q-card style="width: 100%; padding: 20px" class="">
            <q-card-section>
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div class="text-h6">Change Password</div>
                <q-icon name="close" size="md" style="color:#B9B9BB" v-close-popup/>
              </div>
            </q-card-section>

            <q-form class="q-mt-md q-gutter-y-md personal-info-page-form change-password-form">
              <q-input
                class="grey-bg-input"
                ref="oldPasswordRef"
                rounded
                outlined
                type="password"
                v-model="updatePwdInfo.oldPassword"
                placeholder="Current Password"
                :rules="oldPwdRules"
              />
              <q-input
                class="grey-bg-input"
                ref="passwordRef"
                rounded
                outlined
                type="password"
                v-model="updatePwdInfo.password"
                placeholder="New Password"
                :rules="pwdRules"
              />
              <q-input
                class="grey-bg-input"
                ref="confirmRef"
                rounded
                outlined
                type="password"
                v-model="updatePwdInfo.confirm_pass"
                placeholder="Confirm New Password"
                :rules="confirmPwdRules"
              />

              <q-btn class="submit-btn" label="Confirm" @click="submitUpdatePwd"/>
            </q-form>
          </q-card>
        </q-dialog>

        <q-dialog
          v-model="updateSecurityModalVisible"
          transition-show="slide-up"
          transition-hide="slide-down"
        >
          <q-card style="width: 100%; padding: 20px; margin: 0" class="">
            <q-card-section>
              <div class="text-h6">Security Verification</div>
            </q-card-section>

            <q-form class="q-gutter-sm">
              <q-input readonly v-model="personalState.memberInfo.email"/>
              <div class="half">
                <q-input
                  ref="verificationCodeRef"
                  type="password"
                  v-model="updateSecurityVerified.verificationCode"
                  placeholder="Verification Code"
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Verification Code cannot be empty',
                  ]"
                />
                <q-btn label="Get Verification" @click="openVerificationModal"/>
              </div>
              <q-btn label="Verify" color="brand" @click="submitUpdateSecurity"/>
            </q-form>
          </q-card>
        </q-dialog>

        <!-- Get otp dialog -->
        <q-dialog
          v-model="verificationModalVisible"
          transition-show="slide-up"
          transition-hide="slide-down"
        >
          <q-card class="q-pa-md">
            <div class="modal-head-title q-pb-md">Verify Captcha Code</div>
            <q-form class="q-gutter-sm">
              <q-input
                ref="captchaCodeRef"
                filled
                type="text"
                v-model="updateSecurityVerified.captchaCode"
                label="Captcha Code"
                :rules="[
                  (val) => (val && val.length > 3) || 'Enter verification code',
                ]"
                color="white"
              >
                <template v-slot:append>
                  <img :src="verificationImg" @click="getCode()"/>
                </template>
                <template v-slot:prepend>
                  <q-icon name="security"/>
                </template>
              </q-input>
              <q-btn
                :disabled="isEmailSending"
                :style="isEmailSending ? 'opacity: .6' : ''"
                class="common-btn verification-btn"
                @click.prevent="verifyVerificationCode"
              >
                {{ isEmailSending ? "Verifying" : "Verify" }}
              </q-btn>
            </q-form>
          </q-card>
        </q-dialog>
      </div>
      <FooterArea />
    </div>
  </div>
</template>

<script setup>
import {reactive, ref, onMounted, computed } from "vue";
import {
  RiFileUserLine,
  RiCake2Line,
  RiSmartphoneLine,
  RiEditLine,
  RiPassportLine,
  RiCloseLine,
  RiCheckLine
} from "vue-remix-icons";

import moment from "moment";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {userStore} from "src/stores";

import {getCodeDetail} from "src/utils/helper";
import {useRouter} from "vue-router";
import FooterArea from "src/components/FooterArea.vue";
import ProfileSummary from "src/components/account/ProfileSummary.vue";

const qs = require("qs");
const $q = useQuasar();

const personalState = reactive({
  memberInfo: {},
});

const formattedBirthday = computed(() => personalState.memberInfo.birthday && moment(personalState.memberInfo.birthday).format('DD-MM-YYYY'))

const verificationDetails = reactive({
  memberInfo: {},
});

personalState.memberInfo = userStore();

const verificationImg = ref("");

const isWithdrawPasswordExist = ref(false);

const oldPwdRules = ref([
  (val) => (val && val.length > 0) || "Please enter your old password",
  (val) =>
    (val.length > 5 && val.length < 12) ||
    "Password 's length must be between 6 to 12.",
]);
const pwdRules = ref([
  (val) => (val && val.length > 0) || "Please enter your new password",
  (val) =>
    (val.length > 5 && val.length < 12) ||
    "Password 's length must be between 6 to 12.",
]);

const confirmPwdRules = ref([
  (val) => (val && val.length > 0) || "Please enter confirm new password",
  (val) => (val) === updatePwdInfo.password || "Confirm new password must be same with new password."
])

const isValidPhone = () => {
  const phonePattern = /^\d+$/;
  return (
    phonePattern.test(formDetail.value.phone) || "Only numbers are allowed"
  );
};

const isValidName = () => {
  const namePattern = /^[A-Za-z ]+$/;
  return (
    namePattern.test(formDetail.value.realName) ||
    "Only English letters and space are allowed"
  );
};

const getCode = async () => {
  const json = await getCodeDetail();

  if (json.isOk) {
    verificationImg.value = json.verificationImg;
    updateSecurityVerified.codeId = json.codeId;
  } else {
    $q.notify({
      color: "negative",
      position: "top",
      message: json.message,
      icon: "report_problem",
    });
  }
};

const isEmailSending = ref(false);
const updateSecurityModalVisible = ref(false);

const updateSecurityVerified = reactive({
  mobileNumber: "",
  verificationCode: "",
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

  verificationDetails.memberInfo.email = personalState.memberInfo.email;

  const emailDetails = {
    email: personalState.memberInfo.email,
    captchaCode: updateSecurityVerified.captchaCode,
    codeId: updateSecurityVerified.codeId,
  };

  api
    .post("/otp/sendEmail", qs.stringify(emailDetails))
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "An OTP code has been sent to your email.",
          icon: "check_circle_outline",
        });

        verificationDetails.memberInfo.codeId = res.data.codeId;
        verificationModalVisible.value = false;
      }
    })
    .finally(() => {
      getCode();
      isEmailSending.value = false;
    });
};

const verificationCodeRef = ref();

const submitUpdateSecurity = () => {
  verificationCodeRef.value.validate();

  if (verificationCodeRef.value.hasError) return;

  console.log(personalState.memberInfo);

  verificationDetails.memberInfo.email = personalState.memberInfo.email;
  verificationDetails.memberInfo.code = updateSecurityVerified.verificationCode;

  api
    .post("/otp/verifyEmail", qs.stringify(verificationDetails.memberInfo))
    .then(() => {
      $q.notify({
        color: "positive",
        position: "top",
        message: "Successfully verified",
        icon: "check_circle_outline",
      });
      updateSecurityModalVisible.value = false;
      loadInfo();
    });
};
//update pwd
const updatePwdModalVisible = ref(false);
const oldPasswordRef = ref();
const passwordRef = ref();
const confirmRef = ref();

const loadInfo = () => {
};

const updatePwdInfo = reactive({
  oldPassword: "",
  password: "",
  confirm_pass: ""
});
const updatePwdModal = () => {
  updatePwdInfo.oldPassword = "";
  updatePwdInfo.password = "";
  updatePwdInfo.confirm_pass = "";
  updatePwdModalVisible.value = true;
};

const submitUpdatePwd = () => {
  oldPasswordRef.value.validate();
  passwordRef.value.validate();
  confirmRef.value.validate();

  if (oldPasswordRef.value.hasError || passwordRef.value.hasError || confirmRef.value.hasError) {
  } else {
    api
      .post(
        "/session/password",
        qs.stringify({
          oldPassword: updatePwdInfo.oldPassword,
          password: updatePwdInfo.password,
        })
      )
      .then((res) => {
        if (res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "Password updated successfully",
            icon: "check_circle_outline",
          });

          updatePwdModalVisible.value = false;
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};
const isEdit = ref(false);
const emailRef = ref();
const realNameRef = ref();
const birthdayRef = ref();
const phoneRef = ref();
const formDetail = ref({});

const updateState = () => {
  const updateInfo = formDetail.value;

  if (!personalState.memberInfo.email) {
    emailRef.value.validate();
    if (emailRef.value.hasError) {
      return;
    }
  }
  if (!personalState.memberInfo.realName) {
    realNameRef.value.validate();
    if (realNameRef.value.hasError) {
      return;
    }
  }
  if (!personalState.memberInfo.birthday) {
    birthdayRef.value.validate();
    if (birthdayRef.value.hasError) {
      return;
    }
  }
  if (!personalState.memberInfo.telephone) {
    phoneRef.value.validate();
    if (phoneRef.value.hasError) {
      return;
    }
  }

  api.post("/session/account", qs.stringify(updateInfo)).then((res) => {
    if (res.code === 0) {
      $q.notify({
        color: "positive",
        position: "top",
        message: "Updated successfully",
        icon: "check_circle_outline",
      });

      isEdit.value = !isEdit.value;
      location.reload();
    }
  });
};

// update withdraw pwd
const getWithdrawPassword = () => {
  api.get("/session/withdraw/entrance").then((res) => {
    if (res.code === 0) {
      isWithdrawPasswordExist.value = res.data;
    }
  });
};

const updateWithdrawPwdModalVisible = ref(false);
const oldWithdrawPasswordRef = ref();
const withdrawPasswordRef = ref();
const updateWithdrawPwdInfo = reactive({
  oldPassword: "",
  password: "",
});

const updateWithdrawPwdModal = () => {
  getWithdrawPassword();
  updateWithdrawPwdInfo.oldPassword = "";
  updateWithdrawPwdInfo.password = "";
  updateWithdrawPwdModalVisible.value = true;
};

const submitUpdateWithdrawPwd = () => {
  isWithdrawPasswordExist.value && oldWithdrawPasswordRef.value.validate();
  withdrawPasswordRef.value.validate();

  if (
    (isWithdrawPasswordExist.value && oldWithdrawPasswordRef.value.hasError) ||
    withdrawPasswordRef.value.hasError
  ) {
  } else {
    api
      .post(
        "/session/withdrawPassword",
        qs.stringify({
          oldPassword: updateWithdrawPwdInfo.oldPassword,
          password: updateWithdrawPwdInfo.password,
        })
      )
      .then((res) => {
        if (res.code === 0) {
          isWithdrawPasswordExist.value = true;

          $q.notify({
            color: "positive",
            position: "top",
            message: "Withdraw Password updated successfully",
            icon: "check_circle_outline",
          });

          updateWithdrawPwdModalVisible.value = false;
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

const router = useRouter();
const goToSecurityVerficationPage = () => {
  if(verificationStatus.value && verificationStatus.value === 'PENDING'){
    $q.notify({
      color: "warning",
      position: "top",
      message: "Photo verification is in Pending.",
      icon: "report_problem",
    });
  }else{
    router.push("/account/security-verification");
  }

};


const verificationStatus = ref(false);
const loadVerificationStatus = () => {
  api.get("/session/idVerifyStatus").then((response) => {
    if (response.code === 0) {
      console.log(response.data);
      verificationStatus.value = response.data.status;

    }
  });
}

onMounted(() => {
  // getCode();
  loadVerificationStatus();
});
</script>

<style lang="scss">
.passwordModal .ant-modal {
  max-width: 520px;
  width: 100%;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  .ant-modal-content {
    width: 90%;
  }
}

.securityModal .ant-modal {
  width: 100%;
  max-width: 600px;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  .ant-modal-content {
    width: 90%;
  }
}

.ant-modal.ant-modal-confirm {
  width: 100%;
  max-width: 600px;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<style scoped lang="scss">
.half {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 10px;
}

:deep(.ant-form-item.half .ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  .ant-input {
    width: 100%;
    flex: 1;
  }
}

:deep(.ant-form-item .ant-select) {
  width: 100%;
}

:deep(.ant-form-item.select .ant-form-item-control-input) {
  width: 100%;
}

:deep(
    .ant-select-single:not(.ant-select-customize-input)
      .ant-select-selector
      .ant-select-selection-search-input
  ) {
  height: 40px;
}

:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  height: 40px;
  padding: 5px 20px;
  background: #23263c;
  color: #ffffff;
  border: 0;
}

.common-btn {
  width: 100%;
  cursor: pointer;

  &.search-btn {
    margin-top: 0;
    padding: 3px 5px;
    font-size: 14px;
  }

  &.verification-btn {
    flex: 1;
    padding: 8px;
  }

  &.submit-btn {
    padding: 8px;
  }
}

.basic-info {
  position: relative;
  margin: 0;

  .buttons {
    position: absolute;
    top: 20px;
    right: 10%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .account-btn {
    cursor: pointer;
    padding: 5px 20px;
    font-size: 16px;
    min-width: 180px;
  }
}

.basic-info-table {
  .tbl-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    align-items: center;

    svg {
      fill: #ffffff;
      width: 20px;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .basic-info-cell {
    &.title {
      width: 150px;
    }

    // &.content {
    //   // width: 170px;
    //   width: calc(100% - 100px);
    //   max-width: 250px;
    //   color: #1bcef1;
    // }
  }
}

.unbind-record-wrapper {
  margin-top: 20px;
}

.left {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.searchbar .ant-form {
  display: flex;
  justify-content: space-between;

  .ant-form-item {
    margin-right: 0;
  }
}

.personal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  .personal-information-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
    // margin: 20px;
    // box-shadow: 2px 2px 10px 1px #000000;
    border-radius: 20px;
    overflow: hidden;

    .name-email {
      background-image: $primary-linear;
      padding: 50px;
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      position: relative;

      .top-right {
        position: absolute;
        right: 20px;
        top: 20px;
      }

      .info-picture {
        border-radius: 50%;
        width: 100px;
        height: 100px;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .info-name {
        color: #ffffff;
        font-size: 30px;
      }

      .info-email {
        color: #ffffff;
      }
    }

    .other-info {
      padding: 20px;

      .account-tip {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 10px;
        margin: 20px 0;

        a {
          color: $primary;
        }
      }

      .verifi-text-box {

        width: 100%;
        text-align: left;
        margin-top: 8px;
        margin-bottom: 8px;
        line-height: 18px;

        .text-red {
          color: #ff4d4f;
        }

        span{

        }
      }

      .buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
      }
    }
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .account-container {
    .basic-info-table {
      grid-template-columns: 1fr;
    }
  }
  .personal-wrapper {
    .buttons {
      flex-direction: column;
    }
  }
}

@media (max-width: 768px) {
  .bindunbind {
    display: none;
  }
  .basic-info {
    .account-btn {
      padding: 5px 0px;
      font-size: 12px;
      min-width: 140px;
    }
  }
}

@media (max-width: 768px) {
  .account-container {
    .account-content-wrapper {
      //     .basic-info-table {
      //       width: 100%;
      //       .basic-info-cell {
      //         padding-right: 56px;
      //         padding-bottom: 16px;
      //         &.title {
      //           width: 100px;
      //         }
      //       }
      //     }
      .bank-card-list {
        max-width: 300px;
        margin: 100px auto;
        padding: 15% 0 0;

        .bank-card-item {
          width: 100%;
          max-width: 300px;
          margin-right: 0;
          margin: 0;
          margin-top: -40%;
          flex-direction: column;
          align-items: center;
          height: 150px;
          // background-image: url("../../assets/images/account/bank_card_bg.png");
          transform: none;

          .unlink-btn {
            right: 10px;
            left: unset;
            display: none;
            transition-delay: 0.5s;
            transition: all 0.3s ease-in;
          }

          .txt-center {
            transform: none;
            padding-top: 10px;
            width: 100%;
          }

          &.active {
            margin-bottom: 30%;
            padding-bottom: 10%;

            .unlink-btn {
              display: block;
            }
          }

          &.inactive {
            margin-top: -40%;
          }
        }
      }
    }
  }
}
</style>
