<template>
  <div></div>
</template>

<script setup>
// import { postDeposit } from "@/api/personal/deposit";
// import { doIt } from "@/utils/action";
import { defineExpose } from "vue";

async function submitDeposit(deposit) {
  await postDeposit(deposit).then((d) => {
    if (d.code === 0) {
      doIt(d);
    } else {
      console.log(d.message);
    }
    return d;
  });
}

defineExpose({ submitDeposit });
</script>

<style lang="scss" scoped></style>
