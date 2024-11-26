<template>
  <q-dialog
    width="100%"
    :modelValue="modelValue"
    presistent
    @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" @click="emit('update:modelValue', false)" />
      <div class="popout-dialog-container">
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
                  />
                </div>

                <p class="text-red error-text" v-if="isInvalidCode">
                  {{ $t("form.redemptionInvalidCode") }}
                </p>
              </template>
            </InputField>
          </div>
        </div>

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
        <div class="redeem-amt">{{ convertToCommaAmount(redeemedAmt, true) }}</div>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { onActivated, onMounted, ref, toRefs } from "vue";
import InputField from "../../components/auth/InputField.vue";
import { api, eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";
import { convertToCommaAmount } from "src/boot/utils";

const props = defineProps(["modelValue"]);
const { modelValue } = toRefs(props);

const showRedeemedDialog = ref(false);
const redeemedAmt = ref(0);

const emit = defineEmits(["update:modelValue"]);

const $q = useQuasar();

const isInvalidCode = ref(false);
const btnLoading = ref(false);
const redemptionCodeRef = ref();
const formDetail = ref({
  redemptionCode: undefined
});

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
        isInvalidCode.value = true;
      }
    })
    .finally(() => (btnLoading.value = false));
};

const closeRedeemSuccessDialog = () => {
  showRedeemedDialog.value = false;
};
</script>
<style lang="scss" scoped>
.error-text {
  font-size: 13px;
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
      font-size: 32px;
      position: absolute;
      bottom: 126px;
      left: 58px;
    }
  }
}
</style>
