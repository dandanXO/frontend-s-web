<template>
  <div class="popout-dialog-container popout-dark">
    <template v-if="isShowForm">
      <div class="txt-title">{{ $t("form.kycIdentifyVerification") }}</div>
      <div class="kyc-verify">
        <div class="kyc-verify-title">{{ $t("form.verifyProcess") }}</div>
        <div class="kyc-verify-item q-gutter-y-sm">
          <div>{{ $t("form.kycPara_01") }}</div>
          <div class="row no-wrap">
            <div>{{ $t("form.kycPara_02") }}</div>
            <div><img src="../assets/images/account/kyc-item.png" /></div>
          </div>
        </div>
        <div class="btn-submit" @click="isShowForm = true">{{ $t("btn.startNow") }}</div>
      </div>
    </template>
    <template v-else>
      <div class="txt-title">{{ $t("form.details") }}</div>
      <div class="pc-form">
        <div class="pc-form-item">
          <div class="pc-form-input">
            <q-select
              v-model="formDetail.docType"
              :options="selectDocType"
              option-value="valType"
              option-label="name"
              emit-value
              map-options
              filled
              label="ID Type"
              color="white"
            >
              <template v-slot:prepend>
                <img src="../assets/images/account/kyc-icon-person.png" />
              </template>
            </q-select>
          </div>
        </div>
        <div class="pc-form-item">
          <div class="pc-form-input">
            <q-input
              filled
              dense
              clearable
              :placeholder="`ID Number`"
              v-model="formDetail.taxId"
              :rules="[(_) => isValidTaxId()]"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <img src="../assets/images/account/kyc-icon-id.png" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="pc-form-item">
          <div class="pc-form-input">
            <q-input
              filled
              dense
              clearable
              :placeholder="`Email`"
              v-model="formDetail.email"
              :rules="[(_) => isValidEmail()]"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <img src="../assets/images/account/kyc-icon-email.png" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="pc-form-item">
          <div class="pc-form-input">
            <q-input
              filled
              dense
              clearable
              :placeholder="`Full Name`"
              v-model="formDetail.realName"
              :rules="[(_) => isValidName()]"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <img src="../assets/images/account/kyc-icon-person.png" />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <q-btn
        :loading="btnLoading"
        rounded
        flat
        no-caps
        class="btn-submit"
        :disable="!(isValidName() === true && isValidTaxId() === true && isValidEmail() === true)"
        @click="submitKYCNewUser"
      >
        {{ $t("btn.submit") }}
      </q-btn>
    </template>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { api } from "@/boot/axios";
import { t } from "@/boot/lang";
import { userStore } from "@/stores";

const emits = defineEmits(["test"]);

const qs = require("qs");
const $q = useQuasar();
const store = userStore();
const router = useRouter();

const btnLoading = ref(false);

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

const isValidTaxId = () => {
  const { docType, taxId } = formDetail;
  const patterns = {
    CC: /^\d{6,10}$/, // CC requires 6-10 digits
    NIT: /^\d{9}$/ // NIT requires exactly 9 digits
  };
  const pattern = patterns[docType];

  const result = !taxId
    ? t("form.taxId_rules_01") // Replace with appropriate translation key
    : !pattern
    ? t("form.taxId_rules_02") // Handle unsupported docType
    : !pattern.test(taxId)
    ? t("form.taxId_rules_03") // Replace with appropriate translation key
    : true;

  return result;
};

const isValidEmail = () => {
  const { email } = formDetail;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const result = !email ? t("form.email_rules_01") : !emailPattern.test(email) ? t("form.email_rules_02") : true;

  return result;
};

const isValidPhone = () => {
  const { phone } = formDetail;

  if (!phone) {
    return "Please Enter Phone Number";
  }

  const phoneRegex = /^\d{10}$/;
  const isValid = phoneRegex.test(phone);

  return isValid ? true : "Phone Number must be 10 digits";
};

const isAlphanumeric = (value, translation) => {
  const passwordPattern = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]+$/i;
  return passwordPattern.test(value) || `${translation} must be alphanumeric`;
};

const formDetail = reactive([]);

const submitKYCNewUser = () => {
  btnLoading.value = true;
  updateNewUserState();
};

const updateNewUserState = () => {
  const updateInfo = {};
  updateInfo.docType = formDetail.docType;
  updateInfo.taxId = formDetail.taxId;
  updateInfo.email = formDetail.email;
  updateInfo.realName = formDetail.realName;

  api
    .post("/session/account", qs.stringify(updateInfo))
    .then((r) => {
      if (r.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: t("notify.updatedSuccessfully"),
          icon: "check_circle_outline"
        });
        emits("closeUserKYCDialog");
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

const isShowForm = ref(false);

const selectDocType = ref([]);

onMounted(() => {
  selectDocType.value = [
    {
      valType: "CC",
      name: "Identity Document"
    },
    {
      valType: "NIT",
      name: "Tax ID Number in Colombia"
    }
  ];
});
</script>

<style lang="scss" scoped>
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
    gap: 5px;
    margin-bottom: 12px;
  }
  .pc-form-label {
    color: rgba(255, 255, 255, 1);
  }
  .pc-form-input {
    border-radius: 5px;
    position: relative;

    :deep(.q-field__control) {
      background: rgba(255, 255, 255, 0.15) !important;
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
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  font-weight: 700;
  width: 100%;
  height: 48px;
  transition: 0.3s all;
  // background-image: url(../assets/images/account/btn-purple-pattern.png);
  color: #ffffff;
  margin: auto;
  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }
}

.pc-tip-chg-pwd {
  color: #fae576;
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
  background: rgba(21, 0, 37, 0.7);
  border-radius: 8px;
  font-weight: 700;
  margin-top: auto;

  :deep(.q-icon) {
    color: #fed87d;
  }
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

.style-btn-confirm {
  color: #4a38b9;
  border-radius: 8px;
  background: linear-gradient(188deg, rgba(255, 255, 255, 0.8) 5.77%, #8eb5ff 93.57%);
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  margin-top: 16px;
}

.kyc-verify {
  // display: flex;
  // justify-content: flex-start;
  width: 100%;
  margin-top: 16px;

  .kyc-verify-title {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.3);
  }

  .kyc-verify-item {
    background: #282930;
    padding: 6px 12px 12px;
    margin-top: 6px;
    border-radius: 4px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 16px;
  }
}

.btn-submit {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  line-height: 1;
  font-weight: 600;
  height: 46px;
  transition: 0.3s all;
  color: #ffffff;
  margin: auto;
  border-radius: 6px;
  background: #5c46e7;
  width: 100%;
  aspect-ratio: 335/46;

  &:before {
    box-shadow: none;
  }

  &.disabled {
    opacity: 0.7;
  }
}
</style>
