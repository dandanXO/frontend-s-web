<template>
  <div v-bind="$attrs">
    <div>
      <a-select
        v-model:value="selectedBankId"
        @change="selectBank"
        placeholder="Please select a bank"
      >
        <a-select-option
          v-for="bc in props.bankList"
          :key="bc.id"
          :value="bc.id"
        >
          {{ bc.name }}
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits, defineExpose } from "vue";
import { postDeposit } from "@/api/personal/deposit";
import { doIt } from "@/utils/action";
// import { message } from "ant-design-vue";

const props = defineProps({
  bankList: {
    type: Array,
    required: true,
  },
});
const emits = defineEmits(["selected"]);

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

async function submitDeposit(deposit) {
  await postDeposit(deposit)
    .then((d) => {
      if (d.code === 0) {
        doIt(d);
      }
      return d;
    })
    .catch((error) => {
      console.log(error.message);
    });
}

defineExpose({ submitDeposit, validateBank });
</script>

<style scoped lang="scss"></style>
