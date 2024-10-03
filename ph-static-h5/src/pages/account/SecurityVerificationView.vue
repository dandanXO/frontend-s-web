<template>
  <!-- <Teleport to="body">
    <div ref="cameraContainer" class="camera-container">
      <Camera
        ref="camera"
        :resolution="{ width: 375, height: 812 }"
        :autoplay="false"
        :playsinline="false"
      >
        <div class="camera-btn-container">
          <button class="camera-btn" @click="closeCamera">Back</button>
          <button class="camera-btn" @click="snapshot">Snapshot</button>
        </div>
      </Camera>
    </div>
  </Teleport> -->

  <ImageCropUpload
    field="img"
    lang-type="en"
    @crop-success="cropSuccess"
    @crop-upload-success="cropUploadSuccess"
    @crop-upload-fail="cropUploadFail"
    v-model="isShowUploadUI.idPhoto"
    img-format="png"
  ></ImageCropUpload>

  <ImageCropUpload
    field="img"
    lang-type="en"
    @crop-success="cropSuccess"
    @crop-upload-success="cropUploadSuccess"
    @crop-upload-fail="cropUploadFail"
    v-model="isShowUploadUI.holdingIDPhoto"
    img-format="png"
  ></ImageCropUpload>

  <div class="q-pa-md security-verification-page-form">
    <!--    <div class="text-h5 q-my-sm">Security Verification</div>-->

    <div class="field-container">
      <div class="id-type-field">
        <div class="text-h6">Submit Your Valid ID</div>

        <div class="q-my-sm">ID Type</div>
        <q-select
          class="q-mb-md"
          rounded
          outlined
          color="light-blue-4"
          label="Please select the type of ID"
          label-color="grey"
          name="idType"
          ref="idTypeRef"
          v-model="fieldValue.idType"
          :options="idType"
          :option-value="fieldValue.idType"
          :rules="verifyIDType"
        />

        <div class="q-my-sm">ID Number</div>

        <q-input
          rounded
          outlined
          color="white"
          padding="none"
          ref="idNumberRef"
          placeholder="Please enter ID number"
          name="idNumber"
          v-model="fieldValue.idNumber"
          :rules="verifyIDNumber"
        />

        <div class="q-my-lg">
          <div class="upload-container q-mb-md">
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

      <div class="sms-verification-field">
        <div class="text-h6 q-my-md">SMS Verification</div>
        <button class="get-ver-code-btn q-my-md submit-btn" @click="openTelephoneVerificationModal">
          Get SMS OTP Code
        </button>

        <q-dialog v-model="isTelephoneVerificationModalVisible" transition-show="slide-up" transition-hide="slide-down">
          <q-card class="q-gutter-y-md rounded-borders q-pa-md">
            <q-input
              autocomplete="off"
              ref="telephoneVerifyCaptchaCodeRef"
              type="text"
              v-model="fieldValue.telephoneVerifyCaptchaCode"
              label="Verification Code"
              lazy-rules
              :rules="[(val) => (val && val.length > 3) || 'Please enter the verification code']"
              outlined
            >
              <template v-slot:append>
                <img
                  :src="telephoneVerificationCaptchaImg"
                  @click="getTelephoneVerificationImgCode"
                  class="cursor-pointer"
                />
              </template>
              <template v-slot:prepend>
                <q-icon name="security" />
              </template>
            </q-input>

            <div class="row justify-between items-center">
              <q-btn @click="getOtpCode" label="Confirm" type="button" color="brand" />
            </div>
          </q-card>
        </q-dialog>

        <q-input
          rounded
          outlined
          color="white"
          padding="none"
          ref="idSmsCodeRef"
          placeholder="Please enter your SMS OTP Code"
          name="verificationCode"
          v-model="fieldValue.otpCode"
          :rules="verifyVerificationCode"
        />
      </div>
    </div>

    <div class="button-container q-my-md">
      <button class="common-btn cancel-btn submit-btn outlined" @click="backToPersonalPage">Cancel</button>
      <button class="common-btn submit-btn" @click="submit">Submit</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import ImageCropUpload from "vue-image-crop-upload";
import { Platform, useQuasar } from "quasar";
import { verifyID } from "src/api/personal/personal";
import { api } from "boot/axios";
import qs from "qs";
import { userStore } from "src/stores";
// import Camera from "simple-vue-camera";
import { getCodeDetail } from "src/utils/helper";

const $q = useQuasar();
const router = useRouter();

const store = userStore();

const idSmsCodeRef = ref();
const idNumberRef = ref();
const idTypeRef = ref();

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
  idType: "",
  idNumber: "",
  verificationCode: "",
  idPhoto: "",
  holdingIDPhoto: "",
  otpCode: "",
  otpCodeId: "",
  telephoneVerifyCaptchaCode: "",
  telephoneVerificationCaptchaCodeId: ""
});

let targetKey = "";

// camera
const cameraContainer = ref();
const camera = ref();
const snapshot = async () => {
  const blob = await camera.value.snapshot();

  /**
   * NOTE:
   * better to create extra button to preview as modal
   * cuz image might not fit the mock up
   */
  closeCamera();
  fieldValue[targetKey] = URL.createObjectURL(blob);
};

const closeCamera = () => {
  camera.value.stop();
  cameraContainer.value.style.display = "none";
};

// upload photo
const isShowUploadUI = reactive({
  idPhoto: false,
  holdingIDPhoto: false
});

const uploadID = () => {
  //   camera.value.start();
  //   cameraContainer.value.style.display = "block";

  targetKey = "idPhoto";
  isShowUploadUI.idPhoto = true;
};

function convert2File(imgUrl) {
  let bytes = atob(imgUrl.split(",")[1]);
  let arrayBuffer = new ArrayBuffer(bytes.length);
  let intArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < bytes.length; i++) {
    intArray[i] = bytes.charCodeAt(i);
  }
  let blob = new Blob([intArray], { type: "image/png" });
  console.log("b2: ", blob);
  let fileName = "1.png";
  let files = new File([blob], fileName, { type: "image/png" });
  console.log("files ", files);
  return files;
}

function convert2Blob(imgUrl) {
  let bytes = atob(imgUrl.split(",")[1]);
  let arrayBuffer = new ArrayBuffer(bytes.length);
  let intArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < bytes.length; i++) {
    intArray[i] = bytes.charCodeAt(i);
  }
  let blob = new Blob([intArray], { type: "image/png" });
  console.log("blob: ", blob);
  return blob;
}

const isOtpSending = ref(false);
const telephoneVerifyCaptchaCodeRef = ref();
const telephoneVerificationCaptchaImg = ref("");
const isTelephoneVerificationModalVisible = ref(false);
const openTelephoneVerificationModal = () => {
  getTelephoneVerificationImgCode();
  isTelephoneVerificationModalVisible.value = true;
};
const getTelephoneVerificationImgCode = async () => {
  fieldValue.telephoneVerifyCaptchaCode = "";
  const json = await getCodeDetail();

  if (json.isOk) {
    telephoneVerificationCaptchaImg.value = json.verificationImg;
    fieldValue.telephoneVerificationCaptchaCodeId = json.codeId;
  } else {
    $q.notify({
      color: "negative",
      position: "top",
      message: json.message,
      icon: "report_problem"
    });
  }
};
const getOtpCode = () => {
  const isTelephoneVerifyCaptchaCodeValid = telephoneVerifyCaptchaCodeRef.value.validate();

  if (!isTelephoneVerifyCaptchaCodeValid) {
    return;
  }

  isOtpSending.value = true;

  const captchaDetails = {
    codeId: fieldValue.telephoneVerificationCaptchaCodeId,
    captchaCode: fieldValue.telephoneVerifyCaptchaCode
  };

  api
    .post("/session/sendSms", qs.stringify(captchaDetails))
    .then((res) => {
      if (res.code === 0) {
        fieldValue.otpCodeId = res.data.codeId;
        fieldValue.otpCode = "";

        isOtpSending.value = false;

        $q.notify({
          color: "positive",
          position: "top",
          message: "OTP Sent",
          icon: "check_circle_outline"
        });

        isTelephoneVerificationModalVisible.value = false;
      }
    })
    .catch((e) => {
      console.log(e.message);
      isOtpSending.value = false;
      getTelephoneVerificationImgCode();
    });
};
const uploadHoldingID = () => {
  //   camera.value.start();
  //   cameraContainer.value.style.display = "block";

  targetKey = "holdingIDPhoto";
  isShowUploadUI.holdingIDPhoto = true;
};

const cropSuccess = (imgDataUrl) => {
  fieldValue[targetKey] = imgDataUrl;
};

const cropUploadSuccess = (jsonData, field) => {
  console.log("field: " + field);
};

const cropUploadFail = (status, field) => {
  console.log("field: " + field);
};

// select id type
const verifyIDType = ref([(val) => !!val || "Please select the type of ID"]);
const verifyIDNumber = ref([(val) => !!val || "Please enter ID number"]);
const verifyVerificationCode = ref([(val) => !!val || "Please enter your Verification Code"]);

// main function

const backToPersonalPage = () => {
  router.push("/account/personal");
};

const submit = () => {
  idTypeRef.value.validate();
  idNumberRef.value.validate();
  idSmsCodeRef.value.validate();

  if (idTypeRef.value.hasError || idNumberRef.value.hasError || idSmsCodeRef.value.hasError) {
    window.scrollTo(0, 0);
    return;
  }

  if (!fieldValue.otpCodeId) {
    $q.notify({
      type: "negative",
      position: "top",
      message: `SMS Code ID is empty.`,
      icon: "report_problem"
    });
    return;
  }

  if (!fieldValue.idPhoto || !fieldValue.holdingIDPhoto) {
    $q.notify({
      type: "negative",
      position: "top",
      message: `Please submit your ID Photo and Holding Id photo.`,
      icon: "report_problem"
    });
    return;
  }
  const success = true;
  if (success) {
    // fieldValue.idPhoto = convert2File(fieldValue.idPhoto);
    // fieldValue.holdingIDPhoto = convert2File(fieldValue.holdingIDPhoto);
    // console.log("fieldValue.idPhoto : " + fieldValue.idPhoto);
    var formData = new FormData();
    console.log("1");
    formData.append("idType", fieldValue.idType);
    formData.append("idNumber", fieldValue.idNumber);
    console.log("2");
    formData.append("otpCode", fieldValue.otpCode);
    formData.append("otpCodeId", fieldValue.otpCodeId);
    console.log("3");
    if (Platform.is.android && Platform.is.capacitor) {
      console.log("And App");
      formData.append("idPhoto", convert2Blob(fieldValue.idPhoto), "1.jpg");
      formData.append("holdingIDPhoto", convert2Blob(fieldValue.holdingIDPhoto), "2.jpg");
    } else {
      formData.append("idPhoto", convert2File(fieldValue.idPhoto), "1.jpg");
      formData.append("holdingIDPhoto", convert2File(fieldValue.holdingIDPhoto), "2.jpg");
    }

    console.log("4");
    verifyID(formData, store.token).then((resp) => {
      console.log(resp);
      if (resp.data.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "Success",
          icon: "check_circle_outline"
        });
        backToPersonalPage();
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: resp.data.message,
          icon: "report_problem"
        });
      }
    });
  } else {
    $q.notify({
      color: "negative",
      position: "top",
      message: "Failed",
      icon: "report_problem"
    });
  }
};
</script>

<style lang="scss">
.body--dark {
  .vue-image-crop-upload .vicp-wrap {
    background: #23263c;
  }
}

.id-type-field {
  .upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;

    span {
      color: rgba($color: #000000, $alpha: 0.4);
    }
  }
}

.get-ver-code-btn {
  width: 100%;
  height: 50px;
  color: white;
  background: #2760e0;
  padding: 0;
  border-radius: 6px;
  border: 0;
}

.button-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

// image crop upload
.vicp-img {
  max-width: unset !important;
}

.vicp-wrap {
  width: 100% !important;
  max-width: 400px;
  height: auto !important;
  max-height: 450px;
  border-radius: 5px !important;
}

.vicp-step2 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.vicp-crop {
  margin-left: auto;
  margin-right: auto;
}

.vicp-crop-left {
  display: block !important;
  float: none !important;
}

.vicp-crop-right {
  display: block !important;
  float: none !important;
}

.vicp-preview {
  height: auto !important;
  display: flex;
  justify-content: center;
}

.vicp-preview-item {
  display: inline-block;
}

.vicp-close {
  right: 5px !important;
}

// camera
#camera-container {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.camera-container {
  display: none;
  position: absolute;
  z-index: 2001;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  .camera-btn-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;

    .camera-btn {
      display: inline-block;
      align-self: flex-end;
      margin: 0 0 100px 0;
    }
  }
}
</style>
