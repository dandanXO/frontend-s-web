<template>
  <q-dialog
    width="100%"
    :modelValue="modelValue"
    persistent
    @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" @click="emit('update:modelValue', false)" />
      <div class="popout-dialog-container" style="border-radius: 20px;">
        <div class="txt-title">{{ $t("form.exchangeTitle") }}</div>
        <div class="pc-form">
          <div class="pc-form-item">
            <InputField :label="$t('form.redemptionCode')">
              <template #input>
                <div class="pc-form-input">
                  <q-input
                    outlined
                    clearable
                    color="green"
                    ref="redemptionCodeRef"
                    :error="isInvalidCode"
                    :placeholder="$t('form.redemptionCode_placeholder')"
                    :rules="[(val) => (val && val.length > 0) || $t('form.redemptionCode_rule_01')]"
                    v-model="formDetail.redemptionCode"
                    @update:model-value="isInvalidCode = false"
                  />
                </div>

                <div class="error-invalid-text" v-if="isInvalidCode">
                  <p class="text-red error-text" v-if="errorCode === 57000">
                    {{ $t("form.redemptionFullyRedeemed") }}
                  </p>
                  <p class="text-red error-text" v-else-if="errorCode === 50001 || errorCode === 35001">
                    {{ $t("form.redemptionAlreadyRedeemed") }}
                  </p>
                  <p class="text-red error-text" v-else-if="errorCode === 57006">
                    {{ $t("form.redemptionInvalidCode") }}
                  </p>
                  <p class="text-red error-text" v-else>
                    {{ $t(`error.${errorCode}`) }}
                  </p>
                  <img
                    class="btn-icon"
                    @click="openWhatsApp()"
                    id="whatapp-icon"
                    src="../../assets/images/auth/whatsapp-icon.png"
                  />
                </div>
              </template>
            </InputField>
          </div>
        </div>
        <div class="error-text bonus-amt-txt">{{ $t('form.redemptionBonusAmount') }}: 9-9999</div>

        <q-btn
          :loading="btnLoading"
          rounded
          flat
          no-caps
          class="btn-primary btn-primary__full"
          @click="submitRedemption"
        >
          {{ $t("btn.confirm") }}
        </q-btn>

        <div class="error-invalid-text q-mt-lg" v-if="!isInvalidCode">
          <p class="error-text">
            {{ $t("form.redemptionBtmText") }}
          </p>
          <img
            class="btn-icon"
            @click="openWhatsApp()"
            id="whatapp-icon"
            src="../../assets/images/auth/whatsapp-icon.png"
          />
        </div>
        <div class="error-text" :style="isInvalidCode ? 'margin-top: 20px;' : 'margin-top: 0;'">
          {{ $t("form.followSteps") }}  
          <br />
          {{ $t("form.subscribeWhatsapp") }}  
          <br />
          {{ $t("form.enterBonusCode") }}  
          <br />
          {{ $t("form.redeemWithinValidity") }}  
          <br />
          {{ $t("form.wagerRequirement") }}  
          <br />
          {{ $t("form.redemptionFailure") }}  
          <br />
          {{ $t("form.accountOwnerOnly") }}  
          <br />
          {{ $t("form.unauthorizedMethods") }}
        </div>
      </div>
    </div>
  </q-dialog>
  <q-dialog width="100%" :modelValue="showRedeemedDialog">
    <div class="redeem-success-container">
      <div class="close-div">
        <q-btn dense rounded icon="close" class="popout-close" @click="closeRedeemSuccessDialog" />
      </div>

      <div class="redeem-success-content">
        <img class="redeem-success-img" src="../../assets/images/exchange/redeem_success.png" />
        <div class="redeem-amt">{{ convertToCommaAmount(redeemedAmt, true) }}Rs</div>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { useUI } from "stores/ui";
import { ref, toRefs } from "vue";
import InputField from "../../components/auth/InputField.vue";
import { api, eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";
import { convertToCommaAmount } from "src/boot/utils";

const props = defineProps(["modelValue"]);
const { modelValue } = toRefs(props);

const showRedeemedDialog = ref(false);
const redeemedAmt = ref(0);

//FOR TESTING.
// showRedeemedDialog.value = true;
// redeemedAmt.value = 188;

const emit = defineEmits(["update:modelValue"]);

const $q = useQuasar();
const ui = useUI();
const isInvalidCode = ref(false);
const btnLoading = ref(false);
const redemptionCodeRef = ref();
const formDetail = ref({
  redemptionCode: undefined
});

const errorCode = ref(0);

const submitRedemption = async () => {
  isInvalidCode.value = false;
  const isValid = await redemptionCodeRef.value.validate();
  if (!isValid) return;

  btnLoading.value = true;
  eventapi
    .post(`/session/promo-code-bonus/claimBonus?promoCode=${formDetail.value.redemptionCode}`)
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          type: "positive",
          position: "top",
          message: `Successfully claimed`,
          icon: "check_circle_outline"
        });
        formDetail.value.redemptionCode = undefined;
        emit("update:modelValue", false);
        showRedeemedDialog.value = true;
        redeemedAmt.value = res.data;
      } else {
        errorCode.value = res.code;
        isInvalidCode.value = true;
      }
    })
    .finally(() => (btnLoading.value = false));
};

const openWhatsApp = () => {
  window.open(ui.whatsappUrl, "_blank");
};

const closeRedeemSuccessDialog = () => {
  showRedeemedDialog.value = false;
};
</script>
<style lang="scss" scoped>
.error-text {
  font-size: 13px;
}
.bonus-amt-txt {
  width: 100%;
  margin-bottom: 20px;
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

.redeem-success-container {
  display: flex;
  flex-direction: column;
  .close-div {
    display: flex;
    justify-content: flex-end;
  }
  .redeem-success-content {
    position: relative;

    .redeem-success-img {
      width: 320px;
    }
    .redeem-amt {
      font-size: 28px;
      position: absolute;
      bottom: 115px;
      left: 58px;
    }
  }
}

#whatapp-icon {
  margin-left: 8px;
  width: 36px;
  height: 36px;
  animation: smallbeat 2s infinite;
}

.error-invalid-text {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

@keyframes smallbeat {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  14% {
    -webkit-transform: scale(1.2);
    transform: scale(1.3);
  }

  28% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  42% {
    -webkit-transform: scale(1.2);
    transform: scale(1.3);
  }
  70% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
