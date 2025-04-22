<template>
  <div>
    <q-select
      filled
      label="Bank"
      color="white"
      standout
      class="q-pb-xs dialog-input"
      hide-bottom-space
      v-model="selectedBankId"
      :options="bankList"
      option-value="id"
      option-label="name"
      :rules="verifyBank"
      @update:model-value="selectBank()"
    />
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
const verifyBank = ref([(val) => (props.bankList && !!val) || "Please enter bank"]);

const selectedBankId = ref();

function selectBank() {
  // console.log(selectedBankId)
  emits("selected", selectedBankId.value);
}

async function validateBank(value) {
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
.dialog-input {
  border-radius: 1.25rem;
  background: rgba(21, 0, 37, 0.5);
}
</style>
