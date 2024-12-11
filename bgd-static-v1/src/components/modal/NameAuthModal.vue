<template>
  <div class="name-auth-modal">
    <img class="close-icon" src="../../assets/images/index/name-auth/dialog-close-icon.png" @click="closeDialog" />
    <div class="name-auth-title">{{ $t("nameAuth.title") }}</div>
    <div v-if="step === 0" class="name-auth-step step-1">
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
          <q-btn no-caps unelevated class="green-btn" @click="step = 1">{{ $t("btn.startNow") }}</q-btn>
          <div class="browsing-time-txt">{{ $t("nameAuth.browsingTime") }}</div>
        </div>
      </div>
      <div class="additional-info">
        {{ $t("nameAuth.additionalInfo") }}
      </div>
    </div>
    <div v-if="step === 1" class="name-auth-step step-2">
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
          v-model="languageVal"
          :options="countryRegion"
          option-label="label"
          option-value="value"
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
      <q-btn no-caps unelevated class="green-btn" @click="step = 2">{{ $t("btn.continue") }}</q-btn>
      <q-btn no-caps unelevated class="dark-green-btn">
        {{ $t("btn.continueUsingYourPhone") }}
      </q-btn>
    </div>
    <div v-if="step === 2" class="name-auth-step step-3">
      <div class="name-auth-step-content">
        <div class="stepper-container">
          <img src="../../assets/images/index/name-auth/step-back-icon.png" @click="step = 1" />
          <div class="stepper">
            <div class="stepper-item"></div>
            <div class="stepper-item active"></div>
          </div>
        </div>

        <div class="name-auth-subtitle">{{ $t("nameAuth.getReadyUploadIdCard") }}</div>
        <div class="edit-id-container">
          <div>{{ $t("nameAuth.idCard") }}</div>
          <img src="../../assets/images/index/name-auth/edit-icon.png" />
        </div>
      </div>
      <div>
        <div class="hint-txt">Hint</div>
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
</template>
<script setup>
import { ref, defineEmits } from "vue";
import { t } from "src/boot/lang";

const emit = defineEmits(["closeDialog"]);

const step = ref(0);
const languageVal = ref("");
const selectedDocType = ref("passport");

const countryRegion = [{ label: "Bangladesh", value: "bgd" }];
const docType = [
  { label: t("nameAuth.passport"), value: "passport" },
  { label: t("nameAuth.idCard"), value: "id" },
  { label: t("nameAuth.visa"), value: "visa" }
];

const closeDialog = () => {
  emit("closeDialog");
};
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
    top: 20px;
    right: 20px;
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

  .green-btn {
    background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
    color: #131313;
    font-weight: 700;
    width: 100%;
    height: 48px;
    margin-top: 30px;
  }

  .dark-green-btn {
    background: linear-gradient(90deg, rgba(36, 238, 137, 0.156) 0%, rgba(36, 238, 137, 0.078) 100%);
    color: #fff;
    font-weight: 700;
    width: 100%;
    height: 48px;
    margin-top: 16px;
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
          margin-right: 4px;
        }
        span {
          font-size: 12px;
          opacity: 0.8;
        }
      }
    }
    .check-guide-txt {
      margin-top: 20px;
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
</style>
