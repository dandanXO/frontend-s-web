<template>
  <div class="popout-dialog-container">
    <div class="txt-title">{{ $t("form.pleaseCompleteKYC") }}</div>
    <div class="pc-form">
      <div class="pc-form-item" v-if="isRealName">
        <div class="pc-form-label">{{ $t("form.firstName") }}</div>
        <div class="pc-form-input">
          <q-input
            outlined
            clearable
            :placeholder="$t('form.firstName_placeholder')"
            v-model="formDetail.firstName"
            :rules="[(_) => isValidFirstName()]"
          />
        </div>
      </div>

      <div class="pc-form-item" v-if="isRealName">
        <div class="pc-form-label">{{ $t("form.lastName") }}</div>
        <div class="pc-form-input">
          <q-input
            outlined
            clearable
            :placeholder="$t('form.lastName_placeholder')"
            v-model="formDetail.lastName"
            :rules="[(_) => isValidLastName()]"
          />
        </div>
      </div>

      <div class="pc-form-item" v-if="isTaxId">
        <div class="pc-form-label">{{ $t("form.taxId") }}</div>
        <div class="pc-form-input">
          <q-input
            outlined
            clearable
            :placeholder="$t('form.taxId_placeholder')"
            v-model="formDetail.taxId"
            :rules="[(_) => isValidCPF()]"
          />
        </div>
      </div>
    </div>

    <q-btn
      :loading="btnLoading"
      rounded
      flat
      no-caps
      class="style-btn-confirm"
      :disable="!(isValidFirstName() === true && isValidLastName() === true && isValidCPF() === true)"
      @click="submitKYCNewUser"
    >
      {{ $t("btn.submit") }}
    </q-btn>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { api } from "boot/axios";
import { useQuasar, copyToClipboard } from "quasar";
import { userStore } from "src/stores";
import { useRouter } from "vue-router";
import { t } from "src/boot/lang";

const emits = defineEmits(["test"]);
const qs = require("qs");
const $q = useQuasar();
const store = userStore();
const router = useRouter();
const btnLoading = ref(false);

const isValidFirstName = () => {
  const { firstName } = formDetail;
  const namePattern = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]$/;

  const result = !firstName
    ? t("form.firstName_rules_01")
    : !namePattern.test(firstName)
    ? t("form.firstName_rules_02")
    : true;
  return result;
};

const isValidLastName = () => {
  const { lastName } = formDetail;
  const namePattern = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]$/;

  const result = !lastName
    ? t("form.lastName_rules_01")
    : !namePattern.test(lastName)
    ? t("form.lastName_rules_02")
    : true;
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

  if (isRealName.value) {
    updateInfo.realName = `${formDetail.firstName},${formDetail.lastName}`;
  }

  updateInfo.taxId = `${formDetail.taxId}`;

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
      }
    })
    .catch(() => {})
    .then(() => {
      btnLoading.value = false;
    });
};

// const isValidCPF = () => {
//   const { taxId } = formDetail;

//   if (!taxId) {
//     return "Por favor, insira o número do CPF";
//   }

//   const phoneRegex = /^\d{11}$/;
//   const isValid = phoneRegex.test(taxId);

//   return isValid ? true : "O número do CPF deve ter 11 dígitos";
// };

const isValidCPF = () => {
  const { taxId } = formDetail;

  if (!taxId) {
    return "Por favor, insira o número do CPF";
  }

  const cleaned = taxId.replace(/\D/g, "");

  if (cleaned.length !== 11) {
    return "O número do CPF deve ter 11 dígitos";
  }

  if (!validateCPF(cleaned)) {
    return "Formato do número do CPF está incorreto.";
  }

  return true;
};

const validateCPF = (input_cpf) => {
  if (!input_cpf) return false;

  const cpf = input_cpf.toString().replace(/\D/g, "");

  if (cpf.length !== 11) return false;

  // 排除常见无效 CPF（所有数字都一样）
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const nums = cpf.split("").map(Number);

  // 第一个校验位
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += nums[i] * (10 - i);
  }
  let d1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  // 第二个校验位
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += nums[i] * (11 - i);
  }
  let d2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return d1 === nums[9] && d2 === nums[10];
};

const personalState = reactive({
  memberInfo: {}
});

const isRealName = ref(false);
const isTaxId = ref(false);

const loadInfo = () => {
  personalState.memberInfo = userStore();

  if (personalState.memberInfo.taxId === null) {
    isTaxId.value = true;
  }

  if (personalState.memberInfo.realName === null) {
    isRealName.value = true;
  }
};

onMounted(() => {
  loadInfo();
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
    margin-bottom: 6px;
  }
  .pc-form-label {
    color: rgba(255, 255, 255, 1);
  }
  .pc-form-input {
    border-radius: 5px;
    position: relative;

    :deep(.q-field__control) {
      // background: rgba(71, 178, 178, 0.16) !important;
      background: #131313;
      border-radius: 4px;
      &::before {
        border-style: solid;
        border-color: #35383f;
      }
    }

    :deep(.q-field__native) {
      color: #fff;
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
  background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
  font-weight: 700;
  color: #150025;
  border-radius: 8px;
}

.style-btn-confirm {
  background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
  font-weight: 700;
  width: 140px;
  height: 42px;
  color: #2d2d2d;
  border-radius: 8px;
}
</style>
