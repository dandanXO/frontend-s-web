<template>
  <q-dialog
    width="100%"
    :modelValue="modelValue"
    persistent
    @update:modelValue="(value) => emit('update:modelValue', value)"
    class="flex-end"
  >
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" @click="emit('update:modelValue', false)" />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.transferTitle") }}</div>
        <div class="pc-form">
          <div class="pc-form-item">
            <InputField v-if="!upline" :label="$t('form.downlineId')">
              <template #input>
                <div class="pc-form-input">
                  <q-input
                    outlined
                    clearable
                    color="green"
                    ref="downlineRef"
                    :placeholder="$t('form.downlineId_placeholder')"
                    :rules="[(val) => (val && val.length > 0) || $t('form.downlineId_rule_01')]"
                    v-model="formDetail.downlineId"
                  />
                </div>
              </template>
            </InputField>
            <template v-else>
              <div class="hidden">
                <InputField :label="$t('form.uplineId')">
                  <template #input>
                    <div class="pc-form-input">
                      <q-input
                        outlined
                        clearable
                        color="green"
                        ref="uplineRef"
                        :placeholder="$t('form.uplineId_placeholder')"
                        :rules="[(val) => (val && val.length > 0) || $t('form.uplineId_rule_01')]"
                        v-model="formDetail.uplineId"
                        readonly
                      />
                    </div>
                  </template>
                </InputField>
              </div>
              <InputField :label="$t('form.uplineId')">
                <template #input>
                  <div class="pc-form-input">
                    <q-input outlined clearable color="green" v-model="uplineNameRef" readonly />
                  </div>
                </template>
              </InputField>
            </template>

            <InputField :label="$t('form.amount')">
              <template #input>
                <div class="pc-form-input">
                  <q-input
                    outlined
                    clearable
                    color="green"
                    ref="amountRef"
                    :placeholder="$t('form.amount_placeholder')"
                    :rules="[(val) => (val && val.length > 0) || $t('form.amount_rule_01')]"
                    v-model="formDetail.transferAmount"
                  >
                    <template v-slot:append>
                      <a style="color: #00b900" @click="updateTransferAmount">{{ $t("form.all") }}</a>
                    </template>
                  </q-input>
                </div>
              </template>
            </InputField>
            <span class="full-balance">{{ store.balance.toFixed(2) }}</span>
          </div>
        </div>

        <q-btn :loading="btnLoading" rounded flat no-caps class="btn-primary btn-primary__full" @click="submitTransfer">
          {{ $t("btn.transfer") }}
        </q-btn>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { useUI } from "stores/ui";
import { ref, onMounted, watch, toRefs } from "vue";
import InputField from "../../components/auth/InputField.vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "stores/index";
import { convertToCommaAmount } from "src/boot/utils";

const props = defineProps(["modelValue", "upline", "downlineId", "uplineId", "uplineName"]);
const { modelValue, upline, downlineId, uplineId } = toRefs(props);

const emit = defineEmits(["update:modelValue"]);

const store = userStore();
const $q = useQuasar();
const qs = require("qs");
const ui = useUI();
const btnLoading = ref(false);
const uplineRef = ref();
const uplineNameRef = ref();
const downlineRef = ref();
const amountRef = ref();
const formDetail = ref({
  downlineId: undefined,
  uplineId: undefined,
  transferAmount: 0
});

const errorCode = ref(0);
const updateTransferAmount = () => {
  formDetail.value.transferAmount = store.balance.toFixed(2);
};
const submitTransfer = async () => {
  const isUplineValid = uplineRef.value ? await uplineRef.value.validate() : true;
  const isDownlineValid = downlineRef.value ? await downlineRef.value.validate() : true;
  const isAmountValid = amountRef.value ? await amountRef.value.validate() : false; // Amount validation must always pass

  if (!isAmountValid) return;

  btnLoading.value = true;

  try {
    let apiUrl = "";
    let obj = {
      transferAmount: formDetail.value.transferAmount,
      siteId: process.env.SITEID,
      rollover: 1
    };

    if (!upline.value) {
      apiUrl = `/session/downlines/transfer`;
      obj.memberId = formDetail.value.downlineId;
    } else if (!isDownlineValid) {
      apiUrl = `/session/upline/transfer`;
      obj.memberId = formDetail.value.uplineId;
    } else {
      apiUrl = `/session/upline/transfer`;
      obj.memberId = formDetail.value.uplineId;
    }

    const res = await api.post(apiUrl, qs.stringify(obj));

    if (res.code === 0) {
      $q.notify({
        type: "positive",
        position: "top",
        message: `Successfully transferred`,
        icon: "check_circle_outline"
      });

      // formDetail.value.uplineId = undefined;
      // formDetail.value.downlineId = undefined;
      formDetail.value.transferAmount = 0;
      store.getBalance();
      emit("update:modelValue", false);
    }
  } catch (error) {
    console.error("Transfer failed:", error);
  } finally {
    btnLoading.value = false;
  }
};
onMounted(() => {
  console.log(props);
  formDetail.value.downlineId = props.downlineId;
  formDetail.value.uplineId = props.uplineId;
  uplineNameRef.value = props.uplineName;
});
// Watch for changes in props and update formDetail
watch([downlineId, uplineId], ([newDownlineId, newUplineId]) => {
  formDetail.value.downlineId = newDownlineId;
  formDetail.value.uplineId = newUplineId;
  uplineNameRef.value = props.uplineName;
});
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
.full-balance {
  text-align: right;
  margin-top: -20px;
  margin-bottom: 10px;
  color: #5f6061;
}
</style>
