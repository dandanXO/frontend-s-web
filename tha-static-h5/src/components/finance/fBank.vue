<template>
  <div>
    <q-select
      filled
      class="q-mt-md"
      :label="$t('lang.bank')"
      color="white"
      v-model="selectedBankId"
      :options="bankList"
      option-value="id"
      option-label="name"
      :rules="verifyBank"
      @update:model-value="$event => selectBank()"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { doIt } from "boot/action";
import { cashier } from "boot/axios";
import { useQuasar } from "quasar";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
const $q = useQuasar();
const props = defineProps({
  bankList: {
    type: Array,
    required: true
  }
});
const emits = defineEmits(["selected", "successful"]);
const verifyBank = ref([
  (val) => (props.bankList && !!val) || t('lang.please_select_bank')
]);

const selectedBankId = ref();

function selectBank() {
  emits("selected", selectedBankId);
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
    paymentId: deposit.paymentId
  }
  if (deposit.privilegeId) {
    obj.privilegeId = deposit.privilegeId
  }
  await cashier.post("/session/payment/submit", qs.stringify(obj)).then((d) => {
    const res = d.data;
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

<style scoped lang="scss"></style>
