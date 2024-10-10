<template>
  <div v-bind="$attrs">
    <div>
      <el-select
        v-model="selectedBankId"
        @change="selectBank"
        :placeholder="$t('deposit.selectBank')"
      >
        <el-option
          v-for="bc in props.bankList"
          :key="bc.id"
          :label="bc.name"
          :value="bc.id"
        >
          {{ bc.name }}
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { postDeposit } from "@/api/personal/deposit";
import { doIt } from "@/utils/action";

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
      // message.error(error.message);
    });
}

defineExpose({ submitDeposit, validateBank });
</script>

<style scoped lang="scss"></style>
