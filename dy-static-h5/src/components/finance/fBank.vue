<template>
  <div>
    <q-select
      class="q-mt-md bank-selection"
      filled
      dense
      ref="refSelectBank"
      v-model="selectedBankId"
      :options="bankList"
      option-value="id"
      option-label="name"
      :rules="verifyBank"
      @update:model-value="selectBank()"
    >
      <template v-slot:prepend>
        <span style="font-weight: bold; font-size: 15px">银行</span>
      </template>
      <template v-slot:selected>
        <span>{{ selectedBankId ? selectedBankId.name : "请选择银行" }}</span>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { ref } from "vue";
// import { postDeposit } from "@/api/personal/deposit";
// import { doIt } from "@/utils/action";
import { doIt } from "boot/action";
import { cashier } from "boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();
const props = defineProps({
  bankList: {
    type: Array,
    required: true
  }
});
const emits = defineEmits(["selected", "successful"]);
const verifyBank = ref([(val) => (props.bankList && !!val) || "请输入银行"]);

const refSelectBank = ref();
const selectedBankId = ref();

function selectBank() {
  // console.log(selectedBankId)
  emits("selected", selectedBankId.value);
}

async function validateBank(value) {
  refSelectBank.value.validate();
  if (value !== null && value !== "") {
    return true;
  } else {
    return false;
  }
}

const qs = require("qs");

async function submitDeposit(deposit) {
  const obj = {
    bankCardId: deposit.bankCardId,
    localAmount: deposit.localAmount,
    paymentId: deposit.paymentId,
    bankId: selectedBankId.value.id
  };

  if (deposit.privilegeId) {
    obj.privilegeId = deposit.privilegeId;
  }
  await cashier.post("/session/payment/submit", qs.stringify(obj)).then((res) => {
    if (res.code === 0) {
      doIt(res);
      emits("successful");
      return res;
    } else {
      // $q.notify({
      //   color: "negative",
      //   position: "top",
      //   message: res.message,
      //   icon: "report_problem"
      // });
    }
  });
}

defineExpose({ submitDeposit, validateBank });
</script>

<style scoped lang="scss">
.bank-selection {
  padding-bottom: 10px;

  :deep(.q-field__control) {
    min-height: 46px;
    height: 46px;
  }
  :deep(.q-field__native) {
    min-height: 46px;
    height: 46px;
  }
  :deep(.q-field__marginal) {
    min-height: 46px;
    height: 46px;
  }
}
</style>
