<template>
  <div class="popout-dialog-container">
    <div class="txt-title">{{ $t("form.pleaseCompleteKYC") }}</div>
    <div class="pc-form">
      <div class="pc-form-item">
        <div class="pc-form-label">{{ $t("form.firstName") }}</div>
        <div class="pc-form-input">
          <q-input
            filled
            dense
            clearable
            :placeholder="$t('form.firstName_placeholder')"
            v-model="formDetail.firstName"
            :rules="[(_) => isValidFirstName()]"
          />
        </div>
      </div>

      <div class="pc-form-item">
        <div class="pc-form-label">{{ $t("form.lastName") }}</div>
        <div class="pc-form-input">
          <q-input
            filled
            dense
            clearable
            :placeholder="$t('form.lastName_placeholder')"
            v-model="formDetail.lastName"
            :rules="[(_) => isValidLastName()]"
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
      :disable="!(isValidFirstName() === true && isValidLastName() === true)"
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
  updateInfo.realName = `${formDetail.firstName},${formDetail.lastName}`;

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
  background: linear-gradient(180deg, #00B9A1 0%, #0097B9 100%);
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
</style>
