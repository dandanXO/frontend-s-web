<template>
  <ImageCropUpload
    field="img"
    lang-type="en"
    @crop-success="cropSuccessID"
    @crop-upload-success="cropUploadSuccessID"
    @crop-upload-fail="cropUploadFailID"
    v-model="isShowUploadUI.idPhoto"
    img-format="png"
  ></ImageCropUpload>

  <ImageCropUpload
    field="img"
    lang-type="en"
    @crop-success="cropSuccessHoldingID"
    @crop-upload-success="cropUploadSuccessHoldingID"
    @crop-upload-fail="cropUploadFailHoldingID"
    v-model="isShowUploadUI.holdingIDPhoto"
    img-format="png"
  ></ImageCropUpload>

  <div class="menu-title-container">
    <span class="menu-title">Security Verification</span>
  </div>

  <a-form ref="formRef" :rules="verificationRules" :hide-required-mark="true" :model="fieldValue">
    <div class="field-container">
      <div class="id-type-field">
        <div class="left-container">
          <div class="account-title-container">
            <span class="account-title">Valid ID</span>
          </div>

          <!--
          <a-form
              ref=""
              :hide-required-mark="true"
              :model="fieldValue"
              :rules="[
            {
              required: true,
              message: `Please enter your phone number`,
            },
          ]"

           <a-form
        ref=""
        :hide-required-mark="true"
        :model="fieldValue"
        :rules="[
          {
            required: true,
            message: `Please enter your Verification Code`,
          },
        ]"
      >
          > -->
          <div class="field-title">ID Type</div>
          <a-form-item class="select">
            <a-select
              ref="idTypeRef"
              required
              name="idTypeRef"
              v-model:value="fieldValue.idType"
              :placeholder="'Please select the type of ID'"
            >
              <a-select-option v-for="id in idType" :key="id" :value="id">
                {{ id }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <div class="field-title">ID Number</div>

          <a-form-item>
            <a-input
              ref="idNumberRef"
              required
              name="idNumberRef"
              class="field-input"
              v-model:value="fieldValue.idNumber"
              placeholder="Please enter ID number"
            />
          </a-form-item>
        </div>

        <div class="right-container">
          <div class="upload-container">
            <span>Upload ID Photo</span>
            <img
              :src="`${
                fieldValue.idPhoto || require('../../assets/images/account/security-verification/upload-id.png')
              }`"
              alt="upload-id"
              @click="uploadID"
            />
          </div>
          <div class="upload-container">
            <span>Upload holding ID Photo</span>
            <img
              :src="`${
                fieldValue.holdingIDPhoto ||
                require('../../assets/images/account/security-verification/upload-holding-id.png')
              }`"
              alt="upload-holding-id"
              @click="uploadHoldingID"
            />
          </div>
        </div>
      </div>

      <div class="separator"></div>

      <div class="sms-verification-field">
        <div class="account-title-container">
          <span class="account-title">SMS Verification</span>
        </div>

        <div class="field-group">
          <a-input
            class="field-input"
            ref="smsCodeRef"
            required
            name="smsCodeRef"
            v-model:value="fieldValue.otpCode"
            placeholder="Please enter your SMS OTP Code"
          />
          <button class="common-btn get-ver-code-btn" :disabled="isBtnDisabled" @click="openTelephoneVerificationModal">
            Get SMS OTP Code
          </button>
        </div>
      </div>
    </div>

    <!-- Phone verification modal starts here -->
    <a-modal v-model:visible="isTelephoneVerificationModalVisible" :width="400" title="Verify">
      <a-form
        ref="telephoneVerifyCaptchaFormRef"
        :model="telephoneVerifyFieldValue"
        :rules="telephoneVerifyCaptchaFormRules"
      >
        <a-form-item ref="telephoneVerifyCaptchaCodeRef" required name="telephoneVerifyCaptchaCode">
          <a-input
            v-model:value="telephoneVerifyFieldValue.telephoneVerifyCaptchaCode"
            :maxlength="4"
            placeholder="Verification code"
            autosize
          >
            <template #prefix>
              <SafetyCertificateOutlined />
            </template>
          </a-input>
          <div class="verification">
            <img :src="telephoneVerificationCaptchaImg" @click="getTelephoneVerificationImgCode" />
          </div>
        </a-form-item>
        <button class="txt-center common-btn login-btn" type="button" @click="getOtpCode">Confirm</button>
      </a-form>
    </a-modal>
    <!-- Phone verification modal ends here -->

    <div class="button-container">
      <button class="common-btn cancel-btn" @click="backToPersonalPage">Cancel</button>
      <button class="common-btn submit-btn" @click="submit">Submit</button>
    </div>
  </a-form>
</template>

<script setup>
import { ref, reactive } from "vue";
import { verifyID, sendTelephoneOtpToRegisteredUser } from "@/api/personal/personal";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import ImageCropUpload from "vue-image-crop-upload";
import { userStore } from "@/store";
import { getVerificationCode } from "@/api/index/login";

const store = userStore();
const router = useRouter();

const idType = ref([
  "Driver's License",
  "PhilHealth ID",
  "Postal ID",
  "NBI Clearance",
  "Senior Citizen Card",
  "Overseas Workers Welfare Administration (OWWA)",
  "ID Passport (Philippine/Foreign)",
  "Firearms License",
  "Police Clearance",
  "Integrated Bar of the Philippines ID",
  "Seaman's Book",
  "Professional Regulations Commission",
  "Overseas Filipino Workers (OFW) ID",
  "Social Security System (SSS) Card",
  "Tax Identification (TIN)",
  "Unified Multi-Purpose ID (UMID)",
  "Voter's Certificate",
  "Maritime Industry Authority (MARINA) ID",
  "Valid Passport",
  "Alien Certificate of Registration",
  "Immigrant Certificate of Registration",
  "National ID",
  "Other"
]);

const fieldValue = reactive({
  idType: undefined,
  idNumber: "",
  phoneNumber: "",
  verificationCode: "",
  idPhoto: "",
  holdingIDPhoto: "",
  otpCode: "",
  otpCodeId: ""
});
const telephoneVerifyFieldValue = reactive({
  telephoneVerifyCaptchaCode: "",
  telephoneVerifyCaptchaCodeId: ""
});

const isShowUploadUI = reactive({
  idPhoto: false,
  holdingIDPhoto: false
});

const uploadID = () => {
  isShowUploadUI.idPhoto = true;
};

const uploadHoldingID = () => {
  isShowUploadUI.holdingIDPhoto = true;
};

const isOtpSending = ref(false);
const isBtnDisabled = ref(false);

const telephoneVerifyCaptchaFormRef = ref();
const telephoneVerificationCaptchaImg = ref("");
const isTelephoneVerificationModalVisible = ref(false);
const openTelephoneVerificationModal = () => {
  getTelephoneVerificationImgCode();
  isTelephoneVerificationModalVisible.value = true;
};
const getTelephoneVerificationImgCode = async () => {
  telephoneVerifyFieldValue.telephoneVerifyCaptchaCode = "";

  getVerificationCode()
    .then((res) => {
      if (res.code === 0) {
        telephoneVerificationCaptchaImg.value = "data:image/png;base64," + res.data.img;
        telephoneVerifyFieldValue.telephoneVerificationCaptchaCodeId = res.data.id;
      }
    })
    .catch((e) => {
      console.log(e);
    });
};
const getOtpCode = () => {
  telephoneVerifyCaptchaFormRef.value
    .validate()
    .then(() => {
      isOtpSending.value = true;

      const captchaDetails = {
        codeId: telephoneVerifyFieldValue.telephoneVerificationCaptchaCodeId,
        captchaCode: telephoneVerifyFieldValue.telephoneVerifyCaptchaCode
      };

      sendTelephoneOtpToRegisteredUser(captchaDetails)
        .then((res) => {
          if (res.code === 0) {
            fieldValue.otpCodeId = res.data.codeId;
            fieldValue.otpCode = "";

            isOtpSending.value = false;

            message.success("OTP Sent");

            isTelephoneVerificationModalVisible.value = false;
          }
        })
        .catch((e) => {
          console.log(e.message);
          isOtpSending.value = false;
          getTelephoneVerificationImgCode();
          telephoneVerifyCaptchaFormRef.value.validate();
        });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const backToPersonalPage = () => {
  router.push("/center/personal");
};

const formRef = ref();
const submit = () => {
  if (!fieldValue.idNumber || !fieldValue.idType || !fieldValue.otpCode) {
    return;
  }

  if (!fieldValue.idPhoto || !fieldValue.holdingIDPhoto) {
    message.error("Please submit your ID Photo and Holding Id photo.");
    return;
  }
  const success = true;
  if (success) {
    // fieldValue.idPhoto = convert2File(fieldValue.idPhoto);
    // fieldValue.holdingIDPhoto = convert2File(fieldValue.holdingIDPhoto);
    // console.log("fieldValue.idPhoto : " + fieldValue.idPhoto);
    var formData = new FormData();
    formData.append("idType", fieldValue.idType);
    formData.append("idNumber", fieldValue.idNumber);
    formData.append("otpCode", fieldValue.otpCode);
    formData.append("otpCodeId", fieldValue.otpCodeId);

    formData.append("idPhoto", convert2File(fieldValue.idPhoto), "1.jpg");
    formData.append("holdingIDPhoto", convert2File(fieldValue.holdingIDPhoto), "2.jpg");
    verifyID(formData, store.token).then((resp) => {
      if (resp.data.code === 0) {
        message.success("Success");
        backToPersonalPage();
      } else {
        message.error(resp.data.message);
      }
    });
  } else {
    message.error("Failed");
  }
};

const verificationRules = {
  idTypeRef: [
    {
      required: true,
      message: "Please Select Your ID",
      trigger: "blur"
    }
  ],
  idNumberRef: [
    {
      required: true,
      message: "Please enter your ID Number",
      trigger: "blur"
    }
  ],
  smsCodeRef: [
    {
      required: true,
      message: "Please enter your SMS verification code",
      trigger: "blur"
    }
  ]
};

const telephoneVerifyCaptchaFormRules = {
  telephoneVerifyCaptchaCode: [
    {
      required: true,
      message: "Verification code is required",
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

function convert2File(imgUrl) {
  let bytes = window.atob(imgUrl.split(",")[1]);
  let arrayBuffer = new ArrayBuffer(bytes.length);
  let intArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < bytes.length; i++) {
    intArray[i] = bytes.charCodeAt(i);
  }
  let blob = new Blob([intArray], { type: "image/png" });
  console.log("b2: ", blob);
  let fileName = "1.png";
  let files = new window.File([blob], fileName, { type: "image/png" });
  console.log("files ", files);
  return files;
}

const cropSuccessID = (imgDataUrl) => {
  fieldValue.idPhoto = imgDataUrl;
};

const cropUploadSuccessID = (jsonData, field) => {
  console.log("field: " + field);
};

const cropUploadFailID = (status, field) => {
  console.log("field: " + field);
};

const cropSuccessHoldingID = (imgDataUrl) => {
  fieldValue.holdingIDPhoto = imgDataUrl;
};

const cropUploadSuccessHoldingID = (jsonData, field) => {
  console.log("field: " + field);
};

const cropUploadFailHoldingID = (status, field) => {
  console.log("field: " + field);
};
</script>

<style lang="scss">
.field-title {
  margin: 5px 0;
}

.field-input {
  width: 280px;
}

.field-group {
  display: flex;
  gap: 15px;
}

.id-type-field {
  display: flex;
  gap: 100px;

  .right-container {
    display: flex;
    gap: 100px;

    .upload-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      cursor: pointer;

      span {
        color: rgba($color: #000000, $alpha: 0.4);
      }
    }
  }
}

.separator {
  margin: 25px 0;
}

.get-ver-code-btn {
  width: 175px;
  height: 45px;
  color: white;
  background: #2760e0;
  padding: 0;
}

.button-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  margin: 75px 0;
  width: 300px;

  .cancel-btn {
    background: transparent;
    border: 1px solid #d1d5db;
    color: #8e8e8e;
  }

  .submit-btn {
    background: #15c646;
    border: 1px solid transparent;
    color: white;
  }
}

.ant-form-item-control-input-content {
  &:has(.verification) {
    .ant-input-affix-wrapper > input.ant-input {
      padding: 5px;
      border-radius: 0px;
    }
  }
}
</style>
