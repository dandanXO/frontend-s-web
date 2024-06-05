<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">Personal center</span>
    </div>

    <div class="personal-wrapper">
      <button @click="handleUpload" class="personal-profile">
        <img v-if="profilePhoto && !tempProfile" :src="profilePhoto" />
        <img v-else-if="tempProfile" :src="tempProfile" />
        <div class="personal-profile-mask">
          <RiCameraFill />
        </div>
      </button>
      <a-form ref="updateFormRef" :model="updateFormDetails" class="personal-info-wrapper" hide-required-mark>
        <a-form-item required name="nickName" label="Phone number" label-align="left">
          <a-input :disabled="true" v-model:value="updateFormDetails.nickName" placeholder="Please enter your nick name" />
        </a-form-item>
          <div class="datewsend">
            <a-form-item
              label="Email" 
              name="email"
            >
              <div class="fake-field">
                <div class="fake-input">
                {{ personalState.memberInfo.email}}
                </div>
                <a-button
                  class="common-btn"
                  v-if="!personalState.memberInfo.emailVerified"
                  type="button"
                  @click="updateSecurityModal"
                >
                  Verify
                </a-button>
                <RiMailCheckLine v-if="personalState.memberInfo.emailVerified" style="width: 20px; fill: #ffffff" />
              </div>
            </a-form-item>
            <!-- <a-input v-model="updateFormDetails.email" placeholder="อีเมลล์" /> -->
          </div> 
          <!-- <RiMailCheckLine v-if="personalState.memberInfo.emailVerified" style="width: 20px; fill: #ffffff" />
          <a-button
            class="common-btn"
            v-if="!personalState.memberInfo.emailVerified"
            type="button"
            @click="updateSecurityModal"
          >
            Verify
          </a-button> -->
          <!-- <div v-if="!personalState.memberInfo.email" class="datewsend">
            <a-form-item
            label="Email" 
              name="email"
              :rules="[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Email address is not valid' }
              ]"
            >
              <div class="fake-field">
                <div class="fake-input">
                {{ personalState.memberInfo.email}}
                </div>
                <a-button
                  class="common-btn"
                  v-if="!personalState.memberInfo.emailVerified"
                  type="button"
                  @click="updateSecurityModal"
                >
                  Verify
                </a-button>
              </div>
            </a-form-item>
            <!- <a-input v-model="updateFormDetails.email" placeholder="อีเมลล์" /> ->
          </div> -->
        <!-- <a-form-item :rules="[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Email address is not valid' }
              ]" name="email" label="Email" label-align="left">
          <a-input v-model:value="updateFormDetails.email" placeholder="Please enter your email" />
        </a-form-item> -->
        <!-- <a-form-item required name="password" label="Password" label-align="left">
          <a-input v-model:value="updateFormDetails.password" placeholder="Please enter new password" />
        </a-form-item> -->
        <a-form-item :rules="[
                        {
                          validator: validateName,
                          trigger: 'blur'
                        },
                        {
                          required: true,
                          trigger: 'blur',
                          message: 'Real name is required'
                        }
                       ]" name="realName" label="Full Name" label-align="left">
          <a-input v-model:value="updateFormDetails.realName" placeholder="Please enter your full name" />
        </a-form-item>
      </a-form>
        
        <a-form-item class="txt-center" style="max-width: 340px;">
          <button class="txt-center common-btn" type="submit" @click="updateState">SUBMIT</button>
        </a-form-item>
    </div>
    
    <a-modal
      wrap-class-name="securityModal"
      v-model:visible="verificationModalVisible"
      title="Captcha"
      width="500px"
      align-center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @keydown.enter.prevent
    >
      <a-form ref="captchaUpdateRef" :model="updateSecurityVerified">
        <a-form-item ref="captchaCode" prop="captchaCode" :rules="[{ required: true, message: 'Please insert captcha' }]">
            <a-input
              @keyup.enter="verifyVerificationCode"
              v-model:value="updateSecurityVerified.captchaCode"
              :maxlength="4"
              placeholder="Captcha"
            >
              <template #suffix>

            <div class="verification" @click="getCode()">
              <img style="width: 80%; margin-top: 6px" :src="verificationImg" />
            </div>
          </template>
        </a-input>
        </a-form-item>
      </a-form>
      <a-button class="common-btn" @click="verifyVerificationCode" :loading="isEmailSending">Verify</a-button>
    </a-modal>
    <a-modal v-model:visible="updateSecurityModalVisible" wrap-class-name="securityModal" :footer="null" 
      width="500px">
      <div class="modal-head-title">Security Verification</div>
      <a-form
        ref="updateSecurityFormRef"
        :hide-required-mark="true"
        :model="updateSecurityVerified"
        :rules="updateSecurityVerifiedRules"
      >
        <a-form-item ref="emailAddress" name="emailAddress">
          <a-input v-model:value="personalState.memberInfo.email" placeholder="Please input email address" />
        </a-form-item>
        <a-form-item ref="verificationCode" class="half" name="verificationCode">
          <a-input v-model:value="updateSecurityVerified.verificationCode" placeholder="Verification code">
            <template #suffix>
              
          <span class="common-btn verification-btn" @click="openVerificationModal">Verify</span>
            </template>
              
          </a-input>
        </a-form-item>
        <span class="common-btn verification-btn" @click="submitUpdateSecurity">Submit</span>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, toRaw } from "vue";
import { message } from "ant-design-vue";
import { userStore } from "@/store";
import { getDevice } from "@/utils/utils";
import {
  loadMemberInfo,
  changePwd,
  loadVerifyStatus,
  updateAccount,
  sendEmail,
  verifyEmail
} from "@/api/personal/personal";
import { getVerificationCode } from "@/api/index/login";
import moment from "moment";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useHandleUpload } from "@/hooks/upload";
import { RiCameraFill, RiMailCheckLine } from "vue-remix-icons";

let validateName = async (r, v) => {
  var reg = /[^a-zA-Z0-9 ]/g;
  if (v === "") {
    return Promise.reject("Please enter real name");
  } else if (reg.test(v)) {
    return Promise.reject("Only alphabets and numbers are allowed");
  } else {
    return Promise.resolve();
  }
};
let validateIC = async (r, v) => {
  var reg = /[^a-zA-Z0-9]/g;
  if (v === "") {
    return Promise.reject("Please enter IC No");
  } else if (reg.test(v)) {
    return Promise.reject("Only alphabets and numbers are allowed");
  } else {
    return Promise.resolve();
  }
};

let validatePass2 = async (r, v) => {
  if (v !== updatePwdInfo.password) {
    return Promise.reject("Confirm Password is not same");
  } else {
    return Promise.resolve();
  }
};

const store = userStore();
const { profilePhoto, nickName, email, realName } = storeToRefs(store);

const tempProfile = ref();
// TODO: upload api
const { handleUpload } = useHandleUpload(
  ([file]) => {
    if (tempProfile.value) URL.revokeObjectURL(tempProfile.value);
    tempProfile.value = URL.createObjectURL(file);
  },
  { accept: "image/*", multiple: false }
);


const isEmailSending = ref(false);
const verificationDetails = reactive({
  memberInfo: {}
});
// const isCardActive = ref();
const searchForm = reactive({
  start: "",
  end: ""
});

const personalState = reactive({
  memberInfo: {}
});

const verificationImg = ref("");
onMounted(() => {
  loadInfo();
  // loadVerificationStatus();
  getCode();
});
const uploadRef = ref();

const openWindow = (pageURL, pageTitle, popupWinWidth, popupWinHeight) => {
  var left = (screen.width - popupWinWidth) * 2;
  var top = (screen.height - popupWinHeight) / 4;
  window.open(
    pageURL,
    pageTitle,
    "resizable=yes, width=" + popupWinWidth + ", height=" + popupWinHeight + ", top=" + top + ", left=" + left
  );
};
const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
const getCode = () => {
  getVerificationCode().then((res) => {
    if (res.code === 0) {
      verificationImg.value = "data:image/png;base64," + res.data.img;
      updateSecurityVerified.codeId = res.data.id;
    }
  }).catch((e) => {
    message.error(e.message);
  });
};
const loadInfo = () => {
  loadMemberInfo()
    .then((response) => {
      if (response.code === 0) {
        personalState.memberInfo = response.data;

        if (personalState.memberInfo.birthday) {
          personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("DD-MM-YYYY");
        }
        if (personalState.memberInfo.realName) {
          personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("DD-MM-YYYY");
        }
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const verificationStatus = ref(false);
const loadVerificationStatus = () => {
  loadVerifyStatus().then((response) => {
    if (response.code === 0) {
      console.log(response.data);
      verificationStatus.value = response.data.status;
    }
  });
};
//update security

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
  updateSecurityVerified.captchaCode = ''
  verificationModalVisible.value = true;
};
const verifyVerificationCode = () => {
  isEmailSending.value = true;
  verificationDetails.memberInfo.email = personalState.memberInfo.email;
  const emailDetails = {
    email: personalState.memberInfo.email,
    captchaCode: updateSecurityVerified.captchaCode,
    codeId: updateSecurityVerified.codeId
  };
  sendEmail(emailDetails)
    .then((res) => {
      if (res.code === 0) {
        verificationDetails.memberInfo.codeId = res.data.codeId;
        verificationModalVisible.value = false;
        message.success("success");
        isEmailSending.value = false;
      }
    })
    .catch((e) => {
      console.log(e.message);
      // getCode()
      isEmailSending.value = false;
    });
};
const submitUpdateSecurity = () => {
  updateSecurityFormRef.value
    .validate()
    .then(() => {
      verificationDetails.memberInfo.code = updateSecurityVerified.verificationCode;
      verificationDetails.memberInfo.email = personalState.memberInfo.email;

      verifyEmail(verificationDetails.memberInfo)
        .then((res) => {
          if (res.code === 0) {
            message.success("success");
            updateSecurityModalVisible.value = false;
            loadInfo();
          }
        })
        .catch((e) => {
          console.log(e.message);
        });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const updateSecurityVerifiedRules = {
  verificationCode: [
    {
      required: true,
      message: "Please enter verification code",
      trigger: "blur"
    },
    {
      min: 4,
      message: "Length should be 4",
      trigger: "blur"
    }
  ]
};

//update pwd
const updatePwdModalVisible = ref(false);
const updatePwdFormRef = ref();
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
  updatePwdFormRef.value
    .validate()
    .then(() => {
      changePwd(updatePwdInfo.oldPassword, updatePwdInfo.password)
        .then((response) => {
          if (response.code === 0) {
            message.success("success");
            updatePwdModalVisible.value = false;
          } else {
            message.error(response.message);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    })
    .catch((error) => {
      console.log("error", error);
    });
};
const updatePwdRules = {
  oldPassword: [
    {
      required: true,
      message: "Please enter old password",
      trigger: "blur"
    },
    {
      min: 6,
      max: 12,
      message: "Length should be between 6 to 12",
      trigger: "blur"
    }
  ],
  password: [
    {
      required: true,
      message: "Password is required",
      trigger: "blur"
    },
    {
      min: 6,
      max: 12,
      message: "Length should be 6 to 12",
      trigger: "blur"
    }
  ],
  confirm_pass: [
    {
      required: true,
      message: "Confirm New Password is required",
      trigger: "blur"
    },
    {
      min: 6,
      max: 12,
      message: "Length should be 6 to 12",
      trigger: "blur"
    },
    {
      validator: validatePass2,
      trigger: "blur"
    }
  ],
  captchaCode: [
    {
      required: true,
      message: "Captcha code is required",
      trigger: "blur"
    },
    {
      min: 4,
      max: 4,
      message: "Length should be 4",
      trigger: "change"
    }
  ]
};

//update details
const isEditRealName = ref(false);

const isEditEmail = ref(false);
const isEditPhone = ref(false);
const isEditBirthday = ref(false);
const isEdit = ref(false);
const updateFormDetails = reactive({
  nickName: nickName.value || "",
  password: "",
  realName: realName.value || ""
});
const updateFormRef = ref();
const updateState = async () => {
  try {
    await updateFormRef.value.validate();
    const ret = await updateAccount(toRaw(updateFormDetails));

    if (ret.code === 0) {
      message.success("Updated successfully");
      loadInfo();
      isEdit.value = false;
    } else {
      message.error(ret.message);
    }
  } catch (err) {
    console.error("An error occurred:", err.message);
  }
};

const router = useRouter();
const goToSecurityVerficationPage = () => {
  if (verificationStatus.value && verificationStatus.value === "PENDING") {
    message.warning("Photo verification is in Pending.");
  } else {
    router.push("/center/security-verification");
  }
};
</script>
<style scoped lang="scss">
.menu-title-container {
  margin-bottom: 26px;
}

.personal-wrapper {
  display: flex;
  flex-direction: column;
  gap: 30px;

  .personal-profile {
    border-radius: 50%;
    border: 2px solid #13e25c;
    background-color: transparent;
    width: 60px;
    height: 60px;
    position: relative;
    overflow: hidden;

    .personal-profile-mask {
      display: none;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.6);

      svg {
        width: 26px;
        fill: #ffffff;
      }
    }

    img {
      width: 100%;
    }

    &:hover {
      .personal-profile-mask {
        display: flex;
      }
    }
  }

  .personal-info-wrapper {
    display: grid;
    gap: 25px 40px;
    grid-template-columns: repeat(3, 1fr);
  }
  .fake-field {
      display: flex; 
      background: rgba(255, 255, 255, 0.0588235294);
      border: 1px solid rgba(255, 255, 255, 0.0588235294);
      padding: 8px 15px;
      border-radius: 12px;
    .fake-input { 
      color: #ffffff;
      gap: 10px;
      flex: 3;
    }
      .ant-btn.common-btn {
      flex: 1;
        width: unset;
        height: unset;
        min-height: unset;
        padding: 4px 0;
      }
  }
}
</style>
