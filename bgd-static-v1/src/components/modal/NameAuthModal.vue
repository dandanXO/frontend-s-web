<template>
  <div class="name-auth-modal">
    <img class="close-icon" src="../../assets/images/index/name-auth/dialog-close-icon.png" @click="closeDialog" />
    <div class="name-auth-title">{{ $t("nameAuth.title") }}</div>
    <div v-if="step === 0" class="name-auth-step step-loading">
      <div class="name-auth-step-content"></div>
      <div class="additional-info-loading"></div>
    </div>
    <div v-if="step === 1" class="name-auth-step step-1">
      <div class="name-auth-step-content">
        <div class="name-auth-subtitle">{{ $t("nameAuth.basicExperience") }}</div>
        <div class="step-1-content">
          <div>
            <div class="basic-exp-item">
              <img src="../../assets/images/index/name-auth/edit-icon.png" />
              <span>{{ $t("nameAuth.humanResources") }}</span>
            </div>
            <div class="basic-exp-item">
              <img src="../../assets/images/index/name-auth/face-verification-icon.png" />
              <span>{{ $t("nameAuth.faceVerification") }}</span>
            </div>
            <div class="basic-exp-item">
              <img src="../../assets/images/index/name-auth/identity-id-icon.png" />
              <span>{{ $t("nameAuth.identityId") }}</span>
            </div>
          </div>
          <q-btn no-caps unelevated class="green-btn" @click="step = 2">{{ $t("btn.startNow") }}</q-btn>
          <div class="browsing-time-txt">{{ $t("nameAuth.browsingTime") }}</div>
        </div>
      </div>
      <div class="additional-info">
        {{ $t("nameAuth.additionalInfo") }}
      </div>
    </div>
    <div v-if="step === 2" class="name-auth-step step-2">
      <div class="name-auth-step-content">
        <div class="stepper">
          <div class="stepper-item active"></div>
          <div class="stepper-item"></div>
        </div>
        <div class="name-auth-subtitle">{{ $t("nameAuth.beReadyUploadIdCard") }}</div>

        <div class="country-region-selection">
          <div class="form-label">{{ $t("nameAuth.issuingCountryRegion") }}</div>
        </div>
        <q-select
          class="country-region-select"
          standout
          v-model="selectedCountryRegion"
          :options="countryRegion"
          option-label="label"
          option-value="value"
          emit-value
          map-options
        ></q-select>

        <div class="doc-type-selection">
          <div class="form-label">{{ $t("nameAuth.documentType") }}</div>
          <q-radio
            v-for="(option, index) in docType"
            class="doc-type-radio"
            v-model="selectedDocType"
            :key="index"
            :val="option.value"
            :label="option.label"
          />
        </div>
      </div>
      <q-btn
        no-caps
        unelevated
        class="green-btn"
        :class="{ disabled: !selectedCountryRegion || !selectedDocType }"
        @click="step = 3"
      >
        {{ $t("btn.continue") }}
      </q-btn>
    </div>
    <div v-if="step === 3" class="name-auth-step step-3">
      <div class="name-auth-step-content">
        <div class="stepper-container">
          <img
            v-if="uploadStatus === 'NOT_EXIST' || uploadStatus === 'FAILED'"
            src="../../assets/images/index/name-auth/step-back-icon.png"
            @click="step = 2"
          />
          <div class="stepper">
            <div class="stepper-item"></div>
            <div class="stepper-item active"></div>
          </div>
        </div>

        <div class="name-auth-subtitle">{{ $t("nameAuth.getReadyUploadIdCard") }}</div>
        <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileChange" />
        <div v-if="uploadStatus === 'NOT_EXIST'" class="name-auth-upload-container upload" @click="handleUploadDoc">
          <img src="../../assets/images/index/name-auth/upload-doc.png" />
          <span>{{ $t("nameAuth.uploadDoc") }}</span>
        </div>
        <div v-else-if="uploadStatus === 'FAILED'" class="name-auth-upload-container upload-fail">
          <img src="../../assets/images/index/name-auth/upload-fail.png" />
          <span>{{ $t("nameAuth.uploadFailed") }}</span>
          <q-btn no-caps unelevated class="green-btn" @click="handleUploadDoc">{{ $t("btn.uploadAgain") }}</q-btn>
        </div>
        <div v-else-if="uploadStatus === 'SUCCESS'" class="name-auth-upload-container upload">
          <img src="../../assets/images/index/name-auth/upload-success.png" />
          <span>{{ $t("nameAuth.uploadSuccessful") }}</span>
        </div>
        <div v-else class="name-auth-upload-container upload-pending-auth">
          <img src="../../assets/images/index/name-auth/upload-pending-auth.png" />
          <span>{{ $t("nameAuth.uploaded") }}</span>
          <span>{{ $t("nameAuth.pendingAuth") }}</span>
        </div>
        <div class="edit-id-container">
          <div>{{ docType.find((doc) => doc.value === selectedDocType)?.label ?? "" }}</div>
          <!-- <img src="../../assets/images/index/name-auth/edit-icon.png" /> -->
        </div>
      </div>
      <div>
        <div class="hint-txt">{{ $t("nameAuth.hint") }}</div>
        <div class="hint-content">
          <div class="hint-content-item">
            <img src="../../assets/images/index/name-auth/tick-icon.png" />
            <span>{{ $t("nameAuth.hint_txt_1") }}</span>
          </div>
          <div class="hint-content-item">
            <img src="../../assets/images/index/name-auth/tick-icon.png" />
            <span>{{ $t("nameAuth.hint_txt_2") }}</span>
          </div>
          <div class="hint-content-item">
            <img src="../../assets/images/index/name-auth/cross-icon.png" />
            <span>{{ $t("nameAuth.hint_txt_3") }}</span>
          </div>
        </div>
      </div>
      <div class="check-guide-txt">{{ $t("nameAuth.checkGuide") }}</div>
    </div>
  </div>
  <q-dialog v-model="cropDialogVisible" persistent class="crop-id-dialog">
    <q-card class="crop-id-dialog-card">
      <q-btn class="close-btn" dense flat icon="close" v-close-popup />

      <cropper
        v-if="imageSrc"
        background-class="cropper-background"
        ref="cropperRef"
        class="cropper"
        :src="
          imageSrc
            ? imageSrc
            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH_pqa6TIV5oR8BeTCCNhAbkqIrri2Xi8qbMusW_ulvA&s'
        "
        @change="cropperChange"
      />

      <q-btn :loading="isLoadingUpload" no-caps unelevated class="green-btn crop-btn" @click="submit">
        {{ $t("btn.submit") }}
      </q-btn>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, defineEmits, onMounted } from "vue";
import { userStore } from "src/stores";
import { t } from "src/boot/lang";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import "vue-advanced-cropper/dist/theme.compact.css";
import { api } from "boot/axios";
import { getRndInteger } from "boot/utils";

const store = userStore();
const emit = defineEmits(["closeDialog"]);

const step = ref(0);
const selectedCountryRegion = ref("");
const selectedDocType = ref("PASSPORT");
const uploadStatus = ref("NOT_EXIST");
const cropDialogVisible = ref(false);

const fileInput = ref(null);
const imageSrc = ref("");

const countryRegion = ref([]);

const docType = [
  { label: t("nameAuth.passport"), value: "PASSPORT" },
  { label: t("nameAuth.ic"), value: "IC" },
  { label: t("nameAuth.drivingLicense"), value: "DRIVING_LICENSE" }
];

const handleUploadDoc = () => {
  if (fileInput.value) {
    fileInput.value.value = null;
    fileInput.value.click();
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageSrc.value = URL.createObjectURL(file);
    cropDialogVisible.value = true;
  }
};

const cropperRef = ref(null);
const croppedImg = ref(null);
const isLoadingUpload = ref(false);

const getImageFromCropper = () => {
  if (cropperRef.value) {
    const { coordinates, canvas } = cropperRef.value.getResult();
    croppedImg.value = canvas.toDataURL("image/jpeg", 0.6);
  }
};

const cropperChange = () => {
  getImageFromCropper();
};

const submit = async () => {
  isLoadingUpload.value = true;
  if (croppedImg.value) {
    const file = await attachPhoto(croppedImg.value);

    if (file) {
      var formData = new FormData();
      formData.append("country", selectedCountryRegion.value);
      formData.append("idType", selectedDocType.value);
      formData.append("idPhoto", file);

      const rstArray = Object.values(process.env.RST_API);
      const rstApi = rstArray[getRndInteger(0, rstArray.length)];

      try {
        const response = await fetch(`${rstApi}/session/idVerify`, {
          method: "POST",
          body: formData,
          headers: {
            authorization: "BGD",
            token: `${store.token}`
          }
        });
        const data = await response.json();
        if (data.code === 0) {
          getIdVerifyStatus();
        } else {
          $q.notify({
            type: "negative",
            position: "top",
            message: `${selectedDocType.value} ${t("notify.uploadFailedPleaseTryAgain")}`,
            icon: "report_problem"
          });
        }
      } catch (e) {
      } finally {
        isLoadingUpload.value = false;
        cropDialogVisible.value = false;
      }
    }
  }
};

function isBase64(str) {
  const base64Regex = /^(data:image\/\w+;base64,)?([A-Za-z0-9+/]+={0,2})(\s|$)/;
  return base64Regex.test(str);
}

async function attachPhoto(fileImg) {
  var file = null;
  if (typeof fileImg === "string" && isBase64(fileImg)) {
    // Extract the MIME type from the base64 string
    const mimeType = fileImg.split(";")[0].split(":")[1];
    var data = fileImg.replace(/^data:image\/\w+;base64,/, "");
    // Decode the Base64 string
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    // Convert to an ArrayBuffer
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the ArrayBuffer
    const blob = new Blob([byteArray], { type: mimeType });

    // Create a File object from the Blob
    file = new File([blob], "image." + mimeType.split("/")[1], { type: mimeType });
  } else {
    file = fileImg;
  }
  // Use the File object for further processing
  const allowFileTypes = ["image/jpeg", "image/png", "image/gif"];

  if (!file || !allowFileTypes.includes(file.type)) {
    $q.notify({
      type: "negative",
      position: "top",
      message: `${t("notify.imageFormatError")}`,
      icon: "report_problem"
    });

    isLoadingUpload.value = false;
    return null;
  }
  if (file && file.size > 1000000) {
    $q.notify({
      type: "negative",
      position: "top",
      message: `${t("notify.uploadImageLargerThan1MbError")}`,
      icon: "report_problem"
    });
    isLoadingUpload.value = false;
    return null;
  }

  return file;
}

const closeDialog = () => {
  emit("closeDialog");
};

const getIdVerifyStatus = () => {
  step.value = 0;
  api
    .get("/session/idVerifyStatus")
    .then((res) => {
      if (res.code === 0) {
        uploadStatus.value = res.data.status;
        if (uploadStatus.value !== "NOT_EXIST") {
          step.value = 3;
        } else {
          step.value = 1;
        }
        countryRegion.value = res.data.countryList.map((country) => ({
          label: country,
          value: country
        }))

        selectedCountryRegion.value= countryRegion.value[0].value;
      }
    })
    .catch(() => {});
};
onMounted(() => {
  getIdVerifyStatus();
});
</script>
<style scoped lang="scss">
.name-auth-modal {
  width: 100%;
  max-width: 400px;
  background-color: #1e371f;
  border: 1px solid #337e3a;
  border-radius: 10px;
  padding: 30px 20px;
  font-family: Inter;
  text-align: center;
  margin: 14px;
  position: relative;

  .close-icon {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 14px;
    right: 14px;
  }
  .name-auth-title {
    font-weight: 700;
    font-size: 18px;
    text-align: center;
    padding-bottom: 24px;
    font-family: Poppins;
  }
  .name-auth-subtitle {
    font-size: 14px;
    text-align: center;
  }
  .form-label {
    font-size: 14px;
    opacity: 60%;
    text-align: start;
    margin-bottom: 8px;
  }

  .name-auth-step-content {
    background-color: #81ff9e1a;
    border-radius: 4px;
    padding: 14px;
  }

  .stepper-container {
    display: flex;
    width: 100%;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;
    img {
      height: 10px;
      width: 6px;
      cursor: pointer;
    }
    .stepper {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  .stepper {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    padding: 0 40px;
    margin-top: 10px;
    margin-bottom: 20px;
    .stepper-item {
      height: 4px;
      background-color: #bfffb3;
      opacity: 0.2;
      border-radius: 4px;
      &.active {
        opacity: 1;
        background-color: #00d24d;
      }
    }
  }

  .step-loading {
    .name-auth-step-content,
    .additional-info-loading {
      position: relative;
      overflow: hidden;
    }

    .name-auth-step-content {
      background-color: #81ff9e1a;
      height: 200px;
      border-radius: 4px;
    }

    .additional-info-loading {
      background-color: #81ff9e1a;
      height: 64px;
      padding: 10px;
      border-radius: 4px;
      font-size: 10px;
      margin-top: 10px;
    }

    /* Add shimmer effect */
    .name-auth-step-content::before,
    .additional-info-loading::before {
      content: "";
      position: absolute;
      top: 0;
      left: -150%;
      width: 200%;
      height: 100%;
      background: linear-gradient(
        to right,
        rgba(74, 145, 90, 0.05) 0%,
        rgba(74, 145, 90, 0.25) 50%,
        rgba(74, 145, 90, 0.05) 100%
      );

      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% {
        left: -150%;
      }
      100% {
        left: 150%;
      }
    }
  }

  .step-1 {
    .step-1-content {
      padding-top: 14px;
      .basic-exp-item {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        opacity: 0.8;
        img {
          margin-right: 4px;
          width: 20px;
          height: 20px;
        }
        span {
          font-size: 12px;
        }
      }
      .browsing-time-txt {
        margin-top: 14px;
        font-size: 12px;
        opacity: 0.8;
      }
    }
    .additional-info {
      background-color: #ff990047;
      color: #ffae00;
      padding: 10px;
      border-radius: 4px;
      font-size: 10px;
      margin-top: 10px;
    }
  }

  .step-2 {
    .country-region-selection {
      margin-top: 16px;
      .country-region-select .q-field__control {
        height: 20px;
      }

      .q-field--standout.q-field--highlighted .q-field__native {
        color: #fff !important;
      }
      .q-field--standout.q-field--dark .q-field__control,
      .q-field--standout.q-field--dark .q-field__control:before,
      .q-field--standout.q-field--dark.q-field--highlighted .q-field__control {
        background: #94ffad1a !important;
      }
    }
    .doc-type-selection {
      margin-top: 16px;
      .doc-type-radio {
        flex-direction: row-reverse;
        width: 100%;
        justify-content: space-between;
        background-color: #94ffad1a;
        margin-bottom: 10px;
        border-radius: 8px;
        padding: 4px 2px 4px 14px;
      }
    }
  }

  .step-3 {
    .hint-txt {
      text-align: start;
      font-weight: 700;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .hint-content {
      display: flex;
      flex-direction: column;
      align-items: start;
      .hint-content-item {
        display: flex;
        justify-content: center;
        margin-bottom: 8px;
        img {
          width: 16px;
          height: 16px;
          margin-right: 6px;
        }
        span {
          font-size: 12px;
          opacity: 0.8;
        }
      }
    }
    .check-guide-txt {
      margin-top: 20px;
      opacity: 0.8;
    }
    .name-auth-upload-container {
      width: 100%;
      padding: 36px;
      background-color: #0000004c;
      border-radius: 10px;
      margin-top: 20px;
      color: #00ff37;
      display: grid;
      justify-items: center;
      img {
        width: 48px;
        height: 48px;
        margin-bottom: 8px;
      }
    }
    .upload {
      cursor: pointer;
    }
    .upload-fail {
      color: #ff0000;
      .q-btn {
        height: 20px;
        width: auto;
        font-size: 10px;
        margin-top: 8px;
        border-radius: 4px;
      }
    }
    .upload-pending-auth {
      color: #ffbb00;
    }
    .edit-id-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 14px;
      img {
        width: 20px;
        height: 20px;
        margin-left: 8px;
      }
    }
  }
}

.crop-id-dialog-card {
  padding: 40px 20px;
  padding-top: 60px;
  position: relative;
  text-align: center;
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .crop-btn {
    width: auto;
    height: 20px;
    margin-top: 20px;
  }
}
.cropper {
  height: 360px;
  width: 360px;
  border-radius: 10px;
}
.vue-preview__wrapper {
  border-radius: 20px;
}
.vue-bounding-box {
  border-radius: 50%;
}

.green-btn {
  background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  color: #131313;
  font-weight: 700;
  width: 100%;
  height: 48px;
  margin-top: 30px;
  &.disabled {
    background: linear-gradient(90deg, rgba(36, 238, 137, 0.156) 0%, rgba(36, 238, 137, 0.078) 100%);
    color: #fff;
    font-weight: 700;
    width: 100%;
    height: 48px;
    margin-top: 16px;
    pointer-events: none;
  }
}
</style>
